import json
import traceback
import uuid
from django.shortcuts import render
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.forms import model_to_dict
from Users.models import CustomUser, MaskNumber, UserNumberMapping
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.utils import IntegrityError
from Users.utils import get_redis_con, handle_count
from django.conf import settings
import random


def sign_up(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            email = data.get("email")
            first_name = data.get("firstName")
            last_name = data.get("lastName")
            password = make_password(data.get("password"))
            phone = data.get("phone")
            display_name = data.get("display_name")
            user = CustomUser(
                first_name=first_name,
                last_name=last_name,
                username=email,
                email=email,
                mobile_number=phone,
                password=password,
                display_name=display_name,
                qr_uuid=str(uuid.uuid4())
            )
            user.save()
            user_dict = model_to_dict(user)
            number = MaskNumber.objects.order_by('?').first()
            num_mapping = UserNumberMapping(user=user, cli=number)
            num_mapping.save()
            return JsonResponse({"message": "User created successfully!"})
    except IntegrityError:
        return JsonResponse({"message": "User already exists!"}, status=400)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"message": "Something went worng please try again", "error": str(e)}, status=400)
    return JsonResponse({"message": "Method not allowed!"}, status=405)
    # return HttpResponse('<a href="tel:+496170961709">Click to call</a>')


# On QR code scan
def scanner_view(request):
    try:
        if request.method == "GET":
            data = request.GET
            uuid_param = data.get("uuid")
            handle_count(CustomUser.objects.filter(qr_uuid=uuid_param).first(), "scanned")
            output = create_scan(uuid_param)
            if not output:
                return JsonResponse({"error": "No mapping found"}, status=400)
            return JsonResponse(output)
    except:
        return JsonResponse({"message": "Something went wrong"}, status=400)
    return JsonResponse({"message": "Method not allowed"}, status=405)


def create_scan(uuid):
    cache = get_redis_con()
    number_details_dict = {'mask_number': None, 'customer_number': None, 'display_name': None}
    if uuid:
        fetch_mask_number(uuid, number_details_dict, cache)
        if number_details_dict['mask_number'] and str(number_details_dict['mask_number']) != '0':
            digit_gen = f'{random.randrange(1, 10 ** 10):03}'
            cache.hset(digit_gen, number_details_dict['mask_number'], number_details_dict['customer_number'])
            cache.expire(digit_gen, settings.CACHE_MID_TIMEOUT)
            output = "{},{}".format(number_details_dict['mask_number'], digit_gen)
            temp_return = dict()
            temp_return['data'] = output
            temp_return['display_name'] = number_details_dict['display_name']
            return temp_return
    return None


def fetch_mask_number(uuid, number_details_dict, cache=None):
    if not cache:
        cache = get_redis_con()
    lock = cache.setnx('{}'.format(uuid), 1)
    if not lock:
        return
    cache.expire('{}'.format(uuid), settings.CACHE_TINY_TIMEOUT)
    if not cache.exists('{}:mask_number'.format(uuid)):
        fetch_number_db(uuid, cache)
    temp_data = cache.hrandfield('{}:mask_number'.format(uuid))
    temp_data_list = temp_data.decode().split(':')
    number_details_dict['mask_number'] = str(temp_data_list[0])
    number_details_dict['customer_number'] = str(temp_data_list[1])
    number_details_dict['display_name'] = str(temp_data_list[2])


def fetch_number_db(uuid, cache=None):
    if not cache:
        cache = get_redis_con()
    number_list = UserNumberMapping.objects.filter(user__qr_uuid=uuid).select_related("user", "cli").values_list(
        "user__mobile_number", "cli__cli", "user__display_name")
    if number_list:
        temp_dict = {}
        for customer_number, mask_number, display_name in number_list:
            temp_dict["{}:{}:{}".format(mask_number, customer_number, display_name)] = 1
        cache.hmset('{}:mask_number'.format(uuid), temp_dict)
        cache.expire('{}:mask_number'.format(uuid), settings.CACHE_BIG_TIMEOUT)
    else:
        cache.hset('{}:mask_number'.format(uuid), "0:0:0", "1")
        cache.expire('{}:mask_number'.format(uuid), settings.CACHE_MID_TIMEOUT)


# When call is in IVR
def caller_view(request):
    if request.method == "GET":
        data = request.GET
        mask_number = data.get("mask_number")
        caller_number = data.get("caller_number")
        digit_gen = data.get("digit_gen")
        cache = get_redis_con()
        if not digit_gen or str(digit_gen) in ['None']:
            # User is calling back
            x = cache.get('{}:{}'.format(mask_number, caller_number))
            if not x:
                return JsonResponse({"error": "-1"}, status=400)
            return JsonResponse({"data": x.decode()})
        elif digit_gen:
            x = cache.hget(digit_gen, mask_number)
            if x:
                cache.setex('{}:{}'.format(mask_number, x.decode()), settings.CACHE_BIG_TIMEOUT, caller_number)
                handle_count(CustomUser.objects.filter(mobile_number=x.decode()).first(), "called")
                return JsonResponse({"data": x.decode()})
        return JsonResponse({"error": "error while fetching data"}, status=400)


class ProfileView(APIView):
    authentication_class = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_dict = model_to_dict(user)
        del user_dict["password"]
        return Response({"data": user_dict})
