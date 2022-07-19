module.exports = {
    name: 'move',
    description: 'Move all members from the current VC to another',
    alias: [],
    help: { //message json data
        content: "`+move [channel_name]`\nMust be in VC to move, and command move everyone to the new VC"
    },
    category: "utility",
    execute(message, args, bot) {     //WIP
        //check for MOVE_MEMBER permission
        if (!message.member.permissions.has('MOVE_MEMBER') ||
            !message.member.permissions.has('ADMINISTRATOR') ) {
                return message.channel.send('You do not have the perimission to move members to another VC.');
        }
        //checks if user is in VC
        if (message.member.voice.channel === null) 
            return message.channel.send('Must be in a voice channel to move');

        //checks if the target VC exist, is a VC, and provided
        if (args.size < 2) return message.channel.send('channel not provided to move to');
        
        let trgtname = '';
        for (let i = 1; i < args.length; ++i) //adding all args after the first to get channel name
            trgtname += args[i] + ' ';
        trgtname = trgtname.trim();
        if (message.member.voice.channel.name.toLowerCase().startsWith(trgtname))
            return message.channel.send('You\'re already in this voice channel');
        
        let trgtChannel = undefined;
        for (const channel of message.guild.channels.cache.values()) {
            if (channel.name.toLowerCase().startsWith(trgtname) && channel.type === 'GUILD_VOICE') {
                trgtChannel = channel;
                break;
            }
        }
        if (trgtChannel === undefined) return message.channel.send('Channel Not Found!');

        /*
        for (let i = 0; trgtChannel === undefined && i < message.guild.channels.cache.size; ++i) {
            let curChannel = message.guild.channels.cache.at(i);
            require('./tools').debugLog(curChannel.name);
            if (curChannel.name === trgtname && curChannel.type === 'GUILD_VOICE')
                trgtChannel = curChannel;
        }
        if (trgtChannel === undefined) return message.channel.send('Channel Not Found!');
        */
        
        //move each member in current VC to target
        let oldChannel = message.member.voice.channel;
        oldChannel.members.forEach( (member) => {
            member.voice.setChannel(trgtChannel);
        })
    }
}