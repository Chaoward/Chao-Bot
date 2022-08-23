//invite link: https://discordapp.com/oauth2/authorize?client_id=703155963456389181&scope=bot&permissions=1497824368

const Discord = require('discord.js'); //discord API
const fs = require('fs'); //file reading and writing
const { exit } = require('process');
const util = require('./imports/utils'); //tools kit


//Global Variables
const FILE_PATH_COUNT = './data/countData.json';
const FILE_PATH_PREFIX = './data/prefixes.json';
const devID = '274709861760106496';
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
const inviteLink = "https://discordapp.com/oauth2/authorize?client_id=703155963456389181&scope=bot&permissions=1497824368";
const PREFIX = String(fs.readFileSync("./data/MAIN_PREFIX.txt"));
const crashPassword = new util.code;
const helpMenu = []; //MessageEmbed[]

//Commands import
bot.commands = new Discord.Collection();    // (cmdName, commandObj) <String, Object>
{
    const cmdFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for (const file of cmdFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
        //adds alias
        for (const alias of command.alias)
            bot.commands.set(alias, command);
    }
}


//startUp calls
{
    let alNum = 0;
    for (const cmdName of bot.commands.keys()) {
        if (alNum < 1) {
            alNum = bot.commands.get(cmdName).alias.length;
            if (bot.commands.get(cmdName).startUp !== undefined)    // skips if startUp() is undefined
                bot.commands.get(cmdName).startUp(bot, Discord);
        }
        else        //skips alias
            alNum--;
    }
}



//Data Files
//bot.coins = new Discord.Collection();       // (userID, count) <String, number>
//bot.mistakes = new Discord.Collection();    // (userID, count) <String, number>
bot.prefixes = new Discord.Collection();    // (serverID, alias) <String, String>

{   //DEPRECATED SOON
    //let data = require(FILE_PATH_COUNT);

    //mistakes data
    /*
    for (const id in data.mistakes) {
        bot.mistakes.set(id, data.mistakes[id]);
    }*/

    //coin Data
    /*
    for (const id in data.coins) {
        bot.coins.set(id, data.coins[id]);
    }*/
}


//alias prefixes
{
    let prefixList = require(FILE_PATH_PREFIX);

    for (const serverId in prefixList) {
        bot.prefixes.set(serverId, prefixList[serverId]);
    }
}

/*
//mistakes data
{
    let misList = String(fs.readFileSync('./data/mistakes.save')).split(',');

    for (const data of misList) {
        let pair = data.split('/');
        bot.mistakes.set(pair[0], pair[1]);
    }
}
//coin Data
{
    let coinList = String(fs.readFileSync('./data/coin.save')).split(',');

    for (const data of coinList) {
        let pair = data.split('/');
        bot.coins.set(pair[0], pair[1]);
    }
}*/



