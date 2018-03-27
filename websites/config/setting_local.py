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
        'HOST': '172.16.12.16',
        'USER': 'sa',
        'PASSWORD': 'Helio@2017',
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

RECAPTCHA_PUBLIC_KEY = '6Ld1lkwUAAAAADuY4gqvT9eAJbps2GMpQ0H1Jx5t'
RECAPTCHA_PRIVATE_KEY = '6Ld1lkwUAAAAAGpvhbhl2VcXR-toKwR4VA6wYGg9'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}
# access control allow origin
CORS_ORIGIN_ALLOW_ALL = True

BASE_URL_DMZ_API = "http://127.0.0.1:8003/api/"
DMZ_API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTIxMDk4NDk1LCJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsImV4cCI6MTUyMTA5ODc5NX0.UYRCf2Pvc0HXYXfhKDVE0kZelBxaRWpPOA4GRgE_vI4"


print os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem")