from django.shortcuts import render
from models import *
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import ast
from django.http import JsonResponse
import constant


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
    result["play_types"] = Type.objects.filter(category_id=constant.HELIO_PLAY_CATEGORY)
    result["kids_types"] = Type.objects.filter(category_id=constant.HELIO_KIDS_CATEGORY)

    # game categorys
    events = Event.objects.all()[:2]
    result["events"] = events

    return render(request, 'websites/home.html', {"result":result})

def power_card(request):
    print "***START Power Card Introduction PAGE***"
    result = {}

    # Powercard info
    powercard_type = Post_Type.objects.get(pk=constant.POWERCARD_POST_TYPE_ID)
    result["powercard_type"] = powercard_type

    # Powercard list
    powercards = Post.objects.filter(post_type_id=constant.POWERCARD_POST_TYPE_ID)
    result["powercards"] = powercards

    faqs = FAQ.objects.filter(category_id=constant.POWERCARD_FAQS_CATEGORY)
    result["faqs"] = faqs

    return render(request, 'websites/power_card.html', {"result":result})

def faqs(request):
    print "***START FAQs PAGE***"
    result = {}
    # FAWs list
    faqs = FAQ.objects.all()
    result["faqs"] = faqs
    
    return render(request, 'websites/faqs.html', {"result":result})

def contact(request):
    print "***START CONTACT CONTENT PAGE***"
    
    return render(request, 'websites/contact.html')


def helio_kids(request):
    print "***START HELIO KIDS PAGE***"
    result = {}
    #Get page info
    page_info = Category.objects.get(pk=constant.HELIO_KIDS_CATEGORY)
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
    
    return render(request, 'websites/night_life.html')

# Create your views here.
def get_posts(request):
    print 'call request'
    # lst_post = Post.objects.all()
    if request.method == 'PUT':
        print 'hello call delete ', request.is_ajax()
    # print lst_post
    # data = serializers.serialize("json", lst_post) 
    # # print "Data With Current Language ",lst_post[0].name
    # # print "list item ",data
        if request.is_ajax():
            print "request PARAM ", request.body
            return JsonResponse({'foo':'value data'})
    return render(request, 'websites/post.html')
    # return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type="application/json")


def helio_play(request):
    print "***START HELIO PLAY PAGE***"
    result = {}
    #Get page info
    page_info = Category.objects.get(pk=constant.HELIO_PLAY_CATEGORY)
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


def helio_term_condition(request):
    print "***START HELIO ABOUT PAGE***"
    
    return render(request, 'websites/helio_term_condition.html')


def events(request):
    print "***START EVENTS PAGE***"
    
    return render(request, 'websites/events.html')

def event_content(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/event_content.html')

    
def experience(request):
    print "***START EXPERIENCE CONTENT PAGE***"
    result = {}
    # Experience info
    experience_type = Post_Type.objects.get(pk=constant.EXPERIENCE_POST_TYPE_ID)
    result["experience_type"] = experience_type

    # Experience list
    experiences = Post.objects.filter(post_type_id=constant.EXPERIENCE_POST_TYPE_ID)
    result["experiences"] = experiences
    
    return render(request, 'websites/experience.html')

def experience_detail(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/experience_detail.html')


def tn_chi_tiet(request):
    print "***START trai nghiem chi tiet CONTENT PAGE***"
    
    return render(request, 'websites/trai_nghiem_chi_tiet.html')

def km_chi_tiet(request):
    print "***START khuyen mai chi tiet CONTENT PAGE***"
    
    return render(request, 'websites/km_chi_tiet.html')

def membership(request):
    print "***START Membership Introduction PAGE***"

    return render(request, 'websites/membership.html')


def news(request):
    print "***START News PAGE***"

    return render(request, 'websites/news.html')

def combo_product(request):
    print "***START HELIO PLAY PAGE***"
    
    return render(request, 'websites/combo_product.html')

def game_detail(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/game_detail.html')


def helio_coffee(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    
    return render(request, 'websites/helio_coffee.html')


def helio_redemption_store(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    result = {}
    # FAWs list
    faqs = FAQ.objects.all()
    result["faqs"] = faqs
    
    return render(request, 'websites/helio_redemption_store.html', {"result":result})


def promotions(request):
    print "***START EVENT CONTENT PAGE***"
    result = {}

    # Promotion type
    promotion_category = Category.objects.filter(pk__in=[constant.HELIO_PLAY_CATEGORY, constant.HELIO_KIDS_CATEGORY, constant.NIGHT_LIFE_CATEGORY])

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
        category_all.id = 0
        datas[category_all] = promotions_all

    result["datas"] = datas

    # print "Promotions: ", datas

    return render(request, 'websites/promotions.html', {"result": result})

def careers(request):
    print "***START CARRER CONTENT PAGE***"
    result = {}

    # Careers info
    careers_type = Post_Type.objects.get(pk=constant.CAREERS_POST_TYPE_ID)
    result["careers_type"] = careers_type

    # Careers list
    careers = Post.objects.filter(post_type_id=constant.CAREERS_POST_TYPE_ID)
    result["careers"] = careers

    return render(request, 'websites/careers.html', {"result": result})
