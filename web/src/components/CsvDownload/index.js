import React from 'react';
import { CSVLink as ReactCsvDownaload } from 'react-csv';

const SEPARATOR = ';';
const EXTENSION = '.csv';

const generateFilename = (filename = '') => {
	if (!filename) {
		return `data${EXTENSION}`;
	} else if (filename.indexOf(EXTENSION) > 0) {
		return filename;
	} else {
		return `${filename}${EXTENSION}`;
	}
};

const processHeaders = (headers) =>
	headers.filter(({ exportToCsv }) => exportToCsv).map(({ label }) => label);

const processData = (headers, data) =>
	data.map((item) =>
		headers
			.filter(({ exportToCsv }) => exportToCsv)
			.map(({ key, exportToCsv }) => exportToCsv(item))
	);

const CSVDownload = ({ children, data, headers, filename }) => (
	<ReactCsvDownaload
		filename={generateFilename(filename)}
		data={processData(headers, data)}
		headers={processHeaders(headers)}
		target="_blank"
		separator={SEPARATOR}
	>
		{children}
	</ReactCsvDownaload>
);

CSVDownload.defaultProps = {
	data: [],
	headers: [],
};

export default CSVDownload;
