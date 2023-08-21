/**
* controllers/mail.controller.js ...
* Social Authentication Mail Controller ...
*/

const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false
	}
})

var message = {
	from:     'hello@bryanlown.com',
	to:       'hello@bryanlown.com',
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