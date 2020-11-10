import React from 'react';
import PropTypes from 'prop-types';
import Button from './';
import { Link } from 'react-router';

const ButtonLink = ({ link, ...buttonProps }) => (
	<Link to={link}>
		<Button {...buttonProps} />
	</Link>
);

ButtonLink.propTypes = {
	link: PropTypes.string.isRequired,
};

ButtonLink.defaultProps = {
	link: '',
};

export default ButtonLink;
