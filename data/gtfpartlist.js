var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.nitrous = function () {
  return [
    ["Normal (NOS)", 10000, "FPP", [300000]],
    ["Red (NOS)", 10000, "FPP", [300000]],
    ["Orange (NOS)", 10000, "FPP", [300000]],
    ["Yellow (NOS)", 10000, "FPP", [300000]],
    ["Lime (NOS)", 10000, "FPP", [300000]],
    ["Green (NOS)", 10000, "FPP", [300000]],
    ["Aqua (NOS)", 10000, "FPP", [300000]],
    ["Blue (NOS)", 10000, "FPP", [300000]],
    ["Purple (NOS)", 10000, "FPP", [300000]],
    ["Brown (NOS)", 10000, "FPP", [300000]],
    ["White (NOS)", 10000, "FPP", [300000]],
  ];
};

var oilchange = ["Oil Change", 1000, "FPP"];
var fuel = ["Fuel", 1000];

//////////////////

module.exports.list = function (args) {
  var gtfparts = gtf_LISTS.gtfpartlist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "type") {
    results = Object.keys(gtfparts).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
};

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var gtfparts = gtf_LISTS.gtfpartlist;
  var final = [];
  var total = Object.keys(args).length;

  var parttypes = Object.keys(gtfparts);

  for (var key = 0; key < parttypes.length; key++) {
    var typekey = gtfparts[parttypes[key]];
    for (var i = 0; i < typekey.length; i++) {
      var count = 0;
      
      if (args["type"] !== undefined) {
        var type = args["type"];
        var x = typekey[i]["type"];
        if (x.toLowerCase().replace(/ /g, "").replace(/-/g, "") == type.toLowerCase().replace(/ /g, "").replace(/-/g, "")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        if (args["name"].length == 0) {
          count++;
        } else { 
        var name = args["name"];
        var x = typekey[i]["name"];
        if (x === name) {
          count++;
        }
      }
      }

    if (args["makes"] !== undefined) {
        if (args["makes"].length == 0) {
          count++;
        } else {
          var make = args["makes"];
          var x = typekey[i]["makes"];
          for (var makei = 0; makei < make.length; makei++) {
            if (x.toLowerCase().replace(/-/,"_").replace(/ /g, "_") === make[makei].toLowerCase().replace(/-/,"_").replace(/ /g, "_")) {
              count++;
              break;
            }
          }
        }
      }
      
     if (args["model"] !== undefined) {
        if (args["model"].length == 0) {
          count++;
        } else {
          var model = args["model"];

          if (typekey[i]["models"].length == 0) {
            count++
          }
          for (var iname = 0; iname < typekey[i]["models"].length; iname++) {
            if (model.includes(" " + typekey[i]["models"][iname])) {
              count++;
              break;
            }
          }
          
        }
      }

      if (args["cartype"] !== undefined) {
        if (args["cartype"].length == 0) {
          count++;
        } else {
          var cartype = args["cartype"];

          if (typekey[i]["types"].length == 0) {
            count++
          }
          for (var ictype = 0; ictype < typekey[i]["types"].length; ictype++) {
            if (cartype.includes(typekey[i]["types"][ictype])) {
              count++;
              break;
            }
          }
          
        }
      }
      
      if (args["upperfpp"] !== undefined) {
        if (args["upperfpp"].length == 0) {
          count++;
        } else {
          var upperfpp = args["upperfpp"];
          var x = typekey[i]["fpplimit"];
          if (x >= upperfpp) {
            count++;
          }
        }
      }
      
      if (args["lowerweight"] !== undefined) {
        if (args["lowerweight"].length == 0) {
          count++;
        } else {
          var lowerweight = args["lowerweight"];
          var x = typekey[i]["lowerweight"];
          if (x <= lowerweight) {
            count++;
          }
        }
      }
      

      if (args["prohibited"] !== undefined) {
        if (args["prohibited"].length == 0) {
          count++;
        } else {
          var prohibiteds = args["prohibited"];
          for (var iprohibited = 0; iprohibited < prohibiteds.length; iprohibited++) {
            if (typekey[i]["prohibited"].includes(prohibiteds[iprohibited])) {
              count++;
              break;
            } else {
              break;
            }
          }
        }
      }

      if (count == total) {
        final.unshift(typekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  final = final.sort(function (a, b) {
    if (typeof sort !== 'undefined') {
      if (sort == "alphabet" || sort == "name" || sort == "Alphabetical Order") {
    return a["name"].toString().localeCompare(b["name"].toString());
  } else if (sort == "fppasc" || sort == "Lowest FPP") {
        return gtf_PERF.perf(a, "DEALERSHIP")["fpp"] - gtf_PERF.perf(b, "DEALERSHIP")["fpp"];
      } else if (sort == "fppdesc"|| sort == "Highest FPP") {
        return gtf_PERF.perf(b, "DEALERSHIP")["fpp"] - gtf_PERF.perf(a, "DEALERSHIP")["fpp"];
      } else if (sort == "costasc"|| sort == "Lowest Price") {
        a = gtf_CARS.costcalcraw(a, gtf_PERF.perf(a, "DEALERSHIP")["fpp"]);
        b = gtf_CARS.costcalcraw(b, gtf_PERF.perf(b, "DEALERSHIP")["fpp"]);
        return a - b;
      } else if (sort == "costdesc"|| sort == "Highest Price") {
        a = gtf_CARS.costcalcraw(a, gtf_PERF.perf(a, "DEALERSHIP")["fpp"]);
        b = gtf_CARS.costcalcraw(b, gtf_PERF.perf(b, "DEALERSHIP")["fpp"]);
        return b - a;
      } else {
        return a["name"].toString().localeCompare(b["name"]);
      }
    } else {
      return b["cost"] - a["cost"];
    }
  });
  return final
};

///////////////////////////////////

module.exports.tuninglist = function (part, gtfcar, embed, msg, userdata) {
  if (part["type"] == "Transmission") {
    var names = [
      [
        "__**Top Speed**__",
        " ",
        function (x) {
          return x;
        },
      ],
    ];
  }
  if (part["type"] == "Suspension") {
    var names = [
      [
        "__**Camber Angle**__",
        "in",
        function (x) {
          return x;
        },
      ],
      [
        "__**Toe Angle**__",
        "in",
        function (x) {
          return x;
        },
      ],
    ];
  }
    if (part["type"] == "Aero Kits") {
    var names = [
      [
        "__**Downforce Level**__",
        " ",
        function (x) {
          return x * 20;
        },
      ],
    ];
  }
  var tunevalues = gtfcar["perf"][part["type"].toLowerCase()]["tuning"];

  var list = [];

  for (var i = 0; i < names.length; i++) {
    if (tunevalues[i] == -999) {
      tunevalues[i] = 0;
    }
    if (tunevalues[i] < part["min"]) {
      tunevalues[i] = part["min"];
    }
    if (tunevalues[i] > part["max"]) {
      tunevalues[i] = part["max"];
    }
    var bar = [];
    for (var j = part["min"]; j < part["max"] + 1; j++) {
      if (j == tunevalues[i]) {
        bar.push(userdata["settings"]["ICONS"]["bar"][0]);
      } else {
        bar.push(userdata["settings"]["ICONS"]["bar"][1]);
      }
    }
    list.push(names[i][0] + " " + names[i][2](tunevalues[i]) + " "+ names[i][1] + "/n" + bar.join(""));
  }

  return list;
};

module.exports.checkpartsavail = function (part, gtfcar) {
  var fpp = gtf_PARTS.previewpart(part, gtfcar, "GARAGE")["fpp"].toString()

  var type = part["type"].toLowerCase().replace(/ /g, "")

  if (part["name"] == "Default") {
      if (gtfcar["perf"][type]["current"] == part["name"]) {
         return ["✅", "**" + gtfcar["fpp"] + "**"]
      }
     return ["","**" + fpp + "**"]
  }

  
  if (gtfcar["perf"][type]["list"].includes(part["name"])) {
      if (gtfcar["perf"][type]["current"] == part["name"]) {
        return ["✅", "**" + gtfcar["fpp"] + "**"];
      } else {
      return ["📦", "**" + fpp + "**"];
      }
  } else {
      return ["", "**" + fpp + "**"];
    }
};
module.exports.previewpart = function (part, car, condition) {
    var car5 = JSON.stringify(car);
    var car2 = JSON.parse(car5);
    var type = part["type"].toLowerCase().replace(/ /g, "")

  car2["perf"][type]["current"] = part["name"];
    if (typeof part["tuning"] !== 'undefined') {
      car2["perf"][type]["tuning"] = part["tuning"];
    }

if (type == "carengine") {
  car2["perf"]["engine"]["current"] = "Default"
  car2["perf"]["transmission"]["current"] = "Default"
  car2["perf"]["turbo"]["current"] = "Default"
}
  
    return gtf_PERF.perf(car2, condition);
};
module.exports.installpart = function (part, userdata) {
  var type = part["type"].toLowerCase().replace(/ /g, "")

  var installedpart = userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type];

  installedpart["current"] = part["name"];
  // update tuning values
  for (var i = 0; i < installedpart["tuning"].length; i++) {
    if (part["name"] == "Default") {
      installedpart["tuning"][i] = -999;
    } else {
      if (type == "aerokits") {
        installedpart["tuning"][i] = 3;
      } else {
    installedpart["tuning"][i] = 0;
    }
  }
  }
  /*
  if (type == "carengine") {
      installedpart["tuning"][0] = part["percent"]
  }
  */
  ////

  if (part["name"] != "Default" && !installedpart["list"].includes(part["name"])) {
    userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type]["list"].push(part["name"]);
  }

if (type == 'tires') {
    if (part["name"].includes("Racing")) {
     if (!installedpart["list"].includes("Racing: Intermediate")) {
    userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type]["list"].push("Racing: Intermediate");
  }
  if (!installedpart["list"].includes("Racing: Heavy Wet")) {
    userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type]["list"].push("Racing: Heavy Wet");
  }
  }
  if (part["name"].includes("Intermediate") || part["name"].includes("Heavy Wet")) {
      if (!installedpart["list"].includes("Racing: Hard")) {
    userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type]["list"].push("Racing: Hard");
  }
  }
}

