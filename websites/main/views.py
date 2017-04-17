from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.utils import translation
from django.utils.translation import check_for_language, get_language
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from rest_auth.registration.views import SocialLoginView

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter