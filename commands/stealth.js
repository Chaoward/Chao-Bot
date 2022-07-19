module.exports = {
    name: 'stealth',
    description: 'Toggles the bot\'s presence between online and invisible',
    alias: ["hide", "stlh"],
    help: { //message json data
        content: "Toggles the bot's presence"
    },
    category: "misc",
    execute(message, args, bot) {
        switch (args[1]) {
            case 'online':
            case 'on':
                bot.user.setStatus('online');
                message.channel.send('<:bangbang:732762989198966835> SURPRISE <:bangbang:732762989198966835>');
                break;

            case 'offline':
            case 'invisible':
            case 'off':
                bot.user.setStatus('invisible');
                message.channel.send('<:cloud:732763587277357068><:cloud:732763587277357068>S<:cloud:732763587277357068>T<:cloud:732763587277357068>E<:cloud:732763587277357068>A<:cloud:732763587277357068>L<:cloud:732763587277357068>T<:cloud:732763587277357068>H<:cloud:732763587277357068><:cloud:732763587277357068>');
                break;
                
            default:
                if (bot.user.presence.status === 'online') {
                    bot.user.setStatus('invisible');
                    message.channel.send('<:cloud:732763587277357068><:cloud:732763587277357068>S<:cloud:732763587277357068>T<:cloud:732763587277357068>E<:cloud:732763587277357068>A<:cloud:732763587277357068>L<:cloud:732763587277357068>T<:cloud:732763587277357068>H<:cloud:732763587277357068><:cloud:732763587277357068>');
                }
                else {
                    bot.user.setStatus('online');
                    message.channel.send('<:bangbang:732762989198966835> SURPRISE <:bangbang:732762989198966835>');
                }
        }
    }
}