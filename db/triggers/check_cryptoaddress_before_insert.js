const { CURRENCIES } = require('../../constants');

let cases = '';
CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		cases += 'IF ';
	} else {
		cases += 'ELSEIF ';
	}
	cases += `
		OLD.crypto_wallet->>'${crypto}' IS NULL AND NEW.crypto_wallet->>'${crypto}' IS NOT NULL THEN
		SELECT COUNT(*)
			INTO c
			FROM "Users"
			WHERE crypto_wallet->>'${crypto}' = NEW.crypto_wallet->>'${crypto}';
	`;
	
	if (i === CURRENCIES.length-1) {
		cases += 'END IF;';
	}
});

const sql = `
	CREATE OR REPLACE FUNCTION check_cryptoaddress_before_insert()
	RETURNS TRIGGER AS $check_cryptoaddress_before_insert$
	DECLARE
	  c integer:=0;
	BEGIN
	  IF NEW.crypto_wallet <> OLD.crypto_wallet THEN
	    ${cases}
	    IF c > 0 THEN
	      RAISE EXCEPTION 'Address % is taken', NEW.crypto_wallet;
	    END IF;
	  END IF;
	  RETURN NEW;
	END;
	$check_cryptoaddress_before_insert$ LANGUAGE plpgsql;

	DROP TRIGGER IF EXISTS check_cryptoaddress_before_insert
	ON "Users";

	CREATE TRIGGER check_cryptoaddress_before_insert
	BEFORE UPDATE ON "Users"
	FOR EACH ROW EXECUTE PROCEDURE check_cryptoaddress_before_insert();
`;

module.exports = sql;