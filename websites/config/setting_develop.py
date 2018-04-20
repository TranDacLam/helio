import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASES = {
    'default': {
        'NAME': 'helio_web',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'Admin@v00c.vn'
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

RECAPTCHA_PUBLIC_KEY = '6LdIVEwUAAAAAJ6HhauYyGt-Yr2sTLLTDmBvddQP'
RECAPTCHA_PRIVATE_KEY = '6LdIVEwUAAAAAFEBxOt9dd7lnozqpUrHy9laxoKF'

PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAMkND2_U:APA91bEVkDFA8uACGPTTj-Vc86kg4fuyhrPuUmGHJdzkuBaaJh4ZQuc09zMZCEt2xaSj5Xi7opPT9OZHq-hxDrWmqfkRGqRv38uC2nqHHK3Xwy-jwglWoSwIYywpT-qcsoW9TKAsiUayeRAkj_AYJ0AG-D02Ubx0jg",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem"),
    "APNS_USE_SANDBOX": True,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}

BASE_URL_DMZ_API = "http://172.16.12.10:9000/api/"
DMZ_API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQHZvb2Mudm4iLCJvcmlnX2lhdCI6MTUyMTYwNjc2NSwidXNlcl9pZCI6MSwiZW1haWwiOiJhZG1pbkB2b29jLnZuIiwiZXhwIjoxNTIxNjA3MDY1fQ.9hE6nQzUboTHYdG3kexLoJiTDAVYM-jIheXBFFr0gmM"

