const { Client, Collection } = require('discord.js');
const { GiveawaysManager } = require("discord-giveaways");
const fs = require('fs');
const readdir = require("util").promisify(fs.readdir);
const chalk = require('chalk');
const SelfReloadJSON = require('self-reload-json');
const Sequelize = require('sequelize');
const logs = require('discord-logs')

module.exports = class DiscordProtect extends Client {
    constructor(options) {
        super(options);

        this.commands = new Collection();
        this.events = new Collection();
        this.config = new SelfReloadJSON(`${__dirname}/../config.json`);
        this.cooldown = new Array();

        this.database = new Sequelize(this.config.database.db, this.config.database.user, this.config.database.pass, {
            host: this.config.database.host,
            dialect: "mysql",
            define: {
                charset: "utf8",
                collate: "utf8_general_ci",
                timestamps: false
            },
            pool: {
                max: 200,
                min: 0,
                acquire: 60000,
                idle: 10000
            },
            logging: false
        });

        this.giveaways = new GiveawaysManager(this, {
            storage: "./assets/giveaways.json",
            updateCountdownEvery: 10000,
            default: {
                botsCanWin: false,
                exemptPermissions: [],
                embedColor: "#FF0000",
                reaction: "🎉"
            }
        });
        logs(this)
    };

    translator(lang) {
        return require(`../languages/${lang}.js`);
    };

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    };

    pushDetection(detection, ms, author) {
        return this.database.models.logs.create({
            type: detection,
            timeout: ms,
            author: author,
            makedAt: Date.now()
        })
    }

    async init(...args) {
        if (args.includes("events")) {

            const evtFiles = await readdir(`./events/`);
            if (!evtFiles) throw Error("No event was found, without the message event, command cannot be loaded")
            evtFiles.filter(x => !x.endsWith(".disabled")).forEach((file) => {
                const eventName = file.split(".")[0];
                const event = new (require(`../events/${file}`))(this);
                this.events.set(event.name, {
                    name: event.name,
                    detectionMS: "100",
                    filename: file.split('.').shift()
                })

                console.log(chalk.yellow(`» ${chalk.underline("Event loaded !")} ${chalk.bold(file)}.`));
                this.on(eventName, (...args) => event.run(...args));
                delete require.cache[require.resolve(`../events/${file}`)];
            });
        };
        if (args.includes("commands")) {
            const directories = await readdir("./commands/");
            directories.filter(d => !d.endsWith("disabled")).forEach(async (dir) => {
                const commands = await readdir("./commands/" + dir + "/");
                commands.filter(f => f.endsWith(".js")).forEach((f, i) => {
                    try {
                        this.loadCommand(dir, f);
                    } catch (error) {
                        console.log(error);
                    }
                });
            });
        };

        if (args.includes("models")) {
            const mdlFiles = await readdir(`${__dirname}/../models`);
            if (!mdlFiles) throw Error("No models was found, without the models, command cannot be loaded and database cannot be sync");

            this.database.authenticate().then(async () => {
                await require('../models/Guild.js')(Sequelize, this);
                console.log(chalk.yellow(`» ${chalk.underline("Model loaded !")} ${chalk.bold("Guild.js")}.`));
                await require('../models/Member.js')(Sequelize, this)
                console.log(chalk.yellow(`» ${chalk.underline("Model loaded !")} ${chalk.bold("Member.js")}.`))
                await require('../models/Log.js')(Sequelize, this)
                console.log(chalk.yellow(`» ${chalk.underline("Model loaded !")} ${chalk.bold("Log.js")}.`))
                await require('../models/Detection.js')(Sequelize, this)
                console.log(chalk.yellow(`» ${chalk.underline("Model loaded !")} ${chalk.bold("Detection.js")}.`))
                await this.database.sync({
                    alter: true,
                    force: false
                });
            }).catch(async (err) => {
                console.log(err);
            });
        };
    };

    async loadCommand(commandClass, commandName) {
        try {
            delete require.cache[require.resolve(`../commands/${commandClass}/${commandName}`)];
            let props = require(`../commands/${commandClass}/${commandName}`);
            props.class = commandClass;

            this.commands.set(props.name, props);
            console.log(chalk.yellow(`» ${chalk.underline("Command loaded !")} ${chalk.bold(commandName)} in the category ${chalk.bold(commandClass)}.`));
            return;
        } catch (e) {
            console.log(e);
            return `Unable to load command ${commandName}: ${e}`;
        }
    };
}