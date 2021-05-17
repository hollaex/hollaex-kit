'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `${name} thân mến`,
	CLOSING: {
		1: 'Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi.',
		2: () => ` Đội ngũ ${API_NAME()}`
	},
	IP_ADDRESS: (ip) => `Địa chỉ IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Yêu cầu được gửi đến từ: ${ip}`,
	TXID: (txid) => `ID giao dịch: ${txid}`,
	FEE: (fee) => `Phí: ${fee}`,
	AMOUNT: (amount) => `Số lượng: ${amount}`,
	ADDRESS: (address) => `Địa chỉ: ${address}`,
	TIME: (time) => `Thời gian: ${time}`,
	COUNTRY: (country) => `Quốc gia: ${country}`,
	DEVICE: (device) => `Thiết bị: ${device}`,
	MESSAGE: (message) => `Tin nhắn: ${message}`,
	ERROR_REQUEST:
		'Trong trường hợp không mong muốn thay đổi nêu trên, hãy bỏ qua tin nhắn này. Chúng tôi sẽ không thực hiện bất kỳ thay đổi nào trên tài khoản của quý khách.',
	EXPLORER:
		'Quý khách có thể xác nhận tình trạng của giao dịch trên blockchain thông qua những Block Explorers này:',
	DEPOSIT: 'Nạp tiền',
	WITHDRAWAL: 'Rút tiền'
};

const FOOTER = {
	FOLLOW_US: 'Theo dõi chúng tôi tại',
	NEED_HELP: 'Hãy liên hệ tới địa chỉ thư này nếu quý khách cần giúp đỡ.',
	PRIVACY_POLICY: 'Chính sách bảo mật',
	TERMS: 'Điều khoản và Điều kiện sử dụng',
	INVITE_YOUR_FRIENDS: 'Mời bạn',
	POWERED_BY: 'Powered by'
};

