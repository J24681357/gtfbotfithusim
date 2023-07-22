const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "restart",
  title: "GTF Bot Restarter",
  license: "N", 
  level: 0,
  channels: ["gtf-mode", "testing"],

  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: false,
      footer: "**❓ The red point would be the starting point.**",
      image: [],
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (userdata["id"] != "237450759233339393") {
        gtf_EMBED.alert({ name: "❌ Error", description: "This command is for adminstrators only.", embed: embed, seconds: 0 }, msg, userdata);
        return
    }
    var results = " ";
    results = emote.loading + " __**The GT Fitness bot is restarting...**__";
    embed.setDescription(results);
    gtf_DISCORD.send(msg, {embeds:[embed]}, next)
    
    function next(msg) {
      process.exit(1);
    }
  },
};
