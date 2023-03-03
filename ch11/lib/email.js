var nodemailer = require('nodemailer');

module.exports = function (credentials) {

	//	let testAccount = nodemailer.createTestAccount(credentials);

	const mailTransport = nodemailer.createTransport({
		/*		service: 'Gmail',
				auth: {
					user: credentials.gmail.user,
					pass: credentials.gmail.password,
				}*/

		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: credentials.ethereal.user,
			pass: credentials.ethereal.password,
		}
	});

	const from = '"Meadowlark Travel" <info@ethereal.email>';
	const errorRecipient = 'evelyn14@ethereal.email';

	return {
		send: function (to, subj, body) {
			mailTransport.sendMail({
				from: from,
				to: to,
				subject: subj,
				html: body,
				generateTextFromHtml: true
			}, function (err) {
				if (err) console.error('Unable to send email: ' + err);
			});
		},

		emailError: function (message, filename, exception) {
			var body = '<h1>Meadowlark Travel Site Error</h1>' +
				'message:<br><pre>' + message + '</pre><br>';
			if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
			if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
			mailTransport.sendMail({
				from: from,
				to: errorRecipient,
				subject: 'Meadowlark Travel Site Error',
				html: body,
				generateTextFromHtml: true
			}, function (err) {
				if (err) console.error('Unable to send email: ' + err);
			});
		},
	};
};
