const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.speedcalc = function (number, gtfcar) {
  var rnorm = require("random-normal");
  total = 0
  for (var i = 0; i < 10; i++) {
    total = total + rnorm({ mean: number * 1.43, dev: 5 })
  }

  var topspeed = total/10
  var finalgear = gtfcar["perf"]["transmission"]["tuning"][0];
  if (finalgear == -999) {
    finalgear = 0
  }
  var aero = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })["aerom"]

  if (aero > 1) {
    var x = 5/(aero/5)
    topspeed = topspeed - (4/(1/x))
  }
  if (finalgear <= 0) {
    topspeed = topspeed * (1 - 0.04 * Math.abs(finalgear));
  } else {
    topspeed = topspeed * (1 + 0.01 * Math.abs(finalgear));
  }
  return [Math.round(topspeed * 1.60934), Math.round(topspeed)];
};
module.exports.perf = function (gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];

  if (condition == "DEALERSHIP") {
    var value = gtf_CARS.costcalc(gtfcar)
    var sell = gtf_MARKETPLACE.sellcalc(value);

    var offset = 3000 - weight;
    offset = Math.round(offset / 30);

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }
    var aero = (aero - 1) * 30;

   var fpp1 = 22 * Math.pow(power, (0.5 + ((gtfcar["aerom"]-1) * 0.008))) - 50
    var fpp2 = ( (3000 - gtfcar["weight"])/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((gtfcar["aerom"]-1) * 5)
    var fpp = fpp1 + (fpp2 /1200) * fpp3

    return { fpp: Math.round(fpp),
            opower: power,
            power: power,
            oweight: weight,
            weight: weight,
            osell: gtfcar["cost"],
            sell: sell };
  }

  if (condition == "GARAGE") {
    var car = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })
    var condition = gtf_CONDITION.condition(gtfcar)

    power = car["power"];
    weight = car["weight"];
    aero = car["aerom"];
    drivetrain = car["drivetrain"];

    var value = gtf_CARS.costcalc(car)
    var sell = gtf_MARKETPLACE.sellcalc(value,condition["health"]);
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = gtf_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = gtf_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = gtf_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = gtf_PARTS.find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = gtf_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = gtf_PARTS.find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = gtf_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];
    var carengine = gtf_PARTS.find({ name: gtfcar["perf"]["carengine"]["current"], type: "carengine" })[0];
    if (carengine !== undefined) {
      power = carengine["percent"]
      weight = weight + (weight * (carengine["weight"]))
      value += carengine["cost"]
      sell += gtf_MARKETPLACE.sellcalc(carengine["cost"]);
    }
    if (engine !== undefined) {
      var enginep = (100 + engine["percent"]) / 100;
      power = power * enginep;
      value += engine["cost"]
      sell += gtf_MARKETPLACE.sellcalc(engine["cost"]);
    }
    if (suspension !== undefined) {
      var suspp = suspension["percent"] / 100;
      aero = aero * suspp;
      value += suspension["cost"]
      sell += gtf_MARKETPLACE.sellcalc(suspension["cost"]);
    }
    if (weightred !== undefined) {
      var weightredp = (100 - weightred["percent"]) / 100;
      if (carengine !== undefined) {
        weight = (weight * weightredp) + (weight*0.05)
      } else {
      weight = weight * weightredp;
      }
      value += weightred["cost"]
      sell += gtf_MARKETPLACE.sellcalc(weightred["cost"]);
    }
    if (turbo !== undefined) {
      var turbop = (100 + turbo["percent"]) / 100;
      power = power * turbop;
      value += turbo["cost"]
      sell += gtf_MARKETPLACE.sellcalc(turbo["cost"]);
    }
    if (brakes !== undefined) {
      var brakesp = brakes["percent"] / 100;
      aero = aero * brakesp;
      value += brakes["cost"]
      sell += gtf_MARKETPLACE.sellcalc(brakes["cost"]);
    }
    if (aeropart !== undefined) {
      var aeropartp = (100 + aeropart["percent"]) / 100;
      if (aeropart["name"] != "Default") {
        if (gtfcar["perf"]["aerokits"]["tuning"][0] == 0 || gtfcar["perf"]["aerokits"]["tuning"][0] == -999) {
         aero = aero * aeropartp
        } else {
          aero = aero * (aeropartp + (0.1*(gtfcar["perf"]["aerokits"]["tuning"][0]-3)));
        }
      }
      value += aeropart["cost"]
      sell += gtf_MARKETPLACE.sellcalc(aeropart["cost"]);
    }
    ///////
    var oil = gtfcar["condition"]['oil']
    if (oil <= 60) {
      power = power - (power * (0.05 * ((60-oil)/60) ) )
    }
    var enginecond = gtfcar["condition"]['engine']
    if (enginecond <= 30) {
      power = power - (power * (0.10 * ((30-enginecond)/30) ) )
    }
    ///////

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }

      var fpp1 = 22 *Math.pow(power, (0.5 + ((aero-1) * 0.008))) - 50
    var fpp2 = ( (3000 - weight)/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((aero-1) * 5)

    var newfpp = fpp1 + (fpp2 /1200) * fpp3


    return { fpp: Math.round(newfpp),
            opower: car["power"],
            power: Math.round(power),
            oweight: car["weight"],
            weight: Math.round(weight),
            value: value,
            osell: Math.round(osell),
            sell: Math.round(sell) };
  }
};
module.exports.perfnew = function (gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];

  if (condition == "DEALERSHIP") {
    var value = gtf_CARS.costcalc(gtfcar)
    var sell = gtf_MARKETPLACE.sellcalc(value);

    var offset = 3000 - weight;
    offset = Math.round(offset / 30);

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }
    
    //var aero = (aero - 1) * 30;
      
   var fpp1 = aero - 1

  
   var fpp2 = 22 * Math.pow(power, (0.5 + ((fpp1) * 0.008))) - 50
    var fpp3 = ( (3000 - gtfcar["weight"])/30 ) + 100
    var fpp4 = (900 * offset_dt) + ((fpp1) * 5)
    var fpp = fpp2 + (fpp3 /1200) * fpp4
