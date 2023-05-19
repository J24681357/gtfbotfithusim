var dir = "../../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.send = function(msg, content, callback, force) {
  var gtfbot = gtf_MAIN.bot
  content["fetchReply"] = true
  if (content["type1"] == "CHANNEL") {             
    msg.send(content)
    return
  } else {
    if (msg.type == 20 || msg.type == 0) {
      msg.channel.sendTyping() 
    }
  }
  if (typeof callback === "undefined") {
    callback = function() {}
  }
  gtfbot["totalmsg"]++
   if (gtfbot["totalmsg"] == 0) {
      return
    } else {
      var timer;
      var i;
      var check = function() {
          clearInterval(timer)
          clearInterval(i)
          gtfbot["msglimit"] = false
      }
      
      var repeat = function() {
        if (gtfbot["msglimit"] == false) {
        gtfbot["msglimit"] = true        
         timer = setInterval(function() {
            if (gtfbot["totalmsg"] != 0) {
              gtfbot["totalmsg"]--
              if (content["type1"] == "CHANNEL") {             
              msg.editReply(content).then(msgg => {
                callback(msgg)}
              )
              } else {
                if (force) {
                sendtype(msg, true)
                } else {
                sendtype(msg, false)
                }
             }
        }
        check()
      }, 1500)
      
        }
      }

      if (gtfbot["msglimit"] == false) {
        repeat()
      } else {
       i = setInterval(function() {repeat()}, 4000)
      }
}

  async function sendtype(msg, force) {
    if (force) {
    msg.channel.send(content).then(msgg => { 
            msgg.user = msg.user;
            callback(msgg);
    })
      return
    }
    
     if (msg.type == 20 || msg.type == 0) {
            msg.channel.send(content).then(msgg => { 
            msgg.user = msg.user;
            callback(msgg);
    })
       } 
     else { 
       try {
            var msgg = await msg.followUp(content);
               msgg.user = msg.user;
                 callback(msgg);
       } catch (error) {
         sendtype(msg, true)
       }
            }
  }
}

module.exports.edit = function(msg, content, callback) {
  var gtfbot = gtf_MAIN.bot
  if (typeof callback === "undefined") {
    callback = function() {}
  }
  gtfbot["totalmsg"]++
   if (gtfbot["totalmsg"] == 0) {
      return
    } else {
      var timer;
      var i;
      var check = function() {
          clearInterval(timer)
          clearInterval(i)
          gtfbot["msglimit"] = false
      }
      
      var repeat = function() {
        if (gtfbot["msglimit"] == false) {
        gtfbot["msglimit"] = true        
         timer = setInterval(function() {
            if (gtfbot["totalmsg"] != 0) {
              gtfbot["totalmsg"]--
              edittype(msg, false)
             /* msg.edit(content).then(msgg => {
                msgg.user = msg.user
                callback(msgg)})
                */
        }
        check()
      }, 1500)
      
        }
      }

      if (gtfbot["msglimit"] == false) {
        repeat()
      } else {
       i = setInterval(function() {repeat()}, 1500)
      }
}
  async function edittype(msg, force) {
    if (force) {
    msg.edit(content).then(msgg => { 
            msgg.user = msg.user;
            callback(msgg);
    })
      return
    }
    
     if (msg.type == 20 || msg.type == 0) {
            msg.edit(content).then(msgg => { 
            msgg.user = msg.user;
            callback(msgg);
    })
       } 
     else { 
       try {
            var msgg = await msg.editReply(content);
               msgg.user = msg.user;
                 callback(msgg);
       } catch (error) {
         edittype(msg, true)
       }
            }
  }
}

module.exports.delete = function(msg, content, callback) {
  if (typeof callback === "undefined") {
    callback = function() {}
  }
    if (msg.type == 20 || msg.type == 0) {
       setTimeout(function() {
         msg.delete()
         callback()
       }, content["seconds"] * 1000);
      
       } else {
       setTimeout(function() {
         msg.deleteReply()
         callback()
       }, content["seconds"] * 1000);
    }
 
}

module.exports.sendModal = async function(msg) {
  var gtfbot = gtf_MAIN.bot
      const modal = new ModalBuilder()
			.setCustomId('modal')
			.setTitle('My Modal');
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
			.setLabel("In the end of a Drift Trial, the total points accumulated and the rating will be shown. Credits earned are based on your rating. Using tires with less grip (Comfort tires) would be the most optimal to earn points.")
			.setStyle(TextInputStyle.Short)
      .setPlaceholder('Press Submit to continue.');


		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

		modal.addComponents(firstActionRow);

		await msg.showModal(modal);
}
