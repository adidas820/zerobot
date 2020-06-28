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

       .setDescription("Bot Info:")
      .setColor('RANDOM')
      .addField(":robot: Bot Name", `${client.user.tag}`)
      .addField("👑 Creator", "<@!618815086512832533> | Adi820 ")
      .addField("🗓️ Created At", `${client.user.createdAt}`)
      .addField('<:nodejs:446922023529086976> Node', `${process.version}`)
      .addField('<:nodejs:446922023529086976> Library', 'discord.js')
      .addField('💻 Operating System', `${os.platform} ${arch}`)
      .addField(`💬 Want to see last update ${client.user.username}?`, `Usage \`-changelog\``)
      .addField("📑 **Usefull link**",  "[Invite me](https://discord.com/oauth2/authorize?client_id=618906329976799243&scope=bot&permissions=2146958847) | [Vote me]() | [Support Server](https://discord.gg/zFFGCSN)") 
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
