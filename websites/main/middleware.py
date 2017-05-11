from django.utils import translation
from django.conf import settings

# class SetLocaleMiddleware:
#     def set_language(request):
#         response = http.HttpResponseRedirect(next)
#         if request.method == 'GET':
#             lang_code = request.GET.get('language', None)
#             if lang_code and check_for_language(lang_code):
#                 if hasattr(request, 'session'):
#                     request.session['django_language'] = lang_code
#                 else:
#                     response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang_code)
#                 translation.activate(lang_code)
#         return response



def set_language_code(request):
    LANGUAGE_CODE = ''
    try:
        LANGUAGE_CODE = request.session["_language"]
    except:
        pass
    # return the value you want as a dictionnary. you may add multiple values in there.
    return {'LANGUAGE_CODE': LANGUAGE_CODE}


def get_app_fb_id(request):
    FB_APP_ID = ''
    try:
        FB_APP_ID = settings.FB_APP_ID
    except:
        pass
    return {'FB_APP_ID': FB_APP_ID}

