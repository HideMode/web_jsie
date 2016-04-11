# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from .models import Category, SubCategory, Course, Chapter, Comment
from .serializers import CourseSerializer, CategorySerializer, ChapterSerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # def retrieve(self, request, pk=None):
    #     course_ins = get_object_or_404(Course, pk=pk)
    #     serializer = 


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'username'
    queryset = Category.objects.all().order_by('position')
    serializer_class = CategorySerializer


class ChapterViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer