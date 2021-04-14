//import the config.json file
const config = require("../config.json")

//import the Discord Library
const Discord = require("discord.js");

//Start the module
module.exports = client => {
  /** ////////////////////////////////////////// *
   * LOG EVERY TIME THE BOT GETS READY and STATUS CHANGE
   * ////////////////////////////////////////// *
   */
  client.on("ready", () => {
    console.log("BOT IS READY " + client.user.tag)
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(() => {
      change_status(client);
    }, 15 * 1000);

    async function change_status(client) {
      let totalSetups = 0;        
      totalSetups += client.apply.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply2.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply3.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply4.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply5.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply6.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply7.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply8.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply9.filter(s => s.channel_id && s.channel_id.length > 1).size;
      totalSetups += client.apply10.filter(s => s.channel_id && s.channel_id.length > 1).size;
      let allusers = 0;
      let allguolds = client.guilds.cache.array()
      for(const guild of allguolds)
      {
        allusers += guild.memberCount;
      }
      client.user.setActivity(`${config.prefix}help | ${config.prefix}setup | ${Math.abs(client.guilds.cache.size) > 999 ? Math.sign(client.guilds.cache.size)*((Math.abs(client.guilds.cache.size)/1000).toFixed(1)) + 'k' : Math.sign(client.guilds.cache.size)*Math.abs(client.guilds.cache.size)} Guilds | ${Math.abs(allusers) > 999 ? Math.sign(allusers)*((Math.abs(allusers)/1000).toFixed(1)) + 'k' : Math.sign(allusers)*Math.abs(allusers)} Members | ${Math.abs(totalSetups * 2) > 999 ? Math.sign(totalSetups * 2)*((Math.abs(totalSetups * 2)/1000).toFixed(1)) + 'k' : Math.sign(totalSetups * 2)*Math.abs(totalSetups * 2)} Setups`, {
        type: "WATCHING"
      });
    }
  })

  /** ////////////////////////////////////////// *
   * LOG EVERY SINGLE MESSAGE
   * ////////////////////////////////////////// *
   */
  client.on("message", async (message) => {
    //if message from a bot, or not in a guild return error
    if (message.author.bot || !message.guild) return;
    try {
      //ensure the databases
      databasing(client, message.guild.id)

      //get the prefix from the config.json file
      let prefix = config.prefix;
      //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
      const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
      //if its not that then return
      if (!prefixRegex.test(message.content)) return;
      //now define the right prefix either ping or not ping
      const [, matchedPrefix] = message.content.match(prefixRegex);

      //create the arguments with sliceing of of the rightprefix length
      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      //creating the cmd argument by shifting the args by 1
      const cmd = args.shift().toLowerCase();

      //if no cmd added return error
      if (cmd.length === 0) {
        if (matchedPrefix.includes(client.user.id))
          return message.channel.send(new Discord.MessageEmbed()
            .setColor("#fcfc03")
            .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
            .setTitle(`Hugh? I got pinged? Imma give you some help`)
            .setDescription(`To see all Commands type: \`${prefix}help\`\n\nTo setup an Application System type: \`${prefix}setup\`\n\nYou can edit the setup by running: \`${prefix}editsetup\`\n\n*There are 2 other setups just add Number 2/3 to the end of setup like that: \`${prefix}setup2\`/\`${prefix}setup3\`*`)
          );
        return;
      }

      //if the Bot has not enough permissions return error
      let required_perms = ["MANAGE_CHANNELS", "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_ROLES"]
      if (!message.guild.me.hasPermission(required_perms)) {
        try {
          message.react("❌");
        } catch {}
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
          .setTitle("❌ Error | I don't have enough Permissions!")
          .setDescription("Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") + "`")
        )
      }

      //ALL CMDS, yes not looking great but its enough ;)
      if (["h", "help", "cmd"].includes(cmd)) {
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setTitle("These are all cmds!")
          .setURL("https://youtu.be/X2yqNtd3COE")
          .setDescription(`PREFIX: \`${prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
          .addField(`\`help\``, "Shows all available Commands!", true)
          .addField(`\`add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands) the Bot!*", true)
          .addField(`\`support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*", true)
          .addField(`\`ping\``, "> *Shows the ping of the Bot!*", true)
          .addField(`\`uptime\``, "> *Shows the uptime of the Bot!*", true)
          .addField(`\`info\``, "> *Shows Information & Stats of the Bot*", true)
          .addField(`\`tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*", true)
          .addField(`\`source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*", true)

          .addField("\u200b", "\u200b")
          .addField(`\`setup\` --> Follow steps`, "> *Sets up 1 Application System out of 5, with maximum of 24 Questions!*\n> *You can also edit that by picking edit afterwards*")

          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
      } else if (["ping", "latency", "responsetime"].includes(cmd)) {
        message.channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
          .setTitle(`📶 Pinging....`)
        ).then(msg => {
          msg.edit(new Discord.MessageEmbed()
            .setColor("#fcfc03")
            .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
            .setTitle(`📶 Ping: \`${Math.round(Date.now() - message.createdTimestamp)}ms\`\n\n📶 Api Latency: \`${Math.round(client.ws.ping)}ms\``)
          );
        })
        return;
      } else if (["support", "sup", "discord", "dc", "server", "guild", "video", "vid", "tutorial", "tut"].includes(cmd)) {
        message.channel.send(
          new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setFooter(client.user.username, config.AVATARURL)
          .setAuthor(`${client.user.username} Support`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setDescription("[\`Join to Support Server\`](https://discord.gg/wvCp7q88G3) to gain help! OR watch the [Tutorial Video](https://youtu.be/X2yqNtd3COE)")
        )
        return console.log("Support Command finished Bot by Tomato#6966");
      } else if (["info", "stats", "stat", "botinfo", "about", "bot", "inf"].includes(cmd)) {
        let cpuStat = require("cpu-stat");

        function duration(ms) {
          const sec = Math.floor((ms / 1000) % 60).toString()
          const min = Math.floor((ms / (1000 * 60)) % 60).toString()
          const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
          const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
          return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
        }
        let totalMembers = client.guilds.cache.reduce((c, g) => c + g.memberCount, 0);

        let totalSetups = 0;
        totalSetups += client.apply.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply2.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply3.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply4.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply5.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply6.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply7.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply8.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply9.filter(s => s.channel_id && s.channel_id.length > 1).size;
        totalSetups += client.apply10.filter(s => s.channel_id && s.channel_id.length > 1).size;

        // oldembed: message.channel.send(embed)
        cpuStat.usagePercent(function (e, percent, seconds) {
          if (e) {
            return console.log(String(e.stack).red);
          }          
            const botinfo = new Discord.MessageEmbed()
              .setAuthor(client.user.tag + " Information", client.user.displayAvatarURL(), "https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot") 
              .setDescription(`\`\`\`yml\nName: ${client.user.tag} [${client.user.id}]\nBot Latency: ${Math.round(Date.now() - message.createdTimestamp)}ms\nApi Latency: ${Math.round(client.ws.ping)}ms\nRuntime: ${duration(client.uptime).split("\`").join(" ")}\`\`\``)
              .setColor("#fcfc03")
              .addField("• General -- Stats", `\`\`\`yml\nServers: ${client.guilds.cache.size}\nUsers: ${totalMembers}\nSetups: ${totalSetups * 2}\`\`\``, true)
              .addField("• Bot -- Stats", `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap: v5.8.4\`\`\``, true)
              .addField("• System -- Stats", `\`\`\`yml\nOS: Linux | Debian\nCPU Usage: ${percent.toFixed(2)} %\nRAM usage: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)} MB\`\`\``, true)
              .addField("• Developer", `\`\`\`yml\nName: Tomato#6966 [442355791412854784]\`\`\``)
              .addField("• Important Links", `**[Invite Link](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot)\`|\`[Support Server](https://discord.gg/pe3V7uT)\`|\`[Website](https://milrato.eu)\`|\`[Get Free Bots](https://discord.gg/upwdq3zyC3)**`)
              .setFooter("Coded by:    Tomato#6966", client.user.displayAvatarURL());
            message.channel.send(botinfo);
        })

        return;
      } else if (["time", "runtime", "uptime"].includes(cmd)) {
        function duration(ms) {
          const sec = Math.floor((ms / 1000) % 60).toString()
          const min = Math.floor((ms / (1000 * 60)) % 60).toString()
          const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
          const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
          return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
        }
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setTitle("🕐 | MY UPTIME:")
          .setDescription(`${duration(client.uptime)}`)
          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
      } else if (["add", "ad", "invite", "link"].includes(cmd)) {
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setURL("https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands")
          .setTitle("❤ | Thanks for every invite!")
          .setDescription(`[Click here to invite me, thanks (Main version)](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands)\n\n[*Click here to invite the SECOND VERSION (If you need 10 more applies lol)*](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands)`)
          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
      } else if (["src", "source", "git", "github"].includes(cmd)) {
        message.channel.send(
          new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setFooter(client.user.username, config.AVATARURL)
          .setAuthor(`${client.user.username}'s' Source Code`, client.user.displayAvatarURL(), "https://milrato.eu")
          .setTitle(`This Bot is made by \`Tomato#6966\` and **this** is the Source Code link to this Bot`)
          .setURL("https://github.com/Milrato-Development/Easiest-Application")
          .addField("Discord.js: ", "[\`v12.5.1\`](https://discord.js.org)", true)
          .addField("Node.js: ", "[\`v15.3.4\`](https://nodejs.org/en/)", true)
          .addField("Enmap: ", "[\`v5.8.4\`](https://enmap.evie.dev/api)", true)
          .addField("Source Code. ", "Don't just use the source for yourself,... please [invite](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands) me too![\`Click here\`](https://github.com/Milrato-Development/Easiest-Application)")

        )
        return;
      }
      //FIRST APPLICATION SYSTEM
      else if (["setup", "manage", "create", "apply"].includes(cmd)) {
        try {
          if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
              .setTitle(`❌ ERROR | You are not allowed to run this Bot`)
              .setDescription(`${adminroles.length > 0 ? "You need one of those Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ")  : `No Admin Roles Setupped yet! Do it with: \`${prefix}setup-admin\``}`)
            );
            let errored = false;
            let timeouterror = false;
            const filter = (reaction, user) => {
              return user.id === message.author.id;
            };
            let temptype = ""
            let tempmsg;
            let apply_for_here = client.apply;
            tempmsg = await message.channel.send(new Discord.MessageEmbed()
              .setTitle("What do you want to do?")
              .setColor("#fcfc03")
              .setDescription(`1️⃣ **==** Manage the **first** Application System

2️⃣ **==** Manage the **second** Application System

3️⃣ **==** Manage the **third** Application System

4️⃣ **==** Manage the **fourth** Application System

5️⃣ **==** Manage the **fifth** Application System

6️⃣ **==** Manage the **sixth** Application System

7️⃣ **==** Manage the **seventh** Application System

8️⃣ **==** Manage the **eigth** Application System

9️⃣ **==** Manage the **ninth** Application System

🔟 **==** Manage the **tenth** Application System



*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
            )
            try {
              tempmsg.react("1️⃣")
              tempmsg.react("2️⃣")
              tempmsg.react("3️⃣")
              tempmsg.react("4️⃣")
              tempmsg.react("5️⃣")
              tempmsg.react("6️⃣")
              tempmsg.react("7️⃣")
              tempmsg.react("8️⃣")
              tempmsg.react("9️⃣")
              tempmsg.react("🔟")
            } catch (e) {
              return message.reply(new Discord.MessageEmbed()
                .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                .setColor("RED")
                .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
              );
            }
            await tempmsg.awaitReactions(filter, {
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                let reaction = collected.first()
                reaction.users.remove(message.author.id)
                if (reaction.emoji.name === "1️⃣") {apply_for_here = client.apply; temptype = "1";}
                else if (reaction.emoji.name === "2️⃣") {apply_for_here = client.apply2; temptype = "2";}
                else if (reaction.emoji.name === "3️⃣") {apply_for_here = client.apply3; temptype = "3";}
                else if (reaction.emoji.name === "4️⃣") {apply_for_here = client.apply4; temptype = "4";}
                else if (reaction.emoji.name === "5️⃣") {apply_for_here = client.apply5; temptype = "5";}
                else if (reaction.emoji.name === "6️⃣") {apply_for_here = client.apply6; temptype = "6";}
                else if (reaction.emoji.name === "7️⃣") {apply_for_here = client.apply7; temptype = "7";}
                else if (reaction.emoji.name === "8️⃣") {apply_for_here = client.apply8; temptype = "8";}
                else if (reaction.emoji.name === "9️⃣") {apply_for_here = client.apply9; temptype = "9";}
                else if (reaction.emoji.name === "🔟") {apply_for_here = client.apply10; temptype = "10";}
                else throw "You reacted with a wrong emoji"
      
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply(new Discord.MessageEmbed()
                .setTitle(":x: ERROR | Your Time ran out")
                .setColor("RED")
                .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
              );
    
    
              tempmsg = await tempmsg.edit(new Discord.MessageEmbed()
              .setTitle("What do you want to do?")
              .setColor("#fcfc03")
              .setDescription(`1️⃣ **== Setup / Create** a new Application (Overwrite)\n\n2️⃣ **== Edit** the Application Process Parameters\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
            )
            await tempmsg.awaitReactions(filter, {
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                let reaction = collected.first()
                reaction.users.remove(message.author.id)
    
    
                if (reaction.emoji.name === "1️⃣") {
                   
                    let color = "GREEN";
                    let desc;
                    let userid = message.author.id;
                    
          
                    let pickmsg = await tempmsg.edit(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setTitle("What do you want me to do?").setDescription("1️⃣ === I will create a Channel for you\n2️⃣ === You can pick your own Channels!").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
                    await pickmsg.awaitReactions((reaction, user) => user.id === message.author.id , {
                        max: 1,
                        time: 60000,
                        erros: ["time"]
                      }).then(collected => {
                        if (collected.first().emoji.name == "1️⃣") setup_with_channel_creation()
                        if (collected.first().emoji.name == "2️⃣") setup_without_channel_creation()
                      })
                      .catch(e => {
                        errored === true
                      })
                    if (errored)
                      return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                        timeout: 7500
                      }))
    
                    async function setup_with_channel_creation() {
                    
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
                        message.guild.channels.create("📋 | Applications", {
                          type: "category",
                        }).then(ch => {
                          ch.guild.channels.create("✔️|finished-applies", {
                            type: "text",
                            topic: "React to the Embed, to start the application process",
                            parent: ch.id,
                            permissionOverwrites: [{
                              id: ch.guild.id,
                              deny: ["VIEW_CHANNEL"]
                            }]
                          }).then(ch => {
                            apply_for_here.set(ch.guild.id, ch.id, "f_channel_id")
                          })
                          ch.guild.channels.create("✅|apply-here", {
                            type: "text",
                            topic: "React to the Embed, to start the application process",
                            parent: ch.id,
                            permissionOverwrites: [{
                                id: ch.guild.id,
                                allow: ["VIEW_CHANNEL"],
                                deny: ["SEND_MESSAGES"]
                              },
                              {
                                id: client.user.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                              }
                            ]
                          }).then(ch => {
                            let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              .setColor("ORANGE")
                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)")).then(msg => {
                              msg.channel.awaitMessages(m => m.author.id === userid, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  let content = collected.first().content;
                                  if (!content.startsWith("#") && content.length !== 7) {
                                    message.channel.send("WRONG COLOR! USING `GREEN`")
                                  } else {
                                    if (isValidColor(content)) {
                                      console.log(content)
                                      color = content;
                                    } else {
                                      message.channel.send("WRONG COLOR! USING `GREEN`")
                                    }
                                  }
          
                                  function isValidColor(str) {
                                    return str.match(/^#[a-f0-9]{6}$/i) !== null;
                                  }
                                }).catch(error => {
          
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                                .then(something => {
                                  message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg => {
                                    msg.channel.awaitMessages(m => m.author.id === userid, {
                                      max: 1,
                                      time: 60000,
                                      errors: ["TIME"]
                                    }).then(collected => {
                                      desc = collected.first().content;
                                      let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        .setColor(color)
                                        .setDescription(desc)
                                        .setTitle("Apply for: `" + message.guild.name + "`")
                                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                      ch.send(setupembed).then(msg => {
                                        msg.react("✅")
                                        apply_for_here.set(msg.guild.id, msg.id, "message_id")
                                        apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                                      });
                                      let counter = 0;
                                      apply_for_here.set(msg.guild.id, [{
                                        "1": "DEFAULT"
                                      }], "QUESTIONS")
                                      ask_which_qu();
          
                                      function ask_which_qu() {
                                        counter++;
                                        if (counter === 25) {
                                          message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("You reached the maximum amount of Questions!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png"))
                                          return ask_addrole();
                                        }
                                        message.channel.send(embed.setTitle(`What should be the **${counter}** Question?`).setDescription("Enter `finish`, if you are finished with your Questions!")).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === userid, {
                                            max: 1,
                                            time: 60000,
                                            errors: ["TIME"]
                                          }).then(collected => {
                                            if (collected.first().content.toLowerCase() === "finish") {
                                              return ask_addrole();
                                            }
                                            switch (counter) {
                                              case 1: {
                                                apply_for_here.set(msg.guild.id, [], "QUESTIONS");
                                                apply_for_here.push(msg.guild.id, {
                                                  "1": collected.first().content
                                                }, "QUESTIONS");
                                              }
                                              break;
                                            case 2:
                                              apply_for_here.push(msg.guild.id, {
                                                "2": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 3:
                                              apply_for_here.push(msg.guild.id, {
                                                "3": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 4:
                                              apply_for_here.push(msg.guild.id, {
                                                "4": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 5:
                                              apply_for_here.push(msg.guild.id, {
                                                "5": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 6:
                                              apply_for_here.push(msg.guild.id, {
                                                "6": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 7:
                                              apply_for_here.push(msg.guild.id, {
                                                "7": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 8:
                                              apply_for_here.push(msg.guild.id, {
                                                "8": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 9:
                                              apply_for_here.push(msg.guild.id, {
                                                "9": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 10:
                                              apply_for_here.push(msg.guild.id, {
                                                "10": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 11:
                                              apply_for_here.push(msg.guild.id, {
                                                "11": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 12:
                                              apply_for_here.push(msg.guild.id, {
                                                "12": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 13:
                                              apply_for_here.push(msg.guild.id, {
                                                "13": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 14:
                                              apply_for_here.push(msg.guild.id, {
                                                "14": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 15:
                                              apply_for_here.push(msg.guild.id, {
                                                "15": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 16:
                                              apply_for_here.push(msg.guild.id, {
                                                "16": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 17:
                                              apply_for_here.push(msg.guild.id, {
                                                "17": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 18:
                                              apply_for_here.push(msg.guild.id, {
                                                "18": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 19:
                                              apply_for_here.push(msg.guild.id, {
                                                "19": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 20:
                                              apply_for_here.push(msg.guild.id, {
                                                "20": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 21:
                                              apply_for_here.push(msg.guild.id, {
                                                "21": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 22:
                                              apply_for_here.push(msg.guild.id, {
                                                "22": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 23:
                                              apply_for_here.push(msg.guild.id, {
                                                "23": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            case 24:
                                              apply_for_here.push(msg.guild.id, {
                                                "24": collected.first().content
                                              }, "QUESTIONS");
                                              break;
                                            }
                                            ask_which_qu();
                                          }).catch(error => {
          
                                            return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                          })
                                        })
                                      }
          
                                      function ask_addrole() {
                                        message.channel.send(embed.setTitle(`Do you want to add a Role, when some1 applies?`).setDescription("Enter `no`, if not\n\nJust ping the Role")).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === userid, {
                                            max: 1,
                                            time: 60000,
                                            errors: ["TIME"]
                                          }).then(async collected => {
                                            if (collected.first().content.toLowerCase() === "no") {
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              .setColor("#fcfc03")
                                              .setTitle(`Setup for ${temptype}. Application System Completed!`)
                                              .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                              
                                              );
                                            } else {
                                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                              if (!role) return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              .setColor("ORANGE")
                                              .setTitle(`Setup for ${temptype}. Application System Completed! | BUT COULD NOT FIND ROLE, SO I DONT USE A ROLE`)
                                              .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                              
                                              );
                                              let guildrole = message.guild.roles.cache.get(role)
          
                                              if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                                dynamic: true
                                              })))
          
                                              let botrole = message.guild.me.roles.highest
                                              console.log(guildrole.rawPosition)
                                              console.log(botrole.rawPosition)
                                              if (guildrole.rawPosition >= botrole.rawPosition) {
                                                message.channel.send(`I can't access that role, place \"me\" / \"my highest Role\" above other roles that you want me to manage.\n\n SO I AM USING **NO** ROLE, you can change it with: \`${prefix}setup\` -> ${temptype} Emoji -> :two:`)
                                                return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                .setColor("#fcfc03")
                                                .setTitle(`Setup for ${temptype}. Application System Completed!`)
                                                .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                                
                                                );
                                              }
                                              apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                .setColor("#fcfc03")
                                                .setTitle(`Setup for ${temptype}. Application System Completed!`)
                                                .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                              );
                                            }
                                          }).catch(error => {
          
                                            return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                          })
                                        })
                                      }
                                    }).catch(error => {
          
                                      return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                    })
                                  })
                                })
                            })
                          })
                        })
                    
                    }
    
                    async function setup_without_channel_creation() {
           
                        let applychannel;
                        let f_applychannel;
                        pickmsg = await message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setTitle("What should be the Channel, where someone should __start__ the Application?").setDescription("Please ping the Channel #channel").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
          
                        await pickmsg.channel.awaitMessages((m) => m.author.id === message.author.id, {
                            max: 1,
                            time: 60000,
                            erros: ["time"]
                          }).then(collected => {
                            let channel = collected.first().mentions.channels.first();
                            if (channel) {
                              applychannel = channel;
                            } else {
                              message.channel.send(new Discord.MessageEmbed()
                                .setColor("RED")
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                .setTitle(":x: ERROR | INVALID INPUT | cancelled")
                                .setDescription("Please PING A TEXT CHANNEL, thanks\nRetry...")
                              ).then(msg => msg.delete({
                                timeout: 7500
                              }))
                              throw ":x: ERROR";
                            }
                          })
                          .catch(e => {
                            errored === true
                          })
                        if (errored)
                          return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                            timeout: 7500
                          }))
          
                        pickmsg = await message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setTitle("What should be the Channel, where the __finished__ Application should be sent?").setDescription("Please ping the Channel #channel").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
          
                        await pickmsg.channel.awaitMessages((m) => m.author.id === message.author.id, {
                            max: 1,
                            time: 60000,
                            erros: ["time"]
                          }).then(collected => {
                            let channel = collected.first().mentions.channels.first();
                            if (channel) {
                              f_applychannel = channel;
                            } else {
                              message.channel.send(new Discord.MessageEmbed()
                                .setColor("RED")
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                .setTitle(":x: ERROR | INVALID INPUT | cancelled")
                                .setDescription("Please PING A TEXT CHANNEL, thanks\nRetry...")
                              ).then(msg => msg.delete({
                                timeout: 7500
                              }))
                              throw ":x: ERROR";
                            }
                          })
                          .catch(e => {
                            errored === true
                          })
                        if (errored)
                          return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                            timeout: 7500
                          }))
          
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
                        let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                          .setColor("ORANGE")
                          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        let msg = await message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)"))
                        await msg.channel.awaitMessages(m => m.author.id === userid, {
                          max: 1,
                          time: 60000,
                          errors: ["TIME"]
                        }).then(collected => {
                          let content = collected.first().content;
                          if (!content.startsWith("#") && content.length !== 7) {
                            message.channel.send("WRONG COLOR! USING `GREEN`")
                          } else {
                            if (isValidColor(content)) {
                              color = content;
                            } else {
                              message.channel.send("WRONG COLOR! USING `GREEN`")
                            }
                          }
          
                          function isValidColor(str) {
                            return str.match(/^#[a-f0-9]{6}$/i) !== null;
                          }
                        }).catch(e => {
                          errored === true
                        })
                        if (errored)
                          return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                            timeout: 7500
                          }))
          
                        await message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg => {
                          msg.channel.awaitMessages(m => m.author.id === userid, {
                            max: 1,
                            time: 60000,
                            errors: ["TIME"]
                          }).then(collected => {
                            desc = collected.first().content;
                            let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              .setColor(color)
                              .setDescription(desc)
                              .setTitle("Apply for: `" + message.guild.name + "`")
                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            applychannel.send(setupembed).then(msg => {
                              msg.react("✅")
                              apply_for_here.set(msg.guild.id, msg.id, "message_id")
                              apply_for_here.set(message.guild.id, f_applychannel.id, "f_channel_id")
                              apply_for_here.set(msg.guild.id, applychannel.id, "channel_id")
                            });
                            let counter = 0;
                            apply_for_here.set(msg.guild.id, [{
                              "1": "DEFAULT"
                            }], "QUESTIONS")
                            ask_which_qu();
          
                            function ask_which_qu() {
                              counter++;
                              if (counter === 25) {
                                message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("You reached the maximum amount of Questions!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png"))
                                return ask_addrole();
                              }
                              message.channel.send(embed.setTitle(`What should be the **${counter}** Question?`).setDescription("Enter `finish`, if you are finished with your Questions!")).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === userid, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  if (collected.first().content.toLowerCase() === "finish") {
                                    return ask_addrole();
                                  }
                                  switch (counter) {
                                    case 1: {
                                      apply_for_here.set(msg.guild.id, [], "QUESTIONS");
                                      apply_for_here.push(msg.guild.id, {
                                        "1": collected.first().content
                                      }, "QUESTIONS");
                                    }
                                    break;
                                  case 2:
                                    apply_for_here.push(msg.guild.id, {
                                      "2": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 3:
                                    apply_for_here.push(msg.guild.id, {
                                      "3": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 4:
                                    apply_for_here.push(msg.guild.id, {
                                      "4": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 5:
                                    apply_for_here.push(msg.guild.id, {
                                      "5": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 6:
                                    apply_for_here.push(msg.guild.id, {
                                      "6": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 7:
                                    apply_for_here.push(msg.guild.id, {
                                      "7": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 8:
                                    apply_for_here.push(msg.guild.id, {
                                      "8": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 9:
                                    apply_for_here.push(msg.guild.id, {
                                      "9": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 10:
                                    apply_for_here.push(msg.guild.id, {
                                      "10": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 11:
                                    apply_for_here.push(msg.guild.id, {
                                      "11": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 12:
                                    apply_for_here.push(msg.guild.id, {
                                      "12": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 13:
                                    apply_for_here.push(msg.guild.id, {
                                      "13": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 14:
                                    apply_for_here.push(msg.guild.id, {
                                      "14": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 15:
                                    apply_for_here.push(msg.guild.id, {
                                      "15": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 16:
                                    apply_for_here.push(msg.guild.id, {
                                      "16": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 17:
                                    apply_for_here.push(msg.guild.id, {
                                      "17": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 18:
                                    apply_for_here.push(msg.guild.id, {
                                      "18": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 19:
                                    apply_for_here.push(msg.guild.id, {
                                      "19": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 20:
                                    apply_for_here.push(msg.guild.id, {
                                      "20": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 21:
                                    apply_for_here.push(msg.guild.id, {
                                      "21": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 22:
                                    apply_for_here.push(msg.guild.id, {
                                      "22": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 23:
                                    apply_for_here.push(msg.guild.id, {
                                      "23": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  case 24:
                                    apply_for_here.push(msg.guild.id, {
                                      "24": collected.first().content
                                    }, "QUESTIONS");
                                    break;
                                  }
                                  ask_which_qu();
                                }).catch(e => {
                                  errored === true
                                })
                                if (errored)
                                  return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                    timeout: 7500
                                  }))
          
                              })
                            }
          
                            function ask_addrole() {
                              message.channel.send(embed.setTitle(`Do you want to add a Role, when some1 applies?`).setDescription("Enter `no`, if not\n\nJust ping the Role")).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === userid, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(async collected => {
                                  if (collected.first().content.toLowerCase() === "no") {
                                    return message.channel.send(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${applychannel}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY THREE SETUPS (\`\`${prefix}setup-apply setup2\`\`, \`\`${prefix}setup-apply setup3\`\`)**/**GUILD\n\nRUN: \`${prefix}setup-apply editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`);
                                  } else {
                                    let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                    if (!role) return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              .setColor("ORANGE")
                                              .setTitle(`Setup for ${temptype}. Application System Completed! | BUT COULD NOT FIND ROLE, SO I DONT USE A ROLE`)
                                              .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                              
                                              );
                                    let guildrole = message.guild.roles.cache.get(role)
          
                                    if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
          
                                    let botrole = message.guild.me.roles.highest
                                    if (guildrole.rawPosition >= botrole.rawPosition) {
                                      message.channel.send(`I can't access that role, place \"me\" / \"my highest Role\" above other roles that you want me to manage.\n\n SO I AM USING **NO** ROLE, you can change it with: \`${prefix}setup\` -> ${temptype} Emoji -> :two:`)
                                      return message.channel.send(new Discord.MessageEmbed()
                                      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                      .setColor("#fcfc03")
                                      .setTitle(`Setup for ${temptype}. Application System Completed!`)
                                      .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                      
                                      );
                                    }
                                    apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                    return message.channel.send(new Discord.MessageEmbed()
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    .setColor("#fcfc03")
                                    .setTitle(`Setup for ${temptype}. Application System Completed!`)
                                    .setDescription(`You can apply start the Application Process in ${ch}\n\nIf you wanna edit the Paramters of the Application ran \`${prefix}setup\` again and pick the ${temptype} Emoji!`)
                                    
                                    );
                                  }
                                }).catch(e => {
                                  errored === true
                                })
                                if (errored)
                                  return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                    timeout: 7500
                                  }))
                              })
                            }
                          }).catch(e => {
                            errored === true
                          })
                          if (errored)
                            return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                              timeout: 7500
                            }))
          
                        })                
                    }
                }
    
                else if (reaction.emoji.name === "2️⃣") {
                  
                  let pickmsg = await tempmsg.edit(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setTitle("What do you want me to do?")
                  .setDescription(
    `
    1️⃣ **==** Edit the **ACCEPT Message**
    2️⃣ **==** Edit the **DENY Message**
    3️⃣ **==** Edit the **TICKET Message**
    
    4️⃣ **==** Define the **ACCEPT Role**
    5️⃣ **==** Define the **TEMP Role**
    
    
    6️⃣ **==** Manage the **:one: EMOJI** (Role/Message) 
    7️⃣ **==** Manage the **:two: EMOJI** (Role/Message) 
    8️⃣ **==** Manage the **:three: EMOJI** (Role/Message) 
    9️⃣ **==** Manage the **:four: EMOJI** (Role/Message) 
    🔟 **==** Manage the **:five: EMOJI** (Role/Message) 
    
    🔴 **==** **Edit** a **Question**
    🟣 **==** **Add** a **Question**
    🟡 **==** **Remove** a **Question**
    
    
    🟢 **==** **Set** a new **Application Channel**
    🔵 **==** **Set** a new __finished__ **Applications Channel**

    ✋ **== ${apply_for_here.get(message.guild.id, "last_verify") ? "Disable Last Verification" : "Enable Last Verification"}**
    `
                  )
                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
                  try {
                    tempmsg.react("🔴")
                    tempmsg.react("🟣")
                    tempmsg.react("🟡")
                    tempmsg.react("🟢")
                    tempmsg.react("🔵")
                    tempmsg.react("✋")
                  } catch (e) {
                    return message.reply(new Discord.MessageEmbed()
                      .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                      .setColor("RED")
                      .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                    );
                  }
                  await pickmsg.awaitReactions((reaction, user) => user.id === message.author.id , {
                        max: 1,
                        time: 60000,
                        erros: ["time"]
                      }).then(async collected => {
                        let args;
                        if (collected.first().emoji.name == "1️⃣") args = "acceptmsg"
                        if (collected.first().emoji.name == "2️⃣") args = "denymsg"
                        if (collected.first().emoji.name == "3️⃣") args = "ticketmsg"
                        if (collected.first().emoji.name == "4️⃣") args = "acceptrole"
                        if (collected.first().emoji.name == "5️⃣") args = "temprole"
                        if (collected.first().emoji.name == "6️⃣") args = "emojione"
                        if (collected.first().emoji.name == "7️⃣") args = "emojitwo"
                        if (collected.first().emoji.name == "8️⃣") args = "emojithree"
                        if (collected.first().emoji.name == "9️⃣") args = "emojifour"
                        if (collected.first().emoji.name == "🔟") args = "emojifive"
                        if (collected.first().emoji.name == "🔴") args = "editquestion"
                        if (collected.first().emoji.name == "🟣") args = "addquestion"
                        if (collected.first().emoji.name == "🟡") args = "removequestion"
                        if (collected.first().emoji.name == "🟢") args = "applychannel"
                        if (collected.first().emoji.name == "🔵") args = "finishedapplychannel"
                        if (collected.first().emoji.name == "✋") args = "last_verify"
                        switch (args) {
                          case "acceptmsg":
                           {
                              message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message?", message.author.displayAvatarURL({
                                dynamic: true
                              }))).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  apply_for_here.set(message.guild.id, collected.first().content, "accept")
                                  return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE!", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                }).catch(error => {
              
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                              })
                            }
                            break;
                          case "acceptrole":
                            {
                              message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted?", message.author.displayAvatarURL({
                                dynamic: true
                              }))).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                  if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!`)
                                  let guildrole = message.guild.roles.cache.get(role)
              
                                  if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
              
                                  let botrole = message.guild.me.roles.highest
              
                                  if (guildrole.rawPosition <= botrole.rawPosition) {
                                    apply_for_here.set(message.guild.id, role, "accept_role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  } else {
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                }).catch(error => {
              
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                              })
                            }
                            break;
                          case "denymsg":
                            {
                              message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new deny message?", message.author.displayAvatarURL({
                                dynamic: true
                              }))).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  apply_for_here.set(message.guild.id, collected.first().content, "deny")
                                  return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the DENY MESSAGE!", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                }).catch(error => {
              
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                              })
                            }
                            break;
                          case "ticketmsg":
                            {
                              message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Ticket message? | {user} pings the User", message.author.displayAvatarURL({
                                dynamic: true
                              }))).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  apply_for_here.set(message.guild.id, collected.first().content, "ticket")
                                  return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the TICKET MESSAGE!", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                }).catch(error => {
              
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                              })
                            }
                            break;
                          case "emojione":
                            {
                              let type = ""
                              let tempmsg2;
                              tempmsg2 = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("What do you want to do?")
                                .setColor("#fcfc03")
                                .setDescription(`1️⃣ **==** Set the **message** which should be sent to the Applicant\n\n2️⃣ **==** **Set** the **Role** which I should give to the Applicant\n\n3️⃣ **==** **Delete** the **Role** which I should give to the Applicant\n\n4️⃣ **==** **Delete** the **Image** which should be sent to the Applicant\n\n5️⃣ **==** **Set** the **Image** which should be sent to the Applicant\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              )
                              try {
                                tempmsg2.react("1️⃣")
                                tempmsg2.react("2️⃣")
                                tempmsg2.react("3️⃣")
                                tempmsg2.react("4️⃣")
                                tempmsg2.react("5️⃣")
                              } catch (e) {
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              }
                              await tempmsg2.awaitReactions(filter, {
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  let reaction = collected.first()
                                  reaction.users.remove(message.author.id)
                                  if (reaction.emoji.name === "1️⃣")  type = "message";
                                  else if (reaction.emoji.name === "2️⃣")  type = "setrole";
                                  else if (reaction.emoji.name === "3️⃣")  type = "delrole";
                                  else if (reaction.emoji.name === "4️⃣")  type = "delimage";
                                  else if (reaction.emoji.name === "5️⃣")  type = "setimage";
                                  else throw "You reacted with a wrong emoji"
                        
                                })
                                .catch(e => {
                                  timeouterror = e;
                                })
                              if (timeouterror)
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Your Time ran out")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              switch (type) {
                                case "message":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji one?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        apply_for_here.set(message.guild.id, collected.first().content, "one.message")
                                        return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji one!", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "setrole":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji one?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                        if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!`)
                                        let guildrole = message.guild.roles.cache.get(role)
              
                                        if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
              
                                        let botrole = message.guild.me.roles.highest
              
                                        if (guildrole.rawPosition <= botrole.rawPosition) {
                                          apply_for_here.set(message.guild.id, role, "one.role")
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        } else {
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        }
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "delrole":
                                  {
                                    apply_for_here.set(message.guild.id, "", "one.role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  break;
                                case "delimage":
                                  {
                                    apply_for_here.set(message.guild.id, false, "one.image.enabled")
                                    apply_for_here.set(message.guild.id, "", "one.image.url")
                                    return message.channel.send(new Discord.MessageEmbed()
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    
                                    .setColor("GREEN")
                                    .setTitle("Successfully __deleted__ the ACCEPT IMAGE for emoji **one**!")
                                    )
                                  }
                                  case "setimage":
                                    {
                                      try {
                                        var url;
                                        tempmsg2= await tempmsg2.edit(new Discord.MessageEmbed()
                                          .setColor("#fcfc03")
                                          .setTitle("Which Image should i Use?")
                                          .setDescription(`*Just Send the Url*`)
                                          .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                                          .setThumbnail(client.user.displayAvatarURL())).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          }).then(collected => {
                                            if (collected.first().attachments.size > 0) {
                                              if (collected.first().attachments.every(attachIsImage)) {
                                                apply_for_here.set(message.guild.id, true, "one.image.enabled")
                                                apply_for_here.set(message.guild.id, url, "one.image.url")
                                                return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                
                                                .setColor("GREEN")
                                                .setTitle("Successfully set the ACCEPT IMAGE for emoji **one**!")
                                                )
                                              } else {
                                                return message.channel.send(new Discord.MessageEmbed()
                                                  .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                  .setColor("RED")
                                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                );
                                              }
                                            } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                                              apply_for_here.set(message.guild.id, true, "one.image.enabled")
                                              apply_for_here.set(message.guild.id, collected.first().content, "one.image.url")
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              
                                              .setColor("GREEN")
                                              .setTitle("Successfully set the ACCEPT IMAGE for emoji **one**!")
                                              )
                                            } else {
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                .setColor("RED")
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              );
                                            }
                              
                                            function attachIsImage(msgAttach) {
                                              url = msgAttach.url;
                              
                                              //True if this url is a png image.
                                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                                            }
                                          });
                                        })
                                      } catch (e) {
                                        return message.channel.send(new Discord.MessageEmbed()
                                          .setTitle(":x: ERROR | Something went wrong, please contact: `Tomato#6966`")
                                          .setColor("RED")
                                          .setDescription(`\`\`\`${e.message}\`\`\``)
                                          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        );
                                      }
                                  
                                     
                                    }
    
                              }
                            }
                            break;
                          case "emojitwo":
                            {
                              let type = ""
                              let tempmsg2;
                              tempmsg2 = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("What do you want to do?")
                                .setColor("#fcfc03")
                                .setDescription(`1️⃣ **==** Set the **message** which should be sent to the Applicant\n\n2️⃣ **==** **Set** the **Role** which I should give to the Applicant\n\n3️⃣ **==** **Delete** the **Role** which I should give to the Applicant\n\n4️⃣ **==** **Delete** the **Image** which should be sent to the Applicant\n\n5️⃣ **==** **Set** the **Image** which should be sent to the Applicant\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              )
                              try {
                                tempmsg2.react("1️⃣")
                                tempmsg2.react("2️⃣")
                                tempmsg2.react("3️⃣")
                                tempmsg2.react("4️⃣")
                                tempmsg2.react("5️⃣")
                              } catch (e) {
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              }
                              await tempmsg2.awaitReactions(filter, {
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  let reaction = collected.first()
                                  reaction.users.remove(message.author.id)
                                  if (reaction.emoji.name === "1️⃣")  type = "message";
                                  else if (reaction.emoji.name === "2️⃣")  type = "setrole";
                                  else if (reaction.emoji.name === "3️⃣")  type = "delrole";
                                  else if (reaction.emoji.name === "4️⃣")  type = "delimage";
                                  else if (reaction.emoji.name === "5️⃣")  type = "setimage";
                                  else throw "You reacted with a wrong emoji"
                        
                                })
                                .catch(e => {
                                  timeouterror = e;
                                })
                              if (timeouterror)
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Your Time ran out")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              switch (type) {
                                case "message":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji two?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        apply_for_here.set(message.guild.id, collected.first().content, "two.message")
                                        return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji two!", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "setrole":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji two?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                        if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply setup\`->\`editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY two SETUP**/**GUILD`)
                                        let guildrole = message.guild.roles.cache.get(role)
              
                                        if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
              
                                        let botrole = message.guild.me.roles.highest
              
                                        if (guildrole.rawPosition <= botrole.rawPosition) {
                                          apply_for_here.set(message.guild.id, role, "two.role")
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        } else {
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        }
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "delrole":
                                  {
                                    apply_for_here.set(message.guild.id, "", "two.role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  break;
                                case "delimage":
                                  {
                                    apply_for_here.set(message.guild.id, false, "two.image.enabled")
                                    apply_for_here.set(message.guild.id, "", "two.image.url")
                                    return message.channel.send(new Discord.MessageEmbed()
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    
                                    .setColor("GREEN")
                                    .setTitle("Successfully __deleted__ the ACCEPT IMAGE for emoji **two**!")
                                    )
                                } break;
                                case "setimage":
                                  {
    
                                    try {
                                      var url;
                                      tempmsg2= await tempmsg2.edit(new Discord.MessageEmbed()
                                        .setColor("#fcfc03")
                                        .setTitle("Which Image should i Use?")
                                        .setDescription(`*Just Send the Url*`)
                                        .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                                        .setThumbnail(client.user.displayAvatarURL())).then(msg => {
                                        msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                          max: 1,
                                          time: 30000,
                                          errors: ['time']
                                        }).then(collected => {
                                          if (collected.first().attachments.size > 0) {
                                            if (collected.first().attachments.every(attachIsImage)) {
                                              apply_for_here.set(message.guild.id, true, "two.image.enabled")
                                              apply_for_here.set(message.guild.id, url, "two.image.url")
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              
                                              .setColor("GREEN")
                                              .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **two**!")
                                              )
                                            } else {
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                .setColor("RED")
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              );
                                            }
                                          } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                                            apply_for_here.set(message.guild.id, true, "two.image.enabled")
                                            apply_for_here.set(message.guild.id, collected.first().content, "two.image.url")
                                            return message.channel.send(new Discord.MessageEmbed()
                                            .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                            
                                            .setColor("GREEN")
                                            .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **two**!")
                                            )
                                          } else {
                                            return message.channel.send(new Discord.MessageEmbed()
                                              .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                              .setColor("RED")
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                            );
                                          }
                            
                                          function attachIsImage(msgAttach) {
                                            url = msgAttach.url;
                            
                                            //True if this url is a png image.
                                            return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                              url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                              url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                                              url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                                              url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                                          }
                                        });
                                      })
                                    } catch (e) {
                                      return message.channel.send(new Discord.MessageEmbed()
                                        .setTitle(":x: ERROR | Something went wrong, please contact: `Tomato#6966`")
                                        .setColor("RED")
                                        .setDescription(`\`\`\`${e.message}\`\`\``)
                                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                      );
                                    }
                                  
                                }break;
                              }
                            }
                            break;
                          case "emojithree":
                            {
                              let type = ""
                              let tempmsg2;
                              tempmsg2 = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("What do you want to do?")
                                .setColor("#fcfc03")
                                .setDescription(`1️⃣ **==** Set the **message** which should be sent to the Applicant\n\n2️⃣ **==** **Set** the **Role** which I should give to the Applicant\n\n3️⃣ **==** **Delete** the **Role** which I should give to the Applicant\n\n4️⃣ **==** **Delete** the **Image** which should be sent to the Applicant\n\n5️⃣ **==** **Set** the **Image** which should be sent to the Applicant\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              )
                              try {
                                tempmsg2.react("1️⃣")
                                tempmsg2.react("2️⃣")
                                tempmsg2.react("3️⃣")
                                tempmsg2.react("4️⃣")
                                tempmsg2.react("5️⃣")
                              } catch (e) {
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              }
                              await tempmsg2.awaitReactions(filter, {
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  let reaction = collected.first()
                                  reaction.users.remove(message.author.id)
                                  if (reaction.emoji.name === "1️⃣")  type = "message";
                                  else if (reaction.emoji.name === "2️⃣")  type = "setrole";
                                  else if (reaction.emoji.name === "3️⃣")  type = "delrole";
                                  else if (reaction.emoji.name === "4️⃣")  type = "delimage";
                                  else if (reaction.emoji.name === "5️⃣")  type = "setimage";
                                  else throw "You reacted with a wrong emoji"
                        
                                })
                                .catch(e => {
                                  timeouterror = e;
                                })
                              if (timeouterror)
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Your Time ran out")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              switch (type) {
                                case "message":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji three?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        apply_for_here.set(message.guild.id, collected.first().content, "three.message")
                                        return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji three!", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "setrole":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji three?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                        if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply setup\`->\`editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY three SETUP**/**GUILD`)
                                        let guildrole = message.guild.roles.cache.get(role)
              
                                        if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
              
                                        let botrole = message.guild.me.roles.highest
              
                                        if (guildrole.rawPosition <= botrole.rawPosition) {
                                          apply_for_here.set(message.guild.id, role, "three.role")
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        } else {
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        }
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "delrole":
                                  {
                                    apply_for_here.set(message.guild.id, "", "three.role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  break;
                                case "delimage":
                                  {
                                    apply_for_here.set(message.guild.id, false, "three.image.enabled")
                                    apply_for_here.set(message.guild.id, "", "three.image.url")
                                    return message.channel.send(new Discord.MessageEmbed()
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    
                                    .setColor("GREEN")
                                    .setTitle("Successfully __deleted__ the ACCEPT IMAGE for emoji **three**!")
                                    )
                                  }
                                  case "setimage":
                                    {
                                      try {
                                        var url;
                                        tempmsg2= await tempmsg2.edit(new Discord.MessageEmbed()
                                          .setColor("#fcfc03")
                                          .setTitle("Which Image should i Use?")
                                          .setDescription(`*Just Send the Url*`)
                                          .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                                          .setThumbnail(client.user.displayAvatarURL())).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          }).then(collected => {
                                            if (collected.first().attachments.size > 0) {
                                              if (collected.first().attachments.every(attachIsImage)) {
                                                apply_for_here.set(message.guild.id, true, "three.image.enabled")
                                                apply_for_here.set(message.guild.id, url, "three.image.url")
                                                return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                
                                                .setColor("GREEN")
                                                .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **three**!")
                                                )
                                              } else {
                                                return message.channel.send(new Discord.MessageEmbed()
                                                  .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                  .setColor("RED")
                                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                );
                                              }
                                            } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                                              apply_for_here.set(message.guild.id, true, "three.image.enabled")
                                              apply_for_here.set(message.guild.id, collected.first().content, "three.image.url")
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              
                                              .setColor("GREEN")
                                              .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **three**!")
                                              )
                                            } else {
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                .setColor("RED")
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              );
                                            }
                              
                                            function attachIsImage(msgAttach) {
                                              url = msgAttach.url;
                              
                                              //True if this url is a png image.
                                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                                            }
                                          });
                                        })
                                      } catch (e) {
                                        return message.channel.send(new Discord.MessageEmbed()
                                          .setTitle(":x: ERROR | Something went wrong, please contact: `Tomato#6966`")
                                          .setColor("RED")
                                          .setDescription(`\`\`\`${e.message}\`\`\``)
                                          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        );
                                      }
                                     
                                    }
              
                                    default:
                                      return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(":x: ERROR please enter a valid Option").setDescription(`Valid Options are: \`message\`, \`setimage\`, \`delimage\`, \`setrole\`, \`delrole\`\n\n\nExample usage: \`${prefix}editsetup emojithree message\` --> follow steps / \`${prefix}editsetup emojithree setrole\` --> follow steps`))
                                      break;
                              }
                            }
                            break;
                          case "emojifour":
                            {
                              let type = ""
                              let tempmsg2;
                              tempmsg2 = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("What do you want to do?")
                                .setColor("#fcfc03")
                                .setDescription(`1️⃣ **==** Set the **message** which should be sent to the Applicant\n\n2️⃣ **==** **Set** the **Role** which I should give to the Applicant\n\n3️⃣ **==** **Delete** the **Role** which I should give to the Applicant\n\n4️⃣ **==** **Delete** the **Image** which should be sent to the Applicant\n\n5️⃣ **==** **Set** the **Image** which should be sent to the Applicant\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              )
                              try {
                                tempmsg2.react("1️⃣")
                                tempmsg2.react("2️⃣")
                                tempmsg2.react("3️⃣")
                                tempmsg2.react("4️⃣")
                                tempmsg2.react("5️⃣")
                              } catch (e) {
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              }
                              await tempmsg2.awaitReactions(filter, {
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  let reaction = collected.first()
                                  reaction.users.remove(message.author.id)
                                  if (reaction.emoji.name === "1️⃣")  type = "message";
                                  else if (reaction.emoji.name === "2️⃣")  type = "setrole";
                                  else if (reaction.emoji.name === "3️⃣")  type = "delrole";
                                  else if (reaction.emoji.name === "4️⃣")  type = "delimage";
                                  else if (reaction.emoji.name === "5️⃣")  type = "setimage";
                                  else throw "You reacted with a wrong emoji"
                        
                                })
                                .catch(e => {
                                  timeouterror = e;
                                })
                              if (timeouterror)
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Your Time ran out")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              switch (type) {
                                case "message":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji four?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        apply_for_here.set(message.guild.id, collected.first().content, "four.message")
                                        return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji four!", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "setrole":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji four?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                        if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply setup\`->\`editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY four SETUP**/**GUILD`)
                                        let guildrole = message.guild.roles.cache.get(role)
              
                                        if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
              
                                        let botrole = message.guild.me.roles.highest
              
                                        if (guildrole.rawPosition <= botrole.rawPosition) {
                                          apply_for_here.set(message.guild.id, role, "four.role")
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        } else {
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        }
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "delrole":
                                  {
                                    apply_for_here.set(message.guild.id, "", "four.role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  break;
                                case "delimage":
                                  {
                                    apply_for_here.set(message.guild.id, false, "four.image.enabled")
                                    apply_for_here.set(message.guild.id, "", "four.image.url")
                                    return message.channel.send(new Discord.MessageEmbed()
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    
                                    .setColor("GREEN")
                                    .setTitle("Successfully __deleted__ the ACCEPT IMAGE for emoji **four**!")
                                    )
                                  }
                                  case "setimage":
                                    {
                                      try {
                                        var url;
                                        tempmsg2= await tempmsg2.edit(new Discord.MessageEmbed()
                                          .setColor("#fcfc03")
                                          .setTitle("Which Image should i Use?")
                                          .setDescription(`*Just Send the Url*`)
                                          .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                                          .setThumbnail(client.user.displayAvatarURL())).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          }).then(collected => {
                                            if (collected.first().attachments.size > 0) {
                                              if (collected.first().attachments.every(attachIsImage)) {
                                                apply_for_here.set(message.guild.id, true, "four.image.enabled")
                                                apply_for_here.set(message.guild.id, url, "four.image.url")
                                                return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                
                                                .setColor("GREEN")
                                                .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **four**!")
                                                )
                                              } else {
                                                return message.channel.send(new Discord.MessageEmbed()
                                                  .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                  .setColor("RED")
                                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                );
                                              }
                                            } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                                              apply_for_here.set(message.guild.id, true, "four.image.enabled")
                                              apply_for_here.set(message.guild.id, collected.first().content, "four.image.url")
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              
                                              .setColor("GREEN")
                                              .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **four**!")
                                              )
                                            } else {
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                .setColor("RED")
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              );
                                            }
                              
                                            function attachIsImage(msgAttach) {
                                              url = msgAttach.url;
                              
                                              //True if this url is a png image.
                                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                                            }
                                          });
                                        })
                                      } catch (e) {
                                        return message.channel.send(new Discord.MessageEmbed()
                                          .setTitle(":x: ERROR | Something went wrong, please contact: `Tomato#6966`")
                                          .setColor("RED")
                                          .setDescription(`\`\`\`${e.message}\`\`\``)
                                          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        );
                                      }
                                    }
              
                                    default:
                                      return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(":x: ERROR please enter a valid Option").setDescription(`Valid Options are: \`message\`, \`setimage\`, \`delimage\`, \`setrole\`, \`delrole\`\n\n\nExample usage: \`${prefix}editsetup emojifour message\` --> follow steps / \`${prefix}editsetup emojifour setrole\` --> follow steps`))
                                      break;
                              }
                            }
                            
                            break;
                          case "emojifive":
                            {
                              let type = ""
                              let tempmsg2;
                              tempmsg2 = await message.channel.send(new Discord.MessageEmbed()
                                .setTitle("What do you want to do?")
                                .setColor("#fcfc03")
                                .setDescription(`1️⃣ **==** Set the **message** which should be sent to the Applicant\n\n2️⃣ **==** **Set** the **Role** which I should give to the Applicant\n\n3️⃣ **==** **Delete** the **Role** which I should give to the Applicant\n\n4️⃣ **==** **Delete** the **Image** which should be sent to the Applicant\n\n5️⃣ **==** **Set** the **Image** which should be sent to the Applicant\n\n\n\n*React with the Right Emoji according to the Right action*`).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              )
                              try {
                                tempmsg2.react("1️⃣")
                                tempmsg2.react("2️⃣")
                                tempmsg2.react("3️⃣")
                                tempmsg2.react("4️⃣")
                                tempmsg2.react("5️⃣")
                              } catch (e) {
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Missing Permissions to add Reactions")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${e.message}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              }
                              await tempmsg2.awaitReactions(filter, {
                                  max: 1,
                                  time: 90000,
                                  errors: ["time"]
                                })
                                .then(collected => {
                                  let reaction = collected.first()
                                  reaction.users.remove(message.author.id)
                                  if (reaction.emoji.name === "1️⃣")  type = "message";
                                  else if (reaction.emoji.name === "2️⃣")  type = "setrole";
                                  else if (reaction.emoji.name === "3️⃣")  type = "delrole";
                                  else if (reaction.emoji.name === "4️⃣")  type = "delimage";
                                  else if (reaction.emoji.name === "5️⃣")  type = "setimage";
                                  else throw "You reacted with a wrong emoji"
                        
                                })
                                .catch(e => {
                                  timeouterror = e;
                                })
                              if (timeouterror)
                                return message.reply(new Discord.MessageEmbed()
                                  .setTitle(":x: ERROR | Your Time ran out")
                                  .setColor("RED")
                                  .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                );
                              switch (type) {
                                case "message":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji five?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        apply_for_here.set(message.guild.id, collected.first().content, "five.message")
                                        return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji five!", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "setrole":
                                  {
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji five?", message.author.displayAvatarURL({
                                      dynamic: true
                                    }))).then(msg => {
                                      msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["TIME"]
                                      }).then(collected => {
                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                        if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply setup\`->\`editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY five SETUP**/**GUILD`)
                                        let guildrole = message.guild.roles.cache.get(role)
              
                                        if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                          dynamic: true
                                        })))
              
                                        let botrole = message.guild.me.roles.highest
              
                                        if (guildrole.rawPosition <= botrole.rawPosition) {
                                          apply_for_here.set(message.guild.id, role, "five.role")
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        } else {
                                          return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                            dynamic: true
                                          })))
                                        }
                                      }).catch(error => {
              
                                        return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                      })
                                    })
                                  }
                                  break;
                                case "delrole":
                                  {
                                    apply_for_here.set(message.guild.id, "", "five.role")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  break;
                                case "delimage":
                                  {
                                    apply_for_here.set(message.guild.id, false, "five.image.enabled")
                                    apply_for_here.set(message.guild.id, "", "five.image.url")
                                    return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({
                                      dynamic: true
                                    })))
                                  }
                                  case "setimage":
                                    {
                                      try {
                                        var url;
                                        tempmsg2= await tempmsg2.edit(new Discord.MessageEmbed()
                                          .setColor("#fcfc03")
                                          .setTitle("Which Image should i Use?")
                                          .setDescription(`*Just Send the Url*`)
                                          .setFooter("Pick the INDEX NUMBER / send the IMAGE URl", client.user.displayAvatarURL())
                                          .setThumbnail(client.user.displayAvatarURL())).then(msg => {
                                          msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                          }).then(collected => {
                                            if (collected.first().attachments.size > 0) {
                                              if (collected.first().attachments.every(attachIsImage)) {
                                                apply_for_here.set(message.guild.id, true, "five.image.enabled")
                                                apply_for_here.set(message.guild.id, url, "five.image.url")
                                                return message.channel.send(new Discord.MessageEmbed()
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                
                                                .setColor("GREEN")
                                                .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **five**!")
                                                )
                                              } else {
                                                return message.channel.send(new Discord.MessageEmbed()
                                                  .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                  .setColor("RED")
                                                  .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                );
                                              }
                                            } else if (collected.first().content.includes("https") || collected.first().content.includes("http")) {
                                              apply_for_here.set(message.guild.id, true, "five.image.enabled")
                                              apply_for_here.set(message.guild.id, collected.first().content, "five.image.url")
                                              return message.channel.send(new Discord.MessageEmbed()
                                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              
                                              .setColor("GREEN")
                                              .setTitle("Successfully __set__ the ACCEPT IMAGE for emoji **five**!")
                                              )
                                            } else {
                                              return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`:x: ERROR | Could not your message as a backgroundimage`)
                                                .setColor("RED")
                                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                              );
                                            }
                              
                                            function attachIsImage(msgAttach) {
                                              url = msgAttach.url;
                              
                                              //True if this url is a png image.
                                              return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("gif", url.length - "gif".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("webp", url.length - "webp".length /*or 3*/ ) !== -1 ||
                                                url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                                            }
                                          });
                                        })
                                      } catch (e) {
                                        return message.channel.send(new Discord.MessageEmbed()
                                          .setTitle(":x: ERROR | Something went wrong, please contact: `Tomato#6966`")
                                          .setColor("RED")
                                          .setDescription(`\`\`\`${e.message}\`\`\``)
                                          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        );
                                      }
                                      
                                    }
              
                                    default:
                                      return message.channel.send(new Discord.MessageEmbed().setColor("RED").setTitle(":x: ERROR please enter a valid Option").setDescription(`Valid Options are: \`message\`, \`setimage\`, \`delimage\`, \`setrole\`, \`delrole\`\n\n\nExample usage: \`${prefix}editsetup emojifive message\` --> follow steps / \`${prefix}editsetup emojifive setrole\` --> follow steps`))
                                      break;
                              }
                            }
                            break;
                          case "editquestion":
                            {
                              let Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                              let embed = new Discord.MessageEmbed()
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                
                                .setColor("#fcfc03")
                                .setTitle("Current Questions") //Tomato#6966
                                .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({
                                  dynamic: true
                                }))
                                .setTimestamp()
              
                                for (let i = 0; i < Questions.length; i++) {
                                  try {
                                    embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                                  } catch (e) {
                                    console.log(e)
                                  }
                                }
    
                                message.channel.send(embed);
                                message.channel.send(new Discord.MessageEmbed()
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                
                                .setColor("#fcfc03")
                                .setTitle("What Question do you wanna __Edit__?")
                                .setDescription(`Just send the **INDEX** Number of the **Question** | \`1\` - \`${Questions.length}\``)
                              ).then(msg => {
                              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                time: 60000,
                                errors: ["TIME"]
                              }).then(collected => {
                                let arr = apply_for_here.get(message.guild.id, "QUESTIONS");
                                let quindex = collected.first().content
                                if (arr.length >= Number(quindex)) {
                                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Question?", message.author.displayAvatarURL({
                                    dynamic: true
                                  }))).then(msg => {
                                    msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                      max: 1,
                                      time: 60000,
                                      errors: ["TIME"]
                                    }).then(collected => {
                                      const index = Number(quindex);
                                      var obj;
                                      switch (Number(index)) {
                                        case 1:
                                          obj = {
                                            "1": collected.first().content
                                          };
                                          break;
                                        case 2:
                                          obj = {
                                            "2": collected.first().content
                                          };
                                          break;
                                        case 3:
                                          obj = {
                                            "3": collected.first().content
                                          };
                                          break;
                                        case 4:
                                          obj = {
                                            "4": collected.first().content
                                          };
                                          break;
                                        case 5:
                                          obj = {
                                            "5": collected.first().content
                                          };
                                          break;
                                        case 6:
                                          obj = {
                                            "6": collected.first().content
                                          };
                                          break;
                                        case 7:
                                          obj = {
                                            "7": collected.first().content
                                          };
                                          break;
                                        case 8:
                                          obj = {
                                            "8": collected.first().content
                                          };
                                          break;
                                        case 9:
                                          obj = {
                                            "9": collected.first().content
                                          };
                                          break;
                                        case 10:
                                          obj = {
                                            "10": collected.first().content
                                          };
                                          break;
                                        case 11:
                                          obj = {
                                            "11": collected.first().content
                                          };
                                          break;
                                        case 12:
                                          obj = {
                                            "12": collected.first().content
                                          };
                                          break;
                                        case 13:
                                          obj = {
                                            "13": collected.first().content
                                          };
                                          break;
                                        case 14:
                                          obj = {
                                            "14": collected.first().content
                                          };
                                          break;
                                        case 15:
                                          obj = {
                                            "15": collected.first().content
                                          };
                                          break;
                                        case 16:
                                          obj = {
                                            "16": collected.first().content
                                          };
                                          break;
                                        case 17:
                                          obj = {
                                            "17": collected.first().content
                                          };
                                          break;
                                        case 18:
                                          obj = {
                                            "18": collected.first().content
                                          };
                                          break;
                                        case 19:
                                          obj = {
                                            "19": collected.first().content
                                          };
                                          break;
                                        case 20:
                                          obj = {
                                            "20": collected.first().content
                                          };
                                          break;
                                        case 21:
                                          obj = {
                                            "21": collected.first().content
                                          };
                                          break;
                                        case 22:
                                          obj = {
                                            "22": collected.first().content
                                          };
                                          break;
                                        case 23:
                                          obj = {
                                            "23": collected.first().content
                                          };
                                          break;
                                        case 24:
                                          obj = {
                                            "24": collected.first().content
                                          };
                                          break;
                                      }
                                      arr[index - 1] = obj;
                                      apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                                      Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                      let new_embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        .setColor("#fcfc03")
                                        .setTitle("NEW Questions") //Tomato#6966
                                        .setFooter(message.guild.name, message.guild.iconURL({
                                          dynamic: true
                                        }))
                                        .setTimestamp()
                                      for (let i = 0; i < Questions.length; i++) {
                                        try {
                                          new_embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                                        } catch {}
                                      }
                                      message.channel.send(new_embed);
                                    }).catch(error => {
              
                                      return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                    })
                                  })
                                } else {
                                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                  return message.channel.send(embed);
                                }
                              }).catch(error => {
              
                                return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                              })
                            })
                                
              
                              
                            }
                            break;
                          case "temprole":
                            message.channel.send(new Discord.MessageEmbed()
                            .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            
                            .setColor("#fcfc03")                        
                            .setTitle("What should be the new temp Role, which will be granted once the user applied?")
                            .setDescription(`Just send the **ROLE** into the Channel. Simply **Ping** it!`)
                            ).then(msg => {
                              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                time: 60000,
                                errors: ["TIME"]
                              }).then(collected => {
                                let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                if (!role) return message.channel.send(`COULD NOT FIND THE ROLE!`)
                                let guildrole = message.guild.roles.cache.get(role)
              
                                if (!message.guild.me.roles) return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                  dynamic: true
                                })))
              
                                let botrole = message.guild.me.roles.highest
              
                                if (guildrole.rawPosition <= botrole.rawPosition) {
                                  apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                  return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                } else {
                                  return message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor(":x: ERROR | Could not Access the Role", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                }
                              }).catch(error => {
              
                                return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                              })
                            })
                            break;
                          case "addquestion":
                            {
                              message.channel.send(new Discord.MessageEmbed()
                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              
                              .setColor("#fcfc03")
                              .setTitle("What should be the Question you wanna add?")
                              .setDescription(`Simply send the Question into the Text`)
                              ).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  let Questions = apply_for_here.get(message.guild.id, "QUESTIONS")
                                  let obj;
                                  switch (Questions.length + 1) {
                                    case 1:
                                      obj = {
                                        "1": collected.first().content
                                      };
                                      break;
                                    case 2:
                                      obj = {
                                        "2": collected.first().content
                                      };
                                      break;
                                    case 3:
                                      obj = {
                                        "3": collected.first().content
                                      };
                                      break;
                                    case 4:
                                      obj = {
                                        "4": collected.first().content
                                      };
                                      break;
                                    case 5:
                                      obj = {
                                        "5": collected.first().content
                                      };
                                      break;
                                    case 6:
                                      obj = {
                                        "6": collected.first().content
                                      };
                                      break;
                                    case 7:
                                      obj = {
                                        "7": collected.first().content
                                      };
                                      break;
                                    case 8:
                                      obj = {
                                        "8": collected.first().content
                                      };
                                      break;
                                    case 9:
                                      obj = {
                                        "9": collected.first().content
                                      };
                                      break;
                                    case 10:
                                      obj = {
                                        "10": collected.first().content
                                      };
                                      break;
                                    case 11:
                                      obj = {
                                        "11": collected.first().content
                                      };
                                      break;
                                    case 12:
                                      obj = {
                                        "12": collected.first().content
                                      };
                                      break;
                                    case 13:
                                      obj = {
                                        "13": collected.first().content
                                      };
                                      break;
                                    case 14:
                                      obj = {
                                        "14": collected.first().content
                                      };
                                      break;
                                    case 15:
                                      obj = {
                                        "15": collected.first().content
                                      };
                                      break;
                                    case 16:
                                      obj = {
                                        "16": collected.first().content
                                      };
                                      break;
                                    case 17:
                                      obj = {
                                        "17": collected.first().content
                                      };
                                      break;
                                    case 18:
                                      obj = {
                                        "18": collected.first().content
                                      };
                                      break;
                                    case 19:
                                      obj = {
                                        "19": collected.first().content
                                      };
                                      break;
                                    case 20:
                                      obj = {
                                        "20": collected.first().content
                                      };
                                      break;
                                    case 21:
                                      obj = {
                                        "21": collected.first().content
                                      };
                                      break;
                                    case 22:
                                      obj = {
                                        "22": collected.first().content
                                      };
                                      break;
                                    case 23:
                                      obj = {
                                        "23": collected.first().content
                                      };
                                      break;
                                    case 24:
                                      obj = {
                                        "24": collected.first().content
                                      };
                                      break;
                                  }
                                  apply_for_here.push(message.guild.id, obj, "QUESTIONS")
                                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully added your Question!", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                  Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                  let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    .setColor("#fcfc03")
                                    .setTitle("NEW Questions") //Tomato#6966
                                    .setFooter(message.guild.name, message.guild.iconURL({
                                      dynamic: true
                                    }))
                                    .setTimestamp()
              
                                  for (let i = 0; i < Questions.length; i++) {
                                    try {
                                      embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                                    } catch (e) {
                                      console.log(e)
                                    }
                                  }
                                  message.channel.send(embed);
                                }).catch(error => {
              
                                  return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                                })
                              })
                            }
                            break;
                          case "removequestion":
                            {
                              let Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                              let embed = new Discord.MessageEmbed()
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                
                                .setColor("#fcfc03")
                                .setTitle("Current Questions") //Tomato#6966
                                .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({
                                  dynamic: true
                                }))
                                .setTimestamp()
              
                              for (let i = 0; i < Questions.length; i++) {
                                try {
                                  embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                                } catch (e) {
                                  console.log(e)
                                }
                              }
    
                                message.channel.send(embed);
                                message.channel.send(new Discord.MessageEmbed()
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                
                                .setColor("#fcfc03")
                                .setTitle("What Question do you wanna Remove?")
                                .setDescription(`Just send the **INDEX** Number of the **Question** | \`1\` - \`${Questions.length}\``)
                              ).then(msg => {
                              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                                max: 1,
                                time: 60000,
                                errors: ["TIME"]
                              }).then(collected => {
                                let arr = apply_for_here.get(message.guild.id, "QUESTIONS");
                                let quindex = collected.first().content
                                if (arr.length >= Number(quindex)) {
                     
                                  const index = Number(quindex);
                                  let counter = 0;
                                  for (const item of arr) {
                                    // console.log(Object.keys(item))
                                    if (Object.keys(item) == index) {
                                      arr.splice(counter, 1);
                                    }
                                    counter++;
                                  }
                                  counter = 0;
                                  for (const item of arr) {
                                    if (Object.keys(item) != counter + 1) {
                                      let key = String(Object.keys(item));
                                      item[key - 1] = item[key] //replace the item
                                      delete item[key] //delete the old one
                                      arr[counter] === item; //update it
                                    }
                                    counter++;
                                  }
                                  apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                                  Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                  let new_embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    .setColor("#fcfc03")
                                    .setTitle("NEW Questions") //Tomato#6966
                                    .setFooter(message.guild.name, message.guild.iconURL({
                                      dynamic: true
                                    }))
                                    .setTimestamp()
                                  for (let i = 0; i < Questions.length; i++) {
                                    try {
                                      new_embed.addField("**" + Object.keys(Questions[i]) + ".** ", Object.values(Questions[i]))
                                    } catch {}
                                  }
                                  message.channel.send(new_embed);
    
                                } else {
                                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({
                                    dynamic: true
                                  })))
                                  return message.channel.send(embed);
                                }
                              }).catch(error => {
              
                                return message.channel.send("SORRY BUT YOUR TIME RAN OUT!")
                              })
                            })
    
              
                            }
                            break;
                          case "applychannel":
                            try {
                              let applychannel;
                              let f_applychannel;
                              
                              let userid = message.author.id;
                              pickmsg = await message.channel.send(new Discord.MessageEmbed()
                              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              
                              .setColor("#fcfc03")
                              .setTitle("What should be the Channel, where someone should __start__ the Application?")
                              .setDescription("Please ping the Channel #channel")
                              )
              
                              await pickmsg.channel.awaitMessages((m) => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  erros: ["time"]
                                }).then(collected => {
                                  let channel = collected.first().mentions.channels.first();
                                  if (channel) {
                                    applychannel = channel;
                                  } else {
                                    message.channel.send(new Discord.MessageEmbed()
                                      .setColor("RED")
                                      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                      .setTitle(":x: ERROR | INVALID INPUT | cancelled")
                                      .setDescription("Please PING A TEXT CHANNEL, thanks\nRetry...")
                                    ).then(msg => msg.delete({
                                      timeout: 7500
                                    }))
                                    throw ":x: ERROR";
                                  }
                                })
                                .catch(e => {
                                  errored === true
                                })
                              if (errored)
                                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                  timeout: 7500
                                }))
              
                              message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
                              let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                .setColor("ORANGE")
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                              let msg = await message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)"))
                              await msg.channel.awaitMessages(m => m.author.id === userid, {
                                max: 1,
                                time: 60000,
                                errors: ["TIME"]
                              }).then(collected => {
                                let content = collected.first().content;
                                if (!content.startsWith("#") && content.length !== 7) {
                                  message.channel.send("WRONG COLOR! USING `GREEN`")
                                } else {
                                  if (isValidColor(content)) {
                                    color = content;
                                  } else {
                                    message.channel.send("WRONG COLOR! USING `GREEN`")
                                  }
                                }
              
                                function isValidColor(str) {
                                  return str.match(/^#[a-f0-9]{6}$/i) !== null;
                                }
                              }).catch(e => {
                                errored === true
                              })
                              if (errored)
                                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                  timeout: 7500
                                }))
              
                              await message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg => {
                                msg.channel.awaitMessages(m => m.author.id === userid, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["TIME"]
                                }).then(collected => {
                                  desc = collected.first().content;
                                  let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                    .setColor(color)
                                    .setDescription(desc)
                                    .setTitle("Apply for: `" + message.guild.name + "`")
                                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                  applychannel.send(setupembed).then(msg => {
                                    msg.react("✅")
                                    apply_for_here.set(msg.guild.id, msg.id, "message_id")
                                    apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                                  });
                                  return message.channel.send(`YOUR APPLICATION SYSTEM IS READY 2 USE IN: ${applychannel}\n\n*You can edit Questions by running the cmd: \`${prefix}setup-apply editsetup\` / rerunning: \`${prefix}setup-apply setup\`* NOTE: ONLY THREE SETUPS (\`\`${prefix}setup-apply setup2\`\`, \`\`${prefix}setup-apply setup3\`\`)**/**GUILD\n\nRUN: \`${prefix}setup-apply editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`);
              
              
                                }).catch(e => {
                                  errored === true
                                })
                                if (errored)
                                  return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                    timeout: 7500
                                  }))
              
                              })
                            } catch (e) {
                              console.log(e)
                              message.channel.send(new Discord.MessageEmbed()
                                .setColor("RED")
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                .setTitle(":x: ERROR | ERROR")
                                .setDescription("```" + e.message + "```")
                              ).then(msg => msg.delete({
                                timeout: 7500
                              }))
                            }
                            break;
                          case "finishedapplychannel":
                            try {
                              let applychannel;
                              let f_applychannel;
                              
                              let userid = message.author.id;
                              pickmsg = await message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setTitle("What should be the Channel, where the __finished__ Applications will be sent?").setDescription("Please ping the Channel #channel").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
              
                              await pickmsg.channel.awaitMessages((m) => m.author.id === message.author.id, {
                                  max: 1,
                                  time: 60000,
                                  erros: ["time"]
                                }).then(collected => {
                                  let channel = collected.first().mentions.channels.first();
                                  if (channel) {
                                    f_applychannel = channel;
                                  } else {
                                    message.channel.send(new Discord.MessageEmbed()
                                      .setColor("RED")
                                      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                      .setTitle(":x: ERROR | INVALID INPUT | cancelled")
                                      .setDescription("Please PING A TEXT CHANNEL, thanks\nRetry...")
                                    ).then(msg => msg.delete({
                                      timeout: 7500
                                    }))
                                    throw ":x: ERROR";
                                  }
                                })
                                .catch(e => {
                                  errored === true
                                })
                              if (errored)
                                return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                                  timeout: 7500
                                }))
                              apply_for_here.set(message.guild.id, f_applychannel.id, "f_channel_id")
                              return message.channel.send(`I will now send the finished applications to: ${f_applychannel}`);
              
                            } catch (e) {
                              console.log(e)
                              message.channel.send(new Discord.MessageEmbed()
                                .setColor("RED")
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                .setTitle(":x: ERROR | ERROR")
                                .setDescription("```" + e.message + "```")
                              ).then(msg => msg.delete({
                                timeout: 7500
                              }))
                            }
                            break;
                          case "last_verify":
                            {
                              apply_for_here.set(message.guild.id, !apply_for_here.get(message.guild.id, "last_verify"), "last_verify")
                              let embed = new Discord.MessageEmbed()
                                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                
                                .setColor("#fcfc03")
                                .setTitle(`${apply_for_here.get(message.guild.id, "last_verify") ? "Enabled Last Verification": "Disabled Last Verification"}`) //Tomato#6966
                                .setDescription(`${apply_for_here.get(message.guild.id, "last_verify") ? "I will now ask the User a last Time if he really wanna apply for the Server": "I will not ask the User"}`) //Tomato#6966
                        

                                .setTimestamp()
              
                                message.channel.send(embed);
                                
                            
    
              
                            }
                            break;
                          }
                      })
                      .catch(e => {
                        errored === true
                      })
                    if (errored)
                      return message.channel.send(new Discord.MessageEmbed().setColor("RED").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setTitle(":x: ERROR | TIME RAN OUT / INVALID INPUT | cancelled").setDescription("```" + e.message + "```")).then(msg => msg.delete({
                        timeout: 7500
                      }))
    
                }
                
                else throw "You reacted with a wrong emoji"
      
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply(new Discord.MessageEmbed()
                .setTitle(":x: ERROR | Your Time ran out")
                .setColor("RED")
                .setDescription(`\`\`\`${timeouterror}\`\`\``.substr(0, 2000))
                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
              );
    
        } catch (e) {
          console.log(String(e.stack).bgRed)
          return message.channel.send(new Discord.MessageEmbed()
            .setColor("RED")
            .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
          );
        }
      } else {
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("UNKNOWN CMD")
          .setDescription(`Sorry, i don't know this cmd! Try; \`${prefix}help\``)
          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
      }
    } catch (e) {
      console.log(e)
      message.channel.send(new Discord.MessageEmbed()
        .setColor("RED")
        .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
        .setTitle("ERROR | ERROR")
        .setDescription("```" + e.message + "```")
      ).then(msg => msg.delete({
        timeout: 7500
      }))
    }
  });

  /** ////////////////////////////////////////// *
   * INFO MSG ON INVITE
   *  ////////////////////////////////////////// *
   */
  client.on("guildCreate", guild => {

    reset_db(client, guild.id)

    let channel = guild.channels.cache.find(
      channel =>
      channel.type === "text" &&
      channel.permissionsFor(guild.me).has("SEND_MESSAGES")
    );
    channel.send(new Discord.MessageEmbed()
      .setColor("#fcfc03")
      .setTitle("These are all cmds!")
      .setURL("https://youtu.be/X2yqNtd3COE")
      .setDescription(`PREFIX: \`${config.prefix}\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
      .addField(`\`help\``, "Shows all available Commands!", true)
      .addField(`\`add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands) the Bot!*", true)
      .addField(`\`support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*", true)
      .addField(`\`ping\``, "> *Shows the ping of the Bot!*", true)
      .addField(`\`uptime\``, "> *Shows the uptime of the Bot!*", true)
      .addField(`\`info\``, "> *Shows Information & Stats of the Bot*", true)
      .addField(`\`tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*", true)
      .addField(`\`source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*", true)

      .addField("\u200b", "\u200b")
      .addField(`\`setup\` --> Follow steps`, "> *Sets up 1 Application System out of 5, with maximum of 24 Questions!*\n> *You can also edit that by picking edit afterwards*")

      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
    )
    channel.send(new Discord.MessageEmbed()
      .setColor("#fcfc03")
      .setTitle("Thanks for Inviting me!")
      .setDescription(`To get started, simply type: \`${config.prefix}setup\` and follow the steps!`)
      .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
    )
    channel.send("**Here is a TUTORIAL VIDEO:**\nhttps://youtu.be/X2yqNtd3COE")
  })
  client.on("messageReactionAdd", (reaction, user)=> {
    if(reaction.message.guild) databasing(client, reaction.message.guild.id)
  })
}

