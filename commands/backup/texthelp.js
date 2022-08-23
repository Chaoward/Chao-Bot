const dis = require('discord.js');

module.exports = {
    name: "texthelp",
    description: "display a list of discord message edit prefixing",
    alias: ["th"],
    help: {
        content: "display a list of discord message edit prefixing"
    },
    category: "info",
    execute(para) {
        let embed = new dis.MessageEmbed( { footer: {text: 'modifiers are place before and after text to affect'} })
            .setDescription('*Italicize:* * \n'
                + '**Bold:** ** \n'
                + '__Underline:__ __ \n'
                + '~~Strike:~~ ~~ \n'
                + '`Code Block Single Line:` ` \n'
                + '```Code Block\nMultiLine:``` ```\n'
            );
        para.message.channel.send({embeds: [embed]});
    }
}