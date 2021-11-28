from django.test import TestCase,Client
from django.http import response
from django.urls import reverse
from network.models import User,Post,Profile
import json

class TestView(TestCase):
    def setUp(self):
        self.client=Client()
        self.index=reverse('index')
        self.following=reverse('Following')
        self.profile=reverse('profile')
        self.login=reverse('login')
        self.register=reverse('register')
        self.logout=reverse('logout')
        self.api_like_post=reverse('post_like',args=[1])
        self.api_posts=reverse('posts')
        self.api_profile=reverse('profile')
        self.api_post_id=reverse('posts_id',args=[1])
        self.api_edit_posts=reverse('edit_posts',args=[1])
        self.api_following=reverse('following',args=[1])
        self.api_current_user=reverse('who_current_user')
        self.User1=User.objects.create(username="Ahmed",password="123")
        self.User2=User.objects.create(username="Ahmedx",password="123")
        Profile.objects.create(following=[],followed=[],user=self.User1)
        Profile.objects.create(following=[],followed=[],user=self.User1)
       

    def test_index(self):
        response=self.client.get(self.index)
        self.assertEquals(response.status_code,200)
        self.assertTemplateUsed(response,'network/index.html')
    
    def test_Login(self):
        response=self.client.get(self.login)
        self.assertEquals(response.status_code,200)
        self.assertTemplateUsed(response,'network/login.html')
        response=self.client.post(self.login,{'username': 'john', 'password': 'smith'})
        self.assertEquals(response.status_code,404)
        self.assertTemplateUsed(response,'network/login.html')

    def test_Register(self):
        """
            R
        """
        response=self.client.get(self.register)
        self.assertEquals(response.status_code,200)
        self.assertTemplateUsed(response,'network/register.html')
        response=self.client.post(self.register,{'username': 'john','email':'john@x.com', 'password': 'smith' ,'confirmation':'dum'})
        self.assertEquals(response.status_code,400)
        self.assertTemplateUsed(response,'network/register.html')
        response=self.client.post(self.register,{'username': 'john','email':'john@x.com', 'password': 'smith' ,'confirmation':'smith'})
        self.assertEquals(response.status_code,302)
        self.assertRedirects(response,self.index)
        self.assertEquals(len(Profile.objects.all()),1)


        
    def test_Logout(self):
        response=self.client.get(self.logout)
        self.assertEquals(response.status_code,302)
        self.assertRedirects(response,self.index)
        