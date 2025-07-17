import {
	validateRequired,
	email,
} from '../../../components/AdminForm/validations';

export const OPERATORS = [
	{
		value: 'support',
		label: 'Support',
	},
	{
		value: 'communicator',
		label: 'Communicator',
	},
	{
		value: 'kyc',
		label: 'KYC',
	},
	{
		value: 'supervisor',
		label: 'Supervisor',
	},
];

export const getOperatorFields = () => ({
	section_1: {
		role: {
			type: 'select',
			label: 'Role',
			options: OPERATORS,
			validate: [validateRequired],
		},
		email: {
			type: 'text',
			label: 'Operator email',
			validate: [validateRequired, email],
		},
	},
	section_2: {
		role: {
			type: 'select',
			label: 'Change roles',
			options: OPERATORS,
			validate: [validateRequired],
		},
	},
});

export const isColorDark = (hexColor) => {
	if (hexColor) {
		const hex = hexColor?.replace('#', '');

		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		// If luminance < 0.5, it's dark
		return luminance < 0.5;
	}
	return true;
};
