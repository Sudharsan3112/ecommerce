from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import render
from elasticsearch_dsl.query import MultiMatch
from .documents import ProductDocument


# User Signup View
class SignUpView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
        User.objects.create_user(username=username, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# User Login View
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "refresh": str(refresh),
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Category List View
class CategoryListView(APIView):
    # Uncomment to enforce authentication
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

# Product List View by Category
class ProductListView(APIView):
    # Uncomment to enforce authentication
    permission_classes = [IsAuthenticated]

    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        category = Category.objects.get(id=category_id)
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

# Book Search View
class BookSearchView(APIView):
    def get(self, request):
        q = request.GET.get("q")
        if q:
            try:
                # Perform search on Elasticsearch using the ProductDocument
                search_query = MultiMatch(query=q, fields=["name"], fuzziness="AUTO")
                s = ProductDocument.search().query(search_query)
                
                # Get the search results as a list of dictionaries
                results = [{"name": hit.name} for hit in s]  # Modify this as needed to include more fields
                return Response({"products": results})  # Return the results as JSON

            except Exception as e:
                # Handle any exceptions that occur during the search
                return Response({"error": f"Search failed: {str(e)}"}, status=500)
        else:
            return Response({"error": "No search query provided"}, status=400)
