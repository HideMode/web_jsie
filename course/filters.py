# -*- coding: utf-8 -*-
import django_filters
from .course import Course


class CourseFilter(django_filters.FilterSet):
    title = django_filters.CharField(lookup_expr="icontains")

    class Meta:
        model=Course