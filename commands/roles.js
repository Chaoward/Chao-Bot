const Discord = require('discord.js');

module.exports = {
    name: 'roles',
    description: 'displays all roles in a server',
    alias: ["role"],
    help: { //message json data
        content: this.description
    },
    category: "info",
    execute(message, args, bot) {
        if (message.channel.type === 'DM') {
            message.channel.send('Command is only for Servers!');
            return;
        }

        //Embed setup
        const CHAR_LIMIT = 6000;
        let newLine = '';
        let pageNum = 0;
        const embeds = [
            new Discord.MessageEmbed().setColor('#ffaacc')
        ];

        for (const role of message.guild.roles.cache.values()) {
            newLine = role.toString() + '\n';
            if (embeds[pageNum].length + newLine.length < CHAR_LIMIT) 
                embeds[pageNum].description += newLine;
            else {
                embeds.push( new Discord.MessageEmbed().setColor('#ffaacc') );
                embeds[++pageNum].setDescription(newLine);
            }
        }

        message.channel.send( {embeds: embeds} );
    }
}

