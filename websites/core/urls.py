from django.conf.urls import url, include
import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^power-card/$', views.power_card, name='power_card'),
    url(r'^promotions/$', views.promotions, name='promotions'),
    url(r'^promotions/(?P<promotion_id>[0-9]+)/detail/$', views.promotion_detail, name='promotion_detail'),
    url(r'^faqs/$', views.faqs, name='faqs'),
    url(r'^events/$', views.events, name='events'),
    url(r'^events/(?P<event_id>[0-9]+)/detail/$', views.event_detail, name='event_detail'),
    url(r'^helio-play/$', views.helio_play, name='helio_play'),
    url(r'^helio-kids/$', views.helio_kids, name='helio_kids'),
    url(r'^night-life/$', views.night_life, name='night_life'),
    url(r'^contact/$', views.contact, name='contact'),
    url(r'^news/$', views.news, name='news'),
    url(r'^news/(?P<new_id>[0-9]+)/detail/$', views.new_detail, name='new_detail'),
    url(r'^careers/$', views.careers, name='careers'),
    url(r'^careers/(?P<career_id>[0-9]+)/detail/$', views.career_detail, name='career_detail'),
    url(r'^experience/$', views.experience, name='experience'),
    url(r'^experience/(?P<experience_id>[0-9]+)/detail/$', views.experience_detail, name='experience_detail'),
    # url(r'^experience/experience-detail/$', views.experience_detail, name='experience_detail'),
   
    url(r'^power-card/$', views.power_card, name='power_card'),

    url(r'^helio-introduction/$', views.helio_introduction, name='helio_introduction'),
    url(r'^term-condition/$', views.term_condition, name='term_condition'),
    url(r'^coffee_bakery/$', views.coffee_bakery, name='coffee_bakery'),
    url(r'^other-product/$', views.other_product, name='other_product'),
    url(r'^redemption-store/$', views.redemption_store, name='redemption_store'),

    url(r'^policy/$', views.policy, name='policy'),
    
]
