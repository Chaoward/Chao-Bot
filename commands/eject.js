const dis = require("discord.js");

module.exports = {
    name: "eject",
    description: "eject yourself or someone else (VC kicks)",
    alias: ["ej"],
    help: { //message json data
        embeds: [
            new dis.MessageEmbed()
                .setTitle("help \"eject\"")
                .setDescription("**as is:** ejects msg and disconects you from VC\n"
                    + "**@ a member:** `eject [@ member]` to do it to them\n"
                    + "(permission needed for VC kick)"
            )]
    },
    category: "fun",
    execute(message, args, bot) {
        if (args.length > 1) { //member eject
            if (!message.member.permissions.has('MOVE_MEMBERS'))
                return message.channel.send('You don\'t have the **permissions** for this :(');
            let userId = require('../imports/utils').getMentionId(args[1]);
            if (message.guild.members.cache.has(userId)) {
                message.guild.voiceStates.cache.get(userId).disconnect('You Got EJECTED!!!');
                message.channel.send('. 　　　。　　　　•　 　ﾟ　　。 　　.\n'
                    + '　　　.　　　 　　.　　　　　。　　 。　. 　\n'
                    + '.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•\n'
                    + '　ﾟ　　 ' + args[1] + ' was ejected.　 。　.\n'
                    + '\'　　　　　 • 　 　　。          ,\n'
                　  + '　ﾟ　　　.　　　. ,　　　　.\''
                );
            }
            else 
                message.channel.send('Member Not Found!');
        }
        else { //self eject
            message.member.voice.disconnect('You Got EJECTED!!!');
            message.channel.send('. 　　　。　　　　•　 　ﾟ　　。 　　.\n'
                + '　　　.　　　 　　.　　　　　。　　 。　. 　\n'
                + '.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•\n'
                + '　ﾟ　　 ' + message.member.toString() + ' was ejected.　 。　.\n'
                + '\'　　　　　 • 　 　　。          ,\n'
        　      + '　ﾟ　　　.　　　. ,　　　　.\''
            );
        }
    }
}