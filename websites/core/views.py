from django.shortcuts import render
from models import *
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import ast
from django.http import JsonResponse


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

    # game categorys
    categorys = Category.objects.all().order_by('id')
    categorys_map = {}
    for category in categorys:
        types = Type.objects.filter(category_id=int(category.id))
        # types_map = {}
        # for item_type in types:
        #     game = Game.objects.filter(game_type_id=int(item_type.id))[:1]
        #     types_map[item_type.name] = game

        categorys_map[category.name] = types
        print category.name

    result["categorys"] = categorys_map
    print categorys_map

    # game categorys
    events = Event.objects.all()[:2]
    result["events"] = events


    return render(request, 'websites/home.html', {"result":result})

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

    #game_filter_list = Game_Filter.objects.all()

    #game_list = Game.objects.filter(category_id=5)

    if request.method == 'POST':
        print "request Data : ", request.POST["name"]
        # game_filter =  request.POST.get("game_filter")
        # game_filter_arr = ast.literal_eval(game_filter)
        # if game_filter_arr:
        #     lst =  ast.literal_eval(game_filter)
        #     game_list = game_list.filter(game_filter__in=lst).distinct()

        # #convert games to map by game type
        # games = {}
            
        # if game_list:
        #         for item in game_list:
        #             game_type = item.game_type.name
        #             if game_type not in games.keys():
        #                 games[game_type] = []
        #             games[game_type].append(item)

        if request.is_ajax():
            return JsonResponse({'result':'You Have Call Success Post Action '})

    return render(request, 'websites/ajax/play_content.html')

    #convert games to map by game type
    #games = {}
    # if game_list:
    #     for item in game_list:
    #         game_type = item.game_type.name
    #         if game_type not in games.keys():
    #             games[game_type] = []
    #         games[game_type].append(item)

   # return render(request, 'websites/helio_play.html', {'games': games, 'game_filters': game_filter_list})

def helio_play_v2(request):
    print "***START EVENTS PAGE***"
    
    return render(request, 'websites/helio_play_v2.html')


def helio_kids(request):
    print "***START EVENTS PAGE***"
    
    return render(request, 'websites/helio_kids.html')


def events(request):
    print "***START EVENTS PAGE***"
    
    return render(request, 'websites/events.html')

def event_content(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/event_content.html')

    
def trainghiem(request):
    print "***START trai nghiem CONTENT PAGE***"
    
    return render(request, 'websites/trainghiem.html')

def tn_chi_tiet(request):
    print "***START trai nghiem chi tiet CONTENT PAGE***"
    
    return render(request, 'websites/trai_nghiem_chi_tiet.html')

def km_chi_tiet(request):
    print "***START khuyen mai chi tiet CONTENT PAGE***"
    
    return render(request, 'websites/km_chi_tiet.html')

def lienhe(request):
    print "***START lien he CONTENT PAGE***"
    
    return render(request, 'websites/lienhe.html')

def FAQ(request):
    print "***START FAQs PAGE***"

    return render(request, 'websites/FAQ.html')

def power_card(request):
    print "***START Power Card Introduction PAGE***"

    return render(request, 'websites/power_card.html')

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

def helio_night_life(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/helio_night_life.html')


def promotions(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/promotions.html')
