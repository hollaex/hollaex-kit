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
