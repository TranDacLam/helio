import os

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