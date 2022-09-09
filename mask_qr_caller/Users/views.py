import json
import traceback
import uuid
from django.shortcuts import render
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.forms import model_to_dict
from Users.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.utils import IntegrityError
from Users.utils import get_redis_con

# Create your views here.

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
                qr_uuid = str(uuid.uuid4())
            )
            user.save()
            user_dict = model_to_dict(user)
            return JsonResponse({"message": "User created successfully!"})
    except IntegrityError:
        return JsonResponse({"message": "User already exists!"}, status=400)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"message": "Something went worng please try again", "error": str(e)}, status=400)        
    return JsonResponse({"message": "Method not allowed!"}, status=405)
    #return HttpResponse('<a href="tel:+496170961709">Click to call</a>')


def scanner_view(request):
    try:
        if request.method == "GET":
            data = request.GET
            uuid_param = data.get("uuid")
            return JsonResponse({"data": uuid_param})
    except:
        return JsonResponse({"message": "Something went wrong"}, status=400)
    return JsonResponse({"message": "Method not allowed"}, status=405)


class ProfileView(APIView):
    authentication_class = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_dict = model_to_dict(user)
        del user_dict["password"]
        return Response({"data": user_dict})