//===== Commands =====================================================================
bot.on('messageCreate', (message) => {
    try {
        if (message.author.bot)
            return util.mudaeNotify(message, bot, devID);
        consoleLoger(message);
        //check for prefix
        if (!(message.content.startsWith(PREFIX) ||
            message.content.startsWith(bot.prefixes.get(String(message.guild.id))))
        ) return;
        //check if there is anything after prefix 
        /*
        if ( message.content.substring(PREFIX).length < 1 || 
            message.content.substring( bot.prefixes.get( String(message.guild.id) ).length < 1 ) 
            ) return;
        */
        message.channel.sendTyping();


        const args = message.content.toLowerCase()
            .substr((message.content.startsWith(PREFIX) ? PREFIX.length : bot.prefixes.get(String(message.guild.id)).length))
            .split(" ");

        //----- secret dev commands -----
        switch (args[0]) {
            case "throw":
                let curMsg = message.channel.send("sdhhgks");
                curMsg.then((m) => { m.react('✅') });
                return;


            case 'test':
                let comp = [];
                comp.push(
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 3,
                                "custom_id": "class_select_1",
                                "options": [
                                    {
                                        "label": "Rogue",
                                        "value": "rogue",
                                        "description": "Sneak n stab",
                                        "emoji": {
                                            "name": "rogue",
                                            "id": "625891304148303894"
                                        }
                                    },
                                    {
                                        "label": "Mage",
                                        "value": "mage",
                                        "description": "Turn 'em into a sheep",
                                        "emoji": {
                                            "name": "mage",
                                            "id": "625891304081063986"
                                        }
                                    },
                                    {
                                        "label": "Priest",
                                        "value": "priest",
                                        "description": "You get heals when I'm done doing damage",
                                        "emoji": {
                                            "name": "priest",
                                            "id": "625891303795982337"
                                        }
                                    }
                                ],
                                "placeholder": "Choose a class",
                                "min_values": 1,
                                "max_values": 1
                            }
                        ]
                    }
                );

                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed({ description: "\0", color: 0x123456 })
                    ],
                    components: comp
                });
                return;

            case 'help':
                //help menu for specific commands
                if (args.length > 1) {
                    if (args[1] === 'help')
                        return message.channel.send("To call for **help** you must first call for **help**");
                    const cmd = bot.commands.get(args[1]);
                    if (cmd === undefined)
                        return message.channel.send('Unknown command');
                    else if (cmd.help == undefined)
                        return message.channel.send('No help available for this command');
                    return message.channel.send(cmd.help);
                }
                //default help menu
                helpMenu[0].setDescription("Invite Link: " + inviteLink + "\n"
                    + "Prefix: " + PREFIX
                    + (message.channel.type === 'DM' ? '' : ', Server alias: ' + bot.prefixes.get(message.guild.id)));
                message.channel.send({ embeds: helpMenu });
                return;

            case 'anounce':
            case 'an':
                if (message.author.id !== devID) return;
                let pack = require("./package.json");
                let msg = String(fs.readFileSync("./news.txt"));
                util.debugLog(msg);
                message.channel.send({
                    content: "@here",
                    embeds: [
                        {
                            author: {
                                name: pack.name + " " + pack.version,
                                icon_url: bot.user.avatarURL()
                            },
                            title: "BOT ANOUNCEMENT!",
                            description: msg,
                            footer: {
                                text: "From " + pack.author.name
                            },
                            thumbnail: {
                                url: "https://cdn.discordapp.com/attachments/704921980507521136/733887421091151932/benson.png"
                            },
                            color: 16711756
                        }
                    ]
                });
                return;

            case 'pp':
                if (message.author.id === devID) {
                    util.debugLog(crashPassword.getValue());
                }
                return;

            case 'shutdown':
            case 'sd':
                if (crashPassword.equals(args[1]) || message.author.id === devID) {
                    //save('all');
                    console.log("Shutting Down!");
                    bot.destroy();
                    console.log('exiting Chao-bot');
                    exit();
                }
                message.channel.send('Valid code required!');
                return;
        }

        //----- regular commands -----
        const cmd = bot.commands.get(args[0]);
        if (cmd === undefined) {
            bot.commands.get('error').execute(message, args, bot);
            //save('mis');
            return;
        }

        /*
        let parameters = { "message": message, "args": args, "bot": bot };
        //custom parameters
        switch (args[0]) {
            
        }*/

        cmd.execute(message, args, bot);
    }
    catch (error) {
        util.errorLog(error);
    }
})
//===== *END* Commands *END* ==================================================================



