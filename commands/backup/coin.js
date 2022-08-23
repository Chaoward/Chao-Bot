const discord = require('discord.js');

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
    execute(para) {
        //displaying coin count of sender
        if (para.message.channel.type === 'dm' || para.args[1] === undefined) { //DM checker here
            para.message.channel.send('You have **' + para.bot.coins.get(para.message.author.id) + '** coin(s).');
        }
        //display count list for all users in the server
        else if (para.args[1] === 'list') {
            let listStr = '';
            for (id of para.bot.coins.keys()) {
                if (id !== '') {
                    listStr += '<@!' + id + '> : ' + para.bot.coins.get(id) + '\n';
                }
            }
            let embed = new discord.MessageEmbed()
                .setTitle('Coin Count')
                .setDescription(listStr);
            para.message.channel.send({embeds: [embed]});
        }
        //give coin to yourself
        else if (para.args[1] === 'self') {
            let count = para.bot.coins.get(para.message.author.id);
            para.bot.coins.set(para.message.author.id, count === undefined ? 1 : ++count);
            para.message.channel.send('You gave yourself a coin.');
        }
        //remove coins from someone
        //removing will check if the result is negative and will set final count to 0 if so
        else if (para.args[1] === 'remove') {
            let id = getMentionId(para.args[2]);
            if (para.args[2] === 'self') {   //remove from self
                let subCount = para.args[3] === undefined ? 1 : Number.parseInt(para.args[3]);
                let result = Number.parseInt(para.bot.coins.get(para.message.author.id)) - subCount;
                para.bot.coins.set(para.message.author.id, result < 0 ? 0 : result);
                para.message.channel.send('You removed **' + subCount + '** coin(s)');
            }
            else if (para.message.guild.members.cache.get(id) !== undefined) {
                if (para.bot.coins.get(id) === undefined || para.bot.coins.get(id) === '0') {
                    para.bot.coins.set(id, 0);
                    return para.message.channel.send('Bro they\'re broke.');
                }
                let subCount = para.args[3] === undefined ? 1 : Number.parseInt(para.args[3]);
                let result = Number.parseInt(para.bot.coins.get(id)) - subCount;
                para.bot.coins.set(id, result < 0 ? 0 : result);

                let embed = new discord.MessageEmbed()
                    .setTitle("Coin Removed")
                    .setDescription(para.message.author.toString() + ' removed **'
                        + subCount + '** coin(s) from ' + para.args[2]);
                save();
                para.message.channel.send(embed);
            }
            else
                return para.message.channel.send('Member not found!');            
        }
        //give coins to someone
        else {
            let id = getMentionId(para.args[1]);
            if (para.message.guild.members.cache.get(id) !== undefined) {
                let addAmount = (para.args[2] === undefined ? 1 : Number.parseInt(para.args[2]));
                if (para.bot.coins.get(id) === undefined) {
                    para.bot.coins.set(id, addAmount);
                }
                else 
                    para.bot.coins.set(id, Number.parseInt(para.bot.coins.get(id)) + addAmount);

                let embed = new discord.MessageEmbed()
                    .setTitle('Coin Get')
                    .setDescription(para.message.author.toString() + ' gave ' + para.args[1]
                        + ' **' + addAmount + '** coin(s)');
                save();
                return para.message.channel.send({embeds: [embed]});
            }
            else {
                return para.message.channel.send('Member not found!');
            }
        }
        save();
    }
}



function save() {
    let data = require(FILE_PATH_COUNT);
    let fs = require("fs");
    for (const id of bot.coins.keys()) {
        data.coins[id] = bot.coins.get(id);
    }
    fs.writeFileSync(FILE_PATH_COUNT, JSON.stringify(data));
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