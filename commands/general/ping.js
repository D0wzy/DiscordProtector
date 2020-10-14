const Discord = require("discord.js")

module.exports = {
    name: "ping",
    aliases: [],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    async execute(client, message, args, data) {

        let msg = await message.channel.send(message.translate.general.ping.loading)
        let embed = new Discord.MessageEmbed()

        embed.setTitle(message.translate.general.ping.title)
        embed.addField(message.translate.general.ping.websocket, `${client.ws.ping}ms`)
        embed.addField(message.translate.general.ping.api, `${msg.createdAt - message.createdAt + "ms"}`)
        embed.setTimestamp()
        embed.setColor(data.color)
        embed.setFooter(data.footer)

        return msg.edit("", embed)
    }
}