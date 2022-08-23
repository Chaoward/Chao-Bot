//embed color = #2828f7

module.exports = {
    name: "calculator",
    description: "Sends a calculator embed and numpad.",
    alias: ["cal"],
    help: { //message json data
        content: "Just use it like a normal calculator."
    },
    category: "utility",
    execute(message, args, bot) {
        let dis = require("discord.js");
        let comp = [];
        let layout = String(require("fs").readFileSync("./data/calculator_layout.txt")).split("\n");

        for (let i = 0; i < layout.length; ++i) {
            let buttons = layout[i].split(" ");
            let row = new dis.MessageActionRow();
            for (let j = 0; j < buttons.length; ++j) {
                if (buttons[j] === "_")     //check for empty button
                    row.addComponents(
                        new dis.MessageButton()
                            .setCustomId("_")
                            .setLabel(" ")
                            .setStyle("SECONDARY")
                    );
                else
                    row.addComponents(
                        new dis.MessageButton()
                            .setCustomId(buttons[j])
                            .setLabel(buttons[j])
                            .setStyle("SECONDARY")
                    );
            }
            comp.push(row);
        }

        message.channel.send({
            embeds: [
                new dis.MessageEmbed({
                    color: 0x2828f7,
                    title: "\0",
                    description: "\0"
                })
            ],
            components: comp
        });
    },
    interact: function (interaction, bot) {
        let curEmbed = interaction.message.embeds[0];
                                                                            //CALCULATE
        if (interaction.customId.startsWith("enter")) {
            if (curEmbed.description.startsWith("\0")) return;
            let statement = curEmbed.description.split(" ");
            let final = Number(statement[0]);
            if (isNaN(final)) {         //singular exponent expression
                let expression = statement[0].split("^");
                final = Number(expression[0]);
                for (let i = 1; i < expression.length; i++) {
                    final = binpow(final, Number(expression[i]));
                }
            }
            try {
                //compute everything
                for (let i = 1; i + 1 < statement.length; i += 2) {
                    if (statement[i + 1].includes("^")) { //exponents
                        let expression = statement[i + 1].split("^");
                        statement[i + 1] = Number(expression[0]);
                        for (let j = 1; j < expression.length; j++) {
                            statement[i + 1] = binpow(statement[i + 1], Number(expression[j]));
                        }
                    }
                    switch (statement[i]) {
                        case "+":
                            final += Number(statement[i + 1]);
                            break;

                        case "-":
                            final -= Number(statement[i + 1]);
                            break;

                        case "*":
                            final *= Number(statement[i + 1]);
                            break;

                        case "/":
                            if (Number(statement[i + 1]) === 0) throw "Divide by Zero Error";
                            final /= Number(statement[i + 1]);
                            break;

                        default:
                            console.error("No Valid OP!\nH-How???");
                            return;
                    }
                }
            }
            catch (error) {
                if (error === "Divide by Zero Error")
                    final = error;
                else
                    throw error;
            }
            //edit message
            curEmbed.setTitle(String(final));
            interaction.update({ embeds: [curEmbed] })
            //interaction.message.edit({ embeds: [curEmbed] });
        }
                                                                            //CLEAR
        else if (interaction.customId.startsWith("clear")) {
            curEmbed.setTitle("\0");
            curEmbed.setDescription("\0");
            interaction.update({ embeds: [curEmbed] })
            //interaction.message.edit({ embeds: [curEmbed] });
        }
                                                                            //DELETE
        else if (interaction.customId.startsWith("delete")) {
            let statement = curEmbed.description;
            if (statement.startsWith("\0")) return;
            let amount = statement.endsWith("?") ? 2 : 1; //equals 2 for deleting pending negatives
            statement = statement.substring(0, statement.length - amount).trim();
            update(interaction, statement, curEmbed);
        }
                                                                            //EXPONENT
        else if (interaction.customId.startsWith("^")) {
            let statement = curEmbed.description;
            if ( statement.startsWith("\0") || isNaN(statement.charAt(statement.length - 1)) ) return;
            statement += interaction.customId;
            update(interaction, statement, curEmbed);
        }
                                                                            //SUBTRACTION/NEGATIVE NUM
        else if (interaction.customId.startsWith("-")) {
            let statement = curEmbed.description;
            if (statement.endsWith("?")) return;
            //if null, replace the null
            if (statement.startsWith("\0"))
                statement = interaction.customId + "?"
            //exponent check
            else if (statement.endsWith("^"))
                statement += interaction.customId + "?"
            else
                statement += " " + (
                    isNaN(statement.charAt(statement.length - 1)) ?
                        interaction.customId + "?" :
                        interaction.customId
                );
            //update
            update(interaction, statement, curEmbed);
        }
                                                                            //ADDING/DIVIDE/MULTIPLY
        else if (interaction.customId.startsWith("+") ||
            interaction.customId.startsWith("/") ||
            interaction.customId.startsWith("*")) {
            let statement = curEmbed.description;
            if (statement.startsWith("\0") || statement.endsWith("?") || statement.endsWith("^")) return;
            //if last char is an op, replace it
            if (isNaN(statement.charAt(statement.length - 1)))
                statement = statement.substring(0, statement.length - 1) + interaction.customId; //substr without last char + customId/newOp
            else
                statement += " " + interaction.customId;
            //update
            update(interaction, statement, curEmbed);
        }
                                                                            //NUMBERS
        else {
            let statement = curEmbed.description;
            //if null, replace the null
            if (statement.startsWith("\0"))
                statement = interaction.customId
            //if "-?", replace the "?" (pending negative)
            else if (statement.charAt(statement.length - 1) === "?")
                statement = statement.replace("?", interaction.customId);
            //if last char is NaN, add space before the num
            //else add the num to the end of string
            else
                statement += (isNaN(statement.charAt(statement.length - 1)) && !statement.endsWith("^")) ?
                    " " + interaction.customId : interaction.customId;

            //update & send embed
            update(interaction, statement, curEmbed);
        }

        //NOTE: for some reason "/" and "*" cases are failing and automatically goes to the default case dispite the customId matching with the case
        // Story of my life I some how broke a switch statement
        /*
        switch (interaction.customId) {
            case "enter": {
                let statement = curEmbed.description.split(" ");
                if (statement.length % 2 === 0) return interaction.message.channel.send("incomplete statement");
                let final = Number(statement[0]);
                try {
                    //compute everything
                    console.log("LENGTH: " + statement.length);
                    for (let i = 1; i + 1 < statement.length; i += 2) {
                        console.log("index: " + i + "\nfinal: " + final + "\n\n");
                        switch (statement[i]) {
                            case "+":
                                final += Number(statement[i + 1]);
                                break;

                            case "-":
                                final -= Number(statement[i + 1]);
                                break;

                            case "*":
                                final *= Number(statement[i + 1]);
                                break;

                            case "/":
                                if (Number(statement[i + 1]) === 0) throw "Divide by Zero Error";
                                final /= Number(statement[i + 1]);
                                break;

                            default:
                                console.error("No Valid OP!\nH-How???");
                                return;
                        }
                    }
                }
                catch (error) {
                    if (error === "Divide by Zero Error")
                        final = error;
                    else
                        throw error;
                }
                //edit message
                curEmbed.setTitle(String(final));
                interaction.message.edit({ embeds: [curEmbed] });
                return;
            }

            case "clear": {
                curEmbed.setTitle("\0");
                curEmbed.setDescription("\0");
                interaction.message.edit({ embeds: [curEmbed] });
                return;
            }

            case "-": {
                let statement = curEmbed.description;
                if (statement.endsWith("?")) return;
                //if null, replace the null
                if (statement.startsWith("\0"))
                    statement = interaction.customId + "?"
                else
                    statement += " " + ( 
                        isNaN(statement.charAt(statement.length - 1)) ?
                        interaction.customId + "?" :
                        interaction.customId
                    );
                //update
                update(interaction, statement, curEmbed);
                return;
            }

            case '/': 
                console.log("DIVIDE");
            case '*': 
                console.log("MULTI");
            case "+": 
            {
                console.log("OP Trigger");
                let statement = curEmbed.description;
                if (statement.startsWith("\0") || statement.endsWith("?")) return;
                //if last char is an op, replace it
                if ( isNaN(statement.charAt(statement.length - 1)) )
                    statement = statement.substring(0, statement.length - 1) + interaction.customId; //substr without last char + customId/newOp
                else
                    statement += " " + interaction.customId;
                //update
                update(interaction, statement, curEmbed);
                return;
            }
            break;

            //Number input
            default: {
                console.log("NUM Trigger");
                let statement = curEmbed.description;
                //if null, replace the null
                if (statement.startsWith("\0"))
                    statement = interaction.customId
                //if "-?", replace the "?"
                else if (statement.charAt(statement.length - 1) === "?")
                    statement = statement.replace("?", interaction.customId);
                //if last char is NaN, add space before the num
                //else add the num to the end of string
                else
                    statement += isNaN(statement.charAt(statement.length - 1)) ? " " + interaction.customId : interaction.customId;
                
                //update & send embed
                update(interaction, statement, curEmbed);
                return;
            }
        }*/

        //OOOOOOOOOOOOOOOOOOLLLLLLLLLLLLLLLLLLLLLLDDDDDDDDDDDDDDDDDDDDD!!!!!
        /*
        case "-": {     // negative pending numbers identified as "-?"
            let statement = curEmbed.description.split(" ");
            if (statement[0] === "\0") {
                curEmbed.setDescription("-?");
                return interaction.message.edit({ embeds: [curEmbed] });
            }
            if (Number(statement[statement.length - 1]) === NaN) {
                //check if it is a pending negative number "-?"
                if (statement[statement.length - 1].length > 1)
                    return;
                statement.push("-?");
            }
            else
                statement.push("-");

            //update(interaction, statement, curEmbed);
            console.log(statement);
            statement = statement.toString();   // C-style String into regular String 
            while (statement.includes(","))
                statement = statement.replace(",", " ");
            console.log(statement);
            curEmbed.setDescription(statement);
            interaction.message.edit({ embeds: [curEmbed] });
            return;
        }

        case "/":
        case "*":
        case "+": {
            if (curEmbed.description.startsWith("\0") || curEmbed.description.startsWith("-?")) return;
            let statement = curEmbed.description.split(" ");

            if (statement[statement.length - 1] === NaN)   //replaces the operator
                statement[statement.length - 1] = interaction.customId;
            else
                statement.push(interaction.customId);

            //update(interaction, statement, curEmbed)
            return;
        }

        default: {
            if (Number(interaction.customId) === NaN)
                return;

            let statement = curEmbed.description.split(" ");
            if (statement[statement.length - 1] === "-?")
                statement[statement.length - 1] = statement[statement.length - 1].replace("?", interaction.customId);
            else if (statement[0] === "\0") {
                curEmbed.setDescription(interaction.customId);
                interaction.message.edit({ embeds: [curEmbed] });
                return;
            }
            else
                statement[statement.length - 1] = statement[statement.length - 1] + interaction.customId;
            //update(interaction, statement, curEmbed);
        }
        */


    }
}


function binpow(a, b) {
    let result = 1;
    while (b > 0) {
        if (b & 1)
            result *= a;
        a *= a;
        b >>= 1;
    }
    return result;
}


function update(interaction, statement, curEmbed) {
    curEmbed.description = statement;
    interaction.update({ embeds: [curEmbed] })
    //interaction.message.edit({ embeds: [curEmbed] });
    /*
    let newDescript = "";
    for (const i of statement) {
        newDescript = newDescript + String(i) + " ";
        console.log(newDescript);
    }
    newDescript = newDescript.trim();
    console.log(statement);
    statement = statement.toString();   // C-style String into regular String 
    while (statement.includes(","))
        statement = statement.replace(",", " ");
    console.log(statement);
    embed.setDescription(statement);
    interaction.message.edit({ embeds: [embed] });
    */
}