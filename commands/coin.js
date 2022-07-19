const discord = require('discord.js');
const FILE_PATH = "./data/coins.json";

module.exports = {
    name: 'coin',
    description: 'give a coin to a user',
    alias: [],
    help: { //message json data
        embeds: [
            new discord.MessageEmbed()
                .setTitle("help coin")
                .setDescription("by default will give a coin to self")
                .addFields([
                    {
                        name: "adds custom amount to self",
                        value: "`+coin self [number of coins]`"
                    },
                    {
                        name: "display coin list",
                        value: "`+coin list`"
                    },
                    {
                        name: "adds custom amount to others",
                        value: "`+coin [@user] [number of coins](optional)`\nadd 1 coin by default"
                    },
                    {
                        name: "removes coins from user",
                        value: "`+coin remove [@user] [number of coins](optional)`\nremoves 1 coin by default"
                    }
                ])
        ]
    },
    category: "fun",
    startUp: function (bot, dis) {
        bot.coins = new dis.Collection();       // (userID, count) <String, number>
        let fs = require("fs");
        let data = JSON.parse( fs.readFileSync(FILE_PATH) );
        for (const id in data) {
            bot.coins.set(id, data[id]);
        }
    },
    execute(message, args, bot) {
        //displaying coin count of sender
        if (message.channel.type === 'dm' || args[1] === undefined) { //DM checker here
            message.channel.send('You have **' + bot.coins.get(message.author.id) + '** coin(s).');
        }
        //display count list for all users in the server
        else if (args[1] === 'list') {
            let listStr = '';
            for (id of bot.coins.keys()) {
                if (id !== '') {
                    listStr += '<@!' + id + '> : ' + bot.coins.get(id) + '\n';
                }
            }
            let embed = new discord.MessageEmbed()
                .setTitle('Coin Count')
                .setDescription(listStr);
            message.channel.send({embeds: [embed]});
        }
        //give coin to yourself
        else if (args[1] === 'self') {
            let count = bot.coins.get(message.author.id);
            bot.coins.set(message.author.id, count === undefined ? 1 : ++count);
            message.channel.send('You gave yourself a coin.');
        }
        //remove coins from someone
        //removing will check if the result is negative and will set final count to 0 if so
        else if (args[1] === 'remove') {
            let id = getMentionId(args[2]);
            if (args[2] === 'self') {   //remove from self
                let subCount = args[3] === undefined ? 1 : Number.parseInt(args[3]);
                let result = Number.parseInt(bot.coins.get(message.author.id)) - subCount;
                bot.coins.set(message.author.id, result < 0 ? 0 : result);
                message.channel.send('You removed **' + subCount + '** coin(s)');
            }
            else if (message.guild.members.cache.get(id) !== undefined) {
                if (bot.coins.get(id) === undefined || bot.coins.get(id) === '0') {
                    bot.coins.set(id, 0);
                    return message.channel.send('Bro they\'re broke.');
                }
                let subCount = args[3] === undefined ? 1 : Number.parseInt(args[3]);
                let result = Number.parseInt(bot.coins.get(id)) - subCount;
                bot.coins.set(id, result < 0 ? 0 : result);

                let embed = new discord.MessageEmbed()
                    .setTitle("Coin Removed")
                    .setDescription(message.author.toString() + ' removed **'
                        + subCount + '** coin(s) from ' + args[2]);
                save(bot);
                message.channel.send({embeds: [embed] });
            }
            else
                return message.channel.send('Member not found!');            
        }
        //give coins to someone
        else {
            let id = getMentionId(args[1]);
            if (message.guild.members.cache.get(id) !== undefined) {
                let addAmount = (args[2] === undefined ? 1 : Number.parseInt(args[2]));
                if (bot.coins.get(id) === undefined) {
                    bot.coins.set(id, addAmount);
                }
                else 
                    bot.coins.set(id, Number.parseInt(bot.coins.get(id)) + addAmount);

                let embed = new discord.MessageEmbed()
                    .setTitle('Coin Get')
                    .setDescription(message.author.toString() + ' gave ' + args[1]
                        + ' **' + addAmount + '** coin(s)');
                save(bot);
                return message.channel.send({embeds: [embed]});
            }
            else {
                return message.channel.send('Member not found!');
            }
        }
        save(bot);
    }
}



function save(bot) {
    let fs = require("fs");
    let data = {};
    for (const id of bot.coins.keys()) {
        data[id] = bot.coins.get(id);
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data));
}


//===== getMentionId =======================
/* returns id of the passed in mention. */
//==========================================
function getMentionId(string) {
    if (!String(string).startsWith('<') && !String(string).endsWith('>')) return undefined;

    string = string.substr(2);
    if (string.startsWith('!'))     //Note: server nicknames adds a '!' to the string
        string = string.substr(1);  //removes the '!'
    return string.split('>')[0];
}