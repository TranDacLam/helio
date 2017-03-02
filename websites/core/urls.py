from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'get-posts/$', views.get_posts, name='get_posts'),
    url(r'helio-play/$', views.helio_play, name='helio_play'),
]
