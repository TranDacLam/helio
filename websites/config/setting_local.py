import os

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
        'HOST': '192.168.1.212\SQLEXPRESS',
        'USER': 'sa',
        'PASSWORD': 'abcde12345-',
        'POST':1433
    }
}