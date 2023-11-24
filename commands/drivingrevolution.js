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


    if (query["options"] == "list") {
    
      var list = []

      var rtrack = gtf_TRACKS.random({}, 1)[0]
        list.push (
            "__**" + "Stage 1" + "**__" + " " + rtrack["name"].replace(" Reverse", " 🔄")
        )
      var listsec = ""

      if (typeof query["racenumber"] !== "undefined") {
        var event = {
            "title": "Stage 1",
            "eventid": "drs-1",
            "positions": [
              {
                "place": "1st",
                "points": 0
              }
            ],
            "startposition": 1,
            "tracks": [
              { 
                "name": rtrack["name"],
                "difficulty": 0,
                "pattern": []
              }
            ],
            "type": "LAPS",
            "time": ["R"],
            "timeprogression": 0,
            "weather": [
              "Clear",
              "Partly Cloudy",
              "Cloudy",
              "Rain"
            ],
            "weatherwetsurface": "R",
            "weatherchange": 0,
            "tireconsumption": 0,
            "fuelconsumption": 0,
            "grid": [
              6
            ],
            "gridstart": "STANDING",
            "difficulty": 100,
            "damage": true,
            "bop": false,
            "championship": false,
            "car": "GARAGE",
            "regulations": {
              "tires": "Racing: Soft",
              "fpplimit": 9999,
              "upperfpp": 9999,
              "lowerfpp": 0,
              "upperpower": 9999,
              "lowerpower": 0,
              "upperweight": 9999,
              "lowerweight": 0,
              "upperyear": 9999,
              "loweryear": 0,
              "countries": [],
              "makes": [],
              "models": [],
              "engines": [],
              "drivetrains": [],
              "types": [],
              "special": [],
              "prohibited": []
            },
            "prize": {
              "id": -1,
              "name": "",
              "type": "CREDITS",
              "item": 0
            }
          }
        var finalgrid = []
             var raceprep = {
            mode: "DRIVINGREVOLUTION",
            modearg: "",
            car: "GARAGE",
            track: rtrack["name"],
            racesettings: event,
            players: finalgrid,
            other: []
          };

        gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
        return
        var number = query["racenumber"]-1

        var event = {...allraces[number]}

        event["driver"] = {car: gtf_STATS.currentCar(userdata)}
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + x["points"] + " pts")

        event["tracks"][0]["seed"] = gtf_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
        var finalgrid = gtf_RACE.createGridEnthu(event, "", 0).sort(function(x,y) {return x["fpp"] - y["fpp"]})
        finalgrid = finalgrid.map(function(x){
          var average = gtf_MATH.average(finalgrid.map(x=> x["fpp"]))
          var fpp = x["fpp"]
          var num = fpp - average

          x["odds"] = gtf_MATH.round((-2*(-Math.exp(-0.01 * num))) + 1, 1)
          return x
        })
        var userodds = finalgrid.filter(x => x["user"] == true)[0]["odds"]
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + Math.round(x["points"] * userodds) + " pts")
        var results = "**" + event["title"] + "**" + "\n" + points.slice(0,4).join("\n") + "\n\n" + finalgrid.map(function(x) {
          if (x["user"]) {
            return "**" + x["name"] + " `" + x["odds"] + "`" + "**"
          } else {

          return x["name"] + " `" + x["odds"] + "`"
          }

        }).join("\n")

        var emojilist = [
      { emoji: "⭐", 
      emoji_name: "⭐", 
      name: 'Race', 
      extra: "",
      button_id: 0 }
      ] 
          embed.setTitle("__**" + rtrack["name"] + "**__")
        embed.setDescription(results);
      var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

        function next(msg) {
       function startrace() {
         var finalgrid = []
           var raceprep = {
          mode: "DRIVINGREVOLUTION",
          modearg: "",
          car: "GARAGE",
          track: event["tracks"][0][1],
          racesettings: event,
          players: finalgrid,
          other: []
        };

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
      pageargs["listsec"] = listsec

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    
    }

    if (query["options"] == "races" || query["options"] == 1) {
      var allraces = []
      var list = []
      var images = []
      if (typeof query["type"] === "undefined") {
         embed.setTitle("__**Leagues**__")
        pageargs["selector"] = "type";
        pageargs["query"] = query;
        pageargs["list"] = ["RN", "RIV", "RIII", "RII"];
        pageargs["listsec"] = []
        pageargs["image"] = images

        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return
      }
      var races = gtf_ENTHUSIARACES.find({types: [["rn", "riv", "riii", "rii", "ri", "rs"][query["type"]-1]]})
      for (var i = 0; i < Object.keys(races).length; i++) {
      var key = Object.keys(races)[i]
      var event = {...races[key]}
        
        if (!gtf_GTF.checkRegulations(gtf_STATS.currentCar(userdata), event, "", embed, msg, userdata)[0]) {
          continue;
        }
      event["tracks"][0]["seed"] = gtf_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
      var rtrack = gtf_TRACKS.random(event["tracks"][0], 1)[0]
      event["tracks"][0]["seed"] = gtf_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
      event["driver"] = {car: gtf_STATS.currentCar(userdata)}
      var finalgrid = gtf_RACE.createGridEnthu(event,"", 0).sort(function(x,y) {return x["fpp"] - y["fpp"]})
        finalgrid = finalgrid.map(function(x){
          var average = gtf_MATH.average(finalgrid.map(x=> x["fpp"]))
          var fpp = x["fpp"]
          var num = fpp - average

          x["odds"] = gtf_MATH.round((-2*(-Math.exp(-0.01 * num))) + 1, 1)
          return x
        })
        var userodds = finalgrid.filter(x => x["user"] == true)[0]["odds"]
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + Math.round(x["points"] * userodds) + " pts")
        var results = "**" + event["title"] + "**" + "\n" + points.slice(0,4).join("\n") + "\n\n" + finalgrid.map(function(x) {
          if (x["user"]) {
            return "**" + x["name"] + " `" + x["odds"] + "`" + "**"
          } else {

          return x["name"] + " `" + x["odds"] + "`"
          }

        })
      
      event["tracks"] = [
        [1, rtrack["name"],2]
      ]
        
        allraces.push(event)
        list.push (
            "__**" + event["title"] + "**__" + " " + rtrack["name"].replace(" Reverse", " 🔄") +
            "/n" + "`" + userodds + "` " + rtrack["length"] + " km. \\ " + event["grid"][0] + " CARS \\ " + event["tracks"][0][2] + " LAPS"
        )
        images.push(rtrack["image"])
      }
      if (typeof query["racenumber"] !== "undefined") {
        var number = query["racenumber"]-1
        
        var event = {...allraces[number]}

        event["driver"] = {car: gtf_STATS.currentCar(userdata)}
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + x["points"] + " pts")

        event["tracks"][0]["seed"] = gtf_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
        var finalgrid = gtf_RACE.createGridEnthu(event, "", 0).sort(function(x,y) {return x["fpp"] - y["fpp"]})
        finalgrid = finalgrid.map(function(x){
          var average = gtf_MATH.average(finalgrid.map(x=> x["fpp"]))
          var fpp = x["fpp"]
          var num = fpp - average
          
          x["odds"] = gtf_MATH.round((-2*(-Math.exp(-0.01 * num))) + 1, 1)
          return x
        })
        var userodds = finalgrid.filter(x => x["user"] == true)[0]["odds"]
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + Math.round(x["points"] * userodds) + " pts")
        var results = "**" + event["title"] + "**" + "\n" + points.slice(0,4).join("\n") + "\n\n" + finalgrid.map(function(x) {
          if (x["user"]) {
            return "**" + x["name"] + " `" + x["odds"] + "`" + "**"
          } else {
          
          return x["name"] + " `" + x["odds"] + "`"
          }
        
        }).join("\n")
    
        var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: 'Race', 
  extra: "",
  button_id: 0 }
] 
          embed.setTitle("__**" + rtrack["name"] + "**__")
        embed.setDescription(results);
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
        
       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

        function next(msg) {
       function startrace() {
         event["tracks"][0]["seed"] = gtf_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
         //event["laps"] = 1
         event["laps"] = event["tracks"][0][2]
           var raceprep = {
          mode: "CAREER",
          modearg: "",
          car: "GARAGE",
          track: event["tracks"][0][1],
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
      pageargs["listsec"] = [];
      pageargs["image"] = images

      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      
    }

    if (query["options"] == "rest" || query["options"] == 2) {
      embed.setTitle("__Rest__");
      embed.setDescription("Would you like to rest and gain Enthu points?")

         var emojilist = [
      { emoji: "⭐", 
      emoji_name: "⭐", 
      name: 'YES', 
      extra: "",
      button_id: 0 }
      ]

      var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
            gtf_STATS.saveEnthu(userdata);
         gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, func)

         function func(msg) {
          function ok() {
            var racesettings = {title:"REST"}
userdata["rankinghistory"].push({
      title:racesettings["title"], 
            week:userdata["week"], 
            place: "1st",                                                            points: 0, 
                  skillpoints:0
           })
              userdata["week"]++
            gtf_GTF.resultsSummaryEnthu(racesettings, {}, embed, msg, userdata)
          }

          var functionlist = [ok]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      return
    }
    
    if (query["options"] == "records" || query["options"] == 5) {
      var results = gtf_STATS.rankingHistory(userdata).map(x => x["name"] + " " + x["points"] + "pts").join("\n")

      embed.setDescription(results);
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
      gtf_DISCORD.send(msg, {embeds:[embed]})
    }
    }
};
