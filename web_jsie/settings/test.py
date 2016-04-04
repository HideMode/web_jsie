# -*- coding: utf-8 -*-
from .base import *

# 用于测试服务器使用
DEBUG = True

TEMPLATE_DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dvcrm',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '192.168.1.201',
        'PORT': '',
    }
}
