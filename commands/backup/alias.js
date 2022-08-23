const dis = require("discord.js");

module.exports = {
    name: "alias",
    description: "Shows alias names for commands",
    alias: ["al"],
    help: { 
        content: "`alias [command name]`"
    },
    category: "info",
    execute(para) {
        if (para.args.length < 2) 
            return para.message.channel.send("another command name required after typing in this command.\n" + this.help.content);
        if ( !para.bot.commands.has(para.args[1]) )
            return para.message.channel.send("unknown command!");
        
        let cmd = para.bot.commands.get(para.args[1]);
        let embed = new dis.MessageEmbed();
        embed.setTitle("Alias for " + cmd.name)
        embed.setDescription("");
        for (const al of cmd.alias)
            embed.description += al + "\n";
        para.message.channel.send({embeds: [embed] });
    }
}