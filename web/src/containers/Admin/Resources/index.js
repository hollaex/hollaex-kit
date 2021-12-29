import React, { Component } from 'react';

import { HelpList } from './helplist.js';
import './index.css';

class Resources extends Component {
	state = {
		isOpen: false,
	};

	openModal = () => {
		this.setState({ isOpen: true });
	};

	closeModal = () => {
		this.setState({ isOpen: false });
	};

	renderList = () => {
		return HelpList.data.map((item) => (
			<div className="help-card">
				<div
					className="img-box"
					style={{ backgroundImage: `url(${item.img})` }}
				></div>
				<div>
					<h3>{item.title}</h3>
					<div className="card-sub-title">{item.subtitle}</div>
					<div className="card-description">{item.description}</div>
					{item.title === 'Other Useful Resources' ||
					item.title === 'Status' ||
					item.title === 'Articles' ||
					item.title === 'Vault API Explorer' ? (
						<div className="card-link" style={{ fontSize: '16px' }}>
							<a href={item.link} title={item.link}>
								{item.link}
							</a>
						</div>
					) : (
						<div className="card-link">
							<a href={item.link} title={item.link}>
								View Page
							</a>
						</div>
					)}
					{item.title === 'Other Useful Resources' ? (
						<div className="sub-link">
							<p>
								HollaEx Site:
								<a href="https://hollaex.com" title="site">
									https://hollaex.com
								</a>
							</p>
							<p>
								HollaEx Kit:
								<a href="https://github.com/bitholla/hollaex-kit" title="site">
									https://github.com/bitholla/hollaex-kit
								</a>
							</p>
							<p>
								HollaEx CLI (Command Line Interface):
								<a href="https://github.com/bitholla/hollaex-cli" title="site">
									https://github.com/bitholla/hollaex-cli
								</a>
							</p>
							<p>
								HollaEx Node Library:
								<a
									href="https://www.npmjs.com/package/hollaex-node-lib"
									title="site"
								>
									https://www.npmjs.com/package/hollaex-node-lib
								</a>
							</p>
						</div>
					) : null}
				</div>
			</div>
		));
	};

	render() {
		return (
			<div className="cotainer">
				<div className="mainSection">
					<div className="wrapper">{this.renderList()}</div>
				</div>
			</div>
		);
	}
}

export default Resources;
