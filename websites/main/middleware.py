# from django.utils import translation

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