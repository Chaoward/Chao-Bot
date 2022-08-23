module.exports = {
    name: 'setprefix',
    description: 'set a custom prefix for the server',
    alias: ["setp", "setpre", "setpfx"],
    help: { //message json data
        content: "`+setprefix [custom prefix (no spaces)]`"
    },
    category: "utility",
    execute(para) {
        if (para.message.channel.type === "DM") 
            return para.message.channel.send("Server command only!");
        if ( !(para.message.member.permissions.has("MANAGE_GUILD") ||
               para.message.member.permissions.has("ADMINISTRATOR")) ) 
            return para.message.channel.send("You need **permissions** to manage the server.");
        if (para.args.length < 2)
            return para.message.channel.send("A custom prefix is needed");
        
        para.bot.prefixes.set(para.message.guild.id, para.args[1]);
        para.message.channel.send("Server Prefix set to `*" + para.args[1] + "*`");
    }
}