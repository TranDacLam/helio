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
from api.serializers import *
from api_admin import serializers as admin_serializers
import helper
import ast
import constants
import utils
from django.db import connections
from core import constants as core_constants
from push_notifications.models import APNSDevice, GCMDevice
from rest_framework.permissions import AllowAny
from django.utils.translation import ugettext_lazy as _
import datetime
from django.utils import timezone
from django.http import JsonResponse
import requests
import json
import traceback

def custom_exception_handler(exc, context):
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response is not None:
        try:
            message = exc.detail.values()[0][0] if exc.detail else ""
            field = exc.detail.keys()[0] if exc.detail else ""
        except Exception, e:
            print "custom_exception_handler ", e
            message = "errors"
            field = ""

        # fix bugs show popup login admin-marketing
        if response.status_code == 401:
            response['WWW-Authenticate'] = ''

        response.data['code'] = response.status_code
        response.data['message'] = response.data[
            'detail'] if 'detail' in response.data else str(message)
        response.data['fields'] = field
        if 'detail' in response.data:
            del response.data['detail']

    return response

"""
    Create User by Email
"""
User = get_user_model()


class RegistrationView(drf_generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    email_subject_template = 'websites/api/registration/new_user_notification_subject.txt'

    def send_activation_email(self, user):
        data_render = {
            'site': get_current_site(self.request),
            'user': user,
        }
        # Send email welcome
        subject = _(constants.SUBJECT_REGISTRATION)

        message_plain = "websites/api/registration/new_user_notification.txt"
        message_html = "websites/api/registration/new_user_notification.html"

        utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, email_from=None, email_to=[user.email],
                        data=data_render)

    def create_inactive_user(self, serializer):
        user = serializer.save()
        self.send_activation_email(user)
        return user

    def perform_create(self, serializer):
        user = self.create_inactive_user(serializer)


"""
    Verify emaill address and send secure code to email
"""


@api_view(['POST'])
@permission_classes((AllowAny,))
def verify_email(request):
    try:
        email = request.data.get('email', '')
        if not email:
            error = {
                "code": 400, "message": _("The email field is required."), "fields": "email"}
            return Response(error, status=400)
        user = User.objects.get(email=email)
        user.secure_code()

        # Send email security code to email
        subject = _(constants.SUBJECT_VERIFY_EMAIL)
        message_plain = "websites/api/registration/verify_email.txt"
        message_html = "websites/api/registration/verify_email.html"
        data_render = {
            'site': get_current_site(request),
            "code": user.code,
            'email': user.email
        }
        utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, email_from=None, email_to=[user.email],
                        data=data_render)

        return Response({"message": _("Send security code to email successfully."), "flag": True})

    except User.DoesNotExist, e:
        error = {"code": 500, "message": _(
            "Email matching query does not exist."), "fields": "", "flag": False}
        return Response(error, status=500)


