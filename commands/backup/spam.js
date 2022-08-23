module.exports = {
    name: 'spam',
    description: 'spams the message entered by the user to a default of 10x',
    alias: [],
    help: { //message json data
        content: "`spam [message(space allowed)] \\Number_of_times_to_spam`\nSpams a default of 10 times. (Max: 50)"
    },
    category: "fun",
    execute(para) {
        if (para.args[1] !== undefined && para.args[1] !== '') {
            //substrings starts at end of "+spam" and ends at "\"
            let command = para.message.content.substring(6).split("\\");
            let amount = command[1] !== undefined && 
                command[1] !== '' && 
                parseInt(command[1]) >= 1 && 
                parseInt(command[1]) <= 50 
            ? parseInt(command[1]) : 10;
            
            spamMessage(para.message, command[0], amount);
        }
        else {
            para.message.channel.send('\"+spam\" must have a message inserted after the command');
        }
    }
}


async function spamMessage(msgObj, content, i) {
    if (i <= 0) return;

    msgObj.channel.send(content);
    --i;
    await delayedResolve(1100);
    spamMessage(msgObj, content, i);
}

function delayedResolve(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}