const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder, } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "career",
  title: "Career Mode",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
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

    var mode = "CAREER";
    if (query["options"] == "c" || parseInt(query["options"]) == 1) {
      query["options"] = "C";
    }
    if (query["options"] == "b" || parseInt(query["options"]) == 2) {
      query["options"] = "B";
    }
    if (query["options"] == "a" || parseInt(query["options"]) == 3) {
      query["options"] = "A";
    }
    if (query["options"] == "ic" || parseInt(query["options"]) == 4) {
      query["options"] = "IC";
    }
    if (query["options"] == "ib" || parseInt(query["options"]) == 5) {
      query["options"] = "IB";
    }
    if (query["options"] == "ia" || parseInt(query["options"]) == 6) {
      query["options"] = "IA";
    }
    if (query["options"] == "s" || parseInt(query["options"]) == 7) {
      query["options"] = "S";
    }

    if (query["options"] == "kart" || parseInt(query["options"]) == 8) {
      query["options"] = "KART";
      if (!gtf_EXP.checklevel(4, embed, msg, userdata)) {
        return;
      }
    }
    
    if (query["options"] == "rally" || parseInt(query["options"]) == 9) {
      query["options"] = "RALLY";
      if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
        return;
      }
    }



    
    if (query["options"] == "formula" || parseInt(query["options"]) == 10) {
      query["options"] = "FORMULA";
      if (!gtf_EXP.checklevel(30, embed, msg, userdata)) {
        return;
      }
    }
/*
    if (query["options"] == "gtacademy" || parseInt(query["options"]) == 11) {
      query["options"] = "GTACADEMY";
      if (!gtf_EXP.checklevel(20, embed, msg, userdata)) {
        return;
      }
    }
*/
    if (userdata["id"] == "237450759233339393") {
      query["options"] = "GTACADEMY"
    }
    
    pageargs["image"].push( "https://github.com/J24681357/gtfbot2unleahsed/raw/master/images/career/" + query["options"].toUpperCase() + "_level.png")
