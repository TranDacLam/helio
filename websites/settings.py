"""
Django settings for helio_web project.

Generated by 'django-admin startproject' using Django 1.10.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os
import datetime

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '4ygz*y=+@n+gl4!7#b070!+(&g(5uo09&-$crcvp+w^87&%ize'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

FB_APP_ID = '126726044544310'


# Application definition

INSTALLED_APPS = [
    'modeltranslation',
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'rest_framework.authtoken',
    'social_django',
    'rest_social_auth',
    'main',
    'core',
    'api',
    'ckeditor',
    'ckeditor_uploader'
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

ROOT_URLCONF = 'main.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.static',
                'django.template.context_processors.media',
                'main.middleware.set_language_code',
                'main.middleware.get_app_fb_id',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Custom User Model
AUTH_USER_MODEL = 'core.User'

SOCIAL_AUTH_USER_MODEL = 'core.User'
# Config Social Account
SOCIAL_AUTH_FACEBOOK_KEY = '295137440610143'
SOCIAL_AUTH_FACEBOOK_SECRET = '4b4aef291799a7b9aaf016689339e97f'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email', ]
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': ','.join([
        # public_profile
        'id', 'cover', 'name', 'first_name', 'last_name', 'age_range', 'link',
        'gender', 'locale', 'picture', 'timezone', 'updated_time', 'verified',
        # extra fields
        'email',
    ]),
}

# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '976099811367-ihbmg1pfnniln9qgfacleiu41bhl3fqn.apps.googleusercontent.com'
# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'JaiLLvY1BK97TSy5_xcGWDhp'
# SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email', ]

# SOCIAL_AUTH_TWITTER_KEY = 'gCrpEpNxpWkAE6Cul98OzAWTk'
# SOCIAL_AUTH_TWITTER_SECRET = '7SYSRpYY4amW5kiNXUAxUDdWS7G3nHytRIGHbDVTByzBfsqDJl'

AUTHENTICATION_BACKENDS = (
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.twitter.TwitterOAuth',  # OAuth1.0
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'core.pipeline.check_email_exists',  # custom action
    'social_core.pipeline.user.create_user',
    # 'social_core.pipeline.mail.mail_validation',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    # 'social_core.pipeline.social_auth.associate_by_email',
    
    
    # 'users.social_pipeline.auto_logout',  # custom action
    # 'users.social_pipeline.check_for_email',  # custom action
    # 'users.social_pipeline.save_avatar',  # custom action
)


REST_SOCIAL_LOG_AUTH_EXCEPTIONS = True
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True
# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'EXCEPTION_HANDLER': 'api.views.custom_exception_handler'
}
JWT_AUTH = {
    # 'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=1700),
    'JWT_AUTH_HEADER_PREFIX':'Bearer',
    'JWT_VERIFY_EXPIRATION': False
}

REST_USE_JWT = True
# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/
LANGUAGE_CODE = 'vi'

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# # config model translation
gettext = lambda s: s
LANGUAGES = (
    ('vi', gettext('Vietnamese')),
    ('en', gettext('English')),
)

# MODELTRANSLATION_DEFAULT_LANGUAGE = 'vi'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'public/static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'public', 'media')

STATIC_ROOT_PATH = os.path.join(BASE_DIR, "static")

STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(BASE_DIR, "static"),
)

CKEDITOR_UPLOAD_PATH = "uploads/"

CKEDITOR_JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'extraPlugins': ','.join(
            [
               'codesnippetgeshi',
               'placeholder',
               'dialog',
               'dialogui'
            ]
        ),
        'font_names': "Yanone Kaffeesatz; Cabin",
        'contentsCss': ','.join(['../../../../static/assets/websites/css/custom_admin.css'])
    },
}
CKEDITOR_BROWSE_SHOW_DIRS = True
CKEDITOR_IMAGE_BACKEND = "pillow"

DEFAULT_FROM_EMAIL = "do-not-reply@helio.vn"
# EMAIL_BACKEND = 'django_smtp_ssl.SSLEmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'voocdn@gmail.com'
EMAIL_HOST_PASSWORD = 'voocP@ssw0rd'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# EMAIL_USE_SSL = True

CODE_LEN = 7 # Default code length

try:
    if 'DEVELOPMENT' in os.environ and os.environ['DEVELOPMENT']:
        from config.setting_local import *

    if 'UAT' in os.environ and os.environ['UAT']:
        from config.setting_uat import *

    if 'PRODUCTION' in os.environ and os.environ['PRODUCTION']:
        from config.setting_production import *

except ImportError:
    pass


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s:%(name)s: %(message)s '
                      '(%(asctime)s; %(filename)s:%(lineno)d)',
            'datefmt': "%Y-%m-%d %H:%M:%S",
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'rest_social_auth': {
            'handlers': ['console', ],
            'level': "DEBUG",
        },
    }
}