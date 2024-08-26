# Email templates for the accounts app
#
# Created on Sat Aug 24 2024
# Author : N.Venkat Swaroop
# Copyright (c) 2024
#

otp_email_template = """
Hello {full_name},

Your OTP code is: {otp}
Use this code to verify your account.
This code will expire in 10 minutes.

Regards,
{site_name}
"""

reset_password_template = """
Hello {full_name},

We received a request to reset your password. If you did not make this request, please ignore this email.

To reset your password, click the link below:
{reset_password_url}

This link will expire in 10 minutes.

Regards,
{site_name}
"""