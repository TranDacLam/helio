from custom_models import User
from rest_framework.response import Response
from django.utils.translation import ugettext, ugettext_lazy as _
from requests import request, HTTPError
from django.core.files.base import ContentFile


def check_email_exists(backend, details, uid, user=None, *args, **kwargs):
    print 'Check Email Verify ', user

    email = details.get('email', '')
    provider = backend.name

    # check if social user exists to allow logging in (not sure if this is
    # necessary)
    social = backend.strategy.storage.user.get_social_auth(provider, uid)
    print 'Check Email Verify social ', social
    # check if given email is in use
    count = User.objects.filter(email=email).count()
    print 'Check Email Verify count ', count
    # user is not logged in, social profile with given uid doesn't exist
    # and email is in use
    if not user and not social and count:
        return Response({'message': _("Email is ready in system. Please choice another email.")}, status=400)


def save_avatar(strategy, details, user=None, *args, **kwargs):
    """Get user avatar from social provider."""
    if user:
        backend_name = kwargs['backend'].__class__.__name__.lower()
        response = kwargs.get('response', {})
        social_thumb = None
        if 'facebook' in backend_name:
            if 'id' in response:
                social_thumb = (
                    'http://graph.facebook.com/{0}/picture?type=normal'
                ).format(response['id'])

        elif 'twitter' in backend_name and response.get('profile_image_url'):
            social_thumb = response['profile_image_url']
        elif 'googleoauth2' in backend_name and response.get('image', {}).get('url'):
            social_thumb = response['image']['url'].split('?')[0]
        else:
            social_thumb = 'http://www.gravatar.com/avatar/'
            social_thumb += hashlib.md5(
                user.email.lower().encode('utf8')).hexdigest()
            social_thumb += '?size=100'

        if social_thumb and user.avatar != social_thumb:
            # user.avatar = social_thumb
            try:
                response_social = request('GET', social_thumb)
                user.avatar.save('{0}_social.jpg'.format(user.username),
                                 ContentFile(response_social.content))
                strategy.storage.user.changed(user)
            except HTTPError:
                pass

def check_account_active(backend, details, uid, user=None, *args, **kwargs):
    if not user and not user.is_active:
        return Response({'message': _("Account is not active. Please contact support team.")}, status=400)

