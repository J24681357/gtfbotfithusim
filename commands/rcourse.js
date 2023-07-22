const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "rcourse",
  title: "Random GTF Course Maker",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-mode", "gtf-demo"],
  
  requirecar: false,
  availitoeveryone: true,
  availinmaint: true,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: false,
      footer: "**❓ The red point would be the starting point.**",
      image: [],
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var curviness = 0.3;
    var maxangle = 120;
    var minsegment = 2;
    var maxsegment = 20;
    var allsegment = 0;
    var type = "circuit";
    var location = "Grass"
    var name = "Generic Track";

    if ("name" in query) {
      name = query["name"];
    }
    if ("allsegments" in query) {
      /// 0 - 20
      allsegment = parseFloat(query["allsegments"]);
      if (!gtf_MATH.betweenInt(allsegment, 2, 20)) {
        gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Segment lengths must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
      minsegment = allsegment;
      maxsegment = allsegment;
      allsegment = "";
    }
    if ("maxsegment" in query) {
      maxsegment = parseFloat(query["maxsegment"]);
      if (allsegment.toString().length != 0) {
        if (!gtf_MATH.betweenInt(maxsegment, 2, 20)) {
          gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Maximum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
      }
    }
    if ("minsegment" in query) {
      /// 0 - 20
      minsegment = parseFloat(query["minsegment"]);

      if (allsegment.toString().length != 0) {
        if (!gtf_MATH.betweenInt(minsegment, 2, 20)) {
          gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Mininum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
      }
    }
    if ("curviness" in query) {
      /// 0.0 - 1.0
      curviness = parseFloat(query["curviness"]);
      if (!gtf_MATH.betweenInt(curviness, 0, 1)) {
        gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Curviness value must be between 0 and 1.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
    }
    if ("maxangle" in query) {
      /// 50-150
      maxangle = parseFloat(query["maxangle"]);
      if (!gtf_MATH.betweenInt(maxangle, 50, 150)) {
        gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Max Angle value must be between 50 and 150.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
    }
    if (typeof query["type"] !== 'undefined') {
      type = query["type"];
    }
    if (typeof query["location"] !== 'undefined') {
          location = query["location"];
    }

    if (maxsegment < minsegment) {
      gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Maximum segment length is lower than the minimum segment length.", embed: "", seconds: 0 }, msg, userdata);
      return;
    }

    if (minsegment > minsegment) {
      gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Minimum segment length is greater than the maximum segment length.", embed: "", seconds: 0 }, msg, userdata);
      return;
    }

    var t = gtf_COURSEMAKER.trackparams({
      min: 40,
      max: 80,
      minSegmentLength: minsegment,
      maxSegmentLength: maxsegment,
      curviness: curviness,
      maxAngle: maxangle,
      location: location,
      type: type,
    });
    var course = gtf_COURSEMAKER.drawtrack(t, callback)
    
    function callback(course) {
    course["name"] = name.replace(/_/g, " ");
    embed.setTitle(gtf_EMOTE.tracklogo + "__GTF Course Maker__");
    const attachment = new AttachmentBuilder(course["image"], {name: "course.png"});
    embed.setImage("attachment://course.png")
    var footer = "Type = " + type + " | " + "Segments = " + minsegment + ":" + maxsegment + " | " + "Curviness = " + curviness + " | " + "Max Angle = " + maxangle;
    embed.setDescription("**Name:** " + course["name"] + "\n" +
    "**Environment:** " + course["location"] + "\n" +
     "**Track Length:** " + course["length"] + " mi" + " | " + course["lengthkm"] + " km");
    embed.setFooter({text: footer});
    gtf_DISCORD.send(msg, {
      embeds: [embed],
      files:[attachment]});
  }
  }
};
