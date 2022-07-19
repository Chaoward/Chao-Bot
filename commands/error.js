const FILE_PATH = './data/mistakes.json';   //NOTE: When fs reads/writes the pathing starts from main.js
                                            //      NOT from the current file dir.
module.exports = {
    name: "error",
    description: "Sends error message",
    alias: ["err"],
    category: "misc",
    help: {content: "can provide a number for a specific error message"},
    startUp: function (bot, discord) {
        // adds a "mistakes" Collection to bot obj and loads mistakes data
        bot.mistakes = new discord.Collection();    // (userID, count) <String, number>
        let fs = require("fs");
        let data = JSON.parse( fs.readFileSync(FILE_PATH) );
        for (const id in data) {
            bot.mistakes.set(id, data[id]);
        }
    },
    increment: function (id, bot) {                        // can be called in other cmds for their own errors
        //increment mistake count for user
        let fs = require("fs");
        let misCount = bot.mistakes.get(id);
        bot.mistakes.set(id, misCount !== undefined ? ++misCount : 1);
        //save
        let data = JSON.parse( fs.readFileSync(FILE_PATH) );
        data[id] = bot.mistakes.get(id);
        fs.writeFileSync(FILE_PATH, JSON.stringify(data));
    },
    execute(message, args, bot) {
        let num;
        if (args[0] === 'error' || args[0] === 'err') {                  //triggered as command
            num = Number(args[1]) >= 1 ? Number(args[1]) : undefined;
        }
        else {                                                           //Error made
            this.increment(message.author.id, bot);
        }
        //if (para['countOnly']) return; //Some commands may have custom error msg's

        const NUM_OF_MESSAGES = 10;
        let msgContent = {content: '???'};
        if (num === undefined || num > NUM_OF_MESSAGES) 
            num = Math.floor((Math.random() * NUM_OF_MESSAGES) + 1);
        switch (num) {
            case 1:
                msgContent['content'] = 'w-what?!?!?';
                break;
            case 2:
                msgContent['content'] = message.author.toString() + ' <= I\'m with idiot';
                break;
            case 3:
                msgContent['content'] = 'this\n\n\"' + message.content + '\"\n\nis NOT a command, try another';
                break;
            case 4:
                msgContent['content'] = 'If I get a penny for everytime you mess up... I\'d still be broke';
                break;
            case 5:
                msgContent['content'] = 'A RED SPY IS THE BASE!!!\nOh wait, it\'s just ' + message.author.toString() + ' making bad commands';
                break;
            case 6:
                msgContent['content'] = 'As you can see ^^^ this is a mistake';
                break;
            case 7: 
                msgContent['content'] = 'good mistake, <:a:704161660956442715> for Average';
                break;
            case 8: 
                const temp = require('discord.js');
                msgContent = {
                    embeds: [
                        new temp.MessageEmbed()
                            .setImage('https://cdn.discordapp.com/attachments/704921980507521136/704926002911903825/668344130803335173.png')
                            .setColor('#dce100')
                    ]
                };
                break;
            case 9:
                msgContent['content'] = '(ノಠ益ಠ)ノ彡┻━┻ STOP!';
                break;
            case 10:
                msgContent['content'] = 'Mistakes were Made';
                break;
        }

        message.channel.send(msgContent);
    }
}