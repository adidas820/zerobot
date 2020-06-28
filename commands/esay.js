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
    const sayMessage = args.join(" ");
    var prefix = "-";
  var args = msg.content.slice(prefix.length).trim().split(" ");
  
    let servIcon = msg.guild.iconURL;
    let esayEmbed = new Discord.RichEmbed()
      .setTitle("💬 Say")
      .setColor("#0537ff")
      .setThumbnail(servIcon)
      .setDescription(`📝 Said by ${msg.author}`)
      .addField("Message", `${sayMessage}`)
      .setTimestamp();

    const esayMessage = args.join(" ");

    msg.delete({timeout: 1000});

    msg.channel.send(esayEmbed);
  }

module.exports.help = {
    name: 'esay', 
    aliases: ['servers'],
    ownerOnly: false,
    description: 'esay',
    usage: ''
}
