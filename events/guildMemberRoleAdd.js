const config = require("../config");
const Discord = require("discord.js");
const { user } = require("..");
const { MessageChannel } = require("worker_threads");

module.exports = class {

    constructor(client) {
        this.client = client;
        this.name = "MEMBER_ROLE_ADD"
    }

    async run(member, role) {
        let startAt = Date.now()

        var client = this.client
        let guild = member.guild

        let guildData = await client.database.models.guilds.findOne({
            where: {
                guildID: guild.id,
            }
        })

        if (!guildData) return guild.leave()

        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return client.config.owners.forEach(async (o) => {
            client.users.cache.get(o).send(client.translator(guildData.language).error(null, "notEnoughPermissions", {
                action: `MEMBER_ROLE_ADD`
            }))
        })

        const action = await guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;

        let userData = await client.database.models.members.findOne({
            where: {
                userID: action.executor.id,
            }
        })

        if (!userData) userData = await client.database.models.members.create({
            userID: action.executor.id,
        })

        if (client.config.owners.includes(action.executor.id) || guild.owner.id == action.executor.id || guildData.whitelist.includes(action.executor.id) || !guildData.guildMemberRoleAdd) {
            let logChannel = client.guilds.cache.get(guild.id).channels.cache.get(guildData.protectLog)

            if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {

                if (logChannel) logChannel.send(client.translator(guildData.language).event("MEMBER_ROLE_ADD", {
                    ...role,
                    ...action,
                    timeout: Date.now() - startAt,
                    triggered: false,
                    special: true
                }))
            } else {
                if (logChannel) logChannel.send(client.translator(guildData.language).event("MEMBER_ROLE_ADD", {
                    ...role,
                    ...action,
                    timeout: Date.now() - startAt,
                    triggered: false,
                    special: false
                }))
            }
        } else if (guildData.guildMemberRoleAdd && !client.config.owners.includes(action.executor.id) || guild.owner.id !== action.executor.id) {
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
                            member.guild.members.cache.get(action.executor.id).ban({
                                reason: `Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`
                            })
                        } else if (after.sanctions === 'kick') {
                            action.target.guild.member(action.executor.id).kick(`Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`)

                        } else if (after.sanctions === 'unrank') {
                            member.guild.members.cache.get(action.executor.id).roles.remove(member.guild.members.cache.get(action.executor.id).roles.cache.array(), `Protection - Type: ${this.name} | Alerts: ${userAlerts.filter(x => TimeAgo(x.makedAt, after.time)).length}`)
                        }
                    }
                }
            }

            if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
                member.roles.remove(role.id)

                if (logChannel) logChannel.send(client.translator(guildData.language).event("MEMBER_ROLE_ADD", {
                    ...role,
                    ...action,
                    timeout: Date.now() - startAt,
                    triggered: true,
                    special: true
                }))
            } else {
                if (logChannel) logChannel.send(client.translator(guildData.language).event("MEMBER_ROLE_ADD", {
                    ...role,
                    ...action,
                    timeout: Date.now() - startAt,
                    triggered: true,
                    special: false
                }))
            }

            userData.guildMemberRoleAdd++
            userData.save()
        }
        client.pushDetection(this.name, Date.now() - startAt, action.executor.id)

    }
};
