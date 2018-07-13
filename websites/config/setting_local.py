import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASES = {
    'default': {
        'NAME': 'helio_web',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'root',
        'OPTIONS': {
            'charset': 'utf8mb4' # Fix store icon error 
        }
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

BASE_URL_DMZ_API = "http://127.0.0.1:9000/api/"
DMZ_API_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTI4Nzg4MzcxLCJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsImV4cCI6MTUyODc4ODY3MX0.yHk5HAKza94SwBI7vRcBCoYHzGr40_pLvfRtaEB9cDA"


print os.path.join(BASE_DIR, "key_apns/pem_production/push_dis.pem")

# VNPAY CONFIG
VNPAY_RETURN_URL = 'http://127.0.0.1:8000/vi/vnpay/payment_return'  # get from config
VNPAY_PAYMENT_URL = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html'  # get from config
VNPAY_API_URL = 'http://sandbox.vnpayment.vn/merchant_webapi/merchant.html'
VNPAY_TMN_CODE = 'HELIOKP2'  # Website ID in VNPAY System, get from config
VNPAY_HASH_SECRET_KEY = 'WBWFEMOFBYBQZXPSQZTROPCKHQPGFAZD'  # Secret key for create checksum,get from config

VNPAY_ORDER_TYPE = '190003'

# SMS Config
SMS_BRAND = "HelioCenter"
SMS_USER = "heliocenter"
SMS_PASSWORD = "truyenthonghelio"
SMS_KEY = "VNFPT123BLUESEA1"
SMS_KEY_IV = "154dxc1scfzzad21"
SMS_URL = "http://ws.ctnet.vn/servicectnet.asmx?op=sendsms"


HELIO_ADMIN_EMAIL_TO_LIST = ["diemnguyen@vooc.vn", "diemnt.pnv@gmail.com"]


