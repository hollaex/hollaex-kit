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

const SIGNUP = {
	TITLE: 'Daftar',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Konfirmasikan akun email Anda dengan klik Anda dengan klik tombol di bawah.
		Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami dengan membalas email ini.`,
		2: 'Silakan klik tombol di bawah untuk melanjutkan pendaftaran Anda.',
		3: 'Konfirmasi'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Selamat datang',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Terima kasih telah mendaftar di ${API_NAME()}.`,
		2: (account, deposit) => `
		Untuk memulai perdagangan, Anda perlu deposito cryptocurrency atau dana ke akun Anda terlebih dahulu.
		Silakan pergi ke ${account} Anda dan kunjungi halaman ${deposit}.`,
		3: 'akun',
		4: 'deposito',
		5: 'Jika Anda memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi kami dengan membalas email ini.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Masuk',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Kami telah mencatat detail masuk akun Anda sebagai berikut',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Jika ini bukan Anda, silakan ubah kata sandi Anda, atur autentikasi dua faktor, dan hubungi kami dengan segera.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Permintaan Reset Kata Sandi',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Anda telah meminta reset kata sandi akun Anda.',
		2: 'Untuk memperbarui kata sandi Anda, silakan klik tautan di bawah.',
		3: 'Reset Kata Sandi Saya',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
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
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Akun Terverifikasi',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Selamat. Akun Anda telah berhasil terverifikasi.',
		2: 'Berdagang Sekarang'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Akun Diperbarui',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`Selamat. Tingkat akses akun Anda telah diperbarui ke tingkat ${level}. Anda akan mendapatkan keuntungan dari biaya lebih rendah, batas penarikan lebih tinggi dan fitur premium lainnya.`,
		2: 'Berdagang Sekarang'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} dibatalkan`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`Kami tidak dapat menemukan atau memproses deposit ${currency.toUpperCase()} Anda yang dibuat pada tanggal ${date} dengan jumlah ${amount}. Oleh karena itu, transaksi tersebut dibatalkan oleh sistem kami.`,
		WITHDRAWAL: (currency, date, amount) =>
			`Kami tidak dapat menemukan atau memproses penarikan ${currency.toUpperCase()} Anda yang dibuat pada tanggal ${date} dengan jumlah ${amount}. Oleh karena itu, transaksi tersebut dibatalkan oleh sistem kami dan jumlah penarikan tertunda akan kembalikan ke dompet ${API_NAME()} Anda.`,
		1: 'Jika Anda memiliki pertanyaan lebih lanjut, silakan membalas email ini',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Status: Dibatalkan'
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
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL} Permintaan`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Anda telah membuat permintaan penarikan ${currency.toUpperCase()} dengan jumlah ${amount} ke ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Alamat: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'Untuk konfirmasi penarikan ini, silakan klik tombol di bawah.',
		7: 'Konfirmasi',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Alamat Penarikan Tidak Valid',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Penarikan ${currency} Anda untuk ${amount} telah dikirim ke alamat tidak valid dan dibatalkan.`,
		2: (address) => `Alamat: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `ALERT: ${title}`,
	BODY: {
		1: (type) => `Alert: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id'
			? 'Verifikasi ID Dibatalkan'
			: 'Aplikasi Bank Baru Dibatalkan',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Verifikasi ID Anda telah diproses tetapi dibatalkan. Untuk melakukan tindakan lebih lanjut, silakan baca pesan di bawah:'
				: 'Pendaftaran bank baru Anda telah diproses tetapi dibatalkan. Untuk melakukan tindakan lebih lanjut, silakan baca pesan di bawah:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Akun ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Akun Anda ${email} telah diaktifkan. Sekarang, Anda dapat menggunakan akun Anda.`,
		DEACTIVATED: (email) => `Akun Anda ${email} telah dinonaktifkan. Anda tidak dapat menggunakan akun Anda sampai diaktifkan lagi oleh admin bursa.`
	},
	CLOSING: COMMON.CLOSING
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

const USERVERIFICATION = {
	TITLE: 'Verifikasi Pengguna',
	BODY: {
		1: 'Verifikasi Pengguna Diperlukan',
		2: (email) =>
			`Pengguna "${email}" telah mengupload dokumen untuk verifikasi. Silakan verifikasi dokumennya.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Deposit Mencurigakan',
	BODY: {
		1: 'Deposit Mencurigakan',
		2: (email, currency) =>
			`Klien dengan email ${email} telah mendapatkan deposit ${currency.toUpperCase()} yang mencurigakan.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Data transaksi:',
		5: (data) => `${JSON.stringify(data)}`
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

const DISCOUNTUPDATE = {
	TITLE: 'Discount Rate Change',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (rate) => `Your discount rate has been changed to ${rate}%. This rate will be applied to your order fees.`
	},
	CLOSING: COMMON.CLOSING
};

const BANKVERIFIED = {
	TITLE: 'Bank Verified',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'A pending bank account has been verified. Your valid account can now be used for exchange operations requiring a bank account.',
		2: 'To view your current bank accounts, please visit the exchange\'s Verification Tab'
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	SIGNUP,
	WELCOME,
	LOGIN,
	RESETPASSWORD,
	DEPOSIT,
	ACCOUNTVERIFY,
	ACCOUNTUPGRADE,
	USERVERIFICATIONREJECT,
	DEPOSITCANCEL,
	WITHDRAWAL,
	WITHDRAWALREQUEST,
	USERVERIFICATION,
	SUSPICIOUSDEPOSIT,
	INVALIDADDRESS,
	CONTACTFORM,
	USERDEACTIVATED,
	ALERT,
	SMS,
	DISCOUNTUPDATE,
	BANKVERIFIED
};
