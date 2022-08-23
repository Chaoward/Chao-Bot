//embed color: 15f00b
const FILE_PATH = "./data/crypto/channels.json";

module.exports = {
    name: "setchannel",
    description: "Dedicate a text channel to the crypto-space",
    alias: [],
    help: { //message json data
        content: "Set a channel for the crypto-space and features. Doing so your server will have access to crypto commands, features, economy system and events."
            + "\n```setchannel **[#channel]**```"
            + "\n(NOT related to real crypto)"
    },
    category: "crypto",
    startUp: function (bot, dis) {
        console.log("Loading Crypto-Channel Data...");
        //channel collection
        bot.cryptoChannels = new dis.Collection();          // (serverID, channelDetail) <number, Object>
        let fs = require("fs");
        if (!fs.existsSync(FILE_PATH))                      //create empty array json if Not-exist
            fs.writeFileSync(FILE_PATH, "[]");
        let data = JSON.parse(fs.readFileSync(FILE_PATH));
        for (const i of data) {
            bot.cryptoChannels.set(i.serverId, i);
        }
    },
    execute(message, args, bot) {
        try {
            let curChannel = bot.cryptoChannels.get(message.guild.id);
            if (curChannel == undefined) {
                curChannel = {
                    serverId: message.guild.id,
                    channelId: undefined,
                    permissions: {
                        manageChannels: false,
                        admin: true
                    }
                };
                bot.cryptoChannels.set(curChannel.serverId, curChannel);
            }
            this.checkPermission(message, message.member, curChannel);
            if (args.length < 2) throw { str: "You need to mention the channel you wanted to set as the crypto-channel" };
            //options menu
            if (args[1] === "options" || args[1] === "option") {
                let embed = {
                    title: "Set-Channel Options",
                    fields: [
                        {
                            name: "1️⃣ Allow `Manage Channel` permission",
                            value: String(curChannel.permissions.manageChannels)
                        },
                        {
                            name: "2️⃣ Allow `Admin` permission",
                            value: String(curChannel.permissions.admin)
                        }
                    ],
                    color: 0x15f00b
                };
                message.channel.send({
                    embeds: [embed],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 2,
                                    label: '1️⃣',
                                    custom_id: "manageChannels"
                                },
                                {
                                    type: 2,
                                    style: 2,
                                    label: '2️⃣',
                                    custom_id: "admin"
                                }
                            ]
                        }
                    ]
                });
                return;
            }

            //check if channel exist and send confirmation notifi. to the channel
            let { getMentionId } = require("../imports/utils");
            let id = getMentionId(args[1]);
            let guildChannel = message.guild.channels.cache.get(id);
            if (guildChannel == undefined) throw { str: "Channel Not Found!" };
            if (curChannel.channelId !== undefined)
                if (curChannel.channelId === id) //cancels if crypto-channel is already set to the passed in channel
                    throw { str: "The channel is already a crypto-channel" };

            //send confirmation embed
            guildChannel.send({
                content: message.author.toString(),
                embeds: [
                    {
                        title: "This channel will be set as a __cypto-channel__",
                        description: "Please confirm",
                        color: 0x15f00b,
                        footer: {
                            text: message.author.toString(),
                            iconURL: message.author.avatarURL()
                        }
                    }
                ],
                components: [
                    {
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
                    }
                ]
            });

        } catch (error) {
            if (error.str !== undefined)
                return message.channel.send(error.str);
            else
                throw error;
        }
    },
    interact: function (interaction, bot) {
        try {
            let curChannel = bot.cryptoChannels.get(interaction.guildId);
            this.checkPermission(interaction.message, interaction.member, curChannel);
            //determine which type of embed
            let embed = interaction.message.embeds[0];
            const { getMentionId } = require("../imports/utils");
            if (embed.footer == undefined) {                            //Options embed
                curChannel.permissions[interaction.customId] = !curChannel.permissions[interaction.customId];
                //update embed
                embed = {
                    title: embed.title,
                    fields: [
                        {
                            name: embed.fields[0].name,
                            value: String(curChannel.permissions.manageChannels)
                        },
                        {
                            name: embed.fields[1].name,
                            value: String(curChannel.permissions.admin)
                        }
                    ],
                    color: embed.color
                };
                //save
                bot.cryptoChannels.set(interaction.guildId, curChannel);
                let fs = require("fs");
                fs.writeFileSync(FILE_PATH, JSON.stringify(bot.cryptoChannels.toJSON()));

                interaction.update({ embeds: [embed] });
                return;
            }
            //check if the user pressing the button match on embed's footer
            else if (getMentionId(embed.footer.text) === interaction.user.id
                || getMentionId(embed.footer.text) === interaction.guild.ownerId) {     //confirm/deny the channel
                if (interaction.customId === "confirm") {
                    //save channelId as the server's crypto channel
                    let serverSetting = bot.cryptoChannels.get(interaction.guild.id);
                    serverSetting.channelId = interaction.channelId;
                    bot.cryptoChannels.set(interaction.guild.id, serverSetting);
                    let fs = require("fs");
                    fs.writeFileSync(FILE_PATH, JSON.stringify(bot.cryptoChannels.toJSON()));
                    //update embed
                    embed = {
                        title: "\"" + interaction.channel.name + "\" has been set as the current crypto-channel.",
                        description: "crypto commands and anouncements should be used and appear here",
                        color: 0x000000
                    };
                    interaction.update({ embeds: [embed], components: [] });
                    return;
                }
                else if (interaction.customId === "cancel") {
                    return interaction.message.delete();
                }
                else throw { str: "Uh... What button?" };
            }
        }
        catch (error) {
            if (error.str !== undefined)
                return interaction.message.channel.send(error.str);
            else
                throw error;
        }
    },
    //===== checkPermission =============================================
    /* Checks if the passed in guild member has permissions based on the 
    server's crypto-channel settings. 
    
    NOTE: the curChannel parameter is the data for the current server's
            crypto-channel data/obj which includes the permission settings.*/
    //===================================================================
    checkPermission: function (message, member, curChannel) {
        //Owner can use command
        if (message.guild.ownerId !== member.id) {
            const { Permissions } = require("discord.js");
            //if enabled, Admin and Manage-Channels permissions can use the command
            if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                if (!member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
                    throw { str: "You don't have the **permissions** `ADMINISTRATOR` OR `MANAGE CHANNELS`" };
                else if (!curChannel.permissions.manageChannels)
                    throw { str: "`Manage Channels` permission is not allowed in the server. " + (curChannel.permissions.admin ? "Other permissions required." : "Only the owner can use the command") }
            }
            else if (!curChannel.permissions.admin)
                throw { str: "`Manage Channels` permission is not allowed in the server. " + (curChannel.permissions.manageChannels ? "Other permissions required." : "Only the owner can use the command") }
        }
    }
}