@api_view(['POST'])
@permission_classes((AllowAny,))
def reset_password(request):
    try:
        email = request.data.get('email', '')
        secure_code = request.data.get('secure_code', '')
        password1 = request.data.get('password1', '')
        password2 = request.data.get('password2', '')

        if not email or not secure_code or not password1 or not password2:
            error = {
                "code": 400, "message": _("Please check required fields : [email, secure_code, password1, password2]"), "fields": ""}
            return Response(error, status=400)
        if password1 != password2:
            error = {"code": 400, "message": _("Password does not match."),
                     "fields": "Password"}
            return Response(error, status=400)

        user = User.objects.get(email=email, code=secure_code)
        user.set_password(password1)
        user.code = None
        user.save()

        return Response({"message": _("Reset Password Successfully."), "flag": True})

    except User.DoesNotExist, e:
        error = {"code": 500, "message": _("The secure code matching query does not exist."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


class FileUploadView(APIView):
    parser_classes = (FileUploadParser, MultiPartParser, FormParser)

    def put(self, request, filename, format=None):
        try:
            file_obj = request.data['file']
            user = self.request.user
            user.avatar = file_obj
            user.save()
            return Response(status=200)
        except Exception, e:
            error = {
                "code": 500, "message": _("Upload avatar error. Please contact administartor"), "fields": "avatar", "flag": False}
            return Response(error, status=500)


"""
    Update User Infomation
"""


@api_view(['PUT'])
def user_info(request):
    try:
        # TODO : Check user i not anonymous
        if not request.user.anonymously:
            user = request.user
            # verify phone number
            phone = request.data.get('phone', '')
            if phone:
                qs = User.objects.filter(phone=phone).exclude(pk=user.id)
                if qs.count() > 0:
                    return Response({'flag': False, 'message': _('This phone number has already. Please choice another.')}, status=400)
            else:
                phone = None

            birth_date = request.data.get('birth_date', None)
            if birth_date:
                try:
                    datetime.datetime.strptime(birth_date, "%Y-%m-%d")
                except Exception, e:
                    return Response({'flag': False, 'message': _('Birth day invalid format (YYYY-MM-DD).')}, status=400)
            else:
                # because request.data.get if null then cast data to string '',
                # birth date accept none
                birth_date = None

            user.birth_date = birth_date
            user.full_name = request.data.get('full_name', '')
            user.phone = phone
            user.personal_id = request.data.get('personal_id', '')
            user.country = request.data.get('country', '')
            user.address = request.data.get('address', '')
            user.city = request.data.get('city', '')
            user.save()

        return Response({'flag': True, 'message': _('Update infomation user successfully.')})

    except Exception, e:
        print 'Erro Update user_info ', e
        error = {"code": 500, "message": _("Cannot update infomation user. Please contact administrator."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


"""
    Update unique device id for user register is facebook
"""


@api_view(['PUT'])
def update_unique_device_id(request):
    try:
        # TODO : Check user i not anonymous
        if not request.user.anonymously:
            user = request.user
            user.device_unique = request.data.get('device_unique', '')
            user.save()

        return Response({'flag': True, 'message': _('Update device unique successfully.')})

    except Exception, e:
        print 'update_unique_device_id ', e
        error = {"code": 500, "message": _("Cannot update infomation user. Please contact administrator."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


"""
    Get User Infomation
"""


@api_view(['GET'])
def users(request):
    try:
        user = User.objects.get(pk=request.user.id)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "email"}
        return Response(error, status=400)
    except Exception, e:
        print "Error Get User ", e
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


"""
    Change Password User
"""


@api_view(['PUT'])
def change_password(request):
    try:
        # TODO : Check user i not anonymous
        if not request.user.anonymously:
            old_password = request.data.get('old_password', '')
            new_password = request.data.get('new_password', '')

            if not old_password or not new_password:
                error = {
                    "code": 400, "message": _("Please check required fields : [old_password, new_password]"), "fields": "",
                    "flag": False}
                return Response(error, status=400)

            user = request.user
            # verify old password
            valid_pass = user.check_password(old_password)
            if not valid_pass:
                error = {
                    "code": 400, "message": _("OldPassword does not match."), "fields": "old_password",
                    "flag": False}
                return Response(error, status=400)

            user.set_password(new_password)
            user.token_last_expired = timezone.now()
            user.save()
        return Response({'flag': True, 'message': _('Update password for user successfully.')})

    except Exception, e:
        print "ERROR change_password ", e
        error = {"code": 500, "message": _("Cannot update password for user. Please contact administrator."),
                 "fields": "", "flag": False}
        return Response(error, status=500)


"""
    Send Feedback
"""


@api_view(['POST'])
@permission_classes((AllowAny,))
def send_feedback(request):
    try:

        if not request.data.get('name', ''):
            request.data['name'] = request.data['email']

        serializer = FeedBackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"code": 400, "message": "%s" % serializer.errors,
                         "fields": ""}, status=400)
    except Exception, e:
        error = {"code": 500, "message": _("Cannot send feedback. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)

"""
    Get Hots List to show in Homepage
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def hots(request):
    try:
        hot_list = Hot.objects.filter(is_show=True).order_by('-created')[:5]
        serializer = HotsSerializer(hot_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get All Game Type By Category
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def game_types_by_category(request, category_id):
    try:
        error = helper.check_id_valid(category_id)
        if not helper.is_empty(error):
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        game_types = Type.objects.filter(category_id=category_id)
        serializer = TypeSerializer(game_types, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get All Game Play by Type ID
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def games(request):
    try:
        game_type_id = request.GET.get("type_id")
        error = helper.check_id_valid(game_type_id)
        if not helper.is_empty(error):
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        game_list = Game.objects.filter(
            is_draft=False, game_type_id=game_type_id)
        serializer = GameSerializer(game_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Game Detail by ID
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def game_detail(request, game_id):
    try:
        error = helper.check_id_valid(game_id)
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
@permission_classes((AllowAny,))
def entertainment_detail(request, id_or_key_query):
    try:
        if helper.is_int(id_or_key_query):
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
@permission_classes((AllowAny,))
def events(request):
    try:
        event_list = Event.objects.filter(is_draft=False)
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Latest Events
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def events_latest(request):
    try:
        event_list = Event.objects.filter(
            is_draft=False).order_by('-created')[:2]
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get All Events
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def event_detail(request, event_id):
    try:
        error = helper.check_id_valid(event_id)
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
@renderer_classes((JSONRenderer,))
@permission_classes((AllowAny,))
def posts(request):
    # TODO : Posts_image in request /posts is required?
    try:
        type_id = request.GET.get("type_id")

        error = helper.check_id_valid(type_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        post_list = Post.objects.filter(is_draft=False, post_type_id=type_id)
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
@permission_classes((AllowAny,))
def post_detail(request, id_or_key_query):
    try:
        if helper.is_empty(id_or_key_query):
            error = {"code": 400, "message": "This field is required.",
                     "fields": "id_or_key_query"}
            return Response(error, status=400)

        if helper.is_int(id_or_key_query):
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
@permission_classes((AllowAny,))
def promotions(request):
    try:
        category_id = request.GET.get("category_id")

        lst_item = Promotion.objects.filter(is_draft=False)

        if category_id:
            if helper.is_int(category_id):
                lst_item = lst_item.filter(promotion_category_id=category_id)
            else:
                errors = {"code": 400, "message": _(
                    "This value must be is integer."), "fields": "category_id"}
                return Response(errors, status=400)

        serializer = PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get posts details
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
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
@permission_classes((AllowAny,))
def transactions_type(request):
    try:
        lst_item = Transaction_Type.objects.all()
        serializer = TransactionTypeSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get ALL FAQs
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def faqs(request):
    try:
        category_id = request.GET.get("category_id", "")

        if category_id:
            faq_list = FAQ.objects.filter(category_id=category_id)
        else:
            faq_list = FAQ.objects.all()

        serializer = FAQsSerializer(faq_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Card Information
"""


@api_view(['GET', 'DELETE'])
def card_information(request, card_id):
    print "API get card information"
    try:
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)

        result = {}

        headers = {'Authorization': settings.DMZ_API_TOKEN}
        card_information_api_url = '{}card/{}/information/'.format(
            settings.BASE_URL_DMZ_API, card_id)

        """GET METHOD"""
        if request.method == 'GET':
            # Only staff or card link get full infomation
            is_full_info = request.user.is_staff or request.user.barcode == card_id
            params = {
                "is_full_info": is_full_info
            }

            # Call DMZ get card infomation
            response = requests.get(
                card_information_api_url, params=params, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)

        """DELETE METHOD"""
        if request.method == 'DELETE':
            if request.user.is_staff or request.user.barcode == card_id:
                # Call DMZ get card infomation
                response = requests.delete(
                    card_information_api_url, headers=headers)

                # Process DMZ reponse 
                return helper.dmz_response_process(response)
            else:
                error = {"code": 400, "message": _(
                    "You don't have permission to access."), "fields": ""}
                return Response(error, status=400)
        return Response(result)

    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)

    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)

"""
    Play Transaction
"""


@api_view(['GET'])
def play_transactions(request):
    try:
        card_id = request.GET.get("card_id", "")
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)

        params_api = {
            "card_id": card_id
        }
        filter_id = request.GET.get("filter_id", "")
        if filter_id:
            if not helper.is_int(filter_id):
                errors = {"code": 400, "message": _(
                    "This value must be is integer."), "fields": "filter_id"}
                return Response(errors, status=400)
            filter_object = Transaction_Type.objects.get(pk=filter_id)
            params_api['filter_name'] = filter_object.name

        if request.user.is_staff or request.user.barcode == card_id:
            headers = {'Authorization': settings.DMZ_API_TOKEN}
            transactions_play_api_url = '{}transactions/play/'.format(
                settings.BASE_URL_DMZ_API)

            # Call DMZ get card infomation
            response = requests.get(
                transactions_play_api_url, params=params_api, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)

        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)

    except Transaction_Type.DoesNotExist, e:
        error = {"code": 400, "message": _(
            "Filter Id Invalid."), "fields": ""}
        return Response(error, status=400)
    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)


