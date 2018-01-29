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
from django.db.models import Q


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionListView(APIView):
    def get(self, request, format=None):
        try:
            lst_item = Promotion.objects.all()
            serializer = admin_serializers.PromotionSerializer(lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionListView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionDetailView(APIView):
    def get(self, request, id):
        try:
            if id:
                item = Promotion.objects.get(pk=id)
                serializer = admin_serializers.PromotionSerializer(item, many=False)
                return Response(serializer.data)
        except Promotion.DoesNotExist, e:
            error = {"code": 400, "message": "Id Not Found.", "fields": "email"}
            return Response(error, status=400)
        except Exception, e:
            print 'PromotionDetailView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionUserView(APIView):
    def get(self, request, id):
        try:
            if id:
                promotion_detail = Promotion.objects.get(pk=id)
    
                promotion_user_id_list = Gift.objects.filter(promotion_id=id).values_list('user_id', flat=True)
                user_promotion_list = User.objects.filter(pk__in=promotion_user_id_list)
                user_all_list = User.objects.filter(~Q(pk__in=promotion_user_id_list))

                result = {}
                result['promotion_detail'] = admin_serializers.PromotionSerializer(promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(user_promotion_list, many=True).data
        
                return Response(result)
        except Exception, e:
            print 'PromotionUserView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
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
            return Response({"code": 400, "message": "Email is required", "fields": ""}, status=400)
        
        except User.DoesNotExist, e:
            error = {"code": 400, "message": "Email Not Found.", "fields": "email"}
            return Response(error, status=400)
        except Exception, e:
            print e
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
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationListView(APIView):
    def get(self, request, format=None):
        try:
            lst_item = Notification.objects.all()
            serializer = admin_serializers.NotificationSerializer(lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationDetailView(APIView):
    def get(self, request, id):
        try:
            if id:
                item = Notification.objects.get(pk=id)
                serializer = admin_serializers.NotificationSerializer(item, many=False)
                return Response(serializer.data)
            return Response({"code": 400, "message": "ID is required", "fields": "notification_id"}, status=400)
        except Exception, e:
            print 'NotificationDetailView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationUserView(APIView):
    def get(self, request, id):
        try:
            if id:
                notification_detail = Notification.objects.get(pk=id)
                notification_user_id_list = User_Notification.objects.filter(notification_id=id).values_list('user_id', flat=True)
                user_notification_list = User.objects.filter(pk__in=notification_user_id_list)
                user_all_list = User.objects.filter(~Q(pk__in=notification_user_id_list))
                result = {}
                result['notification_detail'] = admin_serializers.NotificationSerializer(notification_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
                result['user_notification'] = admin_serializers.UserSerializer(user_notification_list, many=True).data
        
                return Response(result)
        except Exception, e:
            print 'NotificationUserView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)