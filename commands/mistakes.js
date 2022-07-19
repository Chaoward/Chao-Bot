module.exports = {
    name: 'mistakes',
    description: 'Displays the amount of mistakes users made with the bot',
    alias: ["mis", "mistake"],
    help: { 
        content: 'Displays the amount of mistakes users made with the bot' + "\n`mistake [options]`\n"
                + "\"self\" : display your own count"
                + "\"@user\" : mention a user to display their count"
    },
    category: "info",
    execute(message, args, bot) {
        if (args[1] === 'self') {
            let id = message.author.id;
            if (bot.mistakes.get(id) === undefined) {
                bot.mistakes.set(id, 0);
                return message.channel.send(args[1] + ' has made **0** mistakes');
            }
            return message.channel.send('You made **' + bot.mistakes.get(id) + '** mistakes!')
        }
        else if (args[1] !== undefined) {
            let id = filterId(args[1]);
            if (message.guild.members.cache.get(id) !== undefined) {
                if (message.guild.members.cache.get(id).user.bot) 
                    return message.channel.send('**BOTS** makes NO mistakes!');
                //if not in collection add it in and display in discord, else display count in discord
                if (bot.mistakes.get(id) === undefined) {
                    bot.mistakes.set(id, 0);
                    message.channel.send(args[1] + ' has made **0** mistakes');
                    return;
                }
                const discord = require('discord.js');
                let embed = new discord.MessageEmbed().setTitle('Mistakes Made');
                embed.setDescription(args[1] + ' has made **' + bot.mistakes.get(id) + '** mistakes');
                return message.channel.send({embeds: [embed] });
            }
            
            return message.channel.send('Member Not Found!');
        }
        
        //list all member's
        const discord = require('discord.js');
        let embed = new discord.MessageEmbed().setTitle('Mistakes Made');
        let data = "";

        for (const id of bot.mistakes.keys()) {
            if (message.guild.members.cache.get(id) !== undefined)
                data += '<@' + id + '> : ' + bot.mistakes.get(id) + '\n';
        }
        embed.setDescription(data);
        message.channel.send({embeds: [embed]});
    }
}



function filterId(tag) {
    return tag.substring(2).split('>')[0];
}