// Execute JavaScript on page load
$(function() {

    // Initialize phone number text input plugin
    $('#phoneNumber').intlTelInput({
        responsiveDropdown: true,
        autoFormat: true,
        utilsScript: '/static/js/libphonenumber/src/utils.js'
    });

    var statusField = $('#callstatus');
    var callButton = $('#callbutton');

    // Get Capability Token from backend and set up Twilio Device
    $.get("/token", function(token) {
        console.log("JSON Web Token is " + JSON.stringify(token));
        Twilio.Device.setup(token);
    });

    // Callback for when device is ready
    Twilio.Device.ready(function(device) {
        console.log("Twilio Device ready.");
        callButton.prop('disabled', false);
        statusField.text('Ready');
    });

    // Callback for Twilio Device connection
    Twilio.Device.connect(function(connection) {
        console.log('Connection is ' + connection);
    });

    // Callback for when network connection is lost
    Twilio.Device.offline(function() {
        console.log("Network lost.");
    });

    Twilio.Device.cancel(function(conn) {
		console.log('Call cancelled by ' + conn.parameters.From);
        statusField.text = 'Call cancelled by ' + conn.parameters.From;
    });

    Twilio.Device.error(function(error) {
		console.log('Error: ' + error.message);
        statusField.text = 'Error: ' + error.message;
    });

    Twilio.Device.disconnect(function(conn) {
		console.log('Disconnect ' + conn);
        statusField.text = 'Call ended';
    });

    Twilio.Device.incoming(function(conn) {
		console.log('Incoming call from ' + conn.parameters.From);
        statusField.text = 'Incoming call from ' + conn.parameters.From;
        conn.accept(); // accept incoming connection, start two-way audio
    });

    function call() {
        var number = $('#phoneNumber').val();
        var callerId = $('#phoneNumber').attr('callerid');
        console.log('Calling ' + number + ' from ' + callerId + '...');
        Twilio.Device.connect({ 'phoneNumber': number,
                                'callerId': callerId });
        callButton.text('Hang up');
    }
    
    function hangUp() {
        Twilio.Device.disconnectAll();
        callButton.text('Call');
        console.log('Hanging up.');
    }
    
    dummy_call = function() {
		callButton.text('Hang up');
		console.log("Call!");
	};
	
	dummy_hangUp = function() {
		callButton.text('Call');
		console.log("Hang up!");
	};
    
    var callHangUp = (function () {
		var callInProgress = false;
		return function() {
			if (callInProgress == false) {
				callInProgress = true;
				call();
			} else {
				callInProgress = false;
				hangUp();
			}
		}
	})();
      
    callButton.click(function(event){
        // Prevent button from submitting the form and forcing a page reload
        event.preventDefault();
        callHangUp();
    });

});
