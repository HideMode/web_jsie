# -*- coding: utf-8 -*-
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, status, views
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import filters
from authentication.permissions import IsAccountOwner
from .models import Category, SubCategory, Course, Chapter, Comment, Reply
from .serializers import CourseSerializer, CategorySerializer, ChapterSerializer, CommentSerializer, ReplySerializer
import json


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 10000

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    # filter_backends = (filters.DjangoFilterBackend,)
    # filter_class = CourseFilter
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    search_fields = ('title',)
    filter_backends = (filters.SearchFilter,)
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        cateId = self.request.query_params.get('cate_id', "0")
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


class ChangeCourseStatus(views.APIView):

    model = Course

    def get_object(self):
        return self.request.user

    def get_permissions(self):
        return (IsAccountOwner(),)

    def post(self, request):
        data = request.data
        course_id = data.get('course_id', None)
        # course_id = self.request.POST.get('course_id', None)
        obj = self.get_object()
        # list is queryset array
        # course_id is id 
        data = {
            'msg': '',
            'success': True,
            'follow': True
        }
        if int(course_id) in obj.course.all().values_list('id', flat=True):
            try:
                course_obj = Course.objects.get(pk=course_id)
                obj.course.remove(course_obj)
                data["msg"] = u'课程取消关注成功!'
                data['follow'] = False
            except Exception, e:
                data.update({
                    msg: u'服务器错误',
                    success: False,
                    error: unicode(e)
                    })
        else:
            obj.course.add(course_id)
            data["msg"] = u'课程关注成功!'
        return Response(data)