"""
    Card Transaction
"""


@api_view(['GET'])
def card_transactions(request):
    try:
        card_id = request.GET.get("card_id", "")
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)
        if request.user.is_staff or request.user.barcode == card_id:
            headers = {'Authorization': settings.DMZ_API_TOKEN}
            transactions_card_api_url = '{}transactions/card/'.format(
                settings.BASE_URL_DMZ_API)

            # Call DMZ get card infomation
            response = requests.get(
                transactions_card_api_url, params=request.GET, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)
        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)

    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)


"""
    Reissue History
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def reissue_history(request):
    try:
        card_id = request.GET.get("card_id", "")
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)
        if request.user.is_staff or request.user.barcode == card_id:
            headers = {'Authorization': settings.DMZ_API_TOKEN}
            reissue_history_api_url = '{}reissue/history/'.format(
                settings.BASE_URL_DMZ_API)

            # Call DMZ get card infomation
            response = requests.get(
                reissue_history_api_url, params=request.GET, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)
        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)

    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)


"""
    Get Open Time
"""


@api_view(['GET'])
@permission_classes((AllowAny,))
def open_time(request):
    try:
        open_date = request.GET.get("open_date", "")
        if not open_date:
            error = {
                "code": 400, "message": _("Date request is required."), "fields": "open_date"}
            return Response(error, status=400)

        opentimes = OpenTime.objects.get(open_date=open_date.strip())
        serializer = OpenTimeSerializer(opentimes, many=False)
        return Response(serializer.data)
    except OpenTime.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "open_date"}
        return Response(error, status=400)
    except ValidationError, e:
        error = {"code": 400, "message": "%s" % e,
                 "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print "Action open_time : ", e
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)


"""
    Get all notifications
