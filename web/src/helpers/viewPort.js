export const getViewport = () => {
	const UNDEFINED = 'undefined';

	// the more standards compliant browsers (mozilla/netscape/opera/IE7)
	if (typeof window.innerWidth !== UNDEFINED) {
		const { innerWidth, innerHeight } = window;
		return [innerWidth, innerHeight];
	}

	// IE6 in standards compliant mode
	else if (
		typeof document.documentElement !== UNDEFINED &&
		typeof document.documentElement.clientWidth !== UNDEFINED &&
		document.documentElement.clientWidth !== 0
	) {
		const {
			documentElement: { clientWidth, clientHeight },
		} = document;
		return [clientWidth, clientHeight];
	}

	// older versions of IE
	else {
		const { clientWidth, clientHeight } = document.getElementsByTagName(
			'body'
		)[0];
		return [clientWidth, clientHeight];
	}
};
