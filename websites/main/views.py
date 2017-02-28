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



# def set_language(request, lang):
#     if request.method == 'GET':
#         print request.LANGUAGE_CODE
#         # lang_code = request.GET.get('lang', None)
#         lang_code = lang
#         print 'lang_code %s'%check_for_language(lang_code)
#         if lang_code and check_for_language(lang_code):
#             if hasattr(request, 'session'):
#                 request.session['django_language'] = lang_code
#             else:
#                 response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang_code)
#             translation.activate(lang_code)
#             request.LANGUAGE_CODE = translation.get_language()
#             print 'LANGUAGE_CODE ',request.LANGUAGE_CODE
#     return render(request, 'websites/index.html', {'active_home': True})
#     # return HttpResponseRedirect('get-posts/')

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter