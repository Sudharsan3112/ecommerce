from django.urls import path
from .views import SignUpView, LoginView, CategoryListView, ProductListView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('categories/<int:category_id>/products/', ProductListView.as_view(), name='products'),
]
