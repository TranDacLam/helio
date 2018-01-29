from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [

	url(r'^promotion/$', views.PromotionView.as_view(), name="promotion"),
	url(r'^user_promotion/$', views.PromotionUserView.as_view(), name="user-promotion"),
	
	url(r'^user/$', views.UserDetail.as_view(), name="get-hosts-admin"),
	url(r'^user/(?P<id>[0-9]+)/$', views.UserDetail.as_view(), name="get-hosts-admin"),

	url(r'^promotion_label/$', views.PromotionLabel.as_view(), name="promotion_label"),

	url(r'^advertisement/$', views.AdvertisementView.as_view(), name="advertisement"),
	url(r'^advertisement/(?P<pk>[0-9]+)/$', views.AdvertisementDetail.as_view(), name="advertisement-detail"),


	url(r'^notification/$', views.NotificationView.as_view(), name="notification"),
	url(r'^user_notification/$', views.PromotionUserView.as_view(), name="user-promotion"),

]