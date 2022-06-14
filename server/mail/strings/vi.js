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

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	CONTACTFORM
};
