from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    creator= models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    post_body=models.TextField(blank=False,null=False)
    likes = models.ManyToManyField(User,blank=True,related_name="Likes")
    def __str__(self):
        return f'{self.creator}'
    def serialize(self):
        return {
        "id":self.id,
        "created_at": self.created_at.strftime("%b %d %Y, %I:%M %p"),
        "likes":[like.username for like in self.likes.all()],
        "creator":{"username":self.creator.username,"id":self.creator.id},
        "post_body":self.post_body
        }    
    def deal_with_like(self,user):
        if user not in self.likes.all():
            self.likes.add(user)

        else:
            self.likes.remove(user)
    class Meta:
        ordering = ['-created_at']

class Profile(models.Model):
    following =models.ManyToManyField(User,blank=True,related_name="following")
    followed =models.ManyToManyField(User,blank=True,related_name="followed")
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.user}'
    def serialize(self):
        return {
        "id":self.id,
        "followed":len(self.followed.all()),
        "following":len(self.following.all()),
        "followed_data": [user.id for user in self.followed.all()],
        "following_data":[user.id for user in self.following.all()],
        "user":self.user.username
        }
    def get_following(self):

        following_usernames= [follow.username for follow in self.following.all()]
        return following_usernames  
        