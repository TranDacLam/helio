from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^power-card/$', views.power_card, name='power_card'),
    url(r'^promotions/$', views.promotions, name='promotions'),
    url(r'^faq/$', views.FAQ, name='FAQ'),
    url(r'^events/$', views.events, name='events'),
    url(r'^helio-night-life/$', views.helio_night_life, name='helio_night_life'),

    

    url(r'^get-posts/$', views.get_posts, name='get_posts'),
    url(r'^helio-play/$', views.helio_play, name='helio_play'),




    url(r'^helio-play-v2/$', views.helio_play_v2, name='helio_play_v2'),
    url(r'^helio-play/game-detail$', views.game_detail, name='game_detail'),
    url(r'^combo-product/$', views.combo_product, name='combo_product'),
    url(r'^events/event-content/$', views.event_content, name='event_content'),
    
    url(r'^power-card/$', views.power_card, name='power_card'),
    url(r'^membership/$', views.membership, name='membership'),
    url(r'^trai-nghiem/$', views.trainghiem, name='trainghiem'),
    url(r'^trai-nghiem/chi-tiet/$', views.tn_chi_tiet, name='chi_tiet'),
    url(r'^khuyen-mai/chi-tiet/$', views.km_chi_tiet, name='chi_tiet'),
    url(r'^lien-he/$', views.lienhe, name='lienhe'),
    url(r'^helio-night-life/$', views.helio_night_life, name='helio_night_life'),
    # url(r'news/$', views.news, name='news'),

]
