
const http = require('http');
const express = require('express');
const app = express();





app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
}, 280000);



const Enmap = require('enmap');
const os = require('os');
const arch = os.arch()
const meme = require('./commands/meme.js');





app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.use(express.static('public'));

/* SERVER */

var request = require('request');

// FUNCTIONS //

function parseCookies (request) {
  var list = {},
  rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

function writeUserData(userId, rankColor, rankImage) {
  var user = JSON.parse(fs.readFileSync("./cards.json", "utf8"));
  user[userId].color = rankColor;
  user[userId].image = rankImage;
  fs.writeFile("./cards.json", JSON.stringify(user, null, 2), (err) => {
    if (err) return console.log(err)
  });
}

function writeServerData(serverId, settings) {
  var server = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  server[serverId] = settings;
  fs.writeFile("./config.json", JSON.stringify(server, null, 2), (err) => {
    if (err) return console.log(err)
  });
}

function isUser(userId) {
  var user = JSON.parse(fs.readFileSync("./cards.json", "utf8"));
  if (user[userId] == undefined) return false;
  else return true;
}

function isServer(serverId) {
  var server = JSON.parse(fs.readFileSync("./config.json", "utf8"));
  if (server[serverId] == undefined) return false;
  else return true;
}

app.post('/sendUser', function(req, res) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = JSON.parse(body);
    writeUserData(body.id, body.rankColor, body.rankImage);
  });
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end('OK');
});

app.post('/sendServer', function(req, res) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = JSON.parse(body);
    writeServerData(body.id, body.settings);
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('OK');
  });
});

app.post('/getUser', function(req, res) {
  var body = "";
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = JSON.parse(body);
      if (body === null || body === undefined) {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
        res.end(null);
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(JSON.stringify(body));
      }
    });
});

app.post('/getServer', function(req, res) {
  var body = "";
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    body = JSON.parse(body);

      var id = body.id;
      const data = '{ "prefix": "-", "delete": "true", "deleteTime": 10000, "volume": 100, "maxVolume": 200, "djonly": false, "djroles": [], "levelup": false }'
      
      if (body === null) {
        writeServerData(id, JSON.parse(data));
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(data);
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(JSON.stringify(body));
      }
  });
});

app.post('/getBotInGuild', function(req, res) {
  var body = "";
  var state = false;

  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    var id = JSON.parse(body).id;
    
    request(`https://discordapp.com/api/v6/guilds/${id}/members/464747957288435732`, { headers: {
      Authorization: `Bot ${process.env.TOKEN}`
    } }, (err, resp, body) => {
      body = JSON.parse(body);
      if (!isNaN(body.code)) { 
        state = false; 
        res.writeHead(200, {
          'Content-Type': 'text/json'
        });
        body.state = state;
        return res.end(JSON.stringify(body));
      } else if (body.user.id === "464747957288435732") {
        state = true;
      
        body.state = state;
      
        res.writeHead(200, {
          'Content-Type': 'text/json'
        });
        return res.end(JSON.stringify(body));
      }
    });
  });
});

app.listen(3001);

/* BOT */

//Libraries
const db = require('quick.db'); //Quick.db
const Discord = require('discord.js'); //Discord library
const fs = require('fs'); //FileSystem
const { RichEmbed, Attachment } = Discord;

//Creating bot
const client = new Discord.Client({
  forceFetchUsers: true
});

db.createWebview(process.env.PASSWORD, process.env.PORT); 

try {
  var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
} catch (ex) {
  console.log("[ERROR] Config overwrited");
  console.log("[ERROR_TEXT] " + ex);
  var config = {}
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
}

const active = new Map();
const log = client.channels.get("471603875749691393"); // Logging channel

const totalDB = new db.table("TOTAL");
const itemsDB = new db.table("ITEMS");

var data = {
  "xp": 0,
  "level": 0
};

const serverStats = {
  guildID: '471591472311828480',
  totalUsersID: '471602694436683786',
  memberCountID: '471602835495190528',
  botCountID: '471602889974874113',
  ticketCategoryID: '476819317238005770'
}

var ownerId = '618815086512832533'; 

