const Discord = require("discord.js")

module.exports = {
    name: "eval",
    aliases: [],
    cooldown: 1000,
    ownerOnly: true,
    userPermissions: [],
    botPermissions: [],
    async execute(client, message, args, data) {
        //if (!args[0]) return message.channel.send(message.translate.error(this, "args"))

        const content = message.content.split(" ").slice(1).join(" ");
        const result = new Promise((resolve) => resolve(eval(content)));

        return result.then((output) => {
            if (typeof output !== "string") {
                output = require("util").inspect(output, {
                    depth: 0
                });
            }
            if (output.includes(client.token)) {
                output = output.replace(client.token, "T0K3N");
            }
            message.channel.send(output, {
                code: "js"
            });
        }).catch((err) => {
            err = err.toString();
            if (err.includes(client.token)) {
                err = err.replace(client.token, "T0K3N");
            }
            message.channel.send(err, {
                code: "js"
            });
        });
    }
}