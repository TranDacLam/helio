from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.utils import translation
from django.utils.translation import check_for_language, get_language
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from rest_auth.registration.views import SocialLoginView


def home(request, switch_lang=None):
    if not switch_lang:
        user_language = 'vi'
        translation.activate(user_language)
        request.session[translation.LANGUAGE_SESSION_KEY] = user_language
    elif switch_lang != 'true':
        raise Http404

    return render(request, 'websites/index.html')


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter