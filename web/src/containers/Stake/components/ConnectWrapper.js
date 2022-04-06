import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectWallet } from 'actions/stakingActions';
import STRINGS from 'config/localizedStrings';

const ConnectWalletLink = ({ className, ...props }) => {
	return (
		<span
			className={`blue-link pointer underline-text ${className}`}
			{...props}
		>
			{STRINGS['STAKE.CONNECT_WALLET']}
		</span>
	);
};

const ConnectWrapper = ({
	account,
	children,
	connectWallet,
	className,
	onClick,
}) => {
	return !account ? (
		<ConnectWalletLink
			onClick={onClick || connectWallet}
			className={className}
		/>
	) : children ? (
		children
	) : null;
};

const mapStateToProps = (store) => ({
	account: store.stake.account,
});

const mapDispatchToProps = (dispatch) => ({
	connectWallet: bindActionCreators(connectWallet, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWrapper);
