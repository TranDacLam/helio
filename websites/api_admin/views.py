# -*- coding: utf-8 -*-
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
from django.db import DatabaseError
from rest_framework.decorators import parser_classes, authentication_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from django.utils.translation import ugettext_lazy as _
import requests
import traceback
from dateutil.parser import parse
from decorator import check_role_permission
import model_key
import unidecode
import api.helper as helper
import constants as constant

"""
    Get Promotion
    @author: diemnguyen
"""


class PromotionList(APIView):

    @check_role_permission(model_key.promotion)
    def get(self, request, format=None):
        try:
            lst_item = Promotion.objects.all()
            serializer = admin_serializers.PromotionDisplaySerializer(
                lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionListView ', e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion)
    def delete(self, request, format=None):
        """
        DELETE: Multi ids select
        """
        try:
            # Get list id to delete
            list_promotion_id = self.request.data.get('list_promotion_id', [])

            # Check list id is empty
            if list_promotion_id:
                # Delete list objects
                Promotion.objects.filter(pk__in=list_promotion_id).delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response({"code": 400, "message": "List ID must be not empty ", "fields": ""}, status=400)
        except ValueError:
            # Handle the exception
            print 'Please enter an integer'
        except Exception, e:
            print 'PromotionList %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get Promotion By Promotion ID
    @author: diemnguyen
"""


@parser_classes((MultiPartParser, FormParser))
class PromotionDetail(APIView):

    def get_object(self, pk):
        try:
            return Promotion.objects.get(pk=pk)
        except Promotion.DoesNotExist, e:
            raise Http404

    @check_role_permission(model_key.promotion)
    def get(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.PromotionDisplaySerializer(
                item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion)
    def post(self, request, format=None):
        try:
            print request.data
            serializer = admin_serializers.PromotionSerializer(context={'request': request},
                                                               data=request.data)
            if serializer.is_valid():
                # serializer.user_implementer = request.user.id
                # print "serializer.user_implementer"
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionDetailView POST %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion)
    def put(self, request, id, format=None):
        print request.data
        # print request.user

        item = self.get_object(id)
        try:
            serializer = admin_serializers.PromotionSerializer(
                item, context={'request': request}, data=request.data)
            if serializer.is_valid():
                serializer.save()
                dataSerializer = admin_serializers.PromotionDisplaySerializer(
                    item)
                return Response(dataSerializer.data)
            print serializer.errors
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionDetailView PUT %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion)
    def delete(self, request, id, format=None):
        item = self.get_object(id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""
    Get User List By Promotion
    @author: diemnguyen
"""


class PromotionUser(APIView):

    @check_role_permission(model_key.promotion)
    def get(self, request, id, format=None):
        try:
            promotion_detail = Promotion.objects.get(pk=id)
            # Check empty of promtion object
            if promotion_detail:
                try:
                    # Get notification by promotion_id
                    notification = Notification.objects.get(
                        promotion=promotion_detail)
                except Notification.DoesNotExist:
                    notification = None
                # Get list user ID by promition id
                promotion_user_id_list = Gift.objects.filter(
                    promotion_id=id).values_list('user_id', flat=True)

                # Get all list user ID not exist in promotion user list
                user_promotion_list = User.objects.filter(
                    pk__in=promotion_user_id_list)
                user_all_list = User.objects.filter(
                    ~Q(pk__in=promotion_user_id_list))

                # Return result both: notification_id, list promotion user,
                # list all user, promition detail
                result = {}
                result['notification'] = admin_serializers.NotificationSerializer(
                    notification, many=False).data if notification else ''
                result['promotion_detail'] = admin_serializers.PromotionDisplaySerializer(
                    promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(
                    user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(
                    user_promotion_list, many=True).data

                return Response(result)

            return Response({"code": 400, "message": "Promotion not found", "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionUserView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion)
    def post(self, request, id, format=None):
        try:
            # Set is_save to True to block change user list
            promotion = Promotion.objects.get(pk=id)
            promotion.is_save = True
            promotion.save()

            notification = None
            try:
                # Get notification by promotion_id
                notification = Notification.objects.get(
                    promotion=promotion)
            except Notification.DoesNotExist:
                notification = None

            list_user_id = self.request.data.get('list_user_id', '')

            # Get list user by promotion_id
            user_promotion_list = Gift.objects.filter(
                promotion_id=id).values_list('user_id', flat=True)
            # converts ValuesQuerySet into Python list
            list_user_id_db = [str(user_id) for user_id in user_promotion_list]

            # List add new ( exist in params + not exist in database )
            list_add = set(list_user_id) - set(list_user_id_db)
            # List delete item ( not exist in params + exist in database)
            list_delete = set(list_user_id_db) - set(list_user_id)

            # Check list add is not empty then add to database
            if list_add:
                for user_id in list_add:
                    Gift.objects.create( promotion_id = id, user_id = user_id )
                    if notification:
                        User_Notification.objects.create( notification_id = notification.id, user_id = user_id )

            # Check list_delete is not empty then delete from database
            if list_delete:
                Gift.objects.filter(
                    promotion_id=id, user_id__in=list_delete).delete()

                if notification:
                    User_Notification.objects.filter(
                    notification_id=notification.id, user_id__in=list_delete).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception, e:
            print 'PromotionUserView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

"""
    Get Statistics Promotion
    @author: TrangLe
"""


class PromotionStatistic(APIView):

    @check_role_permission(model_key.promotion)
    def get(self, request, pk, format=None):
        try:
            # Get promotion detail by id
            promotion_detail = Promotion.objects.get(pk=pk)
            if promotion_detail:
                result = {}
                # Get list user promotion
                gift_list = Gift.objects.filter(promotion=promotion_detail)

                # Return json with [promotion,total user, total user recieved,
                # not recieved]
                result['promotion'] = admin_serializers.PromotionSerializer(
                    promotion_detail, many=False).data

                result['gift_user'] = admin_serializers.GiftSerializer(
                    gift_list, many=True).data
                result['count_user_total'] = gift_list.count()
                # If is used is True then user recieved gift
                result['count_user_received'] = gift_list.filter(
                    is_used=True).count()
                # List not recieved = total - recieved
                result['count_user_not_received'] = result[
                    'count_user_total'] - result['count_user_received']
                return Response(result, status=200)
            else:
                return Response({"code": 400, "message": "Promotion not found", "fields": ""}, status=400)

        except Promotion.DoesNotExist, e:
            error = {"code": 400, "message": "Promotion not found",
                     "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print 'PromotionStatistic %s', traceback.format_exc()
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)
"""
    Get user
    @author :Hoangnguyen

"""


class UserDetail(APIView):

    @check_role_permission(model_key.link_card)
    def get(self, request, format=None):
        try:
            email = self.request.query_params.get('email', None)
            if email:
                user = User.objects.get(email=email)
                serializer = admin_serializers.UserSerializer(user)
                return Response(serializer.data)
            return Response({"code": 400, "message": _("Email is required."), "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": _("Email Not Found."),
                     "fields": "email"}
            return Response(error, status=400)
        except Exception, e:
            print 'UserDetail %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.link_card)
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = admin_serializers.UserSerializer(
                instance=user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"code": 200, "message": _("update user success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except User.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found User."), "fields": ""}, status=400)

        except Exception, e:
            print 'UserDetail %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET and POST Advertisement
@author: Trangle
"""


class AdvertisementView(APIView):

    @check_role_permission(model_key.advertisement)
    def get(self, request, format=None):
        """
        Get all Advertisement
        """
        try:
            adv_list = Advertisement.objects.all().order_by('-created')
            serializer = admin_serializers.AdvertisementSerializer(
                adv_list, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'AdvertisementView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.advertisement)
    def post(self, request, format=None):
        """
        POST: Create a new Advertisement
        """
        try:

            serializer = admin_serializers.AdvertisementSerializer(
                data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'AdvertisementView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.advertisement)
    def delete(self, request, format=None):
        """
        DELETE: multi checbox
        """
        try:
            adv_id = self.request.data.get('adv_id', None)
            print "Adv_id", adv_id
            if adv_id:
                queryset = Advertisement.objects.filter(
                    pk__in=adv_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "Not found ", "fields": "id"}, status=400)
        except Exception, e:
            print 'AdvertisementView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET, PUT Advertisement Detail
@author: Trangle
"""


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

    @check_role_permission(model_key.advertisement)
    def get(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(advertisement)
        return Response(serializer.data)

    @check_role_permission(model_key.advertisement)
    def put(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(
            advertisement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @check_role_permission(model_key.advertisement)
    def delete(self, request, pk, format=None):
        try:
            advertisement = self.get_object(pk)
            advertisement.delete()

            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Advertisement.DoesNotExist, e:
            return Response({"code": 400, "message": "Not Found Game.", "fields": ""}, status=400)
        except Exception, e:
            print 'AdvertisementApI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)
"""
Get PromotionType
@author: Trangle
"""


class PromotionTypeView(APIView):

    @check_role_permission(model_key.promotion_type)
    def get(self, request, format=None):
        try:
            list_pro_type = Promotion_Type.objects.all()
            serializer = admin_serializers.PromotionTypeSerializer(
                list_pro_type, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionTypeView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get and Post Denomination
    @author: Trangle
"""


class DenominationView(APIView):

    @check_role_permission(model_key.denomination)
    def get(self, request, format=None):
        """
        Get all Denomination to list 
        """
        try:
            list_denomination = Denomination.objects.all().order_by('-created')
            serializer = admin_serializers.DenominationSerializer(
                list_denomination, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'DenominationView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.denomination)
    def post(self, request, format=None):
        """
        Create a new Denomination
        """
        try:
            serializer = admin_serializers.DenominationSerializer(
                data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'DenominationView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.denomination)
    def delete(self, request, format=None):
        """
        DELETE: Multi ids select
        """
        try:
            deno_id = self.request.data.get('deno_id', None)
            print "DENO ID", deno_id
            if deno_id:
                queryset = Denomination.objects.filter(
                    pk__in=deno_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "Not found list id ", "fields": "id"}, status=400)
        except Exception, e:
            print 'DenominationView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

"""
    PUT, DELETE Denomination
    @author: Trangle
"""


class DenominationDetailView(APIView):

    def get_object(self, pk):
        try:
            queryset = Denomination.objects.get(pk=pk)
            return queryset
        except Denomination.DoesNotExist, e:
            raise Http404

    @check_role_permission(model_key.denomination)
    def get(self, request, pk, format=None):
        denomi = self.get_object(pk)

        try:
            serializer = admin_serializers.DenominationSerializer(denomi)
            return Response(serializer.data)
        except Exception, e:
            print 'DenominationDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.denomination)
    def put(self, request, pk, format=None):
        denomi = self.get_object(pk)

        try:
            serializer = admin_serializers.DenominationSerializer(
                denomi, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'DenominationDetailView PUT %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.denomination)
    def delete(self, request, pk, format=None):
        try:
            denomi = self.get_object(pk)
            denomi.delete()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            print 'DenominationDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET FeedBack
@author: TrangLe
"""


class FeedbackView(APIView):

    @check_role_permission(model_key.feedback)
    def get(self, request, format=None):
        """
        Get Feedback
        if exist fields in (status, rate, end_date, start_date) then get it
        else return all feedback
        """
        try:
            status = self.request.query_params.get('status', None)
            rate = self.request.query_params.get('rate', None)
            start_date = self.request.query_params.get('start_date', None)
            end_date = self.request.query_params.get('end_date', None)

            kwargs = {}
            try:
                if start_date:
                    kwargs['created__gte'] = timezone.make_aware(datetime.strptime(
                        start_date, "%d/%m/%Y"))
                    print kwargs['created__gte']
                if end_date:
                    kwargs['created__lte'] = timezone.make_aware(datetime.strptime(
                        end_date, "%d/%m/%Y") + timedelta(days=1))
                    print kwargs['created__lte']
                if status:
                    kwargs['status'] = status
                    print kwargs['status']
                if rate:
                    kwargs['rate'] = rate
                    print kwargs['rate']

            except ValueError, e:
                error = {"code": 400, "message": "%s" % e, "fields": ""}
                return Response(error, status=400)
            result = {}
            if kwargs:
                print "kwargs"
                user = self.request.user
                # list feedback id is readed
                result['feedbacks_is_read'] = User_Feedback.objects.filter(
                    user=user).values_list('feedback', flat=True)
                queryset = FeedBack.objects.filter(
                    **kwargs)
                result['feedbacks'] = admin_serializers.FeedBackSerializer(
                    queryset, many=True).data
                return Response(result)
            else:
                user = self.request.user
                # list feedback id is readed
                result['feedbacks_is_read'] = User_Feedback.objects.filter(
                    user=user).values_list('feedback', flat=True)
                # all feedback
                queryset = FeedBack.objects.all().order_by('-created')
                result['feedbacks'] = admin_serializers.FeedBackSerializer(
                    queryset, many=True).data
                return Response(result)

        except FeedBack.DoesNotExist, e:
            error = {"code": 400, "message": "Field Not Found.", "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print 'FeedbackView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.feedback)
    def delete(self, request, format=None):
        print "Delete"
        try:
            fed_id = request.data.get('fed_id', None)
            print "Fed_id:", fed_id
            print self.request.user.role_id
            # Check if exist fed_id
            if fed_id:
                queryset = FeedBack.objects.filter(pk__in=fed_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": "Not found ID ", "fields": "id"}, status=400)
        except Exception, e:
            print 'FeedbackView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET, PUT, DELETE Feedback by id
@author: Trangle
"""


class FeedbackDetailView(APIView):

    def get_object(self, pk):
        try:
            queryset = FeedBack.objects.get(pk=pk)
            return queryset
        except Exception, e:
            return Response(status=500)
    '''
        get detail feedback
        if user reads feedback, create instance User_Feedback 
    '''
    @check_role_permission(model_key.feedback)
    def get(self, request, pk, format=None):
        try:
            feedback = self.get_object(pk)
            serializer = admin_serializers.FeedBackSerializer(feedback)
            # create User_Feedback 
            user = self.request.user
            User_Feedback.objects.get_or_create(user=user, feedback=feedback)
            return Response(serializer.data)
        except Exception, e:
            print 'FeedbackDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.feedback)
    def put(self, request, pk, format=None):
        feedback = self.get_object(pk)
        serializer = admin_serializers.FeedBackSerializer(
            feedback, data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception, e:
            print 'FeedbackDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.feedback)
    def delete(self, request, pk, format=None):
        feedback = self.get_object(pk)
        try:
            role_id = self.request.user.role_id
            feedback.delete()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            print 'FeedbackDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)
"""
GET all linked users
DELETE all checkbox selected
@author: Trangle
"""


class UserLinkCardList(APIView):

    @check_role_permission(model_key.link_card)
    def get(self, request, format=None):
        """
        Get all user linked card
        """
        try:
            lst_item = User.objects.exclude(
                barcode__isnull=True).order_by('-date_mapping')
            serializer = admin_serializers.UserSerializer(lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'UserLinkCardList %s', traceback.format_exc()
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.link_card)
    def delete(self, request, format=None):
        """
        DELETE: multi checbox
        """
        try:
            user_linked_id = self.request.data.get(
                'user_linked_id', None)

            print "USER_LINKED_ID", user_linked_id

            if user_linked_id:
                queryset = User.objects.filter(
                    pk__in=user_linked_id).update(barcode=None, username_mapping=None, date_mapping=None)
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "Not found ", "fields": "id"}, status=400)
        except Exception, e:
            print 'UserLinkCardList %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
Get Notification List
@author: diemnguyen
"""


class NotificationList(APIView):

    @check_role_permission(model_key.notification)
    def get(self, request, format=None):
        try:
            lst_item = Notification.objects.all()
            serializer = admin_serializers.NotificationSerializer(
                lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'NotificationList %s', traceback.format_exc()
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.notification)
    def delete(self, request, format=None):
        """
        DELETE: Multi ids select
        """
        try:
            # Get list id to delete
            list_notification_id = self.request.data.get(
                'list_notification_id', [])

            # Check list id is empty
            if list_notification_id:

                Notification.objects.filter(
                    pk__in=list_notification_id).delete()
                return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": "List ID Not found ", "fields": ""}, status=400)
        except ValueError:
            # Handle the exception
            print 'Please enter an integer'
        except Exception, e:
            print 'NotificationList %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get Notification Detail
    @author : diemnguyen

"""


@parser_classes((MultiPartParser, FormParser))
class NotificationDetail(APIView):

    def get_object(self, pk):
        try:
            return Notification.objects.get(pk=pk)
        except Notification.DoesNotExist, e:
            raise Http404

    @check_role_permission(model_key.notification)
    def get(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(
                item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'NotificationDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.notification)
    def post(self, request, format=None):
        try:
            print request.data
            serializer = admin_serializers.NotificationSerializer(
                data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print 'NotificationDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.notification)
    def put(self, request, id, format=None):
        print request.data
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(
                item, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'NotificationDetailView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.notification)
    def delete(self, request, id, format=None):
        item = self.get_object(id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""
    Get User List By Notification
    @author : diemnguyen

"""


class NotificationUser(APIView):

    @check_role_permission(model_key.notification)
    def get(self, request, id):
        try:
            notification_detail = Notification.objects.get(pk=id)
            user_all_list = []
            user_notification_list = []

            notification_user_id_list = User_Notification.objects.filter(
                notification_id=id).values_list('user_id', flat=True)
            user_notification_list = User.objects.filter(
                pk__in=notification_user_id_list)
            user_all_list = User.objects.filter(
                ~Q(pk__in=notification_user_id_list))

            result = {}
            result['notification_detail'] = admin_serializers.NotificationSerializer(
                notification_detail, many=False).data
            result['user_all'] = admin_serializers.UserSerializer(
                user_all_list, many=True).data
            result['user_notification'] = admin_serializers.UserSerializer(
                user_notification_list, many=True).data

            return Response(result)

        except Notification.DoesNotExist, e:
            error = {"code": 400, "message": "Id Not Found.", "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print 'NotificationUser %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.notification)
    def post(self, request, id):
        try:
            # Update modified time notification
            notification = Notification.objects.get(pk=id)
            notification.save()

            list_user_id = self.request.data.get('list_user_id', '')

            # Get list user by notification_id
            user_notification_list = User_Notification.objects.filter(
                notification_id=id).values_list('user_id', flat=True)
            list_user_id_db = [str(user_id)
                               for user_id in user_notification_list]

            # List add new ( exist in params + not exist in database)
            list_add = set(list_user_id) - set(list_user_id_db)
            # List delete item ( not exist in params + exist in database)
            list_delete = set(list_user_id_db) - set(list_user_id)

            # Check list add is not empty then add to database
            if list_add:
                for user_id in list_add:
                    item = User_Notification()
                    item.notification_id = id
                    item.user_id = user_id
                    item.save()

            # Check list_delete is not empty then delete from database
            if list_delete:
                User_Notification.objects.filter(
                    notification_id=id, user_id__in=list_delete).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception, e:
            print 'NotificationUser %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get Summary feedbacks
    @author :Hoangnguyen
    if search_field is none then get status and rate feedback
    if search_field is rate then get rate feedback
    if search_field is status then get status feedback

"""


class SummaryAPI(APIView):

    @check_role_permission(model_key.feedback)
    def get(self, request, format=None):
        try:
            start_date_req = self.request.query_params.get('start_date', None)
            end_date_req = self.request.query_params.get('end_date', None)
            kwargs = {}
            if start_date_req:
                kwargs['created__gt'] = timezone.make_aware(datetime.strptime(
                    start_date_req, "%d/%m/%Y"))
            if end_date_req:
                kwargs['created__lt'] = timezone.make_aware(datetime.strptime(
                    end_date_req, "%d/%m/%Y") + timedelta(days=1))
            if kwargs:
                feedback = FeedBack.objects.filter(**kwargs)
            else:
                feedback = FeedBack.objects.all()
            # search_field is status or rate or None
            search_field = self.request.query_params.get('search_field', None)
            count_item = {}

            # if no search_field get both status and rate
            get_all = True if search_field is None else False

            # get status json
            if search_field == 'status' or get_all:
                count_item['status'] = {
                    'answered': 0, 'moved': 0, 'no_process': 0}
                count_status = feedback.values(
                    'status').annotate(Count('status'))
                count_item['status_sum'] = 0
                for item in count_status:
                    if item['status'] == '':
                        continue
                    count_item['status'][
                        item['status']] = item['status__count']
                    count_item['status_sum'] = count_item[
                        'status_sum'] + item['status__count']
            # get rate json
            if search_field == 'rate' or get_all:
                count_item['rate'] = {
                    'nomal': 0, 'notbad': 0, 'good': 0, 'great': 0, 'bad': 0}
                count_rate = feedback.values('rate').annotate(Count('rate'))
                count_item['rate_sum'] = 0

                print count_rate

                RATE_MAPPING = {
                    'binh thuong': 'nomal',
                    'khong co gi': 'notbad',
                    'tot': 'good',
                    'tuyet voi': 'great',
                    'khong tot': 'bad'
                }

                for item in count_rate:
                    if item['rate']:
                        # Remove vietnames accent and lower string
                        rate = unidecode.unidecode(item['rate']).lower()
                        if rate in RATE_MAPPING:
                            # Return count group by rate
                            count_item['rate'][RATE_MAPPING[
                                rate]] = item['rate__count']
                            # return sum rate
                            count_item['rate_sum'] = count_item[
                                'rate_sum'] + item['rate__count']

            # if search_field is not status and rate
            if search_field is not None and search_field != 'rate' and search_field != 'status':
                return Response({"code": 400, "message": "Not found search field", "fields": ""}, status=400)

            return Response({"code": 200, "message": count_item, "fields": ""}, status=200)
        except Exception, e:
            print 'SummaryAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get user embed 
    @author :Hoangnguyen
    - check barcode is None
    - check barcode is numberric
    - getdata from DB
    - check item is none

"""


class UserEmbedDetail(APIView):

    @check_role_permission(model_key.link_card)
    def get(self, request, format=None):
        try:
            result = {}
            barcode = request.query_params.get('barcode', '')
            if barcode:
                if not barcode.isdigit():
                    return Response({"code": 400, "message":  _('Bacode is required'), "fields": ""}, status=400)

                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': settings.DMZ_API_TOKEN
                }
                card_information_api_url = '{}card/{}/information/'.format(
                    settings.BASE_URL_DMZ_API, barcode)

                response = requests.get(card_information_api_url, params={
                                        'is_full_info': True}, headers=headers)

               # handle decoding json
                try:
                    # convert response text to json
                    json_data = response.json()
                except ValueError as e:
                    print "Error convert json : %s" % e
                    return Response({"code": 500, "message": _("Handle data error.")}, status=500)

                # Process DMZ reponse 
                result = helper.code_mapping_error_dmz(response.status_code, json_data)

                if response.status_code != 200 :
                    print "DMZ Response Text:::", response.text
                    return Response(result, status=result['code'])

                # If barcode is exist then dmz then return data. else return {}
                if not result:
                    return Response({"code": 400, "message": _("Barcode not found."), "fields": ""}, status=400)
                # check Customer_Id is exist
                if not result['customer_id']:
                    return Response({"code": 400, "message": _("Card has no user."), "fields": ""}, status=400)

                # check user embed is related
                user_app = User.objects.filter(barcode=barcode)

                first_name = result['first_name'] if result[
                    'first_name'] else ''
                surname = result['surname'] if result[
                    'surname'] else ''
                result['full_name'] = (first_name + ' ' + surname).strip()
                result['birth_date'] = datetime.strftime(
                    parse(result['birthday']), '%d/%m/%Y') if result['birthday'] else ''
                result['address'] = result['address']
                result['email'] = result['email']
                result['phone'] = result['phone']
                result['customer_id'] = result['customer_id']
                result['cards_state'] = result['card_state']
                result['address'] = result['address']
                result['barcode'] = barcode
                result['personal_id'] = result['peronal_id']
                result['is_related'] = True if user_app else False
                return Response(result, status=200)

            return Response({"code": 400, "message": _('Bacode is required'), "fields": ""}, status=400)

        except Exception, e:
            print "Errors UserEmbedDetail GET  : ", traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.link_card)
    def put(self, request, barcode):
        """
            update user embed 
            @author :Hoangnguyen
            - check barcode is in DB
            - validate form
            - getdata from DB

        """
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': settings.DMZ_API_TOKEN
            }
            card_information_api_url = '{}card/{}/information/'.format(
                settings.BASE_URL_DMZ_API, barcode)

            serializer = admin_serializers.UserEmbedSerializer(
                data=request.data)

            if not serializer.is_valid():
                return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

            headers = {
                'Content-Type': 'application/json',
                'Authorization': settings.DMZ_API_TOKEN
            }
            card_information_api_url = '{}card/{}/information/'.format(
                settings.BASE_URL_DMZ_API, barcode)

            # Call DMZ get card infomation
            response = requests.put(card_information_api_url, data=json.dumps(
                request.data), headers=headers)

            # translate message when update success
            if response.status_code == 200:
                result = response.json()
                result["message"] = _(result["message"])
                return Response(result, status=response.status_code)
            # Process DMZ reponse 
            return helper.dmz_response_process(response)

        except Exception, e:
            print "Errors UserEmbedDetail PUT  : ", traceback.format_exc()
            # print "UserEmbedDetail ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    relate user with user embed 
    @author :Hoangnguyen

"""


class RelateAPI(APIView):

    @check_role_permission(model_key.link_card)
    def post(self, request, format=None):
        """
            - check user exist by email
            - check user is related
            - check user embed is exist
            - check user embed is related

        """
        try:
            barcode = request.data.get('barcode', None)
            email = request.data.get('email', None)

            if barcode and email:

                # check user by email
                user = User.objects.get(email=email)
                # check user is related
                if user.barcode:
                    return Response({"code": 400, "message": _("User is related."), "fields": ""}, status=400)

                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': settings.DMZ_API_TOKEN
                }
                card_information_api_url = '{}card/{}/information/'.format(
                    settings.BASE_URL_DMZ_API, barcode)

                response = requests.get(card_information_api_url, params={
                                        'is_full_info': True}, headers=headers)

                # handle decoding json
                try:
                    # convert response text to json
                    json_data = response.json()
                except ValueError as e:
                    print "Error convert json : %s" % e
                    return Response({"code": 500, "message": _("Handle data error.")}, status=500)

                # Process DMZ reponse 
                result = helper.code_mapping_error_dmz(response.status_code, json_data)

                if response.status_code != 200 :
                    print "DMZ Response Text:::", response.text
                    return Response(result, status=result['code'])

                # If barcode is exist then dmz then return data. else return {}
                if not result:
                    return Response({"code": 400, "message": _("Barcode not found."), "fields": ""}, status=400)
                # check Customer_Id is exist
                if not result['customer_id']:
                    return Response({"code": 400, "message": _("Card has no user."), "fields": ""}, status=400)

                MAPPING_ERROR = {
                    1: _("Card is locked."),
                    2: _("Card is used.")
                }

                if result['card_state'] in MAPPING_ERROR:
                    return Response({"code": 400, "message": MAPPING_ERROR[result['card_state']], "fields": ""}, status=400)

                if result['card_state'] > 2:
                    return Response({"code": 400, "message": _("Card is invalid."), "fields": ""}, status=400)

                # check user embed is related
                userembed_is_related = User.objects.filter(barcode=barcode)
                if userembed_is_related:
                    return Response({"code": 400, "message": _("Userembed is related."), "fields": ""}, status=400)

                user.barcode = barcode
                user.username_mapping = request.user.email
                user.date_mapping = datetime.now()
                user.save()
                return Response({"code": 200, "message": _("relate success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": _("Email and barcode is required"), "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": _(
                "Email Not Found."), "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print 'RelateAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.link_card)
    def delete(self, request, id, format=None):
        """
            - check user is related
            - delete barcode, date_mapping, username_mapping

        """
        try:
            user = User.objects.get(id=id)
            if user.barcode:
                user.barcode = None
                user.date_mapping = None
                user.username_mapping = None
                user.save()
                return Response({"code": 200, "message": _("cancel relate success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": _("User is not related"), "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": _(
                "Not Found User."), "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print 'RelateAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    get all fee 
    @author :Hoangnguyen

"""


class FeeAPI(APIView):

    @check_role_permission(model_key.fee)
    def post(self, request, format=None):
        try:
            feeSerializer = admin_serializers.FeeSerializer(data=request.data)

            if feeSerializer.is_valid():
                if feeSerializer.validated_data['is_apply']:
                    position = feeSerializer.validated_data['position']
                    fee = Fee.objects.filter(position=position, is_apply=True)
                    if fee:
                        fee.update(is_apply=False)
                feeSerializer.save()
                return Response(feeSerializer.data)

            return Response({"code": 400, "message": feeSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'FeeAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.fee)
    def get(self, request, id, format=None):
        try:
            fee = Fee.objects.get(id=id)
            serializer = admin_serializers.FeeSerializer(fee)
            return Response(serializer.data)

        except Fee.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Fee"), "fields": ""}, status=400)
        except Exception, e:
            print "FeeAPI ", traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.fee)
    def put(self, request, id, format=None):
        try:
            fee = Fee.objects.get(id=id)

            serializer = admin_serializers.FeeSerializer(
                fee, data=request.data)

            if serializer.is_valid():
                if serializer.validated_data['is_apply']:
                    position = serializer.validated_data['position']
                    f = Fee.objects.filter(position=position, is_apply=True)
                    if f:
                        f.update(is_apply=False)
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Fee.DoesNotExist, e:
            error = {"code": 400, "message": "Not Found Fee", "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print 'FeeAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.fee)
    def delete(self, request, id, format=None):
        try:
            fee = Fee.objects.get(id=id)
            fee.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Fee.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Fee"), "fields": ""}, status=400)
        except Exception, e:
            print 'FeeAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


class FeeApplyAPI(APIView):

    @check_role_permission(model_key.fee)
    def put(self, request, id, format=None):
        try:
            fee = Fee.objects.get(id=id)

            # cancel apply fee
            if fee.is_apply:
                fee.is_apply = False
                fee.save()
            else:
                # apply fee
                list_fee = Fee.objects.filter(
                    position=fee.position, is_apply=True)
                if list_fee:
                    list_fee.update(is_apply=False)
                fee.is_apply = True
                fee.save()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)

        except Fee.DoesNotExist, e:
            error = {"code": 400, "message": "Not Found Fee", "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print 'FeeApplyAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


class FeeListAPI(APIView):

    @check_role_permission(model_key.fee)
    def get(self, request, format=None):
        try:
            fee = Fee.objects.all()
            feeSerializer = admin_serializers.FeeSerializer(fee, many=True)
            return Response(feeSerializer.data)

        except Exception, e:
            print 'FeeListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.fee)
    def delete(self, request, format=None):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:

                fees = Fee.objects.filter(id__in=list_id)
                if fees:
                    fees.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Fee"), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id"), "fields": ""}, status=400)

        except Exception, e:
            print 'FeeListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET: Get All Banner
    POST: Add New Banner
    DELETE: Delete All Banner Selected
    @author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class BannerView(APIView):

    @check_role_permission(model_key.banner)
    def get(self, request, format=None):
        """
        Get All Banner
        """
        print "Method GET"
        try:
            banners = Banner.objects.all().order_by('-created')
            serializer = admin_serializers.BannerSerializer(banners, many=True)
            return Response(serializer.data)

        except Exception, e:
            print 'BannerView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.banner)
    def post(self, request, format=None):
        print "Method POST"
        try:
            serializer = admin_serializers.BannerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'BannerView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.banner)
    def delete(self, request, format=None):
        """
        Delete All Banner Selected
        """
        print "Method DELETE"
        try:
            # Get list id banner to delete
            banner_id = self.request.data.get('banner_id', None)
            print "LIST BANNER ID DELETE : ", banner_id

            # Check list id banner is valid
            if banner_id:
                Banner.objects.filter(pk__in=banner_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "List ID Not found ", "fields": ""}, status=400)
        except Exception, e:
            print 'BannerView %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET, PUT, DELETE Banner by id
    @author: Trangle
"""


@parser_classes((MultiPartParser, JSONParser))
class BannerViewDetail(APIView):

    def get_object(self, pk):
        try:
            queryset = Banner.objects.get(pk=pk)
            return queryset
        except Banner.DoesNotExist, e:
            raise Http404

    @check_role_permission(model_key.banner)
    def get(self, request, pk, format=None):
        banner = self.get_object(pk)
        try:
            serializer = admin_serializers.BannerSerializer(banner)
            return Response(serializer.data)

        except Exception, e:
            print 'BannerViewDetail %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.banner)
    def put(self, request, pk, format=None):
        print('request', request.data)
        banner = self.get_object(pk)
        try:
            print('banner', banner)

            serializer = admin_serializers.BannerSerializer(
                banner, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print serializer.errors
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print 'BannerViewDetail %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.banner)
    def delete(self, request, pk, format=None):
        try:
            banner = self.get_object(pk)
            banner.delete()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            print 'BannerViewDetail %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get All CategoryNotifications
    @author :diemnguyen

"""


class CategoryNotifications(APIView):

    def get(self, request, format=None):
        try:
            category_noti_list = Category_Notification.objects.all()
            serializer = admin_serializers.CategoryNotificationSerializer(
                category_noti_list, many=True)
            return Response({"code": 204, "message": serializer.data, "fields": ""}, status=200)

        except Exception, e:
            print 'CategoryNotifications %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Event
    @author :Hoangnguyen

"""


@parser_classes((MultiPartParser, JSONParser))
class EventAPI(APIView):

    @check_role_permission(model_key.event)
    def get(self, request, id):
        try:
            event = Event.objects.get(id=id)
            eventSerializer = admin_serializers.EventSerializer(event)
            return Response(eventSerializer.data)
        except Event.DoesNotExist, e:
            print "Event Not Exist"
            return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)

        except Exception, e:
            print 'EventAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.event)
    def post(self, request, format=None):
        try:
            eventSerializer = admin_serializers.EventSerializer(
                data=request.data)
            if eventSerializer.is_valid():
                eventSerializer.save()
                return Response(eventSerializer.data)
            return Response({"code": 400, "message": eventSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'EventAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.event)
    def put(self, request, id):
        try:
            event = Event.objects.get(id=id)
            eventSerializer = admin_serializers.EventSerializer(
                instance=event, data=request.data, context={'request': request})
            if eventSerializer.is_valid():
                eventSerializer.save()
                return Response(eventSerializer.data)
            return Response({"code": 400, "message": eventSerializer.errors, "fields": ""}, status=400)

        except Event.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)

        except Exception, e:
            print 'EventAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.event)
    def delete(self, request, id, format=None):
        try:
            event = Event.objects.get(id=id)
            event.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Event.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)
        except Exception, e:
            print 'EventAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    EventList
    @author :Hoangnguyen

"""


class EventListAPI(APIView):

    @check_role_permission(model_key.event)
    def get(self, request, format=None):
        try:
            events = Event.objects.all()
            eventSerializer = admin_serializers.EventSerializer(
                events, many=True)
            return Response(eventSerializer.data)
        except Exception, e:
            print 'EventListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.event)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                events = Event.objects.filter(id__in=list_id)
                if events:
                    events.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)
        except Exception, e:
            print 'EventListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    PromotionLabel
    @author :Hoangnguyen

"""


@parser_classes((JSONParser,))
class PromotionLabelAPI(APIView):

    def get_object(self, id):
        try:
            return Promotion_Label.objects.get(id=id)

        except Promotion_Label.DoesNotExist, e:
            raise Http404

    @check_role_permission(model_key.promotion_label)
    def get(self, request, id):
        try:
            promotionLabel = Promotion_Label.objects.get(id=id)
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                promotionLabel)
            return Response(promotionLabelSerializer.data)

        except Promotion_Label.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Promotion Label."), "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionLabelAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion_label)
    def post(self, request, format=None):
        try:
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                data=request.data)
            if promotionLabelSerializer.is_valid():
                promotionLabelSerializer.save()
                return Response(promotionLabelSerializer.data)
            return Response({"code": 400, "message": promotionLabelSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'PromotionLabelAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion_label)
    def put(self, request, id):
        promotionLabel = self.get_object(id)
        try:
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                instance=promotionLabel, data=request.data)
            if promotionLabelSerializer.is_valid():
                promotionLabelSerializer.save()
                return Response(promotionLabelSerializer.data)
            return Response({"code": 400, "message": promotionLabelSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'PromotionLabelAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion_label)
    def delete(self, request, id):
        try:
            promotionLabel = Promotion_Label.objects.get(id=id)
            promotionLabel.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Promotion_Label.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Promotion Label."), "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionLabelAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    PromotionLabelList
    @author :Hoangnguyen

"""


class PromotionLabelListAPI(APIView):

    @check_role_permission(model_key.promotion_label)
    def get(self, request):
        try:
            promotionLabels = Promotion_Label.objects.all()
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                promotionLabels, many=True)
            return Response(promotionLabelSerializer.data)
        except Exception, e:
            print 'PromotionLabelListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.promotion_label)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                promotionLabels = Promotion_Label.objects.filter(
                    id__in=list_id)
                if promotionLabels:
                    promotionLabels.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Promotion Label."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Exception, e:
            print 'PromotionLabelListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Hot
    @author :Hoangnguyen

"""


@parser_classes((MultiPartParser, JSONParser))
class HotAPI(APIView):

    @check_role_permission(model_key.hot)
    def get(self, request, id):
        try:
            hot = Hot.objects.get(id=id)
            hotSerializer = admin_serializers.HotSerializer(hot)
            return Response(hotSerializer.data)

        except Hot.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)
        except Exception, e:
            print 'HotAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot)
    def post(self, request, format=None):
        try:
            hotSerializer = admin_serializers.HotSerializer(data=request.data)
            if hotSerializer.is_valid():
                hotSerializer.save()
                return Response(hotSerializer.data)
            return Response({"code": 400, "message": hotSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'HotAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot)
    def put(self, request, id):
        try:
            print request.data
            hot = Hot.objects.get(id=id)
            hotSerializer = admin_serializers.HotSerializer(
                instance=hot, data=request.data, context={'request': request})
            if hotSerializer.is_valid():
                hotSerializer.save()
                return Response(hotSerializer.data)
            return Response({"code": 400, "message": hotSerializer.errors, "fields": ""}, status=400)

        except Hot.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)

        except Exception, e:
            print 'HotAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot)
    def delete(self, request, id, format=None):
        try:
            hot = Hot.objects.get(id=id)
            hot.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Hot.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)
        except Exception, e:
            print 'HotAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    HotListAPI
    @author :Hoangnguyen
"""


class HotListAPI(APIView):

    @check_role_permission(model_key.hot)
    def get(self, request):
        try:
            hot = Hot.objects.all()
            hotSerializer = admin_serializers.HotSerializer(hot, many=True)
            return Response(hotSerializer.data)
        except Exception, e:
            print 'HotListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                hots = Hot.objects.filter(id__in=list_id)
                if hots:
                    hots.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Exception, e:
            print 'HotListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Post 
    @author :Hoangnguyen
"""


@parser_classes((MultiPartParser, JSONParser))
class PostAPI(APIView):

    @check_role_permission(model_key.post)
    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)
            postSerializer = admin_serializers.PostSerializer(post)
            return Response(postSerializer.data)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Post."), "fields": ""}, status=400)

        except Exception, e:
            print 'PostAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.post)
    def post(self, request, format=None):
        try:
            postSerializer = admin_serializers.PostSerializer(
                data=request.data, context={'request': request})
            if postSerializer.is_valid():
                postSerializer.save()
                return Response(postSerializer.data)
            return Response({"code": 400, "message": postSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'PostAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.post)
    def put(self, request, id):
        try:
            post = Post.objects.get(id=id)
            postSerializer = admin_serializers.PostSerializer(
                instance=post, data=request.data, context={'request': request})
            if postSerializer.is_valid():
                postSerializer.save()
                return Response(postSerializer.data)
            return Response({"code": 400, "message": postSerializer.errors, "fields": ""}, status=400)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": "Not Found Post.", "fields": ""}, status=400)

        except Exception, e:
            print 'PostAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.post)
    def delete(self, request, id, format=None):
        try:
            post = Post.objects.get(id=id)
            post.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Post."), "fields": ""}, status=400)
        except Exception, e:
            print 'PostAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    PostList
    @author :Hoangnguyen
 
"""


class PostListAPI(APIView):

    @check_role_permission(model_key.post)
    def get(self, request):
        try:
            post = Post.objects.all()
            postSerializer = admin_serializers.PostListSerializer(
                post, many=True)
            return Response(postSerializer.data)
        except Exception, e:
            print 'HotListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.post)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                posts = Post.objects.filter(id__in=list_id)
                if posts:
                    posts.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Posts."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Exception, e:
            print 'HotListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    PostTypeList
    @author :Hoangnguyen
 
"""


class PostTypeListAPI(APIView):

    def get(self, request):
        try:
            post_Type = Post_Type.objects.all()
            postSerializer = admin_serializers.PostTypeSerializer(
                post_Type, many=True)
            return Response(postSerializer.data)
        except Exception, e:
            print 'PostTypeListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    FAQ 
    @author :Hoangnguyen
"""


@parser_classes((JSONParser,))
class FAQAPI(APIView):

    @check_role_permission(model_key.faq)
    def get(self, request, id):
        try:
            faq = FAQ.objects.get(id=id)
            faqSerializer = admin_serializers.FAQSerializer(faq)
            return Response(faqSerializer.data)

        except FAQ.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found FAQ."), "fields": ""}, status=400)
        except Exception, e:
            print 'FAQAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.faq)
    def post(self, request, format=None):
        try:
            faqSerializer = admin_serializers.FAQSerializer(data=request.data)
            if faqSerializer.is_valid():
                faqSerializer.save()
                return Response(faqSerializer.data)
            return Response({"code": 400, "message": faqSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'FAQAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.faq)
    def put(self, request, id):
        try:
            faq = FAQ.objects.get(id=id)
            faqSerializer = admin_serializers.FAQSerializer(
                instance=faq, data=request.data)
            if faqSerializer.is_valid():
                faqSerializer.save()
                return Response(faqSerializer.data)
            return Response({"code": 400, "message": faqSerializer.errors, "fields": ""}, status=400)

        except FAQ.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found FAQ."), "fields": ""}, status=400)
        except Exception, e:
            print 'FAQAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.faq)
    def delete(self, request, id, format=None):
        try:
            faq = FAQ.objects.get(id=id)
            faq.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except FAQ.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found FAQ."), "fields": ""}, status=400)
        except Exception, e:
            print 'FAQAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    FAQList
    @author :Hoangnguyen
 
"""


class FAQListAPI(APIView):

    @check_role_permission(model_key.faq)
    def get(self, request):
        try:
            faq = FAQ.objects.all()
            faqSerializer = admin_serializers.FAQSerializer(faq, many=True)
            return Response(faqSerializer.data)
        except Exception, e:
            print 'FAQListAPI %s', traceback.format_exc()
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.faq)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                faqs = FAQ.objects.filter(id__in=list_id)
                if faqs:
                    faqs.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found FAQs."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Exception, e:
            print "FAQListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


class GeneratorQRCode(APIView):

    @check_role_permission(model_key.promotion)
    def post(self, request, id, format=None):
        try:
            promotion = Promotion.objects.get(pk=id)
            promotion.generate_qrcode()

            if promotion.QR_code:
                return Response({"qr_code_url": promotion.QR_code.url}, status=200)

            return Response(status=400)
        except Promotion.DoesNotExist, e:
            return Response(status=400)


"""
    Get All Category
    @author :diemnguyen

"""


class CategoryList(APIView):

    def get(self, request, format=None):
        try:
            category_list = Category.objects.all()
            serializer = admin_serializers.CategorySerializer(
                category_list, many=True)
            return Response(serializer.data)

        except Exception, e:
            print "FeeAPI ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET, DELETE, POST User
@author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class UserListView(APIView):
    """
        Method: GET
        Get All User
    """

    def get(self, request, format=None):
        print "METHOD GET"
        try:
            users = User.objects.all().order_by('-date_joined')
            serializer = admin_serializers.UserRoleDisplaySerializer(
                users, many=True)
            return Response(serializer.data)

        except Exception, e:
            print "List User", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    """
        Method:POST
        Create Users
    """

    def post(self, request, format=None):
        print "METHOD POST"
        try:
            serializer = admin_serializers.UserCreateSerializer(
                data=request.data)
            if serializer.is_valid():
                print "serializer", serializer
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "User ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    """
        Method: DELETE
        Delete all user check
    """

    def delete(self, request, format=None):
        print "METHOD DELETE"
        try:
            # Get role_id
            role_id = self.request.user.role_id
            # Check role_id
            if role_id == constant.SYSTEM_ADMIN:
                # Get list user id to delete
                user_id = self.request.data.get('user_id', None)
                print "User List Id", user_id

                # Check list user id
                if user_id:
                    User.objects.filter(pk__in=user_id).delete()
                    return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": "List ID Not found ", "fields": ""}, status=400)
            else:
                return Response({"code": 403, "message": _("Just System Admin accept delete"), "fields": ""}, status=403)
        except Exception, e:
            print e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET, PUT User Detail
    @author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class UserDetailView(APIView):

    def get_object(self, pk):
        try:
            queryset = User.objects.get(pk=pk)
            return queryset
        except User.DoesNotExist, e:
            raise Http404

    """
        Get User By Id
    """

    def get(self, request, pk, format=None):
        print "METHOD GET"

        user = self.get_object(pk)
        try:
            serializer = admin_serializers.UserRoleDisplaySerializer(user)
            return Response(serializer.data)
        except Exception, e:
            print 'UserDetailView ', e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    """
        Update User By Id
    """

    def put(self, request, pk, format=None):
        print "METHOD PUT"

        user = self.get_object(pk)
        try:
            serializer = admin_serializers.UserRoleSerializer(
                user, data=request.data, context={'request': request})

            if serializer.is_valid():
                if (self.request.user.is_staff == True and self.request.user.role_id != constant.SYSTEM_ADMIN and user.is_staff == True):
                    return Response({"code": 403, "message": _("This function is only for System Admin"), "fields": ""}, status=403)
                if(serializer.validated_data['new_password']):
                    if(self.request.user.role_id == constant.SYSTEM_ADMIN):
                        user.set_password(
                            self.request.data.get("new_password"))
                    else:
                        return Response({"code": 403, "message": _("Just System Admin Change password"), "fields": ""}, status=403)
                else:
                    user.password = self.request.data.get(
                        'password', user.password)
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'UserDetailView PUT', e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, pk, format=None):
        print "METHOD DELETE"

        user = self.get_object(pk)
        try:
            # Get role_id when user login
            role_id = self.request.user.role_id
            # If role = System admin(role_id=1). Accept delete user
            if role_id == constant.SYSTEM_ADMIN:
                print "role_id", role_id
                user.delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            else:
                return Response({"code": 403, "message": _("Just System Admin accept delete"), "fields": ""}, status=403)
        except Exception, e:
            print 'UserDetailView PUT', e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

"""
    GET: Get Al Roles
    @author: TrangLes
"""


class RolesView(APIView):

    def get(self, request, format=None):
        print "Method Get"

        try:
            role = Roles.objects.all()
            serializer = admin_serializers.RolesSerializer(role, many=True)
            return Response(serializer.data)

        except Exception, e:
            print 'UserDetailView PUT', e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Game 
    @author :Hoangnguyen
"""


@parser_classes((MultiPartParser,))
class GameAPI(APIView):

    @check_role_permission(model_key.game)
    def get(self, request, id):
        try:
            game = Game.objects.get(id=id)
            gameSerializer = admin_serializers.GameSerializer(game)
            return Response(gameSerializer.data)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.game)
    def post(self, request, format=None):
        try:
            gameSerializer = admin_serializers.GameSerializer(
                data=request.data)
            if gameSerializer.is_valid():
                gameSerializer.save()
                return Response(gameSerializer.data)
            return Response({"code": 400, "message": gameSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "GameAPI ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.game)
    def put(self, request, id):
        try:
            game = Game.objects.get(id=id)
            print request.data
            gameSerializer = admin_serializers.GameSerializer(
                instance=game, data=request.data, context={'request': request})
            if gameSerializer.is_valid():
                gameSerializer.save()
                return Response(gameSerializer.data)
            return Response({"code": 400, "message": gameSerializer.errors, "fields": ""}, status=400)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.game)
    def delete(self, request, id, format=None):
        try:
            game = Game.objects.get(id=id)
            game.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GameList
    @author :Hoangnguyen
 
"""


class GameListAPI(APIView):

    @check_role_permission(model_key.game)
    def get(self, request):
        try:
            game = Game.objects.all()
            gameSerializer = admin_serializers.GameSerializer(game, many=True)
            return Response(gameSerializer.data)
        except Exception, e:
            print "GameListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.game)
    def delete(self, request):
        try:
            list_id = request.data.get('list_id', None)
            if list_id:
                games = Game.objects.filter(id__in=list_id)
                if games:
                    games.delete()
                    return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": _("Not Found Games."), "fields": ""}, status=400)
            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Exception, e:
            print "GameListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    TypeList
    @author :Hoangnguyen
 
"""


class TypeListAPI(APIView):

    def get(self, request):
        try:
            types = Type.objects.all()
            typeSerializer = admin_serializers.TypeSerializer(types, many=True)
            return Response(typeSerializer.data)
        except Exception, e:
            print "TypeListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET, POST, DELETE Hot_Advs 
    @author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class HotAdvsView(APIView):

    @check_role_permission(model_key.hot_ads)
    def get(self, request):
        try:
            hot_advs = Hot_Advs.objects.all().order_by('-created')
            serializer = admin_serializers.HotAdvsSerializer(
                hot_advs, many=True)
            return Response(serializer.data)
        except Exception, e:
            print "Hot_advs List", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot_ads)
    def post(self, request, format=None):
        print "Method POST"
        try:
            serializer = admin_serializers.HotAdvsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "Hot_Advs ", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot_ads)
    def delete(self, request, format=None):
        """
        Delete All Hot_Advs Selected
        """
        print "Method DELETE"
        try:
            # Get list id Hot_Advs to delete
            hot_advs_id = self.request.data.get('hot_advs_id', None)
            print "LIST Hot_Advs ID DELETE : ", hot_advs_id

            # Check list id Hot_Advs is valid
            if hot_advs_id:
                Hot_Advs.objects.filter(pk__in=hot_advs_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "List ID Not found ", "fields": ""}, status=400)
        except Exception, e:
            print e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

"""
    PUT, DELETE Hot Ads
    @author: Trangle
"""


@parser_classes((MultiPartParser, JSONParser))
class HotAdvsDetailView(APIView):
    """
    Retrieve, update, delete detail hot_ads by ID
    """

    def get_object(self, pk):
        try:
            queryset = Hot_Advs.objects.get(pk=pk)
            return queryset
        except Hot_Advs.DoesNotExist, e:
            print e
            raise Http404

    @check_role_permission(model_key.hot_ads)
    def get(self, request, pk, format=None):
        hot_ads = self.get_object(pk)
        try:
            serializer = admin_serializers.HotAdvsSerializer(hot_ads)
            return Response(serializer.data)
        except Exception, e:
            print e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot_ads)
    def put(self, request, pk, format=None):
        hot_ads = self.get_object(pk)

        try:
            serializer = admin_serializers.HotAdvsSerializer(
                instance=hot_ads, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print "Error", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    @check_role_permission(model_key.hot_ads)
    def delete(self, request, pk, format=None):
        try:
            hot_ads = self.get_object(pk)
            hot_ads.delete()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    RoleList
    @author :Hoangnguyen
 
"""


class RoleListAPI(APIView):

    def get(self, request):
        try:
            roles = Roles.objects.all().order_by('id')
            roleSerializer = admin_serializers.RoleSerializer(roles, many=True)
            return Response(roleSerializer.data)
        except Exception, e:
            print "RoleListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    UserRoleList
    @author :Hoangnguyen
    case 1: get user by role_id
    case 2: get user is staff, no role
"""


class UserRoleListAPI(APIView):

    def get(self, request):
        check_role = self.request.user.role_id
        try:
            if check_role == constant.SYSTEM_ADMIN:
                role_id = self.request.query_params.get('role_id', None)
                if not role_id:
                    return Response({"code": 400}, status=400)

                result = {}

                users_selected = User.objects.filter(
                    role_id=role_id).order_by('-date_joined')
                users_all = User.objects.filter(
                    is_staff=True, role__isnull=True).order_by('-date_joined')

                result['users_selected'] = admin_serializers.UserSerializer(
                    users_selected, many=True).data
                result['users_all'] = admin_serializers.UserSerializer(
                    users_all, many=True).data

                return Response(result)
            return Response({"code": 403, "message": _("This function is only for System Admin"), "fields": ""}, status=403)

        except Roles.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Role."), "fields": ""}, status=400)
        except Exception, e:
            print "UserListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    SetRole
    @author :Hoangnguyen
    check role exist
    case 1: set role for users
            clear all users of role
            set role for user
    case 2: clear all users of role
    
    
"""


class SetRoleAPI(APIView):

    def put(self, request, role_id):

        check_role = self.request.user.role_id
        try:
            if check_role == constant.SYSTEM_ADMIN:
                role = Roles.objects.get(id=role_id)
                list_id = request.data.get('list_id', None)
                if list_id:
                    # set role for users
                    users = User.objects.filter(id__in=list_id)
                    print "users", users
                    if users:
                        role.user_role_rel.set(users)
                        return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
                    return Response({"code": 400, "message": _("Not Found users."), "fields": ""}, status=400)
                # list_id is empty then clear all user of role
                role.user_role_rel.clear()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 403, "message": _("This function is only for System Admin"), "fields": ""}, status=403)

        except Roles.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Role."), "fields": ""}, status=400)
        except Exception, e:
            print "UserListAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    OpenTimeAPI
    @author :Hoangnguyen
"""


class OpenTimeAPI(APIView):
    '''
        if first_record > start_date, create date
        if last_record < end_date, create date
        from first_record to last_record
            if date in record, update else create date

    '''
    # list for create date
    create_objs = list()

    @check_role_permission(model_key.open_time)
    def post(self, request, format=None):
        try:
            # validate data
            serializer = admin_serializers.OpenTimeSerializer(
                data=request.data)
            if not serializer.is_valid():
                return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

            day_of_week = serializer.data[
                'day_of_week'] if 'day_of_week' in serializer.data else None
            start_time = serializer.data['start_time']
            end_time = serializer.data['end_time']
            start_date = datetime.strptime(
                serializer.data['start_date'], "%d/%m/%Y").date()
            end_date = datetime.strptime(
                serializer.data['end_date'], "%d/%m/%Y").date()

            kwargs = {}
            if day_of_week:
                kwargs['open_date__week_day__in'] = day_of_week
            kwargs['open_date__gte'] = start_date
            kwargs['open_date__lt'] = end_date + timedelta(days=1)
            # get record in db
            record = OpenTime.objects.filter(**kwargs).order_by('open_date')

            if record:
                first_record = record.first().open_date
                last_record = record.last().open_date
                # to create date
                if first_record > start_date:
                    self.createUpdateDate(
                        start_date, first_record - timedelta(days=1), day_of_week, start_time, end_time)
                if last_record < end_date:
                    self.createUpdateDate(
                        last_record + timedelta(days=1), end_date, day_of_week, start_time, end_time)
                # to update date
                self.createUpdateDate(
                    first_record, last_record, day_of_week, start_time, end_time, record)
            else:
                # to create date
                self.createUpdateDate(
                    start_date, end_date, day_of_week, start_time, end_time)
            # bulk create date in db
            OpenTime.objects.bulk_create(OpenTimeAPI.create_objs)
            OpenTimeAPI.create_objs = []
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            print "OpenTimeAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)
    '''
        Loop from start_date to end_date to create or update date
        step 1: if day_of_week then check date is in_day_of_week and create or update date
        step 2: if record then create or update date
                else create date
    '''

    def createUpdateDate(self, start_date, end_date, day_of_week, start_time, end_time, record=None):
        # list for update date
        update_objs = list()
        for i in range(int((end_date - start_date).days + 1)):
            in_day_of_week = False
            # check day is in day_of_week
            if day_of_week:
                # day_of_week from 1 (Sunday) to 7 (Saturday).
                # weekday() from 0 (Monday) to 6 (Sunday)
                number = (start_date + timedelta(days=i)).weekday() + 2
                if number == 8:
                    number = 1
                if number in day_of_week:
                    in_day_of_week = True
            #  to create or update date
            if not day_of_week or in_day_of_week:
                # check each date is in record
                if record:
                    date_is_exist = record.filter(
                        open_date=start_date + timedelta(days=i))
                    if date_is_exist:
                        update_objs.append(start_date + timedelta(days=i))
                    else:
                        OpenTimeAPI.create_objs.append((OpenTime(
                            open_date=start_date + timedelta(days=i), start_time=start_time, end_time=end_time)))
                else:
                    OpenTimeAPI.create_objs.append((OpenTime(
                        open_date=start_date + timedelta(days=i), start_time=start_time, end_time=end_time)))
        # bulk update date in db
        OpenTime.objects.filter(open_date__in=update_objs).update(
            start_time=start_time, end_time=end_time)

    @check_role_permission(model_key.open_time)
    def get(self, request):
        try:
            month = request.query_params.get('month', None)
            year = request.query_params.get('year', None)
            if month and year:
                open_time = OpenTime.objects.filter(
                    Q(open_date__year=year) & Q(open_date__month=month))
                openTimeDisplaySerializer = admin_serializers.OpenTimeDisplaySerializer(
                    open_time, many=True)
                return Response(openTimeDisplaySerializer.data)
            return Response({"code": 400, "message": _("Not found month and year."), "fields": ""}, status=400)
        except Exception, e:
            print "OpenTimeAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)
"""
    UserRoleAPI
    @author :Hoangnguyen
"""


class UserRoleAPI(APIView):

    def get(self, request):
        role_id = self.request.user.role_id
        try:
            if role_id == constant.SYSTEM_ADMIN:
                model_name = Model_Name.objects.all().order_by('name')
                model_name_serializer = admin_serializers.RolesPerDisplaySerializer(
                    model_name, many=True)
                return Response(model_name_serializer.data)
            return Response({"code": 403, "message": _("This function is only for System Admin"), "fields": ""}, status=403)
        except Exception, e:
            print "UserRoleAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, format=None):
        '''
            get all record in DB
            if data has no id, create object
            if data has id, update object
            if record is not in data, delete record
        '''
        print "Role data: ", request.data
        role_id = self.request.user.role_id
        try:
            if role_id == constant.SYSTEM_ADMIN:
                instances = Roles_Permission.objects.all()
                serializer = admin_serializers.RolesPerSerializer(
                    instance=instances, data=request.data, many=True, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    model_name = Model_Name.objects.all()
                    model_name_serializer = admin_serializers.RolesPerDisplaySerializer(
                        model_name, many=True)
                    return Response(model_name_serializer.data)
                return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
            return Response({"code": 403, "message": _("This function is only for System Admin"), "fields": ""}, status=403)
        except Exception, e:
            print "UserRoleAPI", e
            error = {"code": 500, "message": _(
                "Internal Server Error"), "fields": ""}
            return Response(error, status=500)
