
from django.urls import path

from network.models import Profile

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("api/posts",views.posts , name="posts"),
    path("api/posts/<int:id>",views.like_post , name="post_like"),
    path("api/profile",views.profile , name="profile"),
    path("api/following",views.following_posts,name="following"),
    path("api/all_posts",views.all_posts,name="all_posts")

]
