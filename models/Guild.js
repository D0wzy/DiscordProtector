const chalk = require('chalk');

module.exports = async (Sequelize, volt) => {
    try {
        volt.database.define('guilds', {

            // CONFIGURATION
            guildID: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            prefix: {
                type: Sequelize.STRING(1),
                defaultValue: volt.config.prefix,
                allowNull: false
            },
            language: {
                type: Sequelize.STRING(2),
                defaultValue: "fr"
            },
            antibot: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            channelCreate: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            channelDelete: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            channelUpdate: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            guildBanAdd: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            guildKickAdd: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            guildMemberRoleAdd: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            roleCreate: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            roleDelete: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            roleUpdate: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            webhookCreate: {
                type: Sequelize.BOOLEAN(),
                defaultValue: true
            },
            protectLog: {
                type: Sequelize.STRING(25)
            },
            maxAlerts: {
                type: Sequelize.STRING(25),
                defaultValue: 3
            },
            commandsMade: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            premium: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            whitelist: {
                type: Sequelize.TEXT,
                defaultValue: " ",
                get() {
                    return this.getDataValue('whitelist').split('==%;')
                },
                set(val) {
                    this.setDataValue('whitelist', val.join('==%;'));
                },
            },
            footer: {
                type: Sequelize.TEXT,
                defaultValue: `Soundboard`,
                allowNull: false
            },
            color: {
                type: Sequelize.TEXT,
                defaultValue: `2f3136`,
            },
            botBlacklisted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: true
        });
        return volt.database.models;
    } catch (error) {
        console.log(error)
    }
}