"""


@api_view(['GET'])
def notifications(request):
    try:
        category_id = request.GET.get("category_id", "")
        user = request.user

        if category_id:
            notification_list = User_Notification.objects.filter(
                notification__category_id=category_id, user=user)
        else:
            notification_list = User_Notification.objects.filter(user=user)

        serializer = UserNotificationSerializer(notification_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get notificatons by category
"""


@api_view(['GET'])
def notification_category(request):
    try:
        categories = Category_Notification.objects.all()
        serializer = CategoryNotificationSerializer(categories, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Update current user read notification
"""


@api_view(['POST'])
def user_read_notification(request):
    try:
        user = request.user
        notification_id = request.data.get('notification_id', '')
        if not notification_id:
            return Response({'message': _('Notification Id is required.')}, status=400)
        if user.anonymously:
            return Response({'message': _('Anonymous User Cannot Update Notification')}, status=400)

        obj, created = User_Notification.objects.update_or_create(
            notification_id=notification_id, user=user)
        obj.is_read = True
        obj.save()
        return Response({'message': _('Successfull')})

    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get notificaton detail
"""


@api_view(['GET'])
def notification_detail(request, notification_id):
    try:
        notification_obj = Notification.objects.get(pk=notification_id)
        print 'notification_obj ', notification_obj
        serializer = NotificationSerializer(notification_obj, many=False)
        return Response(serializer.data)

    except User_Notification.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e, "fields": "notification_id"}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Turn off Notification
"""


@api_view(['PUT'])
def turn_off_notification(request):
    try:
        if not request.user.anonymously:
            user = request.user
            user.flag_notification = False
            user.save()
            return Response({'message': _('Turn off notification successful.')})
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except Exception, e:
        print "Error turn_off_notification ", e
        return Response({'message': _('Internal Server Error. Please Contact Administrator.')}, status=500)


"""
    Turn on Notification
"""


@api_view(['PUT'])
def turn_on_notification(request):
    try:
        if not request.user.anonymously:
            user = request.user
            user.flag_notification = True
            user.save()
            return Response({'message': _('Turn on notification successful.')})
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except Exception, e:
        print "Error turn_on_notification ", e
        return Response({'message': _('Internal Server Error. Please Contact Administrator.')}, status=500)


"""
    API add new notification for testing
