var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder  } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "seasonal",
  title: "Seasonal Events",
  cooldown: 0,
  license: "IB", 
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: [''],
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
    var races = {}
    var mode = "CAREER";
    gtf_STATS.load("SEASONALS", userdata, seasonal)

    function seasonal(races) {
      if (races["races"]["seasonals"]["date"] != userdata["seasonalcheck"]) {
      var careeraceskeys = Object.keys(userdata["careerraces"])
      userdata["seasonalcheck"] = races["races"]["seasonals"]["date"]
        for (var i = 0; i < careeraceskeys.length; i++) {
      if (careeraceskeys[i].includes("seasonal")) {
      userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
      }
}
      }


      if (query["options"] == "list") {
      delete query["number"]
        var ids = Object.keys(races["races"]);
        results = []
        for (var t = 0; t < ids.length; t++) {
          var raceevent = races["races"][ids[t]];
          var rmakes = raceevent["makes"];
          var rmodels = raceevent["models"];
          var drivetrains = raceevent["drivetrains"]
          var tires = raceevent["tires"]
          var rcountries = raceevent["countries"]
          var engines = raceevent["engines"]
          
           var rmake = rmakes.length != 0 ? rmakes.join(", ") + " | ": ""
          var rcountry = rcountries.length != 0 ? rcountries.join(", ") + " | " : ""
          var rmodel = rmodels.length != 0 ? rmodels.join(", ") + " | ": ""
          var drivetrain = drivetrains.length != 0 ? drivetrains.join(", ") + " | " : ""
          var engine = engines.length != 0 ? engines.join(", ") : ""
          var bop = raceevent["bop"] ? (" " + gtf_EMOTE.bop) : ""
          var weather = (raceevent["weatherchange"] >= 1) ? (" " + gtf_EMOTE.weather) : ""
          var championship = raceevent["championship"][0] ? ("🏆 ") : ""
          var any = [rcountry,rmake,rmodel,drivetrain,engine,bop].join("").length != 0 ? "" : "None"

          results.push(
            "__**" + raceevent["title"] +
            " - " +
            raceevent["tracks"].length +
            " Races " + "**__ " +
            gtf_STATS.eventstatus("seasonal" + "-" + (t + 1), userdata) +
            "/n" +
            "**Limit: " +
            raceevent["fpplimit"].toString().replace("9999", "Any") +
            gtf_EMOTE.fpp + gtf_EMOTE.tire + tires +
            "**/n" +
            "**Regulations:** " +
           rcountry + rmake +
            rmodel + drivetrain + engine + bop + any +
            "/n" +
            "**Types:** " +
            raceevent["types"].join(", ")
          )
        }
        embed.setTitle("🎉 __Seasonal Events" + " (" + ids.length + " Events)" + "__");

        pageargs["list"] = results;
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "\n" + "**❓ Select an event from the list above using the numbers associated with the buttons. Seasonals run daily, meaning that any progress will be reset every 48 hours.**"
        } 
  
        var date = new Date();
        
        var hoursleft = ( (23 * (4 - races["count"].length)) - date.getHours())
        
        pageargs["footer"] = "`🎉 Ends: " + "~" + hoursleft + " hours`" + pageargs["footer"]
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
        gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
         setTimeout(function() {
          var t = 0 
            for (t; t < ids.length; t++) {
          raceevent = races["races"][ids[t]];
          var achieve = gtf_STATS.isracescomplete("seasonal" + "-" + (t + 1), raceevent["tracks"].length, 1, userdata);
          if (achieve) {
            gtf_STATS.eventcomplete("seasonal" + "-" + (t + 1), userdata);
            gtf_STATS.gift(gtf_EMOTE.goldmedal + " Congrats! Completed " + raceevent["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, raceevent["prize"], embed, msg, userdata);
          }
            }
          }, 2000)
        return;
      }
      
      if (query["options"] == "select") {
      query["number"] = parseInt(query["number"])

      if (!gtf_MATH.betweenInt(query["number"], 1, Object.keys(races["races"]).length)) {
           gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
           return
      }
      if (gtf_STATS.eventstatus("seasonal" + "-" + query["number"], userdata) == "✅") {
        gtf_EMBED.alert({ name: "❌ Seasonal Event Complete", description: "This seasonal event can not be repeated after **Gold** completion.", embed: "", seconds: 3 }, msg, userdata);  
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

    }
  },
};
