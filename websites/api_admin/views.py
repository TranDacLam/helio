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
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Count

"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionView(APIView):
    def get(self, request, format=None):
        try:
            promotion_id =  request.GET.get('id', '')
            if promotion_id:
                item = Promotion.objects.get(pk=promotion_id)
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
            promotion_id = request.GET.get('id', None)
            if promotion_id:
                promotion_detail = Promotion.objects.get(pk=promotion_id)
    
                promotion_user_id_list = Gift.objects.filter(promotion_id=promotion_id).values_list('user_id', flat=True)
                user_promotion_list = User.objects.filter(pk__in=promotion_user_id_list)
                user_all_list = User.objects.filter(~Q(pk__in=promotion_user_id_list))

                result = {}
                result['promotion_detail'] = admin_serializers.PromotionSerializer(promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(user_promotion_list, many=True).data
        
                return Response(result)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


"""
    Get user
    @author :Hoangnguyen

"""
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
            print "UserDetail", e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
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
            print "UserDetail", e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)




"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationView(APIView):
    def get(self, request, format=None):
        try:
            notification_id =  request.GET.get('id', None)
            if notification_id:
                item = Notification.objects.get(pk=notification_id)
                serializer = admin_serializers.NotificationSerializer(item, many=False)
                return Response(serializer.data)
            else:
                lst_item = Notification.objects.all()
                serializer = admin_serializers.NotificationSerializer(lst_item, many=True)
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
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationUserView(APIView):
    def get(self, request, format=None):
        try:
            notification_id = request.GET.get('id', None)
            if notification_id:
                notification_detail = Notification.objects.get(pk=notification_id)
                notification_user_id_list = User_Notification.objects.filter(notification_id=notification_id).values_list('user_id', flat=True)
                user_notification_list = User.objects.filter(pk__in=notification_user_id_list)
                user_all_list = User.objects.filter(~Q(pk__in=notification_user_id_list))
                result = {}
                result['notification_detail'] = admin_serializers.PromotionSerializer(promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
                result['user_notification'] = admin_serializers.UserSerializer(user_promotion_list, many=True).data
        
                return Response(result)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


"""
    Get Summary feedbacks
    @author :Hoangnguyen

"""
@permission_classes((AllowAny,))
class SummaryAPI(APIView):

    def get(self, request, format=None):

        try:
            # get value posiion fourth in url to filter data in DB
            # url_field = status or rate
            url_field = request.get_full_path().split('/')[4]

            start_date_req = self.request.query_params.get('start_date', None)
            end_date_req = self.request.query_params.get('end_date', None)

            kwargs = {}
            #  data does not match format '%Y-%m-%d' return error
            try:
                if start_date_req:
                    kwargs['created__gt'] = timezone.make_aware(datetime.strptime(
                        start_date_req, "%Y-%m-%d"), timezone.get_current_timezone())
                if end_date_req:
                    kwargs['created__lt'] = timezone.make_aware(datetime.strptime(
                        end_date_req, "%Y-%m-%d") + timedelta(days=1), timezone.get_current_timezone())
            
            except ValueError, e:
                error = {"code": 400, "message": "%s" % e, "fields": ""}
                return Response(error, status=400)
            
            if kwargs:
                count_item = FeedBack.objects.filter(
                    **kwargs).values(url_field).annotate(Count(url_field))
            else:
                count_item = FeedBack.objects.all().values(
                    url_field).annotate(Count(url_field))

            return Response({"code": 200, "message": count_item, "fields": ""}, status=200)

        except Exception, e:
            print "SummaryAPI ", e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

"""
    Get user embed 
    @author :Hoangnguyen
    - check barcode is None
    - check barcode is numberric
    - getdata from DB
    - check item is none

"""
@permission_classes((AllowAny,))
class UserEmbedDetail(APIView): 
    def get(self, request, format=None):
            try:

                barcode_req = self.request.query_params.get('barcode', None)

                if barcode_req:
                    barcode = int(barcode_req)
                    cursor = connections['sql_db'].cursor()
                    query_str = """SELECT Cust.Firstname, Cust.Surname, Cust.DOB, Cust.PostCode, Cust.Address1, Cust.EMail, Cust.Mobile_Phone, Cust.Customer_Id  FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id WHERE C.Card_Barcode = {0}"""
                    cursor.execute(query_str.format(barcode))
                    item = cursor.fetchone()

                    if item:
                        result = {}
                        result["barcode"] = barcode # barcode
                        result["first_name"] = item[0] # Firstname
                        result["surname"] = item[1] # Surname
                        result["birthday"] = item[2] # DOB
                        result["peronal_id"] = item[3] # PostCode
                        result["address"] = item[4] # Address1
                        result["email"] = item[5] # EMail
                        result["phone"] = item[6] # Phone
                        return Response(result)
                    return Response({"code": 400, "message": 'Barcode not found', "fields": ""}, status=400)
                
                return Response({"code": 400, "message": 'Bacode is required', "fields": ""}, status=400)
            
            # except if barcode is not number
            except ValueError, e:
                error = {"code": 400, "message": "Barcode is numberic", "fields": ""}
                return Response(error, status=400)
            except Exception, e:
                print "UserEmbedDetail ", e
                error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
                return Response(error, status=500)