const SIGNUP = {
	TITLE: 'Đăng ký',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Quý khách cần xác nhận địa chỉ email bằng cách nhấn vào nút bên dưới.
		Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi bằng cách hồi đáp lại thư này.`,
		2: 'Vui lòng nhấn vào nút bên dưới để hoàn tất thủ tục đăng ký.',
		3: 'Xác nhận'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: 'Chào mừng quý khách',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: () => `Cảm ơn quý khách đã đăng ký thành viên tại ${API_NAME()}.`,
		2: (account, deposit) => `
		Để giao dịch, trước tiên quý khách cần nạp tiền điện tử hoặc tiền mặt vào tài khoản.
		Vui lòng truy cập vào ${account} và chuyển tới mục ${deposit}.`,
		3: 'Tài khoản',
		4: 'Nạp tiền',
		5: 'Hãy hồi đáp lại thư này này nếu quý khách có bất kỳ câu hỏi hoặc mối bận tâm nào.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Đăng nhập',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Chúng tôi ghi nhận lịch sử đăng nhập vào tài khoản của quý khách với chi tiết như sau',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'Nếu đây không phải là quý khách, hãy thay đổi mật khẩu, cài đặt bảo mật Xác thực 2 yếu tố cho tài khoản và liên hệ với chúng tôi ngay lập tức.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Yêu cầu đặt lại mật khẩu',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Quý khách vừa thực hiện yêu cầu đặt lại mật khẩu cho tài khoản của mình.',
		2: 'Để cập nhật mật khẩu, vui lòng nhấn vào liên kết phía dưới.',
		3: 'Đặt lại mật khẩu',
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
			`Một giao dịch nạp ${amount} ${currency.toUpperCase()} vào địa chỉ ví ${API_NAME()} của quý khách đang chờ được xử lý. Vui lòng chờ đợi cho đến khi giao dịch được xác nhận và tiền được nạp vào ví của quý khách.${confirmation ? ` Yêu cầu giao dịch của quý khách cần nhận được ${confirmation} kết quả đồng thuận trên blockchain.` : ''}`,
		COMPLETED: (amount, confirmation, currency) =>
			`Giao dịch nạp ${
				currency.toUpperCase()
			} với số lượng ${amount} ${currency.toUpperCase()} đã được xác nhận và hoàn tất thành công. Số tiền đã được cập nhập vào ví ${
				currency.toUpperCase()
			} của quý khách.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Trạng thái: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Tài khoản đã được xác thực',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Chúc mừng. Tài khoản của quý khách đã được xác thực thành công.',
		2: 'Giao dịch ngay bây giờ'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: 'Tài khoản đã được nâng cấp',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`Chúc mừng. Tài khoản của quý khách đã được nâng cấp lên cấp bậc ${level}. Quý khách sẽ nhận được nhiều ưu đãi như phí giao dịch rẻ hơn, hạn mức rút tiền cao hơn và các phần thưởng khác.`,
		2: 'Giao dịch ngay bây giờ'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${currency.toUpperCase()} ${
			COMMON[type.toUpperCase()]
		} bị từ chối`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`Chúng tôi không thể xác định và thực hiện yêu cầu nạp ${currency.toUpperCase()} với số lượng ${amount} được thực hiện vào ${date} của quý khách. Chính vì vậy, giao dịch đã bị từ chối bởi hệ thống của chúng tôi.`,
		WITHDRAWAL: (currency, date, amount) =>
			`Chúng tôi không thể xác định và thực hiện yêu cầu rút ${currency.toUpperCase()} với số lượng ${amount} được thực hiện vào ${date} của quý khách. Chính vì vậy, giao dịch đã bị từ chối bởi hệ thống của chúng tôi và số tiền tương ứng đã được hoàn lại vào ví ${API_NAME()} của quý khách.`,
		1: 'Hãy hồi đáp lại thư này nếu quý khách có thêm bất kỳ yêu cầu nào khác',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: 'Trạng thái: Bị từ chối'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, currency, address = '') =>
			`Quý khách vừa thực hiện yêu cầu rút ${amount} ${currency.toUpperCase()} tới địa chỉ ${address}. Yêu cầu rút tiền của quý khách đang ở trạng thái chờ xử lý và sẽ sớm được thực hiện.`,
		COMPLETED: (amount, currency, address = '') =>
			`Yêu cầu rút ${amount} ${currency.toUpperCase()} của quý khách đã được thực hiện và số tiền tương ứng đã được chuyển thành công tới địa chỉ ${address}.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Trạng thái: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`Yêu cầu ${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`Quý khách vừa thực hiện yêu cầu rút ${currency.toUpperCase()} với số lượng ${amount} tới ${address}`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `Địa chỉ: ${address}`,
		5: (network) => `Network: ${network}`,
		6: 'Để xác nhận yêu cầu rút tiền này, vui lòng nhấn vào nút bên dưới.',
		7: 'Xác nhận',
		8: COMMON.ERROR_REQUEST,
		9: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const INVALIDADDRESS = {
	TITLE: 'Địa chỉ rút tiền không hợp lệ',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount) => `Yêu cầu rút ${currency} với số lượng ${amount} của quý khách đã được gửi tới một địa chỉ không hợp lệ và bị từ chối.`,
		2: (address) => `Địa chỉ: ${address}`
	},
	CLOSING: COMMON.CLOSING
};

const ALERT = {
	TITLE: (title) => `CẢNH BÁO: ${title}`,
	BODY: {
		1: (type) => `Cảnh báo: ${type}`
	}
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id'
			? 'Thủ tục xác thực ID bị từ chối'
			: 'Thủ tục đăng ký ngân hàng mới bị từ chối',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? 'Thủ tục xác thực ID của quý khách đã được tiếp nhận nhưng rất tiếc đã bị từ chối. Vui lòng tham khảo các hạng mục dưới đây để thực hiện các biện pháp tiếp theo:'
				: 'Thủ tục đăng ký ngân hàng mới của quý khách đã được tiếp nhận nhưng rất tiếc đã bị từ chối. Vui lòng tham khảo các hạng mục dưới đây để thực hiện các biện pháp tiếp theo:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const USERDEACTIVATED = {
	TITLE: (type) => `Tài khoản ${type}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		ACTIVATED: (email) => `Tài khoản ${email} của quý khách đã được kích hoạt. Giờ đây, quý khách đã có thể sử dụng tài khoản của mình.`,
		DEACTIVATED: (email) => `Tài khoản ${email} của quý khách đã bị vô hiệu hóa. Quý khách sẽ không thể sử dụng tài khoản của mình cho đến khi nó được kích hoạt bởi người quản lý của sàn giao dịch.`
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: 'Đơn liên hệ',
	BODY: {
		1: 'Dữ liệu đơn liên hệ',
		2: (email) =>
			`Khách hàng có địa chỉ email ${email} vừa gửi đến một đơn liên hệ.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: 'Xác thực người dùng',
	BODY: {
		1: 'Đã yêu cầu xác thực người dùng',
		2: (email) =>
			`Khách hàng có địa chỉ email "${email}" đã tải lên hồ sơ để yêu cầu xác thực. Vui lòng xác thực hồ sơ của người dùng này.`
	}
};

const SUSPICIOUSDEPOSIT = {
	TITLE: 'Giao dịch nạp tiền đáng ngờ',
	BODY: {
		1: 'Giao dịch nạp tiền đáng ngờ',
		2: (email, currency) =>
			`Khách hàng có địa chỉ email ${email} đã nhận được một giao dịch nạp ${currency.toUpperCase()} đáng ngờ.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Dữ liệu giao dịch:',
		5: (data) => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Mã xác nhận của quý khách ${code}`
	,
	deposit: (currency, amount) =>
		`Giao dịch nạp ${currency.toUpperCase()} với số lượng ${amount} của quý khách đã được xác nhận và số tiền tương ứng đã được nạp vào ví của quý khách`
	,
	withdrawal: (currency, amount) =>
		`Giao dịch rút ${currency.toUpperCase()} với số lượng ${amount} của quý khách đã được xác nhận`
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
