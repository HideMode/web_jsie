# Register your models here.
# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Category, SubCategory, Course, Chapter, Comment

admin.site.register(Category)

admin.site.register(SubCategory)
admin.site.register(Course)
admin.site.register(Chapter)

admin.site.register(Comment)
