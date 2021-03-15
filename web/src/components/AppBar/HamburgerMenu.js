import React from 'react';
import classnames from 'classnames';
import STRINGS from '../../config/localizedStrings';

class HamburgerMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
		};
	}
	logout = () => {
		this.setState({ menuOpen: false });
		this.props.logout();
	};
	handleMenuClick = () => {
		this.setState({ menuOpen: !this.state.menuOpen });
	};
	handleLinkClick = (val) => {
		this.props.router.push(val);
		this.setState({ menuOpen: false });
	};

	render() {
		const { user } = this.props;
		const styles = {
			container: {
				position: 'absolute',
				top: 0,
				left: '5px',
				right: '5px',
				zIndex: '102',
				opacity: 0.9,
				display: 'flex',
				alignItems: 'center',
				width: '20%',
				color: 'white',
			},
			body: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '100vw',
				height: '100vh',
				filter: this.state.menuOpen ? 'blur(2px)' : null,
				transition: 'filter 0.5s ease',
			},
		};

		return (
			<div>
				<div style={styles.container}>
					<MenuButton
						open={this.state.menuOpen}
						onClick={() => this.handleMenuClick()}
						color="white"
					/>
				</div>
				<Menu open={this.state.menuOpen}>
					<MenuItem>{user.email}</MenuItem>
					<MenuItem onClick={() => this.handleLinkClick('Settings')}>
						{STRINGS['ACCOUNTS.TAB_SETTINGS']}
					</MenuItem>
					<MenuItem onClick={() => this.handleLinkClick('home')}>
						{STRINGS['TRADE_TAB_POSTS']}
					</MenuItem>
					<MenuItem onClick={() => this.logout()}>
						{STRINGS['ACCOUNTS.TAB_SIGNOUT']}
					</MenuItem>
				</Menu>
			</div>
		);
	}
}

const MenuItem = (props) => (
	<div>
		<div className={classnames('ham_menu_item')} onClick={props.onClick}>
			{props.children}
		</div>
		<div className={classnames('ham_menu_item_line')} />
	</div>
);

const Menu = (props) => {
	const styles = {
		container: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: props.open ? '25%' : 0,
			width: '45vw',
			display: 'flex',
			flexDirection: 'column',
			background: 'black',
			opacity: 0.95,
			color: '#fafafa',
			transition: 'height 0.3s ease',
			zIndex: '101',
		},
	};
	return (
		<div style={styles.container}>
			{props.open ? (
				<div className={classnames('ham_menu_list')}>{props.children}</div>
			) : null}
		</div>
	);
};

const MenuButton = (props) => {
	const styles = {
		line: {
			height: '2px',
			width: '20px',
			background: '#fff',
			transition: 'all 0.2s ease',
		},
		lineTop: {
			transform: props.open ? 'rotate(45deg)' : 'none',
			transformOrigin: 'top left',
			marginBottom: '5px',
		},
		lineMiddle: {
			opacity: props.open ? 0 : 1,
			transform: props.open ? 'translateX(-16px)' : 'none',
		},
		lineBottom: {
			transform: props.open ? 'translateX(-1px) rotate(-45deg)' : 'none',
			transformOrigin: 'top left',
			marginTop: '5px',
		},
	};
	return (
		<div className={classnames('ham_menu_item')} onClick={props.onClick}>
			<div style={{ ...styles.line, ...styles.lineTop }} />
			<div style={{ ...styles.line, ...styles.lineMiddle }} />
			<div style={{ ...styles.line, ...styles.lineBottom }} />
		</div>
	);
};

export default HamburgerMenu;
