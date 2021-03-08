
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
      setInterval(()=>{
          let users = 0;
          let guilds = client.guilds.cache.keyArray();
          for( let i = 0; i< guilds.length; i++){
              users += client.guilds.cache.get(guilds[i]).memberCount;
          }
          client.user.setActivity(`e!help | e!setup | ${client.guilds.cache.size} Guilds | ${users} User`, {type: "WATCHING"})
      }, 10000)
  })

  /** ////////////////////////////////////////// *
   * LOG EVERY SINGLE MESSAGE
   * ////////////////////////////////////////// *
   */
  client.on("message", (message) => {
      //if message from a bot, or not in a guild return error
      if(message.author.bot || !message.guild) return;
      try{
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
        if (cmd.length === 0){
          if(matchedPrefix.includes(client.user.id))
            return message.channel.send(new Discord.MessageEmbed()
              .setColor("#fcfc03")
              .setFooter(ee.footertext,ee.footericon)
              .setTitle(`Hugh? I got pinged? Imma give you some help`)
              .setDescription(`To see all Commands type: \`${prefix}help\`\n\nTo setup an Application System type: \`${prefix}setup\`\n\nYou can edit the setup by running: \`${prefix}editsetup\`\n\n*There are 2 other setups just add Number 2/3 to the end of setup like that: \`${prefix}setup2\`/\`${prefix}setup3\`*`)
            );
          return;
        }

        //if the Bot has not enough permissions return error
        let required_perms = ["MANAGE_CHANNELS","ADD_REACTIONS","VIEW_CHANNEL","SEND_MESSAGES","MANAGE_MESSAGES"
        ,"EMBED_LINKS", "ATTACH_FILES","MANAGE_ROLES"]
        if(!message.guild.me.hasPermission(required_perms)){
          try{ message.react("❌"); }catch{}
          return message.channel.send(new Discord.MessageEmbed()
            .setColor("#fcfc03")
            .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
            .setTitle("❌ Error | I don't have enough Permissions!")
            .setDescription("Please give me just `ADMINISTRATOR`, because I need it to delete Messages, Create Channel and execute all Admin Commands.\n If you don't want to give me them, then those are the exact Permissions which I need: \n> `" + required_perms.join("`, `") +"`")
          )
        }

        //ALL CMDS, yes not looking great but its enough ;)
        if(["h","help","cmd"].includes(cmd)){
               return message.reply(new Discord.MessageEmbed()
                .setColor("#fcfc03")
                .setTitle("These are all cmds!")
                .setURL("https://youtu.be/X2yqNtd3COE")
                .setDescription(`PREFIX: \`e!\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
                .addField(`\`help\``, "Shows all available Commands!",true)
                .addField(`\`add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands) the Bot!*",true)
                .addField(`\`support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*",true)
                .addField(`\`ping\``, "> *Shows the ping of the Bot!*",true)
                .addField(`\`uptime\``, "> *Shows the uptime of the Bot!*",true)
                .addField(`\`info\``, "> *Shows Information & Stats of the Bot*",true)
                .addField(`\`tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*",true)
                .addField(`\`source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*",true)

                .addField("\u200b","\u200b")
                .addField(`\`setup\` --> Follow steps`, "> *Set ups the Application System, maximum of 24 Questions!*")
                .addField(`\`editsetup <"acceptmsg"/"denymsg"/"question"/"role"/"addquestion"> [PARAMETER]\``, "> *Allows you to adjust the accept / deny msgs, or edit each Question. \n If needed you can add another Question / change the ROLE!*")
                .addField("\u200b","\u200b")
                .addField(`\`setup2\``, "> *Same as Setup 1 just your second Application System!*")
                .addField(`\`editsetup2\``, "> *Same as Setup 1(0) just your second Application System!*")
                .addField(`\`setup3\``, "> *Same as Setup 1(0) just your third Application System!*")
                .addField(`\`editsetup3\``, "> *Same as Setup 1(0) just your third Application System!*")

                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                )
        }
        else if(cmd === "ping"){
            return message.reply(new Discord.MessageEmbed()
             .setColor("#fcfc03")
             .setTitle("MY PING:")
             .setDescription(`PONG! \`${client.ws.ping} ms\``)
             .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
             )
        }
        else  if(cmd === "support" || cmd === "server" || cmd === "tutorial" || cmd === "video"){
            message.reply(
                new Discord.MessageEmbed()
                    .setColor("#fcfc03")
                    .setFooter(client.user.username, config.AVATARURL)
                    .setAuthor(`${client.user.username} Support`, client.user.displayAvatarURL(), "https://milrato.eu")
                    .setDescription("[\`Join to Support Server\`](https://discord.gg/wvCp7q88G3) to gain help! OR watch the [Tutorial Video](https://youtu.be/X2yqNtd3COE)")
                )
                return;
        }
        else  if (cmd === "info" || cmd === "stats" || cmd === "stat"){
            let totalMembers = client.guilds.cache.reduce((c, g) => c + g.memberCount, 0);

            let totalSetups = 0;
            totalSetups += client.apply.filter(s => s.channel_id && s.channel_id.length > 1).size;
            totalSetups += client.apply2.filter(s => s.channel_id && s.channel_id.length > 1).size;
            totalSetups += client.apply3.filter(s => s.channel_id && s.channel_id.length > 1).size;

            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;
            const embed = new Discord.MessageEmbed()
                .setAuthor(
                `Information about the ${client.user.username} Bot`,
                client.user.displayAvatarURL(), "https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands"
                )
                .setColor("#fcfc03")
                .addFields(
                {
                    name: '🤖 Bot tag',
                    value: `**\`${client.user.tag}\`**`,
                    inline: true
                },
                {
                    name: '👾 Version',
                    value: `**\`v4.3.6\`**`,
                    inline: true
                },
                {
                    name: "👻 Command prefix",
                    value: `**\`e!\`**`,
                    inline: true
                },
                {
                    name: '⏱ Time since last restart',
                    value: `**\`${process.uptime().toFixed(2)}s\`**`,
                    inline: true
                },
                {
                    name: '🕐 Uptime',
                    value: `**\`${days}d\` \`${hours}h\` \`${minutes}m\` \`${seconds}s\`**`,
                    inline: true
                },
                {
                    name: '📁 Server count',
                    value: `**\`${client.guilds.cache.size}\`**`,
                    inline: true
                },
                {
                    name: '📂 Total members',
                    value: `**\`${totalMembers}\`**`,
                    inline: true
                },
                {
                    name: '⚙️ Setups created',
                    value: `**\`${totalSetups}\`**`,
                    inline: true
                }
                )
                .addField("***BOT BY:***",`
                >>> <@442355791412854784> \`Tomato#6966\`[\`Website\`](https://milrato.eu)
                `)
                .addField("***SUPPORT:***",`
                >>> [\`Server\`](https://discord.gg/wvCp7q88G3) | [\`milrato - Website\`](https://milrato.eu) | [\`Invite\`](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands)
                `)

            message.channel.send(embed)
            return;
        }
        else if(cmd === "uptime"){
            function duration(ms) {
                const sec = Math.floor((ms / 1000) % 60).toString()
                const min = Math.floor((ms / (1000 * 60)) % 60).toString()
                const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
                const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
                return `\`${days.padStart(1, '0')} Days\`, \`${hrs.padStart(2, '0')} Hours\`, \`${min.padStart(2, '0')} Minutes\`, \`${sec.padStart(2, '0')} Seconds\``
            }
            return message.reply(new Discord.MessageEmbed()
             .setColor("#fcfc03")
             .setTitle("🕐 | MY UPTIME:")
             .setDescription(`${duration(client.uptime)}`)
                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
             )
        }
        else if(cmd === "add" || cmd === "invite"){
            return message.reply(new Discord.MessageEmbed()
             .setColor("#fcfc03")
             .setURL("https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands")
             .setTitle("❤ | Thanks for every invite!")
             .setDescription(`[Click here to invite me, thanks](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands)`)
                .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
             )
        }
        else  if(cmd === "source" || cmd === "github"){
            message.reply(
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
        else if (cmd === "setup"){
          try{
            let apply_for_here = client.apply;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            let color = "GREEN";
            let desc;
            let userid = message.author.id;

            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            message.guild.channels.create("📋 | Applications", {
                type: "category",
            }).then(ch=>{
                ch.guild.channels.create("✔️|finished-applies", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                }).then(ch=> {
                    apply_for_here.set(ch.guild.id, ch.id, "f_channel_id")
                })
                ch.guild.channels.create("✅|apply-here", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            allow: ["VIEW_CHANNEL"],
                            deny: ["SEND_MESSAGES"]
                        },
                        {
                            id: client.user.id,
                            allow: ["VIEW_CHANNEL","SEND_MESSAGES"],
                        }
                    ]
                }).then(ch=> {
                    let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                    .setColor("ORANGE")
                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                     message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)")).then(msg =>{
                        msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let content = collected.first().content;
                            if(!content.startsWith("#") && content.length !== 7){
                                message.reply("WRONG COLOR! USING `GREEN`")
                            }
                            else {
                                if(isValidColor(content)){
                                    console.log(content)
                                    color = content;
                                }
                                else{
                                    message.reply("WRONG COLOR! USING `GREEN`")
                                }
                            }
                            function isValidColor(str) {
                                return str.match(/^#[a-f0-9]{6}$/i) !== null;
                            }
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                        .then(something=>{
                            message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg =>{
                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                    desc = collected.first().content;
                                    let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        .setColor(color)
                                        .setDescription(desc)
                                        .setTitle("Apply for: `" + message.guild.name + "`")
                                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        ch.send(setupembed).then(msg=>{
                                            msg.react("✅")
                                            apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                                        });
                                        let counter = 0;
                                        apply_for_here.set(msg.guild.id, [{"1":"DEFAULT"}], "QUESTIONS")
                                        ask_which_qu();
                                        function ask_which_qu(){
                                            counter++;
                                            if(counter === 25) {
                                                message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("You reached the maximum amount of Questions!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png"))
                                                return ask_addrole();
                                            }
                                            message.channel.send(embed.setTitle(`What should be the **${counter}** Question?`).setDescription("Enter `finish`, if you are finished with your Questions!")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                                    if(collected.first().content.toLowerCase() === "finish") {
                                                        return ask_addrole();
                                                    }
                                                    switch(counter){
                                                        case 1: { apply_for_here.set(msg.guild.id, [], "QUESTIONS"); apply_for_here.push(msg.guild.id, {"1": collected.first().content}, "QUESTIONS");}break;
                                                        case 2: apply_for_here.push(msg.guild.id, {"2": collected.first().content}, "QUESTIONS");break;
                                                        case 3: apply_for_here.push(msg.guild.id, {"3": collected.first().content}, "QUESTIONS");break;
                                                        case 4: apply_for_here.push(msg.guild.id, {"4": collected.first().content}, "QUESTIONS");break;
                                                        case 5: apply_for_here.push(msg.guild.id, {"5": collected.first().content}, "QUESTIONS");break;
                                                        case 6: apply_for_here.push(msg.guild.id, {"6": collected.first().content}, "QUESTIONS");break;
                                                        case 7: apply_for_here.push(msg.guild.id, {"7": collected.first().content}, "QUESTIONS");break;
                                                        case 8: apply_for_here.push(msg.guild.id, {"8": collected.first().content}, "QUESTIONS");break;
                                                        case 9: apply_for_here.push(msg.guild.id, {"9": collected.first().content}, "QUESTIONS");break;
                                                        case 10: apply_for_here.push(msg.guild.id, {"10": collected.first().content}, "QUESTIONS");break;
                                                        case 11: apply_for_here.push(msg.guild.id, {"11": collected.first().content}, "QUESTIONS");break;
                                                        case 12: apply_for_here.push(msg.guild.id, {"12": collected.first().content}, "QUESTIONS");break;
                                                        case 13: apply_for_here.push(msg.guild.id, {"13": collected.first().content}, "QUESTIONS");break;
                                                        case 14: apply_for_here.push(msg.guild.id, {"14": collected.first().content}, "QUESTIONS");break;
                                                        case 15: apply_for_here.push(msg.guild.id, {"15": collected.first().content}, "QUESTIONS");break;
                                                        case 16: apply_for_here.push(msg.guild.id, {"16": collected.first().content}, "QUESTIONS");break;
                                                        case 17: apply_for_here.push(msg.guild.id, {"17": collected.first().content}, "QUESTIONS");break;
                                                        case 18: apply_for_here.push(msg.guild.id, {"18": collected.first().content}, "QUESTIONS");break;
                                                        case 19: apply_for_here.push(msg.guild.id, {"19": collected.first().content}, "QUESTIONS");break;
                                                        case 20: apply_for_here.push(msg.guild.id, {"20": collected.first().content}, "QUESTIONS");break;
                                                        case 21: apply_for_here.push(msg.guild.id, {"21": collected.first().content}, "QUESTIONS");break;
                                                        case 22: apply_for_here.push(msg.guild.id, {"22": collected.first().content}, "QUESTIONS");break;
                                                        case 23: apply_for_here.push(msg.guild.id, {"23": collected.first().content}, "QUESTIONS");break;
                                                        case 24: apply_for_here.push(msg.guild.id, {"24": collected.first().content}, "QUESTIONS");break;
                                                    }
                                                    ask_which_qu();
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                        function ask_addrole(){
                                            message.channel.send(embed.setTitle(`Do you want to add a Role, when some1 applies?`).setDescription("Enter `no`, if not\n\nJust ping the Role")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(async collected => {
                                                    if(collected.first().content.toLowerCase() === "no") {
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`);
                                                    }
                                                    else{
                                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        let guildrole = message.guild.roles.cache.get(role)

                                                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                                        let botrole = message.guild.me.roles.highest
                                                        console.log(guildrole.rawPosition)
                                                        console.log(botrole.rawPosition)
                                                        if(guildrole.rawPosition >= botrole.rawPosition) {
                                                            message.channel.send("I can't access that role, place \"me\" / \"my highest Role\" above other roles that you want me to manage.\n\n SO I AM USING **NO** ROLE, you can change it with: `e!editsetup role`")
                                                            return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        }
                                                        apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                    }
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                    }).catch(error=>{

                                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                    })
                            })
                        })
                    })
                })
            })
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        else if (cmd === "editsetup"){
          try{
            let apply_for_here = client.apply;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))

            switch(args[0]){
                case "acceptmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "accept")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "acceptrole":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                          let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                          if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                          let guildrole = message.guild.roles.cache.get(role)

                          if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                          let botrole = message.guild.me.roles.highest

                          if(guildrole.rawPosition <= botrole.rawPosition) {
                            apply_for_here.set(message.guild.id, role, "accept_role")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                          }
                          else{
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                          }
                        }).catch(error=>{

                          return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "denymsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new deny message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "deny")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the DENY MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "ticketmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Ticket message? | {user} pings the User", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "ticket")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the TICKET MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "emojione":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "one.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "one.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "one.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "one.image.enabled")
                      apply_for_here.set(message.guild.id, "", "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "one.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojitwo":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "two.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY two SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "two.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "two.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "two.image.enabled")
                      apply_for_here.set(message.guild.id, "", "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "two.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojithree":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "three.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY three SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "three.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "three.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "three.image.enabled")
                      apply_for_here.set(message.guild.id, "", "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "three.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifour":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "four.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY four SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "four.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "four.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "four.image.enabled")
                      apply_for_here.set(message.guild.id, "", "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "four.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifive":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "five.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY five SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "five.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "five.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "five.image.enabled")
                      apply_for_here.set(message.guild.id, "", "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "five.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "editquestion": case "question":
                args.shift();
                {
                        let Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                        let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("#fcfc03")
                        .setTitle("Current Questions") //Tomato#6966
                        .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({dynamic: true}))
                        .setTimestamp()

                        for(let i = 0; i < Questions.length; i++){
                            try{
                                embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                            }catch (e){
                            console.log(e)
                            }
                        }
                        if(!args[0]){
                        message.channel.send(embed);
                        return message.channel.send(new Discord.MessageEmbed()
                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("RED")
                        .setAuthor("Please try again by adding an index!", message.author.displayAvatarURL({dynamic:true}))
                        .setDescription("For example: `e!editsetup question 4`")
                        )
                        }
                        else{

                            let arr = apply_for_here.get(message.guild.id, "QUESTIONS");
                                if(arr.length >= Number(args[0])){
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Question?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                            const index = Number(args[0]);
                                            var obj;
                                            switch(Number(index)){
                                                case 1: obj =  {"1": collected.first().content};break;
                                                case 2: obj =  {"2": collected.first().content};break;
                                                case 3: obj =  {"3": collected.first().content};break;
                                                case 4: obj =  {"4": collected.first().content};break;
                                                case 5: obj =  {"5": collected.first().content};break;
                                                case 6: obj =  {"6": collected.first().content};break;
                                                case 7: obj =  {"7": collected.first().content};break;
                                                case 8: obj =  {"8": collected.first().content};break;
                                                case 9: obj =  {"9": collected.first().content};break;
                                                case 10: obj =  {"10": collected.first().content};break;
                                                case 11: obj =  {"11": collected.first().content};break;
                                                case 12: obj =  {"12": collected.first().content};break;
                                                case 13: obj =  {"13": collected.first().content};break;
                                                case 14: obj =  {"14": collected.first().content};break;
                                                case 15: obj =  {"15": collected.first().content};break;
                                                case 16: obj =  {"16": collected.first().content};break;
                                                case 17: obj =  {"17": collected.first().content};break;
                                                case 18: obj =  {"18": collected.first().content};break;
                                                case 19: obj =  {"19": collected.first().content};break;
                                                case 20: obj =  {"20": collected.first().content};break;
                                                case 21: obj =  {"21": collected.first().content};break;
                                                case 22: obj =  {"22": collected.first().content};break;
                                                case 23: obj =  {"23": collected.first().content};break;
                                                case 24: obj =  {"24": collected.first().content};break;
                                            }
                                            arr[index-1] = obj;
                                            apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                            let new_embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                .setColor("#fcfc03")
                                                .setTitle("NEW Questions") //Tomato#6966
                                                .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                                                .setTimestamp()
                                            for(let i = 0; i < Questions.length; i++){
                                                try{
                                                    new_embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                                }catch{
                                                }
                                            }
                                            message.channel.send(new_embed);
                                        }).catch(error=>{

                                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                        })
                                    })
                                }else{
                                     message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({dynamic:true})))
                                     return message.channel.send(embed);
                                }

                        }
                }
                break;
                case "temprole": case "role":
                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new temp Role, which will be granted once the user applied?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                      msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                        let guildrole = message.guild.roles.cache.get(role)

                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                        let botrole = message.guild.me.roles.highest

                        if(guildrole.rawPosition <= botrole.rawPosition) {
                          apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                        }
                        else{
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                        }
                      }).catch(error=>{

                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                      })
                  })
                break;
                case "addquestion":
                    args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What Question should be added?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let Questions = apply_for_here.get(message.guild.id, "QUESTIONS")
                            let obj;
                            switch(Questions.length+1){
                                case 1: obj =  {"1": collected.first().content};break;
                                case 2: obj =  {"2": collected.first().content};break;
                                case 3: obj =  {"3": collected.first().content};break;
                                case 4: obj =  {"4": collected.first().content};break;
                                case 5: obj =  {"5": collected.first().content};break;
                                case 6: obj =  {"6": collected.first().content};break;
                                case 7: obj =  {"7": collected.first().content};break;
                                case 8: obj =  {"8": collected.first().content};break;
                                case 9: obj =  {"9": collected.first().content};break;
                                case 10: obj =  {"10": collected.first().content};break;
                                case 11: obj =  {"11": collected.first().content};break;
                                case 12: obj =  {"12": collected.first().content};break;
                                case 13: obj =  {"13": collected.first().content};break;
                                case 14: obj =  {"14": collected.first().content};break;
                                case 15: obj =  {"15": collected.first().content};break;
                                case 16: obj =  {"16": collected.first().content};break;
                                case 17: obj =  {"17": collected.first().content};break;
                                case 18: obj =  {"18": collected.first().content};break;
                                case 19: obj =  {"19": collected.first().content};break;
                                case 20: obj =  {"20": collected.first().content};break;
                                case 21: obj =  {"21": collected.first().content};break;
                                case 22: obj =  {"22": collected.first().content};break;
                                case 23: obj =  {"23": collected.first().content};break;
                                case 24: obj =  {"24": collected.first().content};break;
                            }
                            apply_for_here.push(message.guild.id, obj, "QUESTIONS")
                            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully added your Question!", message.author.displayAvatarURL({dynamic:true})))
                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                            let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            .setColor("#fcfc03")
                            .setTitle("NEW Questions") //Tomato#6966
                            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                            .setTimestamp()

                            for(let i = 0; i < Questions.length; i++){
                                try{
                                    embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                }catch (e){
                                console.log(e)
                                }
                            }
                            message.channel.send(embed);
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                default:
                    return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("Please use a valid parameter!", message.author.displayAvatarURL({dynamic:true})).setDescription("`acceptmsg` / `acceptrole` / `denymsg` / `ticketmsg` / `emojione` / `emojitwo` / `emojithree` / `emojifour` / `emojifive` / `temprole` / `editquestion` / `addquestion`"))
                break;
            }
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        //SECOND APPLICATION SYSTEM
        else if (cmd === "setup2"){
          try{
            let apply_for_here = client.apply2;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            let color = "GREEN";
            let desc;
            let userid = message.author.id;

            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            message.guild.channels.create("📋 | Applications", {
                type: "category",
            }).then(ch=>{
                ch.guild.channels.create("✔️|finished-applies", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                }).then(ch=> {
                    apply_for_here.set(ch.guild.id, ch.id, "f_channel_id")
                })
                ch.guild.channels.create("✅|apply-here", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            allow: ["VIEW_CHANNEL"],
                            deny: ["SEND_MESSAGES"]
                        }
                    ]
                }).then(ch=> {
                    let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                    .setColor("ORANGE")
                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                     message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)")).then(msg =>{
                        msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let content = collected.first().content;
                            if(!content.startsWith("#") && content.length !== 7){
                                message.reply("WRONG COLOR! USING `GREEN`")
                            }
                            else {
                                if(isValidColor(content)){
                                    console.log(content)
                                    color = content;
                                }
                                else{
                                    message.reply("WRONG COLOR! USING `GREEN`")
                                }
                            }
                            function isValidColor(str) {
                                return str.match(/^#[a-f0-9]{6}$/i) !== null;
                            }
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                        .then(something=>{
                            message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg =>{
                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                    desc = collected.first().content;
                                    let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        .setColor(color)
                                        .setDescription(desc)
                                        .setTitle("Apply for: `" + message.guild.name + "`")
                                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        ch.send(setupembed).then(msg=>{
                                            msg.react("✅")
                                            apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                                        });
                                        let counter = 0;
                                        apply_for_here.set(msg.guild.id, [{"1":"DEFAULT"}], "QUESTIONS")
                                        ask_which_qu();
                                        function ask_which_qu(){
                                            counter++;
                                            if(counter === 25) {
                                                message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("You reached the maximum amount of Questions!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png"))
                                                return ask_addrole();
                                            }
                                            message.channel.send(embed.setTitle(`What should be the **${counter}** Question?`).setDescription("Enter `finish`, if you are finished with your Questions!")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                                    if(collected.first().content.toLowerCase() === "finish") {
                                                        return ask_addrole();
                                                    }
                                                    switch(counter){
                                                        case 1: { apply_for_here.set(msg.guild.id, [], "QUESTIONS"); apply_for_here.push(msg.guild.id, {"1": collected.first().content}, "QUESTIONS");}break;
                                                        case 2: apply_for_here.push(msg.guild.id, {"2": collected.first().content}, "QUESTIONS");break;
                                                        case 3: apply_for_here.push(msg.guild.id, {"3": collected.first().content}, "QUESTIONS");break;
                                                        case 4: apply_for_here.push(msg.guild.id, {"4": collected.first().content}, "QUESTIONS");break;
                                                        case 5: apply_for_here.push(msg.guild.id, {"5": collected.first().content}, "QUESTIONS");break;
                                                        case 6: apply_for_here.push(msg.guild.id, {"6": collected.first().content}, "QUESTIONS");break;
                                                        case 7: apply_for_here.push(msg.guild.id, {"7": collected.first().content}, "QUESTIONS");break;
                                                        case 8: apply_for_here.push(msg.guild.id, {"8": collected.first().content}, "QUESTIONS");break;
                                                        case 9: apply_for_here.push(msg.guild.id, {"9": collected.first().content}, "QUESTIONS");break;
                                                        case 10: apply_for_here.push(msg.guild.id, {"10": collected.first().content}, "QUESTIONS");break;
                                                        case 11: apply_for_here.push(msg.guild.id, {"11": collected.first().content}, "QUESTIONS");break;
                                                        case 12: apply_for_here.push(msg.guild.id, {"12": collected.first().content}, "QUESTIONS");break;
                                                        case 13: apply_for_here.push(msg.guild.id, {"13": collected.first().content}, "QUESTIONS");break;
                                                        case 14: apply_for_here.push(msg.guild.id, {"14": collected.first().content}, "QUESTIONS");break;
                                                        case 15: apply_for_here.push(msg.guild.id, {"15": collected.first().content}, "QUESTIONS");break;
                                                        case 16: apply_for_here.push(msg.guild.id, {"16": collected.first().content}, "QUESTIONS");break;
                                                        case 17: apply_for_here.push(msg.guild.id, {"17": collected.first().content}, "QUESTIONS");break;
                                                        case 18: apply_for_here.push(msg.guild.id, {"18": collected.first().content}, "QUESTIONS");break;
                                                        case 19: apply_for_here.push(msg.guild.id, {"19": collected.first().content}, "QUESTIONS");break;
                                                        case 20: apply_for_here.push(msg.guild.id, {"20": collected.first().content}, "QUESTIONS");break;
                                                        case 21: apply_for_here.push(msg.guild.id, {"21": collected.first().content}, "QUESTIONS");break;
                                                        case 22: apply_for_here.push(msg.guild.id, {"22": collected.first().content}, "QUESTIONS");break;
                                                        case 23: apply_for_here.push(msg.guild.id, {"23": collected.first().content}, "QUESTIONS");break;
                                                        case 24: apply_for_here.push(msg.guild.id, {"24": collected.first().content}, "QUESTIONS");break;
                                                    }
                                                    ask_which_qu();
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                        function ask_addrole(){
                                            message.channel.send(embed.setTitle(`Do you want to add a Role, when some1 applies?`).setDescription("Enter `no`, if not\n\nJust ping the Role")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(async collected => {
                                                    if(collected.first().content.toLowerCase() === "no") {
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`);
                                                    }
                                                    else{
                                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        let guildrole = message.guild.roles.cache.get(role)

                                                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                                        let botrole = message.guild.me.roles.highest

                                                        if(guildrole.rawPosition >= botrole.rawPosition) {
                                                            message.channel.send("I can't access that role, place \"me\" / \"my highest Role\" above other roles that you want me to manage.\n\n SO I AM USING **NO** ROLE, you can change it with: `e!editsetup role`")
                                                            return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        }
                                                        apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                    }
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                    }).catch(error=>{

                                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                    })
                            })
                        })
                    })
                })
            })
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        else if (cmd === "editsetup2"){
          try{
            let apply_for_here = client.apply2;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))

            switch(args[0]){
                case "acceptmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "accept")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "acceptrole":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                          let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                          if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                          let guildrole = message.guild.roles.cache.get(role)

                          if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                          let botrole = message.guild.me.roles.highest

                          if(guildrole.rawPosition <= botrole.rawPosition) {
                            apply_for_here.set(message.guild.id, role, "accept_role")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                          }
                          else{
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                          }
                        }).catch(error=>{

                          return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "denymsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new deny message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "deny")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the DENY MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "ticketmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Ticket message? | {user} pings the User", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "ticket")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the TICKET MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "emojione":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "one.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "one.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "one.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "one.image.enabled")
                      apply_for_here.set(message.guild.id, "", "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "one.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojitwo":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "two.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY two SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "two.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "two.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "two.image.enabled")
                      apply_for_here.set(message.guild.id, "", "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "two.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojithree":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "three.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY three SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "three.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "three.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "three.image.enabled")
                      apply_for_here.set(message.guild.id, "", "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "three.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifour":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "four.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY four SETUP**/**GUILD`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "four.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "four.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "four.image.enabled")
                      apply_for_here.set(message.guild.id, "", "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "four.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifive":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "five.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY five SETUP**/**GUILD`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "five.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "five.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "five.image.enabled")
                      apply_for_here.set(message.guild.id, "", "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "five.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "editquestion": case "question":
                args.shift();
                {
                        let Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                        let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("#fcfc03")
                        .setTitle("Current Questions") //Tomato#6966
                        .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({dynamic: true}))
                        .setTimestamp()

                        for(let i = 0; i < Questions.length; i++){
                            try{
                                embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                            }catch (e){
                            console.log(e)
                            }
                        }
                        if(!args[0]){
                        message.channel.send(embed);
                        return message.channel.send(new Discord.MessageEmbed()
                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("RED")
                        .setAuthor("Please try again by adding an index!", message.author.displayAvatarURL({dynamic:true}))
                        .setDescription("For example: `e!editsetup question 4`")
                        )
                        }
                        else{

                            let arr = apply_for_here.get(message.guild.id, "QUESTIONS");
                                if(arr.length >= Number(args[0])){
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Question?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                            const index = Number(args[0]);
                                            var obj;
                                            switch(Number(index)){
                                                case 1: obj =  {"1": collected.first().content};break;
                                                case 2: obj =  {"2": collected.first().content};break;
                                                case 3: obj =  {"3": collected.first().content};break;
                                                case 4: obj =  {"4": collected.first().content};break;
                                                case 5: obj =  {"5": collected.first().content};break;
                                                case 6: obj =  {"6": collected.first().content};break;
                                                case 7: obj =  {"7": collected.first().content};break;
                                                case 8: obj =  {"8": collected.first().content};break;
                                                case 9: obj =  {"9": collected.first().content};break;
                                                case 10: obj =  {"10": collected.first().content};break;
                                                case 11: obj =  {"11": collected.first().content};break;
                                                case 12: obj =  {"12": collected.first().content};break;
                                                case 13: obj =  {"13": collected.first().content};break;
                                                case 14: obj =  {"14": collected.first().content};break;
                                                case 15: obj =  {"15": collected.first().content};break;
                                                case 16: obj =  {"16": collected.first().content};break;
                                                case 17: obj =  {"17": collected.first().content};break;
                                                case 18: obj =  {"18": collected.first().content};break;
                                                case 19: obj =  {"19": collected.first().content};break;
                                                case 20: obj =  {"20": collected.first().content};break;
                                                case 21: obj =  {"21": collected.first().content};break;
                                                case 22: obj =  {"22": collected.first().content};break;
                                                case 23: obj =  {"23": collected.first().content};break;
                                                case 24: obj =  {"24": collected.first().content};break;
                                            }
                                            arr[index-1] = obj;
                                            apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                            let new_embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                .setColor("#fcfc03")
                                                .setTitle("NEW Questions") //Tomato#6966
                                                .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                                                .setTimestamp()
                                            for(let i = 0; i < Questions.length; i++){
                                                try{
                                                    new_embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                                }catch{
                                                }
                                            }
                                            message.channel.send(new_embed);
                                        }).catch(error=>{

                                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                        })
                                    })
                                }else{
                                     message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({dynamic:true})))
                                     return message.channel.send(embed);
                                }

                        }
                }
                break;
                case "temprole": case "role":
                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new temp Role, which will be granted once the user applied?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                      msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                        let guildrole = message.guild.roles.cache.get(role)

                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                        let botrole = message.guild.me.roles.highest

                        if(guildrole.rawPosition <= botrole.rawPosition) {
                          apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                        }
                        else{
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                        }
                      }).catch(error=>{

                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                      })
                  })
                break;
                case "addquestion":
                    args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What Question should be added?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let Questions = apply_for_here.get(message.guild.id, "QUESTIONS")
                            let obj;
                            switch(Questions.length+1){
                                case 1: obj =  {"1": collected.first().content};break;
                                case 2: obj =  {"2": collected.first().content};break;
                                case 3: obj =  {"3": collected.first().content};break;
                                case 4: obj =  {"4": collected.first().content};break;
                                case 5: obj =  {"5": collected.first().content};break;
                                case 6: obj =  {"6": collected.first().content};break;
                                case 7: obj =  {"7": collected.first().content};break;
                                case 8: obj =  {"8": collected.first().content};break;
                                case 9: obj =  {"9": collected.first().content};break;
                                case 10: obj =  {"10": collected.first().content};break;
                                case 11: obj =  {"11": collected.first().content};break;
                                case 12: obj =  {"12": collected.first().content};break;
                                case 13: obj =  {"13": collected.first().content};break;
                                case 14: obj =  {"14": collected.first().content};break;
                                case 15: obj =  {"15": collected.first().content};break;
                                case 16: obj =  {"16": collected.first().content};break;
                                case 17: obj =  {"17": collected.first().content};break;
                                case 18: obj =  {"18": collected.first().content};break;
                                case 19: obj =  {"19": collected.first().content};break;
                                case 20: obj =  {"20": collected.first().content};break;
                                case 21: obj =  {"21": collected.first().content};break;
                                case 22: obj =  {"22": collected.first().content};break;
                                case 23: obj =  {"23": collected.first().content};break;
                                case 24: obj =  {"24": collected.first().content};break;
                            }
                            apply_for_here.push(message.guild.id, obj, "QUESTIONS")
                            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully added your Question!", message.author.displayAvatarURL({dynamic:true})))
                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                            let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            .setColor("#fcfc03")
                            .setTitle("NEW Questions") //Tomato#6966
                            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                            .setTimestamp()

                            for(let i = 0; i < Questions.length; i++){
                                try{
                                    embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                }catch (e){
                                console.log(e)
                                }
                            }
                            message.channel.send(embed);
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                default:
                    return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("Please use a valid parameter!", message.author.displayAvatarURL({dynamic:true})).setDescription("`acceptmsg` / `acceptrole` / `denymsg` / `ticketmsg` / `emojione` / `emojitwo` / `emojithree` / `emojifour` / `emojifive` / `temprole` / `editquestion` / `addquestion`"))
                break;
            }
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        //THIRD APPLICATION SYSTEM
        else if (cmd === "setup3"){
          try{
            let apply_for_here = client.apply3;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            let color = "GREEN";
            let desc;
            let userid = message.author.id;

            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("Setting up...", "https://miro.medium.com/max/1600/1*e_Loq49BI4WmN7o9ItTADg.gif").setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))
            message.guild.channels.create("📋 | Applications", {
                type: "category",
            }).then(ch=>{
                ch.guild.channels.create("✔️|finished-applies", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                }).then(ch=> {
                    apply_for_here.set(ch.guild.id, ch.id, "f_channel_id")
                })
                ch.guild.channels.create("✅|apply-here", {
                    type: "text",
                    topic: "React to the Embed, to start the application process",
                    parent: ch.id,
                    permissionOverwrites: [
                        {
                            id: ch.guild.id,
                            allow: ["VIEW_CHANNEL"],
                            deny: ["SEND_MESSAGES"]
                        }
                    ]
                }).then(ch=> {
                    let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                    .setColor("ORANGE")
                    .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                     message.channel.send(embed.setTitle("What should be the embed color?").setDescription("It MUST be an HEX CODE 7 letters long, **with** the `#` (e.g: #ffee55)")).then(msg =>{
                        msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let content = collected.first().content;
                            if(!content.startsWith("#") && content.length !== 7){
                                message.reply("WRONG COLOR! USING `GREEN`")
                            }
                            else {
                                if(isValidColor(content)){
                                    console.log(content)
                                    color = content;
                                }
                                else{
                                    message.reply("WRONG COLOR! USING `GREEN`")
                                }
                            }
                            function isValidColor(str) {
                                return str.match(/^#[a-f0-9]{6}$/i) !== null;
                            }
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                        .then(something=>{
                            message.channel.send(embed.setTitle("What should be the embed TEXT?").setDescription("Like what do u want to have listed in the Embed?")).then(msg =>{
                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                    desc = collected.first().content;
                                    let setupembed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        .setColor(color)
                                        .setDescription(desc)
                                        .setTitle("Apply for: `" + message.guild.name + "`")
                                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                        ch.send(setupembed).then(msg=>{
                                            msg.react("✅")
                                            apply_for_here.set(msg.guild.id, msg.channel.id, "channel_id")
                                        });
                                        let counter = 0;
                                        apply_for_here.set(msg.guild.id, [{"1":"DEFAULT"}], "QUESTIONS")
                                        ask_which_qu();
                                        function ask_which_qu(){
                                            counter++;
                                            if(counter === 25) {
                                                message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("You reached the maximum amount of Questions!", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/cross-mark_274c.png"))
                                                return ask_addrole();
                                            }
                                            message.channel.send(embed.setTitle(`What should be the **${counter}** Question?`).setDescription("Enter `finish`, if you are finished with your Questions!")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                                    if(collected.first().content.toLowerCase() === "finish") {
                                                        return ask_addrole();
                                                    }
                                                    switch(counter){
                                                        case 1: { apply_for_here.set(msg.guild.id, [], "QUESTIONS"); apply_for_here.push(msg.guild.id, {"1": collected.first().content}, "QUESTIONS");}break;
                                                        case 2: apply_for_here.push(msg.guild.id, {"2": collected.first().content}, "QUESTIONS");break;
                                                        case 3: apply_for_here.push(msg.guild.id, {"3": collected.first().content}, "QUESTIONS");break;
                                                        case 4: apply_for_here.push(msg.guild.id, {"4": collected.first().content}, "QUESTIONS");break;
                                                        case 5: apply_for_here.push(msg.guild.id, {"5": collected.first().content}, "QUESTIONS");break;
                                                        case 6: apply_for_here.push(msg.guild.id, {"6": collected.first().content}, "QUESTIONS");break;
                                                        case 7: apply_for_here.push(msg.guild.id, {"7": collected.first().content}, "QUESTIONS");break;
                                                        case 8: apply_for_here.push(msg.guild.id, {"8": collected.first().content}, "QUESTIONS");break;
                                                        case 9: apply_for_here.push(msg.guild.id, {"9": collected.first().content}, "QUESTIONS");break;
                                                        case 10: apply_for_here.push(msg.guild.id, {"10": collected.first().content}, "QUESTIONS");break;
                                                        case 11: apply_for_here.push(msg.guild.id, {"11": collected.first().content}, "QUESTIONS");break;
                                                        case 12: apply_for_here.push(msg.guild.id, {"12": collected.first().content}, "QUESTIONS");break;
                                                        case 13: apply_for_here.push(msg.guild.id, {"13": collected.first().content}, "QUESTIONS");break;
                                                        case 14: apply_for_here.push(msg.guild.id, {"14": collected.first().content}, "QUESTIONS");break;
                                                        case 15: apply_for_here.push(msg.guild.id, {"15": collected.first().content}, "QUESTIONS");break;
                                                        case 16: apply_for_here.push(msg.guild.id, {"16": collected.first().content}, "QUESTIONS");break;
                                                        case 17: apply_for_here.push(msg.guild.id, {"17": collected.first().content}, "QUESTIONS");break;
                                                        case 18: apply_for_here.push(msg.guild.id, {"18": collected.first().content}, "QUESTIONS");break;
                                                        case 19: apply_for_here.push(msg.guild.id, {"19": collected.first().content}, "QUESTIONS");break;
                                                        case 20: apply_for_here.push(msg.guild.id, {"20": collected.first().content}, "QUESTIONS");break;
                                                        case 21: apply_for_here.push(msg.guild.id, {"21": collected.first().content}, "QUESTIONS");break;
                                                        case 22: apply_for_here.push(msg.guild.id, {"22": collected.first().content}, "QUESTIONS");break;
                                                        case 23: apply_for_here.push(msg.guild.id, {"23": collected.first().content}, "QUESTIONS");break;
                                                        case 24: apply_for_here.push(msg.guild.id, {"24": collected.first().content}, "QUESTIONS");break;
                                                    }
                                                    ask_which_qu();
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                        function ask_addrole(){
                                            message.channel.send(embed.setTitle(`Do you want to add a Role, when some1 applies?`).setDescription("Enter `no`, if not\n\nJust ping the Role")).then(msg=>{
                                                msg.channel.awaitMessages(m => m.author.id === userid, {max: 1, time: 60000, errors: ["TIME"]}).then(async collected => {
                                                    if(collected.first().content.toLowerCase() === "no") {
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`);
                                                    }
                                                    else{
                                                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                                                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        let guildrole = message.guild.roles.cache.get(role)

                                                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                                        let botrole = message.guild.me.roles.highest

                                                        if(guildrole.rawPosition >= botrole.rawPosition) {
                                                            message.channel.send("I can't access that role, place \"me\" / \"my highest Role\" above other roles that you want me to manage.\n\n SO I AM USING **NO** ROLE, you can change it with: `e!editsetup role`")
                                                            return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                        }
                                                        apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                                                        return message.reply(`YOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`e!editsetup\` / rerunning: \`e!setup\`* NOTE: ONLY THREE SETUPS (\`e!setup2\`, \`e!setup3\`)**/**GUILD\n\nRUN: \`e!editsetup\` to adjust which Role per Reaction should be granted and which messages should be sent`)
                                                    }
                                                }).catch(error=>{

                                                    return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                                })
                                            })
                                        }
                                    }).catch(error=>{

                                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                    })
                            })
                        })
                    })
                })
            })
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        else if (cmd === "editsetup3"){
          try{
            let apply_for_here = client.apply2;
            if(!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("You are not having enough permissions to run this cmd!", message.author.displayAvatarURL({dynamic:true})).setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()))

            switch(args[0]){
                case "acceptmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "accept")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "acceptrole":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                          let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                          if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                          let guildrole = message.guild.roles.cache.get(role)

                          if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                          let botrole = message.guild.me.roles.highest

                          if(guildrole.rawPosition <= botrole.rawPosition) {
                            apply_for_here.set(message.guild.id, role, "accept_role")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                          }
                          else{
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                          }
                        }).catch(error=>{

                          return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "denymsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new deny message?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "deny")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the DENY MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "ticketmsg":
                args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Ticket message? | {user} pings the User", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            apply_for_here.set(message.guild.id, collected.first().content, "ticket")
                            return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the TICKET MESSAGE!", message.author.displayAvatarURL({dynamic:true})))
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                case "emojione":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "one.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji one?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "one.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "one.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "one.image.enabled")
                      apply_for_here.set(message.guild.id, "", "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojione setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "one.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "one.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji one!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojione message\` --> follow steps / \`e!editsetup emojione setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojitwo":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "two.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji two?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY two SETUP**/**GUILD`)
                                let guildrole = message.guild.roles.cache.get(role)

                                if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                                let botrole = message.guild.me.roles.highest

                                if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "two.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "two.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "two.image.enabled")
                      apply_for_here.set(message.guild.id, "", "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojitwo setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "two.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "two.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji two!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojitwo message\` --> follow steps / \`e!editsetup emojitwo setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojithree":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "three.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji three?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY three SETUP**/**GUILD`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "three.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "three.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "three.image.enabled")
                      apply_for_here.set(message.guild.id, "", "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojithree setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "three.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "three.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji three!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojithree message\` --> follow steps / \`e!editsetup emojithree setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifour":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "four.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji four?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY four SETUP**/**GUILD`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "four.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "four.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "four.image.enabled")
                      apply_for_here.set(message.guild.id, "", "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifour setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "four.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "four.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji four!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifour message\` --> follow steps / \`e!editsetup emojifour setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "emojifive":
                args.shift();
                {
                  if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter an Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                  switch(args[0]){
                    case "message":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept message for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                                apply_for_here.set(message.guild.id, collected.first().content, "five.message")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT MESSAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                            }).catch(error=>{

                                return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "setrole":
                    args.shift();
                    {
                        message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new accept Role, which will be granted when the User got accepted for emoji five?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                            msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                              let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                              if(!role) return message.reply(`COULD NOT FIND THE ROLE!\n\nYOUR APPLICATION SYSTEM IS READY 2 USE: ${ch}\n\n*You can edit Questions by running the cmd: \`//setup\`->\`editsetup\` / rerunning: \`//setup\`* NOTE: ONLY five SETUP**/**GUILD`)
                              let guildrole = message.guild.roles.cache.get(role)

                              if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                              let botrole = message.guild.me.roles.highest

                              if(guildrole.rawPosition <= botrole.rawPosition) {
                                apply_for_here.set(message.guild.id, role, "five.role")
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                              }
                              else{
                                return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                              }
                            }).catch(error=>{

                              return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                            })
                        })
                    }
                    break;
                    case "delrole":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, "", "five.role")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT ROLE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    break;
                    case "delimage":
                    args.shift();
                    {
                      apply_for_here.set(message.guild.id, false, "five.image.enabled")
                      apply_for_here.set(message.guild.id, "", "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }
                    case "setimage":
                    args.shift();
                    {
                      if(!args[0]) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add an Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      if(!args[0].toLowerCase().includes("http") && !args[0].toLowerCase().includes("png") && !args[0].toLowerCase().includes("jpg") && !args[0].toLowerCase().includes("gif")) return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR add a valid Image").setDescription("Example usage: \`e!editsetup emojifive setimage https://cdn.discordapp.com/avatars/442355791412854784/df7b527a701d9a1ab6d73213576fe295.webp\`"))
                      apply_for_here.set(message.guild.id, true, "five.image.enabled")
                      apply_for_here.set(message.guild.id, args[0], "five.image.url")
                      return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully deleted the ACCEPT IMAGE for emoji five!", message.author.displayAvatarURL({dynamic:true})))
                    }

                    default:
                        return message.reply(new Discord.MessageEmbed().setColor("RED").setTitle("ERROR please enter a valid Option").setDescription("Valid Options are: `message`, `setimage`, `delimage`, `setrole`, `delrole`\n\nExample usage: \`e!editsetup emojifive message\` --> follow steps / \`e!editsetup emojifive setrole\` --> follow steps"))
                    break;
                  }
                }
                break;
                case "editquestion": case "question":
                args.shift();
                {
                        let Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                        let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("#fcfc03")
                        .setTitle("Current Questions") //Tomato#6966
                        .setFooter("ADD THE INDEX TO EDIT THE MSG", message.guild.iconURL({dynamic: true}))
                        .setTimestamp()

                        for(let i = 0; i < Questions.length; i++){
                            try{
                                embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                            }catch (e){
                            console.log(e)
                            }
                        }
                        if(!args[0]){
                        message.channel.send(embed);
                        return message.channel.send(new Discord.MessageEmbed()
                        .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                        .setColor("RED")
                        .setAuthor("Please try again by adding an index!", message.author.displayAvatarURL({dynamic:true}))
                        .setDescription("For example: `e!editsetup question 4`")
                        )
                        }
                        else{

                            let arr = apply_for_here.get(message.guild.id, "QUESTIONS");
                                if(arr.length >= Number(args[0])){
                                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new Question?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected => {
                                            const index = Number(args[0]);
                                            var obj;
                                            switch(Number(index)){
                                                case 1: obj =  {"1": collected.first().content};break;
                                                case 2: obj =  {"2": collected.first().content};break;
                                                case 3: obj =  {"3": collected.first().content};break;
                                                case 4: obj =  {"4": collected.first().content};break;
                                                case 5: obj =  {"5": collected.first().content};break;
                                                case 6: obj =  {"6": collected.first().content};break;
                                                case 7: obj =  {"7": collected.first().content};break;
                                                case 8: obj =  {"8": collected.first().content};break;
                                                case 9: obj =  {"9": collected.first().content};break;
                                                case 10: obj =  {"10": collected.first().content};break;
                                                case 11: obj =  {"11": collected.first().content};break;
                                                case 12: obj =  {"12": collected.first().content};break;
                                                case 13: obj =  {"13": collected.first().content};break;
                                                case 14: obj =  {"14": collected.first().content};break;
                                                case 15: obj =  {"15": collected.first().content};break;
                                                case 16: obj =  {"16": collected.first().content};break;
                                                case 17: obj =  {"17": collected.first().content};break;
                                                case 18: obj =  {"18": collected.first().content};break;
                                                case 19: obj =  {"19": collected.first().content};break;
                                                case 20: obj =  {"20": collected.first().content};break;
                                                case 21: obj =  {"21": collected.first().content};break;
                                                case 22: obj =  {"22": collected.first().content};break;
                                                case 23: obj =  {"23": collected.first().content};break;
                                                case 24: obj =  {"24": collected.first().content};break;
                                            }
                                            arr[index-1] = obj;
                                            apply_for_here.set(message.guild.id, arr, "QUESTIONS")
                                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                                            let new_embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                                                .setColor("#fcfc03")
                                                .setTitle("NEW Questions") //Tomato#6966
                                                .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                                                .setTimestamp()
                                            for(let i = 0; i < Questions.length; i++){
                                                try{
                                                    new_embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                                }catch{
                                                }
                                            }
                                            message.channel.send(new_embed);
                                        }).catch(error=>{

                                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                                        })
                                    })
                                }else{
                                     message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("It seems, that this Question does not exist! Please retry! Here are all Questions:", message.author.displayAvatarURL({dynamic:true})))
                                     return message.channel.send(embed);
                                }

                        }
                }
                break;
                case "temprole": case "role":
                  message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What should be the new temp Role, which will be granted once the user applied?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                      msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                        let role = collected.first().mentions.roles.map(role => role.id).join(" ");
                        if(!role) return message.reply(`COULD NOT FIND THE ROLE!`)
                        let guildrole = message.guild.roles.cache.get(role)

                        if(!message.guild.me.roles) return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))

                        let botrole = message.guild.me.roles.highest

                        if(guildrole.rawPosition <= botrole.rawPosition) {
                          apply_for_here.set(message.guild.id, role, "TEMP_ROLE")
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully changed the ACCEPT ROLE!", message.author.displayAvatarURL({dynamic:true})))
                        }
                        else{
                          return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setDescription("Make sure that the Role is under me!").setAuthor("ERROR | Could not Access the Role", message.author.displayAvatarURL({dynamic:true})))
                        }
                      }).catch(error=>{

                        return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                      })
                  })
                break;
                case "addquestion":
                    args.shift();
                {
                    message.channel.send(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("#fcfc03").setAuthor("What Question should be added?", message.author.displayAvatarURL({dynamic:true}))).then(msg=>{
                        msg.channel.awaitMessages(m=>m.author.id === message.author.id, {max: 1, time: 60000, errors: ["TIME"]}).then(collected=>{
                            let Questions = apply_for_here.get(message.guild.id, "QUESTIONS")
                            let obj;
                            switch(Questions.length+1){
                                case 1: obj =  {"1": collected.first().content};break;
                                case 2: obj =  {"2": collected.first().content};break;
                                case 3: obj =  {"3": collected.first().content};break;
                                case 4: obj =  {"4": collected.first().content};break;
                                case 5: obj =  {"5": collected.first().content};break;
                                case 6: obj =  {"6": collected.first().content};break;
                                case 7: obj =  {"7": collected.first().content};break;
                                case 8: obj =  {"8": collected.first().content};break;
                                case 9: obj =  {"9": collected.first().content};break;
                                case 10: obj =  {"10": collected.first().content};break;
                                case 11: obj =  {"11": collected.first().content};break;
                                case 12: obj =  {"12": collected.first().content};break;
                                case 13: obj =  {"13": collected.first().content};break;
                                case 14: obj =  {"14": collected.first().content};break;
                                case 15: obj =  {"15": collected.first().content};break;
                                case 16: obj =  {"16": collected.first().content};break;
                                case 17: obj =  {"17": collected.first().content};break;
                                case 18: obj =  {"18": collected.first().content};break;
                                case 19: obj =  {"19": collected.first().content};break;
                                case 20: obj =  {"20": collected.first().content};break;
                                case 21: obj =  {"21": collected.first().content};break;
                                case 22: obj =  {"22": collected.first().content};break;
                                case 23: obj =  {"23": collected.first().content};break;
                                case 24: obj =  {"24": collected.first().content};break;
                            }
                            apply_for_here.push(message.guild.id, obj, "QUESTIONS")
                            message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("GREEN").setAuthor("Successfully added your Question!", message.author.displayAvatarURL({dynamic:true})))
                            Questions = apply_for_here.get(message.guild.id, "QUESTIONS");
                            let embed = new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
                            .setColor("#fcfc03")
                            .setTitle("NEW Questions") //Tomato#6966
                            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}))
                            .setTimestamp()

                            for(let i = 0; i < Questions.length; i++){
                                try{
                                    embed.addField("**"+Object.keys(Questions[i])+".** ",Object.values(Questions[i]))
                                }catch (e){
                                console.log(e)
                                }
                            }
                            message.channel.send(embed);
                        }).catch(error=>{

                            return message.reply("SORRY BUT YOUR TIME RAN OUT!")
                        })
                    })
                }
                break;
                default:
                    return message.reply(new Discord.MessageEmbed().setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL()).setColor("RED").setAuthor("Please use a valid parameter!", message.author.displayAvatarURL({dynamic:true})).setDescription("`acceptmsg` / `acceptrole` / `denymsg` / `ticketmsg` / `emojione` / `emojitwo` / `emojithree` / `emojifour` / `emojifive` / `temprole` / `editquestion` / `addquestion`"))
                break;
            }
          }catch (e){
            console.log(e)
            message.channel.send(new Discord.MessageEmbed()
              .setColor("RED")
              .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
              .setTitle("ERROR | ERROR")
              .setDescription("```" + e.message + "```")
            ).then(msg=>msg.delete({timeout:7500}))
          }
        }
        else {
            return message.reply(new Discord.MessageEmbed()
              .setColor("RED")
              .setTitle("UNKNOWN CMD")
              .setDescription("Sorry, i don't know this cmd! Try; `e!help`")
              .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
            )
        }
    }catch (e){
      console.log(e)
      message.channel.send(new Discord.MessageEmbed()
        .setColor("RED")
        .setFooter(client.user.username + " | powered by: milrato.eu", client.user.displayAvatarURL())
        .setTitle("ERROR | ERROR")
        .setDescription("```" + e.message + "```")
      ).then(msg=>msg.delete({timeout:7500}))
    }
  });

  /** ////////////////////////////////////////// *
   * INFO MSG ON INVITE
   *  ////////////////////////////////////////// *
   */
  client.on("guildCreate", guild=>{
      let channel = guild.channels.cache.find(
          channel =>
            channel.type === "text" &&
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setTitle("These are all cmds!")
          .setURL("https://youtu.be/X2yqNtd3COE")
          .setDescription(`PREFIX: \`e!\` | [Click here - Tutorial Video](https://youtu.be/X2yqNtd3COE)`)
          .addField(`\`help\``, "Shows all available Commands!",true)
          .addField(`\`add\``, "> *[Invite](https://discord.com/api/oauth2/authorize?client_id=806086994031411221&permissions=8&scope=bot%20applications.commands) the Bot!*",true)
          .addField(`\`support\``, "> *Sends you a Link for the [SUPPORT SERVER](https://discord.gg/wvCp7q88G3) of the Bot!*",true)
          .addField(`\`ping\``, "> *Shows the ping of the Bot!*",true)
          .addField(`\`uptime\``, "> *Shows the uptime of the Bot!*",true)
          .addField(`\`info\``, "> *Shows Information & Stats of the Bot*",true)
          .addField(`\`tutorial\``, "> *Gives you a Link to the [Tutorial Video](https://youtu.be/X2yqNtd3COE)*",true)
          .addField(`\`source\``, "> *Gives you a Link to the [Source Code on Github](https://youtu.be/X2yqNtd3COE)*",true)

          .addField("\u200b","\u200b")
          .addField(`\`setup\` --> Follow steps`, "> *Set ups the Application System, maximum of 24 Questions!*")
          .addField(`\`editsetup <"acceptmsg"/"denymsg"/"question"/"role"/"addquestion"> [PARAMETER]\``, "> *Allows you to adjust the accept / deny msgs, or edit each Question. \n If needed you can add another Question / change the ROLE!*")
          .addField("\u200b","\u200b")
          .addField(`\`setup2\``, "> *Same as Setup 1 just your second Application System!*")
          .addField(`\`editsetup2\``, "> *Same as Setup 1(0) just your second Application System!*")
          .addField(`\`setup3\``, "> *Same as Setup 1(0) just your third Application System!*")
          .addField(`\`editsetup3\``, "> *Same as Setup 1(0) just your third Application System!*")

          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
        channel.send(new Discord.MessageEmbed()
          .setColor("#fcfc03")
          .setTitle("Thanks for Inviting me!")
          .setDescription(`To get started, simply type: \`e!setup\` and follow the steps!`)
          .setFooter(`${client.user.username} | powered by: milrato.eu`, client.user.displayAvatarURL())
        )
        channel.send("**Here is a TUTORIAL VIDEO:**\nhttps://youtu.be/X2yqNtd3COE")
  })

}

/** ////////////////////////////////////////// *
 * FUNCTION FOR ENSURING THE databases
 * ////////////////////////////////////////// *
 */
function databasing(client, guildid){
    client.apply.ensure(guildid, {
       "channel_id": "",

       "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

       "QUESTIONS": [{"1":"DEFAULT"}],

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

      "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

      "QUESTIONS": [{"1":"DEFAULT"}],

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

   "f_channel_id": "", //changequestions --> which one (lists everyone with index) --> 4. --> Question

   "QUESTIONS": [{"1":"DEFAULT"}],

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
  try{
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  }catch (e){

  }
}
