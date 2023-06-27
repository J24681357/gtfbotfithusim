var dir = "../";
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.checklevel = function (level, embed, msg, userdata) {
  var exp = gtf_STATS.exp(userdata);
  var currentlevel = gtf_STATS.level(userdata);
  if (currentlevel >= level || level == 0) {
    return true;
  } else {
    gtf_EMBED.alert({ name: "❌ " + "Level " + level + " Required", description: "🔒 Your level does not meet the requirements." + "\n\n" + "**Lv." + currentlevel + gtf_EMOTE.exp + " -> " + "Lv." + level + "**", embed: "", seconds: 10 }, msg, userdata);
    return false;
  }
};

module.exports.createexpbar = function (userdata) {
  var progress = userdata["settings"]["ICONS"]["bar"][0];
    var progressb = userdata["settings"]["ICONS"]["bar"][1];
    var expbar = [progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb];
    
    var nextlevel = gtf_STATS.level(userdata) + 1;
    if (nextlevel >= 50) {
      nextlevel = 50;
    }
    var nextlevelexp = gtf_LISTS.gtfexp[nextlevel.toString()]["exp"];

    var curr = gtf_STATS.level(userdata)
    var currexp = gtf_STATS.exp(userdata);
    var currlevelexp = gtf_LISTS.gtfexp[curr.toString()]["exp"];
    for (var i = 0; i < expbar.length; i++) {
      if (currlevelexp <= currexp) {
        currlevelexp += nextlevelexp / 10
        expbar[i] = progress;
      }
    }
  return expbar
}

module.exports.islevelup = function (userdata) {
  var exp = gtf_STATS.exp(userdata);
  var level = gtf_STATS.level(userdata);
  var levelup = 0;
  var leveldetails = [""];
  var explevels = gtf_LISTS.gtfexp;

  for (var i = level; i < Object.keys(explevels).length; i++) {
    if (exp >= explevels[(i + 1).toString()]["exp"]) {
      levelup++;
      if (typeof explevels[(i + 1).toString()]["rewards"] != "undefined") {
        for (var j = 0; j < explevels[(i + 1).toString()]["rewards"].length; j++) {
          if (explevels[(i + 1).toString()]["rewards"][j].includes("Car Reward")) {
            gtf_EXP.levelreward(explevels[(i + 1).toString()]["rewards"][j], userdata);
          }
        }
        leveldetails.push(explevels[(i + 1).toString()]["rewards"].slice(0,2).join("/n"));
      }
    } else {
      break;
    }
  }
  gtf_STATS.addlevel(levelup, userdata);
  var bool = (levelup >= 1)
  return [bool, levelup, leveldetails.slice(0, 5).join("\n")];
};

module.exports.levelreward = function (name, userdata) {
  var options = {};
  if (name == "Level 5 Car Reward") {
    options = { lowerfpp: 250, upperfpp: 300, types: ["Production"] };
  }
  if (name == "Level 10 Car Reward") {
    options = { lowerfpp: 400, upperfpp: 450, types: ["Production"] };
  }
  if (name == "Level 15 Car Reward") {
    options = { types: ["Race Car: GT4"] };
  }
  if (name == "Level 20 Car Reward") {
    options = { lowerfpp: 450, upperfpp: 600, types: ["Production"] };
  }
  if (name == "Level 30 Car Reward") {
    options = { types: ["Race Car: GT3"] };
  }
  if (name == "Level 40 Car Reward") {
    options = { types: ["Race Car: LMP"] };
  }
  if (name == "Level 50 Car Reward") {
    options = { types: ["Concept"] };
  }
  var car = gtf_CARS.random(options, 1)[0];
  gtf_STATS.additem(name, userdata)
  var gift = {
    name: name,
    type: "RANDOMCAR",
    author: "🎁 Prize",
    inventory: true
  }
  gtf_STATS.addgift(gift, userdata);
};
