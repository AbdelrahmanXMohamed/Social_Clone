# Generated by Django 3.2.6 on 2021-11-16 13:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_posts_profile'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Posts',
            new_name='Post',
        ),
    ]
