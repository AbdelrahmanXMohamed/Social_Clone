from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User,Post,Profile


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

@login_required
def posts(request):

    try:
        posts=Post.objects.filter(creator=request.user)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)
    
    if request.method=="GET":
        posts=posts.order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts],safe=False)

@login_required
def like_post(request,id):
    try:
        post=Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)

    if request.method == "POST":
        if request.user not in post.likes:
            post.likes.add(request.user)

        else:
            post.likes.remove(request.user)
        
        posts=Post.objects.filter(creator=request.user)
        posts=posts.order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts],safe=False)

@login_required
def profile(request):
    try:
        profile= Profile.objects.get(user=request.user)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)

    if request.method == "GET":
        
        return JsonResponse(profile.serialize(),safe=False)
