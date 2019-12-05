const nodemailer = require('nodemailer');
const keys = require('../config/keys');
const htmlToText = require('html-to-text');

const fs = require('fs');
const path = require('path');

module.exports = class Email {
	constructor(template, options) {
		this.from = options.from;
		this.to = options.to;
		this.subject = options.subject;
		this.html = template;
	}

	createTransport() {
		const auth = {
			user: keys.emailUser,
			pass: keys.emailPass,
		}


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
		// add error handling
		if (!this.from) return 'From email address is missing!';
		if (!this.to) return 'To email address is missing!';
		if (!this.subject) return 'Subject line is missing!';
		if (!this.text && !this.html) return 'Neither email body HTML nor text is included!';
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
