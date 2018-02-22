from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [

	url(r'^promotion_list/$', views.PromotionList.as_view(), name="promotion-list"),
	url(r'^promotions/(?P<id>[0-9]+)/$', views.PromotionDetail.as_view(), name="promotion"),
	url(r'^promotions/$', views.PromotionDetail.as_view(), name="promotion-add"),

	url(r'^user_promotion/(?P<id>[0-9]+)/$', views.PromotionUser.as_view(), name="user-promotion"),
	
	url(r'^user/$', views.UserDetail.as_view(), name="user"),
	url(r'^user/(?P<id>[0-9]+)/$', views.UserDetail.as_view(), name="user-detail"),
	url(r'^user_embed/$', views.UserEmbedDetail.as_view(), name="user-embed"),
	url(r'^user_embed/(?P<barcode>[0-9]+)/$', views.UserEmbedDetail.as_view(), name="user-embed-detail"),
	url(r'^relate/$', views.RelateAPI.as_view(), name="relate-user"),
	url(r'^delete_relate/(?P<id>[0-9]+)/$', views.RelateAPI.as_view(), name="delete-relate-user"),
	url(r'^user_link_card', views.UserLinkCardList.as_view(), name="user-link-card"),

	url(r'^summary/$', views.SummaryAPI.as_view(), name="summary"),


	url(r'^promotion_label/$', views.PromotionLabel.as_view(), name="promotion_label"),

	url(r'^advertisement/$', views.AdvertisementView.as_view(), name="advertisement"),
	url(r'^advertisement/(?P<pk>[0-9]+)/$', views.AdvertisementDetail.as_view(), name="advertisement-detail"),


	url(r'^notification_list/$', views.NotificationList.as_view(), name="notification-list"),
	url(r'^notification/(?P<id>[0-9]+)/$', views.NotificationDetail.as_view(), name="notification"),
	url(r'^notification/$', views.NotificationDetail.as_view(), name="notification"),
	
	url(r'^user_notification/(?P<id>[0-9]+)/$', views.NotificationUser.as_view(), name="user-promotion"),

	url(r'^promotion-type/$', views.PromotionTypeView.as_view(), name="promotion-type"),

	url(r'^denomination/$', views.DenominationView.as_view(), name="denomination"),

	url(r'^fees/$', views.FeeAPI.as_view(), name="fees"),
	url(r'^feedback/$', views.FeedbackView.as_view(), name="feedback"),
	url(r'^feedback/(?P<pk>[0-9]+)/$', views.FeedbackDetailView.as_view(), name="feedback-detail"),
	url(r'^category_notifications/$', views.CategoryNotifications.as_view(), name="category-notifications"),


]