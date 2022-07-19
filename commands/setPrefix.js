module.exports = {
    name: 'setprefix',
    description: 'set a custom prefix for the server',
    alias: ["setp", "setpre", "setpfx"],
    help: { //message json data
        content: "`+setprefix [custom prefix (no spaces)]`"
    },
    category: "utility",
    execute(message, args, bot) {
        if (message.channel.type === "DM") 
            return message.channel.send("Server command only!");
        if ( !(message.member.permissions.has("MANAGE_GUILD") ||
               message.member.permissions.has("ADMINISTRATOR")) ) 
            return message.channel.send("You need **permissions** to manage the server.");
        if (args.length < 2)
            return message.channel.send("A custom prefix is needed");
        
        bot.prefixes.set(message.guild.id, args[1]);
        message.channel.send("Server Prefix set to `*" + args[1] + "*`");
    }
}