import validator from 'validator';

export const required = (value) => !value ? 'Required field' : undefined;

export const email = (value) => !validator.isEmail(value) ? 'Invalid email' : undefined;

const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^\&*\)\(+=._-]).{8,}$/;
const INVALID_PASSWORD = 'Invalid password. It has to contain at least 8 characters, a digit in the password and a special character.';

export const password = (value) => !passwordRegEx.test(value) ? INVALID_PASSWORD : undefined