/*
    if (userdata["id"] == "237450759233339393") {
      query["options"] = "TESTING";
    }
*/

    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🏁" + " __Career Mode__");
      results =
        "__**C Level**__ " +
        "\n" +
        "__**B Level**__ " + gtf_EMOTE.blicense +
        "\n" +
        "__**A Level**__ " + gtf_EMOTE.alicense +
        "\n" +
        "__**IC Level**__ " + gtf_EMOTE.iclicense +
        "\n" +
        "__**IB Level**__ " + gtf_EMOTE.iblicense +
        "\n" +
        "__**IA Level**__ " + gtf_EMOTE.ialicense +
        "\n" +
        "__**S Level**__ " + gtf_EMOTE.slicense
        + "/n/n" +
        "__Special Events__" + "\n" +
        "__**Kart**__ " +  gtf_EMOTE.exp +
        " `Lv.4`" + "\n" +
        "__**Rally**__ " +  gtf_EMOTE.iclicense + "\n" +
        "__**Formula**__ " +  gtf_EMOTE.exp +
        " `Lv.30`"
        var list = results.split("\n")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a level from the list above using the numbers associated with the buttons.\n`Lv.XX` represents that the driver level that is required.**";
      }
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return
    }
    if (query["options"] == "KART" || query["options"] == "RALLY" || query["options"] == "FORMULA" || query["options"] == "GTACADEMY") {
    } else {
  if (!gtf_STATS.checklicense(query["options"], embed, msg, userdata)) {
        return;
      }
    }
      var races = [...gtf_CAREERRACES.find({types: [query["options"]] })]
    var ids = Object.keys(races);
    if (ids.length == 0) {
      gtf_EMBED.alert({ name: "❌ No Events", description: "There are no events in this level.", embed: "", seconds: 3 }, msg, userdata);
      return
    }

    //list of x races
    if (typeof query["number"] === 'undefined') {
      results = []
        for (var t = 0; t < ids.length; t++) {
          var raceevent = races[ids[t]];
          raceevent["eventlength"] = raceevent["tracks"].length
          var regulations = raceevent["regulations"]

          var rmake = regulations["makes"].length != 0 ? regulations["makes"].join(", ") + " | ": ""
          var rcountry = regulations["countries"].length != 0 ? regulations["countries"].join(", ") + " | " : ""
          var rmodel =  regulations["models"].length != 0 ?  regulations["models"].join(", ") + " | ": ""
          var drivetrain =  regulations["drivetrains"].length != 0 ?  regulations["drivetrains"].join(", ") + " | " : ""
          var engine = regulations["engines"].length != 0 ? regulations["engines"].join(", ") : ""
          var bop = raceevent["bop"] ? (" " + gtf_EMOTE.bop) : ""
          var weather = (raceevent["weatherchange"] >= 1) ? (" " + gtf_EMOTE.weather) : ""
          var championship = raceevent["championship"] ? ("🏆 ") : ""
          var types = regulations["types"].length != 0 ? regulations["types"].join(", ") : ""

          var any = [rcountry,rmake,rmodel,drivetrain,engine,bop].join("").length != 0 ? "" : "None"
          var tires = regulations["tires"]


          if (raceevent["type"] == "TIMETRIAL") {
            results.push(
            "⌛" +
            "__**" +
            raceevent["title"] + "**__" + " " +
            gtf_STATS.eventstatus(query["options"] + "-" + (t + 1), userdata) +
            "/n" +
            "**Track:** " + raceevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + raceevent["car"]
          )
          } else {
            var weight = regulations["upperweight"] == 9999 ? "---" :gtf_MATH.numFormat(gtf_STATS.weightuser(regulations["upperweight"], userdata))
        var fppreg = !raceevent["bop"] 
 ? regulations["fpplimit"].toString().replace("9999", "---") + gtf_EMOTE.fpp : (regulations["lowerfpp"] == 0 ? "---": regulations["lowerfpp"]) + gtf_EMOTE.fpp + " - " + regulations["fpplimit"].toString().replace("9999", "---") + gtf_EMOTE.fpp
          results.push(
            championship +
            "__**" +
            raceevent["title"] +
            " - " +
            raceevent["tracks"].length +
            " Races**__ " +
            gtf_STATS.eventstatus(query["options"] + "-" + (t + 1), userdata) +
            "/n" +
            "**" +
            fppreg + " | " +
            regulations["upperpower"].toString().replace("9999", "---") + " hp" + " " + weight + " " + gtf_STATS.weightunits(userdata) + " " +
            gtf_EMOTE.tire  + tires + weather +
            "**/n" +
            (raceevent["car"] != "GARAGE" ?
            "**Loaner Car:** " + raceevent["car"] : "**Regulations:** " +
           rcountry + rmake +
            rmodel + drivetrain + engine + bop + any +
            "/n" + "**Types:** " + types)
          )
        }
        }
        embed.setTitle("🏁 __Career Mode - " + query["options"].toUpperCase() + " (" + ids.length + " Events)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an event from the list above using the numbers associated with the buttons.\nEach event has car regulations that your current car must meet before entry, so change your car accordingly.**";
      }
      if (query['options'] == "KART") {
        pageargs["footer"] = gtf_EMOTE.igorf + " **" + gtf_ANNOUNCER.say({name1:"intro", name2: "igorf"}) + "**"
      }
      if (query['options'] == "FORMULA") {
        pageargs["footer"] = gtf_EMOTE.lewish + " **" + gtf_ANNOUNCER.say({name1:"intro", name2: "lewish"}) + "**"
      }
        pageargs["rows"] = 3
        pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
        gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      /*
        setTimeout(function() {
          var t = 0
            for (t; t < ids.length; t++) {
          raceevent = races[ids[t]];
          var achieve = gtf_STATS.isracescomplete(query["options"].toLowerCase() + "-" + (t + 1), raceevent["tracks"].length, 1, userdata);
          if (achieve) {
            gtf_STATS.eventcomplete(query["options"].toLowerCase() + "-" + (t + 1), userdata);
            gtf_STATS.gift(gtf_EMOTE.goldmedal + " Congrats! Completed " + raceevent["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, raceevent["prize"], embed, msg, userdata);
          }
            }
          }, 2000)
      */
        return;
    }
    //

    var number = parseInt(query["number"])
      if (!gtf_MATH.betweenInt(number, 1, Object.keys(races).length) && !isNaN(number)) {
          gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
          return
      }
      embed.setFields([{name:gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata)}]);


    var event = {...races[Object.keys(races)[number - 1]]}
      gtf_RACE.careerraceselect(event, query, gorace, embed, msg, userdata);

      function gorace(event) {
        var raceprep = {
          mode: "CAREER",
          modearg: "",
          track: event["track"],
          car: event["car"],
          racesettings: event,
          other: {},
        };
      var gtfcar = gtf_STATS.currentcar(userdata)
         gtf_RACE.raceprep(raceprep, gtfcar, embed, msg, userdata);
      }
      }
}
