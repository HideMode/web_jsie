# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, status, views
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Category, SubCategory, Course, Chapter, Comment, Reply
from .serializers import CourseSerializer, CategorySerializer, ChapterSerializer, CommentSerializer, ReplySerializer


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 10000

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # pagination_class = PageNumberPagination
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        cateId = self.request.query_params.get('cate_id', "0")
        print('len', len(self.queryset))
        if cateId != '0':
            return self.queryset.filter(subcategory=cateId)
        return self.queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('position')
    serializer_class = CategorySerializer


class ChapterViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer


class CommentViewSet(viewsets.ModelViewSet):
    # lookup_field = 'chapter_id'
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        chapter_id = self.request.GET.get('chapter_id', '')
        if chapter_id:
            return self.queryset.filter(chapter_id=chapter_id).order_by('vote', '-create_at')
        return None

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    def get_queryset(self):
        comment_id = self.request.GET.get('comment_id', '')
        if comment_id:
            return self.queryset.filter(comment_id=comment_id).order_by('-create_at')
        return None

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)