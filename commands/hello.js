//USE AS TEMPLATE COMMAND
module.exports = {
    name: "hello",
    description: "Say hello to the Bot :)",
    alias: ["hi", "hey", "hellothere", "sup", "howdy"],
    help: { //message json data
        content: "What? You want help with saying **hello**?"
    },
    category: "fun",
    execute(message, args, bot) {
        //Your lightsaber will make a fine addition to my collection
        if (args[0].startsWith('hellothere')) {
            let temp = require('discord.js');
            message.channel.send({
                embeds: [
                    new temp.MessageEmbed()
                        .setImage('https://c.tenor.com/smu7cmwm4rYAAAAC/general-kenobi-kenobi.gif')
                        .setColor('#dce100')
                ]
            })
        }

        //regular hello
        message.channel.send('Hello There!');
    }
}