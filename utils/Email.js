const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(template, options) {
		this.from = options.from;
		this.to = options.to;
		this.subject = options.subject;
		this.html = template;
	}

	/**
	 * Credentials:
	 * * development: Mailtrap un/pw in /config/keys.
	 * * production: sendgrid in .env vars.
	 */
	createTransport() {
		const auth = {
			user: keys.emailUser,
			pass: keys.emailPass,
		}

		console.log('ENV', process.env.NODE_ENV, 'AUTH', auth)

		if (process.env.NODE_ENV === 'production') {
			// SendGrid
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth,
			});
		}

		// Mailtrap
		return nodemailer.createTransport({
			host: keys.mailtrapHost,
			port: keys.mailtrapPort,
			auth,
		});
	}

	async send() {
		if (!this.from) throw new Error('From-email address is missing!');
		if (!this.to) throw new Error('To-email address is missing!');
		if (!this.subject) throw new Error('Subject line is missing!');
		if (!this.text && !this.html) throw new Error('Neither email body HTML nor text is included!');
		// text version not tested
		const text = this.text || htmlToText.fromString(this.html);
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: this.subject,
			html: this.html,
			text,
		}
		await this.createTransport().sendMail(mailOptions);
	}

}
