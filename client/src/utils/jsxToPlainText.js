// get string from html
import { renderToStaticMarkup } from 'react-dom/server';

export default jsx => {
	return renderToStaticMarkup(jsx).replace(/<[^>]*>/g, "");
}