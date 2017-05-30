import os

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
        'HOST': '113.160.225.204:1433',
        'USER': 'sa',
        'PASSWORD': 'vooc2017',
        'PORT':1433
    }

}