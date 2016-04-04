# -*- coding: utf-8 -*-
from .base import *

# 开发人员开发使用， 数据库等个人相关信息
DEBUG = True
TEMPLATE_DEBUG = True

# MEDIA_URL = 'http://static.example.com/'
DB_NAME = "web_jsie"
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_HOST = '127.0.0.1'

if os.environ.get('USER') == "hidemode" or os.environ.get("USERNAME") == 'hidemod':
    DB_USER = "root"
    DB_PASSWORD = '1027'
    DB_HOST = '127.0.0.1'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': '',
    }
}