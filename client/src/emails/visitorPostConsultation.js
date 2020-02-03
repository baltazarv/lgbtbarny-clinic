import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import jsxToPlainText from '../utils/jsxToPlainText';

export const EMAIL_OPTIONS = {
	from: 'LeGaL <no-reply@le-gal.org>',
	// to: 'baltazarv@gmail.com',
	subject: 'Thank you for visiting the Tuesday Night Clinic of the LGBT Bar Association of Greater New York',
	bodyPre: 'Thank you for visiting tonight\'s Clinic. If the volunteer lawyer with whom you had a consultation indicated that specific information would be provided, please find that information below.',
	bodyPost: <span>Our Clinic provides brief, on-the-spot legal services, so <strong><em>we are unable to provide ongoing follow-up or to guarantee that any referrals that might be made to our Lawyer Referral Network will be picked up</em></strong> for consultation or representation. If a referral is picked up, however, you and the prospective lawyer(s) will receive email notification so that you can be in touch. Please also feel free to return to the Clinic for other legal questions.</span>,
	filename: 'email-visitor.html',
}

/** bodyPost has html, default output should will be HTML
 *  pass false to isHTML param to output text
 */
export const mergeCustomAndDefaultHtml = (customText) => {
	const bodyPostString = renderToStaticMarkup(EMAIL_OPTIONS.bodyPost);
	// console.log(bodyPostString)
	if (customText) {
		customText = customText.replace(/(\r\n|\n|\r)/g, '<br />');
	}
	return EMAIL_OPTIONS.bodyPre + '<br /><br />\n\n' + (customText ? customText + '<br /><br />\n\n' : '') + bodyPostString;
}

/** WARNING: all formatting will be stripped off when using this function */
export const mergeCustomAndDefaulText = (customText) => {
	const bodyPostString = jsxToPlainText(EMAIL_OPTIONS.bodyPost);
	return EMAIL_OPTIONS.bodyPre + '\n\n' + (customText ? customText + '\n\n' : '') + bodyPostString;
}

// html to plain text replacement
// const customPlainText = customEmailText.replace(/<br>|<br \/>/g, '\n').replace(/<[^>]*>/g, "");
