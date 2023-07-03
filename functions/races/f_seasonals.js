const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.randomseasonal = function (regulations, level, number, seed) {
  var difficulty = 90
  if (level == "A") {
    var grid = gtf_MATH.randomIntSeed(6, 11, seed);
    var startingprize = 5000;
    var tracksnum = gtf_MATH.randomIntSeed(2,3, seed);
    var trackids = [1,2,3]
    var limit = 10.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(300,499, seed) / 10) * 10

    difficulty = 70
  }
  if (level == "IB") {
    var grid = gtf_MATH.randomIntSeed(12, 16, seed);
    var startingprize = 5000;
    var tracksnum = gtf_MATH.randomIntSeed(3,5, seed);
    var limit = 13.0;
    difficulty = 50
  }
  if (level == "IA") {
    var grid = gtf_MATH.randomIntSeed(16, 20, seed);
    var startingprize = 10000;
    var tracksnum = gtf_MATH.randomIntSeed(3,5, seed);
    var limit = 20.0;
    difficulty = 30
  }
  if (typeof regulations === 'string') {
    event = {}
  }


  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var countries = []
  
  /// Cartype
  var cartypes = []
  var types = []
  gtf_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 55
    } else if (x == "Race Car") {
      loop = 30
    } else if (x == "Concept" || x == "Formula" || x == "Rally Car") {
      loop = 15
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })

  if (level == "A") {
    var cartype = ["Production"]
  } else {
  var cartype = [gtf_TOOLS.randomItem(cartypes, seed)]
  }
  /////
  var rmake = []
  var rcountry = ""
  var bop = false

  if (cartype[0].includes("Aftermarket")) {
    cartype = ["Production", "Aftermarket"]
  }

  var makes = gtf_CARS.list("makes");
  var countries = gtf_CARS.list("countries");
  
  var makesfilter = makes.filter(function(x) {
    var list = gtf_CARS.find({ makes: [x], types: cartype })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= fpplimit)
  })

  if (makesfilter.length == 0) {
    rmake = []
    cartype = ["Production"]
  } else {
    rmake = [gtf_TOOLS.randomItem(makesfilter, seed)]
  }

  ////
  var countriesfilter = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x], types: cartype })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= fpplimit)
  })

  if (countriesfilter.length == 0) {
    rcountry = ""
  } else {
    rcountry = [gtf_TOOLS.randomItem(countriesfilter, seed)]
  }
  
/*
  if (cartype[0].includes("Production")) {
  
  if (gtf_MATH.randomIntSeed(1,4, seed) >= 2) {
  var makesfilter = makes.filter(function(x) {
    var list = gtf_CARS.find({ makes: [x], types: types })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= fpplimit)
  })

  if (makesfilter.length == 0) {
    rmake = []
  } else {
    rmake = [gtf_TOOLS.randomItem(makesfilter, seed)]
  }
  lowerfpp = fpplimit - 100
  } else {
  var countriesfilter = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x] })
    return list.length >= 3 && list.some(y => gtf_PERF.perf(y, "DEALERSHIP")["fpp"] <= fpplimit)
  })

  if (countriesfilter.length == 0 || gtf_MATH.randomIntSeed(1,3, seed) == 1) {
  } else {
    rcountry = [gtf_TOOLS.randomItemSeed(countriesfilter, seed)]
  }
  lowerfpp = fpplimit - 100
  }

  }
*/
  ///choosing
  var choose = ["Make", "Type", "Country"]
  var indexr = 0 //gtf_MATH.randomIntSeed(0,choose.length-1, seed)
choose = choose[indexr]
  
  var subtitle = ""
if (choose == "Make") {
  subtitle = rmake[0]
  rcountry = ""
  cartype = [""]
} else if (choose == "Type") {
  subtitle = cartype[0]
  rcountry = ""
  rmake = ""
} else if (choose = "Country") {
  subtitle = rcountry
  cartype = [""]
  rmake = ""
}
  
  var creditsmulti = 1
  if (cartype[0].includes("Race Car") || cartype[0].includes("Rally Car")) {
    creditsmulti = 2
    lowerfpp = 0
    bop = true
  }

  var tracks = [];

  var eventid = "SEASONAL" + level + "-" + number;
  
  for (var x = 0; x < tracksnum; x++) {
    var track = gtf_TRACKS.random({types:["Tarmac"], seed: seed + trackids[x]}, 1)[0]
    var km = track.length;
    var distance = gtf_RACE.lapcalc(km, limit);
    tracks.push([x + 1, track.name, distance[0]]);
  }

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;
  
if (cartype[0].includes("Production")) {
  if (gtf_MATH.randomIntSeed(0, 1, seed) == 1) {

  var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "CREDITS",
      "item": prize * tracksnum
    }
  } else {
    var c = gtf_CARS.random({ upperfpp: fpplimit + 50, lowerfpp: fpplimit - 50 }, 1)[0];
    var prizec =  {
      "id": -1,
      "name": "Gold Reward",
      "type": "RANDOMCAR",
      "item": {
        "makes": [
           c["make"]
        ],
        "fullnames": [c["name"] + " " + c["year"]]
      }
    }
  }
} else {
   if (gtf_MATH.randomIntSeed(0, 1, seed) == 1) {
  var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "CREDITS",
      "item": prize * tracksnum
    }
  } else {
    var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "RANDOMCAR",
      "item": { types: [cartype[0]]}
    }
  }
  
}

  var time = [gtf_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gtf_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast"], seed)]
  var gridstart = ["STANDING", "ROLLINGSTART"][gtf_MATH.randomIntSeed(0, 1, seed)]


  var event = {
    "title": subtitle + " " + "Seasonal Event",
    "eventid": eventid,
    "positions": [
      {
        "place": "1st",
        "credits": startingprize
      }
    ],
    "startposition": 6,
    "tracks": tracks,
    "type": "LAPS",
    "time": time,
    "timeprogression": 1,
    "weather": weather,
    "weatherwetsurface": 0, 
    "weatherchange": 0,
    "tireconsumption": 1, 
    "fuelconsumption": 0, 
    "grid": [
       grid
    ],
    "gridstart": gridstart,
    "difficulty": difficulty,
    "damage": true,
    "bop": true,
    "championship": false,
    "car": "GARAGE",
    "regulations": {
      "tires": "Racing: Soft",
      "fpplimit": fpplimit,
      "upperfpp": fpplimit,
      "lowerfpp": fpplimit - 30,
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
    "prize": prizec
  }
  event["mode"] = "CAREER"
  event["positions"] = gtf_RACE.calculatecredits(event)

  return event;
};
