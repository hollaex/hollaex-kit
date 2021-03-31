'use strict';

const TABLE = 'Users';
const COLUMN1 = 'crypto_wallet';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query (
			`UPDATE public."${TABLE}" SET
			${COLUMN1} =
				${COLUMN1} - 'bitcoin' || jsonb_build_object('btc', ${COLUMN1}->'bitcoin')
				where ${COLUMN1} ? 'bitcoin'`
		).then(() => {
			return queryInterface.sequelize.query (
				`UPDATE public."${TABLE}" SET
				${COLUMN1} =
					${COLUMN1} - 'bitcoincash' || jsonb_build_object('bch', ${COLUMN1}->'bitcoincash')
					where ${COLUMN1} ? 'bitcoincash'`
			);
		}).then(() => {
			return queryInterface.sequelize.query (
				`UPDATE public."${TABLE}" SET
				${COLUMN1} =
					${COLUMN1} - 'ethereum' || jsonb_build_object('eth', ${COLUMN1}->'ethereum')
					where ${COLUMN1} ? 'ethereum'`
			);
		});
	},
	down: () => {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
};