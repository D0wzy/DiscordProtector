const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "setup",
    aliases: ["config"],
    cooldown: 2000,
    ownerOnly: false,
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: [],
    async execute(client, message, args, data) {
        client.events.array().forEach(async (e, i) => {
            client.database.models.detections.findOrCreate({
                where: {
                    type: e.name
                }
            })
        })


        if (args[0]) {
            if (args[0].toLowerCase() === 'max') {
                let event = await client.database.models.detections.findAll()

                client.asyncForEach(event, async (e, i) => {
                    event[i].max = 1
                    event[i].time = ms('1m')
                    event[i].sanctions = 'unrank'
                    event[i].save()
                })

                let p0 = 0;
                let p1 = 5;
                let page = 1;

                let embed = new Discord.MessageEmbed()

                let dms = await client.database.models.logs.findAll()
                let dmss = await client.database.models.detections.findAll()

                embed.setTitle(message.translate.admin.setup.title(client.events.array().length))
                    .setColor(data.color)
                    .setDescription(client.events.array()
                        .map(r => r)
                        .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                        .slice(0, 5)
                        .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                    .setTimestamp()
                    .setFooter(data.footer);



                let tdata = await message.channel.send(embed)

                let reac1
                let reac2
                let reac3

                if (dmss.length > 5) {
                    reac1 = await tdata.react("⬅");
                    reac2 = await tdata.react("❌");
                    reac3 = await tdata.react("➡");
                }

                tdata.edit(" ", embed);

                const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

                data_res.on("collect", async (reaction) => {

                    if (reaction.emoji.name === "⬅") {

                        p0 = p0 - 5;
                        p1 = p1 - 5;
                        page = page - 1

                        if (p0 < 0) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(client.events.array()
                            .map(r => r)
                            .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                            .slice(p0, p1)
                            .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                        tdata.edit(embed);

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 5;
                        p1 = p1 + 5;

                        page++;

                        if (p1 > dmss.length + 5) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(client.events.array()
                            .map(r => r)
                            .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                            .slice(p0, p1)
                            .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                        tdata.edit(embed);

                    }

                    if (reaction.emoji.name === "❌") {
                        data_res.stop()
                        return tdata.delete()
                    }

                    await reaction.users.remove(message.author.id);

                })

                return;
            }

            let event = await client.database.models.detections.findOne({
                where: {
                    type: args[0].toUpperCase()
                }
            })

            if (!event) return message.channel.send(message.translate.admin.setup.cannotFindDetection(args[0]))

            if (!args[1]) return message.channel.send(message.translate.error(this, "args"))
            if (isNaN(parseInt(args[1]))) return message.channel.send(message.translate.error(null, "NaN", {
                number: args[1]
            }))

            if (args[3].toLowerCase() !== "kick" && args[3].toLowerCase() !== "ban" && args[3].toLowerCase() !== "unrank") {
                return message.channel.send(message.translate.error(this, "args"))
            }

            if (!ms(args[2])) {
                return message.channel.send(message.translate.error(this, "args"))
            }

            event.max = parseInt(args[1])
            event.time = ms(args[2])
            event.sanctions = args[3].toLowerCase()
            event.save().then(async () => {
                message.channel.send(message.translate.admin.setup.success(parseInt(args[1]), event.type, args[3].toLowerCase(), args[2])).then(async (msg) => {
                    msg.delete({
                        timeout: 5000
                    })
                })
            })
        } else {


            let p0 = 0;
            let p1 = 5;
            let page = 1;

            let embed = new Discord.MessageEmbed()

            let dms = await client.database.models.logs.findAll()
            let dmss = await client.database.models.detections.findAll()

            embed.setTitle(message.translate.admin.setup.title(client.events.array().length))
                .setColor(data.color)
                .setDescription(client.events.array()
                    .map(r => r)
                    .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                    .slice(0, 5)
                    .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                .setTimestamp()
                .setFooter(data.footer);



            let tdata = await message.channel.send(embed)

            let reac1
            let reac2
            let reac3

            if (dmss.length > 5) {
                reac1 = await tdata.react("⬅");
                reac2 = await tdata.react("❌");
                reac3 = await tdata.react("➡");
            }

            tdata.edit(" ", embed);

            const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

            data_res.on("collect", async (reaction) => {

                if (reaction.emoji.name === "⬅") {

                    p0 = p0 - 5;
                    p1 = p1 - 5;
                    page = page - 1

                    if (p0 < 0) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(client.events.array()
                        .map(r => r)
                        .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                        .slice(p0, p1)
                        .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 5;
                    p1 = p1 + 5;

                    page++;

                    if (p1 > dmss.length + 5) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(client.events.array()
                        .map(r => r)
                        .map((e, i) => message.translate.admin.setup.list(dms, dmss, e, i))
                        .slice(p0, p1)
                        .join("\n") + `Page ${page} / ${Math.ceil(dmss.length / 5)}`)
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    return tdata.delete()
                }

                await reaction.users.remove(message.author.id);

            })
        }
    }
}