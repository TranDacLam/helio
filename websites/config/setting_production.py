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
    # 'sql_db': {
    #     'NAME': 'ECS7',
    #     'ENGINE': 'sqlserver_pymssql',
    #     'HOST': '113.176.107.20:1433',
    #     'USER': 'apiembed',
    #     'PASSWORD': 'ed@2017API',
    #     'PORT':1433
    # }

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

# Account Google FCM : voocdn@gmail.com
PUSH_NOTIFICATIONS_SETTINGS = {
    "FCM_API_KEY": "AAAAARPFyW4:APA91bGqrXAbmz2YmtXdLZImLNPESNEHe4_uDucmwtHdHUfyxkx4xs542TRxWXusV9xvO4ozI23PpRi-c3APYX1WHgxQ8XwYYhtH8PxwCsATk9ZjIBwyf3wa3HK2sy4C8GekvmS1zjC0",
    "FCM_ERROR_TIMEOUT": 3600,
    "APNS_CERTIFICATE": os.path.join(BASE_DIR, "key_apns/pem_prod/pushDis.pem"),
    "APNS_USE_SANDBOX": False,
    "APNS_TOPIC": "vn.vooc.helio.mobile",
}

# SECURE_SSL_REDIRECT = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True


BASE_URL_DMZ_API = ""
DMZ_API_TOKEN = ""


# VNPAY CONFIG
VNPAY_RETURN_URL = 'https://helio.vn/vi/vnpay/payment_return'  # get from config
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

HELIO_ADMIN_EMAIL_TO_LIST = ["vietthang@khoiphat.vn", "quynhpham@helio.vn", "lamnguyen@helio.vn", "ngochang@khoiphat.vn"]
