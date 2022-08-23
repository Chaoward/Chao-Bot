module.exports = {
    name: 'roll',
    description: 'rolls a 1d20, but can be specified to any range and amount of times rolled',
    alias: ["ro"],
    help: { //message json data
        content: "`+roll [max_range] [amount_of_rolls]`\ndefualt range is 1-20. Minimum is always 1."
    },
    category: "fun",
    execute(para) {
        let die = {
            curNum: 0,
            max: 20,
            min: 1,
            roll: function() {
                return this.curNum = Math.floor((Math.random() * this.max) + this.min);
            }
        }
        let rollList = [];

        if (parseInt(para.args[1]) >= 1) { //Custom range of a roll
            die.max = parseInt(para.args[1]);

            if (parseInt(para.args[2]) >= 1) { //Custom amount of times to roll
                let total = 0;
                for (let i = 0; i < parseInt(para.args[2]); ++i) {
                    total += die.roll();
                    rollList.push(die.curNum);
                }
                para.message.channel.send(total.toString());
                para.message.channel.send(getRollList(rollList));
                return;
            }
        }
        else if (parseInt(para.args[1]) <= 0 && para.args[1] !== undefined) {
            para.message.channel.send('the range MUST be HIGHER then 0!');
            return;
        }

        para.message.channel.send(die.roll().toString());
        if (die.curNum === die.max || die.curNum === 1) {
            die.curNum === die.max ? para.message.channel.send('CRITICAL SUCCESS!!!') : para.message.channel.send('CRITICAL FAIL!!!');
        }
    }
}



function getRollList(list) {
    let output = '';
    for (let i = 0; i < list.length; ++i) {
        if (list[i] != 0 && output.length < 900) { output += list[i] + (i === list.length - 1 ? '' : ', '); }
    }
    return output + (output.length > 900 ? '...' : '');
}