/** ////////////////////////////////////////// *
 * FUNCTION FOR ENSURING THE databases
 * ////////////////////////////////////////// *
 */
function databasing(client, guildid) {
  client.apply.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply2.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply3.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply4.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply5.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply6.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply7.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply8.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply9.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply10.ensure(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
}


/** ////////////////////////////////////////// *
 * FUNCTION FOR CHECKING THE PREFIX !
 * ////////////////////////////////////////// *
 */
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {

  }
}

/** ////////////////////////////////////////// *
 * FUNCTION FOR RESETTING THE databases
 * ////////////////////////////////////////// *
 */
function reset_db(client, guildid) {
  client.apply.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply2.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply3.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply4.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply5.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply6.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply7.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply8.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply9.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
  client.apply10.set(guildid, {
    "channel_id": "",
    "message_id": "",
    "last_verify": true,
    "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

    "QUESTIONS": [{
      "1": "DEFAULT"
    }],

    "TEMP_ROLE": "0",

    "accept": "You've got accepted!",
    "accept_role": "0",

    "deny": "You've got denied!",

    "ticket": "Hey {user}! We have some Questions!",

    "one": {
      "role": "0",
      "message": "Hey you've got accepted for Team 1",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "two": {
      "role": "0",
      "message": "Hey you've got accepted for Team 2",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "three": {
      "role": "0",
      "message": "Hey you've got accepted for Team 3",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "four": {
      "role": "0",
      "message": "Hey you've got accepted for Team 4",
      "image": {
        "enabled": false,
        "url": ""
      }
    },
    "five": {
      "role": "0",
      "message": "Hey you've got accepted for Team 5",
      "image": {
        "enabled": false,
        "url": ""
      }
    }
  });
}