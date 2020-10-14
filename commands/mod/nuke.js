const Discord = require("discord.js")

module.exports = {
    name: "nuke",
    aliases: ["renew"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    botPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    async execute(client, message, args, data) {
        const position = message.channel.position;
        const rateLimitPerUser = message.channel.rateLimitPerUser;
        var newChannel = await message.channel.clone()
        message.channel.delete();
        newChannel.setPosition(position);
        newChannel.setRateLimitPerUser(rateLimitPerUser)
    }
}
