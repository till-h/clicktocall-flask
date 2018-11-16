// Execute JavaScript on page load
$(function() {
    // Initialize phone number text input plugin
    $('#phoneNumber').intlTelInput({
        responsiveDropdown: true,
        autoFormat: true,
        utilsScript: '/static/js/libphonenumber/src/utils.js'
    });

    // Intercept form submission and submit the form with ajax
    $('#contactForm').on('submit', function(e) {
        // Prevent submit event from bubbling and automatically
        // submitting the form
        e.preventDefault();

        // Call our ajax endpoint on the server to initialize the
        // phone call
        $.ajax({
            url: '/call',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNumber: $('#phoneNumber').val()
            }
        }).done(function(data) {
            // The JSON sent back from the server will contain
            // a success message
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
    });
    // Intercept form submission and submit the form with ajax
    $('#contactForm').on('submitvoice', function(e) {
        // Prevent submit event from bubbling and automatically
        // submitting the form
        e.preventDefault();

        // Call our ajax endpoint on the server to initialize the
        // phone call
        $.ajax({
            url: '/voice',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNumber: $('#phoneNumber').val()
            }
        }).done(function(data) {
            // The JSON sent back from the server will contain
            // a success message
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
    });

    var statusField = document.querySelector('#callstatus');
    var callButton = document.querySelector('#submitvoice');

    // Set up Twilio Device so browser can make calls
    //Twilio.Device.setup({{ token }}, {debug: false});

    Twilio.Device.ready(function(device) {
        callButton.disabled = false;
        statusField.innerHTML = 'Ready';
    });

    Twilio.Device.offline(function() {
        // Called on network connection lost.
    });

    Twilio.Device.cancel(function(conn) {
        statusField.innerHTML = 'Call cancelled by ' + conn.parameters.From;
        // conn.status
    });

    Twilio.Device.error(function(error) {
        statusField.innerHTML = 'Error: ' + error.message;
    });

    Twilio.Device.connect(function(conn) {
        statusField.innerHTML = 'Connected '; //+ conn
    });

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
