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
    execute(para) {
        if (para.args.length > 1) { //member eject
            if (!para.message.member.permissions.has('MOVE_MEMBERS'))
                return message.channel.send('You don\'t have the **permissions** for this :(');
            let userId = require('./tools').getMentionId(para.args[1]);
            if (para.message.guild.members.cache.has(userId)) {
                para.message.guild.voiceStates.cache.get(userId).disconnect('You Got EJECTED!!!');
                para.message.channel.send('. 　　　。　　　　•　 　ﾟ　　。 　　.\n'
                    + '　　　.　　　 　　.　　　　　。　　 。　. 　\n'
                    + '.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•\n'
                    + '　ﾟ　　 ' + para.args[1] + ' was ejected.　 。　.\n'
                    + '\'　　　　　 • 　 　　。          ,\n'
                　  + '　ﾟ　　　.　　　. ,　　　　.\''
                );
            }
            else 
                para.message.channel.send('Member Not Found!');
        }
        else { //self eject
            para.message.member.voice.disconnect('You Got EJECTED!!!');
            para.message.channel.send('. 　　　。　　　　•　 　ﾟ　　。 　　.\n'
                + '　　　.　　　 　　.　　　　　。　　 。　. 　\n'
                + '.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•\n'
                + '　ﾟ　　 ' + para.message.member.toString() + ' was ejected.　 。　.\n'
                + '\'　　　　　 • 　 　　。          ,\n'
        　      + '　ﾟ　　　.　　　. ,　　　　.\''
            );
        }
    }
}