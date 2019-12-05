const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv')
const app = express();

dotenv.config({
	path: './config.env'
});

// process.env.PORT: port injected by web host
const port = process.env.PORT || 8080;

const Email = require('./utils/Email');
/* to read file from server */
// const getTemplate = require('./utils/getTemplate');
const env = nunjucks.configure(['views', 'views/email'], {
	autoescape: true,
	express: app,
});

app.use(bodyParser.json());

app.post('/api/v1/sendemail', async (req, res) => {
	try {
		/** if need to read file from server, require './utils/getTemplate' **/
		// const template = await getTemplate(req.body.filename);


		const customTxtHtmlBR = req.body.customText.replace(/(\r\n|\n|\r)/g, '<br />')
		const template = nunjucks.render('email-visitor.html', {
			custommsg: customTxtHtmlBR
		});
		const email = new Email(template, req.body).send();

		res.status(200).json({
			status: 'success',
			message: 'Email sent to Mailtrap'
		})

	} catch (err) {
		console.log('post err', err);
	}
});

if (process.env.NODE_ENV === 'production') {
	// will serve a specific requested asset
	app.use(express.static(path.join(__dirname, 'client/build')));
	// or else will serve index.html (catch-all case)
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});

	// basic HTTP authentication
	const auth = require('http-auth');
	const basic = auth.basic({
		realm: 'LeGaL Clinic',
		file: __dirname + '/.htpasswd'
	});
	app.use(auth.connect(basic));
}

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));