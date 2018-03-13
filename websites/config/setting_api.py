import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASES = {
    'default': {
        'NAME': 'helio_api_db',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'helio',
        'PASSWORD': 'admin@helio.vn'
    },
    'sql_db': {
        'NAME': 'ECS7',
        'ENGINE': 'sqlserver_pymssql',
        'HOST': '113.160.225.204:1433',
        'USER': 'sa',
        'PASSWORD': 'vooc2017',
        'PORT':1433
    }

}


gettext = lambda s: s
LANGUAGES = (
    ('vi', gettext('Vietnamese')),
    ('en', gettext('English')),
)
RECAPTCHA_PUBLIC_KEY = '6LcScCcUAAAAAHjKpSCNS2-m2JkEHxsyEgXQx10l'
RECAPTCHA_PRIVATE_KEY = '6LcScCcUAAAAAK1_4pfun7sgVPuxGUk4hNfEyj6l'


FB_APP_ID = '125339261388351'
SOCIAL_AUTH_FACEBOOK_KEY = '125339261388351'
SOCIAL_AUTH_FACEBOOK_SECRET = '407b1c042cfcd960750adc6eaed8728e'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_tester/apns-dis-cert.pem"),
    "APNS_USE_SANDBOX": False,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}