"""


@api_view(['POST'])
def add_notification(request):
    try:
        # TODO : Check user i not anonymous
        if not request.user.anonymously:
            subject = request.data.get('subject', '')
            message = request.data.get('message', '')
            category_id = request.data.get('category_id', '')
            sub_url = request.data.get('sub_url', '')
            if not subject or not message or not category_id:
                error = {
                    "code": 400, "message": "Please check required fields : [subject, message, category_id]", "fields": "",
                    "flag": False}
                return Response(error, status=400)

            category_obj = Category_Notification.objects.get(pk=category_id)
            notify_obj = Notification(
                subject=subject, message=message, category=category_obj, sub_url=sub_url)
            notify_obj.save()

            serializer = NotificationSerializer(notify_obj, many=False)
            return Response(serializer.data)

    except Category_Notification.DoesNotExist, e:
        error = {"code": 400, "message": "%s" % e,
                 "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        error = {"code": 500, "message": _("Cannot add new notification. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)


"""
    API send notifications to devices
"""


@api_view(['POST'])
def send_notification(request):
    try:
        user = request.user

        if not request.user.anonymously:

            print 'request.data ', request.data
            notification_id = request.data.get('notification_id', '')
            if not notification_id:
                error = {
                    "code": 400, "message": "Please check required fields : [notification_id]", "fields": "",
                    "flag": False}
                return Response(error, status=400)

            notify_obj = Notification.objects.get(pk=notification_id)

            user_of_notification = []

            promotion_obj = notify_obj.promotion

            if promotion_obj:
                user_of_notification = Gift.objects.filter(
                    promotion=promotion_obj).values_list('user_id', flat=True)
            else:
                user_of_notification = User_Notification.objects.filter(
                    notification_id=notify_obj.id).values_list('user_id', flat=True)

            data_notify = {"title": notify_obj.subject, "body": notify_obj.message,
                           "sub_url": notify_obj.sub_url, "image": notify_obj.image.url if notify_obj.image else "",
                           "notification_id": notify_obj.id}

            devices_ios = APNSDevice.objects.filter(
                user__flag_notification=True, user__id__in=user_of_notification)
            if devices_ios:
                devices_ios.send_message(
                    message=data_notify, extra=data_notify)

            fcm_devices = GCMDevice.objects.filter(
                user__flag_notification=True, user__id__in=user_of_notification)
            if fcm_devices:
                data_notify['click_action'] = "ACTIVITY_NOTIFICATION"
                data_notify['title_payload'] = notify_obj.subject
                data_notify['body_payload'] = notify_obj.message
                fcm_devices.send_message(notify_obj.subject, extra=data_notify)

            # When send success then update user and date sent
            notify_obj.sent_user = user
            notify_obj.sent_date = datetime.datetime.now()
            notify_obj.save()

            if promotion_obj and promotion_obj.is_draft:
                promotion_obj.is_draft = False
                promotion_obj.user_implementer = user
                promotion_obj.save()

            return Response({'message': _('Push Notification Successfull')})

        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)
    except Notification.DoesNotExist, e:
        print "error PUSH notification ", e
        error = {"code": 400, "message": "%s" % e,
                 "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print "ERROR send_notification : ", e
        error = {"code": 500, "message": _("Cannot push notification. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)


"""
    Connect Device for User
"""


@api_view(['POST'])
def connect_device(request):
    try:
        user = request.user

        if not request.user.anonymously:
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            device_uid = request.data.get("device_uid", "")

            if not device_uid:
                error = {
                    "code": 400, "message": _("The device_uid field is required."), "fields": "device_uid"}
                return Response(error, status=400)

            if user_agent:
                if 'ios' in user_agent.lower():
                    try:
                        device = APNSDevice.objects.get(
                            registration_id=device_uid)
                        device.user = user
                        device.save()

                    except APNSDevice.DoesNotExist, e:
                        device = APNSDevice(
                            user=user, name=user.email, registration_id=device_uid)
                        device.save()
                else:
                    try:
                        device = GCMDevice.objects.get(
                            registration_id=device_uid, cloud_message_type="FCM")
                        device.user = user
                        device.save()

                    except GCMDevice.DoesNotExist, e:
                        device = GCMDevice(
                            user=user, name=user.email, registration_id=device_uid, cloud_message_type="FCM")
                        device.save()
            return Response({'message': _('Connect device successful.')})
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except Exception, e:
        print "Error connect_device : ", e
        return Response({'message': _('Internal Server Error. Please Contact Administrator.')}, status=500)


"""
    Connect Device for User
