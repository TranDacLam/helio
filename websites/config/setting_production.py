import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEBUG = False

DATABASES = {
    'default': {
        'NAME': 'helio_web',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'helio',
        'PASSWORD': 'admin@helio.vn'
    },
    'sql_db': {
        'NAME': 'ECS7',
        'ENGINE': 'sqlserver_pymssql',
        'HOST': '113.176.107.20:1433',
        'USER': 'apiembed',
        'PASSWORD': 'ed@2017API',
        'PORT':1433
    }

}

gettext = lambda s: s
LANGUAGES = (
    ('vi', gettext('Vietnamese')),
    # ('en', gettext('English')),
)

FB_APP_ID = '753086748186657'
SOCIAL_AUTH_FACEBOOK_KEY = '753086748186657'
SOCIAL_AUTH_FACEBOOK_SECRET = '560179f08361bae229869d5b50312ea5'

RECAPTCHA_PUBLIC_KEY = '6LfMmSYUAAAAANJJC-toiepJxWBFlPXgfz9Cg5tA'
RECAPTCHA_PRIVATE_KEY = '6LfMmSYUAAAAAI8a3MHrDW07gjr9kddPAMd2nOTL'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_tester/apns-dis-cert.pem"),
    "APNS_USE_SANDBOX": False,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}

SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
