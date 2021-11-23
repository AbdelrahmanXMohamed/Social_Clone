
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
    path("api/edit/<int:id>",views.edit_posts,name="edit_posts"),
    path("api/postsOfUser",views.get_posts_for_certain_user,name="certain_user"),
    path("api/whoCurrentUser",views.who_current_user,name="who_current_user")

]
