from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from rest_framework import permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import exception_handler, APIView
from rest_framework.response import Response
from rest_framework import generics as drf_generics
from core.models import *
from api.serializers import *
import helper
import ast
import constants
import utils



def custom_exception_handler(exc, context):
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['code'] = response.status_code
        response.data['message'] = response.data['detail'] if 'detail' in response.data else str(response.data)
        response.data['fields'] = ""
        if 'detail' in response.data:
            del response.data['detail']

    return response

"""
    Create User by Email
"""
User = get_user_model()


class RegistrationView(drf_generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    email_plaintext = get_template('websites/api/registration/new_user_notification.txt')
    email_html = get_template('websites/api/registration/new_user_notification.html')
    email_subject_template = 'websites/api/registration/new_user_notification_subject.txt'

    def send_activation_email(self, user):
        ctx = {
            'site': get_current_site(self.request),
            'user': user,
        }
        subject = render_to_string(self.email_subject_template)
        subject = ' '.join(subject.splitlines())
        print 'Subject ',subject
        message_text = self.email_plaintext.render(ctx)
        message_html = self.email_html.render(ctx)

        msg = EmailMultiAlternatives(subject, message_text, settings.DEFAULT_FROM_EMAIL, [user.email])
        msg.attach_alternative(message_html, "text/html")
        msg.send()

    def create_inactive_user(self, serializer):
        user = serializer.save(is_active=False)
        self.send_activation_email(user)
        return user

    def perform_create(self, serializer):
        user = self.create_inactive_user(serializer)

"""
    Verify emaill address and send secure code to email
"""
@api_view(['POST'])
def verify_email(request):
    try:
        email = request.data.get('email', '')
        if not email:
            error = {"code": 400, "message": "The email field is required.", "fields": "email"}
            return Response(error, status=400)
        user = User.objects.get(email=email)
        user.secure_code()

        # Send email security code to email
        subject = constants.SUBJECT_VERIFY_EMAIL
        message_plain = "websites/api/registration/verify_email.txt"
        message_html = "websites/api/registration/verify_email.html"
        data_render = {
            "code": user.code,
            'email': user.email
        }
        utils.send_mail(subject=subject, message_plain=message_plain, message_html=message_html, email_from=None, email_to=[user.email],
              data=data_render)

        return Response({"message":"Send security code to email successfully.", "flag":True})

    except User.DoesNotExist, e:
        error = {"code": 500, "message": "%s" % e, "fields": "", "flag": False}
        return Response(error, status=500)

@api_view(['POST'])
def reset_password(request):
    try:
        email = request.data.get('email', '')
        secure_code = request.data.get('secure_code', '')
        password1 = request.data.get('password1', '')
        password2 = request.data.get('password2', '')
        
        if not email or not secure_code or not password1 or not password2:
            error = {"code": 400, "message": "Please check required fields : [email, secure_code, password1, password2]", "fields": ""}
            return Response(error, status=400)
        if password1 != password2:
            error = {"code": 400, "message": "Password does not match.", "fields": "Password"}
            return Response(error, status=400)

        user = User.objects.filter(email=email, code=secure_code)
        user.set_password(password1)
        user.save()

        return Response({"message":"Reset Password Successfully.", "flag":True})

    except User.DoesNotExist, e:
        error = {"code": 500, "message": "The email or secure code matching query does not exist.", "fields": "", "flag": False}
        return Response(error, status=500)


class FileUploadView(APIView):
    parser_classes = (FileUploadParser,MultiPartParser, FormParser)

    def put(self, request, filename, format=None):
        try:
            file_obj = request.data['file']
            user = self.request.user
            user.avatar = file_obj
            user.save()
            return Response(status=204)
        except Exception, e:
            error = {"code": 500, "message": "Upload avatar error. Please contact administartor", "fields": "avatar"}
            return Response(error, status=500)
        # path = '/Users/tiendang/Downloads/testimg.png'
        # with open(path, 'w') as open_file:
        #     for c in file_obj.chunks():
        #         open_file.write(c)
        #         open_file.close()

        # # write image (base64 string encode upload)
        # import base64
        # import json
        # # open_file.write(json.loads(file_obj.file.read())['file1'].decode('base64'))
        # open_file.write(file_obj.file.read())
        # open_file.close()
        


"""
    Get Hots List to show in Homepage
"""


@api_view(['GET'])
def hots(request):
    try:
        hot_list = Hot.objects.filter(is_show=True).order_by('-created')[:5]
        serializer = HotsSerializer(hot_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


"""
    Get All Game Play by Type ID
"""


@api_view(['GET'])
def games(request):
    try:
        game_type_id = request.GET.get("type_id")
        print '#### game_type_id ', game_type_id
        error = helper.checkIdValid(game_type_id)
        if not helper.isEmpty(error):
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        game_list = Game.objects.filter(game_type_id=game_type_id)
        serializer = GameSerializer(game_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Game Detail by ID
"""


@api_view(['GET'])
def game_detail(request, game_id):
    try:
        error = helper.checkIdValid(game_id)
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
def entertainment_detail(request, id_or_key_query):
    try:
        if helper.isInt(id_or_key_query):
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
def events(request):
    try:
        event_list = event_list = Event.objects.all()
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get Latest Events
"""


@api_view(['GET'])
def events_latest(request):
    try:
        event_list = Event.objects.all().order_by('-created')[:2]
        serializer = EventsSerializer(event_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get All Events
"""


@api_view(['GET'])
def event_detail(request, event_id):
    try:
        error = helper.checkIdValid(event_id)
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
def posts(request):
    # TODO : Posts_image in request /posts is required?
    try:
        type_id = request.GET.get("type_id")

        error = helper.checkIdValid(type_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        post_list = Post.objects.filter(post_type_id=type_id)
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
def post_detail(request, id_or_key_query):
    try:
        if helper.isEmpty(id_or_key_query):
            error = {"code": 400, "message": "This field is required.",
                     "fields": "id_or_key_query"}
            return Response(error, status=400)

        if helper.isInt(id_or_key_query):
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
def promotions(request):
    try:
        type_id = request.GET.get("type_id")

        error = helper.checkIdValid(type_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "type_id"}
            return Response(errors, status=400)

        lst_item = Promotion.objects.filter(promotion_type_id=type_id)
        serializer = PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get posts details
"""


@api_view(['GET'])
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
def transactions_type(request):
    try:
        lst_item = Transaction_Type.objects.all()
        serializer = PromotionsSerializer(lst_item, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

"""
    Get ALL FAQs
"""


@api_view(['GET'])
def faqs(request):
    try:
        category_id = request.GET.get("category_id", "")

        error = helper.checkIdValid(category_id)
        if error:
            errors = {"code": 400, "message": "%s" %
                      error, "fields": "category_id"}
            return Response(errors, status=400)

        faq_list = FAQ.objects.filter(category_id=category_id)
        serializer = FAQsSerializer(faq_list, many=True)
        return Response(serializer.data)
    except Exception, e:
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)
