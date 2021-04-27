import AGREEMENT from '../agreement';
import LANGUAGES from '../languages';

export default {
	APP_TITLE: 'HollaeX',
	APP_SUB_TITLE: 'Open Crypto Exchange', // slogan

	LOGOUT_CONFIRM_TEXT: 'Apakah Anda yakin akan logout?',
	ADD_TRADING_PAIR: 'Tambah Trading Pair',
	ACTIVE_TRADES: 'Harap {0} untuk mengakses perdagangan Anda yang aktif',
	CANCEL_BASE_WITHDRAWAL: 'Pembatalan Penarikan {0}',
	CANCEL_WITHDRAWAL: 'Pembatalan Penarikan',
	CANCEL_WITHDRAWAL_POPUP_CONFIRM:
		'Apakah Anda ingin membatalkan penarikan yang sedang dalam proses:',
	CANT_BE_CANCELLED: '-',
	ALREADY_CANCELLED: '-',
	TIMESTAMP_FORMAT: 'YYYY/MM/DD HH:mm:ss',
	HOUR_FORMAT: 'HH:mm:ss',
	LOGIN_TEXT: 'Masuk',
	SIGN_IN: 'Masuk',
	SIGNUP_TEXT: 'Daftar',
	REGISTER_TEXT: 'Daftar',
	ACCOUNT_TEXT: 'Akun',
	HOME_TEXT: 'Home',
	CLOSE_TEXT: 'Tutup',
	COPY_TEXT: 'Salin',
	COPY_SUCCESS_TEXT: 'Berhasil disalin',
	CANCEL_SUCCESS_TEXT: 'Berhasil dibatalkan!',
	UPLOAD_TEXT: 'Upload',
	ADD_FILES: 'TAMBAH FILE', // ToDo
	OR_TEXT: 'Atau',
	CONTACT_US_TEXT: 'Hubungi kami',
	HELPFUL_RESOURCES_TEXT: 'Sumber Bermanfaat',
	HELP_RESOURCE_GUIDE_TEXT:
		'Jangan ragu hubungi kami untuk informasi lebih lanjut',
	HELP_TELEGRAM_TEXT: 'Cek dokumen API terbuka:',
	HELP_TELEGRAM_LINK: 'https://apidocs.HollaeX.com',
	NEED_HELP_TEXT: 'Perlu bantuan?', // new
	HELP_TEXT: 'help',
	SUCCESS_TEXT: 'Sukses',
	ERROR_TEXT: 'Eror',
	PROCEED: 'PROCEED',
	EDIT_TEXT: 'Edit',
	BACK_TEXT: 'Kembali',
	NO_OPTIONS: 'Tidak tersedia opsi',
	SECONDS: 'seconds',
	VIEW_MARKET: 'lihat pasar', // new
	GO_TRADE: 'Pergi Berdagang', // new
	VIEW_INFO: 'Lihat halaman info', // new
	APPLY_HERE: 'Apply Here', // new
	HOME: {
		SECTION_1_TITLE: 'Selamat datang di HollaeX Exchange Kit!',
		SECTION_1_TEXT_1:
			'Buatlah pertukaran aset digital Anda yang dapat diperpanjang dengan HollaeX Kit dan jadilah bagian dari keuangan masa depan.',
		SECTION_1_TEXT_2:
			'Kami berusaha keras untuk memajukan teknologi keuangan melalui akses yang dapat diusahakan dan sederhana ke teknologi perdagangan.',
		SECTION_1_BUTTON_1: 'Belajar lebih lanjut',
		SECTION_3_TITLE: 'Fitur',
		SECTION_3_CARD_1_TITLE: 'MATCHING ENGINE YANG DAPAT DIPERPANJANG',
		SECTION_3_CARD_1_TEXT:
			'Matching engine pesanan yang dapat diperpanjang dengan menggunakan algoritma performa tinggi',
		SECTION_3_CARD_2_TITLE: 'INTEGRASI BANK',
		SECTION_3_CARD_2_TEXT:
			'Plugin dengan modul yang dapat disesuaikan tersedia untuk integrasi bank. Kami sudah memahami keuangan tradisional dan dapat membantu Anda untuk membuat bursa lokal',
		SECTION_3_CARD_3_TITLE: 'TINGKAT KEAMANAN TINGGI',
		SECTION_3_CARD_3_TEXT:
			'HollaeX menggunakan praktik keamanan terbaik dan algoritma yang paling aman dan dapat dipercaya untuk menjaga keamanan dana. Keamanan adalah prioritas utama kami dan kami sangat memperhatikannya.',
		SECTION_3_CARD_4_TITLE: 'PELAPORAN TERDEPAN',
		SECTION_3_CARD_4_TEXT:
			'Panel admin dengan email yang dapat disesuaikan dan pelaporan untuk memberitahukan dukungan dan administrator tentang status sistem dan transaksi.',
		SECTION_3_CARD_5_TITLE: 'DUKUNGAN',
		SECTION_3_CARD_5_TEXT:
			'Kami sangat memperhatikan kebutuhan Anda dan memiliki profesional online untuk membantu menangani isu dan pertanyaan Anda.',
		SECTION_3_CARD_6_TITLE: 'INTEGRASI KYC',
		SECTION_3_CARD_6_TEXT:
			'Dengan modul yang fleksibel dan dapat diintegrasikan untuk menerapkan KYC dan cara verifikasi pengguna dalam yurisdiksi yang berbeda.',
		SECTION_3_BUTTON_1: 'Lihat Demo',
	},
	FOOTER: {
		FOOTER_LEGAL: ['Proudly made in Seoul, South Korea', 'bitHolla Inc.'],
		FOOTER_LANGUAGE_TEXT: 'LANGUAGE',
		SECTIONS: {
			SECTION_1_TITLE: 'ABOUT',
			SECTION_1_LINK_1: 'About Us',
			SECTION_1_LINK_2: 'Syarat dan Ketentuan',
			SECTION_1_LINK_3: 'Kebijakan Pribadi',
			SECTION_1_LINK_4: 'Contact Us',
			SECTION_2_TITLE: 'Information',
			SECTION_2_LINK_1: 'Blog',
			SECTION_2_LINK_2: 'Contact Us',
			SECTION_2_LINK_3: 'Career',
			SECTION_3_TITLE: 'DEVELOPERS',
			SECTION_3_LINK_1: 'Documentation',
			SECTION_3_LINK_2: 'Forum',
			SECTION_3_LINK_3: 'GitHub',
			SECTION_3_LINK_4: 'Library',
			SECTION_3_LINK_5: 'Dokumen API',
			SECTION_3_LINK_6: 'Trading API',
			SECTION_3_LINK_7: 'Developer tools',
			SECTION_3_LINK_8: 'Documnetation',
			SECTION_4_TITLE: 'EXCHANGE',
			SECTION_4_LINK_1: 'Masuk',
			SECTION_4_LINK_2: 'Daftar',
			SECTION_4_LINK_3: 'Contact Us',
			SECTION_4_LINK_4: 'Terms of Use',
			SECTION_5_TITLE: 'RESOURCES',
			SECTION_5_LINK_1: 'Whitepaper',
			SECTION_5_LINK_2: 'HollaeX Token (XHT) ',
			SECTION_5_LINK_3: 'GitHub',
			SECTION_5_LINK_4: 'FAQ', // new
			SECTION_6_TITLE: 'SOCIAL',
			SECTION_6_LINK_1: 'Twitter',
			SECTION_6_LINK_2: 'Telegram',
			SECTION_6_LINK_3: 'Facebook', // new
			SECTION_6_LINK_4: 'Instagram', // new
			SECTION_6_LINK_5: 'Linkedin', // new
			SECTION_6_LINK_6: 'Website', // new
			SECTION_6_LINK_7: 'Helpdesk', // new
			SECTION_6_LINK_8: 'Information', // new
			SECTION_6_LINK_9: 'YouTube', // new
		},
		XHT_DESCRIPTION:
			'HollaeX Kit adalah platform perdagangan sumber terbuka yang dibuat oleh bitHolla Inc. Anda dapat membuat dan mendaftarkan aset digital apa pun dan para pengguna dapat berdagang di bursa Anda menggunakan Kit Bursa. Untuk mulainya silakan rujukan {1}.',
		CLICK_HERE: 'klik di sini',
		VISIT_HERE: 'kunjungi sini',
	},
	ACCOUNTS: {
		TITLE: 'Akun',
		TAB_VERIFICATION: 'Verifikasi',
		TAB_SECURITY: 'Keamanan',
		TAB_NOTIFICATIONS: 'Notifikasi',
		TAB_SETTINGS: 'Pengaturan',
		TAB_PROFILE: 'Profile',
		TAB_WALLET: 'Dompet',
		TAB_SUMMARY: 'Ringkasan',
		TAB_HISTORY: 'Riwayat',
		TAB_API: 'API',
		TAB_SIGNOUT: 'Keluar',
	},
	REQUEST_XHT_ACCESS: {
		// new
		REQUEST_TITLE: 'Permintaan Akses',
		REQUEST_INVITE: 'Permintaan Undangan',
		CATEGORY_PLACEHOLDER: 'Pilih kategori yang tepat untuk isu Anda',
		INTRODUCTION_LABEL: 'Kenalkan Anda sendiri',
		INTRODUCTION_PLACEHOLDER:
			'Di mana Anda berbasis, apakah Anda terminat dalam menjalankan bursa?',
	},
	CONTACT_FORM: {
		CATEGORY_LABEL: 'Kategori',
		CATEGORY_PLACEHOLDER: 'Pilih kategori yang tepat untuk isu Anda',
		CATEGORY_OPTIONS: {
			OPTION_VERIFY: 'Verifikasi pengguna',
			OPTION_LEVEL: 'Tingkatkan tingkat pengguna',
			OPTION_DEPOSIT: 'Deposit & Penarikan',
			OPTION_BUG: 'Laporkan bug', // ToDo:
			OPTION_PERSONAL_INFO: 'Ganti informasi pribadi', // ToDo:
			OPTION_BANK_TRANSFER: 'Transfer kawat bank', // new
			OPTION_REQUEST: 'Permintaan undangan untuk Bursa HollaeX', // new
		},
		SUBJECT_LABEL: 'Judul',
		SUBJECT_PLACEHOLDER: 'Masukkan judul isu Anda',
		DESCRIPTION_LABEL: 'Deskripsi',
		DESCRIPTION_PLACEHOLDER: 'Masukkan detail isu Anda',
		ATTACHMENT_LABEL: 'Lampirkan file(3 max)', // ToDo:
		ATTACHMENT_PLACEHOLDER:
			'Lampirkan file untuk membantu menjelaskan isu Anda. File dalam bentuk PDF, JPG, PNG dan GIF dapat dilampirkan',
		SUCCESS_MESSAGE: 'Email telah terkirim ke dukungan pelanggan kami',
		SUCCESS_TITLE: 'Pesan Terkirim',
		SUCCESS_MESSAGE_1: 'Isu Anda telah terkirim ke dukungan pelanggan kami.',
		SUCCESS_MESSAGE_2: 'Pertanyaan Anda akan dibalas dalam 1-3 hari.',
	},
	DEPOSIT: {
		CRYPTO_LABELS: {
			ADDRESS: 'Alamat penerima {0} Anda', // new
			DESTINATION_TAG: 'Tag destinasi {0} Anda', // new
			MEMO: 'Memo {0} Anda', // new
			BTC: 'Alamat penerima Bitcoin Anda',
			ETH: 'Alamat penerima Ethereum Anda',
			BCH: 'Alamat penerima Bitcoin Cash Anda',
		},
		INCREASE_LIMIT: 'Apakah Anda ingin meningkatkan batas harian Anda?',
		QR_CODE:
			'Kode QR ini dapat dipindai oleh siapa yang ingin mengirimkan dana kepada Anda',
		NO_DATA: 'Tidak tersedia informasi',
		FULL_MESSAGE_LIMIT: '{0}: {1} {2} {3}', //  0 -> {Daily deposit max amount}:  1 -> {50,000,000} 2 -> {T} 3 -> {(Want to increase your daily limit?)}
	},
	LOGIN: {
		LOGIN_TO: 'Masuk {0}',
		CANT_LOGIN: 'Tidak bisa masuk?',
		NO_ACCOUNT: 'Tidak punya akun?',
		CREATE_ACCOUNT: 'Buatlah di sini',
		HELP: 'Bantuan',
	},
	FORM_FIELDS: {
		EMAIL_LABEL: 'Email',
		EMAIL_PLACEHOLDER: 'Masukkan alamat Email',
		PASSWORD_LABEL: 'Kata sandi',
		PASSWORD_PLACEHOLDER: 'Masukkan kata sandi Anda',
		PASSWORD_REPEAT_LABEL: 'Masukkan kata sandi Anda sekali lagi',
		PASSWORD_REPEAT_PLACEHOLDER: 'Masukkan kata sandi Anda sekali lagi',
	},
	VALIDATIONS: {
		OTP_LOGIN: 'Masukkan kode OTP untuk masuk',
		CAPTCHA: 'Expired Session. Please refresh the page',
		FROZEN_ACCOUNT: 'This account is frozen',
		INVALID_EMAIL: 'Alamat email yang tidak valid',
		TYPE_EMAIL: 'Masukkan Email Anda',
		REQUIRED: 'Kolom wajib diisi',
		INVALID_DATE: 'Tanggal yang tidak valid',
		INVALID_PASSWORD:
			'Kata sandi yang tidak valid. Kata sandi perlu memiliki setidaknya 8 karakter, termasuk satu angka dan satu karakter khusus.',
		INVALID_PASSWORD_2:
			'Kata sandi yang tidak valid. Kata sandi perlu memiliki setidaknya 8 karakter, termasuk satu angka dan satu karakter khusus.',
		INVALID_CURRENCY: 'Alamat {0} yang tidak valid ({1})',
		INVALID_BALANCE: 'Saldo tidak cukup ({0}) untuk mengoperasikan ({1}).',
		MIN_VALUE: 'Nilai harus {0} atau lebih tinggi.',
		MAX_VALUE: 'Nilai harus {0} atau lebih rendah.',
		INSUFFICIENT_BALANCE: 'Saldo tidak cukup',
		PASSWORDS_DONT_MATCH: 'Kata sandi yang salah',
		USER_EXIST: 'Email ini telah terdaftar',
		ACCEPT_TERMS:
			'Anda tidak menyetujui Syarat dan Ketentuan dan Kebijakan Pribadi',
		STEP: 'Nilai yang tidak valid, step is {0}',
		ONLY_NUMBERS: 'Anda hanya dapat masukkan angka',
	},
	LEGAL: {
		PRIVACY_POLICY: {
			TITLE: 'Privacy Policy',
			SUBTITLE:
				'Last updated April 1, 2019. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaeX Web is a virtual trading platform that is wholly owned by bitHolla Inc. bitHolla Inc (hereinafter referred to as bitHolla) was incorporated in Seoul South Korea.',
				'Use of this HollaeX website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by bitHolla you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. bitHolla may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that bitHolla has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by bitHolla following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by bitHolla including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any bitHolla trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without bitHolla’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘bitHolla’ and the bitHolla logo are trademarks of bitHolla Inc. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.',
			],
		},
		GENERAL_TERMS: {
			TITLE: 'General Terms of Service',
			SUBTITLE:
				'Last updated April 1, 2019. Replaces the prior version in its entirety.',
			TEXTS: [
				'HollaeX Web is a virtual trading platform that is wholly owned by bitHolla Inc. bitHolla Inc (hereinafter referred to as bitHolla) was incorporated in Seoul South Korea.',
				'Use of this HollaeX website (“Website”) and the service offered on the Website (“Service”) are governed by the terms contained on this Terms and Conditions page (“Terms”). This agreement entirely constitutes the agreement between the parties. All other information provided on the Website or oral/written statements made are excluded from this agreement; the exchange policy is provided for guidance only and does not constitute a legal agreement between the parties.',
				'By accessing, viewing or downloading information from the Website and using the Service provided by bitHolla you acknowledge that you have read, understand, and unconditionally agree to be bound by these Terms. bitHolla may at any time, without notice, amend the Terms. You agree to continue to be bound by any amended terms and conditions and that bitHolla has no obligation to notify you of such amendments. You acknowledge that it is your responsibility to check these Terms periodically for changes and that your continued use of the Website and Services offered by bitHolla following the posting of any changes to the Terms indicates your acceptance of any such changes.',
				'The Website and the copyright in all text, graphics, images, software and any other materials on the Website is owned by bitHolla including all trademarks and other intellectual property rights in respect of materials and Service on the Website. Materials on this Website may only be used for personal use and non-commercial purposes.',
				'You may display on a computer screen or print extracts from the Website for the above-stated purpose only provided that you retain any copyright and other proprietary notices or any bitHolla trademarks or logos, as shown on the initial printout or download without alteration, addition or deletion. Except as expressly stated herein, you may not without bitHolla’s prior written permission alter, modify, reproduce, distribute or use in any other commercial context any materials from the Website.',
				'You acknowledge that ‘bitHolla’ and the bitHolla logo are trademarks of bitHolla Inc. You may reproduce such trademarks without alteration on material downloaded from this Website to the extent authorised above, but you may not otherwise use, copy, adapt or erase them.',
				'You shall not in any circumstances obtain any rights over or in respect of the Website (other than rights to use the Website pursuant to these Terms and any other terms and conditions governing a particular service or section of the Website) or hold yourself out as having any such rights over or in respect of the Website.',
			],
		},
	},
	NOTIFICATIONS: {
		BUTTONS: {
			OKAY: 'Okay',
			START_TRADING: 'Mulai pertukaran',
			SEE_HISTORY: 'Lihat riwayat',
		},
		DEPOSITS: {
			TITLE_RECEIVED: '{0} Deposit diterima',
			TITLE_INCOMING: 'Sedang dalam proses {0}',
			SUBTITLE_RECEIVED: 'Anda telah menerima {0} deposit Anda',
			SUBTITLE_INCOMING: 'Ada {0} sedang dalam proses',
			INFORMATION_PENDING_1:
				'{0} Anda perlu 1 konfirmasi sebelum Anda mulai berdagang.',
			INFORMATION_PENDING_2:
				'Proses ini membutuhkan waktu 10-30 menit. Kami akan kirim email setelah {0} Anda sudah dikonfirmasi pada blockchain.',
		},
	},
	REFERRAL_SUCCESS: {
		TITLE: 'Permintaan Terkirim',
		BUTTON_TEXT: 'Okay',
	},
	OTP_FORM: {
		OTP_FORM_TITLE: 'Masukkan kode autentikasi untuk lanjutkan',
		OTP_LABEL: 'Kode OTP',
		OTP_PLACEHOLDER: 'Masukkan kode autentikasi',
		OTP_TITLE: 'Kode Autentikasi',
		OTP_HELP: 'bantuan',
		OTP_BUTTON: 'serahkan',
		ERROR_INVALID: 'Kode OTP yang tidak valid',
	},
	QUICK_TRADE_COMPONENT: {
		TITLE: 'Cepat',
		TOTAL_COST: 'Jumlah biaya',
		BUTTON: 'Lihat pesan {0}',
		INPUT: 'Pembelian {0} {1}',
		TRADE_TITLE: '{0} {1}', // quick buy
	},
	PREVIOUS_PAGE: 'halaman sebelumnya',
	NEXT_PAGE: 'halaman berikutnya',
	WALLET: {
		LOADING_ASSETS: 'Aset sedang diload...', // new
		TOTAL_ASSETS: 'Jumlah Aset',
		AVAILABLE_WITHDRAWAL: 'Tersedia untuk pertukaran',
		AVAILABLE_TRADING: 'Tersedia untuk penarikan',
		ORDERS_PLURAL: 'Pesan',
		ORDERS_SINGULAR: 'Pesan',
		HOLD_ORDERS:
			'You have {0} open {1}, resulting in a hold of {2} {3} placed on your {4} balance',
	},
	REQUEST_RESET_PASSWORD: {
		TITLE: 'Pemulihan Akun',
		SUBTITLE: `Pulihkan akun Anda di bawah`,
		SUPPORT: 'Hubungi Dukungan pelanggan',
		BUTTON: 'Kirim tautan pemulihan',
	},
	REQUEST_RESET_PASSWORD_SUCCESS: {
		TITLE: 'Reset kata sandi terkirim',
		TEXT:
			'Jika sudah ada akun yang menggunakan alamat email tersebut, email akan dikirm dengan instruksi pemulihan kata sandi. Silakan cek email Anda dan klik tautan untuk menyelesaikan proses pemulihan kata sandi.',
	},
	RESET_PASSWORD: {
		TITLE: 'Buat kata sandi baru',
		SUBTITLE: 'Buat kata sandi baru',
		BUTTON: 'Buat kata sandi baru',
	},
	RESET_PASSWORD_SUCCESS: {
		TEXT_1: 'Kata sandi baru Anda telah berhasil dibuat.',
		TEXT_2: 'Klik masuk di bawah untuk melanjutkan.',
	},
	SIGN_UP: {
		SIGNUP_TO: 'Daftar di {0}',
		NO_EMAIL: 'Email tidak masuk??',
		REQUEST_EMAIL: 'Cobalah kirim ulang di sini',
		HAVE_ACCOUNT: 'Sudah punya akun?',
		GOTO_LOGIN: 'Pergi ke halaman masuk',
		AFFILIATION_CODE: 'Kode Referral(opsional)',
		AFFILIATION_CODE_PLACEHOLDER: 'Masukkan kode referral Anda',
		TERMS: {
			terms: 'Syarat dan Ketentuan',
			policy: 'Kebijakan Pribadi',
			text: 'Saya telah membaca dan menyetujui {0} dan {1}',
		},
	},
	VERIFICATION_TEXTS: {
		TITLE: 'Email terkirim',
		TEXT_1: 'Cek email Anda dan klik tautan untuk verifikasi email Anda.',
		TEXT_2:
			'Jika email verifikasi tidak masuk dan Anda sudah cek folder SPAM, cobalah klik kirim lagi di bawah.',
	},
	VERIFICATION_EMAIL_REQUEST: {
		TITLE: 'Permintaan Kirim Ulang Email',
		BUTTON: 'Kirim Email',
	},
	VERIFICATION_EMAIL_REQUEST_SUCCESS: {
		TITLE: 'Kirim Ulang Email',
		TEXT_1:
			'Jika email verifikasi tidak masuk setelah beberapa menit, silakan hubungi saya di bawah.',
	},
	VERIFICATION_EMAIL: {
		INVALID_UUID: 'Kode tidak valid',
		TEXT_1: 'Email Anda telah berhasil diverifikasi.',
		TEXT_2: 'Anda bisa masuk sekarang',
	},
	USER_VERIFICATION: {
		INFO_TXT: 'Anda dapat melihat prosedur verifikasi dan pembaruan akun Anda.',
		INFO_TXT_1:
			'Silakan masukkan informasi pada kolom di bawah. Akun Anda akan diperbarui setelah informasi yang Anda serahkan diidentifikasikan.',
		INFO_TXT_2:
			'* {0} dokumen tertentu diperlukan untuk memverifikasi identitas Anda.',
		DOCUMENTATIONS: 'upload',
		COMPLETED: 'Selesai',
		PENDING_VERIFICATION: 'Sedang dalam proses verifikasi',
		TITLE_EMAIL: 'Email',
		MY_EMAIL: 'Email Saya',
		MAKE_FIRST_DEPOSIT: 'Lakukan deposit pertama', // new
		OBTAIN_XHT: 'Dapatkan XHT', // new
		TITLE_USER_DOCUMENTATION: 'Identifikasi',
		TITLE_ID_DOCUMENTS: 'Upload',
		TITLE_BANK_ACCOUNT: 'Rekening Bank',
		TITLE_MOBILE_PHONE: 'Telepon Seluler',
		TITLE_PERSONAL_INFORMATION: 'Informasi Pribadi',
		VERIFY_EMAIL: 'Verifikasi email',
		VERIFY_MOBILE_PHONE: 'Verifikasi ponsel',
		VERIFY_USER_DOCUMENTATION: 'Verifikasi dokumentasi pengguna',
		VERIFY_ID_DOCUMENTS: 'Verifikasi dokumen id',
		VERIFY_BANK_ACCOUNT: 'Verifikasi rekening bank',
		BUTTON: 'Serahkan Permintaan Verifikasi',
		TITLE_IDENTITY: 'Identitas',
		TITLE_MOBILE: 'Ponsel',
		TITLE_MOBILE_HEADER: 'Nomor Ponsel',
		TITLE_BANK: 'Bank',
		TITLE_BANK_HEADER: 'Detail Bank',
		CHANGE_VALUE: 'Ubah nilai',
		PENDING_VERIFICATION_PERSONAL_INFORMATION:
			'Informasi pribadi Anda sedang dalam proses',
		PENDING_VERIFICATION_BANK:
			'Detail bank Anda sedang dalam proses verifikasi',
		PENDING_VERIFICATION_DOCUMENTS:
			'Dokumen Anda sedang dalam proses verifikasi',
		GOTO_VERIFICATION: 'Pergi ke verifikasi',
		GOTO_WALLET: 'Pergi ke dompet', // new
		CONNECT_BANK_ACCOUNT: 'Hubungkan Rekening Bank',
		ACTIVATE_2FA: 'Aktifkan 2FA',
		INCOMPLETED: 'Belum selesai',
		BANK_VERIFICATION: 'Verifikasi Bank',
		IDENTITY_VERIFICATION: 'Verifikasi Identitas',
		PHONE_VERIFICATION: 'Verifikasi Ponsel',
		DOCUMENT_VERIFICATION: 'Verifikasi Dokumen',
		START_BANK_VERIFICATION: 'Mulai Verifikasi Bank',
		START_IDENTITY_VERIFICATION: 'Mulai Verifikasi Identitas',
		START_PHONE_VERIFICATION: 'Mulai Verifikasi Ponsel',
		START_DOCUMENTATION_SUBMISSION: 'Mulai Serahkan Dokumen',
		GO_BACK: 'Kembali',
		BANK_VERIFICATION_TEXT_1:
			'Anda dapat menambahkan maksimal 3 rekening bank. Untuk rekening bank internasional, silakan hubungi dukungan pelanggan dan batas pengambilan dana akan terbatas.',
		BANK_VERIFICATION_TEXT_2:
			'Dengan verifikasi rekening Anda, Anda dapat menggunakan layanan berikut:',
		BASE_WITHDRAWAL: 'Penarikan Fiat',
		BASE_DEPOSITS: 'Deposit Fiat',
		ADD_ANOTHER_BANK_ACCOUNT: 'Menambahkan Rekening Bank Yang Lain',
		BANK_NAME: 'Nama Bank',
		ACCOUNT_NUMBER: 'Nomor Rekening',
		CARD_NUMBER: 'Nomor Kartu',
		BANK_VERIFICATION_HELP_TEXT:
			'Untuk menyelesaikan verifikasi bagian ini, Anda perlu menyelesaikan bagian {0} terlebih dahulu.',
		DOCUMENT_SUBMISSION: 'Serahkan Dokumen',
		REVIEW_IDENTITY_VERIFICATION: 'Tinjau Verifikasi Identitas',
		PHONE_DETAILS: 'Detail Ponsel',
		PHONE_COUNTRY_ORIGIN: 'Negara Pembukaan Ponsel',
		MOBILE_NUMBER: 'Nomor Ponsel',
		START_DOCUMENTATION_RESUBMISSION: 'Start Documentation Re-Submission',
		DOCUMENT_PROOF_SUBMISSION: 'Serahkan Bukti Dokumen',
		SUBMISSION_PENDING_TXT:
			'*Bagian ini telah diserahkan. Jika Anda mengubah informasi atau menyerahkan ulang dokumen, informasi sebelumnya akan ditimpa.',
		CUSTOMER_SUPPORT_MESSAGE: 'Pesan Dukungan Pelanggan',
		DOCUMENT_PENDING_NOTE:
			'Dokumen Anda telah diserahkan dan sedang dalam proses tinjauan. Mohon kesabaran Anda.',
		DOCUMENT_VERIFIED_NOTE: 'Dokumen Anda telah diselesaikan.',
		NOTE_FROM_VERIFICATION_DEPARTMENT: 'Catatan dari departemen verifikasi',
		CODE_EXPIRES_IN: 'Kode habis masa berlaku',
		USER_DOCUMENTATION_FORM: {
			FORM_FIELDS: {
				FIRST_NAME_LABEL: 'Nama depan',
				FIRST_NAME_PLACEHOLDER:
					'Masukkan nama depan Anda sesuai dengan yang tertulis pada dokumen identitas Anda',
				LAST_NAME_LABEL: 'Nama belakang',
				LAST_NAME_PLACEHOLDER:
					'Masukkan nama belakang Anda sesuai dengan yang tertulis pada dokumen identitas Anda',
				FULL_NAME_LABEL: 'Nama Lengkap Anda',
				FULL_NAME_PLACEHOLDER:
					'Masukkan nama lengkap Anda sesuai dengan yang tertulis pada dokumen identitas Anda',
				GENDER_LABEL: 'Jenis Kelamin',
				GENDER_PLACEHOLDER: 'Pilih jenis kelamin Anda',
				GENDER_OPTIONS: {
					MAN: 'Laki-laki',
					WOMAN: 'Perempuan',
				},
				NATIONALITY_LABEL: 'Kewarganegaraan',
				NATIONALITY_PLACEHOLDER:
					'Pilih kewarganegaraan Anda yang tertulis pada dokumen identitas Anda',
				DOB_LABEL: 'Tanggal lahir',
				COUNTRY_LABEL: 'Tempat tinggal',
				COUNTRY_PLACEHOLDER: 'Pilih negara tempat tinggal Anda saat ini',
				CITY_LABEL: 'Kota',
				CITY_PLACEHOLDER: 'Pilih kota tempat tinggal Anda',
				ADDRESS_LABEL: 'Alamat',
				ADDRESS_PLACEHOLDER: 'Masukkan alamat tempat tinggal Anda',
				POSTAL_CODE_LABEL: 'Kode pos',
				POSTAL_CODE_PLACEHOLDER: 'Masukkan kode pos',
				PHONE_CODE_LABEL: 'Negara',
				PHONE_CODE_PLACEHOLDER: 'Pilih nomor kode negara Anda',
				PHONE_CODE_DISPLAY: '({0}) {1}', // 0 -> (+21)  1 -> South Korea
				PHONE_NUMBER_LABEL: 'Nomor telepon',
				PHONE_NUMBER_PLACEHOLDER: 'Masukkan nomor telepon Anda',
				CONNECTING_LOADING: 'Loading',
				SMS_SEND: 'Kirim SMS',
				SMS_CODE_LABEL: 'Kode SMS',
				SMS_CODE_PLACEHOLDER: 'Masukkan kode SMS Anda',
			},
			INFORMATION: {
				TEXT:
					'PENTING: Masukkan nama pada kolom dengan yang tertulis pada dokumen identitas Anda (Nama depan lengkap, nama/huruf awal tengah jika ada dan nama belakang lengkap). Apakah Anda badan usaha? Hubungi dukungan pelanggan kami untuk akun badan usaha.',
				TITLE_PERSONAL_INFORMATION: 'Informasi Pribadi',
				TITLE_PHONE: 'Telepon',
				PHONE_VERIFICATION_TXT:
					'Mohon berikan detail kontak Anda untuk mencegah terjadinya transaksi yang tidak diinginkan Anda pada akun Anda dan membantu dukungan pelanggan kami untuk memecahkan masalah.',
				PHONE_VERIFICATION_TXT_1:
					'Dapatkan pembaruan deposit dan penarikan secara real-time dengan berbagi nomor telepon.',
				PHONE_VERIFICATION_TXT_2:
					'Buktikan lebih lanjut identitas dan alamat Anda dengan berbagi nomor telepon LAN (opsional).',
			},
		},
		ID_DOCUMENTS_FORM: {
			VALIDATIONS: {
				ID_TYPE: 'Silakan pilih tipe dokumen identitas',
				ID_NUMBER: 'Silakan masukkan nomor dokumen Anda',
				ISSUED_DATE: 'Silakan pilih tanggal penerbitan dokumen Anda',
				EXPIRATION_DATE: 'Silakan pilih tanggal ekspirasi dokumen Anda',
				FRONT: 'Silakan upload pemindaian paspor Anda',
				PROOF_OF_RESIDENCY:
					'Silakan upload pemindaian dokumen yang tertulis alamat tempat tinggal Anda saat ini',
				SELFIE_PHOTO_ID: 'Silakan upload selfie dengan paspor dan catatan',
			},
			FORM_FIELDS: {
				TYPE_LABEL: 'Tipe Dokumen ID',
				TYPE_PLACEHOLDER: 'Pilih Tipe dokumen identitas',
				TYPE_OPTIONS: {
					ID: 'ID',
					PASSPORT: 'Paspor',
				},
				ID_NUMBER_LABEL: 'Nomor Paspor',
				ID_NUMBER_PLACEHOLDER: 'Masukkan nomor paspor Anda',
				ID_PASSPORT_NUMBER_LABEL: 'Nomor Paspor',
				ID_PASSPORT_NUMBER_PLACEHOLDER: 'Masukkan nomor paspor Anda',
				ISSUED_DATE_LABEL: 'Tanggal Penerbitan Paspor',
				EXPIRATION_DATE_LABEL: 'Tanggal Ekspirasi Pasopr',
				FRONT_LABEL: 'Paspor',
				FRONT_PLACEHOLDER: 'Tambahkan salinan paspor Anda',
				BACK_LABEL: 'Simpul paspor',
				BACK_PLACEHOLDER: 'Tambahkan bagian belakang ID Anda(jika ada)',
				PASSPORT_LABEL: 'Dokumen Paspor',
				PASSPORT_PLACEHOLDER: 'Tambahkan dokumen Paspor Anda',
				POR_LABEL: 'Dokumen yang tertulis alamat Anda',
				POR_PLACEHOLDER: 'Tambahkan dokumen yang membuktikan alamat Anda',
				SELFIE_PHOTO_ID_LABEL: 'Selfie Anda dengan paspor dan catatan',
				SELFIE_PHOTO_ID_PLACEHOLDER:
					'Tambahkan Selfie Anda dengan pasopr dan catatan',
			},
			INFORMATION: {
				IDENTITY_DOCUMENT: 'Dokumen Identitas',
				PROOF_OF_RESIDENCY: 'Bukti tempat tinggal',
				ID_SECTION: {
					TITLE: 'Tolong pastikan dokumen Anda yang diserahkan:',
					LIST_ITEM_1:
						'BERKUALITAS TINGGI (gambar berwarna, resolusi 300 dpi atau lebih tinggi).',
					LIST_ITEM_2:
						'DAPAT DILIHAT SECARA KESELURUHAN (watermark diizinkan).',
					LIST_ITEM_3:
						'VALID, dengan terlihatnya tanggal ekspirasi secara jelas.',
					WARNING_1:
						'Hanya paspor valid dapat diterima; foto atau gambar pemindaian dokumen yang berkualitas tinggi dapat diterima:',
					WARNING_2:
						'Pastikan Anda mengupload dokumen Anda sendiri. Penggunaan dokumen yang salah atau palsu akan menimbulkan konsekuensi hukum dan pemblokiran akun Anda dengan segera.',
					WARNING_3:
						'Mohon jangan serahkan paspor sebagai bukti tempat tinggal Anda.',
				},
				POR: {
					SECTION_1_TEXT_1:
						'Untuk menghindari penundaan dalam proses verifikasi akun Anda, harap pastikan bahwa:',
					SECTION_1_TEXT_2:
						'NAMA, ALAMAT, TANGGAL PENERBITAN dan PENERBIT Anda terlihat secara jelas.',
					SECTION_1_TEXT_3:
						'Dokumen bukti tempat tinggal yang diserahkan diterbitkan PALING LAMA DALAM 3 BULAN.',
					SECTION_1_TEXT_4:
						'Anda serahkan gambar berwarna atau gambar pemindaian yang BERKUALITAS TINGGI(setidaknya 300 DPI)',
					SECTION_2_TITLE: 'BUKTI TEMPAT TINGGAL YANG DAPAT DITERIMA ADALAH:',
					SECTION_2_LIST_ITEM_1: 'Surat pernyataan rekening bank.',
					SECTION_2_LIST_ITEM_2:
						'Tagihan utilitas(listrik, air, internet, dll.).',
					SECTION_2_LIST_ITEM_3:
						'Dokumen yang diterbitkan oleh Pemerintah(surat tagihan pajak, sertifikat tempat tinggal, dll.).',
					WARNING:
						'Kami tidak bisa menerima alamat yang tertulis di dokumen identitas yang Anda serahkan sebagai bukti tempat tinggal yang valid.',
				},
				SELFIE: {
					TITLE: 'Selfie dengan paspor dan catatan',
					INFO_TEXT:
						'Harap berikan foto Anda memegang paspor Anda. Pastikan tautan bursa, tanggal hari ini, dan tanda tangan Anda terlihat dalam foto yang sama. Pastikan muka dan detail ID Anda terlihat secara jelas.',
					REQUIRED: 'Yang diperlukan:',
					INSTRUCTION_1: 'Muka Anda yang terlihat jelas',
					INSTRUCTION_2: 'Paspor yang terlihat jelas',
					INSTRUCTION_3: 'Tuliskan nama bursa',
					INSTRUCTION_4: 'Tuliskan tanggal hari ini',
					INSTRUCTION_5: 'Berikan tanda tangan Anda',
					WARNING:
						'Selfie dengan paspor yang berbeda dengan apa yang diuplad akan dibatalkan',
				},
			},
		},
		BANK_ACCOUNT_FORM: {
			VALIDATIONS: {
				ACCOUNT_OWNER:
					'Masukkan nama depan dan belakang Anda sesuai dengan apa yang tertulis pada rekening bank Anda',
				ACCOUNT_NUMBER:
					'Nomor rekening bank Anda tidak boleh melebihi 50 digit',
				ACCOUNT_NUMBER_MAX_LENGTH:
					'Nomor rekening bank Anda tidak boleh melebihi 50 karakter',
				CARD_NUMBER: 'Format nomor kartu Anda salah',
			},
			FORM_FIELDS: {
				BANK_NAME_LABEL: 'Nama Bank',
				BANK_NAME_PLACEHOLDER: 'Masukkan nama bank Anda',
				ACCOUNT_NUMBER_LABEL: 'Nomor Rekening Bank',
				ACCOUNT_NUMBER_PLACEHOLDER: 'Masukkan nomor rekening bank Anda',
				ACCOUNT_OWNER_LABEL: 'Nama Pemilik Rekening Bank',
				ACCOUNT_OWNER_PLACEHOLDER:
					'Masukkan nama sesuai dengan apa yang tertulis pada rekening bank Anda',
				CARD_NUMBER_LABEL: 'Nomor Kartu Bank',
				CARD_NUMBER_PLACEHOLDER:
					'Masukkan nomor 16 digit yang tertulis di depan kartu bank Anda',
			},
		},
		WARNING: {
			TEXT_1: 'Dengan verifikasi identitas Anda, Anda dapat mendapatkan:',
			LIST_ITEM_1: 'Batas penarikan yang ditingkatkan',
			LIST_ITEM_2: 'Batas deposit yang ditingkatkan',
			LIST_ITEM_3: 'Biaya lebih rendah',
		},
	},
	USER_SETTINGS: {
		TITLE_TEXT_1:
			'Ubah pengaturan akun Anda. Dari interface, notifikasi, nama pengguna dan kustomisasi lainnya.',
		TITLE_TEXT_2:
			'Simpan setelah mengubah pengaturan dan penggantian akan diterapkan.',
		TITLE_NOTIFICATION: 'Notifikasi',
		TITLE_INTERFACE: 'Interface',
		TITLE_LANGUAGE: 'Bahasa',
		TITLE_CHAT: 'Chat',
		TITLE_AUDIO_CUE: 'Play Audio Cue', // new
		TITLE_MANAGE_RISK: 'Manajemen Risiko',
		ORDERBOOK_LEVEL: 'Level Orderbook(Max 20)',
		SET_TXT: 'SET',
		CREATE_ORDER_WARING: 'Ciptakan Peringatan Pesan',
		RISKY_TRADE_DETECTED: 'Perdagangan Berisiko Terdeteksi',
		RISKY_WARNING_TEXT_1:
			'Nilai pesan ini melebihi jumlah batas yang telah Anda set {0} .',
		RISKY_WARNING_TEXT_2: '(portofolio {0})',
		RISKY_WARNING_TEXT_3:
			'Silakan cek dan memverifikasi bahwa Anda yang melakukan perdagangan ini.',
		GO_TO_RISK_MANAGMENT: 'PERGI KE MANAJEMEN RISIKO',
		CREATE_ORDER_WARING_TEXT:
			'Ciptakan pop up peringatan apabila pesan perdagangan Anda menggunakan lebih dari {0} dari portofolio Anda',
		ORDER_PORTFOLIO_LABEL: 'Jumlah Persentase Portofolio:',
		NOTIFICATION_FORM: {
			TRADE_POPUPS: 'Pop up Perdagangan',
			POPUP_ORDER_CONFIRMATION: 'Minta konfirmasi sebelum mengirim pesan',
			POPUP_ORDER_COMPLETED: 'Tunjukkan pop up apabila pesan telah selesai',
			POPUP_ORDER_PARTIALLY_FILLED:
				'Tunjukkan pop up apabila sebagian pesan telah terisi',
		},
		AUDIO_CUE_FORM: {
			// new
			ALL_AUDIO: 'Semua Audio cue',
			PUBLIC_TRADE_AUDIO: 'Apabila perdagangan publik dibuat',
			ORDERS_PARTIAL_AUDIO: 'Apabila salah satu pesan Anda terisi sebagian',
			ORDERS_PLACED_AUDIO: 'Apabila pesan dibuat',
			ORDERS_CANCELED_AUDIO: 'Apabila pesan Anda dibatalkan',
			ORDERS_COMPLETED_AUDIO: 'Apabila salah satu pesan Anda terisi penuh',
			CLICK_AMOUNTS_AUDIO: 'Apabila klik jumlah dan harga di orderbook',
			GET_QUICK_TRADE_AUDIO:
				'Apabila mendapatkan kutipan untuk perdagangan cepat',
			SUCCESS_QUICK_TRADE_AUDIO:
				'Apabila dilakukan perdagangan cepat dengan sukses',
			QUICK_TRADE_TIMEOUT_AUDIO: 'Apabila perdagangan cepat timeout',
		},
		RISK_MANAGEMENT: {
			INFO_TEXT:
				'Ciptakan pop up apabila nilai pesan perdagangan melebihi sebagian persentase dari jumlah portofolio Anda yang Anda tetapkan',
			INFO_TEXT_1: 'Jumlah nilai aset dalam {0}: {1}',
			PORTFOLIO: 'Persentase portofolio',
			TOMAN_ASSET: 'Nilai Perkiraan',
			ADJUST: '(SESUAIKAN PERSENTASE)',
			ACTIVATE_RISK_MANAGMENT: 'Aktifkan Manajemen Risiko',
			WARNING_POP_UP: 'Pop up peringatan',
		},
	},
	TRANSACTION_HISTORY: {
		TITLE: 'Riwayat',
		TITLE_TRADES: 'Riwayat Perdagangan',
		TITLE_DEPOSITS: 'Riwayat Deposit',
		TITLE_WITHDRAWALS: 'Riwayat Penarikan',
		TEXT_DOWNLOAD: 'UNDUH RIWAYAT',
		TRADES: 'Perdagangan',
		DEPOSITS: 'Deposit',
		WITHDRAWALS: 'Penarikan',
	},
	ACCOUNT_SECURITY: {
		TITLE_TEXT:
			'Atur pengaturan keamanan akun Anda. Mulai dari Autentikasi dua-faktor, kata sandi, Kunci API, dan fungsi lain yang berkaitan dengan keamanan.',
		OTP: {
			TITLE: 'Autentikasi Dua-Faktor',
			OTP_ENABLED: 'otp diaktifkan',
			OTP_DISABLED: 'HARAP AKTIFKAN 2FA',
			ENABLED_TEXTS: {
				TEXT_1: 'Membutuhkan OTP saat masuk',
				TEXT_2: 'Membutuhkan OTP saat menarik dana',
			},
			DIALOG: {
				SUCCESS: 'OTP Anda telah berhasil diaktifkan',
				REVOKE: 'OTP Anda telah berhasil dinonaktifkan',
			},
			CONTENT: {
				TITLE: 'Aktifkan Autentikasi Dua-Faktof',
				MESSAGE_1: 'Pindai',
				MESSAGE_2:
					'Pindai koed QR di bawah dengan Autentikasi Google atau Authy untuk mengatur autentikasi dua-faktor secara otomatis di perangkat Anda.',
				MESSAGE_3:
					'Jika Anda memiliki masalah memindai ini, Anda dapat masukkan kode di bawah secara manual',
				MESSAGE_4:
					'Anda dapat menyimpan kode ini dengan aman untuk memulihkan 2FA Anda apabila Anda mengubah atau kehilangan ponsel Anda di masa depan.',
				MESSAGE_5: 'Manual',
				INPUT: 'Masukkan Kata Sandi Sekali Pakai (OTP)',
				WARNING:
					'Kami sangat menyarankan Anda mengaktifkan autentikasi 2 faktor (2FA). Dengan mengaktifkannya, tingkat keamanan dana Anda akan sangat ditingkatkan.',
				ENABLE: 'Aktifkan Autentikasi Dua-Faktor',
				DISABLE: 'Nonaktifkan Autentikasi Dua-Faktor',
				SECRET_1: 'Enter yor secret key',
				SECRET_2: 'Please enter your secret key to confirm you wrote it down.',
				SECRET_3:
					'This secret key will help you recover your account if you lost access to your phone.',
				INPUT_1: 'Secret Key',

				TITLE_2: 'Masukkan One-Time Password (OTP)',
				MESSAGE_6: 'Silakan masukkan 6 digit one-time password di bawah.',
				INPUT_2: 'One-Time Password (OTP)',
			},
			FORM: {
				PLACEHOLDER:
					'Masukkan OTP yang ditunjukkan di aplikasi Autentikasi Google.',
				BUTTON: 'Aktifkan 2FA',
			},
		},
		CHANGE_PASSWORD: {
			TITLE: 'Ubah Kata Sandi',
			ACTIVE: 'AKTIFKAN',
			DIALOG: {
				SUCCESS: 'Kata sandi Anda telah berhasil diubah',
			},
			FORM: {
				BUTTON: 'Ubah Kata Sandi',
				CURRENT_PASSWORD: {
					label: 'Kata Sandi Saat Ini ',
					placeholder: 'Masukkan kata sandi Anda saat ini',
				},
				NEW_PASSWORD: {
					label: 'Kata Sandi Baru',
					placeholder: 'Masukkan kata sandi baru',
				},
				NEW_PASSWORD_REPEAT: {
					label: 'Konfirmasi Kata Sandi Baru',
					placeholder: 'Masukkan ulang kata sandi baru Anda',
				},
			},
		},
		LOGIN: {
			TITLE: 'Riwayat Masuk',
			CONTENT: {
				TITLE: 'Riwayat Masuk',
				MESSAGE:
					'Below is login history list with details IP, country and time details. If you see any suspicious activity you should change your password and contact support',
			},
		},
		FREEZE: {
			TITLE: 'Freeze Account',
			CONTENT: {
				MESSAGE_1:
					'Freezing your account will stop whitdrawals and halts all tradings.',
				WARNING_1:
					'Use only if you fear that your account has been compromised',
				TITLE_1: 'Freeze your Account',
				TITLE_2: 'Account freezing',
				MESSAGE_2:
					'Freezing your account may help guard your account from cyber attacks.',
				MESSAGE_3:
					'The following will occur if you choose to freeze your account:',
				MESSAGE_4: '1. Pending withdrawals will be canceled.',
				MESSAGE_5:
					'2. All tradings will be halted and unfilled orders will be canceled.',
				MESSAGE_6:
					'3. Containing support will be required to reactivate your account.',
				WARNING_2: 'Do you really want to freeze your account?',
			},
		},
	},
	CURRENCY: 'Currency',
	TYPE: 'Type',
	TYPES_VALUES: {
		market: 'market',
		limit: 'limit',
	},
	TYPES: [
		{ value: 'market', label: 'market' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'limit', label: 'limit' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIDE: 'Side',
	SIDES_VALUES: {
		buy: 'beli',
		sell: 'jual',
	},
	SIDES: [
		{ value: 'buy', label: 'beli' },
		{ value: 'sell', label: 'jual' },
	], // DO NOT CHANGE value, ONLY TRANSLATE label
	DEFAULT_TOGGLE_OPTIONS: [
		{ value: true, label: 'on' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: false, label: 'off' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SIZE: 'Jumlah',
	PRICE: 'Harga',
	FEE: 'Fee',
	FEES: 'Fees',
	LIMIT: 'Limit',
	TIME: 'Time',
	TIMESTAMP: 'Timestamp',
	MORE: 'More',
	VIEW: 'View',
	STATUS: 'Status',
	AMOUNT: 'Jumlah',
	COMPLETE: 'Complete',
	PENDING: 'Pending',
	REJECTED: 'Rejected',
	ORDERBOOK: 'Order book',
	CANCEL: 'Cancel',
	CANCEL_ALL: 'Cancel All',
	GO_TRADE_HISTORY: 'Pergi ke Riwayat Transaksi',
	ORDER_ENTRY: 'order entry',
	TRADE_HISTORY: 'Riwayat',
	CHART: 'GRAFIK HARGA',
	ORDERS: 'pesan aktif saya',
	TRADES: 'riwayat transaksi saya',
	RECENT_TRADES: 'perdagangan saya baru-baru ini', // ToDo
	PUBLIC_SALES: 'PENJUALAN PUBLIK', // ToDo
	REMAINING: 'Remaining',
	FULLFILLED: '{0} % Filled',
	FILLED: 'Filled', // new
	LOWEST_PRICE: 'Lowest Price ({0})', // new
	PHASE: 'Phase', // new
	INCOMING: 'Incoming', // new
	PRICE_CURRENCY: 'PRICE',
	AMOUNT_SYMBOL: 'AMOUNT',
	MARKET_PRICE: 'Harga Pasar',
	ORDER_PRICE: 'Harga Pesan',
	TOTAL_ORDER: 'Jumlah Pesan',
	NO_DATA: 'Tidak Ada Data',
	LOADING: 'Loading',
	CHART_TEXTS: {
		d: 'Date',
		o: 'Open',
		h: 'High',
		l: 'Low',
		c: 'Close',
		v: 'Volume',
	},
	QUICK_TRADE: 'Perdagangan cepat',
	PRO_TRADE: 'Perdagangan pro',
	ADMIN_DASH: 'Halaman Admin',
	WALLET_TITLE: 'Dompet',
	TRADING_MODE_TITLE: 'Mode Perdagangan',
	TRADING_TITLE: 'Perdagangan',
	LOGOUT: 'Keluar',
	WITHDRAWALS_MIN_VALUE_ERROR:
		'Nilai transaksi terlalu kecil untuk dikirim. Silakan coba dengan nilai lebih besar.',
	WITHDRAWALS_MAX_VALUE_ERROR:
		'Nilai transaksi terlalu besar untuk dikirim. Silakan coba dengan nilai lebih kecil.',
	WITHDRAWALS_LOWER_BALANCE:
		'You don’t have enough {0} in your balance to send that transaction',
	WITHDRAWALS_FEE_TOO_LARGE:
		'The fee is more than {0}% of your total transaction',
	WITHDRAWALS_BTC_INVALID_ADDRESS:
		'Alamat Bitcoin tidak valid. Silakan cek dengan teliti dan masukkan lagi',
	WITHDRAWALS_ETH_INVALID_ADDRESS:
		'Alamat Ethereum tidak valid. Silakan cek dengan teliti dan masukkan lagi',
	WITHDRAWALS_BUTTON_TEXT: 'LIHAI PENARIKAN',
	WITHDRAWALS_FORM_ADDRESS_LABEL: 'Alamat penerima',
	WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER: 'Masukkan alamat',
	WITHDRAWALS_FORM_DESTINATION_TAG_LABEL: 'Destination tag (optional)', // new
	WITHDRAWALS_FORM_MEMO_LABEL: 'Memo (optional)', // new
	WITHDRAWALS_FORM_DESTINATION_TAG_PLACEHOLDER: 'Type the destination tag', // new
	WITHDRAWALS_FORM_MEMO_PLACEHOLDER: 'Type the transaction memo', // new
	WITHDRAWALS_FORM_AMOUNT_LABEL: 'Jumlan penarikan {0}',
	WITHDRAWALS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	WITHDRAWALS_FORM_FEE_COMMON_LABEL: 'Biaya transaksi',
	WITHDRAWALS_FORM_FEE_FIAT_LABEL: 'Bank withdrawal fee',
	WITHDRAWALS_FORM_FEE_PLACEHOLDER:
		'Type the amount of {0} you wish to use in the fee of the transaction',
	WITHDRAWALS_FORM_FEE_OPTIMAL_VALUE: 'Optimal fee: {0} {1}', // TODO {0} -> amount {1} -> currency name
	DEPOSITS_FORM_AMOUNT_LABEL: '{0} amount to deposit',
	DEPOSITS_FORM_AMOUNT_PLACEHOLDER:
		'Type the amount of {0} you wish to withdraw',
	DEPOSITS_BUTTON_TEXT: 'review deposit',
	DEPOSIT_PROCEED_PAYMENT: 'Pay',
	DEPOSIT_BANK_REFERENCE:
		'Add this "{0}" code to the bank transation to identify the deposit',
	DEPOSIT_METHOD: 'Metode Pembayaran {0}',
	DEPOSIT_METHOD_DIRECT_PAYMENT: 'Kartu kredit',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_1:
		'Lanjutkan dengan metode pembayaran kartu kredit.',
	DEPOSIT_METHOD_DIRECT_PAYMENT_MESSAGE_2:
		'Anda akan keluar dari platform ini untuk melakukan pembayaran.',
	DEPOSIT_VERIFICATION_WAITING_TITLE:
		'Sedang dalam proses verifikasi pembayaran',
	DEPOSIT_VERIFICATION_WAITING_MESSAGE:
		'Jangan tutup aplikasi apabila sedang dalam proses verifikasi pembayaran',
	DEPOSIT_VERIFICATION_WARNING_MESSAGE:
		'Jika terjadi masalah dalam proses verifikasi, silakan hubungi kami.',
	DEPOSIT_VERIFICATION_WARNING_INFORMATION:
		'This is the ID of the operation: "{0}", please provide us this ID to help you.',
	DEPOSIT_VERIFICATION_SUCCESS: 'Pembayaran telah diverifikasi',
	DEPOSIT_VERIFICATION_ERROR: 'Terjadi kesalahan saat memverifikasi deposit.',
	DEPOSIT_VERIFICATION_ERROR_VERIFIED: 'Deposit telah diverifikasi',
	DEPOSIT_VERIFICATION_ERROR_STATUS: 'Status tidak valid',
	DEPOSIT_VERIFICATION_ERROR_USER_MATCH:
		'Kartu yang digunakan untuk deposit berbeda dengan kartu yang Anda daftarkan. Oleh karena itu, deposit Anda dibatalkan dan dana Anda akan dikembalikan dalam satu jam.',
	QUOTE_MESSAGE: 'You are going to {0} {1} {2} for {3} {4}',
	QUOTE_BUTTON: 'Accept',
	QUOTE_REVIEW: 'Review',
	QUOTE_COUNTDOWN_MESSAGE: 'You have {0} seconds to perform the trade',
	QUOTE_EXPIRED_TOKEN: 'The quote token has expired.',
	QUOTE_SUCCESS_REVIEW_TITLE: 'Quick Trade',
	QUOTE_SUCCESS_REVIEW_MESSAGE: 'You have successfully {0} {1} {2} for {3} {4}', // you have successfully buy 1 btc from x toman
	COUNTDOWN_ERROR_MESSAGE: 'Countdown is finished',
	WITHDRAW_PAGE: {
		BANK_TO_WITHDRAW: 'Bank to Withdraw to',
		MESSAGE_ABOUT_SEND: 'You are about to send',
		MESSAGE_BTC_WARNING:
			'Please ensure the accuracy of this address since {0} transfers are irreversible',
		MESSAGE_ABOUT_WITHDRAW: 'You are about to transfer to your bank account',
		MESSAGE_FEE: 'Transactions fee of {0} ({1}) included',
		MESSAGE_FEE_BASE: 'Transactions fee of {0} included',
		BASE_MESSAGE_1:
			'You can only withdraw to a bank account in a name that matches the name registered with your account.',
		BASE_MESSAGE_2: 'Withdrawal min amount',
		BASE_MESSAGE_3: 'Daily withdrawal max amount',
		BASE_INCREASE_LIMIT: 'Increase your daily limit',
		CONFIRM_VIA_EMAIL: 'Confirm via Email',
		CONFIRM_VIA_EMAIL_1: 'We have sent you a confirmation withdrawal email.',
		CONFIRM_VIA_EMAIL_2:
			'In order to complete the withdrawal process please confirm',
		CONFIRM_VIA_EMAIL_3: 'the withdrawal via your email within 5 minutes.',
		WITHDRAW_CONFIRM_SUCCESS_1:
			'Your withdrawal request is confirmed. It will be processed shortly.',
		WITHDRAW_CONFIRM_SUCCESS_2:
			'In order to view your withdrawal status please visit your withdrawal history page.',
		GO_WITHDRAWAL_HISTORY: 'Go To Withdrawal History',
	},
	WALLET_BUTTON_BASE_DEPOSIT: 'deposit',
	WALLET_BUTTON_BASE_WITHDRAW: 'Penarikan',
	WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT: 'Terima',
	WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW: 'Kirim',
	AVAILABLE_TEXT: 'Available',
	AVAILABLE_BALANCE_TEXT: 'Saldo {0} yang ttersedia: {1} {2}', // Available Bitcoin Balance: 2.6 BTC
	BALANCE_TEXT: 'Balance',
	CURRENCY_BALANCE_TEXT: '{0} Balance',
	WALLET_TABLE_AMOUNT_IN: `Amount in {0}`,
	WALLET_TABLE_TOTAL: 'Jumlah',
	WALLET_ALL_ASSETS: 'Semua Aset',
	HIDE_TEXT: 'Hide',
	PAGINATOR_FORMAT: '{0} / {1}',
	ORDERBOOK_SELLERS: 'Sellers',
	ORDERBOOK_BUYERS: 'Buyers',
	ORDERBOOK_SPREAD: '{0} spread', // 0 -> 660,000 T
	ORDERBOOK_SPREAD_PRICE: '{0} {1}', //// 0-> amount  1 -> symbol  600,000 T
	CALCULATE_MAX: 'Max',
	DATEFIELD_TOOGLE_DATE_GR: 'Gregorian calendar',
	VERIFICATION_WARNING_TITLE: 'Verification you bank details',
	VERIFICATION_WARNING_MESSAGE:
		'Before you withdraw, you need to verify your bank details.',
	ORDER_SPENT: 'Spent',
	ORDER_RECEIVED: 'Received',
	ORDER_SOLD: 'Sold',
	ORDER_BOUGHT: 'Bought',
	ORDER_AVERAGE_PRICE: 'Average price',
	ORDER_TITLE_CREATED: 'Successfully created a limit {0}', // 0 -> buy / sell
	ORDER_TITLE_FULLY_FILLED: '{0} order successfully filled', // 0 -> buy / sell
	ORDER_TITLE_PARTIALLY_FILLED: '{0} order partially filled', // 0 -> buy / sell
	ORDER_TITLE_TRADE_COMPLETE: '{0} {1} order was successful', // 0 -> buy / sell
	LOGOUT_TITLE: 'You have been logged out',
	LOGOUT_ERROR_TOKEN_EXPIRED: 'Token is expired',
	LOGOUT_ERROR_LOGIN_AGAIN: 'Login again', // ip doesnt match
	LOGOUT_ERROR_INVALID_TOKEN: 'Invalid token',
	LOGOUT_ERROR_INACTIVE:
		'You have been logged out because you have been inactive',
	ORDER_ENTRY_BUTTON: '{0} {1}', // 0 -> buy/sell 1 -> btc/..
	QUICK_TRADE_OUT_OF_LIMITS: 'Order size is out of the limits',
	QUICK_TRADE_TOKEN_USED: 'Token has been used',
	QUICK_TRADE_QUOTE_EXPIRED: 'Quote has expired',
	QUICK_TRADE_QUOTE_INVALID: 'Invalid quote',
	QUICK_TRADE_QUOTE_CALCULATING_ERROR: 'Error calculating the quote',
	QUICK_TRADE_ORDER_CAN_NOT_BE_FILLED:
		'The order with the current size can not be filled',
	QUICK_TRADE_ORDER_NOT_FILLED: 'Order is not filled',
	QUICK_TRADE_NO_BALANCE: 'Insufficient balance to perform the order',
	YES: 'Yes',
	NO: 'No',
	NEXT: 'Next',
	SKIP_FOR_NOW: 'Skip for now',
	SUBMIT: 'serahkan',
	RESUBMIT: 'Serahkan lagi',
	VERIFICATION_NOTIFICATION_SKIP_TITLE: 'Missing Documents!',
	VERIFICATION_NOTIFICATION_SKIP_TEXT:
		'To get full access to withdrawal and deposit functions you must submit your identity documents in your account page.',
	VERIFICATION_NOTIFICATION_SUCCESS_TITLE: 'Success!',
	VERIFICATION_NOTIFICATION_SUCCESS_TEXT:
		'You will receive an email notification when your information has been processed. Processing can typically take 1-3 days.',
	VERIFICATION_NOTIFICATION_BUTTON: 'PROCEED TO EXCHANGE',
	ERROR_USER_ALREADY_VERIFIED: 'User already verified',
	ERROR_INVALID_CARD_USER: 'Bank or card information provided is incorrect',
	ERROR_INVALID_CARD_NUMBER: 'Invalid Card number',
	ERROR_LOGIN_USER_NOT_VERIFIED: 'User is not verified',
	ERROR_LOGIN_USER_NOT_ACTIVATED: 'User is not activated',
	ERROR_LOGIN_INVALID_CREDENTIALS: 'Credentials incorrect',
	SMS_SENT_TO: 'SMS sent to {0}', // TODO check msg
	SMS_ERROR_SENT_TO:
		'Error sending the SMS to {0}. Please refresh the page and try again.', // TODO check msg
	WITHDRAW_NOTIFICATION_TRANSACTION_ID: 'Transaction ID:', // TODO check msg
	CHECK_ORDER: 'Check and confirm your order',
	CHECK_ORDER_TYPE: '{0} {1}', // 0 -> maker/limit  1 -> sell/buy
	CONFIRM_TEXT: 'Confirm',
	GOTO_XHT_MARKET: 'Go to XHT market', // new
	INVALID_CAPTCHA: 'Invalid captcha',
	NO_FEE: 'N/A',
	SETTINGS_LANGUAGE_LABEL: 'Preferensi bahasa (Termasuk Email)',
	SETTINGS_LANGUAGE_OPTIONS: LANGUAGES,
	SETTINGS_ORDERPOPUP_LABEL: 'Display order confirmation popup',
	SETTINGS_ORDERPOPUP_OPTIONS: [
		{ value: false, label: 'NO' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: true, label: 'YES' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTINGS_THEME_LABEL: 'Tema Interface Pengguna', // TODO set right labels // ToDo
	SETTINGS_THEME_OPTIONS: [
		{ value: 'white', label: 'White' }, // DO NOT CHANGE value, ONLY TRANSLATE label
		{ value: 'dark', label: 'Dark' }, // DO NOT CHANGE value, ONLY TRANSLATE label
	],
	SETTING_BUTTON: 'simpan',
	STRING_WITH_PARENTHESIS: '{0} ({1})',
	VERIFICATION_NO_WITHDRAW_TITLE: 'Penarikan diaktifkan',
	VERIFICATION_NO_WITHDRAW_MESSAGE: 'Penarikan untuk akun Anda diaktifkan',
	UP_TO_MARKET: 'Up to market',
	VIEW_MY_FEES: 'View my fees', // new
	DEVELOPER_SECTION: {
		TITLE: 'Kunci API',
		INFORMATION_TEXT:
			'API menyediakan fungsionalitas seperti mendapatkan saldo dompet, mengelola pesanan jual/beli, meminta penarikan dan data pasar seperti perdagangan terkini, order book dan ticker.',
		ERROR_INACTIVE_OTP:
			'Untuk membuat kunci API, autentikasi 2-faktor Anda perlu diaktifkan terlebih dahulu.',
		ENABLE_2FA: 'Aktifkan 2FA',
		WARNING_TEXT: 'Jangan berbagi kunci API Anda dengan siapa pun.',
		GENERATE_KEY: 'Buat Kunci API',
		ACTIVE: 'Aktifkan',
		INACTIVE: 'Nonaktifkan',
		INVALID_LEVEL:
			'Untuk mengakses fitur tersebut, Anda harus meningkatkan level verifikasi', // TODO
	},
	DEVELOPERS_TOKENS_POPUP: {
		GENERATE_TITLE: 'Buat Kunci API',
		GENERATE_TEXT:
			'Silakan namai kunci API Anda dan jaga kerahasiaan setelah dibuat. Anda tidak bisa mendapatkan kembali kunci API lagi.',
		GENERATE: 'Buat',
		DELETE_TITLE: 'Hapus Kunci API',
		DELETE_TEXT:
			'Anda tidak dapat membalikkan Kunci API yang telah dihapus walaupuan Anda dapat membuat yang baru kapan saja. Apakah Anda ingin hapus kunci API?',
		DELETE: 'DELETE',
		FORM_NAME_LABEL: 'Nama',
		FORM_LABLE_PLACEHOLDER: 'Nama Kunci Api',
		API_KEY_LABEL: 'Kunci API',
		SECRET_KEY_LABEL: 'Kunci RAHASIA',
		CREATED_TITLE: 'Mengkopi Kunci API',
		CREATED_TEXT_1:
			'Harap mengkopi kunci API Anda. Anda tidak bisa mengkonfirmasinya lagi .',
		CREATED_TEXT_2: 'Jaga kerahasiaan kunci Anda.',
	},
	DEVELOPERS_TOKENS_TABLE: {
		NAME: 'Nama',
		API_KEY: 'Kunci API',
		SECRET: 'Rahasia',
		CREATED: 'Tanggal Dibuat',
		REVOKE: 'Batalkan',
		REVOKED: 'Telah dibatalkan',
		REVOKE_TOOLTIP:
			'Untuk membatalkan token, Anda harus mengaktifkan 2FA terlebih dahulu', // TODO
	},
	CHAT: {
		CHAT_TEXT: 'chat',
		MARKET_CHAT: 'Market Chat',
		CHAT_UNREAD: '{0} ({1})', // 0 -> CHAT_TEXT, 1 -> number
		READ_MORE: 'Baca Lebih Banyak',
		SHOW_IMAGE: 'Tampilkan Gambar',
		HIDE_IMAGE: 'Sembunyikan Gambar',
		CHAT_MESSAGE_BOX_PLACEHOLDER: 'Pesan',
		SIGN_UP_CHAT: 'Daftar Untuk Chat',
		JOIN_CHAT: 'Atur Nama Pengguna Untuk Chat',
		TROLLBOX: 'Trollbox ({0})', // new
	},
	INVALID_USERNAME:
		'Nama pengguna harus lebih dari 3 karakter hingga 15 karakter. Dapat berisi hanya huruf kecil, angka dan garis bawah',
	USERNAME_TAKEN: 'Nama pengguna ini sudah ada. Coba masukkan yang lain.',
	USERNAME_LABEL: 'Nama pengguna (untuk chat)',
	USERNAME_PLACEHOLDER: 'Nama pengguna',
	TAB_USERNAME: 'Nama pengguna',
	USERNAME_WARNING:
		'Anda dapat mengubah nama pengguna sekali. Pastikan Anda membuat nama pengguna yang Anda inginkan.',
	USERNAME_CANNOT_BE_CHANGED: 'Nama pengguna tidak dapat diubah',
	UPGRADE_LEVEL: 'Tingkatkan level akun',
	LEVELS: {
		LABEL_LEVEL: 'Level',
		LABEL_LEVEL_1: 'One',
		LABEL_LEVEL_2: 'Two',
		LABEL_LEVEL_3: 'Three',
		LABEL_MAKER_FEE: 'Maker Fee',
		LABEL_TAKER_FEE: 'Taker Fee',
		LABEL_BASE_DEPOSIT: 'Deposit Euro Harian',
		LABEL_BASE_WITHDRAWAL: 'Penarikan Euro Harian',
		LABEL_BTC_DEPOSIT: 'Deposit Bitcoin Harian',
		LABEL_BTC_WITHDRAWAL: 'Penarikan Bitcoin Harian',
		LABEL_ETH_DEPOSIT: 'Deposit Ethereum Harian',
		LABEL_ETH_WITHDRAWAL: 'Penarikan Ethereum Harian',
		LABEL_PAIR_MAKER_FEE: '{0} Maker Fee',
		LABEL_PAIR_TAKER_FEE: '{0} Taker Fee',
		UNLIMITED: 'Tidak terbatas',
		BLOCKED: 'Disabled',
	},
	WALLET_ADDRESS_TITLE: 'Buat Dompet {0}',
	WALLET_ADDRESS_GENERATE: 'Buat',
	WALLET_ADDRESS_MESSAGE:
		'Anda dapat membuat alamat deposit dan penarikan setelah membuat dompet.',
	WALLET_ADDRESS_ERROR:
		'Terjadi kesalahan saat membuat alamat. Silakan muat ulang dan coba lagi.',
	DEPOSIT_WITHDRAW: 'Deposit/Penarikan',
	GENERATE_WALLET: 'Buat Dompet',
	TRADE_TAB_CHART: 'Grafik',
	TRADE_TAB_TRADE: 'Perdagangan',
	TRADE_TAB_ORDERS: 'Pesan',
	TRADE_TAB_POSTS: 'Posts', // new
	WALLET_TAB_WALLET: 'Dompet',
	WALLET_TAB_TRANSACTIONS: 'Transaksictions',
	RECEIVE_CURRENCY: 'Terima {0}',
	SEND_CURRENCY: 'Kirim {0}',
	COPY_ADDRESS: 'Salin Alamat',
	SUCCESFUL_COPY: 'Berhasil Disalin!',
	QUICK_TRADE_MODE: 'Mode Berdagang Cepat',
	JUST_NOW: 'just now',
	PAIR: 'Pair',
	ZERO_ASSET: 'Anda tidak memiliki aset',
	DEPOSIT_ASSETS: 'Deposit Aset',
	SEARCH_TXT: 'Cari',
	SEARCH_ASSETS: 'Cari Aset',
	TOTAL_ASSETS_VALUE: 'Jumlah nilai aset di {0}: {1}',
	SUMMARY: {
		TITLE: 'Ringkasan',
		TINY_PINK_SHRIMP_TRADER: 'Tiny Pink Shrimp Trader',
		TINY_PINK_SHRIMP_TRADER_ACCOUNT: 'Tiny Pink Shrimp Trader Account',
		LITTLE_RED_SNAPPER_TRADER: 'Little Red Snapper Trader',
		LITTLE_RED_SNAPPER_TRADER_ACCOUNT: 'Little Red Snapper Trader Account',
		CUNNING_BLUE_KRAKEN_TRADING: 'Cunning Blue Kraken Trading',
		CUNNING_BLUE_KRAKEN_TRADING_ACCOUNT: 'Cunning Blue Kraken Trading Account',
		BLACK_LEVIATHAN_TRADING: 'Black Leviathan Trading',
		BLACK_LEVIATHAN_TRADING_ACCOUNT: 'Black Leviathan Trading Account',
		URGENT_REQUIREMENTS: 'Urgent Requirements',
		TRADING_VOLUME: 'Trading Volume',
		ACCOUNT_ASSETS: 'Aset Akun',
		ACCOUNT_DETAILS: 'Account Details',
		SHRIMP_ACCOUNT_TXT_1: 'Your journey begins here!',
		SHRIMP_ACCOUNT_TXT_2:
			'Keep swimming true, you’ll soon stand out from the rest of the shoal',
		SNAPPER_ACCOUNT_TXT_1:
			'Congrats on staying your course through the swell of the market.',
		SNAPPER_ACCOUNT_TXT_2:
			'Forge through and fight the surge for more crypto treasures ahead.',
		KRAKEN_ACCOUNT_TXT_1:
			'Likelier to crack jokes than hulls, this crustacean has weathered his share of storms!',
		LEVIATHAN_ACCOUNT_TXT_1:
			'Beast from the abyss, seeing through altcoins into unfathomable depths, masters of midnight waters and tidal wave.',
		VIEW_FEE_STRUCTURE: 'Lihat Struktur Biaya dan Batas',
		UPGRADE_ACCOUNT: 'Upgrade Akun',
		ACTIVE_2FA_SECURITY: 'Aktifkan Keamanan 2FA',
		ACCOUNT_ASSETS_TXT_1: 'Tunjukkan ringkasan semua aset Anda.',
		ACCOUNT_ASSETS_TXT_2:
			'Jika Anda memiliki aset dalam jumlah besar, Anda dapat mengupgrade akun Anda dan mendapatkan lencana unik dan biaya perdagangan yang lebih rendah.',
		TRADING_VOLUME_TXT_1:
			'Jumlah volume perdagangan Anda ditampilkan di {0} dan dihitung secara nominal pada setiap akhir bulan dari semua pasangan perdagangan.',
		TRADING_VOLUME_TXT_2:
			'Aktivitas perdagangan tinggi akan mengupgrade akun Anda dan menghadiahkan Anda dengan lencana unik dan hadiah lain.',
		ACCOUNT_DETAILS_TXT_1:
			'Lencana akun, biaya perdagangan dan batas deposit, penarikan akan ditentukan berdasarkan jenis akun Anda.',
		ACCOUNT_DETAILS_TXT_2:
			'Lamanya akun perdagangan Anda, level aktivitas dan jumlah aset dimiliki akun akan menentukan apakah akun Anda memenuhi syarat untuk upgrade.',
		ACCOUNT_DETAILS_TXT_3:
			'Untuk mempertahankan level akun, Anda perlu melakukan perdagangan terus-menerus dan sejumlah aset yang disimpan.',
		ACCOUNT_DETAILS_TXT_4:
			'Penurunan akun secara berkala akan terjadi jika aktivitas dan aset tidak dipertahankan.',
		REQUIREMENTS: 'Persyaratan',
		ONE_REQUIREMENT: 'Hanya satu persyaratan:', // new
		REQUEST_ACCOUNT_UPGRADE: 'Permintaan Upgrade Akun',
		FEES_AND_LIMIT: 'Struktur Biaya & Batas {0}', // new
		FEES_AND_LIMIT_TXT_1:
			'Menjadi pedagang kripto menandai permulaan baru. Akun Anda akan diupgrade dengan melakukan perdagangan berbekal kecerdasan, kemauan, dan kecepatan dengan mengambil risiko.',
		FEES_AND_LIMIT_TXT_2:
			'Setiap akun memiliki biaya dan batas deposit dan penarikan sendiri yang berbeda.',
		DEPOSIT_WITHDRAWAL_ALLOWENCE: 'Batas deposit & penarikan',
		TRADING_FEE_STRUCTURE: 'Struktur biaya perdagangan',
		WITHDRAWAL: 'Penarikan',
		DEPOSIT: 'Deposit',
		TAKER: 'Taker',
		MAKER: 'Maker',
		WEBSITE: 'situs web',
		VIP_TRADER_ACCOUNT_ELIGIBLITY: 'Persyaratan Peningkatan Akun Pedagang VIP',
		PRO_TRADER_ACCOUNT_ELIGIBLITY: 'Persyaratan Peningkatan Akun Pedagang Pro',
		TRADER_ACCOUNT_ELIGIBILITY: 'Persyaratan Peningkatan Akun Level {0}',
		NOMINAL_TRADING: 'Perdagangan Nominal',
		NOMINAL_TRADING_WITH_MONTH: 'Perdagangan Nominal {0} Lalu',
		ACCOUNT_AGE_OF_MONTHS: 'Lama Akun {0} Bulan',
		TRADING_VOLUME_EQUIVALENT: 'Volume Perdagangan Setara {0} {1}',
		LEVEL_OF_ACCOUNT: 'Akun Level {0}',
		LEVEL_TXT_DEFAULT: 'Tambahkan deskripsi level Akun di sini',
		LEVEL_1_TXT:
			'Perjalanan Anda sebagai pedagang kripto dimulai di sini! Untuk mendapatkan bonus, Anda dapat memberifikasi identitas Anda dan dapatkan batas deposit dan penarikan lebih tinggi dengan biaya perdagangan lebih rendah.', // new
		LEVEL_2_TXT:
			'Berdagang senilai lebih dari $3.000 USDT bulanan atau memiliki saldo melebihi 5.000 XHT dan nikmati biaya perdagangan lebih rendah.', // new
		LEVEL_3_TXT:
			'Di sinilah segalanya menjadi nyata! Nikmati biaya perdagangan lebih rendah dan batas deposit dan penarikan lebih tinggi. Untuk mencapai level 3, Anda perlu menyelesaikan veriﬁkasi', // new
		LEVEL_4_TXT:
			'Berdagang senilai lebih dari $10.000 USDT bulanan atau memiliki saldo melebihi 10.000 XHT dan nikmati biaya perdagangan lebih rendah.', // new
		LEVEL_5_TXT:
			'Anda telah berhasil! Akun level 5 sangat unik, hanya untuk operator bursa, pengguna Vault atau Program Afiliasi HollaeX(HAP). Nikmati batas tinggi dan biaya maker kosong.', // new
		LEVEL_6_TXT:
			'Berdagang senilai lebih dari $300.000 USDT bulanan atau memiliki saldo melebihi 100.000 XHT dan nikmati biaya perdagangan lebih rendah. Batas penarikan ditingkatkan.', // new
		LEVEL_7_TXT:
			'Berdagang senilai lebih dari $500.000 USDT bulanan atau memiliki saldo melebihi 300.000 XHT dan nikmati biaya perdagangan lebih rendah. Batas penarikan ditingkatkan.', // new
		LEVEL_8_TXT:
			'Berdagang senilai lebih dari $600.000 USDT bulanan atau memiliki saldo melebihi 400.000 XHT dan nikmati biaya perdagangan lebih rendah.', // new
		LEVEL_9_TXT:
			'Berdagang senilai lebih dari $2.000.000 USDT bulanan atau memiliki saldo melebihi 1.000.000 XHT dan nikmati biaya perdagangan lebih rendah.', // new
		LEVEL_10_TXT:
			'Akun whale trader akan menguntungkan Anda dengan market making. Untuk mendapatkan akun spesial ini, silakan hubungi kami.', // new
		CURRENT_TXT: 'Saat ini',
		TRADER_ACCOUNT_XHT_TEXT:
			'Akun Anda sedang dalam periode pra-penjualan XHT, artinya Anda dapat mendapatkan XHT seharga $0,10 per XHT. Semua deposit akan dikonversi ke XHT setelah transaksi selesai.',
		TRADER_ACCOUNT_TITLE: 'Akun - Periode Pra-penjualan', // new
		HAP_ACCOUNT: 'Akun HAP', // new
		HAP_ACCOUNT_TXT:
			'Akun Anda adalah akun terverifikasi dengan program afiliasi HollaeX. Anda dapat mendapatkan bonus sebesar 10% untuk setiap orang yang membeli XHT dan diundang oleh Anda.', // new
		EMAIL_VERIFICATION: 'Verifikasi Email', // new
		DOCUMENTS: 'Documen', // new
		HAP_TEXT: 'Program Afiliasi HollaeX (HAP) {0}', // new
		LOCK_AN_EXCHANGE: 'Mengunci Bursa {0}', // new
		WALLET_SUBSCRIPTION_USERS: 'Pengguna langganan Vault {0}', // new
		TRADE_OVER_XHT: 'Perdagangan senilai melebihi {0} USDT', // new
		TRADE_OVER_BTC: 'Perdagangan senilai melebihi {0} BTC', // new
		XHT_IN_WALLET: '{0} XHT dalam dompet', // new
		REWARDS_BONUS: 'Hadiah dan Bonus', // new
		COMPLETE_TASK_DESC:
			'Selesaikan tugas dan dapatkan bonus senilai lebih dari $10.000.', // new
		TASKS: 'Tugas', // new
		MAKE_FIRST_DEPOSIT: 'Lakukan deposit pertama dan terima 1 XHT', // new
		BUY_FIRST_XHT: 'Beli XHT Anda pertama dan dapatkan bonus sebesar 5 XHT', // new
		COMPLETE_ACC_VERIFICATION:
			'Selesaikan verifikasi akun dan dapatkan bonus sebesar 20 XHT', // new
		INVITE_USER: 'Undang pengguna lain dan nikmati komisi dari perdagangannya', // new
		JOIN_HAP:
			'Bergabunglah HAP dan dapatkan 10% untuk setiap HollaeX Kit yang Anda jual', // new
		EARN_RUNNING_EXCHANGE:
			'Hasilkan penghasilan pasif untuk menjalankan bursa Anda sendiri', // new
		XHT_WAVE_AUCTION: 'Data Wave Auction XHT', // new
		XHT_WAVE_DESC_1:
			'Distribusi token HollaeX(XHT) akan dilakukan melalui Wave Auction.', // new
		XHT_WAVE_DESC_2:
			'Wave Auction menjual XHT dalam jumlah acak pada waktu yang ditentukan secara acak kepada penawar tertinggi di orderbook', // new
		XHT_WAVE_DESC_3: 'Di bawah ini menampilkan data historis Wave Auction', // new
		WAVE_AUCTION_PHASE: 'Wave Auction Tahap {0}', // new
		LEARN_MORE_WAVE_AUCTION: 'Pelajari lebih lanjut tentang Wave Auction', // new
		WAVE_NUMBER: 'Nomor Wave', // new
		DISCOUNT: '( diskon {0}% )', // new
		MY_FEES_LIMITS: 'Biaya dan Batas Saya', // new
	},
	REFERRAL_LINK: {
		TITLE: 'Undang teman Anda', // new
		INFO_TEXT:
			'Referensikan teman Anda dengan memberikan tautan ini dan dapatkan keuntungan dari onboardingnya.',
		COPY_FIELD_LABEL:
			'Bagikan tautan di bawah dengan teman Anda dan dapatkan komisi:', // new
		REFERRED_USER_COUT: 'Anda telah mereferensikan {0} pengguna', // new
		COPY_LINK_BUTTON: 'MENGKOPI TAUTAN REFERRAL', // new
		XHT_TITLE: 'REFERRAL ANDA', // new
		XHT_INFO_TEXT: 'Dapatkan komisi dengan mengundang teman.', // new
		XHT_INFO_TEXT_1: 'Komisi dibayarkan secara berkala ke dompet Anda', // new
		APPLICATION_TXT:
			'Untuk menjadi distributor HollaeX Kit, silakan isi aplikasi.', // new
		TOTAL_REFERRAL: 'Total bought from referrals:', // new
		PENDING_REFERRAL: 'Commissions Pending:', // new
		EARN_REFERRAL: 'Commissions Earn:', // new
		XHT_COUNT: '{0} XHT', // new
		APPLY_BUTTON: 'APPLY', // new
	},
	STAKE_TOKEN: {
		TITLE: 'Stake HollaeX Token', // new
		INFO_TXT1:
			'Token HollaeX(XHT) perlu dijamin(distake) untuk menjalankan perangkat lunak bursa HollaeX Kit.', // new
		INFO_TXT2:
			'Anda dapat menjaminkan token HollaeX Anda dengan cara yang sama dan dapatkan XHT yang tidak dapat dijual selama Wave Auction.', // new
		INFO_TXT3:
			'Pergi ke dash.bitholla.com dan menjaminkan bursa Anda sendiri hari ini dan dapatkan XHT gratis', // new
		BUTTON_TXT: 'TEMUKAN LEBIH BANYAK LAGI', // new
	},
	TERMS_OF_SERVICES: {
		// new
		TITLE: 'Perjanjian Pembelian Token HollaeX',
		SERVICE_AGREEMENT: AGREEMENT,
		PROCEED: 'MEMPROSES',
		AGREE_TERMS_LABEL:
			'Saya telah membaca dan menyetujui Perjanjian Pembelian Token HollaeX',
		RISK_INVOLVED_LABEL: 'Saya memahami risiko yang terlibat',
		DOWNLOAD_PDF: 'Unduh PDF',
		DEPOSIT_FUNDS:
			'Deposit dana ke dompet Anda untuk mendapatkan Token HollaeX(XHT)',
		READ_FAG: 'Baca FAQ HollaeX di sini: {0}',
		READ_DOCUMENTATION: 'Baca buku putih HollaeX di sini: {0}',
		READ_WAVES: 'Aturan untuk Wave Aution Publik {0} pada Desember mendatang', // new
		DOWNLOAD_BUY_XHT:
			'Unduh PDF untuk melihat proses langkah demi langkah pada {0} visual',
		HOW_TO_BUY: 'bagaimana cara membeli Token HollaeX(XHT)',
		PUBLIC_SALES: 'Wave Auction Publik', // new
		CONTACT_US:
			'Jika ada masalah apa pun atau ingin mendapatkan informasi lebih lanjut, jangan ragu untuk hubungi kami lewat email {0}',
		VISUAL_STEP: 'Lihat proses langkah demi langkah pada {0} visual', // new
		WARNING_TXT:
			'Kami akan meninjau permintaan Anda dan mengirim instruksi lebih lanjut ke email Anda tentang cara mengakses bursa HollaeX.', // new
		WARNING_TXT1:
			'Sementara itu, Anda dapat membiasakan diri dengan jaringan HollaeX dengan sumber daya di bawah', // new
		XHT_ORDER_TXT_1: 'Untuk mulai perdagangan, harap masuk terlebih dahulu', // new
		XHT_ORDER_TXT_2: '', // new
		XHT_ORDER_TXT_3: '{0} atau {1}', // new
		XHT_TITLE: 'XHT', //new
		XHT_TRADE_TXT_1: 'Masuk untuk lihat perdagangan Anda terkini', //new
		XHT_TRADE_TXT_2: 'Anda dapat {0} untuk melihat riwayat perdagangan terkini', //new
		LOGIN_HERE: 'Masuk di sini',
	},
	WAVES: {
		// new
		TITLE: 'Wave Info',
		NEXT_WAVE: 'Next Wave',
		WAVE_AMOUNT: 'Amount in Wave',
		FLOOR: 'Floor',
		LAST_WAVE: 'Last wave',
	},
	TYPES_OF_POSTS: {
		// new
		TITLE: 'POSTS',
		ANNOUNCEMEN: 'Announcement',
		SYSTEM_UPDATE: 'System Update',
		LAST_WAVE: 'Last Wave',
		ANNOUNCEMENT_TXT: 'Free XHT will be distributed to all wallets that apply',
		SYSTEM_UPDATE_TIME: 'Time: 12:31 PM, December 19th, 2019	',
		SYSTEM_UPDATE_DURATION: '1 hour',
		LAST_WAVE_AMOUNT: '100, 213 XHT',
		LAST_WAVE_REDISTRIBUTED: ' 11, 211',
		LAST_WAVE_TIME: ' 12: 31 PM, December 19th, 2019',
	},
	USER_LEVEL: 'Level pengguna', // new
	LIMIT_AMOUNT: 'Jumlah batas', // new
	FEE_AMOUNT: 'Jumlah biaya', // new
	COINS: 'Koin', // new
	PAIRS: 'Pasangan', // new
	NOTE_FOR_EDIT_COIN:
		'Catatan: Untuk menambahkan dan mengecualikan {0}, silakan rujuk pada {1}.', // new
	REFER_DOCS_LINK: 'docs', // new
	RESTART_TO_APPLY:
		'Anda perlu memulai ulang bursa Anda untuk menerapkan perubahan ini.', // new
	TRIAL_EXCHANGE_MSG:
		'Anda menggunakan versi uji coba {0} dan masa berlakunya akan habis dalam {1} hari.', // new
	EXPIRY_EXCHANGE_MSG:
		'Bursa Anda sudah kedaluwarsa. Pergi ke dash.bitholla.com untuk mengaktifkan ulang.', // new
	EXPIRED_INFO_1: 'Uji coba Anda telah berakhir.', // new
	EXPIRED_INFO_2: 'Gadai bursa Anda untuk mengaktifkan ulang.', // new
	EXPIRED_BUTTON_TXT: 'AKTIFKAN BURSA', // new
	TRADE_POSTS: {
		// new
		ANNOUNCEMENT: 'Pengumuman',
		ANNOUNCEMNT_TXT_3:
			'Peluncuran publik dan Wave Auction dijadwalkan ulang menjadi tanggal 1 Januari 2020. Dompet deposit dan penarikan sekarang dibuka.',
		ANNOUNCEMNT_TXT_4:
			'Selamat tahun baru Hollaer. Kami membuat tanda baru mulai tahun 2020 dengan meluncurkan platform perdagangan terbuka dengan bantuan Anda semua.',
		ANNOUNCEMNT_TXT_1:
			'Dapatkan XHT dengan program HAP dengan memperkenalkan teman Anda ke bursa. {0}.',
		DEFAULT_ANNOUNCEMENT:
			'Bagian ini menampilkan pengumuman bursa publik Anda!',
		ANNOUNCEMENT_TXT_2:
			'XHT gratis akan didistribusikan ke semua dompet yang {0}.',
		LEARN_MORE: 'Pelajari lebih lanjut',
		APPLY_TODAY: 'Ajukan hari ini', // new
	},
	OPEN_WALLET: 'dompet terbuka', // new
	AGO: 'ago', // new
};
