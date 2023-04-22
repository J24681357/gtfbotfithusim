var dir = "../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var gtfcareerraces = gtf_LISTS.gtfcareerraces;
  var final = [];
  var eventids = Object.keys(gtfcareerraces);

  for (var key = 0; key < eventids.length; key++) {
    var eventidkey = gtfcareerraces[eventids[key]];

      var count = 0;

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            var re = new RegExp("^" + types[itype] + "-", 'ig');
            if (eventidkey["eventid"].match(re)) {
              count++;
              break;
            }
          }
        }
      }
      
      if (count == total) {
        final.push(eventidkey);
      }
  }
  if (final.length == 0) {
    return "";
  }

  return final;
};

/*
module.exports.random = function (args, num) {
  var rlist = [];
  var list =.find(args);
  for (var i = 0; i < num; i++) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
  }
  return rlist;
};
*/
