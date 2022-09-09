from django.urls import include, path
from Users.views import *

urlpatterns = [
    path('signup/', sign_up),
    path('profile/', ProfileView.as_view())
]