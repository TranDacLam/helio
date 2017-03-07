from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'get-posts/$', views.get_posts, name='get_posts'),
    url(r'helio-play/$', views.helio_play, name='helio_play'),
    url(r'events/$', views.events, name='events'),
    url(r'faq/$', views.FAQ, name='FAQ'),
    url(r'power-card/$', views.power_card, name='power_card'),
    url(r'membership/$', views.membership, name='pmembership'),
    # url(r'news/$', views.news, name='pmembership'),
]
