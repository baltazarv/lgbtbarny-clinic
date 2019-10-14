var Airtable = require('airtable');

Airtable.configure({
		endpointUrl: 'https://api.airtable.com',
		apiKey: process.env.REACT_APP_AIRTABLE_API_KEY
});
var base = Airtable.base(process.env.REACT_APP_AIRTABLE_BASE);

export default base;
