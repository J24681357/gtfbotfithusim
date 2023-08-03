const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "setup",
  title: "🛠 Car Setup",
  license: "A", 
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-test-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
      text: "",
      list: "",
      listsec: ",",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 7,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    var gtfcar = gtf_STATS.currentcar(userdata);
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]})
    embed.setThumbnail(ocar["image"][gtf_STATS.carimage(gtfcar)])

    embed.setTitle(gtf_EMOTE.gtauto + " __Car Setup__");

    var selectedtype = false;
    var list = [];

    var engine = gtf_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" });
    var transmission = gtf_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" });
    var turbo = gtf_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" });
    var suspension = gtf_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" });
    var aerokit = gtf_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" });

    /*if (engine.length != 0) {
      list.push("__**Engine**__ - !tuning [engine|eng|e]")
    }*/
    if (transmission.length != 0) {
      list.push("__**Transmission**__");
    }
    if (suspension.length != 0) {
      list.push("__**Suspension**__");
    }
    if (aerokit.length != 0) {
      list.push("__**Aerodynamics**__");
    }
    /*
    if (turbo.length != 0) {
      list.push("__**Turbo**__ - !tuning [turbo|tu]")
    }*/

    if (list.length == 0) {
      gtf_EMBED.alert({ name: "❌ No Tunable Parts", description: "There are no custom parts to tune for the **" + gtfcar["name"] + "**.", embed: "", seconds: 0 }, msg, userdata);
      return;
    }
    var part = [];

  
    if (query["type"] == "list") {
    delete query["number"]
      pageargs["list"] = list;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["selector"] = "type";
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    } 

      if (query["type"] == "transmission" || query["type"] == "Transmission" || query["type"] == "trans" || query["type"] == "tr") {
          part = transmission[0];
    }

    if (query["type"] == "suspension" || query["type"] == "Suspension" || query["type"] == "susp" || query["type"] == "su") {
          part = suspension[0];
    }

    if (query["type"] == "Aero Kit" || query["type"] == "Aero Kits" || query["type"] == "Aero" || query["type"] == "aero") {
          part = aerokit[0];
    }

      embed.setTitle(gtf_EMOTE.gtauto + " __Car Setup (" + part["type"] + ")__");

      var select = 0;
      var reset = true;
      var index = 0;

      embed.setFields([{name:gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata)}]);

      gtf_STATS.addcount(userdata);
      var emojilist = [
        { emoji: gtf_EMOTE.yes, emoji_name: "Yes", name: "", extra: "", button_id: 0 },
        {
          emoji: gtf_EMOTE.leftarrow,
          emoji_name: "leftarrow",
          name: "",
          extra: "",
          button_id: 1,
        },
        {
          emoji: gtf_EMOTE.rightarrow,
          emoji_name: "rightarrow",
          name: "",
          extra: "",
          button_id: 2,
        },
        {
          emoji: gtf_EMOTE.uparrow,
          emoji_name: "uparrow",
          name: "",
          extra: "",
          button_id: 3,
        },
        {
          emoji: gtf_EMOTE.downarrow,
          emoji_name: "downarrow",
          name: "",
          extra: "",
          button_id: 4,
        }, 
        {
          emoji: "🔄",
          emoji_name: "🔄",
          name: "Reset",
          extra: "",
          button_id: 5,
        }
      ];
      var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);

  if (part.length == 0) {
      gtf_EMBED.alert({ name: "❌ Default Part", description: "This default part can not be tuned on **" + gtfcar["name"] + "**.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }

      var list = gtf_PARTS.tuninglist(part, gtfcar, embed, msg, userdata);
    list[list.length - 1] = part["type"] == "Aero Kits" ? list[list.length - 1] + "/n**Calculation: " + gtf_PARTS.previewpart(part, gtfcar, "GARAGE")["fpp"] + gtf_EMOTE.fpp + "**" : list[list.length - 1];
      //list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);

      gtf_DISCORD.send(msg, {embeds: [embed], components: buttons }, tuningf)
      
      function tuningf(msg) {
        function back() {
          gtfcar["perf"][part["type"].toLowerCase()]["tuning"][select]--;
          var list = gtf_PARTS.tuninglist(part, gtfcar, embed, msg, userdata);
          part["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"]

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select]
list[list.length - 1] = list[list.length - 1] + "/n**Calculation: " + gtf_PARTS.previewpart(part, gtfcar, "GARAGE")["fpp"] + gtf_EMOTE.fpp + "**";
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }
        function selectoption() {
          gtf_STATS.currentcar(userdata)["perf"][part["type"].toLowerCase()]["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"];
          gtf_STATS.updatefpp(gtf_STATS.currentcar(userdata), userdata)
          require(__filename.split(".")[0]).execute(msg, {type:"list", extra: "**" + part["type"] + "** settings saved for **" + gtfcar["name"] + "**."}, userdata);
          gtf_STATS.save(userdata)
        }

        function next() {
          gtfcar["perf"][part["type"].toLowerCase()]["tuning"][select]++;
          var list = gtf_PARTS.tuninglist(part, gtfcar, embed, msg, userdata);
          part["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"]

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select] 
   list[list.length - 1] = list[list.length - 1] + "/n**Calculation: " + gtf_PARTS.previewpart(part, gtfcar, "GARAGE")["fpp"] + gtf_EMOTE.fpp + "**";
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function up() {
          var list = gtf_PARTS.tuninglist(part, gtfcar, embed, msg, userdata);

          select--;
          if (select <= -1) {
            select = list.length - 1;
          }

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function down() {
          var index = 0;

          var list = gtf_PARTS.tuninglist(part, gtfcar, embed, msg, userdata);
          select++;
          if (select >= list.length) {
            select = 0;
          }

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function reset() {
          var index = 0;
          select = 0;

          gtfcar["perf"][part["type"].toLowerCase()]["tuning"] = gtfcar["perf"][part["type"].toLowerCase()]["tuning"].map(function(x) {
            if (part["type"].toLowerCase() == "aero kits") {
              return 3
            } else {
            return 0
            }
          })

          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        var functionlist = [selectoption, back, next, up, down, reset];
        gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata);
      };

      return;
  },
};
