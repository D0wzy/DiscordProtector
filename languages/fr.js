const { MessageEmbed, DiscordAPIError } = require('discord.js')
const client = require('../index')
const moment = require('moment')
const ms = require('msfrench')
const date = require('date-and-time');


function duration(mss) {
    const sec = Math.floor((mss / 1000) % 60).toString()
    const min = Math.floor((mss / (1000 * 60)) % 60).toString()
    const hrs = Math.floor((mss / (1000 * 60 * 60)) % 60).toString()
    return `${hrs.padStart(2, '') == "0" ? "" : `**${hrs.padStart(2, '')}** heures, `}${min.padStart(2, '') == "0" ? "" : `**${min.padStart(2, '')}** minutes et `}**${sec.padStart(2, '')}** secondes.`
}

function numAverage(a) {
    var b = a.length,
        c = 0, i;
    for (i = 0; i < b; i++) {
        c += Number(a[i]);
    }
    return c / b;
}

let status = {
    'online': '<:online:761980233519464458>',
    'idle': '<:idle:761980404881948673>',
    'offline': '<:invisible:761980539359592508>',
    'dnd': '<:dnd:761980584452292608>',
}

let activity = {
    'PLAYING': 'Joue à',
    'STREAMING': 'Streame',
    'LISTENING': 'Écoute',
    'WATCHING': 'Regarde',
}

