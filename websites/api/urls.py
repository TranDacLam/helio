from django.conf.urls import url, include
from api import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [
    url(r'^hots/$', views.hots),
    url(r'^game/filter/$', views.game_filter),
    url(r'^games/$', views.games),
    url(r'^game/(?P<game_id>[0-9]+)/detail/$', views.game_detail),
    url(r'^faqs/$', views.faqs),
    url(r'^entertainments/$', views.entertainments),
    url(r'^entertainments/(?P<entertainment_id>[0-9]+)/detail/$', views.entertainment_detail),
    url(r'^event/filter/$', views.event_filter),
    url(r'^events/$', views.events),
    url(r'^posts/$', views.posts),

    url(r'^accounts/login/$', obtain_jwt_token),
    # url(r'^api-token-verify/', verify_jwt_token),

]
