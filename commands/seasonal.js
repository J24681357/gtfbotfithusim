const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder  } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "seasonal",
  title: "Seasonal Events",
  license: "A", 
  level: 0,
  channels: ["testing", "gtf-mode"],

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
    
    var date = new Date()
    var mod = gtf_DATETIME.getCurrentDay() % 3
    if (mod == 0 || typeof gtf_MAIN.bot["seasonaldate"] === 'undefined') {
      gtf_MAIN.bot["seasonaldate"] = gtf_DATETIME.getCurrentDay().toString() + date.getFullYear().toString()
    require("fs").writeFile("./jsonfiles/_botconfig.json", require("json-format")(gtf_MAIN.bot), function (err) {
    if (err) {
      console.log(err);
    }
  });
        
  }
    
    var mode = "CAREER";

      if (gtf_DATETIME.getCurrentDay().toString() + date.getFullYear().toString() != userdata["seasonalcheck"]) {
      userdata["seasonalcheck"] = gtf_DATETIME.getCurrentDay().toString() + date.getFullYear().toString()
      var careeraceskeys = Object.keys(userdata["careerraces"])
        for (var i = 0; i < careeraceskeys.length; i++) {
      if (careeraceskeys[i].toLowerCase().includes("seasonal")) {
      userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
    }
}
  }

    
    var seed = parseInt(gtf_MATH.randomIntSeed(0, 1000000, gtf_MAIN.bot["seasonaldate"]))

    ///QUERIES
    if (query["options"] == "a" || query["options"] == "A" || parseInt(query["options"]) == 1) {
      query["options"] = "A"; 
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
        return;
      }
      var charcode = 1
      var numevents = 2
    }
    if (query["options"] == "ib" || query["options"] == "IB" || parseInt(query["options"]) == 2) {
      query["options"] = "IB";
      if (!gtf_STATS.checklicense("IB", embed, msg, userdata)) {
        return;
      }
      var charcode = 10
      var numevents = 1
    }
    /*

    if (query["options"] == "ia" || query["options"] == "IA" || parseInt(query["options"]) == 3) {
      query["options"] = "IA";
    if (!gtf_STATS.checklicense("IA", embed, msg, userdata)) {
        return;
      }
      var charcode = 20
      var numevents = 1
    }
    if (query["options"] == "s" || query["options"] == "S" || parseInt(query["options"]) == 4) {
      query["options"] = "S";
      if (!gtf_STATS.checklicense("S", embed, msg, userdata)) {
        return;
      }
      var charcode = 20
      var numevents = 1
    }
*/
    if (query["options"] == "limited" || query["options"] == "LIMITED" || parseInt(query["options"]) == 3) {
      query["options"] = "LIMITED";
      var charcode = 30
      var numevents = 1
    }
    ///
    
       var now = Math.round(Date.now() / 1000)
        var date = new Date();
        mod = 3 - mod
        var timeleft = ((((24) - 1) - (date.getUTCHours())) * 3600) + ((60 - date.getUTCMinutes()) * 60) + (86400 * (mod-1))
       var hoursleft = "<t:" + parseInt(now + timeleft) + ":F>" + " (" + "<t:" + parseInt(now + timeleft) + ":R>" + ")"

    ///QUERIES
    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🎉" + " __Seasonal Events__");
       var available = (Object.keys(gtf_MAIN.gtfseasonals).length == 0 || gtf_MAIN.gtfseasonals["start"] != gtf_MAIN.bot['seasonaldate']) ? "" : " `1 Event Available`"
      results =
        "__**A Level**__ " + gtf_EMOTE.alicense + "\n" + 

        "__**IB Level**__ " + gtf_EMOTE.iblicense + "\n" +
        /*
        "__**IA Level**__ " + gtf_EMOTE.ialicense + "\n" +
        "__**S Level**__ " + gtf_EMOTE.slicense + "\n" +
        */
        "__**Limited Time Events**__ " + "⭐" + available
        var list = results.split("\n")
      pageargs["list"] = list;
         
        pageargs["footer"] = "**⌛ Next Cycle:** " + hoursleft
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return
    }
    
      var races = []
    if (query["options"] == "LIMITED") {
      if (Object.keys(gtf_MAIN.gtfseasonals).length == 0 || gtf_MAIN.gtfseasonals["start"] != gtf_MAIN.bot['seasonaldate']) {
        gtf_EMBED.alert({ name: "❌ No Limited Time Events", description: "There are currently no limited time events at the moment.", embed: "", seconds: 0 }, msg, userdata);
           return
    }
      var races = [gtf_MAIN.gtfseasonals]
  races[0]["mode"] = "CAREER"
  races[0]["positions"] = gtf_RACE.calculatecredits(races[0])
    } 
    else {
    for (var i = 0; i < numevents; i++) {
      races.push(gtf_SEASONAL.randomseasonal({}, query["options"], i+1, (seed+i) * charcode))
    }
    }
    
    var ids = Object.keys(races);
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
            gtf_STATS.raceeventstatus(raceevent, userdata) +
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
            gtf_STATS.raceeventstatus(raceevent, userdata) +
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
        embed.setTitle("🏁 __Seasonal Events - " + query["options"].toUpperCase() + " (" + ids.length + " Events)" + "__");
      
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["footer"] = "**⌛ Next Cycle:** " + hoursleft
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
      
    if (query["options"] == "select") {
      query["number"] = parseInt(query["number"])

      if (!gtf_MATH.betweenInt(query["number"], 1, Object.keys(races["races"]).length)) {
           gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 5 }, msg, userdata);
           return
      }
     
      embed.setFields([{name:gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata)}]);
      var event = gtf_RACE.careerevent(races["races"], query, embed, msg, asyncrace, userdata);
     if (event == "Invalid") {
          return
      }

      function asyncrace(event) {
        if (event == "Invalid") {
          return;
        }

        var raceprep = {
          mode: mode,
          modearg: "",
          carselect: "GARAGE",
          car: gtf_STATS.currentcar(userdata),
          trackselect: "N/A",
          track: {types:["Tarmac"]},
          racesettings: event,
          other: [],
        };
        gtf_RACE.raceprep(raceprep, embed, msg, userdata);
      }
      }

    var number = parseInt(query["number"])
      if (!gtf_MATH.betweenInt(number, 1, Object.keys(races).length) && !isNaN(number)) {
          gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 5}, msg, userdata);
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
};
