//embed color: 15f00a
const FILE_PATH = "./data/crypto/custom/";

module.exports = {
    name: "newcoin",
    description: "Create and invest in a new currency.",
    alias: [],
    help: { //message json data
        content: ""
    },
    category: "crypto",
    execute(message, args, bot) {
        if (args.length < 3) return message.channel.send("You need to provide the **name** of the currency, then a base **value** to offer and invest");
        if ( isNaN( Number(args[2]) ) ) return message.channel.send("Value has to be a **number**");
        let fs = require("fs");
        //generate random id and set up info for prompt embed
        let id = Math.floor((Math.random() * 999999999));
        while ( fs.existsSync(FILE_PATH + String(id) + ".json") ) //add 1 to id if it is in use
            id++;
        let embed = {
            author: {
                name: message.author.toString(),
                iconURL: message.author.avatarURL()
            },
            color: 0x15f00a,
            title: "Please Confirm Your New Currency",
            description: "**" + args[1] + "**",
            fields: [
                {
                    name: "Value",
                    value: String(args[2])
                }
            ],
            footer: {
                text: "id : " + String(id)
            }
        }
        message.channel.send({
            embeds: [embed],
            components: [
                {
                    type: 1,        //action row
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
        })
    },
    interact: function (interaction, bot) {
        let util = require("../imports/utils");
        let embed = interaction.message.embeds[0];
        if (interaction.user.id !== util.getMentionId(embed.author.name) ) return util.debugLog(interaction.user.id + " " + embed.author.name);

        if (interaction.customId === "confirm") {
            //check if user has enough PC for the initial investment
            //WIP
            let fs = require("fs");
            //save the new currency
            while (embed.description.includes("**"))
                embed.description = embed.description.replace("**", "");
            let data = {
                name: embed.description,
                value: Number(embed.fields[0].value),
                supply: 1,
                id: embed.footer.text.split(":")[1].trim(),
                creatorId: String( interaction.user.id )
            };
            fs.writeFileSync(FILE_PATH + data.id + ".json", JSON.stringify(data) );
            //update the message
            interaction.update({
                embeds: [
                    {
                        color: 0x000000,
                        title: "\"" + data.name + "\" has been Added to the data base",
                        description: "YAY!!!"
                    }
                ],
                components: []
            });
            //send anouncement of new currency to all crypto-channels
        }
        else if (interaction.customId === "cancel") {
            //interaction.update({content: "Cancelled!"});
            if (interaction.message.deletable) interaction.message.delete();
        }
    }
}