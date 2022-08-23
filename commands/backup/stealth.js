module.exports = {
    name: 'stealth',
    description: 'Toggles the bot\'s presence between online and invisible',
    alias: ["hide", "stlh"],
    help: { //message json data
        content: "Toggles the bot's presence"
    },
    category: "misc",
    execute(para) {
        switch (para.args[1]) {
            case 'online':
            case 'on':
                para.bot.user.setStatus('online');
                para.message.channel.send('<:bangbang:732762989198966835> SURPRISE <:bangbang:732762989198966835>');
                break;

            case 'offline':
            case 'invisible':
            case 'off':
                para.bot.user.setStatus('invisible');
                para.message.channel.send('<:cloud:732763587277357068><:cloud:732763587277357068>S<:cloud:732763587277357068>T<:cloud:732763587277357068>E<:cloud:732763587277357068>A<:cloud:732763587277357068>L<:cloud:732763587277357068>T<:cloud:732763587277357068>H<:cloud:732763587277357068><:cloud:732763587277357068>');
                break;
                
            default:
                if (para.bot.user.presence.status === 'online') {
                    para.bot.user.setStatus('invisible');
                    para.message.channel.send('<:cloud:732763587277357068><:cloud:732763587277357068>S<:cloud:732763587277357068>T<:cloud:732763587277357068>E<:cloud:732763587277357068>A<:cloud:732763587277357068>L<:cloud:732763587277357068>T<:cloud:732763587277357068>H<:cloud:732763587277357068><:cloud:732763587277357068>');
                }
                else {
                    para.bot.user.setStatus('online');
                    para.message.channel.send('<:bangbang:732762989198966835> SURPRISE <:bangbang:732762989198966835>');
                }
        }
    }
}