var require = require;
var exports = exports;
var print = print;

var ff = require('ffef/FatFractal');
var fs = require ('fs');

var smtpHost = null;                                 // Remove me
// var smtpHost = "your_smtp_server.somewhere.com";  // Uncomment and change me
// var smtpPort = "465";                             // Uncomment and change me
// var smtpUserName = "your_smtp_user_name";         // Uncomment and change me
// var smtpPassword = "your_smtp_password";          // Uncomment and change me
var fromName = "[[ My Beautiful App ]]";             // Change me

function _sendPasswordResetToken(email) {
    if (! smtpHost) throw {statusCode:500, statusMessage:"You need to configure this code"};

    // We need to find the user with that guid
    var user = ff.getObjFromUri("/FFUser/(email eq '" + email + "')");
    if (! user) {
        throw {statusCode:404,statusMessage:"sendPasswordResetToken: Could not find user with email " + email};
    }

    // Now create an object in /PasswordResetToken
    var resetRequest = ff.createObjAtUri({clazz:'PasswordResetToken', userGuid:user.guid}, "/PasswordResetToken");

    // We're going to send an email to this user with a link to a password reset form
    // So, first, let's create the link
    var url;
    url = ff.getHttpAppAddress() + "/reset-password.html?resetToken=" + resetRequest.guid;

    // And now, let's send the email
    ff.sendEmail({
        host:smtpHost,
        port:smtpPort,
        auth:"true", 
        authPort:smtpPort,
        username:smtpUserName,
        password:smtpPassword,
        from:smtpUserName,
        fromName:fromName,
        to:user.email, // To the user in question
        subject:"Password Reset",
        text:"If you wish to reset your password, please click here: " + url
        });
}

exports.sendPasswordResetToken = function() {
    if (! smtpHost) throw {statusCode:500, statusMessage:"You need to configure this code"};

    var data = ff.getExtensionRequestData();

    // We need an email address
    var email = data.httpParameters['email'];
    if (! email || email === null || email == '') {
        throw {statusCode:400, statusMessage:"sendPasswordResetToken: email parameter must be supplied"};
    }

    _sendPasswordResetToken(email);
};

exports.resetPassword= function() {
    if (! smtpHost) throw {statusCode:500, statusMessage:"You need to configure this code"};

    var data = ff.getExtensionRequestData();
    var r = ff.response();

    var eventDescription;

    var requestGuid = data.httpContent['resetToken'];

    // check that the guid has been supplied and exists
    if (! requestGuid || requestGuid === null || requestGuid == '') {
        r.responseCode = "400";
        r.statusMessage = "Error: no guid supplied";
        return;
    }

    // We need to find the request with that guid
    var resetRequest = ff.getObjFromUri("/PasswordResetToken/" + requestGuid);
    if (! resetRequest || resetRequest === null) {
        r.responseCode = "400";
        r.statusMessage = "Invalid request"
        return;
    }

	// check that the password has been supplied
    var secret = data.httpContent['password'];
    if (! secret || secret === null || secret == '' || secret.length < 8) {
        r.responseCode = "400";
        r.statusMessage = "Password must be at least 8 characters in length";
        return;
    }

    var secret2 = data.httpContent['password2'];
    if (secret !== secret2) {
        r.responseCode = "400";
        r.statusMessage = "Passwords do not match"
        return;
    }

	// invoke the resetPassword method
    // Note: if this throws an exception then we are not catching it but letting it flow through
    ff.resetPassword (resetRequest.userGuid, secret);

	// Delete the reset request
    // If the delete fails, let's log that fact but we need to still return success as the password WAS reset
    try {
        ff.deleteObj(resetRequest);
    } catch (ex1) {
        try {
            ff.logger.error("ResetPassword failed to delete the reset request token: " + JSON.stringify(ex1));
        } catch (ex2) {
        }
    }

	// return statusCode 200 and an appropriate message
    r.responseCode = "200";
    r.statusMessage = "Password has been reset";
};

exports.createTestUser = function() {
    if (! smtpHost) throw {statusCode:500, statusMessage:"You need to configure this code"};

    var emailAndUserName = ff.getExtensionRequestData().httpParameters['email'];

    if (! emailAndUserName || ! emailAndUserName.match(/.*@.*/))
        throw "You must supply an email address";

    var user = ff.getObjFromUri("/FFUser/(email eq '" + emailAndUserName + "')");
    if (user) ff.deleteObj(user);

    user = ff.registerUser({clazz:'FFUser',userName:emailAndUserName,email:emailAndUserName}, "Password1", true, false);

    _sendPasswordResetToken(user.email);
};

