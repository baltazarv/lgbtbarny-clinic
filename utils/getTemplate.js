const fs = require('fs');
const path = require('path');

const getTemplate = async file => {
	const fileDir = path.normalize(__dirname + `/../views/${file}`);
	return new Promise((resolve, reject) => {
		fs.readFile(fileDir, (err, data) => {
			if (err) reject('File not found 😢' + err);
			const template = data.toString();
			resolve(template);
		});
	});
};

module.exports = getTemplate;