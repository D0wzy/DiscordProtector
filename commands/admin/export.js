const Discord = require("discord.js");
const fs = require('fs')

module.exports = {
    name: "export",
    aliases: [],
    cooldown: 10000,
    ownerOnly: false,
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [],
    async execute(client, message, args, data) {
        let date = Date.now()

        fs.writeFileSync(`./assets/cache/guildData-${message.guild.id}-${date}.json`, JSON.stringify(data.dataValues, null, 3), 'utf-8');


        const buffer = fs.readFileSync(`./assets/cache/guildData-${message.guild.id}-${date}.json`);
        const attachment = new Discord.MessageAttachment(buffer, `guildData-${message.guild.id}-${Date.now()}.json`)
        message.channel.send(message.translate.admin.export.success, attachment)
    }
}
