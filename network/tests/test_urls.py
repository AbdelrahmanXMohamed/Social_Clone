from django import test
from django.test import SimpleTestCase
from django.urls import reverse
from django.urls.base import resolve
from network.views import login_view,index, profile,register,logout_view,like_post,posts,profile,posts_id,who_current_user
class TestUrls(SimpleTestCase):
        
    def test_index_resolve_url(self):
        """
            Resolve Index URL
        """
        url=reverse('index')
        self.assertEquals(resolve(url).func,index)

    def test_profile_resolve_url(self):
        """
            Resolve Profile URL
        """
        url=reverse('Profile')
        self.assertEquals(resolve(url).func,index)
   
    def test_following_resolve_url(self):
        """
            Resolve Following URL
        """
        url=reverse('Following')
        self.assertEquals(resolve(url).func,index)

    def test_login_resolve_url(self):
        """
            Resolve Login URL
        """
        url=reverse('login')
        self.assertEquals(resolve(url).func,login_view)
    
    def test_register_resolve_url(self):
        """
            Resolve Register URL
        """
        url=reverse('register')
        self.assertEquals(resolve(url).func,register)

    def test_logout_resolve_url(self):
        """
            Resolve Logout URL
        """
        url=reverse('logout')
        self.assertEquals(resolve(url).func,logout_view)


    def test_api_like_post_resolve_url(self):
        """
            Resolve Like post URL
        """
        url=reverse('post_like',args=[1])
        self.assertEquals(resolve(url).func,like_post)

    def test_api_posts_resolve_url(self):
        """
            Resolve Posts URL
        """
        url=reverse('posts')
        self.assertEquals(resolve(url).func,posts)

    def test_api_profile_resolve_url(self):
        """
            Resolve Profile URL
        """
        url=reverse('profile')
        self.assertEquals(resolve(url).func,profile)

    def test_api_posts_id_resolve_url(self):
        """
            Resolve posts_id URL
        """
        url=reverse('posts_id',args=[1])
        self.assertEquals(resolve(url).func,posts_id)

    def test_api_who_current_user_resolve_url(self):
        """
            Resolve who_current_user URL
        """
        url=reverse('who_current_user')
        self.assertEquals(resolve(url).func,who_current_user)