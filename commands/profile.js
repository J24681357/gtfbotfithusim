const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "profile",
  title: "My Profile",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
        text: "",
        list: "",
        listsec: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 4,
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

    var expbar = gtf_EXP.createexpbar(userdata)
    var nextlevel = (gtf_STATS.level(userdata) + 1) >= 50 ? 50 : (gtf_STATS.level(userdata) + 1)

    if (query["options"] == "rewards") {
      
    }
  
    embed.setTitle("👤 " + "__My Profile__");
    results =
      "__**License:**__ " + gtf_TOOLS.toEmoji(userdata["license"]+"license") + "\n" +
      "__**Current Credits:**__ " +
      "**" +
gtf_MATH.numFormat(gtf_STATS.credits(userdata))+
      gtf_EMOTE.credits +
      "**" + "\n" +
      "__**Experience Points:**__ " +
      "**" +
      gtf_MATH.numFormat(gtf_STATS.exp(userdata)) +
      gtf_EMOTE.exp +
      "**\n" +
      "Lv." +
      gtf_STATS.level(userdata) +
      " " +
      expbar.join("") +
      " " +
      "Lv." + nextlevel +
      "\n" +
      "__**Total Distance Driven:**__ " +
      "**" + gtf_STATS.totalmileageuser(userdata) +
      " " + gtf_STATS.mileageunits(userdata) + "** " + 
      gtf_EMOTE.mileage +
      "\n" +
     "__**Total Play Time:**__ " + gtf_STATS.totalplaytime(userdata) +
      "\n\n" +
      "**Total Races:** " + userdata["stats"]["numraces"] + "\n" + 
      "**Number of Wins:** " + userdata["stats"]["numwins"]

    embed.setDescription(results);    
    next("")
      //gtf_STATS.loadavatarimage(embed, userdata, next)
    
    
  function next(image) {
    if (image.length == 0) {
      var attachment = []
embed.setThumbnail(msg.user.displayAvatarURL({format: 'jpg', size: 1024}));
    } else {
      var attachment = [image]
      embed.setThumbnail("attachment://image.png")
    }
     embed.setFields([{name:gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata)}]);
    var emojilist = [
  { emoji: "👤", 
  emoji_name: "👤", 
  name: 'Profile', 
  extra: "",
  button_id: 0 },
  { emoji: "🚘", 
  emoji_name: "🚘", 
  name: 'Garage', 
  extra: "",
  button_id: 1 },
      { emoji: "🏆", 
  emoji_name: "🏆", 
  name: 'Career Progress', 
  extra: "",
  button_id: 2 },
    { emoji: "💳", 
  emoji_name: "💳", 
  name: 'License Progress', 
  extra: "",
  button_id: 3 }]
  var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);
   
    gtf_DISCORD.send(msg, {embeds:[embed], components: buttons, files: attachment}, profilefunc)
    
    function profilefunc(msg) {
      function profile() {
        embed.setTitle("👤 " + "__My Profile__");
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      function garageprofile() {
        embed.setTitle("👤 " + "__My Profile__");
        var favcar = userdata["garage"].sort((x, y) => parseFloat(y["totalmileage"]) - parseFloat(x["totalmileage"]))[0]
        var garagevalue = 0
        userdata["garage"].forEach(car => {
          var value = gtf_PERF.perf(car, "GARAGE")["value"]
    garagevalue += value;
})
        var numparts = userdata["stats"]["numwins"]
        var results = "**Garage Count:** " +
      gtf_STATS.garage(userdata).length +
      " Cars" + "\n" + 
      "**Favorite Car:** " + favcar["name"] + " " + "**" + gtf_STATS.mileagecaruser(favcar, userdata) + gtf_STATS.mileageunits(userdata) + "**" + gtf_EMOTE.mileage + "\n" + 
        "**Total Garage Value:** " + "**" + gtf_MATH.numFormat(garagevalue) + "**" + gtf_EMOTE.credits + "\n" + 
        "**Number of Parts Purchased:** " + gtf_MATH.numFormat(numparts)
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      function careerprofile() {
        embed.setTitle("__Career Progress__");
        var list1 = [
          ["__B Level__", gtf_CAREERRACES.find({types: ["b"] })],
          ["__A Level__", gtf_CAREERRACES.find({types: ["a"] })],
          ["__IC Level__", gtf_CAREERRACES.find({types: ["ic"] })],
          ["__IB Level__", gtf_CAREERRACES.find({types: ["ib"] })],
          ["__IA Level__",gtf_CAREERRACES.find({types: ["ia"] })],
          ["__S Level__", gtf_CAREERRACES.find({types: ["s"] })],
          ["__Kart__", gtf_CAREERRACES.find({types: ["kart"] })],
          ["__Rally__", gtf_CAREERRACES.find({types: ["rally"] })],  ["__Formula__", gtf_CAREERRACES.find({types: ["formula"] })]
        ];
        
        results2 = "";
        for (var level = 0; level < list1.length; level++) {
          var results2 = results2 + list1[level][0] + "\n";
          var certainraces = list1[level][1];
          var array = Object.keys(certainraces);
          for (var i = 0; i < array.length; i++) {
            var event = certainraces[array[i]]
            results2 = results2 + event["eventid"] + " " + gtf_STATS.raceeventstatus(event, userdata) + " ";
          }
          results2 = results2 + "\n";
        }

        embed.setDescription(results2);
        msg.edit({embeds:[embed], components: buttons})
      }
      function licenseprofile() {
        embed.setTitle("__License Progress__");
        var list1 = [
          ["__B License__", gtf_CAREERRACES.find({types: ["LICENSEB"] })],
          ["__A License__", gtf_CAREERRACES.find({types: ["LICENSEA"] })],
          ["__IC License__", gtf_CAREERRACES.find({types: ["LICENSEIC"] })],
          ["__IB License__", gtf_CAREERRACES.find({types: ["LICENSEIB"] })],
          ["__IA License__",gtf_CAREERRACES.find({types: ["LICENSEIA"] })],
          ["__S License__", gtf_CAREERRACES.find({types: ["LICENSES"] })]
        ];
        
        results2 = "";
        for (var level = 0; level < list1.length; level++) {
          var results2 = results2 + list1[level][0] + "\n";
          var certainraces = list1[level][1];
          var array = Object.keys(certainraces);
          for (var i = 0; i < array.length; i++) {
            results2 = results2 + certainraces[array[i]]["eventid"].replace("LICENSE", "") + " " + gtf_STATS.eventstatus(certainraces[array[i]]["eventid"], userdata) + " ";
          }
          results2 = results2 + "\n";
        }

        embed.setDescription(results2);
        msg.edit({embeds:[embed], components: buttons})
      }
      var functionlist = [profile, garageprofile, careerprofile, licenseprofile]
      
       gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    }
    return;
  }
  }
  
};
