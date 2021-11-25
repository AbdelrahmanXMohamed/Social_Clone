
from django.urls import path

from network.models import Profile

from . import views

urlpatterns = [
    #path("<path:path>", views.index, ),
    path("", views.index, name="index"),
    path("profile", views.index, name="Profile"),
    path("following", views.index, name="Following"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
#api
    path("api/posts",views.posts , name="posts"),
    path("api/postsID/<int:id>",views.posts_id , name="posts_id"),
    path("api/posts/<int:id>",views.like_post , name="post_like"),
    path("api/profile",views.profile , name="profile"),
    path("api/following/<int:id>",views.following_posts_pagination,name="following"),
    path("api/edit/<int:id>",views.edit_posts,name="edit_posts"),
    path("api/postsOfUser/<int:id>",views.get_posts_for_certain_user_pagination,name="certain_user"),
    path("api/whoCurrentUser",views.who_current_user,name="who_current_user")

]
