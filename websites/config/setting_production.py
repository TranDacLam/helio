import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEBUG = False

DATABASES = {
    'default': {
        'NAME': 'helio_db',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'helio',
        'PASSWORD': 'admin@helio.vn'
    },
    'sql_db': {
        'NAME': 'ECS7',
        'ENGINE': 'sqlserver_pymssql',
        'HOST': '172.16.1.10:1433',
        'USER': 'cskh',
        'PASSWORD': 'CHelio@@2016#',
        'POST':1433
    }

}

FB_APP_ID = '753086748186657'
SOCIAL_AUTH_FACEBOOK_KEY = '753086748186657'
SOCIAL_AUTH_FACEBOOK_SECRET = '560179f08361bae229869d5b50312ea5'

RECAPTCHA_PUBLIC_KEY = '6LdxuyMUAAAAAEm4t7YjahOec7Zc-8xZcdwNw_6c'
RECAPTCHA_PRIVATE_KEY = '6LdxuyMUAAAAALoyxmi8-y4rnWA_X9P3AWqca8TP'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}
