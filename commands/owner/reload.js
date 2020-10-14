const Discord = require("discord.js")

module.exports = {
    name: "reload",
    aliases: [],
    cooldown: 2000,
    ownerOnly: true,
    userPermissions: [],
    botPermissions: [],
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send(message.translate.error(this, "args"))

        const command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]))
        if (!command) message.channel.send(message.translate.owner.reload.cantFind(args[0]))
        try {
            delete require.cache[require.resolve(`../${command.class}/${command.name}`)];
            let props = require(`../${command.class}/${command.name}`)
            client.commands.delete(props)
            props.class = command.class

            client.commands.set(props.name, props)
            message.channel.send(message.translate.owner.reload.success(args[0])).then(async (msg) => {
                msg.delete({
                    timeout: 5000
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}