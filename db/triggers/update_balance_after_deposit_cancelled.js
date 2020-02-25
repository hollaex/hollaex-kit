const { CURRENCIES } = require('../../constants');

let depositCases = '';
CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		depositCases += 'IF ';
	} else {
		depositCases += 'ELSEIF ';
	}
	depositCases += `
    NEW.currency = '${crypto}' THEN
			UPDATE "Balances"
			SET
				${crypto}_pending = round((${crypto}_pending - NEW.amount)::numeric, 8),
				updated_at = current_timestamp
			WHERE user_id = NEW.user_id;
  `;

	if (i === CURRENCIES.length - 1) {
		depositCases += 'END IF;';
	}
});

let withdrawalCases = '';
CURRENCIES.forEach((currency, i) => {
	const crypto = currency;
	if (i === 0) {
		withdrawalCases += 'IF ';
	} else {
		withdrawalCases += 'ELSEIF ';
	}
	withdrawalCases += `
    NEW.currency = '${crypto}' THEN
			UPDATE "Balances"
			SET
				${crypto}_available = round((${crypto}_available + NEW.amount)::numeric, 8),
				updated_at = current_timestamp
			WHERE user_id = NEW.user_id;
  `;

	if (i === CURRENCIES.length - 1) {
		withdrawalCases += 'END IF;';
	}
});

const sql = `
CREATE OR REPLACE FUNCTION update_balance_after_deposit_cancelled()
RETURNS TRIGGER AS $update_balance_after_deposit_cancelled$
BEGIN
  IF OLD.dismissed = true AND NEW.dismissed = false THEN
    RAISE EXCEPTION 'Deposit can not be undismissed. deposit id: %', NEW.id;
  ELSEIF NEW.amount != OLD.amount THEN
    RAISE EXCEPTION 'Deposit amount can not be modified. deposit id: %, new amount: %, old amount: %', NEW.id, NEW.amount, OLD.amount;
  ELSEIF NEW.type != OLD.type THEN
    RAISE EXCEPTION 'Deposit type can not be modified. deposit id: %, new type: %, old type: %', NEW.id, NEW.type, OLD.type;
  ELSEIF NEW.currency != OLD.currency THEN
    RAISE EXCEPTION 'Deposit currency can not be modified. deposit id: %, new currency: %, old currency: %', NEW.id, NEW.currency, OLD.currency;
  ELSEIF NEW.status = true AND OLD.status = false AND NEW.dismissed = true THEN
    RAISE EXCEPTION 'Deposit can not be completed when it is cancelled. deposit id: %', NEW.id;
  ELSEIF NEW.dismissed = true AND OLD.dismissed = false THEN
    IF NEW.status = true THEN
      RAISE EXCEPTION 'Deposit can not be cancelled when it is completed. deposit id: %', NEW.id;
    ELSE
      IF NEW.type = 'deposit' THEN
        ${depositCases}
      ELSEIF NEW.type = 'withdrawal' THEN
     		${withdrawalCases}
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$update_balance_after_deposit_cancelled$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_balance_after_deposit_cancelled
ON "Deposits";

CREATE TRIGGER update_balance_after_deposit_cancelled
AFTER UPDATE ON "Deposits"
FOR EACH ROW EXECUTE PROCEDURE update_balance_after_deposit_cancelled();
`;

module.exports = sql;