from django.shortcuts import render
from models import Post
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder


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
    
    return render(request, 'websites/helio_play.html')


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
