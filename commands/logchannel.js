//embed colors: eb3434(removing), 096e08(confirm)
const PATH = "./data/logchannels.json";

module.exports = {
    name: "logchannel",
    description: "Sets up or removes an audit logging channel for the server. (limited)",
    alias: ["logc", "lc"],
    help: { //message json data
        content: "`logchannel [#channel]` to setup\n`logchannel remove` to uh, removed."
    },
    category: "mod",
    startUp: function (bot, dis) {
        console.log("Loading Log-Channel Data...");
        bot.logChannels = new dis.Collection();         //<guildId, channelId> (String, Number)
        const fs = require("fs");
        
        const data = JSON.parse(fs.readFileSync(PATH));
        for (const key in data)
            bot.logChannels.set(key, data[key]);
    },
    execute(message, args, bot) {
        try {
            //check permissions
            const {Permissions} = require("discord.js");
            if (!message.member.permissions.any(
                [
                    Permissions.FLAGS.VIEW_AUDIT_LOG,
                    Permissions.FLAGS.MANAGE_CHANNELS
                ], true)) throw {str: "You need Permissions `view audit log` and `manage channels` to use the commad."};
            if (args.length < 2) throw {str: "You need to #/@ the channel you want to setup."};

            //determine if "remove"
            let channel;
            let embed;
            if (args[1] === "remove") {
                if (!bot.logChannels.has(message.guild.id)) throw {str: "No Log Channel to Remove. All is Good!"};
                channel = message.guild.channels.cache.get( bot.logChannels.get(message.guild.id) );
                embed = {
                    title: "Are You Sure You Want to Remove this Logging Channel?",
                    description: "Please Confirm\n**Channel:** " + channel.toString(),
                    color: 0xeb3434
                };
            }
            else {
                const {getMentionId} = require("../imports/utils");
                //check if channel exist
                channel = message.guild.channels.cache.get( getMentionId(args[1]) );
                if (channel == undefined) throw {str: "Channel Not Found!"};
                if (bot.logChannels.get(message.guild.id) === channel.id) throw {str: "Already a logging Channel."};

                embed = {
                    title: "This Channel will be the Server's Logging Channel",
                    description: "Please Confirm\n**Channel:** " + channel.toString(),
                    color: 0x096e08
                };

            }

            let buttons = {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        label: '✅',
                        custom_id: "confirm"
                    },
                    {
                        type: 2,    //button
                        style: 4,
                        label: '❌',
                        custom_id: "cancel"
                    }
                ]
            };
            //send confirmation embed
            channel.send({
                content: message.author.toString(),
                embeds: [embed],
                components: [buttons]
            });

        } catch (error) {
            if (error.str !== undefined)
                return message.channel.send(error.str);
            throw error;
        }
    },
    interact: function (interaction, bot) {
        const {getMentionId} = require("../imports/utils");

        if (String(interaction.user.id) !== getMentionId(interaction.message.content)) return;
        if (interaction.customId === "cancel") return interaction.message.delete();
        if (interaction.customId !== "confirm") return;

        let newEmbed = {color: 0x000000};
        switch (interaction.message.embeds[0].color) {
            //remove
            case 0xeb3434: 
                bot.logChannels.delete(interaction.message.guild.id);
                newEmbed["title"] = "Logging Channel Removed!";
                break;

            //add
            case 0x096e08:
                bot.logChannels.set(String(interaction.message.guild.id), interaction.message.channel.id); //assuming that prompt was sent to the target channel
                newEmbed["title"] = "Logging Channel SET!";
                newEmbed["description"] = "Added " + interaction.message.channel.toString() + " as an audit logging channel.";
                break;

            default:
                return;
        }

        //update save file
        const fs = require("fs");
        //fs.writeFileSync(PATH, JSON.stringify(bot.logChannels.toJSON()));
        let data = {};
        for (const key of bot.logChannels.keys()) {
            data[key] = Number(bot.logChannels.get(key));
        }
        fs.writeFileSync(PATH, JSON.stringify(data));

        //update embed
        interaction.update({ embeds: [newEmbed], components: [] });
    }
}