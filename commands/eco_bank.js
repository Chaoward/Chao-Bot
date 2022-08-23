const FILE_PATH = "./data/crypto/";

module.exports = {
    name: "bank",
    description: "Displays your crypto profile",
    alias: ["eb"],
    help: { //message json data
        content: "Displays your crypto profile. Basically how much Pseudo-coins you have."
    },
    category: "crypto",
    execute(message, args, bot) {
        let profile;

        try {
            //checks if it's the profile of self or other users
            if (args.length > 1) {
                if (message.channel.isDMBased()) throw {str: "Can only lookup the profiles of people in the server"}
                const {getMentionId} = require("../imports/utils");
                //check if member exist
                const id = getMentionId(args[1]);
                if (!message.guild.members.cache.has(id)) throw {str: "Member Not Found!"};
                profile = this.ProfileHandler.getProfile(id);
            }
            else {
                profile = this.ProfileHandler.getProfile(message.author.id);
            }

            const dis = require("discord.js");
            let embed = 
                new dis.MessageEmbed({
                    title: message.author.username + "#" + message.author.discriminator,
                    description: "**Psuedo-Coins(PC):** " + String(profile.coins) + "\n"
                        + "**Unique Currencies:** " + String(profile.currencies.length) + "\n"
                        + "**Created Currencies:** " + String(profile.created_currencies.length) + "\n",
                    color: 0x8034eb
                });
            getFields(embed, profile);
            
            //sends embed of details in current channel if there is no crypto channels/DM channels
            if (message.channel.isDMBased() || message.guild == undefined) {
                message.channel.send({embeds: [embed]});
            }
            //else send and @ user to the channel if command was used outside the crypto-channel
            if (bot.cryptoChannels.has(message.guild.id))
                if (bot.cryptoChannels.get(message.guild.id) === message.channel.id)
                    message.reply({embeds:[embed]});    //reply if sending to current channel
                else
                    message.guild.channels.cache.get(bot.cryptoChannels.get(message.guild.id)).send({
                        content: message.author.toString(), 
                        embeds: [embed]
                    });
            else
                message.reply({embeds:[embed]});        //reply if no crypto-channel exist
        } catch (error) {
            if (error.str !== undefined)
                return message.reply(error.str);
            throw error;
        }
    },
    ProfileHandler: class {
        static update(memberId, newData) {
            const fs = require("fs");

            fs.writeFileSync(FILE_PATH + String(memberId) + ".json", JSON.stringify(newData));
        }

        static getProfile(memberId) {
            const fs = require("fs");
            const path = FILE_PATH + String(memberId) + ".json";
    
            //check if exist
            if (fs.existsSync(path)) return JSON.parse( fs.readFileSync(path) );
            //create new profile
            let newData = {
                coins: 0,
                currencies: [],
                created_currencies: [],
                meta: {
                    dailyDate: [0, 0, 0],
                    dailyAmount: 10
                }
            };
            fs.writeFileSync(path, newData);
            return newData;
        }
    }
}


                  
function getFields(embed, profile) {
    const CHAR_FIELD_LIMIT = 1024;
    embed.addfield({name: "Currencies Owned", value: ""});

    //check char limit
    for (let coin of profile.currencies)
        //add line
        if (embed.fields[0].length + coin.name.length + 3 + String(coin.amount).length < CHAR_FIELD_LIMIT)
            embed.fields[0].value += coin.name + ": " + String(coin.amount) + "\n";
        //if passed field limit end with "..."
        else if (embed.fields[0].length + 3 < CHAR_FIELD_LIMIT) {
            embed.fields[0].value += "...";
            break;
        }
    
    embed.addfield({name: "Currencies Created", value: ""});
    for (let coin of profile.created_currencies)
        //add line
        if (embed.fields[1].length + coin.name.length + 1 < CHAR_FIELD_LIMIT)
            embed.fields[1].value += coin.name + "\n";
        //if passed field limit end with "..."
        else if (embed.fields[1].length + 3 < CHAR_FIELD_LIMIT) {
            embed.fields[1].value += "...";
            break;
        }
}