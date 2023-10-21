const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
module.exports = {
  name: "enthusialife",
  title: "Enthusia Life",
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

    if (query["number"] == 2 && gtf_STATS.garage(userdata) != 0) {
      require(__dirname.split("/").slice(0,4).join("/") + "/" + "commands/garage").execute(msg, {options:"list"}, userdata)
      return
    }

    
    var gtfcar = gtf_STATS.currentCar(userdata);

    if (query["options"] == "new_game") {
       embed.setTitle("__New Game - Choose First Car__");
       var list = gtf_CARS.find({ special: ["starter"] });
       var carlist = [];
       var listsec = []
        for (var i = 0; i < list.length; i++) {
          var classs = gtf_PERF.perf(list[i], "DEALERSHIP")["class"];
          var name = list[i]["name"];
          var image = list[i]["image"][0];
          carlist.push(gtf_CARS.shortName(name) + " ` " + classs + " `");
          listsec.push(list[i]["year"] + " | " + gtf_MATH.numFormat(list[i]["power"]) + " hp" + " | " + gtf_MATH.numFormat(gtf_STATS.weightUser(list[i]["weight"], userdata)) + " " + gtf_STATS.weightUnits(userdata) + " | " + list[i]["type"])
          pageargs["image"].push(image);
        }
      if (query["number"] !== undefined) {
          if (!gtf_MATH.betweenInt(query["number"], 1, list.length)) {
            gtf_EMBED.alert({ name: "❌ Invalid Number", description: "This number does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            var number = parseInt(query["number"]) - 1;
            var car = list[number];
            gtf_CARS.addCarEnthu(car, "SORT", userdata);
            require(__filename.split(".")[0]).execute(msg, {options:"list", extra: "New car!"}, userdata)
            return
          }
      }
        pageargs["selector"] = "number";
        pageargs["query"] = query;
        pageargs["list"] = carlist;
        pageargs["listsec"] = listsec

        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "list") {
      var gtfcar = gtf_STATS.currentCar(userdata);
      var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] });
      pageargs["image"].push(ocar["image"][0])
      gtf_STATS.loadAvatarImage2(embed, userdata, then2)
      
      function then2(attachment) {
      pageargs["bimage"].push(attachment)
      var list = ["[__ Go Race __]", "[__ Change Car __]", "[__ Rest __]", "[__ Garage __]", "[__ Records __]"]
      var listsec = ""
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = listsec

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    }

    if (query["options"] == "races" || query["options"] == 1) {
      var allraces = []
      var list = []
      var images = []
      var numraces = {"rn":4}
      for (var i = 0; i < Object.keys(numraces).length; i++) {
      var races = gtf_ENTHUSIARACES.find({types: ["rn"]})
      var event = {...races[0]}
      event["tracks"][0]["seed"] = gtf_STATS.week(userdata)
      event["grid"] = 6
      var rtrack = gtf_TRACKS.random(event["tracks"][0], 1)[0]
      event["driver"] = {car: gtf_STATS.currentCar(userdata)}
      var finalgrid = gtf_RACE.createGrid(event,"", 0);
      
      event["tracks"] = [
        [1, rtrack["name"],2]
      ]
        allraces.push(event)
        list.push (
            "__**" + event["title"] + "**__" + " " + rtrack["name"].replace(" Reverse", " 🔄") +
            "/n" + rtrack["length"] + " km. \\ " + event["grid"] + " CARS \\ " + event["tracks"][0][2] + " LAPS"
        )
        images.push(rtrack["image"])
      }
      if (typeof query["racenumber"] !== "undefined") {
        var number = query["racenumber"]-1
        var event = races[number]
        event["driver"] = {car: gtf_STATS.currentCar(userdata)}
        event["grid"] = 6
        var finalgrid = gtf_RACE.createGrid(event, "", 0);
        var odds = finalgrid.map(x => x["fpp"])
        console.log(odds)
        var results = finalgrid.map(x => x["name"]).join("\n\n")
        var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: 'Race', 
  extra: "",
  button_id: 0 }
]
        embed.setDescription(results);
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
        
       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

        function next(msg) {
       function startrace() {
         event["tracks"][0]["seed"] = gtf_STATS.week(userdata)
         event["laps"] = 1
         //event["laps"] = event["tracks"][0][2]
           var raceprep = {
          mode: "CAREER",
          modearg: "",
          car: "GARAGE",
          track: gtf_TRACKS.random(event["tracks"][0], 1)[0]["name"],
          racesettings: event,
          players: finalgrid,
          other: []
        };
        raceprep["racesettings"]["positions"] = gtf_RACE.creditsCalcEnthu(raceprep["racesettings"], raceprep)
       
      gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
  
          }
          var functionlist = [startrace]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
        
        return
      }
      pageargs["selector"] = "racenumber";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = []
      pageargs["image"] = images

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      
    }

    if (query["options"] == "records" || query["options"] == 5) {
      var results = gtf_STATS.rankingHistory(userdata).map(x => x["name"] + " " + x["points"] + "pts").join("\n")

      embed.setDescription(results);
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
      gtf_DISCORD.send(msg, {embeds:[embed]})
    }
    }
};
