const chalk = require('chalk');

module.exports = async (Sequelize, volt) => {
    try {
        volt.database.define('detections', {
            type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            detect: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            max: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            sanctions: {
                type: Sequelize.TEXT,
                defaultValue: 'unrank'
            },
            time: {
                type: Sequelize.INTEGER,
                defaultValue: 180000
            }
        }, {
            timestamps: true
        });
        return volt.database.models;
    } catch (error) {
        console.log(error)
    }
}