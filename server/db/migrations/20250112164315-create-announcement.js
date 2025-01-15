'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableExists = await queryInterface.describeTable('Announcements').catch(() => null);

        if (!tableExists) {
            await queryInterface.createTable('Announcements', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    onDelete: 'CASCADE',
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id'
                    }
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                message: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'info'
                },
                start_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null
                },
                end_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null
                },
                is_navbar: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
                is_popup: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                },
                is_dropdown: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
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
            });
        } else {
            const tableDefinition = await queryInterface.describeTable('Announcements');

            if (!tableDefinition.start_date) {
                await queryInterface.addColumn('Announcements', 'start_date', {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null
                });
            }
            if (!tableDefinition.end_date) {
                await queryInterface.addColumn('Announcements', 'end_date', {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null
                });
            }
            if (!tableDefinition.is_navbar) {
                await queryInterface.addColumn('Announcements', 'is_navbar', {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                });
            }
            if (!tableDefinition.is_popup) {
                await queryInterface.addColumn('Announcements', 'is_popup', {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                });
            }
            if (!tableDefinition.is_dropdown) {
                await queryInterface.addColumn('Announcements', 'is_dropdown', {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                    defaultValue: false
                });
            }
        }
    },

    down: async (queryInterface) => {
        const tableExists = await queryInterface.describeTable('Announcements').catch(() => null);

        if (tableExists) {
            const tableDefinition = await queryInterface.describeTable('Announcements');

            if (tableDefinition.start_date) {
                await queryInterface.removeColumn('Announcements', 'start_date');
            }
            if (tableDefinition.end_date) {
                await queryInterface.removeColumn('Announcements', 'end_date');
            }
            if (tableDefinition.is_navbar) {
                await queryInterface.removeColumn('Announcements', 'is_navbar');
            }
            if (tableDefinition.is_popup) {
                await queryInterface.removeColumn('Announcements', 'is_popup');
            }
            if (tableDefinition.is_dropdown) {
                await queryInterface.removeColumn('Announcements', 'is_dropdown');
            }
        }
    },
};
