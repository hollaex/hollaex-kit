import React from 'react';
import { Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';

const TYPES = {
	CS1: 'CS1',
	CS2: 'CS2',
	CS3: 'CS3',
	CS4: 'CS4',
	CS5: 'CS5',
	CS6: 'CS6',
	CS7: 'CS7',
	CS8: 'CS8',
	CS9: 'CS9',
	CS10: 'CS10',
	CS11: 'CS11',
	CS12: 'CS12',
	CS13: 'CS13',
};

const getPropsForType = (type) => {
	switch (type) {
		case TYPES.CS1:
			return {
				wrapperClassName: 'cs-1',
			};
		case TYPES.CS2:
			return {
				wrapperClassName: 'cs-2',
			};
		case TYPES.CS4:
			return {
				wrapperClassName: 'cs-4',
			};
		case TYPES.CS5:
			return {
				wrapperClassName: 'cs-5',
			};
		case TYPES.CS6:
			return {
				wrapperClassName: 'cs-6',
			};
		case TYPES.CS7:
			return {
				wrapperClassName: 'cs-7',
			};
		case TYPES.CS8:
			return {
				wrapperClassName: 'cs-8',
			};
		case TYPES.CS9:
			return {
				wrapperClassName: 'cs-9',
			};
		case TYPES.CS10:
			return {
				wrapperClassName: 'cs-10',
			};
		case TYPES.CS11:
			return {
				wrapperClassName: 'cs-11',
			};
		case TYPES.CS12:
			return {
				wrapperClassName: 'cs-12',
			};
		case TYPES.CS13:
			return {
				wrapperClassName: 'cs-13',
			};
		default:
			return {
				wrapperClassName: 'cs-8',
			};
	}
};

const Coin = ({ iconId, icons: { [iconId]: icon }, type }) => {
	const props = getPropsForType(type);

	return <Image iconId={iconId} icon={icon} {...props} />;
};

export default withConfig(Coin);
