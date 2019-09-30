//
// Utilities
//

import qs from 'query-string';

//
// URL Utilities
//

/*
 * Get all URL parameters from the QUERY_STRING. Optionally, specify a specific parameter to return just that one.
 */
const getQueryStringParams = (param) => {
	if (typeof window !== 'undefined') {
		const params = qs.parse(window.location.search);
		return param ? params[param] : params;
	}
	else {
		return;
	}
};

/*
 * Take an object, prune out the null/undefined values, and save that to the QUERY_STRING in the URL
 */
const setQueryStringParams = (obj) => {
	const params = getQueryStringParams();
	const allParams = Object.assign(params, obj); // Merge objects, preferring values in `obj`

	// Remove null and unassigned params
	Object.keys(allParams).forEach((p) => (allParams[p] == null) && delete allParams[p]);

	let stringified = qs.stringify(allParams);
	// Un-encode some special characters
	stringified = stringified.replace(/%2F/g, '/');  // Keep slashes pretty
	if (typeof window !== 'undefined') {
		window.history.replaceState(obj, '', (stringified ? `?${stringified}` : ''));
	}

	return allParams;
};

export {
	getQueryStringParams,
	setQueryStringParams
};
