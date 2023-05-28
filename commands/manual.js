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
    var list = [

      

 
     "__**Lobby Matchmaking - /lobby**__" + "\n" + 
      "1. In this GTF game, you can compete against other players via lobby matchmaking in Discord threads." + "\n" +
      "__How To Create A Lobby__: You can create a lobby by using the command **/lobby - Host Lobby**. A new lobby will be created as a Discord thread and lobby messages will be sent inside that thread." + "\n" + 
      "You can view the lobby infomation (players, cars, etc) by using the command **/lobby - Lobby Info**." + "\n" +
      "In the lobby information screen, you are able to start the race (host only), change the lobby settings, and view the grid of players." + "\n"+
    "⚠ Once you create a thread, most GTF commands will be limited (Ex. /career, /arcade, etc)." + "\n"+
    "⚠ Certain lobby settings require you to input a number or name **in the slash command menu**, not in the lobby setting menus itself (Ex. Room Name & FPP Limit)." + "\n" +
      "__How To Join A Lobby__: You can search & select for any available lobbies by using **/lobby - Open Lobby Menu**." + "\n" +
 "When the success prompt appears after you select a lobby, the GTF bot will ping you inside the thread (this is where the joined lobby is located." + "\n" +
      "⚠ Do not just join the thread, the GTF bot will not recognize you unless you do the above." + "\n" +
      "__How To Change Cars__: " + "You can change cars in a lobby via **/garage**." + "\n" +
      "Your garage will be filtered based on the current lobby settings. You can also change your tires here.",
      
      "__**Seasonal Events - /seasonal**__" + "\n" + 
    "1. Seasonal events work similarly to career events, but in a more randomized fashion and change daily." + "\n" +
    "2. In the menu, seasonal events are randomized every 3 days with different regulations and tracks, making the combinations practically fun." + "\n" +
    "3. Like career events, you are able to earn credits and prize cars in seasonal events." + "\n" + 
    "4. After 3 days, your progress in these events will reset and will not be saved.",
          
       
      "__**Daily Workouts - /daily**__" + "\n" + 
     
     "__**Gifts - /gifts**__" + "\n" +  
  
    ]



    if (!isNaN(query["options"])) {
      embed.setTitle("📝 __GTF Game Manual__");
      results = list[parseInt(query["options"]) - 1]
          if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "\n\n" + "**❓ Welcome to the GTF game manual! You can find some helpful guides about the game.**"
    }
    embed.setDescription(results + pageargs["footer"])
    gtf_STATS.addcount(userdata);
    gtf_DISCORD.send(msg, {embeds:[embed]})
    return
    }

    embed.setTitle("📝 GTF Game Manual");
    pageargs["list"] = list;
    if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "**❓ Welcome to the GTF game manual! You can find some helpful guides about the game.**"
    }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
    gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
    }
};
