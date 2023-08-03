const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////


module.exports.startsession = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {

  var index = 0;
  var showcar = "";
  var racelength = 0;
  var startracetime = 2000;
  var racetime = ""
  var raceweather = ""
  var currentcar = finalgrid.filter(x => x["user"] === true)[0]
  var message = ""
  var progressbarblackarcolor = userdata["settings"]["ICONS"]["bar"][0];
  var progressbarblack = userdata["settings"]["ICONS"]["bar"][1];

  embed.image = ""

/*
  if (msg.embeds[0].thumbnail != null) {
   embed.setThumbnail(msg.embeds[0].thumbnail.url)
  }*/

  embed.setTitle("__" + racesettings["title"] + "__")
  embed.setColor(userdata["settings"]["COLOR"])
  //embed.setAuthor({name: msg.user.displayName, iconURL: msg.user.displayAvatarURL()});

  //msg.removeAttachments()
  //gtf_STATS.updatefpp(racesettings["driver"]["car"])
  //racesettings["driver"]["car"] = gtf_STATS.currentcar(userdata)

  var emojilist = [{
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once",
      button_id: 0
    }]
  
  var buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);
  if (racesettings["tireconsumption"] == -1) {
    var tireslist = racesettings["driver"]["car"]["perf"]["tires"]["list"].filter(function(tire) {
  return gtf_GTF.checktireregulations(racesettings["driver"]["car"], {tires:tire}, "", embed, msg, userdata)[0]
  }).sort()
  var tmenulist = tireslist.map(function (tire, index) {
          return {
            emoji: "",
            name: tire,
            description: "",
            menu_id: (index)
            }
  })
  var temojilist = []
var menu = gtf_TOOLS.preparemenu("Pit Options (Next Lap)" , tmenulist, temojilist, msg, userdata);
buttons.unshift(menu)
  }


  var lights = [
    [gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb],
    [gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb],
    [gtf_EMOTE.greenlight, gtf_EMOTE.greenlight, gtf_EMOTE.greenlight, gtf_EMOTE.greenlight],
  ];
  var ready = ["**READY**\n", gtf_EMOTE.transparent + "**3,2,1...**" + gtf_EMOTE.transparent, gtf_EMOTE.transparent + "**START**" + gtf_EMOTE.transparent];
  var start = [progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, progressbarblack, "🏁"];
  var results3 = start.join("");

  if (racesettings["championship"]) {
        if (userdata["raceinprogress"]["championshipnum"] >= 1) {
          setTimeout(function() {readysetgo()}, 10 * 1000)
        } else {
          readysetgo()
    }
} else {
  readysetgo()
}
  function readysetgo() {

//RACELENGTH//
  if (!checkpoint[0]) {
  userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(racesettings["weather"])))
  var weatheri = racesettings["weather"]
  for (var i = 0; i < 20; i++) {
    weatheri = gtf_WEATHER.advanceweather(weatheri, racesettings["distance"]["km"])
    userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(weatheri)))
  }
  if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE" || racesettings["mode"] == "ARCADE" || racesettings["mode"] == "SSRX") {
      [showcar, racelength] = gtf_RACEEX.racelengthcalc(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    
    //racelength = 10 * 1000
    } else if (racesettings["mode"] == "DRIFT") {
    racesettings["sectors"] = racesettings["originalsectors"];
    racesettings["points"] = 0;
    let drift1 = gtf_RACEEX.driftracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = drift1[0];
    racelength = drift1[1];
  }
  else if (racesettings["mode"] == "ONLINE") {
    let online1 = gtf_RACEEX.onlineracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
    showcar = online1[0];
    racelength = online1[1];
  }

  if (racesettings["type"] == "TIME") {
    racelength = parseInt(racesettings["laps"].split("m")[0]) * (60*1000)
  }
}
if (racesettings["type"] == "TIMETRIAL") {
      let tt1 = gtf_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, 50 - (racesettings["difficulty"]/2), embed, msg, userdata);
      showcar = tt1[0];
      racelength = tt1[1];
}
    
/////////////
  

  ///RACEINPROGRESS
  if (!checkpoint[0]) {
    var currenttime = new Date().getTime();
    var totaltime = new Date().getTime() + racelength + 2000;
    if (racesettings["championship"] && userdata["raceinprogress"]["championshipnum"] >= 1) {
      userdata["raceinprogress"]["active"] = true
      userdata["raceinprogress"]["messageid"] = msg.id
      userdata["raceinprogress"]["channelid"] = msg.channel.id
      userdata["raceinprogress"]["expire"] = totaltime
      } else {
    userdata["raceinprogress"] = {active:true, channelid: msg.channel.id, messageid:msg.id, expire:totaltime, gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
    msghistory: [],championshipnum:0};
    }
    if (racesettings["mode"] == "ONLINE") {
        gtf_LOBBY.updateusersraceinprogress(finalgrid, totaltime, msg)
    }
    gtf_STATS.addracedetails(racesettings, racedetails, finalgrid, userdata);
  userdata["raceinprogress"]["start"] = currenttime

   var timeinterval = racelength / 20
  if (timeinterval <= 2000) {
    timeinterval = 2000
  }


  gtf_STATS.createracehistory(racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata)

  }
  else {

    var totaltime = userdata["raceinprogress"]["expire"];
    var currenttime = userdata["raceinprogress"]["start"];
    startracetime = 0;
    index = 4
    if (racesettings["type"] == "TIMETRIAL") {
      userdata["raceinprogress"]["msghistory"] = []
  //finalgrid = userdata["raceinprogress"]["gridhistory"][0]
    } else {
     racelength = totaltime - new Date().getTime() - 2000;
    }
  }

    //functions
    function flagstartrace() {
          if (userdata["raceinprogress"]["active"]) {
          require(__dirname.split("/").slice(0,4).join("/") + "/" + "commands/status").execute(msg, {options:"exit"}, userdata);
          if (racesettings["type"] == "TIMETRIAL") {
          var results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          embed.setDescription(results2)
          embed.setFields([{
          name:gtf_STATS.main(userdata),
          value: "🚘 " +  gtf_CARS.shortname(racesettings["driver"]["car"]["name"]) +
" " + "**" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**"}]);
            ////exit from session with no results
         gtf_DISCORD.send(msg, {content: "<@" + userdata["id"] + "> **FINISH**", embeds: [embed]}, race2func)
            function race2func(msg) {
          gtf_RACEEX.createfinalbuttons(racesettings, racedetails, finalgrid,  checkpoint, results2, buttons, emojilist, embed, msg, userdata);

          if (racesettings["mode"] == "CAREER") {
         var complete = gtf_STATS.checkcareerevent(racesettings, "1st", userdata);
                if (complete) {
            gtf_STATS.completeevent(racesettings, userdata);
              gtf_STATS.redeemgift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
                }
          } else if (racesettings["mode"] == "LICENSE") {
             var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
    if (option == "b" || option == "a" ||option == "ic" || option == "ib" || option == "ia" || option == "s") {
            gtf_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata)
    }
          }
          if (racesettings["mode"] != "ONLINE") {
          gtf_STATS.save(userdata);
          }
        }
          }
          }
    }
    var functionlist = [flagstartrace]
    gtf_TOOLS.createbuttons(buttons, emojilist, functionlist, msg, userdata)
    ///

  gtf_STATS.save(userdata);

  var results = function (index) {
    return lights[index][0] + lights[index][1] + lights[index][2] + lights[index][3] + ready[index] + lights[index][3] + lights[index][2] + lights[index][1] + lights[index][0]
  };
  index++;

  if (!checkpoint[0]) {
  gtf_TOOLS.interval(
    function () {
      var starttime = "";
        if (racesettings["mode"] == "CAREER") {
  message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({name1:"race-start"}) + "`"
    }
     if (index == 3) {
        starttime = message + "\n" + userdata["raceinprogress"]["timehistory"][0]["hour"] + ":" + userdata["raceinprogress"]["timehistory"][0]["minutes"] + " " + racesettings["weather"]["emoji"] + "💧" + racesettings["weather"]["wetsurface"] + "%" + " | " + "⏳" +  gtf_DATETIME.getFormattedTime(racelength) + " minutes" + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(x => x[0]).join("") + "**";
    if (racesettings["type"] == "TIMETRIAL") {
              starttime = ""
    } else {
    }
        return
      }
     if (index == 2) {

        if (racesettings["type"] == "TIMETRIAL") {
              starttime = ""
       } else {
        starttime = message + "\n" + userdata["raceinprogress"]["timehistory"][0]["hour"] + ":" + userdata["raceinprogress"]["timehistory"][0]["minutes"] + " " + racesettings["weather"]["emoji"] + "💧" + racesettings["weather"]["wetsurface"] + "%" + " | " + "⏳" +  gtf_DATETIME.getFormattedTime(racelength) + " left |" + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(x => x[0]).join("") + "**";
       }
      }
      embed.setDescription(results(index) + starttime);
     embed.spliceFields(0, 1);
      console.log("OK")
      gtf_DISCORD.edit(msg, {content: "ㅤ", embeds: [embed], components:buttons })

      index++;
    },
    1500,
    2
  );
    }

  var timeleft = totaltime - currenttime;
  var timedivide = racelength / (start.length - 1);
  var timeinterval = racelength / 20
  if (timeinterval <= 2000) {
    timeinterval = 2000
  }

  setTimeout(function () {
    var check = function () {
      timeleft = totaltime - userdata["raceinprogress"]["start"];

      if (userdata["raceinprogress"]["expire"] <= new Date().getTime()) {
       clearInterval(progress);
       gtf_STATS.addplaytime(userdata["raceinprogress"]["expire"] - userdata["raceinprogress"]["start"], userdata);
       if (racesettings["type"] == "TIMETRIAL") {
         let tt2 = gtf_RACEEX.timetriallap(racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata);
      var newlap = tt2[0];
        currenttime = new Date().getTime()
        if (finalgrid[0]["laps"].length % 5 != 0) {
          if (newlap["medal"] != "GOLD") {
          return gtf_DISCORD.send(msg, {content: "<@" + userdata["id"] + "> **" + newlap["medal"] + " " + gtf_DATETIME.getFormattedLapTime(newlap["time"]) + " | " + "LAP " + finalgrid[0]["laps"].length + "**", embeds: [embed]}, repeat)
          }
      }
         userdata["raceinprogress"]["expire"] = "EXIT"

          function repeat(msg) {

            let tt1 = gtf_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, gtf_STATS.level(userdata), embed, msg, userdata);
          racelength = tt1[1];
          setTimeout(function() {
          userdata["raceinprogress"] = {active:true, messageid: msg.id, channelid: msg.channel.id, start: currenttime, expire: (currenttime + racelength),  gridhistory: userdata["raceinprogress"]["gridhistory"], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum:0}
            gtf_RACES2.startsession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
          }, 2000)
          }

        }

        //////ending race
    if (racesettings["championship"]) {
        //userdata["raceinprogress"]["active"] = false
      } else {
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:0, gridhistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [],  championshipnum:0}
    }
    /////
        if (msg.embeds[0].thumbnail == null) {
        var thumbnail = ""
        } else {
        var thumbnail = msg.embeds[0].thumbnail.url
        }
        gtf_DISCORD.delete(msg, {seconds:5})

        gtf_STATS.removeracedetails(userdata);

        if (racesettings["mode"] == "SSRX") {
          let ssrx2 = gtf_RACEEX.speedtestresults(racelength, racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
          var results2 = ssrx2;
        } else if (racesettings["mode"] == "DRIFT") {
          let drift2 = gtf_RACEEX.driftresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, racesettings["points"]);
          var results2 = drift2;
        } else if (racesettings["mode"] == "ONLINE") {
           var results2 = gtf_RACE.startonline(racesettings, racedetails, finalgrid, user, userdata);
        } else if (racesettings["type"] == "TIMETRIAL") {
          var results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          //var results2 = "Test"
          embed.setDescription(results2)
          //gtf_DISCORD.send(msg, {embeds: [embed]})
          //gtf_STATS.save(userdata);
          //return
        } else {
          var results2 = gtf_RACE.start(racesettings, racedetails, finalgrid, userdata);
        }
        if (thumbnail != "") {
        embed.setThumbnail(thumbnail)
        }

        if ( (racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE" || racesettings["mode"] == "ONLINE") && racesettings["type"] != "TIMETRIAL") {

          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0] + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({name1:"race-results-winner", name2:[finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["name"].split(" ").slice(0,-1).join(" "),
          finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["drivername"]][userdata["settings"]["GRIDNAME"]], "racesettings":racesettings}) + "`");
        } else {
          embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
        }
        if (racesettings["driver"]["car"] == "") {
          var field2 = gtf_EMOTE.transparent;
        } else {
          var field2 = gtf_CARS.shortname(racesettings["driver"]["car"]["name"]) +
" " + "**" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**"
        }
        var ping = "<@" + userdata["id"] + ">";
        var user = msg.user
        if (racesettings["mode"] == "ONLINE") {
          ping = "@everyone";
        } else {
          embed.setFields([{name:gtf_STATS.main(userdata), value: field2}]);
        }
        
  if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"]) {
        var emojilist = [{
      emoji: "⏭",
      emoji_name: "⏭",
      name: "Continue",
      extra: "Once"
    }, {
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: "",
    }, {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }]
    } else {
      var emojilist = [{
      emoji: "🔁",
      emoji_name: "🔁",
      name: "Restart",
      extra: "Once"
    }, {
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: ""
    }, {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }, {
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once"
    }]
    }
  } 
  else if (racesettings["mode"] == "LICENSE") {
    if (racesettings["title"].includes("Invitation")) {
       var emojilist = [{
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: ""
    }, {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }, {
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once"
    }]
    } 
    else {
     var emojilist = [{
      emoji: "🔁",
      emoji_name: "🔁",
      name: "Restart",
      extra: "Once"
    }, {
      emoji: "⏭",
      emoji_name: "⏭",
      name: "Next",
      extra: "Once"
    }, {
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: ""
    }, {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }, {
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once"
    }]
    }
  } 
  else if (racesettings["mode"] == "ONLINE") {
    var emojilist = [{
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: ""
    }, {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }]
  } 
  else {
      var emojilist = [{
      emoji: "🔁",
      emoji_name: "🔁",
      name: "Restart",
      extra: "Once"
    }, {
      emoji: "🎥",
      emoji_name: "🎥",
      name: "Save Replay",
      extra: ""
    },  {
    emoji: gtf_EMOTE.tracklogo,
    emoji_name: "trackgtfitness",
    name: 'Grid Results/Session',
    extra: "",
  }, {
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Exit",
      extra: "Once"
    }]
  }

  emojilist = emojilist.map(function(x,index) {
    if (x["name"] == "Save Replay") {
      if (userdata["stats"]["numreplays"] >= gtf_GTF.replaylimit) {
    x = {
      emoji: "❌",
      emoji_name: "❌",
      name: "Replays Full",
      extra: ""
    }
  }
    }
    x["button_id"] = index
    return x
  })

        /*
////REPLAYS
  if (userdata["stats"]["numreplays"] >= gtf_GTF.replaylimit) {
    emojilist.push({
      emoji: "❌",
      emoji_name: "❌",
      name: "Replays Full",
      extra: "",
      button_id: count
    });
    count++
  } else {
    count++
  }
////////
*/


  buttons = gtf_TOOLS.preparebuttons(emojilist, msg, userdata);

gtf_DISCORD.send(msg, {content:ping + " **FINISH**",embeds: [embed], components:buttons}, race2func, true)
        function race2func(msg) {
          gtf_RACEEX.createfinalbuttons(racesettings, racedetails, finalgrid,  checkpoint, results2, buttons, emojilist, embed, msg, userdata);

          if (racesettings["mode"] == "CAREER") {
         var complete = gtf_STATS.checkcareerevent(racesettings, "1st", userdata);
            if (complete) {
            gtf_STATS.completeevent(racesettings, userdata);
              gtf_STATS.redeemgift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
                }
          } else if (racesettings["mode"] == "LICENSE") {
             var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
    if (option == "b" || option == "a" ||option == "ic" || option == "ib" || option == "ia" || option == "s") {
            gtf_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata)
    }
          }
          if (racesettings["mode"] != "ONLINE") {
          gtf_STATS.save(userdata);
          }
        }
        

    return;
  } else {
        var maxprogress = Math.floor(((new Date().getTime()-userdata["raceinprogress"]["start"])/(totaltime-userdata["raceinprogress"]["start"])) * start.length)
        for (var t = 0; t < start.length; t++) {
          start[t] = progressbarblack;
          if (t < maxprogress) {
             start[t] = progressbarblackarcolor;
          }
        }
        results3 = start.join("");
      }
    };

    var progress = setInterval(function () {

      check();
      if (userdata["raceinprogress"]["expire"] <= new Date().getTime() || !userdata["raceinprogress"]["active"]) {
        clearInterval(progress);
        return
      }
      var indexv = Math.floor(((new Date().getTime() -userdata["raceinprogress"]["start"])/(totaltime-userdata["raceinprogress"]["start"])) * userdata["raceinprogress"]["gridhistory"].length)

        if (racesettings["type"] != "TIMETRIAL") {
      message = userdata["raceinprogress"]["msghistory"][indexv]
      finalgrid = userdata["raceinprogress"]["gridhistory"][indexv]
      racetime = userdata["raceinprogress"]["timehistory"][indexv]
      raceweather = userdata["raceinprogress"]["weatherhistory"][indexv]
      currentcar = finalgrid.filter(x => x["user"] === true)[0] 
      if (isNaN(racelength)) {
        gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred. Race Aborted.", embed: "", seconds: 0 }, msg, userdata);
        console.log(userdata["id"] + ": Race Aborted ERROR");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        gtf_STATS.save(userdata);
        clearInterval(progress);
        return;
      }
      var currentlap = Math.ceil((indexv/20) * racesettings["laps"])
      var currentlaptext = (racesettings["type"] == "LAPS") ? "`Lap " + currentlap + "/" + racesettings["laps"] + "` " : ""

      embed.setDescription(results3 + "\n" + finalgrid.slice(0,10).map(function(x) {
        var gap = "`" + "+" + x["gap"] + "`"
        if (x["gap"] == 0) {
          gap = ""
        }
        var name = [gtf_CARS.shortname(x["name"]), x["drivername"]][userdata["settings"]["GRIDNAME"]]
        var stops = x["pitstops"] >= 1 ? " " + gtf_EMOTE.pit + "`" + x["pitstops"] + "`" : ""

        if ( racesettings["mode"] == "ONLINE") {
          name = gtf_CARS.shortname(x["name"]) + " `" + x["drivername"] + "`"
          return x["position"] + ". " + gap + name + stops
        }
        if (x["user"]) {
        return "**" + x["position"] + ".** " + gap + " **" + name + "**" + stops
        } else {
        return x["position"] + ". " + gap + " " + name + stops
        }
      }).join("\n") + message + "\n\n" + 
    racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" +  gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) + " left " + currentlaptext + showcar + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(x => x[0]).join("") + "** `" + currentcar["tirewear"] + "%` " + "`" + currentcar["fuel"] + "%`")
      } else {
          finalgrid = userdata["raceinprogress"]["gridhistory"][0]
      }

      if (racesettings["mode"] == "DRIFT") {
        let drift1 = gtf_RACEEX.driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, false);
        var icon = gtf_EMOTE.transparent;
        if (drift1[0] > 0) {
          icon = gtf_EMOTE.driftflag;
        }
        racesettings["points"] += drift1[0];
        embed.setDescription(results3 + "\n" + icon + " **" + gtf_MATH.numFormat(racesettings["points"]) + "pts**" + "\n\n" + + racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" +  gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) + " left" + showcar + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(x => x[0]).join("") + "**");
      }
      if (racesettings["type"] == "TIMETRIAL" && userdata["raceinprogress"]["expire"] != "EXIT") {
        var lap = ""
        var bestlap = ""
        if (finalgrid[0]["laps"].length >= 1) {

        if (finalgrid[0]["laps"].filter(function(x) {return x["best"] == true && x["medal"] != "FAIL"}).length >= 1) {
        var bestlapobject = finalgrid[0]["laps"].filter(function(x) {return x["best"] == true && x["medal"] != "FAIL"})[0]
      bestlap = gtf_EMOTE.tracklogo + "__**Best:**__ " + bestlapobject["medalemote"] + " "+ gtf_DATETIME.getFormattedLapTime(bestlapobject["time"]) + " `Lap " + bestlapobject["lapnum"] + "`"
        var laps = finalgrid[0]["laps"].map(function(x,index) {
          /*
          if (x["medal"] == "FAIL") {
            return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"]
          }
          */
          if (x["best"] && x["medal"] != "FAIL") {
            return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]) + " ⭐"
          }
          return  "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]).replace("01:00:00.000", "")
          }).reverse().slice(0,5).join("\n")
        } else {
          var laps = "__**Lap 1:**__ "
        }
        } else {
        var laps = "__**Lap 1:**__ "
        }
        var timeprizes = ["**" + gtf_EMOTE.goldmedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][0]["time"] * 1000), gtf_EMOTE.silvermedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][1]["time"] * 1000) + " ",
                gtf_EMOTE.bronzemedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][2]["time"] * 1000) + "**"]
        embed.setDescription(results3 + "\n" + timeprizes.join(" ") + "\n" + bestlap + "\n\n" + laps + "\n" + showcar + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(x => x[0]).join("") + "**");
      }
      gtf_STATS.save(userdata);
      console.log("OKK")
      msg.edit({embeds: [embed], components:buttons}).catch(function () {
        clearInterval(progress);
        console.log(userdata["id"] + ": Session has ended. (Message is not there.)");
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum:0}
      
        if (racesettings["type"] == "TIMETRIAL") {
          results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          embed.setDescription(results2)
          gtf_DISCORD.send(msg, {content: "<@" + userdata["id"] + ">" + " **FINISH**", embeds: [embed]})
        }
    
        return;
      });
      if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") {
      if (typeof message === 'undefined') {
          message = ""
        } else if (message.length != 0) {
          message = ""
        }
      }

    }, timeinterval);

  }, startracetime);
  }
};

