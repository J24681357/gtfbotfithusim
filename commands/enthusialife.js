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
    if (gtf_STATS.garage(userdata) == 0 || userdata["week"] == 0) {
      query["options"] = "new_game" 
    }
    
    if (query["number"] == 1 && gtf_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"races"}
    }

    if (query["number"] == 2 && gtf_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      require(__dirname.split("/").slice(0,4).join("/") + "/" + "commands/garage").execute(msg, {options:"list"}, userdata)
      return
    }

    if (query["number"] == 3 && gtf_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"rest"}
    }
    
    var gtfcar = gtf_STATS.currentCar(userdata);


    if (query["options"] == "new_game") {
       embed.setTitle("__New Game - Choose First Car__");
       var list = gtf_CARS.find({ 
         upperyear: [1989, 2005, 9999][userdata["settings"]["GMODE"]], loweryear: [1960, 1990, 2006][userdata["settings"]["GMODE"]], special: ["starter"] });
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
            userdata["week"] = 1
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
      //gtf_STATS.checkRanking(userdata)
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
      if (typeof query["type"] === "undefined") {
        gtf_STATS.loadAvatarImage2(embed, userdata, then2)
        function then2(attachment) {
          pageargs["bimage"].push(attachment)
         embed.setTitle("__**Leagues**__")
        pageargs["selector"] = "type";
        pageargs["query"] = query;
        pageargs["list"] = ["RN", "RIV `Rank 990`", "RIII `Rank 800`", "RII `Rank 500`"];
        pageargs["listsec"] = []
        pageargs["image"] = images

        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return
        }
        return
      }
      var league = ["RN", "RIV", "RIII", "RII", "RI", "RS"][query["type"]-1]
      if (!gtf_STATS.checkLeague(league, embed, msg, userdata)) {
        return;
      }
      var races = gtf_ENTHUSIARACES.find({types: [league.toLowerCase()]})
       embed.setTitle("__**" + league + "**__")
      for (var i = 0; i < Object.keys(races).length; i++) {
      var key = Object.keys(races)[i]
      var event = {...races[key]}
      event["upperyear"] = [1989, 2005, 9999][userdata["settings"]["GMODE"]]
      event["loweryear"] = [1960, 1990, 2006][userdata["settings"]["GMODE"]]
        
        if (!gtf_GTF.checkRegulationsEnthu(gtf_STATS.currentCar(userdata), event, "", embed, msg, userdata)[0]) {
          console.log(gtf_GTF.checkRegulationsEnthu(gtf_STATS.currentCar(userdata), event, "", embed, msg, userdata)[0])
          continue;
        }
      event["tracks"][0]["seed"] = userdata["weekseed"] + parseInt(event["eventid"].split("-")[1])
      var rtrack = gtf_TRACKS.random(event["tracks"][0], 1)[0]
      event["tracks"][0]["seed"] = userdata["weekseed"] + parseInt(event["eventid"].split("-")[1])
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
        event["upperyear"] = [1989, 2005, 9999][userdata["settings"]["GMODE"]]
        event["loweryear"] = [1960, 1990, 2006][userdata["settings"]["GMODE"]]

        event["driver"] = {car: gtf_STATS.currentCar(userdata)}
        var points = gtf_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + x["points"] + " pts")

        event["tracks"][0]["seed"] = userdata["weekseed"] + parseInt(event["eventid"].split("-")[1])
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
         event["tracks"][0]["seed"] = userdata["weekseed"] + parseInt(event["eventid"].split("-")[1])
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
