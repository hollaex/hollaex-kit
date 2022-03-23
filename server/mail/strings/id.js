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

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM
};