module.exports = {
    local: "fr_FR",
    formatPermission: (p) => {
        return p.replace("CREATE_INSTANT_INVITE", `Créer un invitations`)
            .replace("ADMINISTRATOR", `Administrateur`)
            .replace("KICK_MEMBERS", `Expulser des membres`)
            .replace("BAN_MEMBERS", `Bannir des membres`)
            .replace("MANAGE_CHANNELS", `Gérer les salons`)
            .replace("MANAGE_GUILD", `Gérer le serveur`)
            .replace("ADD_REACTIONS", `Ajouter des réactions`)
            .replace("VIEW_AUDIT_LOG", `Voir les logs du serveur`)
            .replace("PRIORITY_SPEAKER", `Voix prioritaire`)
            .replace("STREAM", `Lancer un stream`)
            .replace("VIEW_CHANNEL", `Lire les salons textuels & voir les salons vocaux`)
            .replace("SEND_MESSAGES", `Envoyer des messages`)
            .replace("SEND_TTS_MESSAGES", `Envoyer des messages TTS`)
            .replace("MANAGE_MESSAGES", `Gérer les messages`)
            .replace("EMBED_LINKS", `Intégrer des liens`)
            .replace("ATTACH_FILES", `Joindre des fichiers`)
            .replace("READ_MESSAGE_HISTORY", `Voir les anciens messages`)
            .replace("MENTION_EVERYONE", `Mentionner @everyone, @here et tous les rôles`)
            .replace("USE_EXTERNAL_EMOJIS", `$Utiliser des émojis externe`)
            .replace("VIEW_GUILD_INSIGHTS", `Voir les analyses du serveur`)
            .replace("CONNECT", `Se connecter`)
            .replace("SPEAK", `Parler`)
            .replace("MUTE_MEMBERS", `Couper les micros de membres`)
            .replace("DEAFEN_MEMBERS", `Mettre en sourdine des membres`)
            .replace("MOVE_MEMBERS", `Déplacer des membres`)
            .replace("USE_VAD", `Utiliser la détection de la voix`)
            .replace("CHANGE_NICKNAME", `Changer le pseudo`)
            .replace("MANAGE_NICKNAMES", `Gérer les pseudos`)
            .replace("MANAGE_ROLES", `Gérer les rôles`)
            .replace("MANAGE_WEBHOOKS", `Gérer les webhooks`)
            .replace("MANAGE_EMOJIS", `Gérer les émojis`)
    },
    error: (cmd, error, options) => {
        if (error == "args") {
            return `:x: | Usage incorrect !\nDescription: ${client.translator("fr")[client.commands.get(cmd.name).class][cmd.name].description}\nUsage: \`${options ? options.prefix : client.config.prefix}${cmd.name} ${client.translator("fr")[client.commands.get(cmd.name).class][cmd.name].usage}\`\nExemple: \`${options ? options.prefix : client.config.prefix}${cmd.name} ${client.translator("fr")[client.commands.get(cmd.name).class][cmd.name].example}\``
        }
        if (error == "userPermissions") {
            return `:x: | Vous n'avez pas les permissions suffisantes pour faire cette commande. (${options.permissions.map(p => `\`${p}\``).join("")})`
        }
        if (error == "botPermissions") {
            return `:x: | Je n'ai pas les permissions suffisantes pour faire cette commande. (${options.permissions.map(p => `\`${p}\``).join("")})`
        }
        if (error == "ownerOnly") {
            return `:x: | Seulement ${options.owners.length > 1 ? options.owners.map(o => client.users.cache.get(o).tag).slice(0, -1).join(', ') + ' et ' + options.owners.map(o => client.users.cache.get(o).tag).slice(-1) : client.users.cache.get(options.owners[0]).tag} ${options.owners.length > 1 ? 'peuvent' : 'peut'} faire cette commande !`
        }
        if (error == "notInVoiceChannel") {
            if (options && options.mentionUser) return `${options.user}, vous n'êtes pas dans un salon vocal.`
            return `:x: | Vous n'êtes pas dans un salon vocal.`
        }
        if (error == "cooldown") {
            return `:x: | Vous devez attendre ${Math.ceil(options.cooldown)} seconde${options.cooldown > 1 ? 's' : ''} avant de refaire cette commande.`
        }
        if (error == "notEnoughPermissions") {
            return `:x: | Je n'ai plus les permissions administrateur, mon travail peut ne pas être complet ! Action: ${options.action}`
        }
        if (error == "cannotFindChannel") {
            return `:x: | Je ne trouve aucun salon correspondant à \`${options.channel}\``
        }
        if (error == "cannotFindUser") {
            return `:x: | Je ne trouve aucun salon correspondant à \`${options.user}\``
        }
        if (error == "NaN") {
            return `:x: | \`${options.number}\` n'est pas un nombre valide.`
        }
    },
    reason: (r, type, a) => {
        if (r === 'kick') {
            return `Protection - Type: ${type} | Alertes: ${a}`
        }
        if (r === 'ban') {
            return `Protection - Type: ${type} | Alertes: ${a}`
        }
        if (r === 'unrank') {
            return `Protection - Type: ${type} | Alertes: ${a}`
        }
    },
    event: (event, options) => {
        const time = moment.tz(Date.now(), "Europe/Paris").format("HH:mm:ss");
        const embed = new MessageEmbed().setColor(options.triggered ? "RED" : "GREEN").setFooter(`Protection`).setTitle(`[${time}] Protection - Type: ${event}`).setTimestamp()
        if (event === "BOT_ADD") {
            return embed.setDescription(`Action: **Ajout d'un bot (${options.target.tag})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Expulsion du bot.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des webhooks est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "CHANNEL_CREATE") {
            return embed.setDescription(`Action: **Création d'un salon (${options.target.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Suppression du salon.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des salons est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "CHANNEL_DELETE") {
            return embed.setDescription(`Action: **Suppression d'un salon (${options.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Recréation du salon.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des salons est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "CHANNEL_UPDATE") {
            return embed.setDescription(`Action: **Modification d'un salon (${options.oldChannel.name} ➡️ ${options.newChannel.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Rétablissement des paramètres du salon.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des salons est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "ROLE_CREATE") {
            return embed.setDescription(`Action: **Création d'un rôle (${options.target.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Suppression du rôle.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des rôles est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "ROLE_DELETE") {
            return embed.setDescription(`Action: **Suppression d'un rôle (${options.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Recréation du rôle.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des rôles est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "ROLE_UPDATE") {
            return embed.setDescription(`Action: **Modification d'un rôle (${options.oldRole.name} ➡️ ${options.newRole.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Rétablissement des paramètres du rôle.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des rôles est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "MEMBER_ROLE_ADD") {
            return embed.setDescription(`Action: **${options.special ? `Ajout d'un rôle avec des permissions extras` : `Ajout d'un rôle`} (${options.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Suppression du rôle au membre.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des rôles est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "MEMBER_BAN_ADD") {
            return embed.setDescription(`Action: **Ajout d'un ban (${options.username}#${options.discriminator})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Révoquement du bannissement.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des bans est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "MEMBER_KICK") {
            return embed.setDescription(`Action: **Expulsion d'un utilisateur (${options.user.username}#${options.user.discriminator})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Application de la sanction nécessaire à l'auteur de l'action.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des bans est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
        if (event === "WEBHOOK_CREATE") {
            return embed.setDescription(`Action: **Création d'un webhook (${options.target.name})**\nAuteur: **${options.executor.tag}**\nConséquences: **${options.triggered ? `Suppression du webhook.` : `Aucune car l'auteur de l'action est owner du serveur, owner du bot ou la protection des webhooks est désactivée.`}**\nTemps de réponse: **${options.timeout}ms**`)
        }
    },
    utils: (type, options) => {
        if (type == "tag") {
            return `Hey ${options.user}, besoin d'aide ? Mon préfix est \`${options.prefix}\``
        }
    },
    owner: {
        reload: {
            usage: "<commande>",
            example: 'help',
            description: "Permet de recharger une commande",
            success: (cmd) => `:white_check_mark: | La commande \`${cmd}\` a été reload !`,
            cantFind: (cmd) => `:x: | Je ne trouve aucune commande nommée \`${cmd}\``
        }
    },
    admin: {
        setprefix: {
            usage: "<préfix>",
            example: '!',
            description: "Permet de définir un nouveau préfix.",
            invalid: (list) => `:x: | Veuillez utiliser les prefixes suivants: ${list}`,
            success: (prefix) => `:white_check_mark: | Nouveau préfix: \`${prefix}\``
        },
        setcolor: {
            usage: "<couleur hexadécimale>",
            example: '#FFFFF',
            description: "Permet de définir une nouvelle couleur aux embeds.",
            success: (prefix) => `:white_check_mark: | Nouvelle couleur d'embed définie: \`${prefix}\``
        },
        setfooter: {
            usage: "<footer>",
            example: 'Grosse dédicace à ChoufProno',
            description: "Permet de définir un footer aux embeds.",
            success: (prefix) => `:white_check_mark: | Nouveau footer d'embed définie: \`${prefix}\``
        },
        setprofile: {
            example: '',
            description: "Permet de changer les paramètres du bot",
            title: '**__» Paramètres du profile__**',
            get description() {
                return `🇦・Changer le nom d'utilisateur\nActuel: ${client.user.username}\n\n🇧・Changer l'avatar\nActuel: [Clique ici](${client.user.displayAvatarURL()})\n\n🇨・Changer l'activitée\nActuel: ${client.user.presence.activities[0] ? `${activity[client.user.presence.activities[0].type]} ${client.user.presence.activities[0].name}` : `:x:`}`
            },
            loading: 'Chargement...',
            question: [{
                question: "Quel nom voulez-vous attribuez au bot ?",
                error: ":x: | Je n'ai pas pu changer mon pseudo :/"
            }, {
                question: "Quel avatar voulez-vous attribuez au bot ?",
                error: ":x: | Je n'ai pas pu changer mon avatar car le lien est invalide :/"
            }, {
                question: "Quel type d'activité voulez-vous attribuez au bot (\`play\`, \`stream\`, \`watch\`, \`listen\`)",
                error: ":x: | Type d'activité invalide"
            }, {
                question: "Quel nom voulez-vous attribuez à l'activité du bot ?"
            }]
        },
        setlogs: {
            usage: "<mention / id / nom>",
            example: '#salon-de-log',
            description: "Permet de définir un nouveau salon de log",
            success: (channel) => `:white_check_mark: | Nouveau salon de log: ${channel}`
        },
        whitelist: {
            usage: "<add / remove / list> <mention / id / tag>",
            example: 'add Clyde#0000',
            description: "Permet de d'ajouter un utilisateur à la whitelist",
            add: (user) => `:white_check_mark: | ${user} a désormais accès à la whitelist et bypass toute les permissions.`,
            remove: (user) => `:white_check_mark: | ${user} n'a désormais plus accès à la whitelist et ne bypass plus toute les permissions.`,
            list: {
                loading: `Chargement...`,
                title: (length) => `__**» Liste blanche (${length})**__`
            }
        },
        setup: {
            usage: "[detection] <alertes avant sanction> <intervale d'alerte (y, d, h, m, s)> <sanction (ban, kick, unrank)>",
            example: 'ROLE_CREATE 5 2m ban',
            description: "Affiche les paramètres de détections de raid.",
            title: (l) => `**__» Configuration des détections (${l})__**`,
            cannotFindDetection: (a) => `:x: | Je ne trouve aucun type de détection correspondant à \`${a}\``,
            success: (max, type, sanctions, time) => `:white_check_mark: | Un utilisateur non-whitelist qui fera ${max} alertes de ${type} en moins de ${time} se fera ${sanctions}`,
            list: (dms, dmss, e, i) => `${i + 1}・**${e.name}**\n   Activé: ${dmss.find(x => x.type === e.name).enabled ? ':white_check_mark:' : ':x:'}\n   **Détecté en ${Math.ceil(numAverage(dms.filter(x => x.type === e.name).map(x => x.timeout)))}ms**\n   Nombre d'alertes maximums: **${dmss.find(x => x.type === e.name).max}**\n   Temps d'intervale: **${ms(dmss.find(x => x.type === e.name).time, { long: true })}**\n   Sanctions: **${dmss.find(x => x.type === e.name).sanctions}**\n\n`
        },
        export: {
            usage: "",
            example: '',
            description: "Exporter les données de la configuration du serveur.",
            get success() {
                return `Vos données du ${date.format(new Date, date.compile('MMM D YYYY h:m:s A'))}.`
            }
        }
    },
    giveaway: {
        gstart: {
            usage: "<temps (y, d, h, m, s)> <nombre de vainqueurs> <lot>",
            example: '30m 1 T-Shirt Wumpus',
            description: "Permet de créer un giveaway",
            messages(winnerCount, footer, color) {
                return {
                    giveaway: "",
                    giveawayEnded: "",
                    timeRemaining: "Temps restant: **{duration}**!",
                    inviteToParticipate: "Réagissez par 🎉 pour participer!",
                    winMessage: "Bravo, {winners}! tu remportes **{prize}**!",
                    embedFooter: footer,
                    noWinner: "Giveaway annulé, aucune participation valide.",
                    hostedBy: "Démarré par: {user}",
                    winners: `gagnant${parseInt(winnerCount) > 1 ? 's' : ''}`,
                    endedAt: "Fin",
                    embedColor: color,
                    units: {
                        seconds: "secondes",
                        minutes: "minutes",
                        hours: "heures",
                        days: "jours",
                        pluralS: false
                    }
                }
            }
        },
        greroll: {
            usage: "<id du giveaway>",
            example: '764884458481647686',
            description: "Permet de relancer un giveaway",
            messages() {
                return {
                    congrat: "Bravo, {winners}! tu remportes **{prize}**!",
                    error: "Giveaway annulé, aucune participation valide.",
                }
            }
        },
        gstop: {
            usage: "<id du giveaway>",
            example: '764884458481647686',
            description: "Permet de stopper un giveaway",
            success: `:white_check_mark: | Giveaway supprimé`
        },
    },
    general: {
        help: {
            title: `**__» Page d'aide__**`,
            categories: {
                'admin': `:desktop_computer:・Administration`,
                'general': ':pushpin:・Général',
                'owner': '👑・Créateur',
                'music': `:musical_note:・Musique`,
                'giveaway': ':tada:・Concours',
                'mod': '🛠️・Modération'
            },
            cannotFindCommand: (s) => `:x: | Je ne trouve aucune commande possédant comme nom \`${s}\``,
            command: {
                title: (c) => `**__» Informations de la commande ${c} __**`,
                description: `Description`,
                usage: `Utilisation`,
                example: `Exemple`,
                permission: `Permissions requises`,
            },
            description: (prefix, guild) => `Préfix du bot sur ${guild.name}: \`${prefix}\`\nNombre de commande: **${client.commands.size}**`
        },
        ping: {
            example: "",
            usage: "",
            description: "Permet de connaître le temps de réponse du bot et de l'API OAuth2",
            title: `**__» Temps de réponse__**`,
            websocket: `Temps de réponse du WebSocket`,
            loading: `Chargement...`,
            bot: `Temps de réponse du Bot`,
            api: `Temps de réponse de l'API`
        }
    },
    mod: {
        nuke: {
            description: `Permet de récréer un salon.`,
            usage: ``,
            example: ``,
        }
    }
}
