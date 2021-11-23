from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.utils import DataError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse
import json
from .models import User,Post,Profile
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            profile=Profile(user=username)
            profile.save()

        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
def posts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(len(data["post_body"]))
        if len(set(data["post_body"]))==1:
            return JsonResponse({"error": "invalid input"}, status=404)
        Post.objects.create(creator=request.user,post_body=data["post_body"])     
        return JsonResponse({"message":"Created Successfully"},status=201)

    try:
        posts=Post.objects.all()
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
    
    if request.method=="GET":
        posts=posts.order_by("-created_at")
        return JsonResponse([post.serialize() for post in posts],safe=False)

@csrf_exempt
@login_required
def like_post(request,id):
    try:
        post=Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
    if request.method == "GET":
        return JsonResponse(post.serialize(),safe=False)
    if request.method == "PUT":
        post.deal_with_like(request.user)
        return JsonResponse(post.serialize(),safe=False)

@login_required
def profile(request):
    try:
        profile= Profile.objects.get(user=request.user)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(profile.serialize(),safe=False)

@csrf_exempt
@login_required
def edit_posts(request,id):
    try:
        post=Post.objects.get(id=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
 
    if request.method == "PUT":
        data=json.loads(request.body)
        if data["post_body"] and post.creator==request.user:
            post.post_body=data["post_body"]
            post.save()
            return JsonResponse(post.serialize(),safe=False)
        return JsonResponse({"message":"Error"},status=404)

@login_required
def get_posts_for_certain_user(request):
    try:
        posts=Post.objects.filter(creator=request.user)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
    
    if request.method=="GET":
        posts=posts.order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts],safe=False)

@login_required
def following_posts(request):
    try:
        users=Profile.objects.get(user=request.user).get_following()
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
    if request.method=="GET":
        posts=[Post.objects.filter(creator=User.objects.get(username=user)).order_by("-created_at").all() for user in users]
        if len(posts[0])==0:
            return JsonResponse({"error": "No Posts found."}, status=404)
        posts[0]=posts[0].order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts[0]],safe=False)

@login_required
def who_current_user(request):
    if request.method=="GET":
        
        return JsonResponse({"USERNAME":request.user.username},safe=False)