const getDefaultChannel = async (guild) => {
  if (guild.channels.has(guild.id))
    return guild.channels.get(guild.id)

  if (guild.channels.exists(r => r.name === "general"))
    return guild.channels.find(n => n.name === "general").id;

  return guild.channels
    .filter(c => c.type === "text" &&
      c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
    .sort((a, b) => a.position - b.position ||
      Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
    .first().id;
}

client.on("error", e => {
  console.log("[ERROR] " + e);
});

client.on('ready', () => { //Startup
  console.log("[LOG] Bot on! Started with " + client.users.size + " users and " + client.guilds.size + " guilds.");

  client.user.setStatus('dnd');
  client.user.setActivity(`on ${client.users.size} users | -help`, {
    type: 'WATCHING'
  });
});

client.on("disconnected", () => {
  console.log("[WARN] Disconnected from Discord");
  console.log("[LOG] Attempting to log in...");
  client.login(process.env.TOKEN);
});

client.on('guildCreate', guild => { // If the Bot was added on a server, proceed
  client.user.setActivity(`on ${client.users.size} users | -help`, {
    type: 'WATCHING'
  });

  var chan = client.channels.get("471603875749691393");

  config[guild.id] = {
    prefix: '-',
    delete: 'true',
    deleteTime: 10000,
    volume: 100,
    maxVolume: 200,
    djonly: false,
    djroles: [],
    levelup: false
  }
  fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

});


/* ON MESSAGE */
client.on('message', async message => { //If recieves message

  /* START OF TICKET SUPPORT */
  const bldb = new Enmap({ name: 'bldb' });
  const key = `${message.guild.id-message.author.id}`;
  
  if (message.content.startsWith('-new')) { 

		bldb.ensure('blusers', []);

	 if (bldb.get('blusers').some(data => data.includes(key))) return err('You are blacklisted!');

		const reason = message.content.split(' ').slice(1).join(' ');
		if(!reason) return message.channel.send('You didn\'t give me a reason to open the ticket.');
		if (!message.guild.roles.find(c => c.name === 'Support Team')) return err('This server doesn\'t have a `Support Team` role made, so the ticket won\'t be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets. Also must give the role permission to `Allow anyone to mention the role`.');
		if (message.guild.channels.find(c => c.name === 'ticket-' + message.author.id)) return err('You already have a ticket open.');
		if(message.guild.channels.some(c => /ticket-[0-9]{18,20}/.test(c.name))) return err('This server already has a ticket open. until that you can\'t open another.');
		message.guild.createChannel(`ticket-${message.author.id}`, 'text').then(c => {
  	const role = message.guild.roles.find(r => r.name === 'Support Team');
		 const role2 = message.guild.defaultRole;

			c.overwritePermissions(role, {

				SEND_MESSAGES: true,
				READ_MESSAGES: true,

			});

			c.overwritePermissions(role2, {

				SEND_MESSAGES: false,
				READ_MESSAGES: false,

			});

			c.overwritePermissions(message.author, {

				SEND_MESSAGES: true,
				READ_MESSAGES: true,

			});

			sendEmbed(`:white_check_mark: Your ticket has been created, ${c}.`, false);

			const embed = new RichEmbed()

				.setColor('RANDOM')
				.addField(`Hey ${message.author.username}!`, 'Please try explain why you opened this ticket with as much detail as possible. Our **Support Team** will be here soon to help.')
				.addField('Reason', reason)
				.addField('Opened By:', `${message.author.tag}`)
				.setTimestamp();

			c.send({ embed: embed });
			c.send(`${role} | <@${message.author.id}>`);

		}).catch(console.error);


	}


  	if (message.content.startsWith('add')) {

		const member = message.mentions.members.first();
		if(!member) return err('You didn\'t mention a vaild user or the user dosen\'t exist in this guild');
		if (!message.channel.name.startsWith('ticket-')) return err('You can\'t add a member outside of a ticket channel.');

		message.channel.overwritePermissions(member, {

			SEND_MESSAGES: true,
			READ_MESSAGES: true,

		});

		sendEmbed(`:white_check_mark: **${member.user.tag}** (${member.user.id}) has been added to the ticket.`);

	}


	if (message.content.startsWith('-close')) {

		if (!message.channel.name.startsWith('ticket-')) return err('You can\'t use the `close` command outside of a ticket channel.');
		const reason = message.content.split(' ').slice(1).join(' ');
		if(!reason) return err('You didn\'t give me a reason to close the ticket.');
		let createdBy = message.channel.name.replace('ticket-', '');
		createdBy = client.users.get(createdBy);

		message.channel.send('Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type `-confirm`. This will time out in 10 seconds and be cancelled.')

			.then(m => {

				message.channel.awaitMessages(response => response.content === '-confirm', {

					max: 1,

					time: 10000,

					errors: ['time'],

				})

					.then(async collected => {

						message.channel.fetchMessages({ limit:100 }).then(async fetched => {

							fetched = fetched.array().reverse();
							const mapped = fetched.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
							const att = new Attachment(Buffer.from(mapped), 'transcript.txt');
              

							const embed = new RichEmbed()

						  	        .setColor('RANDOM')
								.setTitle('Your ticket has been closed!')
								.addField('Closed By:', message.author.tag)
								.addField('Reason:', reason)
								.setDescription('But don\'t worry! Here\'s your transcript: **(Note: This can only show 100 messages maximum as the Discord API limit. If there were more, It may not be able to show them.)**');

							createdBy.send(embed);
							createdBy.send(att);

							let logc = message.guild.channels.find(c => c.name === 'ticket-log');
							if(!logc) logc = await message.guild.createChannel('ticket-log', 'text');

							const closedEmbed = new RichEmbed()

								.setColor('RANDOM')
								.setTitle('Ticket Closed!')
								.addField('Created By:', createdBy.tag)
								.addField('Closed By:', message.author.tag)
								.addField('Reason:', reason);

							await logc.send(closedEmbed);


						});

						message.channel.delete();

					})

					.catch(() => {

						m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {

							m2.delete(5000);

						}, 3000);

					});

			});

	}


	if(message.content.startsWith('-transcript')) {

		if(!message.channel.name.startsWith('ticket-')) return err('You can\'t use the `transcript` command outside of a ticket channel.');

		message.channel.fetchMessages({ limit:100 }).then(async fetched => {

			fetched = fetched.array().reverse();
			const mapped = fetched.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
			const att = new Attachment(Buffer.from(mapped), 'transcript.txt');

			message.channel.send(att);
		});

	}
  
 


	/* The functions are just for making the work simple and easy for you, you can use it if you want. or, remove it.*/


	function sendEmbed(text, sendEmbedToAuthor) { // This function does what actually is just send an embed to this channel or send an embed to this author who executed the command.
		const embed = new RichEmbed()
			.setDescription(text)
			.setColor('RANDOM');
		if (sendEmbedToAuthor) {
			return message.author.send(embed);
		}
		else {
			return message.channel.send(embed);
		}
	}

	function send(text, sendToAuthor) { // This function does what actually is just send a message to this channel or send a message to this author who executed the command.
		if(sendToAuthor) {
			return message.author.send(text);
		}
		else {
			return message.channel.send(text);

		}

	}

	function err(text) { // This basically sends an error embed. you need to check the error and send the embed.
		const embed = new RichEmbed()
			.setTitle('Error!')
			.setDescription(text)
			.setColor(0xFF0000);
		return message.channel.send(embed);

	}

  
  
  
  

  /* END OF TICKET SUPPORT */

 
  
  if (message.channel.type == "dm") return;

  try {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Overwrite prefix (important for changing prefix)
  } catch (ex) {
    config[message.guild.id] = {
      prefix: '-',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }


  if (config[message.guild.id] == undefined) {
    config[message.guild.id] = {
      prefix: '-',
      delete: 'true',
      deleteTime: 10000,
      volume: 100,
      maxVolume: 200,
      djonly: false,
      djroles: [],
      levelup: false
    }
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }

  var xpAdd = Math.floor(Math.random() * 7) + 8;

  // POINT SYSTEM

  if (message.guild.id === "264445053596991498") {} else {

    db.fetch(`balance_${message.guild.id}_${message.author.id}`).then(b => {
      if (b == null || b == undefined) db.set(`balance_${message.guild.id}_${message.author.id}`, 50); //If no data
    });
    
    itemsDB.fetch(`${message.guild.id}_${message.author.id}`).then(a => {
      if (a == null || a == undefined) itemsDB.set(`${message.guild.id}_${message.author.id}`, [0, 0, 0, 0, 0, 0]); //If no data
    });

    db.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
      if (i == null || i == undefined) {

        db.set(`${message.guild.id}_${message.author.id}`, data); //If no data
        totalDB.set(`${message.guild.id}_${message.author.id}`, 0)

      } else {

        totalDB.fetch(`${message.guild.id}_${message.author.id}`).then(total => {

          if (total == null || total == undefined) {
            totalDB.set(`${message.guild.id}_${message.author.id}`, 0);
          } else {

            if (i.level == null || i.level == undefined || i.level == 0) {
              db.set(`${message.guild.id}_${message.author.id}`, 1, {
                "target": ".level"
              });
            }

            db.add(`${message.guild.id}_${message.author.id}`, xpAdd, {
              "target": ".xp"
            }).then(j => {
              totalDB.add(`${message.guild.id}_${message.author.id}`, xpAdd, {
                "target": ".total"
              });
            });

            db.fetch(`${message.guild.id}_${message.author.id}`).then(data => {
              console.log(`${message.content} | USER - ${message.author.username} | LEVEL ${data.level} | POINTS - ${data.xp} | ADDED ${xpAdd} | TOTAL - ${total}`);

              var xpReq = data.level * 300;

              if (data.xp >= xpReq) {
                db.add(`${message.guild.id}_${message.author.id}`, 1, {
                  "target": ".level"
                });
                db.set(`${message.guild.id}_${message.author.id}`, 0, {
                  "target": ".xp"
                });
                db.fetch(`${message.guild.id}_${message.author.id}`, {
                  "target": ".level"
                }).then(lvl => {
                  if (config[message.guild.id].levelup === "true") {
                    message.channel.send({
                      embed: {
                        "title": "Level Up!",
                        "description": "Now your level - **" + lvl + "**",
                        "color": 0x42f477
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

  }
  //END OF POINT SYSTEM

  var prefix = config[message.guild.id].prefix;

  let args = message.content.slice(prefix.length).trim().split(' '); //Setting-up arguments of command
  let cmd = args.shift().toLowerCase(); //LowerCase command

  if (message.content === "-reset-prefix") {
    config[message.guild.id].prefix = '-';
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send({
      embed: {
        "title": "Prefix - -",
        "color": 0x22ff22
      }
    });
    return;
  }

  if (message.content === prefix + "nsfw" && message.guild.id == "471591472311828480") {
    message.delete(1000);
    var author = message.member;
    var role = message.guild.roles.find(c => c.name === "Hide NSFW"); //Role Search
    if (author.roles.has(role.id)) {
      author.removeRole(role).then(() => message.channel.send({
        embed: {
          "title": "Now you will see that hell... :ok_hand:"
        }
      })).then(msg => {
        msg.delete(10000);
      });
    } else {
      author.addRole(role).then(() => message.channel.send({
        embed: {
          "title": "Now your mom won't see any hentai :ok_hand:"
        }
      })).then(msg => {
        msg.delete(10000);
      });
    }
    return;
  }

  if (!message.content.startsWith(prefix)) return; //If no prefix

  //Command handler
  try {

    if (config[message.guild.id].delete == 'true') {
      message.delete(config[message.guild.id].deleteTime).catch(function(e) {
        console.log("[WARN] Can't delete message - " + e);
      });
    }

    let ops = {
      ownerId: ownerId,
      active: active
    }

    if (cmd == '') {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Enter command"
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {
            console.log("[WARN] Can't delete message - " + e);
          });
        }
      });
    }

    let commandFile = require(`./commands/${cmd}.js`); //Require command from folder
    commandFile.run(client, message, args, ops); //Pass four args into 'command'.js and run it

  } catch (e) { //Catch errors 
    if (!message.content === "y+reset-prefix") {
      message.channel.send({
        embed: {
          "color": 0xff2222,
          "fields": [{
            "name": "**Error**",
            "value": "Something went wrong \n" + e
          }]
        }
      }).then(msg => {
        if (config[message.guild.id].delete == 'true') {
          msg.delete(config[message.guild.id].deleteTime).catch(function(e) {
            console.log("[WARN] Can't delete message - " + e);
          });
        }
      });
    }
  }
});

client.on('guildMemberAdd', member => {

  try {
    var settings = JSON.parse(fs.readFileSync("./notifications.json", "utf8")); //Notifications file
  } catch (ex) {
    console.log("[ERROR] Join/Leave settings overwrited");
    console.log("[ERROR_TEXT] " + ex);
    const reset = {}
    fs.writeFile("./notifications.json", JSON.stringify(reset), (err) => console.error);
  }
  var settings = JSON.parse(fs.readFileSync("./notifications.json", "utf8")); //Notifications file

  console.log("[LOG] Member added in " + member.guild.name);

  // RESETTING IF ERROR //

  if (settings[member.guild.id] === null || settings[member.guild.id] === undefined) { // If no settings for greeting
    settings[member.guild.id] = {
      "joinState": "false",
      "joinChannel": "join-leave",
      "joinMessage": "Welcome <USER> to our server!",
      "leaveState": "false",
      "leaveChannel": "join-leave",
      "leaveMessage": "Goodbye, <USER>!"
    }
    fs.writeFile("./notifications.json", JSON.stringify(settings), (err) => console.error);
  }

  // END //

  var log = client.channels.get("471603875749691393");

  var joinState = settings[member.guild.id].joinState;
  var joinChannel = settings[member.guild.id].joinChannel;
  var joinMessage = settings[member.guild.id].joinMessage;
  var joinMessageEdited = joinMessage;

  if (joinMessage.includes("<USER>")) {
    joinMessageEdited = joinMessage.replace(/<USER>/, member.user.username);
  }

  if (member.guild.id === serverStats.guildID) {
    client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
    db.set(`${member.guild.id}_${member.id}`, data);
    totalDB.set(`${member.guild.id}_${member.id}`, 0);

    var userGot = new Discord.RichEmbed()
      .setColor(0x555555)
      .setDescription("User Joined")
      .setTitle(member.user.tag);

    log.send(userGot);

  } else if (joinState === "true") {
    if (member.guild.channels.find(c => c.name === joinChannel) == null) return;
    member.guild.channels.find(c => c.name === joinChannel).send({
      embed: {
        "description": joinMessageEdited,
        "color": 0x22ff22,
        "title": "Log"
      }
    });
  }

});

client.on('guildMemberRemove', member => {

  try {
    var settings = JSON.parse(fs.readFileSync("./notifications.json", "utf8")); //Notifications file
  } catch (ex) {
    console.log("[ERROR] Join/Leave settings overwrited");
    console.log("[ERROR_TEXT] " + ex);
    const reset = {}
    fs.writeFile("./notifications.json", JSON.stringify(reset), (err) => console.error);
  }
  var settings = JSON.parse(fs.readFileSync("./notifications.json", "utf8")); //Notifications file

  console.log("[LOG] Member removed in " + member.guild.name);

  // RESETTING IF ERROR //

  if (settings[member.guild.id] === null || settings[member.guild.id] === undefined) { // If no settings for greeting
    settings[member.guild.id] = {
      "joinState": "false",
      "joinChannel": "join-leave",
      "joinMessage": "Welcome <USER> to our server!",
      "leaveState": "false",
      "leaveChannel": "join-leave",
      "leaveMessage": "Goodbye, <USER>!"
    }
    fs.writeFile("./notifications.json", JSON.stringify(settings), (err) => console.error);
  }

  // END //

  var log = client.channels.get("471603875749691393");

  var leaveState = settings[member.guild.id].leaveState;
  var leaveChannel = settings[member.guild.id].leaveChannel;
  var leaveMessage = settings[member.guild.id].leaveMessage;
  var leaveMessageEdited = leaveMessage;

  if (leaveMessage.includes("<USER>")) {
    leaveMessageEdited = leaveMessage.replace(/<USER>/, member.user.username);
  }

  if (member.guild.id === serverStats.guildID) {
    client.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
    db.delete(`${member.guild.id}_${member.id}`);
    totalDB.delete(`${member.guild.id}_${member.id}`);

    var userLost = new Discord.RichEmbed()
      .setColor(0x555555)
      .setDescription("User Left")
      .setTitle(member.user.tag);

    log.send(userLost);

  } else if (leaveState === "true") {
    if (member.guild.channels.find(c => c.name === leaveChannel) == null) return;
    member.guild.channels.find(c => c.name === leaveChannel).send({
      embed: {
        "description": leaveMessageEdited,
        "color": 0xff2222,
        "title": "Log"
      }
    });
  }
  

});




//Connecting bot
client.login(process.env.TOKEN);