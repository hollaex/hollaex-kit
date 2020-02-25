const { PAIRS } = require('../../constants');

let cases = '';
Object.keys(PAIRS).forEach((pair, i) => {
	const base = PAIRS[pair].pair_base;
	const quote = PAIRS[pair].pair_2;

	if (i === 0) {
		cases += 'IF ';
	} else {
		cases += 'ELSEIF ';
	}
	cases += `NEW.symbol = '${pair}' THEN
    UPDATE "Balances"
    SET
      ${base}_balance = round((${base}_balance + user_buy_base_amount)::numeric, 8),
      ${quote}_balance = round((${quote}_balance - user_buy_base_paid_amount)::numeric, 8),
      updated_at = current_timestamp
    WHERE user_id = user_buy_base;
    UPDATE "Balances"
    SET
      ${base}_balance = round((${base}_balance - user_sell_base_amount)::numeric, 8),
      ${quote}_balance = round((${quote}_balance + user_sell_base_paid_amount)::numeric, 8),
      updated_at = current_timestamp
    WHERE user_id = user_sell_base;

    UPDATE "Balances" AS b
    SET ${base}_balance = round((${base}_balance + user_sell_base_amount - user_buy_base_amount)::numeric, 8),
        ${quote}_balance = round((${quote}_balance + user_buy_base_paid_amount - user_sell_base_paid_amount)::numeric, 8)
    FROM "Users" AS u
    WHERE u.id = 1 AND
      u.id = b.user_id;\n`;

	if (i === Object.keys(PAIRS).length - 1) {
		cases += 'END IF;';
	}
});

const sql = `
CREATE OR REPLACE FUNCTION update_balance_after_trade()
RETURNS TRIGGER AS $update_balance_after_trade$
DECLARE
  user_sell_base INT = 0;
  user_sell_base_paid_amount DOUBLE precision = 0;
  user_sell_base_amount DOUBLE precision = 0;
  user_buy_base INT = 0;
  user_buy_base_paid_amount DOUBLE precision = 0;
  user_buy_base_amount DOUBLE precision = 0;
BEGIN
  user_sell_base_amount= NEW.size;
  user_buy_base_amount= NEW.size;

  IF NEW.quick = TRUE THEN
    user_sell_base_paid_amount = NEW.price;
    user_buy_base_paid_amount = NEW.price;
  ELSE
    user_sell_base_paid_amount = 0;
    user_buy_base_paid_amount = 0;
  END IF;

  IF NEW.side = 'sell' THEN
    BEGIN
      user_sell_base = NEW.taker_id;
      user_buy_base = NEW.maker_id;

      IF NEW.quick = FALSE THEN
        SELECT calculate_amount_with_fee(NEW.price, NEW.size, NEW.taker_fee) INTO user_sell_base_paid_amount;
        SELECT calculate_amount_with_fee(NEW.price, NEW.size, 0) INTO user_buy_base_paid_amount;
        SELECT calculate_amount_with_fee(NEW.size, NEW.maker_fee) INTO user_buy_base_amount;
      END IF;
    END;
  ELSE
    BEGIN
      user_sell_base = NEW.maker_id;
      user_buy_base = NEW.taker_id;

      IF NEW.quick = FALSE THEN
        SELECT calculate_amount_with_fee(NEW.price, NEW.size, NEW.maker_fee) INTO user_sell_base_paid_amount;
        SELECT calculate_amount_with_fee(NEW.price, NEW.size, 0) INTO user_buy_base_paid_amount;
        SELECT calculate_amount_with_fee(NEW.size, NEW.taker_fee) INTO user_buy_base_amount;
      END IF;
    END;
  END IF;

  RAISE LOG 'SIDE: %. taker: %, taker_fee: %. maker: % maker_fee: %', NEW.side, NEW.taker_id, NEW.taker_fee, NEW.maker_id, NEW.maker_fee;

  ${cases}

  PERFORM check_balance(NEW.taker_id);
  PERFORM check_balance(NEW.maker_id);

  RETURN NEW;
END;
$update_balance_after_trade$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_trade
ON "Trades";

CREATE TRIGGER update_balance_after_trade
AFTER INSERT ON "Trades"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_trade();
`;

module.exports = sql;