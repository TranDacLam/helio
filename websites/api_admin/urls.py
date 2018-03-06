from django.conf.urls import url, include
from api_admin import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [

	url(r'^promotion_list/$', views.PromotionList.as_view(), name="promotion-list"),
	url(r'^promotion/(?P<id>[0-9]+)/$', views.PromotionDetail.as_view(), name="promotion"),
	url(r'^promotion/$', views.PromotionDetail.as_view(), name="promotion-add"),

	url(r'^user_promotion/(?P<id>[0-9]+)/$', views.PromotionUser.as_view(), name="user-promotion"),
	
	url(r'^user/$', views.UserDetail.as_view(), name="user"),
	url(r'^user/(?P<id>[0-9]+)/$', views.UserDetail.as_view(), name="user-detail"),
	url(r'^user_embed/$', views.UserEmbedDetail.as_view(), name="user-embed"),
	url(r'^user_embed/(?P<barcode>[0-9]+)/$', views.UserEmbedDetail.as_view(), name="user-embed-detail"),
	url(r'^relate/$', views.RelateAPI.as_view(), name="relate-user"),
	url(r'^delete_relate/(?P<id>[0-9]+)/$', views.RelateAPI.as_view(), name="delete-relate-user"),
	url(r'^user_link_card', views.UserLinkCardList.as_view(), name="user-link-card"),

	url(r'^summary/$', views.SummaryAPI.as_view(), name="summary"),

	url(r'^advertisement/$', views.AdvertisementView.as_view(), name="advertisement"),
	url(r'^advertisement/(?P<pk>[0-9]+)/$', views.AdvertisementDetail.as_view(), name="advertisement-detail"),


	url(r'^notification_list/$', views.NotificationList.as_view(), name="notification-list"),
	url(r'^notification/(?P<id>[0-9]+)/$', views.NotificationDetail.as_view(), name="notification"),
	url(r'^notification/$', views.NotificationDetail.as_view(), name="notification"),
	
	url(r'^user_notification/(?P<id>[0-9]+)/$', views.NotificationUser.as_view(), name="user-promotion"),

	url(r'^promotion-type/$', views.PromotionTypeView.as_view(), name="promotion-type"),

	url(r'^denomination/$', views.DenominationView.as_view(), name="denomination"),

	url(r'^fee/$', views.FeeAPI.as_view(), name="fees"),
	url(r'^fee/(?P<id>[0-9]+)/$', views.FeeAPI.as_view(), name="fee-update"),
	url(r'^apply_fee/(?P<id>[0-9]+)/$', views.FeeAPI.as_view(), name="fee-apply"),

	url(r'^feedback/$', views.FeedbackView.as_view(), name="feedback"),
	url(r'^feedback/(?P<pk>[0-9]+)/$', views.FeedbackDetailView.as_view(), name="feedback-detail"),
	url(r'^category_notifications/$', views.CategoryNotifications.as_view(), name="category-notifications"),
	url(r'^fee_list/$', views.FeeListAPI.as_view(), name="fees"),
	
	url(r'^event/$', views.EventAPI.as_view(), name="event"),
	url(r'^event/(?P<id>[0-9]+)/$', views.EventAPI.as_view(), name="event-detail"),
	url(r'^event_list/$', views.EventListAPI.as_view(), name="event-list"),

	url(r'^banner/$', views.BannerView.as_view(), name="banner"),
	url(r'^banner/(?P<pk>[0-9]+)/$', views.BannerViewDetail.as_view(), name="banner-detail"),

	url(r'^promotion_label/$', views.PromotionLabelAPI.as_view(), name="promotion-label"),
	url(r'^promotion_label/(?P<id>[0-9]+)/$', views.PromotionLabelAPI.as_view(), name="promotion-label-detail"),
	url(r'^promotion_label_list/$', views.PromotionLabelListAPI.as_view(), name="promotion-label-list"),
	
	url(r'^hot/$', views.HotAPI.as_view(), name="hot"),
	url(r'^hot/(?P<id>[0-9]+)/$', views.HotAPI.as_view(), name="hot-detail"),
	url(r'^hot_list/$', views.HotListAPI.as_view(), name="hot-list"),

	url(r'^post/$', views.PostAPI.as_view(), name="post"),
	url(r'^post/(?P<id>[0-9]+)/$', views.PostAPI.as_view(), name="post-detail"),
	url(r'^post_list/$', views.PostListAPI.as_view(), name="post-list"),
	url(r'^post_type_list/$', views.PostTypeListAPI.as_view(), name="post-type-list"),

	url(r'^faq/$', views.FAQAPI.as_view(), name="faq"),
	url(r'^faq/(?P<id>[0-9]+)/$', views.FAQAPI.as_view(), name="faq-detail"),
	url(r'^faq_list/$', views.FAQListAPI.as_view(), name="faq-list"),
	url(r'^generator_QR_code/(?P<id>[0-9]+)/$', views.GeneratorQRCode.as_view(), name="generator-QR-code"),
	url(r'^category_list/$', views.CategoryList.as_view(), name="category-list"),

	url(r'^users/$', views.UserListView.as_view(), name="users"),
	url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetailView.as_view(), name="users_detail"),
	
	url(r'^upload_file/$', views.postUpload, name="upload-file"),

]