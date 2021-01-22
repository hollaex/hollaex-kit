const sql = `
DROP FUNCTION calculate_accumlated_withdrawals(user_id_to_check integer, check_currency CHAR);
DROP FUNCTION calculate_accumlated(user_id integer, currency CHAR);
DROP FUNCTION calculate_fiat_amount_with_fee(price DOUBLE precision, size DOUBLE precision, fee FLOAT);
DROP FUNCTION check_balance(user_id_to_check integer);
DROP FUNCTION get_limit_for_level(level INT, currency CHAR, type CHAR);
DROP FUNCTION calculate_btc_amount_with_fee(size DOUBLE precision, fee FLOAT);

`;

module.exports = sql;
