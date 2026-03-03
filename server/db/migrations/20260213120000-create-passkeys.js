'use strict';

const TABLE_NAME = 'Passkeys';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(TABLE_NAME, {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			credential_id: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			public_key: {
				type: Sequelize.BLOB,
				allowNull: false
			},
			webauthn_user_id: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			counter: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			device_type: {
				type: Sequelize.STRING(32),
				allowNull: true
			},
			backed_up: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			transports: {
				type: Sequelize.JSONB,
				allowNull: true,
				defaultValue: []
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			}
		},
		{
			timestamps: true,
			underscored: true
		}).then(() => {
			return queryInterface.addIndex(TABLE_NAME, ['user_id']);
		}).then(() => {
			return queryInterface.addIndex(TABLE_NAME, ['credential_id'], { unique: true });
		});
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};
