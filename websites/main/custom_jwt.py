# from django.utils.dateformat import format


# from rest_framework_jwt.authentication import JSONWebTokenAuthentication

# class CustomJSONWebTokenAuthentication(JSONWebTokenAuthentication):
#     """ Expire token on password change and force user to re-authenticate. """

#     def authenticate_credentials(self, payload):
#         print 'orig_iat ',orig_iat
#         user = super(CustomJSONWebTokenAuthentication, self).authenticate_credentials(payload)

#         orig_iat = int(payload['orig_iat'])
#         token_last_expired = int(format(user.token_last_expired, 'U'))
#         print 'orig_iat ',orig_iat
#         if orig_iat < token_last_expired:
#             msg = 'Users must re-authenticate after logging out.'
#             raise exceptions.AuthenticationFailed(msg)

#         return user


from calendar import timegm
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import exceptions
from django.utils.translation import ugettext_lazy as _


class CustomJSONWebTokenAuthentication(JSONWebTokenAuthentication):

    def authenticate_credentials(self, payload):
        """
            While changing password: when the user changes his password, 
            note the change password time in the user db, so when the change password time is greater than the token creation time, 
            then token is not valid. Hence the remaining session will get logged out soon.
        """
        user = super(CustomJSONWebTokenAuthentication,
                     self).authenticate_credentials(payload)
        iat_timestamp = timegm(user.token_last_expired.utctimetuple())

        if iat_timestamp > payload['orig_iat']:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))
        return user
