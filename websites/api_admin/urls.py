from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [

	url(r'^promotion/$', views.PromotionView.as_view(), name="promotion"),
	url(r'^user_promotion/$', views.PromotionUserView.as_view(), name="user-promotion"),
	
	url(r'^user/$', views.UserDetail.as_view(), name="user"),
	url(r'^user/(?P<id>[0-9]+)/$', views.UserDetail.as_view(), name="user-detail"),
	url(r'^user_embed/$', views.UserEmbedDetail.as_view(), name="user-embed"),
	url(r'^user_embed/(?P<id>[0-9]+)/$', views.UserEmbedDetail.as_view(), name="user-embed-detail"),

	url(r'^summary/status/$', views.SummaryAPI.as_view(), name="summary-status"),
	url(r'^summary/rate/$', views.SummaryAPI.as_view(), name="summary-rate"),


	url(r'^notification/$', views.NotificationView.as_view(), name="notification"),
	url(r'^user_notification/$', views.PromotionUserView.as_view(), name="user-promotion"),
]