const config = require("../config");
const Discord = require("discord.js");
const { user } = require("..");

module.exports = class {

    constructor(client) {
        this.client = client;
        this.name = "CHANNEL_DELETE"
    }

    async run(channel) {
        if (channel.type === "dm") return;

        let startAt = Date.now()

        var client = this.client
        let guild = channel.guild

        let guildData = await client.database.models.guilds.findOne({
            where: {
                guildID: guild.id,
            }
        })


        if (!guildData) return guild.leave()

        if (!channel.guild.me.hasPermission("VIEW_AUDIT_LOG")) return client.config.owners.forEach(async (o) => {
            client.users.cache.get(o).send(client.translator(guildData.language).error(null, "notEnoughPermissions", {
                action: `CHANNEL_DELETE`
            }))
        })

        const action = await channel.guild.fetchAuditLogs({ type: "CHANNEL_DELETE" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;


        let userData = await client.database.models.members.findOne({
            where: {
                userID: action.executor.id,
            }
        })

        if (!userData) userData = await client.database.models.members.create({
            userID: action.executor.id,
        })

        if (client.config.owners.includes(action.executor.id) || guild.owner.id == action.executor.id || !guildData.channelDelete || guildData.whitelist.includes(action.executor.id)) {
            let logChannel = client.guilds.cache.get(guild.id).channels.cache.get(guildData.protectLog)

            if (logChannel) logChannel.send(client.translator(guildData.language).event("CHANNEL_DELETE", {
                ...channel,
                ...action,
                timeout: Date.now() - startAt,
                triggered: false
            }))
        } else if (guildData.channelDelete && !client.config.owners.includes(action.executor.id) || guild.owner.id !== action.executor.id) {
            let newChannel = await channel.clone()
            newChannel.setPosition(channel.position)

            let logChannel = client.guilds.cache.get(guild.id).channels.cache.get(guildData.protectLog)

            let after = await client.database.models.detections.findOne({
                where: {
                    type: this.name
                }
            })

            let userAlerts = await client.database.models.logs.findAll({
                where: {
                    author: action.executor.id
                }
            })


            if (userAlerts.length >= 1) {

                if (userAlerts.length >= after.max) {
                    const TimeAgo = (date, s) => {
                        const hourago = Date.now() - s;

                        return date >= hourago;
                    }

                    if (TimeAgo(userAlerts.pop().makedAt, after.time)) {
                        if (after.sanctions === 'ban') {
                            guild.member(action.executor.id).ban({
                                reason: `Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`
                            })
                        } else if (after.sanctions === 'kick') {
                            action.target.guild.member(action.executor.id).kick(`Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`)
                        } else if (after.sanctions === 'unrank') {
                            guild.members.cache.get(action.executor.id).roles.remove(guild.members.cache.get(action.executor.id).roles.cache.array(), `Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`)
                        }
                    }
                }
            }

            if (logChannel) logChannel.send(client.translator(guildData.language).event("CHANNEL_DELETE", {
                ...channel,
                ...action,
                timeout: Date.now() - startAt,
                triggered: true
            }))

            userData.channelDelete++
            userData.save()
        }
        client.pushDetection(this.name, Date.now() - startAt, action.executor.id)

    }
};
