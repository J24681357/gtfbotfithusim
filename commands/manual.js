var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "manual",
  cooldown: 3,
  license: "N",
  level: 0,
  channels: ["testing", "gtf-mode","gtf-demo"],

  delete: false,
  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 1,
      page: 0,
      numbers: false,
      buttons: true,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    /* Setup */
    embed.setTitle("📝 GTF Game Manual");
    embed.setDescription("**❓ Click the link button below to access the manual.**")
    var emojilist = [
  { emoji: gtf_EMOTE.gtlogoblue,
  emoji_name: "gtlogoblue",
  name: 'Manual',
  extra: "https://j24681357.github.io/gtfbot2unleahsed/",
  button_id: 0 }
]
    
  var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);
   
    gtf_DISCORD.send(msg, {embeds:[embed], components: buttons})
    return
    }
};
