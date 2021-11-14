from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Posts(models.Model):
    creator= models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    post_body=models.TextField(blank=False,null=False)
    likes = models.ManyToManyField(User,blank=True,related_name="Likes")

class Profile(models.Model):
    following =models.ManyToManyField(User,blank=True,related_name="following")
    followed =models.ManyToManyField(User,blank=True,related_name="followed")
    user=models.ForeignKey(User,on_delete=models.CASCADE)