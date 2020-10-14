const Discord = require('discord.js');

module.exports = class {
    constructor(client) {
        this.client = client;
        this.name = "MESSAGE_SPAM"
    }

    async run(message) {
        let startAt = Date.now()
        let client = this.client;

        if (message.author.bot) return;
        if (message.channel.type.toLowerCase() !== "text") return;

        let data = await client.database.models.guilds.findOne({
            where: {
                guildID: message.guild.id
            }
        })
        if (!data) data = await client.database.models.guilds.create({
            guildID: message.guild.id
        })

        message.translate = require(`../languages/${data.language}`)

        if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
            return message.channel.send(message.translate.utils("tag", {
                user: message.author,
                prefix: data.prefix
            }))
        }

        if (!message.content.startsWith(data.prefix)) return;

        let messageArray = message.content.split(" ");
        const args1 = message.content.slice(data.prefix.length).split(/ +/);
        const commandName = args1.shift().toLowerCase();
        let args = messageArray.slice(1);
        let cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!cmd) return;

        if (client.cooldown.find(c => c.id === message.author.id && c.command === cmd.name && c.guild === message.guild.id)) {

            let timeout = Math.abs(((Date.now() - client.cooldown.find(c => c.id === message.author.id && c.command === cmd.name && c.guild === message.guild.id).startedAt) / 1000) - cmd.cooldown / 1000)
            return message.channel.send(message.translate.error(null, "cooldown", {
                cooldown: timeout
            })).then(async (m) => {
                if (message.deletable) message.delete({
                    timeout: timeout * 1000
                })
                if (m.deletable) m.delete({
                    timeout: timeout * 1000
                })
            })
        }

        if (cmd.ownerOnly && !client.config.owners.includes(message.author.id)) {
            return message.channel.send(message.translate.error(null, "ownerOnly", {
                owners: client.config.owners
            }))
        }

        if (cmd.userPermissions && cmd.userPermissions.length >= 1 && !client.config.owners.includes(message.author.id)) {
            if (!message.member.hasPermission(cmd.userPermissions.map(x => x.toUpperCase()))) return message.channel.send(message.translate.error(null, "userPermissions", {
                permissions: cmd.userPermissions
            }));
        }

        if (cmd.botPermissions && cmd.botPermissions.length >= 1 && !client.config.owners.includes(message.author.id)) {
            if (!message.guild.me.hasPermission(cmd.userPermissions.map(x => x.toUpperCase()))) return message.channel.send(message.translate.error(null, "botPermissions", {
                permissions: cmd.botPermissions
            }));
        }

        message.startAt = startAt
        cmd.execute(client, message, args, data);

        client.cooldown.push({
            id: message.author.id,
            command: cmd.name,
            guild: message.guild.id,
            startedAt: startAt
        })

        let index = client.cooldown.indexOf({
            id: message.author.id,
            command: cmd.name,
            guild: message.guild.id,
            startedAt: startAt
        })

        setTimeout(async () => {
            client.cooldown.splice(index)
        }, cmd.cooldown || 3000)
        client.pushDetection(this.name, Date.now() - startAt, message.author.id)

    }
}