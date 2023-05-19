var dir = "../"
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder } = require('discord.js');
////////////////////////////////////////////////////

module.exports = {
  name: "tune",
  title: "GTF Auto - Tuning Shop",
  cooldown: 3,
  license: "N",
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-test-mode"],

  delete: false,
  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  description: [],
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
      carselectmessage: true,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    var results2 = "";
    var select = "";
    var gtfcar = gtf_STATS.currentcar(userdata);
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]});

    if (typeof query["number"] !== 'undefined') {
      tune("")
      return
    }
    gtf_STATS.loadcarimage(gtfcar, embed, userdata, tune)

    function tune(attachment) {
    pageargs["image"].push(attachment)
    

    if (query["options"] == "engine" || query["options"] == "eng" || query["options"] == "e" || parseInt(query["options"]) == 1) {
      var type = "engine";
      /*
      if (gtfcar["perf"]["carengine"]["current"] != "Default") {
        gtf_EMBED.alert({ name: "❌ Engine Parts Unavailable", description: "The car's engine must be from its original model in order to tune it.", embed: "", seconds: 5 }, msg, userdata);
        return
      }
      */
    }

    if (query["options"] == "transmission" || query["options"] == "trans" || query["options"] == "tr" || parseInt(query["options"]) == 2) {
      var type = "transmission";
      if (gtfcar["perf"]["carengine"]["current"] != "Default") {
        gtf_EMBED.alert({ name: "❌ Transmission Parts Unavailable", description: "The car's transmission must be from its original model in order to tune it.", embed: "", seconds: 5 }, msg, userdata);
      }
      
    }

    if (query["options"] == "suspension" || query["options"] == "susp" || query["options"] == "sus" || query["options"] == "su" || parseInt(query["options"]) == 3) {
      
      var type = "suspension";
    }

    if (query["options"] == "tires" || query["options"] == "tire" || query["options"] == "ti" || parseInt(query["options"]) == 4) {
      
      var type = "tires";
    }

    if (query["options"] == "weight-reduction" ||
        query["options"] == "Weight Reduction" || query["options"] == "weight" || 
        query["options"] == "we" || parseInt(query["options"]) == 5) {
      
      var type = "weight-reduction";
    }

    if (query["options"] == "turbo" || query["options"] == "supercharger" || query["options"] == "tu" || parseInt(query["options"]) == 6) {
      
      var type = "turbo";
    }
      
    if (query["options"] == "brakes" || query["options"] == "brake" || query["options"] == "br" || parseInt(query["options"]) == 7) {
      
      var type = "brakes";
    }

    if (query["options"] == "aero-kits" || query["options"] == "aero-kit" || query["options"] == "aero" || parseInt(query["options"]) == 8) {
      var type = "aero-kits";
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
          return;
    }
    }
    if (query["options"] == "maintenance" || parseInt(query["options"]) == 9) {
      var type = "maintenance"
    }
  
  if (query["options"] == "carengine" || parseInt(query["options"]) == 10) {
      var type = "carengine";
      if (!gtf_STATS.checklicense("IA", embed, msg, userdata)) {
          return;
    }
    }
    
    if (query["options"] == "list") {
      delete query["number"]
      embed.setTitle(gtf_EMOTE.gtauto + " __GTF Auto - Tuning Shop__");
      var partscount = {"Engine":0, "Transmission":0, "Suspension":0, "Tires":0, "Weight Reduction":0, "Turbo":0, 
                        "Brakes": 0, "Aero Kits":0}
      var keys = Object.keys(partscount)
      var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        if (type == "Aero Kits") {
        var select = gtf_PARTS.find({ type: type}).slice(0, ocar["image"].length-1)
        } else {
        var select = gtf_PARTS.find({ type: type, cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: perf["fpp"], lowerweight: ocar["weight"]});
        }
        for (var y = 0; y < select.length; y++) {
            partscount[type]++
      }
      }
      results =
        "__**Engine**__ " + "`🔧" + partscount["Engine"] + "`" +
        "\n" +
        "__**Transmission**__ " + "`🔧" + partscount["Transmission"] + "`" +
        "\n" +
        "__**Suspension**__ " + "`🔧" + partscount["Suspension"] + "`" +
        "\n" +
        "__**Tires**__ "  + "`🔧" + partscount["Tires"] + "`" +
        "\n" +
        "__**Weight Reduction**__ " + "`🔧" + partscount['Weight Reduction'] + "`" +
         "\n" +
        "__**Turbo Kits**__ " + "`🔧" + partscount['Turbo'] + "`" + "\n" +
        "__**Brakes**__ " + "`🔧" + partscount['Brakes'] + "`" + "\n" +
        "__**Aero Kits**__ " + gtf_EMOTE.alicense + " `🔧" + partscount['Aero Kits'] + "`" + "\n" +
        "__**Maintenance / Repair**__ " + "\n" + "__**Car Engines**__ " + gtf_EMOTE.ialicense
      var list = results.split("\n")
      pageargs["list"] = list;
      pageargs["rows"] = 9
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **When you purchase a part, the current part on your current car will be sold and replaced, and will be added to the current car's inventory.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      gtf_STATS.addcount(userdata);
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      pageargs["selector"] = "options"
      pageargs["query"] = query
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }
    if (type == "maintenance") {
      embed.setTitle("🔧 __GTF Auto - Maintenance Service__");
      var partscount = {"Car Wash":0, "Oil Change":0, "Engine Repair": 0, "Transmission Repair": 0, "Suspension Repair": 0, "Body Damage Repair": 0}
      var keys = Object.keys(partscount)
      var costs = []
      var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        
        var part = gtf_PARTS.find({ type: type, cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: perf["fpp"], lowerweight: ocar["weight"]})[0];
      
        costs.push(gtf_PARTS.costcalc(part, gtfcar, ocar))
      }
      
      if (typeof query["number"] === 'undefined') {
      var list = ["**" + gtf_MATH.numFormat(costs[0]) + gtf_EMOTE.credits + "** " + "__**Car Wash**__ " + "`💧" + gtfcar["condition"]["clean"] + "%`",
        "**" + gtf_MATH.numFormat(costs[1]) + gtf_EMOTE.credits + "** " + "__**Oil Change**__ " + "`" + gtfcar["condition"]["oil"] + "%`",
        "**" + gtf_MATH.numFormat(costs[2]) + gtf_EMOTE.credits + "** " + "__**Engine Repair**__ " + "`" + gtfcar["condition"]["engine"] + "%`" ,
        "**" + gtf_MATH.numFormat(costs[3]) + gtf_EMOTE.credits + "** " + "__**Transmission Repair**__ " + "`" + gtfcar["condition"]["transmission"] + "%`",
        "**" + gtf_MATH.numFormat(costs[4]) + gtf_EMOTE.credits + "** " + "__**Suspension Repair**__ " + "`" + gtfcar["condition"]["suspension"] + "%`", 
        "**" + gtf_MATH.numFormat(costs[5]) + gtf_EMOTE.credits + "** " + "__**Body Damage Repair**__ " + "`" + gtfcar["condition"]["body"] + "%`" + "/n", 
        "**" + gtf_MATH.numFormat(Math.round(gtf_MATH.sum(costs))) + gtf_EMOTE.credits + "** " + "__**Apply All**__"]
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **This is where you can view and apply maintanence costs of your current car. Damaged parts may reduce the performance of the car.**"
      }
        
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      gtf_STATS.addcount(userdata);
      pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
      pageargs["selector"] = "number"
      pageargs["query"] = query
      gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
      return;
    }
      var number = parseInt(query["number"])
      var cost = Math.round(costs[number-1])
      
      if (parseInt(query["number"]) == 1) {
        gtf_CONDITION.updatecondition(100, "clean", userdata)
        var successmessage = "Car Wash completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 2) {
          gtf_CONDITION.updatecondition(100, "oil", userdata)
        var successmessage = "Oil Change completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 3) {
          gtf_CONDITION.updatecondition(100, "engine", userdata)
        var successmessage = "Engine Repair completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 4) {
          gtf_CONDITION.updatecondition(100, "transmission", userdata)
        var successmessage = "Transmission Repair completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }      
      if (parseInt(query["number"]) == 5) {
          gtf_CONDITION.updatecondition(100, "suspension", userdata)
        var successmessage = "Suspension Repair completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 6) {
          gtf_CONDITION.updatecondition(100, "body", userdata)
        var successmessage = "Body Damage Repair completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 7) {
          gtf_CONDITION.updatecondition(100, "all", userdata)
        cost = Math.round(gtf_MATH.sum(costs))
        var successmessage = "Car Repair completed! " + "**-" + cost + gtf_EMOTE.credits + "**"
      }
      gtf_STATS.addcredits(-cost, userdata);
      require(dir + "commands/tune").execute(msg, {options:maintenance, extra:successmessage}, userdata);
      return
    }
      if (type == "aero-kits") {
        var select = gtf_PARTS.find({ type: type}).slice(0, ocar["image"].length-1)
        } else {
            var select = gtf_PARTS.find({ type: type, cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: gtf_PERF.perf(ocar, "DEALERSHIP")["fpp"], lowerweight: ocar["weight"]});
        }
      
      if (select.length == 0) {
        gtf_EMBED.alert({ name: "❌ Type Unavailable", description: "There are no parts of this type for" + gtfcar["name"] + "**.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }

    if (select.length != 0 && query["number"] === undefined) {
    delete query["number"]
    
    var nametype = select[0]["type"];
    embed.setTitle(gtf_EMOTE.gtauto + " __GTF Auto - " + nametype + " (" + select.length + " Items)" + "__");
    select = select.map(function (x) {
      x["cost"] = gtf_PARTS.costcalc(x, gtfcar, ocar)
      var cond = gtf_PARTS.checkpartsavail(x, gtfcar);
      if (cond[0].includes("❌")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } 
      else if (cond[0].includes("📦")) {
        return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } 
      else {
      if (cond[0].includes("✅")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } else {
         return "**" + gtf_MATH.numFormat(x["cost"]) + "**" + gtf_EMOTE.credits + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp + cond[0];
      }
      }
    })
    if (type != "tires") {
      var defaultpartavail = gtf_PARTS.checkpartsavail({ type: nametype, name: "Default", cost: 0, percent: 0,
      engines: [],
      types: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0}, gtfcar);
    select.unshift("Default " + defaultpartavail[1] + gtf_EMOTE.fpp + " " + defaultpartavail[0]);
    }
    if (userdata["settings"]["TIPS"] == 0) {
    pageargs["footer"] = "❓ **Select an upgrade corresponding with the numbers above with the buttons.**";
    }
    pageargs["list"] = select;
    pageargs["text"] = gtf_TOOLS.formpage(pageargs, userdata);
    pageargs["selector"] = "number"
    pageargs["query"] = query
    gtf_TOOLS.formpages(pageargs, embed, msg, userdata);
    return;
    }
    

    
    var number = query["number"]
    var nametype = select[0]["type"];
    if (type != "tires") {
      select.unshift({ type: nametype, name: "Default", cost: 0,percent: 0,
      engines: [],
      types: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0})
    }
    
    if (!gtf_MATH.betweenInt(number, 1, select.length)) {
            gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return
    }
    
      var part = select[number-1]

    var cond = gtf_PARTS.checkpartsavail(part, gtfcar);
        if (cond[0] == "❌") {
          gtf_EMBED.alert({ name: "❌ Part Unavailable", description: "**" + part["type"] + " " + part["name"] + "** is unavailable for **" + gtfcar["name"] + "**.", embed: "", seconds: 5 }, msg, userdata);
          return;
        }
        if (cond[0] == "✅") {
          gtf_EMBED.alert({ name: "❌ Part Already Installed", description: "**" + part["type"] + " " + part["name"] + "** is already installed for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      
      gtf_MARKETPLACE.purchase(part, "PART","", embed, query, msg, userdata);
      return;
  }
  }
};
