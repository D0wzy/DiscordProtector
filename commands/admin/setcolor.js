const Discord = require("discord.js");

module.exports = {
    name: "setcolor",
    aliases: [],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [],
    async execute(client, message, args, data) {
        if (!args[0]) return message.channel.send(message.translate.error(this, "args"))

        data.color = args[0]
        data.save().then(async () => {
            message.channel.send(message.translate.admin.setcolor.success(args[0])).then(async (msg) => {
                msg.delete({
                    timeout: 5000
                })
            })
        })
    }
}
