const Discord = require("discord.js");

module.exports = {
    name: "setlogs",
    aliases: [],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [],
    async execute(client, message, args, data) {
        if (!args[0]) return message.channel.send(message.translate.error(this, "args"))

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(message.content) || message.guild.channels.cache.find(x => x.name === message.content);

        if (!channel) {
            return message.channel.send(message.translate.error(this, "args"))
        }
        data.protectLog = channel.id
        data.save().then(async () => {
            message.channel.send(message.translate.admin.setlogs.success(channel)).then(async (msg) => {
                msg.delete({
                    timeout: 5000
                })
            })
        })
    }
}
