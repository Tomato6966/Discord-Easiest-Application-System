//import the Discord Library
const Discord = require("discord.js");

//import the config.json file
const config = require("./config.json")

//create a new Client
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  shards: "auto",
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  presence: {
    afk: false,
    activity: {
      name: `${config.prefix}help | ${config.prefix}setup`, 
      type: "WATCHING", 
    },
    status: "idle"
  }
});


//import our databasing system
const Enmap = require("enmap");

//create all 3 different databases for each application system
client.apply = new Enmap({
  name: "apply",
  dataDir: "./dbs/apply"
})
client.apply2 = new Enmap({
  name: "apply2",
  dataDir: "./dbs/apply2"
})
client.apply3 = new Enmap({
  name: "apply3",
  dataDir: "./dbs/apply3"
})
client.apply4 = new Enmap({
  name: "apply4",
  dataDir: "./dbs/apply4"
})
client.apply5 = new Enmap({
  name: "apply5",
  dataDir: "./dbs/apply5"
})
client.apply6 = new Enmap({
  name: "apply6",
  dataDir: "./dbs/apply6"
})
client.apply7 = new Enmap({
  name: "apply7",
  dataDir: "./dbs/apply7"
})
client.apply8 = new Enmap({
  name: "apply8",
  dataDir: "./dbs/apply8"
})
client.apply9 = new Enmap({
  name: "apply9",
  dataDir: "./dbs/apply9"
})
client.apply10 = new Enmap({
  name: "apply10",
  dataDir: "./dbs/apply10"
})
//LOAD EACH MODULE FOR CMDS AND APPLIES
require(`./modules/cmds`)(client);
require(`./modules/apply`)(client);
require(`./modules/apply2`)(client);
require(`./modules/apply3`)(client);
require(`./modules/apply4`)(client);
require(`./modules/apply5`)(client);

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
 process.on('unhandledRejection', (reason, p) => {
  console.log('=== unhandled Rejection === ignore that log'.toUpperCase());
});
process.on("uncaughtException", (err, origin) => {
  console.log('=== uncaught Exception === ignore that log'.toUpperCase());
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('=== uncaught Exception Monitor === ignore that log'.toUpperCase());;
});
process.on('beforeExit', (code) => {
  console.log('=== before Exit === ignore that log'.toUpperCase());
});
process.on('exit', (code) => {
  console.log('=== exit === ignore that log'.toUpperCase());
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('=== multiple Resolves === ignore that log'.toUpperCase());
});