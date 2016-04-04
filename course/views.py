# -*- coding: utf-8 -*-
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from .models import Category, SubCategory, Course, Chapter, Comment
from .serializers import CourseSerializer, CategorySerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'username'
    queryset = Category.objects.all().order_by('position')
    serializer_class = CategorySerializer