# Register your models here.
# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Category, SubCategory, Course, Chapter, Comment, Reply
from filebrowser.settings import ADMIN_THUMBNAIL
from django.forms.models import BaseInlineFormSet


class SetCurrentUserFormset(BaseInlineFormSet):
    """
    This assume you're setting the 'request' and 'user_field' properties
    before using this formset.
    """
    def save_new(self, form, commit=True):
        """
        This is called when a new instance is being created.
        """
        obj = super(SetCurrentUserFormset, self).save_new(form, commit=False)
        obj.operator = self.request.user
        if commit:
            obj.save()
        return obj

    # def save_existing(self, form, instance, commit=True):
    #     """
    #     This is called when updating an instance.
    #     """
    #     obj = super(SetCurrentUserFormset, self).save_existing(form, instance, commit=False)
    #     setattr(obj, self.user_field, self.request.user)
    #     if commit:
    #         obj.save()
    #     return obj

class ChapterInline(admin.StackedInline):
    model = Chapter
    formset = SetCurrentUserFormset
    readonly_fields = ('operator',)
    show_change_link = True

    def get_formset(self, request, obj=None, **kwargs):
        formset = super(ChapterInline, self).get_formset(request, obj, **kwargs)
        formset.request = request
        return formset

admin.site.register(Category)

admin.site.register(SubCategory)
class CourseAdmin(admin.ModelAdmin):
    fieldsets = (
        (u'课程信息', {
            'classes': ('grp-collapse', 'grp-closed'),
            'fields': ('title', 'author', 'poster', 'summary')
        }),
    )
    list_display = ('title', 'author', 'poster', 'summary', 'create_at')
    search_fields = ('title',)
    inlines = (ChapterInline,)

    class Media:
        js = [
            '/static/grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
            '/static/javascripts/util/tinymce_setup.js'
        ]

admin.site.register(Course, CourseAdmin)
admin.site.register(Chapter)

class ReplyInline(admin.TabularInline):
    model = Reply
    readonly_fields = ('creator', 'parent', 'create_at')
    # fields = (... , "position",)
    # sortable_field_name = "create_at"

class CommentAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'get_content', 'creator', 'create_at')
    list_filter = ('chapter',)
    inlines = (ReplyInline,)
    def get_content(self, obj):
        return obj.content
    get_content.allow_tags = True

admin.site.register(Comment, CommentAdmin)
