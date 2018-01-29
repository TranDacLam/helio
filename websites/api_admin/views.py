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
from rest_framework.permissions import AllowAny, IsAdminUser
from api_admin import serializers as admin_serializers
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
            promotion_id = request.GET.get('id', '')
            if promotion_id:
                item = Promotion.objects.get(pk=id)
                serializer = admin_serializers.PromotionSerializer(
                    item, many=False)
                return Response(serializer.data)
            else:
                lst_item = Promotion.objects.all()
                serializer = admin_serializers.PromotionSerializer(
                    lst_item, many=True)
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
            promotion_id = request.GET['id']
            if promotion_id:
                promotion_detail = Promotion.objects.get(pk=promotion_id)
                user_all_list = User.objects.all()
                promotion_user_id_list = Gift.objects.filter(
                    promotion_id=promotion_id).values_list('user_id', flat=True)
                user_promotion_list = User.objects.filter(
                    pk__in=promotion_user_id_list)

                result = {}
                result['promotion_detail'] = admin_serializers.PromotionSerializer(
                    promotion_detail, many=False).data
                result['user_all'] = admin_serializers.UserSerializer(
                    user_all_list, many=True).data
                result['user_promotion'] = admin_serializers.UserSerializer(
                    user_promotion_list, many=True).data

                return Response(result)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


@permission_classes((AllowAny,))
class UserDetail(APIView):

    def get(self, request, format=None):
        # get user by email
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
        # update user
        try:
            user = User.objects.get(id=id)
            serializer = admin_serializers.UserSerializer(
                instance=user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"code": 200, "status": "success", "fields": ""}, status=200)
            return Response({"code": 500, "message": serializer.errors, "fields": ""}, status=500)
        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)


@permission_classes((AllowAny,))
class SummaryAPI(APIView):

    def get(self, request, format=None):

        try:
            # get value url to filter data in DB
            url_field = request.get_full_path().split('/')[4]

            start_date_req = self.request.query_params.get('start_date', None)
            end_date_req = self.request.query_params.get('end_date', None)

            kwargs = {}
            if start_date_req:
                kwargs['created__gt'] = timezone.make_aware(datetime.strptime(
                    start_date_req, "%Y-%m-%d"), timezone.get_current_timezone())
            if end_date_req:
                kwargs['created__lt'] = timezone.make_aware(datetime.strptime(
                    end_date_req, "%Y-%m-%d") + timedelta(days=1), timezone.get_current_timezone())
            if kwargs:
                count_item = FeedBack.objects.filter(
                    **kwargs).values(url_field).order_by().annotate(Count(url_field))
            else:
                count_item = FeedBack.objects.all().values(
                    url_field).order_by().annotate(Count(url_field))

            return Response({"code": 200, "message": count_item, "fields": ""}, status=200)

        except Exception, e:
            error = {"code": 500, "message": "%s" % e, "fields": ""}
            return Response(error, status=500)
