const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.changeseasonals = function (force) {
  var fs = require("fs")
  var seasonals = {};
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 setInterval(function () {
    MongoClient.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("GTFitness");
      dbo
        .collection("SEASONALS")
        .find({ id: "1234567" })
        .forEach(row => {
          if (seasonalcheck(row["races"]) || force) {
                  var date = new Date();
      var month = date.getMonth();
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      var year = date.getFullYear();
      var currentdate = month + day + year;
            if (!row["count"].includes(currentdate)) {
                  row["count"].push(currentdate)
            }
             if (row["count"].length >= 4 || force) {
            console.log("Seasonals has been changed.");
            var seasonals = gtf_SEASONAL.randomseasonalb(1, 400, 250);
            var seasonals2 = gtf_SEASONAL.randomseasonalb(2, 500, 350);
            var seasonals3 = gtf_SEASONAL.randomseasonalb(3, 750, 500);

            var extra = JSON.parse(fs.readFileSync("./jsonfiles/gtfseasonalsextra.json", "utf8"));

  if (Object.keys(extra).length == 0) {

            row = {
              id: "1234567",
              races: { seasonals, seasonals2, seasonals3 },
              count: [currentdate]
            };
  } else {
    extra["date"] = currentdate
    seasonals = extra
    row = {
              id: "1234567",
              races: { seasonals, seasonals2, seasonals3 },
              count: [currentdate]
            };
    fs.writeFile("./jsonfiles/gtfseasonalsextra.json", JSON.stringify({}), function (err) {
    if (err) {
      console.log(err);
    }
  });
  }

          }
          dbo.collection("SEASONALS").replaceOne({ id: "1234567" }, row);
        }
        })
        .then(() => {
          db.close();
        });
    });

    function seasonalcheck(seasonal) {
      seasonal = seasonal["seasonals"];
      var date = new Date();
      var month = date.getMonth();
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      var year = date.getFullYear();
      var currentdate = month + day + year;
      if (typeof seasonal === 'undefined') {
        return true;
      }
      if (typeof seasonal["date"] === 'undefined') {
        return true;
      }
      return currentdate != seasonal["date"];
    }
 }, 1000 * 60 * 5);
};

