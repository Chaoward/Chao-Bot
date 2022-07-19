const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'displays the current server\'s info',
    alias: ["sinfo"],
    help: { //message json data
        content: "displays the current server\'s info"
    },
    category: "info",
    execute(message, args, bot) {
        if (message.channel.type == 'dm') {
            message.channel.send('Server Command Only!');
            return;
        }

        const server = message.guild;
        let pageNum = 0;
        let embeds = [new Discord.MessageEmbed()
            .setColor('#99ff99')
            .setAuthor(server.name, server.iconURL())
            .setThumbnail(server.iconURL())
            .setTitle('Server Info')
            .setDescription('Owner: <@' + server.ownerId + '> \n'
                + 'created-at: ' + (server.createdAt.getMonth() + 1) + '/' 
                + server.createdAt.getDate() + '/'
                + server.createdAt.getFullYear())
        ];
                
        embeds[pageNum].addField('Members', 'count: ' + server.memberCount + '\n'
            + 'bans: ' + server.bans.cache.size + '\n'
            + 'roles: ' + server.roles.cache.size,
            true
        );

        if (embeds[pageNum].length >= 5900) {
            pageNum++;
            embeds.push(new Discord.MessageEmbed());
        }

        embeds[pageNum].addField('Channels', 'count: ' + server.channels.cache.size + '\n'
            + 'System Channel: ' + (server.systemChannel === null ? 'none' : server.systemChannel.toString()) + '\n'
            + 'AFK Channel: ' + (server.afkChannel === null ? 'none' : server.afkChannel.toString()) + '\n',
            true
        );

        message.channel.send({embeds: embeds});
    }
}