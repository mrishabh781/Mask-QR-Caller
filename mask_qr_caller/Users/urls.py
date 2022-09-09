from django.urls import include, path
from Users.views import *

urlpatterns = [
    path('signup/', sign_up),
    path('profile/', ProfileView.as_view()),
    path('scanner/', scanner_view),
    path('caller/', caller_view),
]