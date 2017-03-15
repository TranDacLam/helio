from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from core.models import *
from api.serializers import *
from rest_framework.decorators import api_view
from rest_framework import status
from helper import *
import ast

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

"""
    Get Hots List to show in Homepage
"""
@api_view(['GET'])
def hots(request):
    try:
        print str(request.auth)
        hot_list = Hot.objects.filter(is_show=True).order_by('date_created')[:5]
        serializer = HotsSerializer(hot_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)

"""
    Get All Game Filter
"""
@api_view(['GET'])
def game_filter(request):
    try:
        game_filter_list = Game_Filter.objects.all()
        serializer = GameFilterSerializer(game_filter_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)
    
"""
    Get All Game Play by Filter
"""
@api_view(['GET'])
def games(request):
    try:
        game_filter =  request.GET.get("game_filter")
        category_id =  request.GET.get("category_id")

        error = checkIdValid(category_id)
        if not isEmpty(error):
            error = {"code" : 400, "message": "%s" % error, "fields": "category_id"}
            return JSONResponse( error, status=400)

        game_list = Game.objects.filter(category_id=category_id)
        if bool(game_filter):
            lst =  ast.literal_eval(game_filter)
            game_list = game_list.filter(game_filter__in=lst).distinct()
        serializer = GameSerializer(game_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)

"""
    Get Game Detail by ID
"""
@api_view(['GET'])
def game_detail(request, game_id):
    try:
        game_detail = Game.objects.get(pk=game_id)
        serializer = GameDetailSerializer(game_detail, many=False)
        return JSONResponse(serializer.data)
    except Game.DoesNotExist, e:
        error = {"code" : 400, "message": "%s" % e, "fields": "id"}
        return JSONResponse( error, status=400)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)
  
"""
    Get ALL FAQs
"""  
@api_view(['GET'])
def faqs(request):
    try:
        faq_list = FAQ.objects.all()
        serializer = FAQsSerializer(faq_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)
 
"""
    Get Entertainments ( Entertainments containt promotion, night life stores, market kiosks. )
""" 
@api_view(['GET'])
def entertainments(request):
    try: 
        entertainments_filter =  request.GET.get("entertainments_filter")
        category_id =  request.GET.get("category_id")
        entertainment_list = Entertainment.objects.filter(category_id=category_id)

        error = checkIdValid(category_id)
        if not isEmpty(error):
            error = {"code" : 400, "message": "%s" % error, "fields": "category_id"}
            return JSONResponse( error, status=400)

        if bool(entertainments_filter):
            lst =  ast.literal_eval(entertainments_filter)
            entertainment_list = entertainment_list.filter(entertainments_filter__in=lst).distinct()

        serializer = EntertainmentsSerializer(entertainment_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)

"""
    Get Entertainment Detail By ID
""" 
@api_view(['GET'])
def entertainment_detail(request, entertainment_id):
    try:
        entertainment_detail = Entertainment.objects.get(pk=entertainment_id)
        serializer = EntertainmentDetailSerializer(entertainment_detail, many=False)
        return JSONResponse(serializer.data)
    except Game.DoesNotExist, e:
        error = {"code" : 400, "message": "%s" % e, "fields": "id"}
        return JSONResponse( error, status=400)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)

"""
    Get All Event Filter
""" 
@api_view(['GET'])
def event_filter(request):
    try:
        event_filter_list = Event_Filter.objects.all()
        serializer = EventFilterSerializer(event_filter_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)


"""
    Get Events by Filter
""" 
@api_view(['GET'])
def events(request):
    try:
        event_filter = request.GET.get("event_filter")
        event_list = Event.objects.all()

        if bool(event_filter):
            lst =  ast.literal_eval(event_filter)
            event_list = event_list.filter(event_filter__in=lst).distinct()

        serializer = EventsSerializer(event_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)


"""
    Get posts details
""" 
@api_view(['GET'])
def posts(request):
    try:
        id_or_key_query = request.GET.get("id_or_key_query")
        
        if isEmpty(id_or_key_query):
            error = {"code" : 400, "message": "This field is required.", "fields": "id_or_key_query"}
            return JSONResponse( error, status=400)

        post_list = Post.objects.all()
        if isInt(id_or_key_query):
            post_list = post_list.filter(pk=id_or_key_query)
        else:
            post_list = post_list.filter(key_query=id_or_key_query)
        
        serializer = PostsSerializer(post_list, many=True)
        return JSONResponse(serializer.data)
    except Exception ,e :
        error = {"code" : 500, "message": "%s" % e, "fields": ""}
        return JSONResponse( error, status=500)


 