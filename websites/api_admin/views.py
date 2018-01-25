from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import get_user_model
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser, FormParser
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework import status
from rest_framework.views import exception_handler, APIView
from rest_framework.response import Response
from rest_framework import generics as drf_generics
from core.models import *
from core.custom_models import *
from rest_framework.permissions import AllowAny


from api_admin import serializers as admin_serializers


"""
    Get Promotion Users Detail
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_all_promotion(request):
    try:
        lst_item = Promotion.objects.filter(is_draft=False)
        serializer = admin_serializers.PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get Promotion Users Detail
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def user_promotion(request):
    try:
        if request.method == 'GET':
            promotion_id =  request.GET['id']
            if promotion_id:
                promotion_detail = Promotion.objects.get(pk=promotion_id)
                user_all_list = User.objects.all()
                promotion_user_id_list = Gift.objects.filter(promotion_id=promotion_id).values_list('user_id', flat=True)
                user_promotion_list = User.objects.filter(pk__in=promotion_user_id_list)
                
                result = {}
                result['promotion_detail'] = admin_serializers.PromotionsSerializer(promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UsersSerializer(user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UsersSerializer(user_promotion_list, many=True).data
        
                return Response(result)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)
