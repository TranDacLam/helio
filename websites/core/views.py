from django.shortcuts import render
from models import *
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import ast
from django.http import JsonResponse
import constants as const
import time
from datetime import *
from forms import *
import api.utils as utils
from django.http import HttpResponse
import json

def home(request):
    try:
        result = {}
        # banners on home page
        banners = Banner.objects.filter(is_show=True).order_by('position')
        banners_map = {}
        if banners:
            for item in banners:
                banners_map[item.position] = item
        result["banners"] = banners_map

        # hots
        hots = Hot.objects.filter(is_show=True).order_by('-modified')[:4]
        result["hots"] = hots

        # game section
        result["play_types"] = Type.objects.filter(category_id=const.HELIO_PLAY_CATEGORY)
        result["kids_types"] = Type.objects.filter(category_id=const.HELIO_KIDS_CATEGORY)

        # game categorys
        events = Event.objects.all().order_by('-created')[:2]
        result["events"] = events
        return render(request, 'websites/home.html', {"result":result})
    except Exception, e:
        print "Error: ", e

    return render(request, 'websites/home.html')

def power_card(request):
    print "***START Power Card Introduction PAGE***"
    try:
        result = {}
        # Powercard info
        powercard_type = Post_Type.objects.get(pk=const.POWERCARD_POST_TYPE_ID)
        result["powercard_type"] = powercard_type

        # Powercard list
        powercards = Post.objects.filter(post_type = powercard_type)
        result["powercards"] = powercards

        faqs = FAQ.objects.filter(category_id=const.POWERCARD_CATEGORY).order_by('-created')
        result["faqs"] = faqs
        return render(request, 'websites/power_card.html', {"result":result})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/power_card.html')

def faqs(request):
    print "***START FAQs PAGE***"
    try:
        faqs_categorys = Category.objects.filter(pk__in=(const.HELIO_PLAY_CATEGORY, const.HELIO_KIDS_CATEGORY, const.POWERCARD_CATEGORY, const.REDEMPTION_STORE_CATEGORY))

        datas = {}
        if faqs_categorys:
            for faqs_category in faqs_categorys:
                datas[faqs_category] = faqs_category.faq_category_rel.all().order_by('-created')

        other_prods_faqs = FAQ.objects.filter(category_id__in=(const.BIRTHDAY_PARTY_CATEGORY, const.SCHOOL_TRIP_CATEGORY, const.COMBO_HELIO_CATEGORY)).order_by('-created')
        
        return render(request, 'websites/faqs.html', {"datas":datas, "other_prods_faqs": other_prods_faqs})
    except Exception, e:
        print "Error: ", e

    return render(request, 'websites/faqs.html')
        
def contact(request):
    print "***START CONTACT CONTENT PAGE***"
    try:
        message_success = {}
        if request.method == 'POST':
            contact_form = ContactForm(request.POST, request=request)

            if contact_form.is_valid():
                contact_form.save() 
                message_success = 'Successfully!'
                print message_success
                return render(request, 'websites/contact.html', {"message_success": message_success})
                

    except Exception, e:
        print "Error: ", e

    return render(request, 'websites/contact.html')


def helio_kids(request):
    print "***START HELIO KIDS PAGE***"
    try:
        datas = {}
        #Get page info
        page_info = Category.objects.get(pk=const.HELIO_KIDS_CATEGORY)
        #Get kids pricing
        kids_pricing = Post.objects.get(key_query=const.KIDS_PRICING_KEY_QUERY)

        # Game type
        if page_info:
            kids_types = page_info.game_category_rel.all()
            promotions = {}
            if kids_types:
                for item in kids_types:
                    data = {}
                    data["games"] = item.game_type_rel.all().order_by('-created')
                    data["promotions"] = item.promotion_type_rel.all().order_by('-created')
                    datas[item] = data

        return render(request, 'websites/helio_kids.html', {"page_info": page_info, "kids_pricing": kids_pricing, "datas": datas})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/helio_kids.html')
    

def night_life(request):
    print "***START NIGHT LIFE CONTENT PAGE***"
    try:
        night_life = Post.objects.get(key_query=const.NIGHT_LIFE_KEY_QUERY)
        return render(request, 'websites/night_life.html', {"night_life": night_life})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/night_life.html')

def helio_play(request):
    print "***START HELIO PLAY PAGE***"
    try:
        datas = {}
        #Get page info
        page_info = Category.objects.get(pk=const.HELIO_PLAY_CATEGORY)

        # Game type
        if page_info:
            play_types = page_info.game_category_rel.all()
            promotions = {}
            if play_types:
                for item in play_types:
                    data = {}
                    data["games"] = item.game_type_rel.all().order_by('-created')
                    data["promotions"] = item.promotion_type_rel.all().order_by('-created')
                    datas[item] = data

        return render(request, 'websites/helio_play.html', {"page_info": page_info, "datas": datas})

    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/helio_play.html')


