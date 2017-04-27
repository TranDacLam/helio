from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from core.models import *
from api.serializers import *
from rest_framework.decorators import api_view
from rest_framework import status
import helper
import ast
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['code'] = response.status_code
        response.data['message'] = response.data['detail']
        response.data['fields'] = ""
        del response.data['detail']

    return response

"""
    Get Hots List to show in Homepage
"""


@api_view(['GET'])
def hots(request):
    try:
        hot_list = Hot.objects.filter(is_show=True).order_by('-created')[:5]
        serializer = HotsSerializer(hot_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get All Game Play by Type ID
"""


@api_view(['GET'])
def games(request):
    try:
        game_type_id = request.GET.get("type_id")
        print '#### game_type_id ', game_type_id
        error = helper.checkIdValid(game_type_id)
        if not helper.isEmpty(error):
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        game_list = Game.objects.filter(game_type_id=game_type_id)
        serializer = GameSerializer(game_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Game Detail by ID
"""


@api_view(['GET'])
def game_detail(request, game_id):
    try:
        error = helper.checkIdValid(game_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "game_id"}
            return Response(errors, status=400)

        game_detail = Game.objects.get(pk=game_id)
        serializer = GameDetailSerializer(game_detail, many=False)
        return Response(serializer.data)
    except Game.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "game_id"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Entertainment Detail By ID (Entertainments containt redemption, coffee, bakery ...etc )
"""


@api_view(['GET'])
def entertainment_detail(request, id_or_key_query):
    try:
        if helper.isInt(id_or_key_query):
            entertainment_detail = Entertainment.objects.get(
                pk=id_or_key_query)
        else:
            entertainment_detail = Entertainment.objects.get(
                key_query=id_or_key_query)

        serializer = EntertainmentDetailSerializer(
            entertainment_detail, many=False)
        return Response(serializer.data)
    except Entertainment.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "id"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get All Events
"""


@api_view(['GET'])
def events(request):
    try:
        event_list = event_list = Event.objects.all()
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Latest Events
"""


@api_view(['GET'])
def events_latest(request):
    try:
        event_list = Event.objects.all().order_by('-created')[:2]
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get All Events
"""


@api_view(['GET'])
def event_detail(request, event_id):
    try:
        error = helper.checkIdValid(event_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "event_id"}
            return Response(errors, status=400)

        event_list = Event.objects.get(pk=event_id)
        serializer = EventsSerializer(event_list, many=False)
        return Response(serializer.data)
    except Event.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "id"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get posts by type
"""


@api_view(['GET'])
def posts(request):
    # TODO : Posts_image in request /posts is required?
    try:
        type_id = request.GET.get("type_id")

        error = helper.checkIdValid(type_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        post_list = Post.objects.filter(post_type_id=type_id)
        print "description type ", post_list[0].post_type.description
        serializer = PostsSerializer(post_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get posts details
"""


@api_view(['GET'])
def post_detail(request, id_or_key_query):
    try:
        if helper.isEmpty(id_or_key_query):
            error = {"code": 400, "message": "This field is required.",
                     "fields": "id_or_key_query"}
            return Response(error, status=400)

        if helper.isInt(id_or_key_query):
            post_item = Post.objects.get(pk=id_or_key_query)
        else:
            post_item = Post.objects.get(key_query=id_or_key_query)

        serializer = PostsSerializer(post_item, many=False)
        return Response(serializer.data)
    except Post.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "id_or_key_query"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get promotions by type
"""


@api_view(['GET'])
def promotions(request):
    try:
        type_id = request.GET.get("type_id")

        error = helper.checkIdValid(type_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        lst_item = Promotion.objects.filter(promotion_type_id=type_id)
        serializer = PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get posts details
"""


@api_view(['GET'])
def promotion_detail(request, promotion_id):
    try:
        promotion_item = Promotion.objects.get(pk=promotion_id)
        serializer = PromotionsSerializer(promotion_item)
        return Response(serializer.data)

    except Promotion.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "promotion_id"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Transaction Type
"""


@api_view(['GET'])
def transactions_type(request):
    try:
        lst_item = Transaction_Type.objects.all()
        serializer = PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get ALL FAQs
"""


@api_view(['GET'])
def faqs(request):
    try:
        category_id = request.GET.get("category_id", "")

        error = helper.checkIdValid(category_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "category_id"}
            return Response(errors, status=400)

        faq_list = FAQ.objects.filter(category_id=category_id)
        serializer = FAQsSerializer(faq_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)