"""


@api_view(['POST'])
def disconnect_device(request):
    try:
        user = request.user

        if not request.user.anonymously:
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            device_uid = request.data.get("device_uid", "")

            if not device_uid:
                error = {
                    "code": 400, "message": _("The device_uid field is required."), "fields": "device_uid"}
                return Response(error, status=400)

            if user_agent:
                if 'ios' in user_agent.lower():
                    device = APNSDevice.objects.get(registration_id=device_uid)
                    device.user = None
                    device.save()
                else:
                    device = GCMDevice.objects.get(registration_id=device_uid)
                    device.user = None
                    device.save()

            return Response({'message': _('Disconnect device successful.')})
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except APNSDevice.DoesNotExist, e:
        return Response({'message': _('Cannot disconnect device. DeviceID not found.')}, status=400)
    except GCMDevice.DoesNotExist, e:
        return Response({'message': _('Cannot disconnect device. DeviceID not found.')}, status=400)
    except Exception, e:
        print "Error connect_device : ", e
        return Response({'message': _('Internal Server Error. Please Contact Administrator.')}, status=500)

        
"""
    Update user have get a gift
"""


@api_view(['PUT'])
def gift_user(request):
    try:
        if not request.user.anonymously:
            user = request.user
            print "## Current User ", user
            promotion_id = request.data.get('promotion_id', '')

            if not promotion_id:
                error = {
                    "code": 400, "message": _("The promotion_id is required."), "fields": "promotion_id"}
                return Response(error, status=400)

            obj_promotion = Promotion.objects.get(pk=promotion_id)

            # CHECK Promotion Category is new user install app helio
            if obj_promotion.id == core_constants.PROMOTION_ID_SETUP_DEVICE:
                return gift_install_app(user, promotion_id)

            gift = Gift.objects.get(user=user, promotion_id=promotion_id)

            message = _("Error. User or Deivce Have get gift from promotion.")
            status_code = 501
            if not gift.is_used:
                message = "Success"
                status_code = 200
                gift.is_used = True
                gift.save()

            return Response({'message': message}, status=status_code)
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except Promotion.DoesNotExist, e:
        error = {"code": 400, "message": _("Promotion for user does not matching. Please check again."),
                 "fields": ""}
        return Response(error, status=400)
    except Gift.DoesNotExist, e:
        error = {"code": 400, "message": _("Your account not apply current promotion. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print "Error gift_user ", e
        error = {"code": 500, "message": _("Your account not apply current promotion. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)

"""
    Update user have get a gift