def helio_introduction(request):
    print "***START HELIO ABOUT PAGE***"
    try:
        # Helio About info
        about_type = Post_Type.objects.get(pk=const.HELIO_ABOUT_POST_TYPE_ID)

        # Helio About list
        abouts = Post.objects.filter(post_type = about_type)
        
        return render(request, 'websites/helio_introduction.html', {"about_type": about_type, "abouts": abouts})

    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/helio_introduction.html')

def term_condition(request):
    print "***START TERM & CONDITION PAGE***"
    try:
        # Experience info
        term_type = Post_Type.objects.get(pk=const.TERM_CONDITION_POST_TYPE_ID)

        # Experience list
        terms = Post.objects.filter(post_type = term_type)
        
        return render(request, 'websites/term_condition.html', {"term_type": term_type, "terms": terms})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/term_condition.html')

def events(request):
    print "***START EVENTS PAGE***"
    try:
        result = {}
        events = Event.objects.all().order_by('-start_date')
        events_map = {}
        if events:
            for event in events:
                event.start_datetime = datetime.combine(event.start_date, event.start_time)
                event.end_datetime = datetime.combine(event.end_date, event.end_time)
                key = event.start_date.strftime('%m/%Y')
                if key not in events_map.keys():
                    events_map[key] = []
                events_map[key].append(event)

        result["events"] = events
        result["events_map"] = events_map
        result["event_hots"] = events[:3]

        return render(request, 'websites/events.html', {"result": result})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/events.html')

def event_detail(request, event_id):
    try:
        print "***START EVENT DETAIl PAGE***"
        event = Event.objects.get(pk=event_id)
        if event:
            event.start_datetime = datetime.combine(event.start_date, event.start_time)
            event.end_datetime = datetime.combine(event.end_date, event.end_time)

        other_events = Event.objects.all().order_by('-created')[:3]

        return render(request, 'websites/event_detail.html', {"event": event, "other_events": other_events})

    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/event_detail.html')


def experience(request):
    print "***START EXPERIENCE CONTENT PAGE***"
    try:
        result = {}
        # Experience info
        experience_type = Post_Type.objects.get(pk=const.EXPERIENCE_POST_TYPE_ID)
        result["experience_type"] = experience_type

        # Experience list
        experiences = Post.objects.filter(post_type = experience_type).order_by('-created')
        result["experiences"] = experiences

        result["experiences_hots"] = experiences[:5]
        print experiences
        
        return render(request, 'websites/experience.html', {"result": result})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/experience.html')

def experience_detail(request, experience_id):
    try:
        print "***START EVENT CONTENT PAGE***"
        experience = Post.objects.get(pk=experience_id)

        other_experiences = Post.objects.filter(post_type_id=const.EXPERIENCE_POST_TYPE_ID).order_by('-created')[:3]

        return render(request, 'websites/experience_detail.html', {"experience": experience, "other_experiences": other_experiences})

    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/experience_detail.html')


def news(request):
    print "***START News PAGE***"
    try:
        result = {}
        # News info
        news_type = Post_Type.objects.get(pk=const.NEWS_POST_TYPE_ID)
        
        # News list
        news = Post.objects.filter(post_type = news_type).order_by('-created')

        return render(request, 'websites/news.html', {"news_type": news_type, "news": news, "news_hots": news[:5]})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/news.html')


def new_detail(request, new_id):
    print "***START NEW CONTENT PAGE***"
    try:
        new = Post.objects.get(pk=new_id)

        other_news = Post.objects.filter(post_type_id=const.NEWS_POST_TYPE_ID).order_by('-created')[:3]

        return render(request, 'websites/new_detail.html', {"new": new, "other_news": other_news})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/new_detail.html')


