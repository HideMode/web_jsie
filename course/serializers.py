#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#  Copyright © HideMode
# Last modified: 2016-03-28 20:21:06


from rest_framework import serializers

from authentication.serializers import AccountSerializer
from .models import Category, SubCategory, Course, Chapter, Comment, Reply


class ChapterBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chapter
        fields = ('id', 'upload_at', 'title')


class ChapterSerializer(serializers.ModelSerializer):
    video = serializers.CharField(source="get_video_url")
    attachment = serializers.CharField(source="get_attachment_url")
    link = serializers.CharField(source="prev_next_index")
    class Meta:
        model = Chapter
        fields = ('id', 'title', 'course', 'upload_at', 'video', 'attachment', 'content', 'link')


class CourseSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)
    poster = serializers.CharField(source='get_image_url')
    chapters = ChapterBaseSerializer(read_only=True, many=True)

    class Meta:
        model = Course

        fields = ('id', 'title', 'author', 'poster', 'summary', 'subcategory', 'create_at', 
            'update_at', 'chapters')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        depth = 3


class CommentSerializer(serializers.ModelSerializer):
    creator = AccountSerializer(read_only=True, required=False)
    reply_count = serializers.IntegerField(source="reply_len", required=False, read_only=True)
    class Meta:
        model = Comment


class ReplySerializer(serializers.ModelSerializer):
    creator = AccountSerializer(read_only=True, required=False)
    class Meta:
        model = Reply