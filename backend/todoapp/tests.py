from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import TodoItem
from django.conf import settings

class AuthTests(APITestCase):
    def test_register_user(self):
        url = reverse('register')
        data = {'username': 'testuser', 'password': 'testpassword123', 'email': 'test@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_login_user_sets_cookie(self):
        User.objects.create_user(username='testuser', password='testpassword123')
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(settings.SIMPLE_JWT['AUTH_COOKIE'], response.cookies)
        self.assertTrue(response.cookies[settings.SIMPLE_JWT['AUTH_COOKIE']]['httponly'])

    def test_logout_user_clears_cookie(self):
        user = User.objects.create_user(username='testuser', password='testpassword123')
        self.client.force_authenticate(user=user)
        url = reverse('logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # In Django's test client, deleting a cookie sets its value to "" and max-age to 0
        cookie = response.cookies.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        self.assertEqual(cookie.value, "")
        self.assertEqual(cookie['max-age'], 0)

class TodoItemTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        self.client.force_authenticate(user=self.user1)

    def test_create_todo(self):
        url = reverse('todo-list')
        data = {'title': 'Test Todo', 'description': 'Test Description', 'due_date': '2023-12-31T00:00:00Z'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TodoItem.objects.count(), 1)
        self.assertEqual(TodoItem.objects.get().user, self.user1)
        self.assertEqual(TodoItem.objects.get().due_date.year, 2023)

    def test_user_isolation(self):
        # User 2 creates a todo
        TodoItem.objects.create(user=self.user2, title='User2 Todo')

        # User 1 tries to list todos
        url = reverse('todo-list')
        response = self.client.get(url)
        self.assertEqual(len(response.data), 0)

    def test_update_todo(self):
        todo = TodoItem.objects.create(user=self.user1, title='Old Title')
        url = reverse('todo-detail', args=[todo.id])
        data = {'title': 'New Title'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        todo.refresh_from_db()
        self.assertEqual(todo.title, 'New Title')

    def test_delete_todo(self):
        todo = TodoItem.objects.create(user=self.user1, title='To Delete')
        url = reverse('todo-detail', args=[todo.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TodoItem.objects.count(), 0)
