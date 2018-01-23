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
from rest_framework.permissions import AllowAny


from api_admin import serializers as admin_serializers

"""
    Get Hots List to show in Homepage
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def hots(request):
    try:
        hot_list = Hot.objects.filter(is_show=True).order_by('-created')[:5]
        serializer = admin_serializers.HotsSerializer(hot_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)