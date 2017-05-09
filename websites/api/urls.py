from django.conf.urls import url, include
from api import views

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

urlpatterns = [
    url(r'^hots/$', views.hots, name="get-hosts"),
    url(r'^games/$', views.games, name="get-games"),
    url(r'^games/(?P<game_id>[0-9]+)/detail/$', views.game_detail, name="get-game-detail"),
    url(r'^entertainments/(?P<id_or_key_query>[\w\+%_&]+)/detail/$', views.entertainment_detail, name="get-entertaiments-detail"),
    url(r'^events/$', views.events, name="get-events"),
    url(r'^events/latest/$', views.events_latest, name="get-events-latest"),
    url(r'^events/(?P<event_id>[0-9]+)/detail/$', views.event_detail, name="get-events-detail"),
    url(r'^posts/$', views.posts, name="get-posts"),
    url(r'^posts/(?P<id_or_key_query>[\w\+%_&]+)/detail/$', views.post_detail, name="get-posts-detail"),
    url(r'^promotions/$', views.promotions, name="get-promotions"),
    url(r'^promotions/(?P<promotion_id>[0-9]+)/detail/$', views.promotion_detail, name="get-promotions-detail"),
    url(r'^transaction/filter/$', views.transactions_type, name="get-transactions-filter"),
    url(r'^faqs/$', views.faqs),

    url(r'^accounts/login/$', obtain_jwt_token, name="accounts-login"),
    # Social Login : alias name url is : login_social_jwt_user and url is : api/login/social/jwt_user/
    url(r'^login/', include('rest_social_auth.urls_jwt')),
    # url(r'^api-token-verify/', verify_jwt_token),

]
