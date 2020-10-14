const Discord = require("discord.js")
const ms = require("ms");

module.exports = {
    name: "gstart",
    aliases: ["g-start", "giveaway-start"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    async execute(client, message, args, data) {
        if (!args[2]) {
            return message.channel.send(message.translate.error(this, "args"))
        }

        client.giveaways.start(message.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(" "),
            winnerCount: parseInt(args[1]),
            messages: message.translate.giveaway.gstart.messages(parseInt(args[1]), data.footer, data.color)
        }).catch(async (err) => {
            console.log(err)
            return message.channel.send(message.translate.error(this, "args"))
        })
    }
}