module.exports.randomseasonal = function (regulations, level, number, seed) {
  if (typeof regulations === 'string') {
    event = {}
  }

  var lowerfpp = 200
var upperfpp = 600
  var fpplimit = 600

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var types = []
  var countries = []
  
  var cartypes = []
  gtf_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 60
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })
  
  // gtf_MATH.weightedSample(cc)
  
  var cartype = [gtf_TOOLS.randomItem(cartypes, seed)]
  

  var creditsmulti = 1
  var rmake = []
  var rcountry = []
  var finalfpp = 9999
  var bop = false

  if (cartype[0].includes("Aftermarket")) {
    cartype = ["Production", "Aftermarket"]
  }

  if (cartype[0].includes("Production")) {
  finalfpp = Math.ceil(gtf_MATH.randomInt(lowerfpp, fpplimit) / 10) * 10;
  var makes = gtf_CARS.list("makes");
  var countries = gtf_CARS.list("countries");
  if (gtf_MATH.randomInt(1,4) <= 2) {
  var makesfilter = makes.filter(function(x) {
    var list = gtf_CARS.find({ make: [x], types: types })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })

  if (makesfilter.length == 0 || gtf_MATH.randomInt(1,3) == 1) {
    rmake = []
  } else {
    rmake = [makesfilter[Math.floor(Math.random() * makesfilter.length)]]
  }
  lowerfpp = finalfpp - 100
  } else {
  var countriesfilter = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x] })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })

  if (countriesfilter.length == 0 || gtf_MATH.randomInt(1,3) == 1) {
  } else {
    rcountry = [countriesfilter[Math.floor(Math.random() * countriesfilter.length)]]
  }
  lowerfpp = finalfpp - 100
  }

  }

  if (cartype[0].includes("Race Car")) {
    creditsmulti = 3
    lowerfpp = 0
    bop = true
  }

  var tracks = [];
  var difficulty

  var eventid = "SEASONAL" + level + "-" + number;
  if (level == "A") {
    var grid = gtf_MATH.randomInt(6, 11);
    var startingprize = 3000;
    var tracksnum = gtf_MATH.randomInt(3,5);
    var limit = 8.0;
    difficulty = 70
  }
  if (level == "IB") {
    var grid = gtf_MATH.randomInt(12, 16);
    var startingprize = 5000;
    var tracksnum = gtf_MATH.randomInt(3,5);
    var limit = 13.0;
    difficulty = 50
  }
  if (level == "IA") {
    var grid = gtf_MATH.randomInt(16, 20);
    var startingprize = 10000;
    var tracksnum = gtf_MATH.randomInt(3,5);
    var limit = 20.0;
    difficulty = 30
  }
  for (var x = 0; x < tracksnum; x++) {
    var track = gtf_TRACKS.random({types:["Tarmac"]}, 1)[0];
    var km = track.length;
    var distance = gtf_RACE.lapcalc(km, limit);
    tracks.push([x + 1, track.name, distance[0]]);
  }

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;
if (cartype[0].includes("Production")) {
  if (gtf_MATH.randomInt(0, 1) == 1) {
  var prizec = ["CREDITS", { id: -1, name: " ", item: prize * tracksnum }];
  } else {
    var c = gtf_CARS.random({ upperfpp: finalfpp + 100, lowerfpp: finalfpp - 150 }, 1)[0];
    var prizec = ["RANDOMCAR", { id: -1, make: [c["make"]], fullname: [c["name"] + " " + c["year"]] }];
  }
} else {
   if (gtf_MATH.randomInt(0, 1) == 1) {
  var prizec = ["CREDITS", { id: -1, name: " ", item: prize * tracksnum }];
  } else {
    var prizec = ["RANDOMCAR", { id: -1, types: [cartype[0]]}];
  }
}
  var rtimeint = gtf_MATH.randomInt(0, 1);
  if (rtimeint == 0) {
    time = "Day";
  } else {
    time = "Night";
  }
  var rweather = ["Clear", "Partly Cloudy", "Overcast"][gtf_MATH.randomInt(0, 2)]


  var event = {
    "title": "🎉 " + number + ". " + "Event",
    "eventid": eventid,
    "positions": [
      {
        "place": "1st",
        "credits": 2000
      }
    ],
    "startposition": 6,
    "tracks": [
      [
        1,
        "High Speed Ring (2010s)",
        2
      ],
      [
        2,
        "Autodrome Lago Maggiore - Center",
        3
      ],
      [
        3,
        "Autodrome Lago Maggiore - Center Reverse",
        4
      ]
    ],
    "type": "LAPS",
    "time": [
      "Day",
      "Sunrise",
      "Sunset"
    ],
    "timeprogression": 1,
    "weather": rweather,
    "weatherwetsurface": "R", 
    "weatherchange": 0,
    "tireconsumption": 0, 
    "fuelconsumption": 0, 
    "grid": [
       8
    ],
    "gridstart": "STANDING",
    "difficulty": 90,
    "damage": true,
    "bop": false,
    "championship": false,
    "car": "GARAGE",
    "regulations": {
      "tires": "Sports: Soft",
      "fpplimit": 350,
      "upperfpp": 290,
      "lowerfpp": 100,
      "upperpower": 9999,
      "lowerpower": 0,
      "upperweight": 9999,
      "lowerweight": 0,
      "upperyear": 9999,
      "loweryear": 0,
      "countries": [

      ],
      "makes": [

      ],
      "models": [

      ],
      "engines": [

      ],
      "drivetrains": [

      ],
      "types": cartype,
      "special": [

      ],
      "prohibited": [
        "Truck",
        "SUV"
      ]
    },
    "prize": {
      "id": -1,
      "name": "",
      "type": "CREDITS",
      "item": 5000
    }
  }
  event["mode"] = "CAREER"
  event["positions"] = gtf_RACE.calculatecredits(event)

  return event;
};