//////////
    var nfpp1 = (aero - 1) 

   if (gtfcar["tires"].includes("Comfort")) {
     var tirechoices = {"Comfort: Hard": 0, "Comfort: Medium": 1, "Comfort: Soft": 2}
    var rank = tirechoices[gtfcar["tires"]]
    rank = rank - 2
    nfpp1 = nfpp1 + (0.4*rank)
  } 
  if (gtfcar["tires"].includes("Sports")) { 
    var tirechoices = {"Sports: Hard": 0, "Sports: Medium": 1, "Sports: Soft": 2}
    var rank = tirechoices[gtfcar["tires"]]
    nfpp1 = nfpp1 + (0.5*rank) 
  } 
  if (gtfcar["tires"].includes("Racing")) {
    var tirechoices = {"Racing: Hard": 0, "Racing: Medium": 1, "Racing: Soft": 2}
    var rank = tirechoices[gtfcar["tires"]]
    rank = rank - 2
    nfpp1 = nfpp1 + (0.5*rank) + 1.4
  }
    //0.5
    ///weight 35
    var powerratio = (gtfcar["power"]/gtfcar["weight"]) - 0.50
   var nfpp2 = 22 * Math.pow(power, (0.5 + ((nfpp1) * 0.008))) - 50
    var nfpp3 = ( (3000 - gtfcar["weight"])/15 ) + 100
    var nfpp4 = (900 * offset_dt) + ((nfpp1) * 5)
    var nfpp = nfpp2 + (nfpp3 /1200) * nfpp4
    
    nfpp = (nfpp * 1) + (20 * (powerratio)) + 25

                    

    return { fpp: Math.round(fpp),
            nfpp:  Math.round(nfpp),
            opower: power,
            power: power,
            oweight: weight,
            weight: weight,
            osell: gtfcar["cost"],
            sell: sell };
  }

  if (condition == "GARAGE") {
    var car = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })
    var condition = gtf_CONDITION.condition(gtfcar)

    power = car["power"];
    weight = car["weight"];
    aero = car["aerom"];
    drivetrain = car["drivetrain"];

    var value = gtf_CARS.costcalc(car)
    var sell = gtf_MARKETPLACE.sellcalc(value,condition["health"]);
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = gtf_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = gtf_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = gtf_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = gtf_PARTS.find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = gtf_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = gtf_PARTS.find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = gtf_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];
    var carengine = gtf_PARTS.find({ name: gtfcar["perf"]["carengine"]["current"], type: "carengine" })[0];
    if (carengine !== undefined) {
      power = carengine["percent"]
      weight = weight + (weight * (carengine["weight"]))
      value += carengine["cost"]
      sell += gtf_MARKETPLACE.sellcalc(carengine["cost"]);
    }
    if (engine !== undefined) {
      var enginep = (100 + engine["percent"]) / 100;
      power = power * enginep;
      value += engine["cost"]
      sell += gtf_MARKETPLACE.sellcalc(engine["cost"]);
    }
    if (suspension !== undefined) {
      var suspp = suspension["percent"] / 100;
      aero = aero * suspp;
      value += suspension["cost"]
      sell += gtf_MARKETPLACE.sellcalc(suspension["cost"]);
    }
    if (weightred !== undefined) {
      var weightredp = (100 - weightred["percent"]) / 100;
      if (carengine !== undefined) {
        weight = (weight * weightredp) + (weight*0.05)
      } else {
      weight = weight * weightredp;
      }
      value += weightred["cost"]
      sell += gtf_MARKETPLACE.sellcalc(weightred["cost"]);
    }
    if (turbo !== undefined) {
      var turbop = (100 + turbo["percent"]) / 100;
      power = power * turbop;
      value += turbo["cost"]
      sell += gtf_MARKETPLACE.sellcalc(turbo["cost"]);
    }
    if (brakes !== undefined) {
      var brakesp = brakes["percent"] / 100;
      aero = aero * brakesp;
      value += brakes["cost"]
      sell += gtf_MARKETPLACE.sellcalc(brakes["cost"]);
    }
    if (aeropart !== undefined) {
      var aeropartp = (100 + aeropart["percent"]) / 100;
      if (aeropart["name"] != "Default") {
        if (gtfcar["perf"]["aerokits"]["tuning"][0] == 0 || gtfcar["perf"]["aerokits"]["tuning"][0] == -999) {
         aero = aero * aeropartp
        } else {
          aero = aero * (aeropartp + (0.1*(gtfcar["perf"]["aerokits"]["tuning"][0]-3)));
        }
      }
      value += aeropart["cost"]
      sell += gtf_MARKETPLACE.sellcalc(aeropart["cost"]);
    }
    ///////
    var oil = gtfcar["condition"]['oil']
    if (oil <= 60) {
      power = power - (power * (0.05 * ((60-oil)/60) ) )
    }
    var enginecond = gtfcar["condition"]['engine']
    if (enginecond <= 30) {
      power = power - (power * (0.10 * ((30-enginecond)/30) ) )
    }
    ///////

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }

      var fpp1 = 22 *Math.pow(power, (0.5 + ((aero-1) * 0.008))) - 50
    var fpp2 = ( (3000 - weight)/30 ) + 100
    var fpp3 = (900 * offset_dt) + ((aero-1) * 5)

    var newfpp = fpp1 + (fpp2 /1200) * fpp3


    return { fpp: Math.round(newfpp),
            opower: car["power"],
            power: Math.round(power),
            oweight: car["weight"],
            weight: Math.round(weight),
            value: value,
            osell: Math.round(osell),
            sell: Math.round(sell) };
  }
};
module.exports.topspeed = function (car) {
  var sellperf = gtf_PERF.sell(car);
  var lowest = Math.floor(100 + sellperf ** 0.475 - 30);
  var highest = Math.floor(100 + sellperf ** 0.475);

  var speed = gtf_MATH.randomInt(lowest, highest);
  return [Math.round(speed * 1.60934), speed];
};
module.exports.tirewearcalc = function(racesettings, tire) {
  var tires = {"Comfort: Hard": 700, "Comfort: Medium": 660, "Comfort: Soft": 620,
              "Sports: Hard": 580, "Sports: Medium": 450, "Sports: Soft": 360,
              "Racing: Heavy Wets": 60, "Racing: Intermediate": 135, "Racing: Hard": 270, "Racing: Medium": 180, "Racing: Soft": 90, "Rally: Dirt": 1000,"Rally: Snow": 1000}
  var total = tires[tire]
  var length = racesettings["distance"]["km"] / 20
  10030
  var weathernum = racesettings["weather"]["wetsurface"]
  if (tire.includes("Rally")) {
    return 0
  }
  if (weathernum <= 33) {
    return 100 * (length/(total / racesettings["tireconsumption"]))
  } else {
    return 100 * ((length/(total / racesettings["tireconsumption"])) * (1 - ((weathernum-33)/70)))
  }
}

