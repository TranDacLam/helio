from django.shortcuts import render
from models import *
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import ast


# Create your views here.
def get_posts(request):
    print 'call request'
    lst_post = Post.objects.all()

    print lst_post
    data = serializers.serialize("json", lst_post) 
    # print "Data With Current Language ",lst_post[0].name
    # print "list item ",data
    return render(request, 'websites/post.html', {"posts":lst_post, "name":lst_post[0].name})
    # return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type="application/json")


def helio_play(request):
    print "***START HELIO PLAY PAGE***"

    game_filter_list = Game_Filter.objects.all()

    game_list = Game.objects.filter(category_id=5)

    if request.method == 'POST':
        game_filter =  request.POST.get("game_filter")
        game_filter_arr = ast.literal_eval(game_filter)
        if game_filter_arr:
            lst =  ast.literal_eval(game_filter)
            game_list = game_list.filter(game_filter__in=lst).distinct()

        #convert games to map by game type
        games = {}
            
        if game_list:
                for item in game_list:
                    game_type = item.game_type.name
                    if game_type not in games.keys():
                        games[game_type] = []
                    games[game_type].append(item)
        return render(request, 'websites/ajax/play_content.html', {'games': games})

    #convert games to map by game type
    games = {}
    if game_list:
        for item in game_list:
            game_type = item.game_type.name
            if game_type not in games.keys():
                games[game_type] = []
            games[game_type].append(item)

    return render(request, 'websites/helio_play.html', {'games': games, 'game_filters': game_filter_list})


def events(request):
    print "***START EVENTS PAGE***"
    
    return render(request, 'websites/events.html')

def event_content(request):
    print "***START EVENT CONTENT PAGE***"
    
    return render(request, 'websites/event_content.html')

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
