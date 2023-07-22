const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "replay",
  title: "Replay Theater",
  license: "N", 
  level: 0,
  channels: ["gtf-mode", "testing", "gtf-demo"],

  availinmaint: false,
  requirecar: false,
  usedduringrace: false,
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
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    var replays = gtf_STATS.replays(userdata)
      if (replays.length == 0) {
        gtf_EMBED.alert({ name: "❌ No Replays", description: "There are no replays saved.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }

      if (query["options"] == "list" || query["options"] == "info") {
        delete query["number"]
        
      embed.setTitle("🎥 __Replay Theater (" + replays.length + " / " + gtf_GTF.replaylimit + " Replays)__");

      var list = replays.map(function (replay, index) {
          return "`🕛ID:"+ (index + 1) + "` " + replay["title"] + " `" + replay["date"] + "`";
        });
        pageargs["list"] = list;
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "**❓ Choose a number that corresponds to the replays above. Replays can be saved from any session (Arcade races, career races, time trials, etc).**"
        }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
        pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
        pageargs["selector"] = "number"
        pageargs["query"] = query
        gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
        return

      }
      if (query["options"] == "clear") {
        var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);

        embed.setDescription("⚠ Clear all of your saved replays? This is permanent.");
        embed.setColor(0xffff00);
        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, replayfunc)
        
        function replayfunc(msg){
          function clearreplay() {
            gtf_STATS.clearreplays(userdata);
            gtf_STATS.save(userdata)
            gtf_EMBED.alert({ name: "✅ Success", description: "Replay data cleared.", embed: embed, seconds: 3 }, msg, userdata);
          }
          var functionlist = [clearreplay]

          gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "delete") {
        var number = query["number"];
        if (!gtf_MATH.betweenInt(number, 1, replays.length + 1)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your replay theater.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = replays[number-1]["title"]
        embed.setDescription("⚠ Delete " + "`🕛ID:" + number + "` " + "**" + name + "**?");
          var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);

        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, replayfunc1)
        
        function replayfunc1(msg) {
          function deletereplay() {
            gtf_STATS.deletereplay(number-1, userdata);
            gtf_STATS.save(userdata)
             setTimeout(function() {require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Deleted " + "`🕛ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletereplay]
          gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "load") {
        var number = query["number"];
        if (!gtf_MATH.betweenInt(number, 1, replays.length + 1)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your replay theater.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var replaydetails = replays[number-1];
        
          embed.setTitle("🎥 __" + replaydetails["title"] + "__");
          embed.setDescription(replaydetails["results"] + "\n\n" + replaydetails["racedetails"]);
        var emojilist = [{
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Session Details',
    extra: "",
    button_id: 0
  },
  {
    emoji: gtf_EMOTE.cargrid,
    emoji_name: "gtfcargrid",
    name: 'Grid Results',
    extra: "",
    button_id: 1
  },
    { emoji: "🗑️", 
  emoji_name: "🗑️", 
  name: 'Remove Replay', 
  extra: "",
  button_id: 2 }
]
  var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);
  embed.setFooter({text: "Replay | " + replaydetails["date"]})

  gtf_DISCORD.send(msg, {embeds: [embed], components:buttons}, replayfunc2)
  function replayfunc2(msg) {

              function grid() {
                embed.setDescription(replaydetails["grid"]);
                msg.edit({ embeds: [embed], components:buttons});
              }
              function trackdetails() {
                embed.setDescription(replaydetails["results"] + "\n\n" + replaydetails["racedetails"]);
                msg.edit({ embeds: [embed], components:buttons});
              }
                 function deletereplay() {
         require(__filename.split(".")[0]).execute(msg, {options:"delete", number:parseInt(query["number"])}, userdata);
        }
              var functionlist = [trackdetails, grid, deletereplay]
            gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata)
            }
      }
    
  }
};
