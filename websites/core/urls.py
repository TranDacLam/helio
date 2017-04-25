from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^power-card/$', views.power_card, name='power_card'),
    url(r'^promotions/$', views.promotions, name='promotions'),
    url(r'^faqs/$', views.faqs, name='faqs'),
    url(r'^events/$', views.events, name='events'),
    url(r'^helio-play/$', views.helio_play, name='helio_play'),
    url(r'^helio-kids/$', views.helio_kids, name='helio_kids'),
    url(r'^night-life/$', views.night_life, name='night_life'),
    url(r'^contact/$', views.contact, name='contact'),
    url(r'news/$', views.news, name='news'),
    url(r'careers/$', views.careers, name='careers'),


    url(r'^get-posts/$', views.get_posts, name='get_posts'),
    
    url(r'^helio-play/game-detail$', views.game_detail, name='game_detail'),
    url(r'^combo-product/$', views.combo_product, name='combo_product'),
    url(r'^events/event-content/$', views.event_content, name='event_content'),
    
    url(r'^power-card/$', views.power_card, name='power_card'),
    url(r'^membership/$', views.membership, name='membership'),
    url(r'^trai-nghiem/$', views.trainghiem, name='trainghiem'),
    url(r'^trai-nghiem/chi-tiet/$', views.tn_chi_tiet, name='chi_tiet'),
    url(r'^khuyen-mai/chi-tiet/$', views.km_chi_tiet, name='chi_tiet'),

    url(r'^helio-introduction/$', views.helio_introduction, name='helio_introduction'),
    url(r'^helio-term-condition/$', views.helio_term_condition, name='helio_term_condition'),

]
