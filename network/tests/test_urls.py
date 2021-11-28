from django import test
from django.urls import reverse
from django.urls.base import resolve
from network.views import login_view,index,profile,register,logout_view,user_profile,follow_user,like_post,posts,profile,posts_id,who_current_user,following_posts_pagination,edit_posts,get_posts_for_certain_user_pagination
class TestUrls(test.SimpleTestCase):
        
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

    def test_api_edit_posts_resolve_url(self):
        """
            Resolve edit_posts URL
        """
        url=reverse('edit_posts',args=[1])
        self.assertEquals(resolve(url).func,edit_posts)

    def test_api_following_posts_pagination_resolve_url(self):
        """
            Resolve following_posts_pagination URL
        """
        url=reverse('following',args=[1])
        self.assertEquals(resolve(url).func,following_posts_pagination)
   
    def test_api_certain_user_resolve_url(self):
        """
            Resolve certain_user URL
        """
        url=reverse('certain_user',args=[1])
        self.assertEquals(resolve(url).func,get_posts_for_certain_user_pagination)

    def test_api_who_current_user_resolve_url(self):
        """
            Resolve who_current_user URL
        """
        url=reverse('who_current_user')
        self.assertEquals(resolve(url).func,who_current_user)

    def test_api_follow_user_resolve_url(self):
        """
            Resolve follow_user URL
        """
        url=reverse('follow_user',args=[1])
        self.assertEquals(resolve(url).func,follow_user)
    def test_api_user_profile_resolve_url(self):
        """
            Resolve user_profile URL
        """
        url=reverse('user_profile',args=[1])
        self.assertEquals(resolve(url).func,user_profile)