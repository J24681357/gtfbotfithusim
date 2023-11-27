const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
module.exports = {
  name: "drivingrevolution",
  title: "Driving Revolution",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(
      embed,
      results,
      query,
      {
        text: "",
        list: "",
        listsec: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 10,
        page: 0,
        numbers: false,
        buttons: true,
        carselectmessage: false,
        image: [],
        bimage: [],
        footer: "",
        special: "",
        other: "",
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //


    ////CHECK NEW GAME
    if (gtf_STATS.garage(userdata) == 0) {
      query["options"] = "new_game" 
    }
    
    if (query["number"] == 1 && gtf_STATS.garage(userdata) != 0) {
      query = {options:"races"}
    }
    var gtfcar = gtf_STATS.currentCar(userdata);
    var races = gtf_LISTS.drraces

    var keys = Object.keys(races)

    if (query["options"] == "list") {
      embed.setTitle("__**Driving Revolution**__")

      var listsec = ""

      if (typeof query["stagenumber"] !== "undefined") {
        var number = query['stagenumber'] - 1
        var stage = races[keys[number]]

        if (typeof query["racenumber"] !== "undefined") {
          var number = query['racenumber'] - 1
          var finalgrid = []
          var raceprep = {
             mode: "DRIVINGREVOLUTION",
             modearg: "",
             car: "GARAGE",
             track: stage[number]["tracks"][0]["name"],
             racesettings: stage[number],
             players: finalgrid,
             other: []
           };
          gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
          return
        }

        
      var list = []
      var listsec = []

      for (var x = 0; x < stage.length; x++) {
        var track = stage[x]["tracks"][0]["name"]
        var car = gtf_CARS.find({ fullnames: [stage[x]["car"]] })[0]
        list.push(
            "__**" + stage[x]["title"] + "**__" + " " + "` " + gtf_STATS.DRStageStatus(stage[x], userdata) + " `" + "\n" +
          "**Car: **" + stage[x]["car"]
        )
        pageargs["image"].push(car["image"][0])
      }
      pageargs["selector"] = "racenumber";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = listsec

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
  
      //gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
        return

    
      }

      var list = []

      for (var x = 0; x < keys.length; x++) {
        var track = races[keys[x]][0]["tracks"][0]["name"]
        list.push (
            "__**" + "Stage " + (x+1) + "**__" + " " + track.split(" - ")[0]
        )
        pageargs["image"].push(gtf_TRACKS.find({name: [track]})[0]["image"])
      }
      pageargs["selector"] = "stagenumber";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = listsec

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    
    }

   
  }
};
