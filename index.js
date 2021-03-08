//import the Discord Library
const Discord = require("discord.js");
//create a new Client
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//import the config.json file
const config = require("./config.json")

//import our databasing system
const Enmap = require("enmap");

//create all 3 different databases for each application system
client.apply = new Enmap({name: "apply", dataDir: "./dbs/apply"})
client.apply2 = new Enmap({name: "apply2", dataDir: "./dbs/apply2"})
client.apply3 = new Enmap({name: "apply3", dataDir: "./dbs/apply3"})

//LOAD EACH MODULE FOR CMDS AND APPLIES
require(`./modules/cmds`)(client);
require(`./modules/apply`)(client);
require(`./modules/apply2`)(client);
require(`./modules/apply3`)(client);

//login to the BOT
client.login(config.token);
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention Him / Milrato Development, when using this Code!
  * @INFO
*/
