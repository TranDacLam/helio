from django.shortcuts import render
from models import Posts
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder


# Create your views here.
def get_posts(request):
    print 'call request'
    lst_post = Posts.objects.all()
    data = serializers.serialize("json", lst_post) 
    # print "Data With Current Language ",lst_post[0].name
    # print "list item ",data
    return render(request, 'websites/post.html', {"posts":lst_post, "name":lst_post[0].name})
    # return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type="application/json")


def helio_play(request):
    print "***START HELIO PLAY PAGE***"
    
    return render(request, 'websites/helio_play.html')
    