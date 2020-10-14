const chalk = require('chalk');

module.exports = async (Sequelize, volt) => {
    try {
        volt.database.define('logs', {
            type: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            timeout: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            author: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            makedAt: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        }, {
            timestamps: true
        });
        return volt.database.models;
    } catch (error) {
        console.log(error)
    }
}