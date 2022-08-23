var todayDate;

module.exports = {
    name: "mine",
    description: "Mine for PC for the day",
    alias: ["em"],
    help: { //message json data
        content: "Gain a daily amount of PC. Resets each day."
    },
    category: "crypto",
    startUp: function (bot, dis) {
        todayDate = new Date();
    },
    execute(message, args, bot) {
        const {ProfileHandler} = require("./eco_bank");
        let profile = ProfileHandler.getProfile(message.author.id);
        let msgDate = profile.meta.dailyDate;

        let curDate = new Date();
        //update presentDate if needed
        if (curDate.getFullYear() > todayDate.getFullYear())
            todayDate = new Date();
        else if (curDate.getMonth() > todayDate.getMonth())
            todayDate = new Date();
        else if (curDate.getDay() > todayDate.getDay())
            todayDate = new Date();
            
        //date check
        if (msgDate[0] <= todayDate.getFullYear())
            if (msgDate[1] <= todayDate.getMonth())
                if (msgDate[2] <= todayDate.getDay())
                    return message.reply("You can only Mine for PC once per day. Come back tommorrow.");
        //add daily amount
        profile.meta.dailyDate = [ todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDay() ];
        profile.coins += profile.meta.dailyAmount;
        ProfileHandler.update(message.author.id, profile);
        message.reply("You mined **" + String(profile.meta.dailyAmount) + "** Psuedo-Coins.");
    }
}