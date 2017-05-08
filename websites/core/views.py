from django.shortcuts import render
from models import *
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import ast
from django.http import JsonResponse
import constant as const
import time
from django.core.paginator import Paginator

# TOTO FIX : try catch all fucntion

def home(request):
    result = {}

    # banners on home page
    banners = Banner.objects.filter(is_show=True).order_by('position')
    banners_map = {}
    if banners:
        for item in banners:
            banners_map[item.position] = item
    result["banners"] = banners_map

    # hots
    hots = Hot.objects.filter(is_show=True).order_by('modified')[:4]
    result["hots"] = hots

    # game section
    result["play_types"] = Type.objects.filter(category_id=const.HELIO_PLAY_CATEGORY)
    result["kids_types"] = Type.objects.filter(category_id=const.HELIO_KIDS_CATEGORY)

    # game categorys
    events = Event.objects.all()[:2]
    result["events"] = events

    return render(request, 'websites/home.html', {"result":result})

def power_card(request):
    print "***START Power Card Introduction PAGE***"
    result = {}

    # Powercard info
    powercard_type = Post_Type.objects.get(pk=const.POWERCARD_POST_TYPE_ID)
    result["powercard_type"] = powercard_type

    # Powercard list
    # TODO FIX : post_type = powercard_type
    powercards = Post.objects.filter(post_type_id=const.POWERCARD_POST_TYPE_ID)
    result["powercards"] = powercards

    faqs = FAQ.objects.filter(category_id=const.POWERCARD_CATEGORY)
    result["faqs"] = faqs

    return render(request, 'websites/power_card.html', {"result":result})

def faqs(request):
    print "***START FAQs PAGE***"
    result = {}

    faqs_categorys = Category.objects.filter(pk__in=(const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY, const.REDEMPTION_STORE_CATEGORY, const.OTHER_PRODUCT_CATEGORY))

    datas = {}
    if faqs_categorys:
        for faqs_category in faqs_categorys:
            datas[faqs_category] = faqs_category.faq_category_rel.all()

    result["datas"] = datas
    print datas
    
    return render(request, 'websites/faqs.html', {"result":result})

def contact(request):
    print "***START CONTACT CONTENT PAGE***"
    
    return render(request, 'websites/contact.html')


def helio_kids(request):
    print "***START HELIO KIDS PAGE***"
    result = {}
    #Get page info
    page_info = Category.objects.get(pk=const.HELIO_KIDS_CATEGORY)
    result["page_info"] = page_info

    # Game type
    if page_info:
        datas = {}
        kids_types = page_info.game_category_rel.all()
        promotions = {}
        if kids_types:
            for item in kids_types:
                data = {}
                data["games"] = item.game_type_rel.all()
                data["promotions"] = item.promotion_type_rel.all()
                datas[item] = data
        result["datas"] = datas


    return render(request, 'websites/helio_kids.html', {"result": result})

def night_life(request):
    print "***START NIGHT LIFE CONTENT PAGE***"
    result = {}
    night_life = Post.objects.get(key_query=const.NIGHT_LIFE_KEY_QUERY)
    result["night_life"] = night_life
    return render(request, 'websites/night_life.html', {"result": result})


def helio_play(request):
    print "***START HELIO PLAY PAGE***"
    result = {}
    #Get page info
    page_info = Category.objects.get(pk=const.HELIO_PLAY_CATEGORY)
    result["page_info"] = page_info

    # Game type
    if page_info:
        datas = {}
        play_types = page_info.game_category_rel.all()
        promotions = {}
        if play_types:
            for item in play_types:
                data = {}
                data["games"] = item.game_type_rel.all()
                data["promotions"] = item.promotion_type_rel.all()
                datas[item] = data
        result["datas"] = datas

    return render(request, 'websites/helio_play.html', {"result": result})


def helio_introduction(request):

    print "***START HELIO ABOUT PAGE***"
    
    return render(request, 'websites/helio_introduction.html')


def term_condition(request):
    print "***START HELIO ABOUT PAGE***"
    
    return render(request, 'websites/term_condition.html')


def events(request):
    print "***START EVENTS PAGE***"
    result = {}

    events = Event.objects.all().order_by('start_date')

    result["events"] = events
    events_map = {}
    events_map_pg = {}
    if events:
        for event in events:
            key = event.start_date.strftime('%m/%Y')
            if key not in events_map.keys():
                events_map[key] = []
            events_map[key].append(event)

        for key, values in events_map.items():
            p =  Paginator(values, 7)
            datas = {}
            for x in range(0, p.num_pages):
                datas[x] = p.page(x+1)
            events_map_pg[key] = datas

    result["events_map"] = events_map_pg
    result["events_map_pg"] = events_map_pg

    return render(request, 'websites/events.html', {"result": result})

