exports.run = async (bot, message, args) => {

const {RichEmbed} = require("discord.js");
const { stripIndents } = require("common-tags"); 

const fetch = require("node-fetch")
  
    const name = args.join(" ");
    
    if(!name) {
      return message.reply("Maybe it's useful to actually search for someone...");
          
    }
    const url = 'https://instagram.com/${name}/?__a=1';
    const res = fetch(url).then(url => url.json());
    
    console.log(res);
  }
module.exports = {
  name: "insta",
  aliases: ['insta']
}