if (type == "carengine") {
  userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"]["engine"]["current"] = "Default"
  userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"]["engine"]["list"] = ["Default"]
  
    userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"]["transmission"]["current"] = "Default"
  userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"]["turbo"]["current"] = "Default"
}

  userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["perf"][type] = installedpart;

  userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1]["fpp"] = gtf_PERF.perf(userdata["garage"][gtf_STATS.currentcarnum(userdata) - 1], "GARAGE")["fpp"];
};

module.exports.costcalc = function (part, gtfcar, ocar) {
  if (part["type"] == "Tires" || part["type"] == "Car Wash") {
    return part["cost"]
  }
  if (part["type"] == "Car Engine") {
    var car = gtf_CARS.find({ fullnames: [part["name"]] })[0]
    var cost = gtf_MATH.round(gtf_CARS.costcalcraw(car, gtf_PERF.perf(car, "DEALERSHIP")["fpp"])/1.5, 1);
    if (cost >= 150000) {
      return 150000
    } else {
      return Math.round(cost)
    }
  }
  var discount = gtf_PERF.perf(ocar, "DEALERSHIP")["fpp"]/500
  if (discount > 1) {
     discount = discount ** 2
  }
  if (part["type"] == "Engine Repair") {
    var totalcost = ((gtf_CARS.costcalc(ocar) * 0.25) * 0.28)
    return Math.round(totalcost * ((100-gtfcar["condition"]["engine"]) / 100))
  }
  if (part["type"] == "Transmission Repair") {
    var totalcost = ((gtf_CARS.costcalc(ocar) * 0.25) * 0.13)
    return Math.round(totalcost * ( (100 -gtfcar["condition"]["transmission"]) / 100))
  }
  if (part["type"] == "Suspension Repair") {
    var totalcost = ((gtf_CARS.costcalc(ocar) * 0.25) * 0.13)
    return Math.round(totalcost * ((100 - gtfcar["condition"]["suspension"]) / 100))
  }
  if (part["type"] == "Body Damage Repair") {
    var totalcost = ((gtf_CARS.costcalc(ocar) * 0.25) * 0.2)
    return Math.round(totalcost * ((100-gtfcar["condition"]["body"]) / 100))
  }
  return Math.round(part["cost"] * discount / 100) *100
};

//////////////
module.exports.audit = async function () {
  var parts = gtf_LISTS.gtfpartlist;
  var fs = require("fs");

  var names = Object.keys(parts);

  for (var i = 0; i < names.length; i++) {
    if (names[i] == "car-engine") {
      parts[names[i]] = parts[names[i]].sort((a, b) => a["name"].toString().localeCompare(b["name"]));
    }
   
  }
  console.log("Parts Updated.")
  fs.writeFile("./jsonfiles/gtfpartlist.json", require("json-format")(parts), function (err) {
    if (err) {
      console.log(err);
    }
  });
  

};