def event_detail(request, event_id):
    print "***START EVENT DETAIl PAGE***"
    event = Event.objects.get(pk=event_id)

    other_events = Event.objects.all()[:3]

    return render(request, 'websites/event_detail.html', {"event": event, "other_events": other_events})

def event_content(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/event_content.html')
    
def experience(request):
    print "***START EXPERIENCE CONTENT PAGE***"
    result = {}
    # Experience info
    experience_type = Post_Type.objects.get(pk=const.EXPERIENCE_POST_TYPE_ID)
    result["experience_type"] = experience_type

    # Experience list
    experiences = Post.objects.filter(post_type_id=const.EXPERIENCE_POST_TYPE_ID)
    result["experiences"] = experiences

    result["experiences_hots"] = experiences[:5]
    print experiences
    
    return render(request, 'websites/experience.html', {"result": result})

def experience_detail(request, experience_id):
    print "***START EVENT CONTENT PAGE***"
    experience = Post.objects.get(pk=experience_id)

    other_experiences = Post.objects.filter(post_type_id=const.EXPERIENCE_POST_TYPE_ID)[:3]

    return render(request, 'websites/experience_detail.html', {"experience": experience, "other_experiences": other_experiences})

def news(request):
    print "***START News PAGE***"

    return render(request, 'websites/news.html')


def coffee_bakery(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    result = {}

    coffee_page = Post.objects.get(key_query=const.COFFEE_KEY_QUERY)
    result["page_info"] = coffee_page
    
    list_images = {}
    if coffee_page:
        list_images = coffee_page.posts_image.all()[:6]

    result["list_images"] = list_images
    return render(request, 'websites/coffee_bakery.html', {"result":result})


def redemption_store(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    result = {}
    redemption_page = Post.objects.get(key_query=const.REDEMPTION_STORE_KEY_QUERY)
    result["page_info"] = redemption_page

    list_images = {}
    if redemption_page:
        list_images = redemption_page.posts_image.all()[:6]

    result["list_images"] = list_images

    # FAQs list
    faqs = FAQ.objects.filter(category_id=const.REDEMPTION_STORE_CATEGORY)
    result["faqs"] = faqs
    
    return render(request, 'websites/redemption_store.html', {"result":result})


def promotions(request):
    print "***START EVENT CONTENT PAGE***"
    result = {}


    promotions_hots = Promotion.objects.all()[:3]
    result["promotions_hots"] = promotions_hots
    # Promotion type
    promotion_category = Category.objects.filter(pk__in=[const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.NIGHT_LIFE_CATEGORY])

    datas = {}
    if promotion_category:
        promotions_all = []
        for category in promotion_category:
            datas[category] = []
            promotions = []
            types = category.game_category_rel.all()
            if types:
                for promotion_type in types:
                    promotions = promotion_type.promotion_type_rel.all().order_by('name')
                    print promotions

                    for promotion in promotions:
                        datas[category].append(promotion)
                        promotions_all.append(promotion)
                    #     pass
                    # datas[category].append(promotions)

        category_all = Category();
        category_all.name = "ALL"
        category_all.name_vi = "ALL"
        category_all.id = 0
        datas[category_all] = promotions_all


    result["datas"] = datas

    # print "Promotions: ", datas

    return render(request, 'websites/promotions.html', {"result": result})

def promotion_detail(request, promotion_id):
    print "***START PROMOTION DETAIl PAGE***"
    promotion = Promotion.objects.get(pk=promotion_id)

    other_promotions = Promotion.objects.all()[:3]

    return render(request, 'websites/promotion_detail.html', {"promotion": promotion, "other_promotions": other_promotions})

def careers(request):
    print "***START CARRER CONTENT PAGE***"
    result = {}

    # Careers info
    careers_type = Post_Type.objects.get(pk=const.CAREERS_POST_TYPE_ID)
    result["careers_type"] = careers_type

    # Careers pin to top
    careers_pin_top = Post.objects.filter(pin_to_top=True).first()
    result["careers_pin_top"] = careers_pin_top

    # Careers list
    careers = Post.objects.filter(post_type_id=const.CAREERS_POST_TYPE_ID)
    result["careers"] = careers

    return render(request, 'websites/careers.html', {"result": result})

def career_detail(request, career_id):
    print "***START CARRER DETAIl PAGE***"
    career = Post.objects.get(pk=career_id)

    other_careers = Post.objects.filter(post_type_id=const.CAREERS_POST_TYPE_ID)[:3]

    return render(request, 'websites/carrer_detail.html', {"career": career, "other_careers": other_careers})