"""


@api_view(['PUT'])
def gift_user_v2(request):
    try:
        if not request.user.anonymously:
            user = request.user
            print "## Current User ", user
            promotion_id = request.data.get('promotion_id', '')

            if not promotion_id:
                error = {
                    "code": 400, "message": _("The promotion_id is required."), "fields": "promotion_id"}
                return Response(error, status=400)

            obj_promotion = Promotion.objects.get(pk=promotion_id)

            current_time = datetime.datetime.now()

            if(obj_promotion.apply_date and obj_promotion.apply_time):
                start_datetime = datetime.datetime.combine(
                    obj_promotion.apply_date, obj_promotion.apply_time)
                if start_datetime > current_time:
                    error = {
                        "code": 400, "message": _("Error. Promotion Is Not Start."), "fields": "promotion_id"}
                    return Response(error, status=400)

            if(obj_promotion.end_date and obj_promotion.end_time):
                end_datetime = datetime.datetime.combine(
                    obj_promotion.end_date, obj_promotion.end_time)
                if end_datetime < current_time:
                    error = {
                        "code": 400, "message": _("Error. Promotion expired."), "fields": "promotion_id"}
                    return Response(error, status=400)

            # CHECK Promotion Category is new user install app helio
            if obj_promotion.id == core_constants.PROMOTION_ID_SETUP_DEVICE:
                return gift_install_app(user, promotion_id)

            promotion_type = obj_promotion.promotion_type

            # Promotion must be have type.
            if not promotion_type or promotion_type.id == core_constants.PROMOTION_TYPE_PUBLIC:
                error = {
                    "code": 400, "message": _("Error. Promotion Invalid."), "fields": "promotion_id"}
                return Response(error, status=400)

            message = _("Error. User or Deivce Have get gift from promotion.")
            status_code = 501
            # With promotion by user. Check user in list admin select
            if promotion_type.id == core_constants.PROMOTION_TYPE_USER:
                gift = Gift.objects.get(user=user, promotion_id=promotion_id)
                if not gift.is_used:
                    message = "Success"
                    status_code = 200
                    gift.is_used = True
                    gift.save()
            # With promotion by user and device id then check user and device
            elif promotion_type.id == core_constants.PROMOTION_TYPE_USER_DEVICE:
                device_id = request.data.get('device_id', '')
                if not device_id:
                    error = {
                        "code": 400, "message": _("The device_id is required."), "fields": "device_id"}
                    return Response(error, status=400)

                gift_user = Gift.objects.filter(
                    user=user, promotion_id=promotion_id)
                gift_device = Gift.objects.filter(
                    device_id=device_id, promotion_id=promotion_id)

                if not gift_user and not gift_device:
                    message = "Success"
                    status_code = 200
                    gift = Gift()
                    gift.promotion = obj_promotion
                    gift.device_id = device_id
                    gift.user = user
                    gift.is_used = True
                    gift.save()

            return Response({'message': message}, status=status_code)
        else:
            return Response({'message': _('Anonymous User Cannot Call This Action.')}, status=400)

    except Promotion.DoesNotExist, e:
        error = {"code": 400, "message": _("Promotion for user does not matching. Please check again."),
                 "fields": ""}
        return Response(error, status=400)
    except Gift.DoesNotExist, e:
        error = {"code": 400, "message": _("Your account not apply current promotion. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print "Error gift_user ", e
        error = {"code": 500, "message": _("Your account not apply current promotion. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)


"""
    Gift for user install app
