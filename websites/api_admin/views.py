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

"""
    Get Promotion
    @author: diemnguyen
"""


class PromotionList(APIView):

    def get(self, request, format=None):
        try:
            lst_item = Promotion.objects.all()
            serializer = admin_serializers.PromotionDisplaySerializer(
                lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionListView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.PromotionDisplaySerializer(
                item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'PromotionDetailView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print 'PromotionDetailView POST', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, id, format=None):
        print request.data
        # print request.user

        item = self.get_object(id)
        try:
            serializer = admin_serializers.PromotionSerializer(
                item, context={'request': request}, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print serializer.errors
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status = 400)
        except Exception, e:
            print 'PromotionDetailView PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        item = self.get_object(id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""
    Get User List By Promotion
    @author: diemnguyen
"""


class PromotionUser(APIView):

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
                result['notification_id'] = notification.id if notification else ''
                result['promotion_detail'] = admin_serializers.PromotionDisplaySerializer(
                    promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(
                    user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(
                    user_promotion_list, many=True).data

                return Response(result)

            return Response({"code": 400, "message": "Promotion not found", "fields": ""}, status=400)
        except Exception, e:
            print 'PromotionUserView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, id, format=None):
        try:
            # Set is_save to True to block change user list
            promotion = Promotion.objects.get(pk=id)
            promotion.is_save = True
            promotion.save()

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
                    item = Gift()
                    item.promotion_id = id
                    item.user_id = user_id
                    item.save()

            # Check list_delete is not empty then delete from database
            if list_delete:
                Gift.objects.filter(
                    promotion_id=id, user_id__in=list_delete).delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception, e:
            print 'PromotionUserView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

"""
    Get Statistics Promotion
    @author: TrangLe
"""
class PromotionStatistic(APIView):
    def get(self, request, pk, format=None):
        try:
            promotion_detail = Promotion.objects.get(pk=pk)
            if promotion_detail:
                # Get list user ID by promition id
                promotion_user_id_list = Gift.objects.filter(
                    promotion_id=pk).values_list('user_id', flat=True)

                user_promotion_list = User.objects.filter(
                    pk__in=promotion_user_id_list)

                gift_list = Gift.objects.filter(user_id__in=promotion_user_id_list)

                result = {}

                result['promotion'] = admin_serializers.PromotionSerializer(
                    promotion_detail, many=False).data
                result['gift_user'] = admin_serializers.GiftSerializer(gift_list, many=True).data

                result['count_user_total'] = user_promotion_list.count()
                result['count_user_device'] = promotion_user_id_list.exclude(device_id__isnull=True).count()
                result['count_user'] = result['count_user_total'] - result['count_user_device']

                return Response(result, status=200)
            else:
                return Response({"code": 400, "message": "Promotion not found", "fields": ""}, status=400)
        
        except Promotion.DoesNotExist, e:
            error = {"code": 400, "message": "Promotion not found",
                     "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print 'PromotionStatistic ', e
            error = {"code": 500, "message": "Internal Server Error", "fields": ""}
            return Response(error, status=500)
"""
    Get user
    @author :Hoangnguyen

"""


class UserDetail(APIView):

    def get(self, request, format=None):
        try:
            email = self.request.query_params.get('email', None)
            if email:
                user = User.objects.get(email=email)
                if user.social_auth.exists():
                    return Response({"code": 400, "message": _("Don't allow user signup by facebook."), "fields": ""}, status=400)
                serializer = admin_serializers.UserSerializer(user)
                return Response(serializer.data)
            return Response({"code": 400, "message": _("Email is required."), "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": _("Email Not Found."),
                     "fields": "email"}
            return Response(error, status=400)
        except Exception, e:
            print "UserDetail", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            if user.social_auth.exists():
                return Response({"code": 400, "message": _("Don't allow user signup by facebook."), "fields": ""}, status=400)
            serializer = admin_serializers.UserSerializer(
                instance=user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"code": 200, "message": _("update user success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except User.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found User."), "fields": ""}, status=400)

        except Exception, e:
            print "UserDetail", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET and POST Advertisement
@author: Trangle
"""


class AdvertisementView(APIView):

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
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    def delete(self, request, format=None):
        """
        DELETE: multi checbox
        """
        try:
            adv_id = self.request.data.get('adv_id', None)
            print "Adv_id", adv_id
            if adv_id:
                # queryset = Advertisement.objects.filter(
                #     pk__in=adv_id).delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 400, "message": "Not found ", "fields": "id"}, status=400)
        except Exception, e:
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(advertisement)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        advertisement = self.get_object(pk)
        serializer = admin_serializers.AdvertisementSerializer(
            advertisement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try: 
            advertisement = self.get_object(pk)
            advertisement.delete()

            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Advertisement.DoesNotExist, e:
            return Response({"code": 400, "message": "Not Found Game.", "fields": ""}, status=400)
        except Exception, e:
            print "AdvertisementApI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)
"""
Get PromotionType
@author: Trangle
"""


class PromotionTypeView(APIView):

    def get(self, request, format=None):
        try:
            list_pro_type = Promotion_Type.objects.all()
            serializer = admin_serializers.PromotionTypeSerializer(
                list_pro_type, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            list_denomination = Denomination.objects.all().order_by('-created')
            serializer = admin_serializers.DenominationSerializer(
                list_denomination, many=True)
            return Response(serializer.data)
        except Exception, e:
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
GET FeedBack
@author: TrangLe
"""


class FeedbackView(APIView):

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

            if kwargs:
                print "kwargs"
                queryset = FeedBack.objects.filter(
                    **kwargs)
                serializer = admin_serializers.FeedBackSerializer(
                    queryset, many=True)
                return Response(serializer.data)
            else:
                queryset = FeedBack.objects.all().order_by('-created')
                serializer = admin_serializers.FeedBackSerializer(
                    queryset, many=True)
                return Response(serializer.data)
            return Response({"code": 200, "message": queryset, "fields": ""}, status=200)

        except FeedBack.DoesNotExist, e:
            error = {"code": 400, "message": "Field Not Found.", "fields": ""}
            return Response(error, status=400)
        except Exception, e:
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, format=None):
        print "Delete"
        try:
            fed_id = request.data.get('fed_id', None)
            print "Fed_id:", fed_id
            print self.request.user.role_id
            # Check if exist fed_id
            if fed_id:
                if self.request.user.role_id == 1:
                    queryset = FeedBack.objects.filter(pk__in=fed_id).delete()
                    return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 405, "message": _("Just System Admin accept delete"), "fields": ""}, status=405)
            return Response({"code": 400, "message": "Not found ID ", "fields": "id"}, status=400)
        except Exception, e:
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, pk, format=None):
        feedback = self.get_object(pk)
        serializer = admin_serializers.FeedBackSerializer(feedback)
        return Response(serializer.data)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, pk, format=None):
        feedback = self.get_object(pk)
        try:
            role_id = self.request.user.role_id
            if role_id == 1:
                feedback.delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            return Response({"code": 405, "message": _("Just System Admin accept delete"), "fields": ""}, status=405)
        except Exception, e:
            print 'FeedbackDetailView delete', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)
"""
GET all linked users
DELETE all checkbox selected
@author: Trangle
"""


class UserLinkCardList(APIView):

    def get(self, request, format=None):
        """
        Get all user linked card
        """
        try:
            lst_item = User.objects.exclude(barcode__isnull=True).order_by('-date_mapping')
            serializer = admin_serializers.UserSerializer(lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

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
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
Get Notification List
@author: diemnguyen
"""


class NotificationList(APIView):

    def get(self, request, format=None):
        try:
            lst_item = Notification.objects.all()
            serializer = admin_serializers.NotificationSerializer(
                lst_item, many=True)
            return Response(serializer.data)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

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
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, id, format=None):
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(
                item, many=False)
            return Response(serializer.data)
        except Exception, e:
            print 'NotificationDetailView GET', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            print request.data
            serializer = admin_serializers.NotificationSerializer(
                data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status = 400)
        except Exception, e:
            print 'NotificationDetailView PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, id, format=None):
        print request.data
        item = self.get_object(id)
        try:
            serializer = admin_serializers.NotificationSerializer(
                item, data=request.data, context = {'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status = 400)
            
        except Exception, e:
            print 'NotificationDetailView PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        item = self.get_object(id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""
    Get User List By Notification
    @author : diemnguyen

"""


class NotificationUser(APIView):

    def get(self, request, id):
        try:
            notification_detail = Notification.objects.get(pk=id)
            user_all_list = []
            user_notification_list = []

            # If exist promotion id, get list user from promotion, later set list user for notification
            if notification_detail.promotion:
                promotion_id = notification_detail.promotion.id
                # Get list user ID by promition id
                notification_user_id_list = Gift.objects.filter(
                    promotion_id=promotion_id).values_list('user_id', flat=True)
                # Get all list user ID not exist in promotion user list
                user_notification_list = User.objects.filter(
                    pk__in=notification_user_id_list)
                user_all_list = User.objects.filter(
                    ~Q(pk__in=notification_user_id_list))
            else:
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
            print 'NotificationUserView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, id):
        try:
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
            print 'NotificationUserView ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Get Summary feedbacks
    @author :Hoangnguyen
    if search_field is none then get status and rate feedback
    if search_field is rate then get rate feedback
    if search_field is status then get status feedback

"""


class SummaryAPI(APIView):

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
                count_status = feedback.values('status').annotate(Count('status'))
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
                for item in count_rate:
                    if item['rate'] == '':
                        continue
                    if item['rate'] == 'Bình thường':
                        count_item['rate']['nomal'] = item['rate__count']
                    if item['rate'] == 'Không có gì':
                        count_item['rate']['notbad'] = item['rate__count']
                    if item['rate'] == 'Tốt':
                        count_item['rate']['good'] = item['rate__count']
                    if item['rate'] == 'Tuyệt vời':
                        count_item['rate']['great'] = item['rate__count']
                    if item['rate'] == 'Xấu':
                        count_item['rate']['bad'] = item['rate__count']
                    count_item['rate_sum'] = count_item[
                        'rate_sum'] + item['rate__count']

            # if search_field is not status and rate
            if search_field is not None and search_field != 'rate' and search_field != 'status':
                return Response({"code": 400, "message": "Not found search field", "fields": ""}, status=400)

            return Response({"code": 200, "message": count_item, "fields": ""}, status=200)
        except Exception, e:
            print "SummaryAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, format=None):
        try:

            barcode = self.request.query_params.get('barcode', None)

            if barcode:
                if not barcode.isdigit():
                    return Response({"code": 400, "message":  _('Bacode is required'), "fields": ""}, status=400)
                cursor = connections['sql_db'].cursor()
                query_str = """SELECT Cust.Firstname, Cust.Surname, Cust.DOB, Cust.PostCode, Cust.Address1, 
                                    Cust.EMail, Cust.Mobile_Phone, Cust.Customer_Id, C.Card_State
                                FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                                WHERE C.Card_Barcode = {0} """
                cursor.execute(query_str.format(barcode))
                item = {}
                item = cursor.fetchone()
                # check item is exist
                if not item:
                    return Response({"code": 400, "message": _("Barcode not found."), "fields": ""}, status=400)
                # check Customer_Id is exist
                if not item[7]:
                    return Response({"code": 400, "message": _("Card has no user."), "fields": ""}, status=400)

                result = {}
                first_name = item[0] if item[0] else ''  # Firstname
                surname = item[1] if item[1] else ''  # Surname
                result["barcode"] = barcode
                result["full_name"] = first_name + ' '+  surname
                result["birth_date"] = item[2].strftime(
                    '%d/%m/%Y') if item[2] else None  # DOB
                result["personal_id"] = item[
                    3] if item[3] else None  # PostCode
                result["address"] = item[4] if item[4] else None  # Address1
                result["email"] = item[5] if item[5] else None  # EMail
                result["phone"] = item[6] if item[6] else None  # Phone
                result["customer_id"] = item[7] if item[7] else None #customer_id
                result["cards_state"] = item[8] if item[8] is not None else None#cards_state
                # card_state is 0 or 1 or 2
                # status 200 to front-end show data
                if item[8] != 0:
                    return Response({"code": 400, "message": result, "fields": ""}, status=200)

                return Response({"code": 200, "message": result, "fields": ""}, status=200)

            return Response({"code": 400, "message": _('Bacode is required'), "fields": ""}, status=400)

        # catching db embed error
        except DatabaseError, e:
            print "UserEmbedDetail ", e
            error = {"code": 500,
                     "message": _("Query to DB embed fail"), "fields": ""}
            return Response(error, status=500)

        except Exception, e:
            print "UserEmbedDetail ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

            query_barcode = """SELECT C.Card_State, Cust.Customer_Id
                                FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                                WHERE C.Card_Barcode = {0}"""
            cursor.execute(query_barcode.format(barcode))
            item = cursor.fetchone()
            if not item:
                return Response({"code": 400, "message": _("Barcode not found"), "fields": ""}, status=400)
            # card_state is 0 or 1 or 2
            if item[0] != 0:
                if item[0] == 2:
                    return Response({"code": 400, "message": _("Card is used."), "fields": ""}, status=400)
                if item[0] == 1:
                    return Response({"code": 400, "message": _("Card is locked."), "fields": ""}, status=400)
                return Response({"code": 400, "message": _("Card is invalid."), "fields": ""}, status=400)
            # check Customer_Id is exist
            if not item[1]:
                return Response({"code": 400, "message": _("Card has no user."), "fields": ""}, status=400)
            
            serializer = admin_serializers.UserEmbedSerializer(
                data=request.data)

            if serializer.is_valid():
                # convert string to date
                birth_date = datetime.strptime(serializer.data['birth_date'], "%d/%m/%Y").date()
                query_str = """UPDATE Customers SET Firstname = N'{4}',Surname = '', Email = '{6}',
                 Mobile_Phone = '{2}', DOB = '{1}', PostCode = '{3}', Address1 = N'{5}'  
                WHERE Customers.Customer_Id IN (SELECT Cust.Customer_Id  
                FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                WHERE C.Card_Barcode = '{0}')"""

                cursor.execute(query_str.format(barcode, birth_date, serializer.data['phone'], serializer.data[
                               'personal_id'], serializer.data['full_name'], serializer.data['address'], serializer.data['email']))
                
                return Response({"code": 200, "message": _("update userembed success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        # catching db embed error
        except DatabaseError, e:
            print "UserEmbedDetail ", e
            error = {"code": 500,
                     "message": _("Query to DB embed fail"), "fields": ""}
            return Response(error, status=500)

        except Exception, e:
            print "UserEmbedDetail ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    relate user with user embed 
    @author :Hoangnguyen

"""


class RelateAPI(APIView):

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
                # check user signup by facebook
                if user.social_auth.exists():
                    return Response({"code": 400, "message": _("Don't allow user signup by facebook."), "fields": ""}, status=400)
                # check user is related
                if user.barcode:
                    return Response({"code": 400, "message": _("User is related."), "fields": ""}, status=400)
                
                # check user embed is exist
                cursor = connections['sql_db'].cursor()
                query_str = """SELECT C.Card_State, Cust.Customer_Id
                    FROM Cards C LEFT JOIN Customers Cust ON C.Customer_Id = Cust.Customer_Id 
                    WHERE C.Card_Barcode = '{0}'"""
                cursor.execute(query_str.format(barcode))
                userembed_item = cursor.fetchone()
                if not userembed_item:
                    return Response({"code": 400, "message": _("Barcode not found"), "fields": ""}, status=400)
                # card_state is 0 or 1 or 2
                if userembed_item[0] != 0:
                    if userembed_item[0] == 2:
                        return Response({"code": 400, "message": _("Card is used."), "fields": ""}, status=400)
                    if userembed_item[0] == 1:
                        return Response({"code": 400, "message": _("Card is locked."), "fields": ""}, status=400)
                    return Response({"code": 400, "message": _("Card is invalid."), "fields": ""}, status=400)
                # check Customer_Id is exist
                if not userembed_item[1]:
                    return Response({"code": 400, "message": _("Card has no user."), "fields": ""}, status=400)
                
                # check user embed is related
                userembed_is_related = User.objects.filter(barcode=barcode)
                if userembed_is_related:
                    return Response({"code": 400, "message": _("Userembed is related."), "fields": ""}, status=400)

                user.barcode = barcode
                # TO DO
                user.username_mapping = request.user.email
                user.date_mapping = datetime.now()
                user.save()
                return Response({"code": 200, "message": _("relate success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": _("Email and barcode is required"), "fields": ""}, status=400)

        except User.DoesNotExist, e:
            error = {"code": 400, "message": _("Email Not Found."), "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print "RelateAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 400, "message": _("Not Found User."), "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print "RelateAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    get all fee 
    @author :Hoangnguyen

"""


class FeeAPI(APIView):

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
            print "FeeAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 400, "message": "Not Found Fee.", "fields": ""}
            return Response(error, status=400)

        except Exception, e:
            print "FeeAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


class FeeListAPI(APIView):

    def get(self, request, format=None):
        try:
            fee = Fee.objects.all()
            feeSerializer = admin_serializers.FeeSerializer(fee, many=True)
            return Response(feeSerializer.data)

        except Exception, e:
            print "FeeListAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "FeeListAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET: Get All Banner
    POST: Add New Banner
    DELETE: Delete All Banner Selected
    @author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class BannerView(APIView):

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
            print e
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        print "Method POST"
        try:
            serializer = admin_serializers.BannerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "banner ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, pk, format=None):
        banner = self.get_object(pk)
        try:
            serializer = admin_serializers.BannerSerializer(banner)
            return Response(serializer.data)

        except Exception, e:
            print 'BannerViewDetail ', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, pk, format=None):
        print('request', request.data)
        banner = self.get_object(pk)
        try:
            print('banner', banner)

            serializer = admin_serializers.BannerSerializer(
                banner, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print serializer.errors
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)
        except Exception, e:
            print 'BannerViewDetail PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, pk, format=None):
        try:
            banner = self.get_object(pk)
            banner.delete()
            return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
        except Exception, e:
            print "BannerViewApi", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            print "FeeAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Event
    @author :Hoangnguyen

"""


@parser_classes((MultiPartParser, JSONParser))
class EventAPI(APIView):

    def get(self, request, id):
        try:
            event = Event.objects.get(id=id)
            eventSerializer = admin_serializers.EventSerializer(event)
            return Response(eventSerializer.data)
        except Event.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)

        except Exception, e:
            print "EventAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            eventSerializer = admin_serializers.EventSerializer(
                data=request.data)
            if eventSerializer.is_valid():
                eventSerializer.save()
                return Response(eventSerializer.data)
            return Response({"code": 400, "message": eventSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "EventAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "EventAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        try:
            event = Event.objects.get(id=id)
            event.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Event.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Event."), "fields": ""}, status=400)
        except Exception, e:
            print "EventAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    EventList
    @author :Hoangnguyen

"""


class EventListAPI(APIView):

    def get(self, request, format=None):
        try:
            events = Event.objects.all()
            eventSerializer = admin_serializers.EventSerializer(
                events, many=True)
            return Response(eventSerializer.data)
        except Exception, e:
            print "EventListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "EventListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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

    def get(self, request, id):
        try:
            promotionLabel = Promotion_Label.objects.get(id=id)
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                promotionLabel)
            return Response(promotionLabelSerializer.data)

        except Promotion_Label.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Promotion Label."), "fields": ""}, status=400)
        except Exception, e:
            print "PromotionLabelAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                data=request.data)
            if promotionLabelSerializer.is_valid():
                promotionLabelSerializer.save()
                return Response(promotionLabelSerializer.data)
            return Response({"code": 400, "message": promotionLabelSerializer.errors, "fields": ""}, status = 400)

        except Exception, e:
            print "PromotionLabelAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "PromotionLabelAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id):
        try:
            promotionLabel = Promotion_Label.objects.get(id=id)
            promotionLabel.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Promotion_Label.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Promotion Label."), "fields": ""}, status=400)
        except Exception, e:
            print "PromotionLabelAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    PromotionLabelList
    @author :Hoangnguyen

"""


class PromotionLabelListAPI(APIView):

    def get(self, request):
        try:
            promotionLabels = Promotion_Label.objects.all()
            promotionLabelSerializer = admin_serializers.PromotionLabelSerializer(
                promotionLabels, many=True)
            return Response(promotionLabelSerializer.data)
        except Exception, e:
            print "PromotionLabelListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "PromotionLabelListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Hot
    @author :Hoangnguyen

"""


@parser_classes((MultiPartParser, JSONParser))
class HotAPI(APIView):

    def get(self, request, id):
        try:
            hot = Hot.objects.get(id=id)
            hotSerializer = admin_serializers.HotSerializer(hot)
            return Response(hotSerializer.data)

        except Hot.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)
        except Exception, e:
            print "HotAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            hotSerializer = admin_serializers.HotSerializer(data=request.data)
            if hotSerializer.is_valid():
                hotSerializer.save()
                return Response(hotSerializer.data)
            return Response({"code": 400, "message": hotSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "HotAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "HotAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        try:
            hot = Hot.objects.get(id=id)
            hot.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Hot.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Hot."), "fields": ""}, status=400)
        except Exception, e:
            print "HotAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    HotListAPI
    @author :Hoangnguyen
"""


class HotListAPI(APIView):

    def get(self, request):
        try:
            hot = Hot.objects.all()
            hotSerializer = admin_serializers.HotSerializer(hot, many=True)
            return Response(hotSerializer.data)
        except Exception, e:
            print "HotListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "HotListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Post 
    @author :Hoangnguyen
"""


@parser_classes((MultiPartParser, JSONParser))
class PostAPI(APIView):

    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)
            postSerializer = admin_serializers.PostSerializer(post)
            return Response(postSerializer.data)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Post."), "fields": ""}, status=400)

        except Exception, e:
            print "PostAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            postSerializer = admin_serializers.PostSerializer(
                data=request.data, context = {'request': request})
            if postSerializer.is_valid():
                postSerializer.save()
                return Response(postSerializer.data)
            return Response({"code": 400, "message": postSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "PostAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, id):
        try:
            post = Post.objects.get(id=id)
            postSerializer = admin_serializers.PostSerializer(
                instance=post, data=request.data, context={'request', request})
            if postSerializer.is_valid():
                postSerializer.save()
                # handle update multi image
                posts_image = request.data.get('posts_image', None)
                if posts_image:
                    for item in posts_image:
                        item_id = item.get('id', None)
                        # id is exist then update or delete image
                        if item_id:
                            is_clear_image_item = item.get( 'is_clear_image', None)
                            post_image = Post_Image.objects.filter( id = item_id )
                            if not post_image:
                                return Response({"code": 400, "message": _("Not Found Post Image."), "fields": ""}, status=400)
                            if is_clear_image_item:
                                post_image.delete()
                                break
                            post_image.update( **item )
                        else:
                            # id is not,create image
                            Post_Image.objects.create( post = post, **item )
                
                return Response(postSerializer.data)
            return Response({"code": 400, "message": postSerializer.errors, "fields": ""}, status=400)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": "Not Found Post.", "fields": ""}, status=400)

        except Exception, e:
            print "PostAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        try:
            post = Post.objects.get(id=id)
            post.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Post.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Post."), "fields": ""}, status=400)
        except Exception, e:
            print "PostAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)



"""
    PostList
    @author :Hoangnguyen
 
"""


class PostListAPI(APIView):

    def get(self, request):
        try:
            post = Post.objects.all()
            postSerializer = admin_serializers.PostSerializer(post, many=True)
            return Response(postSerializer.data)
        except Exception, e:
            print "HotListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "HotListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            print "PostTypeListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    FAQ 
    @author :Hoangnguyen
"""


@parser_classes((JSONParser,))
class FAQAPI(APIView):

    def get(self, request, id):
        try:
            faq = FAQ.objects.get(id=id)
            faqSerializer = admin_serializers.FAQSerializer(faq)
            return Response(faqSerializer.data)

        except FAQ.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found FAQ."), "fields": ""}, status=400)
        except Exception, e:
            print "FAQAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def post(self, request, format=None):
        try:
            faqSerializer = admin_serializers.FAQSerializer(data=request.data)
            if faqSerializer.is_valid():
                faqSerializer.save()
                return Response(faqSerializer.data)
            return Response({"code": 400, "message": faqSerializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "FAQAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            print "FAQAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        try:
            faq = FAQ.objects.get(id=id)
            faq.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except FAQ.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found FAQ."), "fields": ""}, status=400)
        except Exception, e:
            print "FAQAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    FAQList
    @author :Hoangnguyen
 
"""


class FAQListAPI(APIView):

    def get(self, request):
        try:
            faq = FAQ.objects.all()
            faqSerializer = admin_serializers.FAQSerializer(faq, many=True)
            return Response(faqSerializer.data)
        except Exception, e:
            print "FAQListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


class GeneratorQRCode(APIView):

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


# @parser_classes((MultiPartParser, FormParser))
# @permission_classes((AllowAny,))
# def UploadFile(APIView):
@csrf_exempt
def postUpload(request):
    print "request", request.FILES
    result = {
        'uploaded': 1,
        'fileName': 'logo.png',
        'url': 'https://helio.vn/static/assets/images/logo.png'
    }
    return JsonResponse(result, status=200)


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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print "User ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            if role_id == 1:
                # Get list user id to delete
                user_id = self.request.data.get('user_id', None)
                print "User List Id", user_id

                # Check list user id
                if user_id:
                    User.objects.filter(pk__in=user_id).delete()
                    return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
                return Response({"code": 400, "message": "List ID Not found ", "fields": ""}, status=400)
            else:
                return Response({"code": 405, "message": _("Just System Admin accept delete"), "fields": ""}, status=405)
        except Exception, e:
            print e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    """
        Update User By Id
    """

    def put(self, request, pk, format=None):
        print "METHOD PUT"

        user = self.get_object(pk)
        try:
            serializer = admin_serializers.UserRoleSerializer(user, data=request.data)

            if serializer.is_valid():
                if (self.request.user.is_staff == True and self.request.user.role_id != 1 and user.is_staff == True):
                    return Response({"code": 405, "message": _("This function is only for System Admin"), "fields": ""}, status=405) 
                if(serializer.validated_data['new_password']):
                    if(self.request.user.role_id == 1):
                        user.set_password(self.request.data.get("new_password"))
                    else:
                        return Response({"code": 405, "message": _("Just System Admin Change password"), "fields": ""}, status=405) 
                else:
                    user.password = self.request.data.get('password', user.password)
                serializer.save()
                return Response(serializer.data)
            return Response({"code": 400, "message": serializer.errors, "fields": ""}, status=400)

        except Exception, e:
            print 'UserDetailView PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, pk, format=None):
        print "METHOD DELETE"

        user = self.get_object(pk)
        try:
            # Get role_id when user login
            role_id = self.request.user.role_id
            # If role = System admin(role_id=1). Accept delete user
            if role_id == 1:
                print "role_id", role_id
                user.delete()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
            else:
                return Response({"code": 405, "message": _("Just System Admin accept delete"), "fields": ""}, status=405)
        except Exception, e:
            print 'UserDetailView PUT', e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    Game 
    @author :Hoangnguyen
"""


@parser_classes((MultiPartParser,))
class GameAPI(APIView):

    def get(self, request, id):
        try:
            game = Game.objects.get(id=id)
            gameSerializer = admin_serializers.GameSerializer(game)
            return Response(gameSerializer.data)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI ", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def put(self, request, id):
        try:
            game = Game.objects.get(id=id)
            print request.data
            gameSerializer = admin_serializers.GameSerializer(
                instance=game, data=request.data , context={'request': request})
            if gameSerializer.is_valid():
                gameSerializer.save()
                return Response(gameSerializer.data)
            return Response({"code": 400, "message": gameSerializer.errors, "fields": ""}, status=400)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

    def delete(self, request, id, format=None):
        try:
            game = Game.objects.get(id=id)
            game.delete()
            return Response({"code": 204, "message": _("success"), "fields": ""}, status=200)

        except Game.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Game."), "fields": ""}, status=400)
        except Exception, e:
            print "GameAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GameList
    @author :Hoangnguyen
 
"""


class GameListAPI(APIView):

    def get(self, request):
        try:
            game = Game.objects.all()
            gameSerializer = admin_serializers.GameSerializer(game, many=True)
            return Response(gameSerializer.data)
        except Exception, e:
            print "GameListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    GET, POST, DELETE Hot_Advs 
    @author: TrangLe
"""


@parser_classes((MultiPartParser, JSONParser))
class HotAdvsView(APIView):

    def get(self, request):
        try:
            hot_advs = Hot_Advs.objects.all().order_by('-created')
            serializer = admin_serializers.HotAdvsSerializer(
                hot_advs, many=True)
            return Response(serializer.data)
        except Exception, e:
            print "Hot_advs List", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)

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
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    RoleList
    @author :Hoangnguyen
 
"""


@permission_classes((AllowAny,))
class RoleListAPI(APIView):

    def get(self, request):
        try:
            roles = Roles.objects.all().order_by('id')
            roleSerializer = admin_serializers.RoleSerializer(roles, many=True)
            return Response(roleSerializer.data)
        except Exception, e:
            print "RoleListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


"""
    UserRoleList
    @author :Hoangnguyen
    case 1: get user by role_id
    case 2: get user is staff, no role
"""


@permission_classes((AllowAny,))
class UserRoleListAPI(APIView):

    def get(self, request):
        try:
            role_id = self.request.query_params.get('role_id', None)
            if role_id:
                # get user by role_id
                role = Roles.objects.get(id=role_id)
                users = role.user_role_rel.all().order_by('-date_joined')
            else:
                # get user is staff, no role
                users = User.objects.filter(is_staff=True, role__isnull=True).order_by('-date_joined')
            userSerializer = admin_serializers.UserSerializer(users, many=True)
            return Response(userSerializer.data)

        except Roles.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Role."), "fields": ""}, status=400)
        except Exception, e:
            print "UserListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
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


@permission_classes((AllowAny,))
class SetRoleAPI(APIView):

    def put(self, request, role_id):
        try:
            role = Roles.objects.get(id=role_id)
            if 'list_id' in request.data:
                list_id = request.data.get('list_id', None )
                if list_id:
                    # set role for users
                    users = User.objects.filter(id__in=list_id)
                    if users:
                        role.user_role_rel.set(users)
                        return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)
                    return Response({"code": 400, "message": _("Not Found users."), "fields": ""}, status=400)
                #list_id is empty then clear all user of role
                role.user_role_rel.clear()
                return Response({"code": 200, "message": _("success"), "fields": ""}, status=200)

            return Response({"code": 400, "message": _("Not Found list_id."), "fields": ""}, status=400)

        except Roles.DoesNotExist, e:
            return Response({"code": 400, "message": _("Not Found Role."), "fields": ""}, status=400)
        except Exception, e:
            print "UserListAPI", e
            error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
            return Response(error, status=500)


