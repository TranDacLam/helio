from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [
	url(r'^hots_admin/$', views.hots, name="get-hosts-admin"),
	url(r'^user/$', views.UserDetail.as_view(), name="user"),
	url(r'^user/(?P<id>[0-9]+)/$', views.UserDetail.as_view(), name="user-detail"),

]