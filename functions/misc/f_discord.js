var dir = "../../"
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////


module.exports.send = function(msg, content, callback) {
  var gtfbot = gtf_MAIN.bot
  //console.log(Buffer.byteLength(content["files"]["attachment"]))
    if (content["type1"] == "CHANNEL") {             
    msg.sendTyping()
      } else {
    msg.channel.sendTyping() 
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
              msg.send(content).then(msgg => {
                callback(msgg)}
              )
              } else {
              msg.channel.send(content).then(msgg => {
                msgg.user = msg.user
                callback(msgg)}
                )
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
              msg.edit(content).then(msgg => {
                msgg.user = msg.user
                callback(msgg)}
                )
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
}

module.exports.sendModal = function(modallist, callback, msg, userdata) {
  var gtfbot = gtf_MAIN.bot
      const modal = new ModalBuilder()
			.setCustomId('modal')
			.setTitle('My Modal');
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
			.setLabel("What's your favorite color?")
			.setStyle(TextInputStyle.Short);


		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

		modal.addComponents(firstActionRow);

		msg.showModal(modal);
}