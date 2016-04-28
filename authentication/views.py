# -*- coding: utf-8 -*-
from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from django.forms.models import modelform_factory
from django.contrib.auth.hashers import check_password

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer
from course.serializers import CourseSerializer

import json


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == "PUT":
            return (permissions.IsAuthenticated(), IsAccountOwner(),)

        return (permissions.AllowAny(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        # partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)
        email = data.get('email', None)
        password = data.get('password', None)
        if request.user.is_authenticated():
            logout(request)
        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
    permissions_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)



class CurrentUserView(views.APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated():
            serialized = AccountSerializer(request.user)
            return Response(serialized.data)
        else:
            return Response({
                    'status': 'Unauthorized',
                    'message': '没有登陆，请先登陆!'
                }, status=status.HTTP_401_UNAUTHORIZED)


class UserUploadImageView(views.APIView):
    model = Account
    def get_object(self):
        return self.request.user

    def post(self, request):
        obj = self.get_object()
        AvatarForm = modelform_factory(self.model, fields=('avatar',))
        avatar_form = AvatarForm(request.POST, request.FILES, instance=obj)
        if avatar_form.is_valid():
            avatar_obj = avatar_form.save()
            serialized = AccountSerializer(avatar_obj)
            return Response(serialized.data)
        else:
            return Response({'errors': avatar_form.errors})


class CheckUserPasswordView(views.APIView):
    model = Account
    def get_object(self):
        return self.request.user

    def post(self, request):
        obj = self.get_object()
        data = request.data
        password = data.get('password', None)
        if password and check_password(password, obj.password):
            return Response({'success': True})
        else: 
            return Response({'success': False, 'message': u'请输入正确的密码!'})


class UserFollowCourseView(viewsets.ReadOnlyModelViewSet):
    queryset = None
    serializer_class = CourseSerializer

    def get_queryset(self):
        return self.request.user.course.all().order_by('-update_at')