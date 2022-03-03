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

const ALERT = {
	TITLE: (title) => `CẢNH BÁO: ${title}`,
	BODY: {
		1: (type) => `Cảnh báo: ${type}`
	}
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
			`Quý khách vừa thực hiện yêu cầu rút ${amount} ${currency.toUpperCase()} tới địa chỉ ${address}. Yêu cầu rút tiền của quý khách đang ở trạng thái chờ xử lý và sẽ sớm được thực hiện.`,
		COMPLETED: (amount, currency, address = '') =>
			`Yêu cầu rút ${amount} ${currency.toUpperCase()} của quý khách đã được thực hiện và số tiền tương ứng đã được chuyển thành công tới địa chỉ ${address}.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Trạng thái: ${status}`,
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
