# Generated by Django 3.2.5 on 2022-09-09 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0004_auto_20220909_1927'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='qr_uuid',
            field=models.CharField(blank=True, db_index=True, max_length=255, null=True),
        ),
    ]