"""


def gift_install_app(user, promotion_id):
    try:
        """ 
            Case 1 : Check user is new registration
            Case 2 : Check Device have using
         """
        if user.is_new_register:
            if not user.device_unique:
                return Response({'message': _("Error. DeivceID of user is empty. Please check again.")}, status=501)

            try:
                gift = Gift.objects.get(
                    device_id=user.device_unique, promotion_id=promotion_id)
            except Gift.DoesNotExist, e:
                # IF query does not exist then is new user and device
                gift = Gift(user=user, device_id=user.device_unique,
                            promotion_id=promotion_id)
                gift.save()
        else:
            return Response({'message': _("Error. User or Deivce Have get gift from promotion.")}, status=501)

        message = _("Error. User or Deivce Have get gift from promotion.")
        status_code = 501
        if not gift.is_used:
            message = "Success"
            status_code = 200
            gift.is_used = True
            gift.save()
            # Update User have gift
            user.is_new_register = False
            user.save()

        return Response({'message': message}, status=status_code)

    except Exception, e:
        print "Error gift_install_app ", e
        error = {"code": 500, "message": _("Your account not apply current promotion. Please contact administrator."),
                 "fields": ""}
        return Response(error, status=500)


@api_view(['POST'])
def ticket_transfer(request):
    print "Ticket Transfer"
    try:
        source_card_barcode = request.data.get('source_card_barcode', '')
        received_card_barcode = request.data.get('received_card_barcode', 0)
        ticket_amount = request.data.get('ticket_amount', 0)
        fee = request.data.get('fee', '')

        if request.user.barcode == source_card_barcode:
            if not source_card_barcode or not received_card_barcode or not ticket_amount or (not fee and fee != 0):
                error = {
                    "status": "05", "message": _("Please check required fields : [source_card_barcode, received_card_barcode, ticket_amount, fee]")}
                return JsonResponse(error, status=400)
            if source_card_barcode == received_card_barcode:
                error = {
                    "status": "05", "message": _("Can not transfer to itseft")}
                return JsonResponse(error, status=400)

            if not request.user.full_name:
                error = {"code": 400,
                         "message": _("Please update full name of user"), "fields": ""}
                return Response(error, status=400)
            try:
                ticket_amount = int(ticket_amount)
                if ticket_amount < 0:
                    error = {"code": 400,
                             "message": _("Amount must be more than 0"), "fields": ""}
                    return Response(error, status=400)
                fee = int(fee)
            except ValueError:
                error = {"code": 400,
                         "message": _("Fee & Ticket Amount must be is number"), "fields": ""}
                return Response(error, status=400)

            result = {}

            headers = {
                'Content-Type': 'application/json',
                'Authorization': settings.DMZ_API_TOKEN
            }
            ticket_transfer_api_url = '{}helio/ticket_transfer/'.format(
                settings.BASE_URL_DMZ_API)

            params_api = {
                "source_card_barcode": source_card_barcode,
                "received_card_barcode": received_card_barcode,
                "ticket_amount": ticket_amount,
                "fee": fee,
                "system_name": "helio_app",
                "source_email": request.user.email,
                "source_full_name": request.user.full_name
            }

            # Call DMZ get card infomation
            response = requests.post(
                ticket_transfer_api_url, data=json.dumps(params_api), headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)
        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)

    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)


@api_view(['GET'])
def fees_apply_by_type(request):
    try:
        position = request.GET.get('position', '')
        if not position:
            error = {
                "code": 400, "message": _("Position field is required."), "fields": "position"}
            return Response(error, status=400)
        fee = Fee.objects.filter(
            is_apply=True, position=position).order_by("-created")[:1].get()
        serializer = FeeSerializer(fee, many=False)
        return Response(serializer.data)
    except Fee.DoesNotExist, e:
        error = {"code": 400, "message": _("Fee not found."), "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print "fees_apply_by_type ", e
        error = {"code": 500, "message": "Internal Server Error", "fields": ""}
        return Response(error, status=500)


@api_view(['GET'])
@permission_classes((AllowAny,))
def hot_advs_latest(request):
    print "GET HOT ADVS LATEST"
    try:
        hot_advs = Hot_Advs.objects.filter(
            is_draft=False).order_by("-created")[:1].get()
        serializer = HotAdvsSerializer(hot_advs, many=False)
        return Response(serializer.data)
    except Hot_Advs.DoesNotExist, e:
        error = {"code": 400, "message": _(
            "Hot Advs not found."), "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print('hot_advs_latest: %s', traceback.format_exc())
        error = {"code": 500, "message": "Internal Server Error", "fields": ""}
        return Response(error, status=500)


@api_view(['GET'])
def ticket_transfer_transactions(request):
    print "Tick transfer history"
    try:
        card_id = request.GET.get("card_id", "")
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)
        if request.user.is_staff or request.user.barcode == card_id:
            headers = {'Authorization': settings.DMZ_API_TOKEN}
            transactions_ticket_api_url = '{}transactions/ticket/transfer'.format(
                settings.BASE_URL_DMZ_API)

            # Call DMZ get card infomation
            response = requests.get(
                transactions_ticket_api_url, params=request.GET, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)
        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)
    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)

"""
    Other Transaction
"""


@api_view(['GET'])
def other_transactions(request):
    try:
        card_id = request.GET.get("card_id", "")
        if not card_id:
            error = {
                "code": 400, "message": _("Card id field is required."), "fields": "card_id"}
            return Response(error, status=400)
        if request.user.is_staff or request.user.barcode == card_id:
            headers = {'Authorization': settings.DMZ_API_TOKEN}
            other_transactions_api_url = '{}transactions/other/'.format(
                settings.BASE_URL_DMZ_API)

            # Call DMZ get card infomation
            response = requests.get(
                other_transactions_api_url, params=request.GET, headers=headers)

            # Process DMZ reponse 
            return helper.dmz_response_process(response)
        else:
            error = {"code": 400, "message": _(
                "You don't have permission to access."), "fields": ""}
            return Response(error, status=400)

    except requests.Timeout:
        print "Request DMZ time out "
        error = {"code": 500, "message": _("API connection timeout."), "fields": ""}
        return Response(error, status=500)
    except Exception, e:
        print('card_information: %s', traceback.format_exc())
        error = {"code": 500, "message": _("Internal Server Error. Please contact administrator."), "fields": ""}
        return Response(error, status=500)


@api_view(['GET'])
@permission_classes((AllowAny,))
def denominations(request):
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
