// Execute JavaScript on page load
$(function() {

    // Initialize phone number text input plugin
    $('#phoneNumber').intlTelInput({
        responsiveDropdown: true,
        autoFormat: true,
        utilsScript: '/static/js/libphonenumber/src/utils.js'
    });

    // Get Capability Token from backend and set up Twilio Device
    $.get("/token", function(data) {
        console.log("Getting /token, data = " + JSON.stringify(data));
        Twilio.Device.setup(data.token);
    });

    // Callback for when device is ready
    Twilio.Device.ready(function(device) {
        console.log("Twilio Device ready.");
        callButton.disabled = false;
        statusField.innerHTML = 'Ready';
    });

    // Intercept form submission and submit the form with ajax
    $('#contactForm').on('submitvoice', function(event) {
        // Prevent submit event from bubbling and automatically
        // submitting the form
        event.preventDefault();

        console.log('submitvoice button pressed');

        phoneNumber = $('#phoneNumber').val();
        var params = {'phoneNumber': phoneNumber};
        console.log('Calling ' + phoneNumber);

        Twilio.Device.connect(params);
    });

    // Callback for Twilio Device connection
    Twilio.Device.connect(function(connection) {
        console.log('Connection is ' + connection);
    });

    var statusField = $('#callstatus');
    var callButton = $('#submitvoice');

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

    // Twilio.Device.connect(function(conn) {
    //     statusField.innerHTML = 'Connected '; //+ conn
    // });

    Twilio.Device.disconnect(function(conn) {
        statusField.innerHTML = 'Call ended';
    });

    Twilio.Device.incoming(function(conn) {
        statusField.innerHTML = 'Incoming call from ' + conn.parameters.From;
        conn.accept(); // accept incoming connection, start two-way audio
    });

    callButton.addEventListener('click', function(){
        if (callButton.classList.contains('ongoingCall')){
            hangUp();
        } else {
            call();
        }
    });

    function hangUp() {
        Twilio.Device.disconnectAll();
        callButton.innerHTML = 'Call';
        callButton.className = 'noOngoingCall';
    }

    function call() {
        var number = document.querySelector('#phoneNumber');
        Twilio.Device.connect({ number: number.value });
        callButton.innerHTML = 'Hang up';
        callButton.className = 'ongoingCall';
    }
});
