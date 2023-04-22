var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "daily",
  title: "GTF Daily Workout",
  license: "B",
  level: 0,
  channels: ["testing", "gtf-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
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
      buttons: false,
      carselectmessage: false,
      image: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    embed.setTitle("__GTF Daily Workout - Prize__");
    var prizes = [];

    if (gtf_STATS.dailyworkout(userdata)["done"]) {
      gtf_EMBED.alert({ name: "❌ Invalid", description: "You have already earned your daily workout for the day.", embed: "", seconds: 5 }, msg, userdata);
      return;
    }

    if (gtf_STATS.checkgarageerror(embed, msg, userdata)) {
      return;
    }
    if (gtf_STATS.mileage(userdata) < 42.10) {
      var mile = ["42.1 km", "26.2 mi"]
      var m = "**Mileage: " + gtf_STATS.mileageuser(userdata) + " " + gtf_STATS.mileageunits(userdata) + gtf_EMOTE.mileage + " -> " + mile[userdata["settings"]["UNITS"]] + gtf_EMOTE.mileage + "**"
      gtf_EMBED.alert({ name: "❌ Insufficient Mileage", description: "You are unable to earn your daily workout car because you have not drove " + mile[userdata["settings"]["UNITS"]] + "." + "\n" + m, embed: "", seconds: 0 }, msg, userdata);
      return;
    }

    gtf_STATS.setdailyworkout(true, userdata)

    results = "🎉 " + "__** Daily Workout - " + gtf_STATS.lastonline(userdata) + "**__" + " 🎉";
    var car = gtf_CARS.random({lowerfpp:500}, 1)[0];
    prizes.push({
      id: -1, type:"CAR", name: car["name"] + " " + car["year"], item: car, author: "DAILY WORKOUT", inventory: false });
    
    var car2 = gtf_CARS.random({upperfpp:500, types:["Production"]}, 1)[0];
      prizes.push( {
      id: -1, type:"CAR", name: car2["name"] + " " + car2["year"], item: car2, author: "DAILY WORKOUT", inventory: false });
    var credits = 1000 * gtf_MATH.randomInt(10, 25)
    var credits2 = 1000 * gtf_MATH.randomInt(10, 50)
    
    prizes.push({
      id: -1, type: "CREDITS", name: gtf_MATH.numFormat(credits) + gtf_EMOTE.credits, item: credits, author: "DAILY WORKOUT", inventory: false });
    prizes.push({
      id: -1, type: "CREDITS", name: gtf_MATH.numFormat(credits2) + gtf_EMOTE.credits, item: credits2, author: "DAILY WORKOUT", inventory: false });
    prizes = gtf_TOOLS.shuffle(prizes)

    gtf_GTF.fourgifts("GTF Daily Workout", results, prizes, embed, msg, userdata);
  }
};
