const Discord = require("discord.js")
const ms = require("ms");

module.exports = {
    name: "greroll",
    aliases: ["g-reroll", "giveaway-reroll"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    async execute(client, message, args, data) {
        if (!args[0]) {
            return message.channel.send(message.translate.error(this, "args"))
        }

        client.giveaways.reroll(args[0], {
            messages: message.translate.giveaway.gstart.messages()
        }).catch((err) => {
            return message.channel.send(message.translate.error(this, "args"))
        });
    }
}