//===== Interaction Event =====================================================================
bot.on("interactionCreate", (interaction) => {
    //util.debugLog("Event Called");
    if (interaction.client.user.id !== bot.user.id) return util.debugLog("No ID Match!");

    try {
        // button interaction
        if (interaction.isButton() && interaction.message.embeds !== undefined) {
            switch (interaction.message.embeds[0].color) {
                case 0x2828f7: //calculator
                    //util.debugLog("calling");
                    bot.commands.get("calculator").interact(interaction, bot);
                    break;

                case 0xf58484: //VC kick
                    bot.commands.get("vckick").interact(interaction, bot);
                    break;

                case 0x15f00a: //newcoin
                    bot.commands.get("newcoin").interact(interaction, bot);
                    break;

                case 0x096e08:
                case 0xeb3434: //logchannel
                    bot.commands.get("logchannel").interact(interaction, bot);
                    break;

                case 0x15f00b: //setchannel
                    bot.commands.get("setchannel").interact(interaction, bot);
                    break;

                case 0xff3c19: //leavecrypto
                    bot.commands.get("leavecrypto").interact(interaction, bot);
                    break;


                default:
                    util.debugLog("No Color Code Match!");
            }
        }
    }
    catch (error) {
        util.errorLog(error);
    }
})
//===== *END* Interaction Event *END* =========================================================



//===== Reaction Event ========================================================================
bot.on("messageReactionAdd", (reaction, user) => {
    msgReaction(reaction, user, true);
});

bot.on("messageReactionRemove", (reaction, user) => {
    msgReaction(reaction, user, false);
});

function msgReaction(reaction, user, isAdd) {
    if (user.bot || reaction.message.embeds.length < 1) return;
    try {
        //embed color
        switch (reaction.message.embeds[0].color) {
            case 0xf58484:
                bot.commands.get("vckick").react(reaction, user, isAdd, bot);
                break;
        }
    }
    catch (error) {
        util.errorLog(error);
    }
}
//===== *END* Reaction Event *END* ============================================================



//===== VoiceState Event ======================================================================
//VC logger
bot.on('voiceStateUpdate', (oldUser, newUser) => {
    let oldStateChannel = oldUser.channel;
    let newStateChannel = newUser.channel;
    let curDate = new Date();
    let logMessage = '[' + (oldStateChannel === null || oldStateChannel === undefined ? newUser.guild.toString() : oldUser.guild.toString())
        + '/' + curDate.toDateString() + ' ' + curDate.toLocaleTimeString()
        + ']: ';

    //when a new user joins
    if (oldStateChannel === null || oldStateChannel === undefined) {
        logMessage += newUser.member.user.tag + ' has JOINED \"' + newStateChannel.name + '\"';

        //----- VC kick check ----------------
        let id = String(newUser.id)
        if (bot.vckick[id] !== undefined) {
            if (bot.vckick[id]["kick"]) {
                newUser.member.voice.disconnect();
                newStateChannel.send(newUser.member.toString() + " you CAN NOT ESCAPE the VcKick!");
                delete bot.vckick[id];
            }
        }
        //------------------------------------

    } //when a user leaves the channel
    else if (newStateChannel === null || newStateChannel === undefined) {
        logMessage += oldUser.member.user.tag + ' has LEFT \"' + oldStateChannel.name + '\"';
    } //when a user voice perisons is update
    else if (newStateChannel === oldStateChannel) {
        if (oldUser.streaming !== newUser.streaming) {
            logMessage += oldUser.member.user.tag + (oldUser.streaming ? ' STOPPED STREAMING' : ' is LIVE!');
        }
        else if (oldUser.selfVideo !== newUser.selfVideo) { logMessage += oldUser.member.user.tag + (oldUser.selfVideo ? ' has STOPPED THE VIDEO!' : ' is on VIDEO!'); }
        //when the user's speaking and hearing states are updated
        else if (oldUser.selfDeaf !== newUser.selfDeaf) {  //Self-Deaf
            logMessage += oldUser.member.user.tag + (oldUser.selfDeaf ? ' can HEAR the channel!' : ' DEAFENED!');
        }
        else if (oldUser.selfMute !== newUser.selfMute) {  //Self-Mute
            logMessage += oldUser.member.user.tag + (oldUser.selfMute ? ' UNMUTED!' : ' MUTED!');
        }
        else if (oldUser.serverMute !== newUser.serverMute) {  //Server-Mute
            logMessage += oldUser.member.user.tag + (oldUser.serverMute ? ' SERVER-UNMUTED!' : ' SERVER-MUTED!');
        }
        else if (oldUser.serverDeaf !== newUser.serverDeaf) {  //Server-Deaf
            logMessage += oldUser.member.user.tag + (oldUser.serverDeaf ? ' can HEAR the channel!' : ' SERVER-DEAFENED!');
        }
    }
    else { //when the user moves to another voice channel
        logMessage += oldUser.member.user.tag + ' MOVED to \"' + newStateChannel.name + '\"';
    }

    console.log(logMessage);
    util.archiveLog(logMessage);
});
//===== *END* VoiceState Event *END* ==========================================================



