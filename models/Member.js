const chalk = require('chalk');

module.exports = async (Sequelize, volt) => {
    try {
        volt.database.define('members', {

            // CONFIGURATION
            userID: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            antibot: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            channelCreate: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            channelDelete: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            channelUpdate: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            guildBanAdd: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            guildKickAdd: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            guildMemberRoleAdd: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            roleCreate: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            roleDelete: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            roleUpdate: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            webhookCreate: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        }, {
            timestamps: true
        });
        return volt.database.models;
    } catch (error) {
        console.log(error)
    }
}