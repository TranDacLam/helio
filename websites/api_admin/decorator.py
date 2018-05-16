from core.models import Roles_Permission
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _  

def check_role_permission(model_key):
    def wrapper(view_func):
        def clear_image_data(request):
            if request.data:
                # Fix bugs readv() failed
                request.data['image'] = None
                request.data['image_thumbnail'] = None
                request.data['avatar'] = None

        def wrapped(self, request, *args, **kwargs):
            print "Check role permission"
            try:
                # Check user is login
                if not request.user.is_authenticated():
                    return Response({"code": 401, "message": _("Unauthorized"), "fields": ""}, status=401)

                # Check user have role. If user not set role then can not access
                role = request.user.role
                if not role:
                    return Response({"code": 403, "message": _("User has no role."), "fields": ""}, status=403)
                
                # Get promision by role + model key
                role_permission = Roles_Permission.objects.filter(
                    role=role, model_name__key=model_key).get()
                
                # If permission is change then access method 'GET, POST, PUT'
                if role_permission.permission == 'change' and request.method == 'DELETE':
                    clear_image_data(request)
                    return Response({"code": 403, "message": _("Forbidden"), "fields": ""}, status=403)

                # If permission is read then access only method GET
                if role_permission.permission == 'read' and request.method != 'GET':
                    clear_image_data(request)
                    return Response({"code": 403, "message": _("Forbidden"), "fields": ""}, status=403)

                return view_func(self, request, *args, **kwargs)

            except Roles_Permission.DoesNotExist, e:
                print "Roles_Permission with model: %s, role: %s not found" % (model_key, role)
                clear_image_data(request)
                return Response({"code": 403, "message": _("User don't have permission."), "fields": ""}, status=403)
            except Exception, e:
                error = {"code": 500, "message": _("Internal Server Error"), "fields": ""}
                return Response(error, status=500)

        return wrapped
    return wrapper