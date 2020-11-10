import { BASE_CURRENCY } from 'config/constants';

export const findPath = (
	connections = [],
	start,
	end = BASE_CURRENCY,
	source_key = 'pair_base',
	target_key = 'pair_2'
) => {
	const connectionsFromStart = connections.filter(
		({ [source_key]: source }) => source === start
	);

	const connectionsFromStartToEnd = connectionsFromStart.filter(
		({ [target_key]: target }) => target === end
	);

	if (connectionsFromStartToEnd.length !== 0)
		return [connectionsFromStartToEnd];

	const paths = [];

	connectionsFromStart.forEach((intermediaryNode) => {
		const connectionsFromIntermediaryToEnd = findPath(
			connections,
			intermediaryNode[target_key],
			end
		);
		connectionsFromIntermediaryToEnd.forEach((intermediaryConnections) => {
			paths.push([intermediaryNode, ...intermediaryConnections]);
		});
	});

	return paths;
};

export const convertPathToPairNames = (
	path = [],
	from_key = 'pair_base',
	to_key = 'pair_2',
	separator = '-'
) =>
	path.map(({ [from_key]: from, [to_key]: to }) => `${from}${separator}${to}`);

export const unique = (arr) => [...new Set(arr)]; //remove duplicates in array
