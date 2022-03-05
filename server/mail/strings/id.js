'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Kepada ${name}`,
	CLOSING: {
		1: 'Salam',
		2: () => `${API_NAME()} tim`
	},
	IP_ADDRESS: (ip) => `Alamat IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Permintaan dari: ${ip}`,
	TXID: (txid) => `ID Transaksi: ${txid}`,
	FEE: (fee) => `Biaya: ${fee}`,
	AMOUNT: (amount) => `Jumlah: ${amount}`,
	ADDRESS: (address) => `Alamat: ${address}`,
	TIME: (time) => `Waktu: ${time}`,
	COUNTRY: (country) => `Negara: ${country}`,
	DEVICE: (device) => `Perangkat: ${device}`,
	MESSAGE: (message) => `Pesan: ${message}`,
	ERROR_REQUEST:
		'Jika Anda tidak ingin melanjutkan permintaan ini, silakan abaikan ini; tidak ada perubahan pada akun Anda.',
	EXPLORER:
		'Anda dapat melihat status transaksi pada blockchain di Explorer Blok:',
	DEPOSIT: 'Deposito',
	WITHDRAWAL: 'Penarikan'
};

const FOOTER = {
	FOLLOW_US: 'Ikuti kami di',
	NEED_HELP: 'Perlu bantuan? Balas email ini saja',
	PRIVACY_POLICY: 'Kebijakan pribadi',
	TERMS: 'Syarat dan ketentuan',
	INVITE_YOUR_FRIENDS: 'Undanglah teman-teman Anda',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Formulir Kontak',
	BODY: {
		1: 'Data Formulir Kontak',
		2: (email) =>
			`Klien dengan email ${email} telah mengirimkan formulir kontak.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Kode verifikasi Anda adalah ${code}`
	,
	deposit: (currency, amount) =>
		`Deposit ${currency.toUpperCase()} Anda dengan jumlah ${amount} telah dikonfirmasi dan disimpan ke dompet Anda`
	,
	withdrawal: (currency, amount) =>
		`Penarikan ${currency.toUpperCase()} Anda dengan jumlah ${amount} telah dikonfirmasi`
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation, currency) =>
			`Ada deposit baru untuk ${amount} ${currency.toUpperCase()} yang sedang dalam proses di dompet ${API_NAME()} Anda. Mohon ditunggu sampai transaksi dikonfirmasi dan dana Anda akan tersedia di dompet Anda.${confirmation ? ` Transaksi Anda memerlukan ${confirmation} konfirmasi dalam blockchain.` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`Deposit ${
				currency.toUpperCase()
			} Anda untuk ${amount} ${currency.toUpperCase()} telah dikonfirmasi dan berhasil dibuat dan tersedia di dompet ${
				currency.toUpperCase()
			} Anda.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: (fee) => COMMON.FEE(fee),
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`Anda telah membuat permintaan penarikan untuk ${amount} ${currency.toUpperCase()} ke alamat ${address}. Penarikan Anda sedang dalam proses dan akan segera diproses.`,
		COMPLETED: (amount, currency, address = '') =>
			`Permintaan penarikan Anda untuk ${amount} ${currency.toUpperCase()} telah diproses dan ditransfer ke alamat ${address}.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM,
	DEPOSIT,
	WITHDRAWAL
};
