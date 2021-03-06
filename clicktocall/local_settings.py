import os

'''
Configuration Settings

Uncomment to configure using the file.
WARNING: Be careful not to post your account credentials on GitHub.
'''

TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID', None)
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN', None)
TWILIO_CALLER_ID = os.environ.get('TWILIO_CALLER_ID', None)
TWILIO_TWIML_APP_SID = os.environ.get('TWILIO_TWIML_APP_SID', None)
TWILIO_DEFAULT_PHONE_NUMBER = os.environ.get('TWILIO_DEFAULT_PHONE_NUMBER', None)