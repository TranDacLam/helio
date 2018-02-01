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
from django.http import Http404

from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser
"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionList(APIView):
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
class PromotionDetail(APIView):
    def get_object(self, pk):
        try:
            return Promotion.objects.get(pk=pk)
        except Promotion.DoesNotExist, e:
            raise Http404
    def get(self, request, id, format=None):
        item = get_object(id)
        try:
            serializer = admin_serializers.PromotionSerializer(item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionDetailView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)


"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class PromotionUser(APIView):
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
GET and POST Advertisement
@author: Trangle
"""     
@permission_classes((AllowAny, ))
class AdvertisementView(APIView):

    def get(self, request, format=None):
        """
        Get all Advertisement
        """
        try:
            adv_id = self.request.query_params.get('adv_id', None)
            if adv_id:
                adv_id_list = adv_id.split(',')
                queryset = Advertisement.objects.filter(pk__in=adv_id_list).delete()
                # serializer = admin_serializers.AdvertisementSerializer(queryset, many=True)
                # return Response(serializer.data).delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
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
@author: Trangle
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

    def delete(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        advertisement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
"""
Get PromotionType
@author: Trangle
"""
@permission_classes((AllowAny, ))
class PromotionTypeView(APIView):
    def get(self, request, format=None):
        try:
            list_pro_type = Promotion_Type.objects.all()
            serializer = admin_serializers.PromotionTypeSerializer(list_pro_type, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "Internal Server Error", "fields":""}
            return Response(error, status=500)
"""
    Get and Post Denomination
    @author: Trangle
"""
@permission_classes((AllowAny, ))
class DenominationView(APIView):
    def get(self, request, format=None):
        """
        Get all Denomination to list 
        """
        try:
            deno_id = self.request.query_params.get('deno_id', None)
            if deno_id:
                deno_id_list = deno_id.split(',')
                queryset = Denomination.objects.filter(pk__in =deno_id_list).delete()
                # serializer = admin_serializers.DenominationSerializer(queryset, many=True)
                # return Response(serializer.data)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                list_denomination = Denomination.objects.all()
                serializer = admin_serializers.DenominationSerializer(list_denomination, many=True)
                return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "Internal Server Error", "fields":""}
            return Response(error, status=500)

    def post(self, request, format=None):
        """
        Create a new Denomination
        """
        serializer = admin_serializers.DenominationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny,))
class NotificationList(APIView):
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
@parser_classes((MultiPartParser,))
class NotificationDetail(APIView):
    def get_object(self, pk):
        try:
            return Notification.objects.get(pk=pk)
        except Notification.DoesNotExist, e:
            raise Http404

    def get(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'NotificationDetailView GET', e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            serializer = admin_serializers.NotificationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'NotificationDetailView PUT',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

    def put(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(item, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'NotificationDetailView PUT',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        item = self.get_object(id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

"""
    Get Promotion
"""

@permission_classes((AllowAny,))
class NotificationUser(APIView):
    def get(self, request, id):
        try:
            notification_detail = Notification.objects.get(pk=id)
            notification_user_id_list = User_Notification.objects.filter(notification_id=id).values_list('user_id', flat=True)
            user_notification_list = User.objects.filter(pk__in=notification_user_id_list)
            user_all_list = User.objects.filter(~Q(pk__in=notification_user_id_list))
            result = {}
            result['notification_detail'] = admin_serializers.NotificationSerializer(notification_detail, many=False).data
            result['user_all'] = admin_serializers.UserSerializer(user_all_list, many=True).data
            result['user_notification'] = admin_serializers.UserSerializer(user_notification_list, many=True).data
    
            return Response(result)
            
        except Notification.DoesNotExist, e:
            error = {"code": 400, "message": "Id Not Found.", "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print 'NotificationUserView ',e
            error = {"code": 500, "message": "Internal Server Error" , "fields": ""}
            return Response(error, status=500)

"""
    Get Summary feedbacks
    @author :Hoangnguyen

