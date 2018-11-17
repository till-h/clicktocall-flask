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
app.logger.info('Flask app created')

# Route for Click to Call demo page.
@app.route('/')
def index():
    app.logger.info('/ request')
    return render_template('index.html',
                           configuration_error=None)

# Generate Capability Token for making outgoing calls
@app.route('/token')
def token():
    app.logger.info('/token request')
    capability = ClientCapabilityToken(
        app.config['TWILIO_ACCOUNT_SID'],
        app.config['TWILIO_AUTH_TOKEN'])

    # Allow our users to make outgoing calls with Twilio Client
    capability.allow_client_outgoing(app.config['TWILIO_TWIML_APP_SID'])

    # token = capability.generate()
    # return jsonify({'token': token})

    return capability.to_jwt()

# Provide endpoint for Twilio app
@app.route('/voice', methods=['POST'])
def voice():
    app.logger.info('/voice request')
    app.logger.info('/voice request {}'.format(request))
    
    number = request.form.get('phoneNumber', None)
    
    if (number is None):
        raise Exception('Empty phoneNumber in request to /voice')

    response = VoiceResponse()
    response.say('Dialling {}'.format(number))
    response.dial(number)
    return str(response)