module.exports.tires = function(fpp, car, weather, racesettings) {
  var tireclass = car["tires"].split(":")[0]
  var weathernum = weather["wetsurface"]

  if (tireclass == "Comfort") {
     var tirechoices = {"Comfort: Hard": 1, "Comfort: Medium": 2, "Comfort: Soft": 3}
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.006) - fpp)
    while (rank > 0) {
      fpp = fpp + increment
      if (car["user"]) {
      }
        rank--
    }
    
  } 
  else if (tireclass == "Sports") { 
    var tirechoices = {"Sports: Hard": 1, "Sports: Medium": 2, "Sports: Soft": 3}
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.02) - fpp)
    while (rank > 0) {
      fpp = fpp + increment
      if (car["user"]) {
      }
        rank--
    }
  } 
  else if (tireclass == "Racing") {
    var tirechoices = {"Racing: Intermediate": -2, "Racing: Heavy Wet": -1, "Racing: Hard": 1, "Racing: Medium": 2, "Racing: Soft": 3}
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.03) - fpp)
    while (rank > 0) {
      var multiplier = 1
      if (weathernum < 33) {
      fpp = fpp + ((increment) * multiplier)
      } else {
        if (car["user"]) {
      fpp = (fpp+increment) - (fpp) * ((1/6) * (weathernum/100))
        break;
        }
      }
      
      if (rank >= 2) {
        multiplier = 0.5
      }
        rank--
    }

  }
  
  var tirewear = car["tirewear"]
  fpp = fpp - (30 * ((100-car["tirewear"])/100))
  if (car["user"]) {
  }
  return Math.round(fpp)
}
