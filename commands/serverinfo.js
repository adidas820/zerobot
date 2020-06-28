const Discord = require("discord.js");
const run = module.exports.run = async (client, msg, args) => {
    const os = require('os');
    const arch = os.arch()
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
  
    let totalSeconds = process.uptime();
    let realTotalSecs = Math.floor(totalSeconds % 60);
    let days = Math.floor((totalSeconds % 31536000) / 86400);
    let hours = Math.floor((totalSeconds / 3600) % 24);
    let mins = Math.floor((totalSeconds / 60) % 60);
    var cpu = process.cpuUsage().system / 1024 / 1024;
    var cpu_usage = Math.round(cpu * 100) / 100;
    
    let postMsg = await msg.channel.send("**Please Wait...**");
    let info = new Discord.RichEmbed()

      .setAuthor('Info Server')
      .setColor("RANDOM")

      .addField("📝 Server Name", msg.guild.name)
      .addField("📅 Created At", msg.guild.createdAt)
      .addField(`👑 Owner:`, `${msg.guild.owner}`)
      .addField('👥 Total Members', `**${msg.guild.memberCount}**`, true)
      .addField('🙇🏻 Humans', `**${msg.guild.members.filter(member => !member.user.bot).size}**`, true)
      .addField('🤖 Bots', `**${msg.guild.members.filter(member => member.user.bot).size}**`, true)
      .addField('📜 Member Status', `**${msg.guild.members.filter(o => o.presence.status === 'online').size}**<:online:449590947165110283> Online\n**${msg.guild.members.filter(i => i.presence.status === 'idle').size}**<:away:449590947110584321> Idle/Away\n**${msg.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}**<:dnd:449590946879766539> Do Not Disturb\n**${msg.guild.members.filter(off => off.presence.status === 'offline').size}**<:offline:449590947047669760> Offline/Invisible`)
      .addField("🗓️ You Joined", msg.member.joinedAt)
      .addField('📍 Your Current Roles', `${msg.member.roles.map(roles => roles).join(' => ')}`) 
      .addField('📌 Guild Current Roles', `${msg.guild.roles.map(roles => roles).join('  ')}`) 
      .setTimestamp()
      .setFooter(`Requested by: ${msg.author.tag}`)

         setTimeout(() => {
         postMsg.edit(info)
          }, 1000);
} 

module.exports.help = {
    name: 'serverinfo', 
    aliases: ['servers'],
    ownerOnly: false,
    description: 'bot server info',
    usage: ''
}
