#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#  Copyright © HideMode
# Last modified: 2016-03-28 20:21:06


from rest_framework import serializers

from authentication.serializers import AccountSerializer
from .models import Category, SubCategory, Course, Chapter, Comment


class CourseSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Course

        fields = ('id', 'title', 'author', 'poster', 'summary', 'subcategory', 'create_at')
        read_only_fields = ('id', 'create_at')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        depth = 2
