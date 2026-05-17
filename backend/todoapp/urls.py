from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoItemViewSet, RegisterView, CookieTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'todos', TodoItemViewSet, basename='todo')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
