const sql = `

CREATE OR REPLACE FUNCTION create_balance_after_verification()
RETURNS TRIGGER AS $create_balance_after_verification$
BEGIN
	INSERT INTO "Balances"
	("id","created_at","updated_at","user_id")
	VALUES
	(DEFAULT,current_timestamp,current_timestamp,NEW.id);
  RETURN NEW;
END;
$create_balance_after_verification$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_balance_after_verification
ON "Users";

CREATE TRIGGER create_balance_after_verification
AFTER INSERT ON "Users"
FOR EACH ROW EXECUTE PROCEDURE create_balance_after_verification();
`;

module.exports = sql;