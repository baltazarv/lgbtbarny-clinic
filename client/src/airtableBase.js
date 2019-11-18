const Airtable = require('airtable');
const keys = require('./config/keys');

Airtable.configure({
		endpointUrl: 'https://api.airtable.com',
		apiKey: keys.airTableApiKey
});
const airtableBase = Airtable.base(keys.airTableBaseKey);

export default airtableBase;
