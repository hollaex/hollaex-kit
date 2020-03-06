const sql = `
	CREATE OR REPLACE FUNCTION add_fee_before_insert_trade()
	RETURNS TRIGGER AS $add_fee_before_insert_trade$
	DECLARE
	  taker_fee_value FLOAT = 0;
	  maker_fee_value FLOAT = 0;
	BEGIN
	  IF NEW.quick = FALSE THEN
	    SELECT get_user_fee(u.verification_level, NEW.symbol, FALSE) INTO maker_fee_value
	    FROM "Users" AS u
	    WHERE u.id = NEW.maker_id;
	    NEW.maker_fee := maker_fee_value;

	    SELECT get_user_fee(u.verification_level, NEW.symbol, TRUE) INTO taker_fee_value
	    FROM "Users" AS u
	    WHERE u.id = NEW.taker_id;
	    NEW.taker_fee := taker_fee_value;
	  END IF;

	  RAISE LOG 'BEFORE TRADE: %. taker_fee: %. maker_fee: %', NEW.id, taker_fee_value, maker_fee_value;


	  RAISE LOG 'BEFORE_TRADE: %. taker_fee: %. maker_fee: %', NEW.id, NEW.taker_fee, NEW.maker_fee;

	  RETURN NEW;
	END;
	$add_fee_before_insert_trade$ LANGUAGE plpgsql;

	DROP TRIGGER IF EXISTS add_fee_before_insert_trade
	ON "Trades";

	CREATE TRIGGER add_fee_before_insert_trade
	BEFORE INSERT ON "Trades"
	FOR EACH ROW EXECUTE PROCEDURE add_fee_before_insert_trade();
`;

module.exports = sql;