//===== Edit Message Event ====================================================================
bot.on('messageUpdate', (oldMsg, newMsg) => {
    if (newMsg.author.bot) return;
    if (oldMsg === newMsg) return;
    let logStr = "";
    //content comparison
    if (oldMsg.content !== newMsg.content) {
        logStr = "[" + oldMsg.guild.toString() + "/"
            + newMsg.createdAt.toDateString() + ' '
            + newMsg.createdAt.toLocaleTimeString() + '(EDIT)]: '
            + newMsg.content + " {"
            + newMsg.channel.name + '/'
            + newMsg.author.tag + '}';
    }

    console.log(logStr);
    util.archiveLog(logStr);
    util.archiveEdit(oldMsg, newMsg);
})
//===== *END* Edit Message Event *END*=========================================================



//===== consoleLoger ===========================================
/* Console logs message content along side server, author, and time info.
   Will archive msg. */
//==============================================================
function consoleLoger(message) {
    let logStr = ""

    if (message.channel.type === 'dm') {                        //DM Logs
        logStr = '[DMChannel/' + message.author.tag + '/'
            + message.createdAt.toDateString() + ' '
            + message.createdAt.toLocaleTimeString() + ']: '
            + message.content;
    }
    else logStr = '[' + message.guild.toString() + '/'       //Guild Logs
        + message.createdAt.toDateString() + ' '
        + message.createdAt.toLocaleTimeString() + ']: '
        + message.content + ' {'
        + message.channel.name + '#' + message.channel.type + '/'
        + message.author.tag + '}';

    console.log(logStr);
    util.archiveLog(logStr);
    util.archiveMsg(message);
}





//===== save * DEPRECATED * =====================================
/* save data collections to the data files. Can specify the save or save all. */
//===============================================================
function save(type) {
    let data;

    //NOTE: breaks for each case are in if-statements to acommidate for "save all" case
    switch (type) {
        case 'all':

        case 'prefix':
            data = require(FILE_PATH_PREFIX);
            for (const id of bot.prefixes.keys()) {
                data[id] = bot.prefixes.get(id);
            }
            fs.writeFileSync(FILE_PATH_PREFIX, JSON.stringify(data));
            if (type !== 'all') break;

        case 'mis':
        case 'mistakes':
            data = require(FILE_PATH_COUNT);
            for (const id of bot.mistakes.keys()) {
                data.mistakes[id] = bot.mistakes.get(id);
            }
            fs.writeFileSync(FILE_PATH_COUNT, JSON.stringify(data));
            /*
            for (const id of misCollection.keyArray()) {
                if (id !== '') {
                    data += id + '/' + misCollection.get(id);
                    id !== misCollection.lastKey() ? data += ',' : false;
                }
            }
            fs.writeFileSync(MISTAKE_FILE_PATH, data);
            */
            if (type !== 'all') break;

        case 'coin':
            data = require(FILE_PATH_COUNT);
            for (const id of bot.coins.keys()) {
                data.coins[id] = bot.coins.get(id);
            }
            fs.writeFileSync(FILE_PATH_COUNT, JSON.stringify(data));
            /*
            for (const id of coinCollection.keyArray()) {
                if (id !== '') {
                    data += id + '/' + coinCollection.get(id);
                    id !== coinCollection.lastKey() ? data += ',' : false;
                }
            }
            fs.writeFileSync(COIN_FILE_PATH, data);*/

            break; //break before defualt to prevent sending error message
        default:
            util.debugLog('No type declared when calling save()');
    }
}



