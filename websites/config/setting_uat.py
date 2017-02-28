import os

DATABASES = {
    'default': {
        'NAME': 'helio_dev',
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'vooc@min'
    },
    'sql_db': {
        'NAME': 'ECS7',
        'ENGINE': 'sqlserver_pymssql',
        'HOST': '192.168.1.9\SQLEXPRESS',
        'USER': 'sa',
        'PASSWORD': 'abcde12345-',
        'POST':1433
    }

}