const Discord = require("discord.js");

module.exports = {
    name: "setprofile",
    aliases: [],
    cooldown: 10000,
    ownerOnly: false,
    requireWhitelist: true,
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [],
    async execute(client, message, args, data) {

        let msg = await message.channel.send(message.translate.admin.setprofile.loading)
        const embed = new Discord.MessageEmbed()

        embed.setTitle(message.translate.admin.setprofile.title)
        embed.setTimestamp()
        embed.setColor(data.color)
        embed.setFooter(data.footer)

        embed.setDescription(message.translate.admin.setprofile.description)

        await msg.react('🇦')
        await msg.react('🇧')
        await msg.react('🇨')
        await msg.react('❌').then(async (m) => {

            msg.edit(" ", embed)

            let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
            collector.on("collect", async (reaction, user) => {
                if (reaction._emoji.name === "🇦") {
                    updateEmbed()
                    let question = await message.channel.send(message.translate.admin.setprofile.question[0].question)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (collected) => {
                        collected.first().delete()
                        question.delete()
                        client.user.setUsername(collected.first().content).then(async () => {
                            updateEmbed()
                        }).catch(async (err) => {
                            console.log(err)
                            collected.first().delete()
                            message.channel.send(message.translate.admin.setprofile.question[0].error).then((mm) => mm.delete({
                                timeout: 5000
                            }));
                        })
                    })
                }
                if (reaction._emoji.name === "🇧") {
                    let question = await message.channel.send(message.translate.admin.setprofile.question[1].question)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (collected) => {
                        collected.first().delete()
                        question.delete()
                        client.user.setAvatar(collected.first().content).then(async () => {
                            updateEmbed()
                        }).catch(async (err) => {
                            console.log(err)
                            collected.first().delete()
                            message.channel.send(message.translate.admin.setprofile.question[1].error).then((mm) => mm.delete({
                                timeout: 5000
                            }));
                        })
                    })
                }

                if (reaction._emoji.name === "🇨") {
                    let question = await message.channel.send(message.translate.admin.setprofile.question[2].question)
                    const filter = m => message.author.id === m.author.id;

                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (collected) => {
                        collected.first().delete()
                        question.delete()
                        let type = ""

                        if (collected.first().content.toLowerCase().startsWith("play")) {
                            type = "PLAYING"
                        } else if (collected.first().content.toLowerCase().startsWith("stream")) {
                            type = "STREAMING"
                        } else if (collected.first().content.toLowerCase().startsWith("listen")) {
                            type = "LISTENING"
                        } else if (collected.first().content.toLowerCase().startsWith("watch")) {
                            type = "WATCHING"
                        } else {
                            return message.channel.send(message.translate.admin.setprofile.question[2].error)
                        }

                        let question2 = await message.channel.send(message.translate.admin.setprofile.question[3].question)

                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(async (collected2) => {
                            collected2.first().delete()
                            question2.delete()

                            client.user.setActivity(collected2.first().content, { type: type, url: "https://www.twitch.tv/monstercat" }).then(async (a) => {
                                updateEmbed()
                            })
                        });
                    })
                }

                if (reaction._emoji.name === "❌") {
                    msg.delete()
                }
                await reaction.users.remove(message.author.id);
            })

            function updateEmbed() {
                embed.setDescription(message.translate.admin.setprofile.description)
                msg.edit(embed)
            }
        });
    }
}