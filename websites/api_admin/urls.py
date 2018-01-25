from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [
	url(r'^get_all_promotion/$', views.get_all_promotion, name="get-all-promotion"),
	url(r'^user_promotion/$', views.user_promotion, name="user-promotion"),
	
]