from django.db import models
from django.core.validators import RegexValidator

class ContactUs(models.Model):
    name = models.CharField(max_length=100, help_text='Full name')
    email = models.EmailField(help_text='Email address')
    phone = models.CharField(max_length=15, blank=True, null=True, help_text='Phone number', validators=[RegexValidator(r'^\+?\d{9,15}$')])
    message = models.TextField(help_text='Message', blank=True, null=True, max_length=600)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Contact Us'
        verbose_name_plural = 'Contact Us'

    def __str__(self):
        return self.name