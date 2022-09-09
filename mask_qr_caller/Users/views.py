import json
import traceback
from django.shortcuts import render
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.forms import model_to_dict
from Users.models import CustomUser


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
                display_name=display_name
            )
            user.save()
            user_dict = model_to_dict(user)
            return JsonResponse({"message": "User created successfully!"})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"message": "Something went worng please try again", "error": str(e)}, status=400)        
    return JsonResponse({"message": "Method not allowed!"}, status=401)
    #return HttpResponse('<a href="tel:+496170961709">Click to call</a>')