//embed color: ff3c19
const { checkPermission } = require("./eco_setchannel");
const FILE_PATH = "./data/crypto/channels.json";

module.exports = {
    name: "leavecrypto",
    description: "Leaves the Crypto-Space a.k.a. removes the crypto-channel.",
    alias: ["opout"],
    help: { //message json data
        content: "If the server has a crypto-channel established, then unsets the channel leaving the crypto-space, features and commands."
    },
    category: "crypto",
    execute(message, args, bot) {
        try {
            //check if cryto-channel exist
            let cryptoChnlData = bot.cryptoChannels.get(message.guild.id);
            if (cryptoChnlData == undefined) throw {str: "No need to leave when the server is not in the crypto-space to begin with."};
            if (cryptoChnlData.channelId == undefined) throw {str: "No need to leave when the server is not in the crypto-space to begin with."};
            //check permissions
            checkPermission(message, message.member, cryptoChnlData);
            //send prompt to the crypto-channel
            let trgtChannel = message.guild.channels.cache.get(cryptoChnlData.channelId);
            trgtChannel.send({
                content: message.author.toString(),
                embeds: [
                    {
                        title: "Are you __**SURE**__ you want to have the server __**LEAVE**__ the Crypto-Space?",
                        description: "please confirm",
                        color: 0xff3c19
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
            let cryptoChnlData = bot.cryptoChannels.get(interaction.guildId);
            //check permissions
            checkPermission(interaction.message, interaction.member, cryptoChnlData);
            //check user
            let {getMentionId} = require("../imports/utils");
            if (getMentionId(interaction.message.content) !== interaction.user.id) return;

            //confirm button
            if (interaction.customId === "confirm") {
                cryptoChnlData.channelId = undefined;
                //save
                bot.cryptoChannels.set(interaction.guildId, cryptoChnlData);
                let fs = require("fs");
                fs.writeFileSync(FILE_PATH, JSON.stringify(bot.cryptoChannels.toJSON()) );
                //update embed
                interaction.update({
                    embeds: [
                        {
                            title: "Server is nolonger in the Crypto-Space",
                            description: "Bye Woody",
                            color: 0x000000
                        }
                    ],
                    components: []
                });
            }

            //cancel button
            else if (interaction.customId == "cancel") {
                interaction.message.delete();
            }
        } catch (error) {
            if (error.str !== undefined)
                return interaction.message.channel.send(error.str);
            else
                throw error;
        }
    }
}