"""
@permission_classes((AllowAny,))
class SummaryAPI(APIView):

    def get(self, request, format=None):

        try:
            search_field = self.request.query_params.get('search_field', None)

            if search_field == 'status' or search_field == 'rate':
                start_date_req = self.request.query_params.get('start_date', None)
                end_date_req = self.request.query_params.get('end_date', None)

                kwargs = {}
                #  data does not match format '%Y-%m-%d' return error
                try:
                    if start_date_req:
                        kwargs['created__gt'] = timezone.make_aware(datetime.strptime(
                            start_date_req, "%Y-%m-%d"))
                    if end_date_req:
                        kwargs['created__lt'] = timezone.make_aware(datetime.strptime(
                            end_date_req, "%Y-%m-%d") + timedelta(days=1))
                except ValueError, e:
                    error = {"code": 400, "message": "%s" % e, "fields": ""}
                    return Response(error, status=400)
                
                if kwargs:
                    count_item = FeedBack.objects.filter(
                        **kwargs).values(search_field).annotate(Count(search_field))
                else:
                    count_item = FeedBack.objects.all().values(
                        search_field).annotate(Count(search_field))

                return Response({"code": 200, "message": count_item, "fields": ""}, status=200)

            return Response({"code": 400, "message": "Not found search field", "fields": ""}, status=400)

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

            barcode = self.request.query_params.get('barcode', None)

            if barcode:
                if not barcode.isdigit():
                    return Response({"code": 400, "message": "Barcode is numberic", "fields": ""}, status=400)
                cursor = connections['sql_db'].cursor()
                query_str = """SELECT Cust.Firstname, Cust.Surname, Cust.DOB, Cust.PostCode, Cust.Address1, 
                                    Cust.EMail, Cust.Mobile_Phone, Cust.Customer_Id  
                                FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                                WHERE C.Card_Barcode = {0}"""
                cursor.execute(query_str.format(barcode))
                item = {}
                item = cursor.fetchone()
                # check Customer_Id
                if item and item[7]:
                    result = {}
                    result["barcode"] = barcode  # barcode
                    result["full_name"] = item[0] + item[1]  # Firstname + Surname
                    result["birth_date"] = item[2].date()  # DOB
                    result["personal_id"] = item[3]  # PostCode
                    result["address"] = item[4]  # Address1
                    result["email"] = item[5]  # EMail
                    result["phone"] = item[6]  # Phone
                    return Response({"code": 200, "message": result, "fields": ""}, status=200)
                return Response({"code": 400, "message": 'Barcode not found', "fields": ""}, status=400)

            return Response({"code": 400, "message": 'Bacode is required', "fields": ""}, status=400)

        except Exception, e:
            print "UserEmbedDetail ", e
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)

    def put(self, request, barcode):
        """
            update user embed 
            @author :Hoangnguyen
            - check barcode is in DB
            - validate form
            - getdata from DB

        """
        try:
            cursor = connections['sql_db'].cursor()

            query_barcode = """SELECT Card_Barcode FROM Cards WHERE Cards.Card_Barcode = '{0}'"""
            cursor.execute(query_barcode.format(barcode))
            check_barcode = cursor.fetchone()
            if not check_barcode:
                return Response({"code": 400, "message": "Barcode not found", "fields": ""}, status=400)

            serializer = admin_serializers.UserEmbedSerializer(
                data=request.data)

            if serializer.is_valid():
                query_str = """UPDATE Customers SET Firstname = '{4}',Surname = '', Email = '{6}',
                 Mobile_Phone = '{2}', DOB = '{1}', PostCode = '{3}', Address1 = '{5}'  
                WHERE Customers.Customer_Id IN (SELECT Cust.Customer_Id  
                FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                WHERE C.Card_Barcode = '{0}')"""

                cursor.execute(query_str.format(barcode, serializer.data['birth_date'], serializer.data['phone'], serializer.data[
                               'personal_id'], serializer.data['full_name'], serializer.data['address'], serializer.data['email']))

                return Response({"code": 200, "message": "success", "fields": ""}, status=200)

            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        # catching db embed error
        except DatabaseError, e:
            print "UserEmbedDetail ", e
            error = {"code": 500,
                     "message": "Query to DB embed fail", "fields": ""}
            return Response(error, status=500)

        except Exception, e:
            print "UserEmbedDetail ", e
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)

"""
    relate user with user embed 
    @author :Hoangnguyen

"""
@permission_classes((AllowAny,))
class RelateAPI(APIView):

    def post(self, request, format=None):
        """
            - check user by email
            - check user is related
            - check user embed is exist
            - check user embed is related

        """
        try:
            barcode = self.request.query_params.get('barcode', None)
            email = self.request.query_params.get('email', None)
            if barcode and email:

                # check user by email
                user = User.objects.get(email=email)

                # check user is related
                if user.barcode:
                    return Response({"code": 400, "message": "User is related.", "fields": ""}, status=400)

                cursor = connections['sql_db'].cursor()
                query_str = """SELECT Cust.Firstname, Cust.Surname, Cust.DOB, Cust.PostCode, Cust.Address1, 
                                    Cust.EMail, Cust.Mobile_Phone, Cust.Customer_Id
                    FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                    WHERE C.Card_Barcode = '{0}'"""
                cursor.execute(query_str.format(barcode))
                userembed_item = cursor.fetchone()

                # check user embed is exist by check Customer_Id
                if not userembed_item[7]:
                    return Response({"code": 400, "message": "Not found Userembed.", "fields": ""}, status=400)
                
                # check user embed is related
                userembed_is_related = User.objects.filter(barcode=barcode)
                if userembed_is_related:
                    return Response({"code": 400, "message": "Userembed is related.", "fields": ""}, status=400)

                user.barcode = barcode
                user.username_mapping = request.user.username
                user.date_mapping = datetime.now().date()
                user.save()

                # return data 
                serializer = admin_serializers.UserSerializer(user)
                result = {}
                result['user'] =  serializer.data
                result['user_embed'] ={}
                result['user_embed']["barcode"] = barcode  # barcode
                result['user_embed']["full_name"] = userembed_item[0] + userembed_item[1]  # Firstname + Surname
                result['user_embed']["birth_date"] = userembed_item[2].date()  # DOB
                result['user_embed']["personal_id"] = userembed_item[3]  # PostCode
                result['user_embed']["address"] = userembed_item[4]  # Address1
                result['user_embed']["email"] = userembed_item[5]  # EMail
                result['user_embed']["phone"] = userembed_item[6]  # Phone
                return Response({"code": 200, "message": result, "fields": ""}, status=200)
            
            return Response({"code": 400, "message": "Email and barcode is required", "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": "Email Not Found.", "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print "RelateAPI ", e
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)
    
    def delete(self, request, format=None):
        """
            - check user by email
            - check user is related
            - delete barcode, date_mapping, username_mapping

        """
        try:
            email = self.request.query_params.get('email', None)
            if email:
                user = User.objects.get( email = email )
                if user.barcode:
                    user.barcode = None
                    user.date_mapping = None
                    user.username_mapping = None
                    user.save()
                    return Response({"code": 200, "message": "success", "fields": ""}, status=200)
                return Response({"code": 400, "message": "User is not related", "fields": ""}, status=400)

            return Response({"code": 400, "message": "Email is required", "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": "Email Not Found.", "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print "RelateAPI ", e
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)

