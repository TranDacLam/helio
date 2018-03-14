import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
        'HOST': '172.16.12.16',
        'USER': 'sa',
        'PASSWORD': 'Helio@2017',
        'PORT':1433
    }

}

RECAPTCHA_PUBLIC_KEY = '6LfMmSYUAAAAANJJC-toiepJxWBFlPXgfz9Cg5tA'
RECAPTCHA_PRIVATE_KEY = '6LfMmSYUAAAAAI8a3MHrDW07gjr9kddPAMd2nOTL'

FB_APP_ID = '125339261388351'
SOCIAL_AUTH_FACEBOOK_KEY = '125339261388351'
SOCIAL_AUTH_FACEBOOK_SECRET = '407b1c042cfcd960750adc6eaed8728e'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_dev/push_dev.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}
