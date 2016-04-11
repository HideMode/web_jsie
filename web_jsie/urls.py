from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_nested import routers
from authentication.views import AccountViewSet, LoginView, LogoutView
from course.views import CourseViewSet, CategoryViewSet, ChapterViewSet
from .views import IndexView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from filebrowser.sites import site
admin.autodiscover()
router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'chapters', ChapterViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^grappelli/', include('grappelli.urls')), # grappelli URLS
    url(r'^admin/filebrowser/', include(site.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', IndexView.as_view(), name='index'),

]
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
