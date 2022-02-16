export const open = (url) => {
	const a = document.createElement('a');
	a.style = 'display: none';
	a.href = url;
	a.target = '_blank';
	a.rel = 'noopener noreferrer';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
