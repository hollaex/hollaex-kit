'use strict';

const { User, Role, sequelize } = require('../../db/models');
const { checkStatus } = require('../../init');
const toolsLib = require('hollaex-tools-lib');
const {
    USER_NOT_FOUND,
} = require('../../messages');

let currentAdminId = process.env.CURRENT_ADMIN_ID;
let newAdminId = process.env.NEW_ADMIN_ID;

if (!currentAdminId) {
    throw new Error('CURRENT_ADMIN_ID is not set');
}
if (!newAdminId) {
    throw new Error('NEW_ADMIN_ID is not set');
}


const transferAdminRole = async () => {
    const transaction = await sequelize.transaction();
    try {
        console.log(`tools/dbs/transferAdminRole started from ${currentAdminId} to ${newAdminId}`);

        const currentAdmin = await User.findOne({ where: { id: currentAdminId }, transaction });
        const newAdmin = await User.findOne({ where: { id: newAdminId }, transaction });

        if (!currentAdmin || !newAdmin) {
            throw new Error(USER_NOT_FOUND);
        }

        if (currentAdmin.role !== 'admin') {
            throw new Error('Non admin user provided');
        }

        if (newAdmin.role === 'admin') {
            throw new Error('User already admin');
        }


        const adminRole = await Role.findOne({ where: { role_name: 'admin' }, transaction });
        if (!adminRole) {
            throw new Error('Role not found');
        }

        await currentAdmin.update({ role: null }, { transaction });
        await newAdmin.update({ role: 'admin' }, { transaction });

        await transaction.commit();

        await toolsLib.user.revokeAllUserSessions(currentAdminId);
        await toolsLib.user.revokeAllUserSessions(newAdminId);

        console.log('tools/dbs/transferAdminRole successfully');
        process.exit(0);
    } catch (err) {
        await transaction.rollback();
        console.log('tools/dbs/transferAdminRole err', err);
        process.exit(1);
    }
};


checkStatus().then(() => {
    transferAdminRole();
});