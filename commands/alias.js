const dis = require("discord.js");

module.exports = {
    name: "alias",
    description: "Shows alias names for commands",
    alias: ["al"],
    help: { 
        content: "`alias [command name]`"
    },
    category: "info",
    execute(message, args, bot) {
        if (args.length < 2) 
            return message.channel.send("another command name required after typing in this command.\n" + this.help.content);
        if ( !bot.commands.has(args[1]) )
            return message.channel.send("unknown command!");
        
        let cmd = bot.commands.get(args[1]);
        let embed = new dis.MessageEmbed();
        embed.setTitle("Alias for " + cmd.name)
        embed.setDescription("");
        for (const al of cmd.alias)
            embed.description += al + "\n";
        message.channel.send({embeds: [embed] });
    }
}