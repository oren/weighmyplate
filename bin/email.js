// packages from npm
var nodemailer = require("nodemailer");

var config = require('../config/production.js');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

var sendEmail = function(text) {
  var mailOptions = {
    from: "chat",
    to: config.emailUser,
    subject: text,
    text: text, // plaintext body
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent: " + response.message);
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
};

module.exports = sendEmail;
