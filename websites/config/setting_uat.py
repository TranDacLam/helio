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
    }

}

RECAPTCHA_PUBLIC_KEY = '6LeuKE8UAAAAAF_Zn3MJtKTB1DA1GJqKhzZPf8Do'
RECAPTCHA_PRIVATE_KEY = '6LeuKE8UAAAAAFKkk1mYmcMlP0lWh6t1ae-stcmi'

FB_APP_ID = '160199168026175'
SOCIAL_AUTH_FACEBOOK_KEY = '160199168026175'
SOCIAL_AUTH_FACEBOOK_SECRET = '3f680749bf6a5bddb425d6e673354616'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_dev/push_dev.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}

BASE_URL_DMZ_API = "http://172.16.12.19:9000/api/"
DMZ_API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwaV91YXRAbWV0aXoudm4iLCJvcmlnX2lhdCI6MTUyMjk4MTcxNiwidXNlcl9pZCI6MiwiZW1haWwiOiJhcGlfdWF0QG1ldGl6LnZuIiwiZXhwIjoxNTIyOTgyMDE2fQ.91QJf8aycSB6P_Zfethn5hsF0bbF2VYKCJVIrQpZRaA"