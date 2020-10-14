const Discord = require("discord.js")

module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    async execute(client, message, args, data) {
        if (args[0]) {
            let command = client.commands.get(args[0]) || client.commands.find(c => c.aliases && c.aliases.includes(args[0]))
            if (!command) return message.channel.send(message.translate.general.help.cannotFindCommand(args[0]))

            let embed = new Discord.MessageEmbed()
            embed.setTitle(message.translate.general.help.command.title(command.name))
            embed.setTimestamp()
            embed.setColor(data.color)
            embed.setFooter(data.footer)
            embed.addField(message.translate.general.help.command.description, `${message.translate[command.class][command.name].description}`)
            embed.addField(message.translate.general.help.command.usage, `\`${data.prefix}${command.name} ${message.translate[command.class][command.name].usage}\``)
            embed.addField(message.translate.general.help.command.example, `\`${data.prefix}${command.name} ${message.translate[command.class][command.name].example}\``)
            embed.addField(message.translate.general.help.command.permission, `${command.userPermissions.length >= 1 ? `${command.userPermissions.map(p => "``" + message.translate.formatPermission(p) + "``").join(', ')}` : ":x:"}`)

            return message.channel.send(embed)
        }

        let embed = new Discord.MessageEmbed()

        embed.setTitle(message.translate.general.help.title)
        embed.setDescription(message.translate.general.help.description(data.prefix, message.guild))
        embed.setFooter(data.footer)
        embed.setTimestamp()
        embed.setColor(data.color)

        const categories = []
        client.commands.array().forEach(async (command, i) => {
            if (!categories.includes(command.class)) {
                categories.push(command.class);
            }
        })

        categories.sort().forEach((cat) => {
            const tCommands = client.commands.filter((cmd) => cmd.class === cat);
            embed.addField(`${message.translate.general.help.categories[cat.toLowerCase()]} (${tCommands.size})`, tCommands.map((cmd) => "`" + cmd.name + "`").join(", "));
        });

        message.channel.send(embed)
    }
}
