# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import post_save
from filebrowser.fields import FileBrowseField
import datetime
import json


class Category(models.Model):
    """
    课程分类：计算机、数学、生物等
    """
    title = models.CharField(u'名称', max_length=20)
    # 子类与主类存在多对多关系
    sub = models.ManyToManyField('SubCategory', verbose_name=u"子类")
    position = models.IntegerField(u'顺序')

    class Meta:
        verbose_name = u'课程分类'
        verbose_name_plural = u'课程分类管理'

    def __unicode__(self):
        return '{0}'.format(self.title)


class SubCategory(models.Model):
    """
    子类
    """
    title = models.CharField(u'名称', max_length=20)
    position = models.IntegerField(u'顺序')

    class Meta:
        verbose_name = u'课程子分类'
        verbose_name_plural = u'课程子分类管理'

    def __unicode__(self):
        return '{0}'.format(self.title)


class Course(models.Model):
    """
    课程model
    """
    title = models.CharField(u'标题', unique=True, max_length=20)
    author = models.ForeignKey('authentication.Account', verbose_name=u'作者')
    poster = FileBrowseField(max_length=200, directory="course/poster/", verbose_name=u'海报', extensions=[".jpg", '.jpeg', '.gif', '.png',])
    summary = models.TextField(u'简介')
    subcategory = models.ManyToManyField('SubCategory', verbose_name=u'分类')
    create_at = models.DateTimeField(u'创建时间', auto_now_add=True)
    update_at = models.DateTimeField(u'更新时间', auto_now_add=True)

    class Meta:
        verbose_name = u'课程'
        verbose_name_plural = u'课程管理'

    def __unicode__(self):
        return '{0}-{1}'.format(self.title, self.author)

    def get_image_url(self):
        return self.poster.url


class Chapter(models.Model):
    """
    课程章节
    """
    title = models.CharField(u'章节标题', max_length=20)
    course = models.ForeignKey('Course', verbose_name=u"课程", related_name='chapters')
    upload_at = models.DateTimeField(u'上传时间', auto_now_add=True)
    video = FileBrowseField(u'视频地址', directory="course/video/", max_length=200, null=True, blank=True)
    attachment = FileBrowseField(u'附件', directory="course/attachment/", max_length=200, null=True, blank=True)
    content = models.TextField(u'内容', null=True, blank=True)
    operator = models.ForeignKey('authentication.Account', verbose_name=u"操作人")

    class Meta:
        verbose_name = u'课程章节'
        verbose_name_plural = u'课程章节管理'

    def __unicode__(self):
        return '{0}-{1}'.format(self.course.title, self.title)

    def get_video_url(self):
        try:
            return self.video.url
        except Exception, e:
            return ""

    def get_attachment_url(self):
        try:
            return self.attachment.url
        except:
            return ''

    def prev_next_index(self):
        id_list = Chapter.objects.filter(course=self.course).values_list('id', flat=True)
        index = -1
        if self.id in id_list:
            index = list(id_list).index(self.id)
        prev = id_list[index-1: index] if 0 < index <= len(id_list) - 1 else -1
        next = id_list[index+1: index+2] if 0 <= index < len(id_list) - 1 else -1
        data = {"prev": prev, "next": next}
        return json.dumps(data)


def chapter_post_save(sender, **kw):
    instance = kw['instance']
    try:
        instance.course.update_at = datetime.datetime.now()
        instance.course.save()
    except Exception, e:
        pass
    
post_save.connect(chapter_post_save,sender=Chapter)

class Comment(models.Model):
    # parent = models.ForeignKey('self', verbose_name=u'主评论', null=True)
    chapter = models.ForeignKey('Chapter', verbose_name=u'课程章节')
    content = models.TextField(u'内容')
    creator = models.ForeignKey('authentication.Account', verbose_name=u'评论用户', related_name="comment_owner")
    create_at = models.DateTimeField(u'评论创建时间', auto_now_add=True)
    vote = models.IntegerField(u'赞同数', default=0)

    def reply_len(self):
        return self.reply_set.count()

    def __unicode__(self):
        return '{0}-{1}'.format(self.chapter.title, self.creator.username)

    class Meta:
        verbose_name = u'课程评论'
        verbose_name_plural = u'课程评论管理'

class Reply(models.Model):
    """
    回复
    """
    comment = models.ForeignKey('Comment', verbose_name=u'评论')
    parent = models.ForeignKey('self', verbose_name=u'回复', null=True, blank=True)
    content = models.CharField(u'内容', max_length=100)
    creator = models.ForeignKey('authentication.Account', verbose_name=u'评论用户', related_name="reply_owner")
    create_at = models.DateTimeField(u'回复创建时间', auto_now_add=True)

    class Meta:
        verbose_name = u'评论回复'
        verbose_name_plural = u'评论回复管理'

    def __unicode__(self):
        parent_creator = self.parent_creator
        return '{0}回复{1}'.format(self.creator.username, parent_creator)

    def parent_creator(self):
        return self.parent.creator.username if self.parent else ""