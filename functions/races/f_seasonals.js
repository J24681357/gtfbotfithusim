const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.randomseasonal = function (regulations, level, number, seed) {
  if (typeof regulations === 'string') {
    event = {}
  }

  var lowerfpp = 200
var upperfpp = 500
  var fpplimit = 500

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
    } else if (x == "Race Car") {
      loop = 20
    } else if (x == "Concept" || x == "Formula") {
      loop = 10
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })
  var cartype = [gtf_TOOLS.randomItem(cartypes, seed)]
  
  var creditsmulti = 1
  var rmake = []
  var rcountry = []
  var bop = false

  if (cartype[0].includes("Aftermarket")) {
    cartype = ["Production", "Aftermarket"]
  }

  var makes = gtf_CARS.list("makes");
  var countries = gtf_CARS.list("countries");
  
  finalfpp = fpplimit

  var makesfilter = makes.filter(function(x) {
    var list = gtf_CARS.find({ makes: [x], types: cartype })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })
  console.log(makesfilter)

  if (makesfilter.length == 0) {
    rmake = []
    cartypes = ["Production"]
  } else {
    rmake = [gtf_TOOLS.randomItem(makesfilter, seed)]
  }
  
/*
  if (cartype[0].includes("Production")) {
  
  if (gtf_MATH.randomIntSeed(1,4, seed) >= 2) {
  var makesfilter = makes.filter(function(x) {
    var list = gtf_CARS.find({ makes: [x], types: types })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })

  if (makesfilter.length == 0) {
    rmake = []
  } else {
    rmake = [gtf_TOOLS.randomItem(makesfilter, seed)]
  }
  lowerfpp = finalfpp - 100
  } else {
  var countriesfilter = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x] })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= finalfpp)
  })

  if (countriesfilter.length == 0 || gtf_MATH.randomIntSeed(1,3, seed) == 1) {
  } else {
    rcountry = [gtf_TOOLS.randomItemSeed(countriesfilter, seed)]
  }
  lowerfpp = finalfpp - 100
  }

  }
*/
  if (cartype[0].includes("Race Car")) {
    creditsmulti = 3
    lowerfpp = 0
    bop = true
  }

  var tracks = [];
  var difficulty = 90

  var eventid = "SEASONAL" + "-" + number;
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

  var time = [gtf_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gtf_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast"], seed)]
  var gridstart = ["STANDING", "ROLLINGSTART"][gtf_MATH.randomIntSeed(0, 1, seed)]


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
    "tracks": tracks,
    "type": "LAPS",
    "time": time,
    "timeprogression": 1,
    "weather": weather,
    "weatherwetsurface": "R", 
    "weatherchange": 0,
    "tireconsumption": 0, 
    "fuelconsumption": 0, 
    "grid": [
       grid
    ],
    "gridstart": gridstart,
    "difficulty": difficulty,
    "damage": true,
    "bop": false,
    "championship": false,
    "car": "GARAGE",
    "regulations": {
      "tires": "Racing: Soft",
      "fpplimit": fpplimit,
      "upperfpp": fpplimit,
      "lowerfpp": lowerfpp,
      "upperpower": 9999,
      "lowerpower": 0,
      "upperweight": 9999,
      "lowerweight": 0,
      "upperyear": 9999,
      "loweryear": 0,
      "countries": rcountry,
      "makes": rmake,
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
