from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'get-posts/$', views.get_posts, name='get_posts'),
]
