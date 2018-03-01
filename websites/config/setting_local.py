import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASES = {
    'default': {
        'NAME': 'helio_web',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'root'
    },
    'sql_db': {
        'NAME': 'ECS7',
        'ENGINE': 'sqlserver_pymssql',
        'HOST': '192.168.1.222',
        'USER': 'sa',
        'PASSWORD': 'khoiphatit',
        'PORT':1433
    }
}

gettext = lambda s: s
LANGUAGES = (
    ('vi', gettext('Vietnamese')),
    ('en', gettext('English')),
)

FB_APP_ID = '382447632149159'
SOCIAL_AUTH_FACEBOOK_KEY = '382447632149159'
SOCIAL_AUTH_FACEBOOK_SECRET = '83bca2e84b3f783f7a41ca9ec14bb39c'

RECAPTCHA_PUBLIC_KEY = '6LfP2zoUAAAAAGhMBQuEguqc6ZV7JHIUdGuOGFJ0'
RECAPTCHA_PRIVATE_KEY = '6LfP2zoUAAAAACZmN3tAOOVCCE0U5BZeCtpTRAki'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}
# access control allow origin
CORS_ORIGIN_ALLOW_ALL = True
# X_FRAME_OPTIONS = "sameorigin"
X_FRAME_OPTIONS = 'ALLOW-FROM http://127.0.0.1:8000'
