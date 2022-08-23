module.exports = {
    name: "error",
    description: "Sends error message",
    alias: ["err"],
    category: ["misc"],
    help: {content: "can provide a number for a specific error message"},
    execute(para) {     //para: { message, args, bot, countOnly }
        let num;
        if (para['args'][0] === 'error' || para['args'][0] === 'err') {                  //triggered as command
            num = Number(para['args'][1]) >= 1 ? Number(para['args'][1]) : undefined;
        }
        else {                                              //Error made
            //increment mistake count for user
            let misCount = para['bot'].mistakes.get(para['message'].author.id);
            para['bot'].mistakes.set(para['message'].author.id, misCount !== undefined ? ++misCount : 1);
        }
        if (para['countOnly']) return; //Some commands may have custom error msg's

        const NUM_OF_MESSAGES = 10;
        let msgContent = {content: '???'};
        if (num === undefined || num > NUM_OF_MESSAGES) 
            num = Math.floor((Math.random() * NUM_OF_MESSAGES) + 1);
        switch (num) {
            case 1:
                msgContent['content'] = 'w-what?!?!?';
                break;
            case 2:
                msgContent['content'] = para['message'].author.toString() + ' <= I\'m with idiot';
                break;
            case 3:
                msgContent['content'] = 'this\n\n\"' + para.message.content + '\"\n\nis NOT a command, try another';
                break;
            case 4:
                msgContent['content'] = 'If I get a penny for everytime you mess up... I\'d still be broke';
                break;
            case 5:
                msgContent['content'] = 'A RED SPY IS THE BASE!!!\nOh wait, it\'s just ' + para['message'].author.toString() + ' making bad commands';
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

        para['message'].channel.send(msgContent);
    }
}
