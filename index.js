const Discord = new require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('message', (message) => {
    if(message.channel.id !== config.verificationChannelID) return; // check if message channel is verification channel
    if(message.author.bot) return; // check if message author is bot
    if(message.content !== config.cmdName) return; // check if message content is equal to cmdName

    const emoji = client.emojis.cache.find(emoji => emoji.name === config.emojiName); //define the emoji

    message.delete(); // remove message

    const verificationEmbed = { // creating embed
        color: 0xffbb00,
        title: 'Verification!',
        description: `Press ${emoji} reaction to verify!`,
        thumbnail: {
          url: config.thumbnail,
        },
    };

    message.channel.send({embed: verificationEmbed}).then((msg) =>{ // sending embed
        msg.react(emoji); // reacting with emoji
    })
})

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.message.channel.id !== config.verificationChannelID) return; // check if reaction message channel is verification channel
    if(user.bot) return; // check if reaction.author isnt bot

    // sending dm to a user
    if(config.sendDm) {
        user.send(config.dmMessage).catch(() =>{
            console.log(`${user.username} (${user.id}) has prolly locked dms`)
        });
    }
    reaction.message.guild.members.cache.get(user.id).roles.add(config.roleID); //giving a role to user who reacted
});

client.on('ready', () =>{
    console.log('ready || bot username: ' + client.user.username)
})

client.login(config.token);
