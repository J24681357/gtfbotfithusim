var dir = "../../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
var { MongoClient, ServerApiVersion } = require('mongodb');
MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

module.exports.savereplay = async function (replay, userdata) {
  var replaydata = "";
  var found = false;
  var db = await MongoClient.connect()
    var dbo = db.db("GTFitness");

    dbo
      .collection("REPLAYS")
      .find({ id: userdata["id"] })
      .forEach(row => {
        replaydata = row;
        delete replaydata["_id"];
        if (replaydata["replays"].length > gtf_GTF.replaylimit) {
          return
        }
        
        add();
        dbo.collection("REPLAYS").replaceOne({ id: userdata["id"] }, replaydata);
        found = true;
      });
  

  function add() {
    replay["date"] = gtf_STATS.lastonline(userdata)
    replaydata["replays"].push(replay)
    userdata["stats"]["numreplays"] = Object.keys(replaydata["replays"]).length
  }
};

module.exports.delete = async function (index, replaydata, userdata) {
delete replaydata[index]
replaydata = replaydata.filter(function(val) { return val !== null})

userdata["stats"]["numreplays"] = replaydata.length

 var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 var db = await MongoClient.connect()

  var dbo = db.db("GTFitness");
    dbo.collection("REPLAYS").replaceOne({ id: userdata["id"] }, {id:userdata["id"], replays:replaydata});
};

module.exports.clear = async function (userdata) {
 var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 var db = await MongoClient.connect()
    var dbo = db.db("GTFitness");
     dbo
      .collection("REPLAYS")
      .find({ id: userdata["id"] })
      .forEach(row => {
        dbo.collection("REPLAYS").replaceOne({id: userdata["id"]}, { id: userdata["id"] , replays:[]});
      });
  
  userdata["stats"]["numreplays"] = 0
};

module.exports.remove = async function (userdata) {
  var { MongoClient, ServerApiVersion } = require('mongodb');

MongoClient = new MongoClient(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
   var db = await MongoClient.connect()

    var dbo = db.db("GTFitness");
    dbo.collection("REPLAYS").deleteOne({ id: userdata["id"]});
  userdata["stats"]["numreplays"] = 0
};