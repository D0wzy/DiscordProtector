const Discord = require("discord.js")
const ms = require("ms");

module.exports = {
    name: "gstop",
    aliases: ["g-stop", "giveaway-stop"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    async execute(client, message, args, data) {
        if (!args[0]) {
            return message.channel.send(message.translate.error(this, "args"))
        }

        client.giveaways.delete(messageID).then(() => {
            message.channel.send("Concours supprimé !").then(msg => msg.delete({ timeout: 2500, reason: '' }));
        }).catch((err) => {
            message.channel.send(message.translate.error(this, "args"))
        });
    }
}
