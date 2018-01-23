from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [
	url(r'^hots_admin/$', views.hots, name="get-hosts-admin"),
]