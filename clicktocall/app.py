from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request
from flask import url_for

from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from twilio.jwt.client import ClientCapabilityToken

# Declare and configure application
app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile('local_settings.py')

# Route for Click to Call demo page.
@app.route('/')
def index():
    app.logger.info('/ request')
    return render_template('index.html',
        defaultPhoneNumber = app.config['TWILIO_DEFAULT_PHONE_NUMBER'],
        callerId = app.config['TWILIO_CALLER_ID'])

# Generate Capability Token for making outgoing calls
@app.route('/token')
def token():
    app.logger.info('/token request')
    capability = ClientCapabilityToken(
        app.config['TWILIO_ACCOUNT_SID'],
        app.config['TWILIO_AUTH_TOKEN'])

    # Allow our users to make outgoing calls with Twilio Client
    capability.allow_client_outgoing(app.config['TWILIO_TWIML_APP_SID'])
    #capability.allow_client_incoming(app.config['TWILIO_CALLER_ID'])

    app.logger.info(capability)
    return capability.to_jwt()

# Provide endpoint for Twilio app
@app.route('/voice', methods=['POST'])
def voice():
    app.logger.info('/voice request {}'.format(request))
    
    # Need verified Twilio callerId to place outgoing calls
    caller_id = request.form.get('callerId', None)
    number = request.form.get('phoneNumber', None)
    
    if (number is None):
        raise Exception('Empty phoneNumber in request to /voice')

    response = VoiceResponse()
    response.say('Dialling {}'.format(' '.join(number)))
    response.dial(number, caller_id=caller_id)
    return str(response)