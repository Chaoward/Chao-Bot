const fs = require('fs');

module.exports = {
    //===== code ==============================
    /* class that controlls the behavior of the
       bot's shutdown code. Determines expiration
       time and generates random 6-digit code. */
    //=========================================
    code: class {
        constructor() { //generates a 6-digit number and records the current time in miliseconds
            let value = Math.floor((Math.random() * 899999) + 100000);
            let iniTime = new Date().valueOf();

            this.isValid = () => {
                let curTime = new Date().valueOf();
                if (curTime - iniTime >= 360000) { //generate new code
                    value = Math.floor((Math.random() * 899999) + 100000);
                    iniTime = new Date().valueOf();
                    return false;
                }

                return true;
            }

            this.getValue = () => {
                this.isValid();
                return value;
            }

            this.equals = (arg) => {
                this.isValid();
                return parseInt(arg) === value;
            }
        }
    },

    //===== archiveLog ==================================
    /* Save console logs into a file */
    //===================================================
    archiveLog: function (str) {
        let date = new Date();
        fs.appendFileSync('./data/logs/' + date.toDateString() + '.txt', str + '\n');
    },

    //===== archiveMsg ===================================
    /* Saves the message json in a file. Dated and appends
       new messages to that same dated file. */
    //====================================================
    archiveMsg: function (message) {
        let path = "./data/logs/msgJson/" + message.createdAt.toDateString() + ".json";
        let json;
        try {
            json = JSON.parse(fs.readFileSync(path));
        }
        catch (error) {
            json = { "messages": [] };
        }

        let newItem = {
            "content": message.toString(),
            "guild_name": message.guild.name,
            "localeTimeString": message.createdAt.toLocaleTimeString(),
            "attachment_links": [],
            "sticker_links": [],
            "obj": message
        };
        //attachment links
        for (const att of message.attachments.values())
            newItem.attachment_links.push(att.url);
        if (newItem.attachment_links.length == 0)
            delete newItem.attachment_links;
        //sticker links
        for (const sticker of message.stickers.values())
            newItem.sticker_links.push(sticker.url);
        if (newItem.sticker_links.length == 0)
            delete newItem.sticker_links;

        json.messages.push(newItem);
        fs.writeFileSync(path, JSON.stringify(json));
    },

    //===== archiveEdit ========================
    /* Saves edited message to a json file. */
    //==========================================
    archiveEdit: function (oldMsg, newMsg) {
        if (oldMsg === newMsg) return;
        let path = "./data/logs/msgJson/" + newMsg.createdAt.toDateString() + ".json";
        let json;
        try {
            json = JSON.parse(fs.readFileSync(path));
        }
        catch (error) {
            json = { "messages": [] };
        }

        let newItem = {
            "old_content": oldMsg.toString(),
            "new_content": newMsg.toString(),
            "guild_name": newMsg.guild.name,
            "localeTimeString": newMsg.createdAt.toLocaleTimeString(),
            "attachment_links": [],
            "sticker_links": [],
            "old_obj": oldMsg,
            "new_obj": newMsg
        };

        //attachment links
        for (const att of oldMsg.attachments.values())  //old
            newItem.attachment_links.push(att.url);
        for (const att of newMsg.attachments.values())  //new
            if (newItem.attachment_links.find(att) === undefined)
                newItem.attachment_links.push(att.url);
        if (newItem.attachment_links.length == 0)
            delete newItem.attachment_links;

        //sticker links
        for (const att of oldMsg.stickers.values())  //old
            newItem.sticker_links.push(att.url);
        for (const att of newMsg.stickers.values())  //new
            if (newItem.sticker_links.find(att) === undefined)
                newItem.sticker_links.push(att.url);
        if (newItem.sticker_links.length == 0)
            delete newItem.sticker_links;

        json.messages.push(newItem);
        fs.writeFileSync(path, JSON.stringify(json));
    },

    //===== debugLog ===========================
    /* console log passed in string with debug lable. */
    //==========================================
    debugLog: function (string) {
        console.log('[DEBUG]: ' + string);
    },

    //===== errorLog ================================================
    /* Logs and archives errors thrown. Use in catch block. */
    //===============================================================
    errorLog: function (error) {
        console.error("[ERROR] " + error.name + ": " + error.message);
        let date = new Date();
        let path = "./data/logs/_ERROR " + date.toDateString() + ".txt";
        fs.appendFileSync(path,
            "===================================================================\n"
            + "     ERROR AT " + date.toTimeString() + "\n"
            + "===================================================================\n"
            + error.toString() + "\n\n"
            + "Stack: " + error.stack + "\n");
    },

    //===== getMentionId =======================
    /* returns id of the passed in mention. */
    //==========================================
    getMentionId: function (string) {
        if (!String(string).startsWith('<') && !String(string).endsWith('>')) return undefined;

        string = string.substr(2);
        if (string.startsWith('!'))     //Note: server nicknames adds a '!' to the string
            string = string.substr(1);  //removes the '!'
        return string.split('>')[0];
    },

    //===== mudaeNotify ============================
    /* Checks and sends discord meesage link to a mudae roll. */
    //==============================================
    mudaeNotify: function (message, bot, devID) {
        if (message.author.id === "432610292342587392") {   //Mudae Bot Id
            let list;
            try {
                list = JSON.parse(fs.readFileSync("./data/MudaeList.json")).list;
            } catch (error) {
                return console.log("[ERROR]: List is not found!");
            }
            let tempEmbed = message.embeds[0];
            if (tempEmbed === undefined) return;
            else if (tempEmbed.hexColor.includes('670c08')) return;
            else {
                for (item of list) {
                    if (tempEmbed.description.includes(item)) {
                        bot.users.fetch(devID).then(user => {
                            user.createDM().then(channel => {
                                channel.send(tempEmbed.title + "\n" 
                                    + tempEmbed.description.split("\n")[0] + "\n"
                                    + message.url);
                            });
                        });
                        return;
                    }
                }
            }
        }
    }
}