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

    console.log(callButton);

    // Callback for when network connection is lost
    Twilio.Device.offline(function() {
        console.log("Network lost.");
    });

    Twilio.Device.cancel(function(conn) {
        statusField.innerHTML = 'Call cancelled by ' + conn.parameters.From;
        // conn.status
    });

    Twilio.Device.error(function(error) {
        statusField.innerHTML = 'Error: ' + error.message;
    });

    Twilio.Device.disconnect(function(conn) {
        statusField.innerHTML = 'Call ended';
    });

    Twilio.Device.incoming(function(conn) {
        statusField.innerHTML = 'Incoming call from ' + conn.parameters.From;
        conn.accept(); // accept incoming connection, start two-way audio
    });

    callButton.click(function(event){
        // Prevent button from submitting the form and forcing a page reload
        event.preventDefault();
        console.log('callButton clicked!');
        call();
    });

    function hangUp() {
        Twilio.Device.disconnectAll();
        callButton.text('Call');
    }

    function call() {
        var number = $('#phoneNumber').val();
        var callerId = $('#phoneNumber').attr('callerid');
        console.log('Calling ' + number + ' from ' + callerId);
        Twilio.Device.connect({ 'phoneNumber': number,
                                'callerId': '+441182072688' });
        callButton.text('Hang up');
    }
});
