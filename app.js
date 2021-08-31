const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const fs = require("fs");
const config = require("./data/config.json");
const update = require('./scripts/update.js');

//info page
global.infoChannelID = config.channelID;
global.infoMessages = new Array(3);

//command handler setup
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./commands/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

//startup
client.on("ready", () => {
	console.log('connected to discord');
});

//command handler
client.on("message", (message) => {

	if (message.author.bot) return;

	if (message.channel.id === infoChannelID) {	//if message was sent in info channel, update info
		
		update( client.channels.get(infoChannelID) );

	} else {

  	//mention trigger
  	//if (!message.mentions.members.first()) return; 		
    //if (message.mentions.members.first().id !== client.user.id) return;
		
    //prefix trigger
    if (message.content.indexOf(config.prefix) !== 0) return;

    if (message.author.bot) return;

		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		
    fs.readdir("./commands/", (err, files) => {
   		files.forEach( file => {
    		if(command == file.split(".")[0]) {
        	let commandFile = require(`./commands/${command}.js`);
    	    commandFile.run(client, message, args);
        }
      });                       
    });

	}

});

client.login(config.token);

