//USE AS TEMPLATE COMMAND
module.exports = {
    name: "hello",
    description: "Say hello to the Bot :)",
    alias: ["hi", "hey", "hellothere", "sup", "howdy"],
    help: { //message json data
        content: "What? You want help with saying **hello**?"
    },
    category: "fun",
    execute(para) {
        //Your lightsaber will make a fine addition to my collection
        if (para['args'][0].startsWith('hellothere')) {
            let temp = require('discord.js');
            para['message'].channel.send({
                embeds: [
                    new temp.MessageEmbed()
                        .setImage('https://c.tenor.com/smu7cmwm4rYAAAAC/general-kenobi-kenobi.gif')
                        .setColor('#dce100')
                ]
            })
        }

        //regular hello
        para['message'].channel.send('Hello There!');
    }
}