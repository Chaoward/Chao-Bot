//embed color: f58484

module.exports = {
    name: "vckick",
    description: "Offer a poll to kick a member from a voice channel.",
    alias: ["vckic"],
    help: { //message json data
        content: "Offer a poll to kick a member from a voice channel.\n```vckick **[@memberName]** **[reason](optional)**```"
    },
    category: "misc",
    startUp: function (bot, dis) {
        bot.vckick = {};
    },
    execute(message, args, bot) {
        try {
            if (!message.inGuild()) throw {str: "Guild Command only"};
            //can only execute if user is in a vc
            if (message.member.voice.channel == undefined) throw {str: "You need to be in a voice channel to call the vote."};
            //check if member exist, and in the same channel as user
            if (args.length < 2) throw {str: "You need to @ a member to offer a poll"};
            const {getMentionId} = require("../imports/utils");
            let trgtMem = message.guild.members.cache.get( getMentionId(args[1]) );
            if ( trgtMem == undefined ) throw {str: "Member Not Found!"};
            //check for pending poll
            if (bot.vckick[String(trgtMem.id)] !== undefined) throw {str: "This member already has a vckick poll in progress"};
            //setup embed and send
            let vcChannel = trgtMem.voice.channel;
            let trgtCount = String( Math.round((vcChannel.members.size - 1) / 2) ).split(".")[0];
            if (trgtCount == 0) throw {str: "None are around to vote them out"};
            const curMsg = vcChannel.send({
                embeds: [
                    {
                        title: "Vote to Kick from Voice Channel",
                        description: "0/" + String(trgtCount),
                        color: 0xf58484,
                        fields: [
                            {
                                name: "Target Member",
                                value: trgtMem.toString()
                            }
                        ]
                    }
                ]
            });
            //save target member in bot obj
            if (bot.vckick == undefined)
                bot.vckick = {};
            bot.vckick[String(trgtMem.id)] = {
                member: trgtMem,
                time: new Date().getTime()
            };
            //ini reactions for voting buttons
            curMsg.then( (m) => {
                m.react('✅');
                m.react('❌');
            });
        }
        catch (error) {
            if (error.str !== undefined)
                return message.channel.send(error.str);
            throw error;
        }
    },
    react: function(reaction, user, isAdd, bot) {
        const {getMentionId} = require("../imports/utils");
        let embed = reaction.message.embeds[0];
        const trgtData = bot.vckick[ getMentionId(embed.fields[0].value) ];

        //check expiration date
        if ( (new Date()).getTime() - trgtData.time >= 600000 ) {   //ten minute limit
            delete bot.vckick[getMentionId(embed.fields[0].value)];
            embed = {
                title: "VcKick Vote Expired",
                description: "Passed the **ten minute** time limit!",
                color: 0x000000
            };
            reaction.message.edit({ embeds: [embed] });
            return;
        }
        //vote count and needed count are in the descriptions
        let counts = embed.description.split("/");
        for (let i = 0; i < counts.length; ++i) counts[i] = Number(counts[i]);
        //increment/decrement vote
        if (reaction.emoji.toString() === '✅') {
            counts[0] += isAdd ? 1 : -1;
        }
        else if (reaction.emoji.toString() === '❌') {
            counts[0] += isAdd ? -1 : 1;
        }
        else return;
        //update embed
        embed.description = String(counts[0]) + "/" + String(counts[1]);
        //reaction.message.edit({embeds: [embed]});
        //determine if vote passes
        if (counts[0] >= counts[1]) {
            //if passes kick member from vc
            const trgtChannel = reaction.message.guild.members.cache.get(getMentionId(embed.fields[0].value)).voice.channel;
            //if the member left before the vote passes reserve it for when the member joins another vc
            if (trgtChannel == undefined ) {
                bot.vckick[String(trgtData.member.id)]["kick"] = true;
                embed = {
                    title: "✅ Vote Success However...",
                    description: trgtData.member.toString() + " has left the voice channel before the disconnect could take place. They will be disconnected the next time they join a voice channel",
                    color: 0x000000
                }
            }
            else {
                trgtData.member.voice.disconnect();
                embed = {
                    title: "✅ Vote Success",
                    description: trgtData.member.toString() + " has been kicked from " + trgtChannel.toString(),
                    color: 0x000000
                }
                delete bot.vckick[String(trgtData.member.id)];
            }
        }
        else if (reaction.message.reactions.cache.size - 2 >= counts[1]) {
            //votes can fail, if so edit the embed to cancel
            embed = {
                title: "❌ Vote Failed",
                description: trgtData.member.toString() + " was saved",
                color: 0x000000
            }
        }
        
        reaction.message.edit({embeds: [embed]});
    }
}