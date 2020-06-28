const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
       
  let everyone = args.join(" ");
  if(message.content.startsWith('-say @everyone')){
      if(!everyone) return message.reply(`i cant mention everyone`, )
      message.delete();
      disableMentions: 'everyone, here'
      message.channel.send(`${saying}` , {disableMentions:'everyone'});
      
  }
    let here = args.join(" ");
  if(message.content.startsWith('-say @here')){
      if(!everyone) return message.reply(`i cant mention here`, )
      message.delete();
      disableMentions: 'everyone, here'
      message.channel.send(`${saying}` , {disableMentions:'here'});
      
  }  
  
      let saying = args.join(" ");
      if(!saying) return message.reply(`please, give me a text`, )
      message.delete();
      disableMentions: 'everyone, here'
      message.channel.send(`${saying}` , {disableMentions:'everyone'});
      

}

module.exports.help = {
    name: "say"
  }
