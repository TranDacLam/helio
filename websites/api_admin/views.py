from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import get_user_model
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser, FormParser
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import *
from core.custom_models import *
from rest_framework.permissions import AllowAny, IsAdminUser
from api_admin import serializers as admin_serializers
from django.db import connections


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionView(APIView):
    def get(self, request, format=None):
        try:
            promotion_id =  request.GET.get('id', '')
            if promotion_id:
                item = Promotion.objects.get(pk=id)
                serializer = admin_serializers.PromotionSerializer(item, many=False)
                return Response(serializer.data)
            else:
                lst_item = Promotion.objects.all()
                serializer = admin_serializers.PromotionSerializer(lst_item, many=True)
                return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    # def post(self, request):
    #     # CREATE
    # def put(self, request):
    #     # UPDATE
    # def delete(self, request):
    #     # DELETE

"""
    Get Promotion Users Detail
"""

"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionUserView(APIView):
    def get(self, request, format=None):
        try:
            promotion_id =  request.GET['id']
            if promotion_id:
                promotion_detail = Promotion.objects.get(pk=promotion_id)
                user_all_list = User.objects.all()
                promotion_user_id_list = Gift.objects.filter(promotion_id=promotion_id).values_list('user_id', flat=True)
                user_promotion_list = User.objects.filter(pk__in=promotion_user_id_list)
                
                result = {}
                result['promotion_detail'] = admin_serializers.PromotionSerializer(promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(user_promotion_list, many=True).data
        
                return Response(result)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


@permission_classes((AllowAny,))
class UserDetail(APIView):   

    def get(self, request, format=None):
        try:
            email = self.request.query_params.get('email', None)
            if email:
                user = User.objects.get(email=email)
                serializer = admin_serializers.UserSerializer(user)
                return Response(serializer.data)
            return Response({"code": 500, "message": "Not found email", "fields": ""}, status=500)

        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = admin_serializers.UserSerializer(instance=user, data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"code": 200, "status": "success", "fields": ""}, status=200)
            return Response({"code": 500, "message": serializer.errors, "fields": ""}, status=500)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

"""
GET and POST Advertisement
"""     
@permission_classes((AllowAny, ))
class AdvertisementView(APIView):

    def get(self, request, format=None):
        """
        Get all Advertisement
        """
        try:
            adv_list = Advertisement.objects.all()
            serializer = admin_serializers.AdvertisementSerializer(adv_list, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code":500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        """
        POST: Create a new Advertisement
        """
        serializer = admin_serializers.AdvertisementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
GET, PUT Advertisement Detail
"""
@permission_classes((AllowAny, ))
class AdvertisementDetail(APIView):
    """
    Retrieve, update or delete a advertisement instance
    """
    def get_object(self, pk):
        try:
            adv = Advertisement.objects.get(pk=pk)
            return adv
        except Exception, e:
            return Response(status=500)

    def get(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(advertisement)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(advertisement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(request.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
GET and POST Promotion_Label
"""
@permission_classes((AllowAny, ))
class PromotionLabel(APIView):
    
    def get(self, request, format=None):
        """
            Get all promotion_label
        """
        try:
            promotion_label_list = Promotion_Label.objects.all()
            serializer = admin_serializers.PromotionLabelSerializer(promotion_label_list, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        """
            POST: Create a new Promotion_Label
        """
        serializer = admin_serializers.PromotionLabelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





