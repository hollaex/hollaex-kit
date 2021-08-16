import React, { Component } from 'react';
import Web3 from 'web3';
import XHT from './XHT.json';
import Token from './Token.json';

const CONTRACT_ADDRESS = '0xa324C864A04c88ABAB2dE0d291B96D3cD9a17153'; // should move to contants
const TOKEN_ADDRESS = '0xf0D641A2f02cA52ec56d0791BC79f68da2C772A9'; // should move to contants

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const mainContract = new web3.eth.Contract(XHT.abi, CONTRACT_ADDRESS);
const tokenContract = new web3.eth.Contract(Token.abi, TOKEN_ADDRESS);

class Stake extends Component {
	componentWillMount() {
		this.loadBlockchainData();
		this.connectWallet(); // should be triggered with a button
	}

	async loadBlockchainData() {
		const network = await web3.eth.net.getNetworkType();
		const accounts = await web3.eth.getAccounts();
		this.setState({
			account: accounts[0],
			network,
		});
	}

	async getMyStake(address) {
		const stakes = await mainContract.methods.getStake(address).call();
		console.log(stakes);
		this.setState({
			stakes,
		});
	}

	async getPeriods(address) {
		let periods = [];
		periods[0] = await mainContract.methods.periods(0).call();
		periods[1] = await mainContract.methods.periods(1).call();
		periods[2] = await mainContract.methods.periods(2).call();
		periods[3] = await mainContract.methods.periods(3).call();
		console.log(periods);
		this.setState({
			periods,
		});
	}

	// should be used before staking
	async approve(amount) {
		await tokenContract.methods
			.approve(CONTRACT_ADDRESS, web3.utils.toWei(amount.toString()))
			.send({ from: this.state.account });
	}
	async addStake(amount, period = 1) {
		await mainContract.methods
			.addStake(web3.utils.toWei(amount.toString(), period))
			.send({ from: this.state.account });
	}

	async removeStake(index) {
		await mainContract.methods
			.removeStake(index)
			.send({ from: this.state.account });
	}

	async distribute(index) {
		await mainContract.methods.distribute().send({ from: this.state.account });
	}

	connectWallet = async () => {
		if (window.ethereum) {
			//check if Metamask is installed
			try {
				const account = await window.ethereum.enable(); //connect Metamask
				this.setState({
					account: account[0],
				});
			} catch (error) {
				// Connect to Metamask using the button on the top right.
			}
		} else {
			// You must install Metamask into your browser: https://metamask.io/download.html
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			account: '',
			network: '',
			periods: [],
			stakes: [],
		};
	}

	render() {
		return (
			<div>
				<p>Network: {this.state.network}</p>
				<p>Account: {this.state.account}</p>
				<p>Periods: {this.state.periods}</p>
				<p>Stakes: {this.state.stakes}</p>
				<button onClick={() => this.connectWallet()}>connect</button>
				<button onClick={() => this.getPeriods(this.state.account)}>
					Public periods for staking
				</button>
				<button onClick={() => this.getMyStake(this.state.account)}>
					get stakes
				</button>
				<button onClick={() => this.approve(100)}>approve</button>
			</div>
		);
	}
}

export default Stake;
