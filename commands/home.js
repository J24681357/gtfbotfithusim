const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "home",
  title: "My GTF Home",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-demo", "gtf-mode"],

  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupcommands(
      embed,
      results,
      query,
      {
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
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    var showcasenumber = 0;
    var message = gtf_STATS.checknotifications(userdata)

    if (typeof query["options"] !== 'undefined') {
      var cmd = require(__dirname + "/" + query["options"]);
          if (!gtf_STATS.checklicense(cmd.license, embed, msg, userdata)) {
          return;
        }
          if (!gtf_EXP.checklevel(cmd.level, embed, msg, userdata)) {
            return;
          }
      return cmd.execute(msg, {}, userdata);
    }

    if (query["select"] !== undefined) {
      require(__dirname + "/" + query["select"]).execute(msg, [], userdata);
    }

    embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");

    embed.setDescription(message + results);

    var menulist = gtf_GTF.commandlist.map(function(x, i) {
      x["name"] = x[1]
      x["emoji"] = x[2]
      x["extra"] = ""
      x["description"] = x[0]
      x["menu_id"] = i
      return x
    })

    var commandslist = gtf_GTF.commandlist.map(x => x[0])

    var gmenulistselect = [];
    var emojilist = [];
    var menupage = 0;
    var gmenulistselect = menulist.slice(0 + 10 * menupage, 10 + 11 * menupage);
    gmenulistselect.push({
      emoji: "➡",
      name: "Next Page",
      description: "",
      menu_id: "NEXTPAGE",
    });
    var gemojilist = [];
    var menu = gtf_TOOLS.preparemenu("Select A Mode", gmenulistselect, [], msg, userdata);

    var car = gtf_CARS.random({}, 1)[0];
    results = "**" + car["name"] + " " + car["year"] + " " + gtf_TOOLS.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + gtf_EMOTE.gtlogoblue + " **Use the menu below to select an option.**";
    embed.setDescription(message + results);
    embed.setThumbnail(car["image"][0]);
    embed.fields = [];

    embed.setFields([{ name: gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata) }]);

    gtf_DISCORD.send(msg, { embeds: [embed], components: [menu] }, homefunc);

    function homefunc(msg) {
      var functionslist = [];
      for (var j = 0; j < menulist.length; j++) {
        functionslist.push(function (int) {
          if (int == "NEXTPAGE") {
            menupage++;
            if (gmenulistselect.length <= 0 + (11 * menupage - 1)) {
              menupage = 0;
            }
            gmenulistselect = menulist.slice(10 * menupage, 10 + 11 * menupage);
            gmenulistselect.push({
              emoji: "➡",
              name: "Next Page",
              description: "",
              menu_id: "NEXTPAGE",
            });
            var menu = gtf_TOOLS.preparemenu("Select A Mode", gmenulistselect, gemojilist, msg, userdata);
            msg.edit({ components: [menu] });
            return;
          }
          showcasenumber = -1;
          var cmd = require(__dirname + "/" + commandslist[int]);
          if (msg.channel.type != 1) {
          if (cmd.channels.length >= 1) {
            if (!cmd.channels.some(name => msg.channel.name.includes(name))) {
              userdata = gtf_GTF.defaultuserdata
              gtf_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }
          }
          }
          
        if (!gtf_STATS.checklicense(cmd.license, embed, msg, userdata)) {
          return;
        }
          if (!gtf_EXP.checklevel(cmd.level, embed, msg, userdata)) {
            return;
          }
          gtf_STATS.checkmessages(cmd, execute, msg, userdata)
          function execute() {
          cmd.execute(msg, {}, userdata);
          }
        });
      }

      
function createlist() {
  var showcase0 = function() {
          msg.removeAttachments();
          embed.image = "";
          var t = gtf_COURSEMAKER.trackparams({
            min: 40,
            max: 80,
            minSegmentLength: 2,
            maxSegmentLength: 10,
            curviness: 0.3,
            maxAngle: 120,
            location: ["Grass", "Desert", "Mountain", "Snow", "Blank"][Math.floor(Math.random() * 5)],
            type: "Circuit",
          });
          var track = gtf_COURSEMAKER.displaytrack(t, callback);

          function callback(track) {
            
            track["options"] = ["Drift"];
            track["author"] = "ARCADE";
            results = "**🖼 " + track["name"] + "**\n" + "**Generate your own courses using __/course__ or in the Course Maker selection." + "**\n\n" + gtf_EMOTE.gtlogoblue + " **Use the menu below to select an option.**";
            embed.setDescription(message + results);
            const attachment = new AttachmentBuilder(track["image"], { name: "course.png" });
            embed.setThumbnail("attachment://course.png");
            embed.fields = [];
            embed.setFields([{ name: gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          
        }
        }
        var showcase1 = function() {
          msg.removeAttachments();
          embed.image = "";
          var car = gtf_CARS.random({}, 1)[0];
          results = "**" + car["name"] + " " + car["year"] + " " + gtf_TOOLS.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + gtf_EMOTE.gtlogoblue + " **Use the menu below to select an option.**";
          embed.setDescription(message + results);
          embed.setThumbnail(car["image"][0]);
          embed.fields = [];
          embed.setFields([{ name: gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase2 = function() {
          //msg.removeAttachments();
          embed.image = "";
          var track = gtf_TRACKS.random({}, 1)[0];
          results =
            "**" +
            track["name"] +
            "** `" +
            track["version"] +
            "`\n" +
            "**Length:** " +
            [track["length"] + " km", gtf_MATH.round( (track["length"] * 0.62137119), 2) + " mi"].join(" | ") +
            "\n" +
            gtf_EMOTE.tracklogo +
            " **Drive over many tracks from the Gran Turismo series in GT Fitness!**" +
            "\n\n" +
            gtf_EMOTE.gtlogoblue +
            " **Use the menu below to select an option.**";
          embed.setDescription(message + results);
          embed.setThumbnail(track["image"]);
          embed.fields = [];
        
          embed.setFields([{ name: gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase3 = function() {
          msg.removeAttachments();
          var attachment = [];

          embed.fields = [];
          var car = gtf_STATS.currentcar(userdata);
          results = gtf_STATS.viewcar(car, embed, userdata);
          gtf_STATS.loadcarimage(car, embed, userdata, then);

          function then(attachment) {
            embed.setThumbnail("attachment://image.png");
            embed.setDescription(message + results);
            embed.setFields([{ name: gtf_STATS.main(userdata), value: gtf_STATS.currentcarmain(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          }
        }
        return [showcase0, showcase1, showcase2, showcase3]
}
      var showcaselist = createlist()
      var count = gtf_STATS.count(userdata) + 1
      var times = 0
      var s = setInterval(function () {
        if (showcasenumber == -1 || gtf_STATS.count(userdata) != count || times == 10) {
          clearInterval(s);
          return;
        }
        times++
        
  
        showcasenumber = gtf_MATH.randomInt(0, showcaselist.length-1);
        showcaselist[showcasenumber]()
      }, 15 * 1000);
      gtf_TOOLS.createbuttons(menu, emojilist, functionslist, msg, userdata);
    }
    return;
  }
};

