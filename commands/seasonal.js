const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder  } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "seasonal",
  title: "Seasonal Events",
  cooldown: 0,
  license: "A", 
  level: 0,
  channels: ["testing"],

  delete: false,
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
    var seed = parseInt(gtf_MATH.randomIntSeed(0, 999999, gtf_DATETIME.getCurrentDay()).toString() + date.getFullYear().toString())

    var mode = "CAREER";

      if (seed != userdata["seasonalcheck"]) {
        
         userdata["seasonalcheck"] = seed
        //gtf_STATS.resetseasonalraces(userdata)
      var careeraceskeys = Object.keys(userdata["careerraces"])
        for (var i = 0; i < careeraceskeys.length; i++) {
      if (careeraceskeys[i].includes("seasonal")) {
      userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
      }
}
      }
      
    
    if (query["options"] == "a" || parseInt(query["options"]) == 1) {
      query["options"] = "A";
    }

     if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🏁" + " __Seasonal Events__");
      results =
               "__**A Level**__ " + gtf_EMOTE.alicense + "\n"
        var list = results.split("\n")
      pageargs["list"] = list;
  
        var date = new Date();
        
        //var hoursleft = ( (23 * (4 - races.length)) - date.getHours())
        
        pageargs["footer"] = "`🎉 Ends: " + "~" + "24" + " hours`"
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return
    }

    
      var races = []
    for (var i = 0; i < 1; i++) {
      races.push(gtf_SEASONAL.randomseasonal({}, query["options"], i+1, seed+i))
    }
    var ids = Object.keys(races);

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
        embed.setTitle("🏁 __Seasonal Events - " + query["options"].toUpperCase() + " (" + ids.length + " Events)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select an event from the list above using the numbers associated with the buttons.\nEach event has car regulations that your current car must meet before entry, so change your car accordingly.**";
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
      
      if (query["options"] == "select") {
      query["number"] = parseInt(query["number"])

      if (!gtf_MATH.betweenInt(query["number"], 1, Object.keys(races["races"]).length)) {
           gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
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
};
