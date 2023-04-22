var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var sponsors = gtf_LISTS.gtfsponsors;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "names") {
    results = Object.keys(sponsors).map(function (x) {
      return sponsors[x]["name"]
    });
    return results;
  }
}

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var gtfsponsors = gtf_LISTS.gtfsponsors;
  var final = [];
  var ids = Object.keys(gtfsponsors);

  for (var key = 0; key < ids.length; key++) {
    var idkey = gtfsponsors[ids[key]];

      var count = 0;

      if (args["name"] !== undefined) {
        if (args["name"].length == 0) {
          count++;
        } else {
          var names = args["name"];
          for (var iname = 0; iname < names.length; iname++) {
            if (idkey["name"].includes(names[iname])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            if (idkey["type"].toLowerCase().replace(/-/,"_").replace(/ /g, "_").includes(types[itype].toLowerCase().replace(/-/,"_").replace(/ /g, "_"))) {
              count++;
              break;
            }
          }
        }
      }

      if (count == total) {
        final.push(idkey);
      }
  }
  if (final.length == 0) {
    return "";
  }

  return final;
};

module.exports.creditbonus = function (credits, gtfcar, userdata) {
  if (userdata["sponsor"]["name"] == "None") {
    return 0
  }
  var sponsor = gtf_SPONSORS.find({"name":[userdata["sponsor"]["name"]]})[0]

  if (sponsor["type"] == "Rims") {
    if (gtfcar["rims"]["current"].includes(sponsor["require"][0])) {
    return Math.round(credits * (sponsor["percent"] / 100))
  } else {
    return 0
  }
  }

  if (sponsor["type"] == "Cars") {
    var re = new RegExp("^" + sponsor["name"], 'ig');
    if (gtfcar["name"].match(re)) {
    return Math.round(credits * (sponsor["percent"] / 100))
  } else {
    return 0
  }
  }

  return 0

};

module.exports.audit = function (gtfcars, gtfwheels) {
  var fs = require("fs");
  var sponsors = {};

  var makes = gtf_CARS.list("makes");
  var makesfilter = makes
    .filter(function (x) {
      var list = gtf_CARS.find({ make: [x], types: ["Production", "Aftermarket"] });
      return list.length >= 5;
    })
    .map(function (x) {
      sponsors[x.toLowerCase()] = {
        name: x,
        license: "N", level: 10,
        type: "Cars",
        require: [x],
        levels: [1000, 2500, 5000],
        percent: 10,
        bonus: "credits",
      };
    });

  var wheelmakes = gtf_WHEELS.list("makes");
  wheelmakes.map(function (x) {
    sponsors[x.toLowerCase()] = {
      name: x,
      license: "N", level: 5,
      type: "Rims",
      require: [x],
      levels: [700, 1500, 3000],
      percent: 5,
      bonus: "credits",
    };
  });

  fs.writeFile("./jsonfiles/gtfsponsors.json", JSON.stringify(sponsors), function (err) {
    if (err) {
      console.log(err);
    }
  });
};
