//import shardingmanager
const { ShardingManager } = require("discord.js");
//import config file
const config = require("./config.json");
//load the shards
const shards = new ShardingManager("./index.js", {
  token: config.token,
  totalShards: "auto",
});
//log if a shard created
shards.on("shardCreate", shard => console.log(` || <==> || [${String(new Date).split(" ", 5).join(" ")}] || <==> || Launched Shard #${shard.id} || <==> ||`))
//spawn the shards
shards.spawn(shards.totalShards, 10000);
