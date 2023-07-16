/**
* controllers/mail.controller.js ...
* Social Authentication Mail Controller ...
*/

const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
	host: 'localhost',
	port: 25,
	tls: { rejectUnauthorized: false },
});

var message = {
	from:     'noreply@social.auth',
	to:       'bryan.lown@berkeleydesigns.co.uk',
	subject:  'Test',
	text:     'This is a test email.',
	html:     '<p>This is a test email</p>'
};

exports.sendMail = () => {

	transporter.sendMail(message, (err, info) => {

		if (err) return console.log(err)
		console.log('Message Sent: %s', info.messageId)

	})

}