bot.once('ready', () => {
    console.clear();
    let curDate = new Date();
    //curLogPath += curDate.toDateString() + ' ' + curDate.toLocaleTimeString();
    console.log('Bot-' + require('./package.json').version + ' is Online!\n'
        + 'Login Time: ' + curDate.toDateString() + ' ' + curDate.toLocaleTimeString() + '\n'
        + 'Inital Shutdown Code: ' + crashPassword.getValue());

    bot.user.setActivity({
        name: "+help | V." + require('./package.json').version
    });


    //----- Help Menu Embed -----
    helpMenu.push(new Discord.MessageEmbed({ author: { name: 'Chao-Bot-' + require('./package.json').version, icon_url: 'https://cdn.discordapp.com/attachments/704921980507521136/704959491606577192/ak_12_girls_frontline_drawn_by_komeo15__sample-3654473057d25cd1efa2e7061dbbd049.png' } })
        .setThumbnail('https://cdn.discordapp.com/attachments/704921980507521136/733887421091151932/benson.png')
        .setColor('#0099ff')
        .setTitle("ChaoBot of Domination")
        .setDescription("Invite Link: " + inviteLink + "\n"
            + "Prefix: " + PREFIX + ", server alias: "    //alias added when cmd triggers
        )
    );

    //sorting cmds into their categories
    const fields = {}; // (category, cmdList) <String, Object[]>
    let aliasNum = 0; //count of alias cmds to skip. Based on how cmds were pushed into discord's Collection class
    for (const cmdName of bot.commands.keys()) {
        if (aliasNum <= 0) {
            const cmd = bot.commands.get(cmdName);
            if (fields[cmd.category] === undefined) {
                fields[cmd.category] = [cmd];
            }
            else {
                fields[cmd.category].push(cmd);
            }
            aliasNum = cmd.alias.length;
        }
        else {
            aliasNum--;
        }
    }

    //Embed Setup
    let charLimit = 5825;    //non-const to account for the first page's server alias
    const CHAR_FIELD_LIMIT = 1024;
    let pageNum = 0;
    let newField = {
        name: '',
        value: '',
        inline: false,
        length: function () {
            return this.name.length + this.value.length;
        }
    };

    //forEach fields category addField onto embed with each cmd's name and description
    for (const cateName in fields) {
        newField.name += cateName;
        //sit. 1: exceed limit when adding new category
        if (newField.length() >= charLimit) {
            pageNum++;
            helpMenu.push(new Discord.MessageEmbed().setColor('#0099ff'));
            charLimit = 6000;
        }

        //add each command name and descriptions           
        for (const cmd of fields[cateName]) {
            const newData = "**" + cmd.name + ":** " + cmd.description + "\n";
            //sit. 2: exceed limit midway when adding commands
            if (helpMenu[pageNum].length + newField.length() + newData.length < charLimit) {
                //sit. 3: exceed field limit
                if (newField.length() + newData.length < CHAR_FIELD_LIMIT) {
                    newField.value += newData;
                }
                else {
                    helpMenu[pageNum].addField(newField.name, newField.value, newField.inline);
                    newField.name = cateName + "(cont.)";
                    newField.value = newData;
                    newField.inline = !newField.inline;
                    //check max char limit
                    if (helpMenu[pageNum].length + newField.length() >= charLimit) {
                        charLimit = 6000;
                        helpMenu.push(new Discord.MessageEmbed().setColor('#0099ff'));
                    }
                }
            }
            else {
                helpMenu[pageNum].addField(newField.name, newField.value, newField.inline);
                pageNum++;
                helpMenu.push(new Discord.MessageEmbed().setColor('#0099ff'));
                newField.name = cateName + "(cont.)";
                newField.value = newData;
                newField.inline = false;
            }
        }

        //add field and reset newField
        helpMenu[pageNum].addField(newField.name, newField.value, newField.inline);
        newField.name = '';
        newField.value = '';
        newField.inline = !newField.inline;
    }
});


bot.login(String(fs.readFileSync('./token.data'))); //load token and log-in