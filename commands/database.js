var dir = "../";
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "database",
  title: "GT Fitness: Database",
  license: "N",
  level: 0,
  channels: ["testing"],
//"testing",  "gtf-mode"
  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(
      embed,
      results,
      query,
      {
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
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (!isNaN(query["options"])) {
    query["options"] = ["engineswap", "tracks", "exp", "license"][query["options"]-1]
    }

    if (query["options"] == "list") {
      delete query["number"];
      embed.setTitle("__**GTF Database**__");
      results = ["Engine Swap Catalog", "Tracks","GTF Levels/Experience", "Licenses"];
      var list = results;
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an option from the list above using the numbers associated with the buttons.\nYou can search for database about the GTF game here.**";
      }
      pageargs["selector"] = "options";
      pageargs["query"] = query;
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }
    
    if (query["options"] == "engineswap") {
      var engines = gtf_PARTS.find({ type: "Car Engine", sort: "name"});
      var number = query["number"];
      embed.setTitle(gtf_EMOTE.engine + " __**Engine Swap Catalog (" + engines.length + " Options)**__");
      if (gtf_MATH.betweenInt(number, 1, engines.length)) {
        var engine = engines[number-1]
        var models = engine["models"]
        var list = gtf_CARS.list("all")
        var compat = []
        for (var i = 0; i < Object.keys(list).length; i++) {
        var make = list[Object.keys(list)[i]]
          for (var j = 0; j < make.length; j++) {
            var name = make[j]["name"] + " " + make[j]["year"]
            for (var k = 0; k < models.length; k++) {
               if (name.includes(" " + models[k]) && make[j]["type"] == "Production") {
              compat.push(name)
             }
            }
          }
      }
         embed.setTitle(gtf_EMOTE.engine + " __**" + engine["name"] + " (" + compat.length + " Cars)**__");
      pageargs["numbers"] = false
      pageargs["list"]  = compat
      pageargs["list"].unshift("__Compatible Cars__")
      pageargs["selector"] = ""
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
        return;
      }
      delete query["number"];
      pageargs["list"] = engines.map(x => x["name"]);
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }

    if (query["options"] == "track" || query["options"] == "tracks") {
      var tracks = gtf_TRACKS.list("names");
      var number = query["number"];
      embed.setTitle(gtf_EMOTE.tracklogo + " __**Track ID Database (" + tracks.length + " Tracks)**__");
      if (gtf_MATH.betweenInt(number, 1, tracks.length)) {
        var track = gtf_TRACKS.find({ name: [tracks[number - 1]] })[0];
        results =
          "__**" +
          track["name"] +
          "**__" +
          "\n" +
          "**ID:** " +
          number +
          "\n" +
          
          "**Length:** " + track["length"] + " km | " + gtf_MATH.round( (track["length"] * 0.62137119), 2) + " mi" +
          "\n" +
          "**Version:** " +
          track["version"] +
          "\n" +
          "**Corners:** " +
          track["corners"];
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is the track information for this ID.**";
        }
        embed.setDescription(results + pageargs["footer"]);
        gtf_DISCORD.send(msg, { embeds: [embed] });
        return;
      }
      delete query["number"];
      pageargs["list"] = tracks;
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ This is the list of all of tracks in GTF, ranging from Gran Turismo 1 to Gran Turismo 7 tracks. Each track has an ID associated with it.**";
      }
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }
    if (query["options"] == "car") {
    }
    if (query["options"] == "exp") {
      var explevels = gtf_LISTS.gtfexp;
      var number = query["number"];
      embed.setTitle(gtf_EMOTE.exp + " __**GTF Level/EXP Database (" + Object.keys(explevels).length + " Levels)**__");

      if (gtf_MATH.betweenInt(number, 1, Object.keys(explevels).length)) {
        number = number - 1;
        var levelchosen = explevels[(number + 1).toString()];

        results = "__**Level " + (number + 1).toString() + "**__" + "\n" + "**Experience Required: " + gtf_MATH.numFormat(levelchosen["exp"]) + gtf_EMOTE.exp + "**\n" + "**__Rewards__** " + "`" + levelchosen["rewards"].length + "`" + "\n" + levelchosen["rewards"].join("\r");
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is the requirements and rewards for this experience level.**";
        }
        embed.setDescription(results + pageargs["footer"]);
        gtf_DISCORD.send(msg, { embeds: [embed] });
        return;
      }
      delete query["number"];
      pageargs["numbers"] = false;
      var list = Object.keys(explevels).map(function (level) {
        return "__**Lv. " + level + "**__ **" + gtf_MATH.numFormat(explevels[level]["exp"]) + gtf_EMOTE.exp + "**" + "\r" + explevels[level]["rewards"].slice(0,3).join("\r");
      });

      pageargs["list"] = list;
      pageargs["rows"] = 5;
            if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an EXP level associated with the EXP level list using the buttons." + "\n" + "For more information, you can select a level or input the level number using [number].**";
      }
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }

    if (query["options"] == "license" || query["options"] == "licenses") {
      var licenses = gtf_LISTS.gtflicenses
      var number = query["number"];
      embed.setTitle("💳" + " __**GTF License Database (" + Object.keys(licenses).length + " Licenses)**__");

      if (gtf_MATH.betweenInt(number, 1, Object.keys(licenses).length)) {
        number = number - 1;
        var license = licenses[(number + 1).toString()];

        results = "__**Level " + (number + 1).toString() + "**__" + "\n" + "**Experience Required: " + gtf_MATH.numFormat(levelchosen["exp"]) + gtf_EMOTE.exp + "**\n" + "**__Rewards__** " + "\n" + levelchosen["rewards"].join("\r");
        if (userdata["settings"]["TIPS"] == 0) {
          pageargs["footer"] = "\n\n" + "**❓ This is the requirements and rewards for this experience level.**";
        }
        embed.setDescription(results + pageargs["footer"]);
        gtf_DISCORD.send(msg, { embeds: [embed] });
        return;
      }
      delete query["number"];
      pageargs["numbers"] = false;
      var list = Object.keys(licenses).map(function (level) {
        return "__**License " + level.toUpperCase() + "**__ `" + licenses[level]["rewards"].length + " Rewards`" + "\r" + licenses[level]["rewards"].slice(0,3).join("\r");
      });

      pageargs["list"] = list;
      pageargs["rows"] = 5;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a license associated with the list using the buttons." + "\n" + "For more information, you can select a license in the menu.**";
      }
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }

    gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Invalid arguments.", embed: "", seconds: 3 }, msg, userdata);
    return;
  },
};
