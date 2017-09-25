import validator from 'validator';

export const required = (value) => !value ? 'Required field' : undefined;

export const email = (value) => !validator.isEmail(value) ? 'Invalid email' : undefined;
