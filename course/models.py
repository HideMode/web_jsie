# -*- coding: utf-8 -*-
from django.db import models

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
    poster = models.ImageField(upload_to='course/poster/', verbose_name=u'海报')
    summary = models.TextField(u'简介')
    subcategory = models.ManyToManyField('SubCategory', verbose_name=u'分类')
    create_at = models.DateTimeField(u'创建时间', auto_now_add=True)

    class Meta:
        verbose_name = u'课程'
        verbose_name_plural = u'课程管理'

    def __unicode__(self):
        return '{0}-{1}'.format(self.title, self.author)


class Chapter(models.Model):
    """
    课程章节
    """
    title = models.CharField(u'章节标题', max_length=20)
    course = models.ForeignKey('Course', verbose_name=u"课程")
    upload_at = models.DateTimeField(u'上传时间', auto_now_add=True)
    video = models.CharField(u'视频地址', max_length=200, null=True, blank=True)
    content = models.TextField(u'内容', null=True, blank=True)
    operator = models.ForeignKey('authentication.Account', verbose_name=u"操作人")
    upload_at = models.DateTimeField(u'上传时间', auto_now_add=True)


class Comment(models.Model):
    parent = models.ForeignKey('self', verbose_name=u'主评论', null=True)
    chapter = models.ForeignKey('Chapter', verbose_name=u'课程章节')
    text = models.CharField(u'内容', max_length=300)
    creator = models.ForeignKey('authentication.Account', verbose_name=u'评论用户', related_name="comment_owner")
    create_at = models.DateTimeField(u'评论创建时间')
    vote = models.IntegerField(u'赞同数', default=0)