def coffee_bakery(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    try:
        coffee_page = Post.objects.get(key_query=const.COFFEE_KEY_QUERY)
        
        list_images = {}
        if coffee_page:
            list_images = coffee_page.posts_image.all()[:6]

        return render(request, 'websites/coffee_bakery.html', {"page_info":coffee_page, "list_images": list_images})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/coffee_bakery.html')

def redemption_store(request):
    print "***START HELIO COFFEE CONTENT PAGE***"
    try:
        result = {}
        redemption_page = Post.objects.get(key_query=const.REDEMPTION_STORE_KEY_QUERY)
        result["page_info"] = redemption_page

        list_images = {}
        if redemption_page:
            list_images = redemption_page.posts_image.all()[:6]

        result["list_images"] = list_images

        # FAQs list
        faqs = FAQ.objects.filter(category_id=const.REDEMPTION_STORE_CATEGORY).order_by('-created')
        result["faqs"] = faqs
        
        return render(request, 'websites/redemption_store.html', {"result":result})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/redemption_store.html')

def promotions(request):
    print "***START EVENT CONTENT PAGE***"
    try:
        result = {}
        promotions = Promotion.objects.all().order_by('-created')
        datas = {}
        if promotions:
            for promotion in promotions:
                if promotion.promotion_type:
                    key = promotion.promotion_type.category
                    if key not in datas.keys():
                        datas[key] = []
                    datas[key].append(promotion)


            category_all = Category();
            category_all.name = "ALL"
            category_all.name_vi = "ALL"
            category_all.id = 0
            datas[category_all] = promotions

        # Promotion hots to show coursel
        promotions_hots = promotions[:3]

        return render(request, 'websites/promotions.html', {"promotions_hots": promotions_hots, "datas": datas})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/promotions.html')

def promotion_detail(request, promotion_id):
    print "***START PROMOTION DETAIl PAGE***"
    try:
        promotion = Promotion.objects.get(pk=promotion_id)

        other_promotions = Promotion.objects.all().order_by('-created')[:3]

        return render(request, 'websites/promotion_detail.html', {"promotion": promotion, "other_promotions": other_promotions})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/promotion_detail.html')

def careers(request):
    print "***START CARRER CONTENT PAGE***"
    try:
        result = {}
        # Careers info
        careers_type = Post_Type.objects.get(pk=const.CAREERS_POST_TYPE_ID)
        result["careers_type"] = careers_type

        # Careers pin to top
        careers_pin_top = Post.objects.filter(pin_to_top=True).first()
        result["careers_pin_top"] = careers_pin_top

        # Careers list
        careers = Post.objects.filter(post_type = careers_type).order_by('-created')
        result["careers"] = careers

        return render(request, 'websites/careers.html', {"result": result})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/careers.html')


def career_detail(request, career_id):
    try:
        print "***START CARRER DETAIl PAGE***"
        career = Post.objects.get(pk=career_id)

        other_careers = Post.objects.filter(post_type_id=const.CAREERS_POST_TYPE_ID).order_by('-created')[:3]

        return render(request, 'websites/carrer_detail.html', {"career": career, "other_careers": other_careers})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/carrer_detail.html')

def other_product(request):
    print "***START other product PAGE***"
    try:
        products = Post.objects.filter(post_type_id=const.ORTHER_PROD_POST_TYPE_ID).order_by('-created')
        
        # print "products ", products
        datas = {}
        for product in products:
            if product:
                products_faqs = {}
                #get list post images
                product.post_images = product.posts_image.all()[:6]
                products_faqs["product"] = product

                #get list post images by name
                faqs_category =  Category.objects.filter(name_en = product.name_en) 
                if faqs_category and faqs_category[0]:
                    faq_category = faqs_category[0]
                    products_faqs["faqs"] = faq_category.faq_category_rel.all().order_by('-created')
                datas[product.id] = products_faqs

        return render(request, 'websites/other_product.html', {"datas":datas})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/other_product.html')

def policy(request):
    print "***START POLICY PAGE***"
    try:
        # Policy
        policy = Post.objects.get(key_query=const.POLICY_KEY_QUERY)

        return render(request, 'websites/policy.html', {"policy":policy})
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/policy.html')

def helio_photos(request):
    print "***START HELIO PHOTOS PAGE***"
    try:
        photos_type = Post_Type.objects.get(pk=const.HELIO_PHOTOS_POST_TYPE_ID)

        # Helio photos
        photos = Post.objects.filter(post_type=photos_type)

        for photo in photos:
            # get len of post images
            photo.images_len =  len(photo.posts_image.all())

        return render(request, 'websites/helio_photos.html', {"photos_type": photos_type, "photos": photos});
    except Exception, e:
        print "Error: ", e
    return render(request, 'websites/helio_photos.html')


def list_photos_by_album(request):
    list_images = {}
    try:
        if request.method == 'POST':
            album_id = request.POST["album_id"]
            print "album_id", album_id
            if album_id:
                album = Post.objects.get(pk=album_id)
                if album:
                    list_images = list(album.posts_image.all().values('image'))
    except Exception, e:
        print "Error: ", e

    return HttpResponse(
        json.dumps(list_images),
        content_type="application/json"
    )