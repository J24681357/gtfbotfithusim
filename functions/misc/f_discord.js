// REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
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
                
                sendtype(msg, force)

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
             try {          
       msg.editReply({content: "✅ **Success**"})
       } catch (error) {
       }
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
      }, 1000)
      
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

module.exports.role = function(msg, user, role, type, callback) {
  var gtfbot = gtf_MAIN.bot
  if (typeof callback === "undefined") {
    callback = function() {}
  }
  gtfbot["totalrole"]++
   if (gtfbot["totalrole"] == 0) {
      return
    } else {
      var timer;
      var i;
      var check = function() {
          clearInterval(timer)
          clearInterval(i)
          gtfbot["rolelimit"] = false
      }
      
      var repeat = function(content) {
        if (gtfbot["rolelimit"] == false) {

        gtfbot["rolelimit"] = true        
         timer = setInterval(function() {
           
            if (gtfbot["totalrole"] != 0) {
              gtfbot["totalrole"]--
              if (type == "ADD") {
              //gtf_DISCORD.reply(msg, {content: "✅ " + "**" + role.name + "** role" + " " + "added."})             
              user.roles.add(role).catch(console.error);
              } else if (type == "REMOVE") {
              //   gtf_DISCORD.reply(msg, {content: "✅ " + "**" + role.name + "** role" + " " + "removed."}) 
              user.roles.remove(role).catch(console.error);
              }
        }
        check()
      }, 3000)
      
        }
      }

      if (gtfbot["rolelimit"] == false) {
        repeat()
      } else {
       i = setInterval(function() {repeat()}, 3000)
      }
}
}

module.exports.autoMessage = function(client, title, text, color, image, channelid, elist, number) {
  var gtfbot = gtf_MAIN.bot
  var server = client.guilds.cache.get(gtf_SERVERID);
  var channel = server.channels.cache.get(channelid);
  var embed = new EmbedBuilder();
  var description = text;
  

  if (typeof channel == 'undefined') {
    channel.send({content: 'Invalid'});
    return;
  }
  
  var elist = [...elist]
  next(elist)

 function next(elist) {
   
    channel.messages.fetch().then(msg => {
      
    var arr = Array.from(msg.entries()).reverse();

    if (typeof arr[number - 1] === 'undefined') {
      embed.setTitle(title);
      embed.setDescription(description);
      if (color.length != 0) {
        embed.setColor(color);
      }
      if (typeof image !== 'undefined') {
        if (image.length != 0) {
          embed.setThumbnail(image);
        }
      }
      channel.send({embeds: [embed]});
      return;
    }
    

    channel.messages.fetch(arr[number - 1][0]).then(msg => {

      if (msg == undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        channel.send({embeds: [embed]});
        return;
      }

      var otitle = msg.embeds[0].title;
      var odescription = msg.embeds[0].description;
      var ocolor = msg.embeds[0].color

      if (odescription === undefined || otitle === undefined || ocolor === undefined) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
        msg.edit({embeds: [embed]});
        return;
      }

      if (JSON.stringify(odescription) !== JSON.stringify(description) || JSON.stringify(otitle) !== JSON.stringify(title) || JSON.stringify(ocolor) !== parseInt(color, 16)) {
        embed.setTitle(title);
        embed.setDescription(description);
        if (color.length != 0) {
          embed.setColor(color);
        }
        if (typeof image !== 'undefined') {
          if (image.length != 0) {
            embed.setThumbnail(image);
          }
        }
          msg.edit({embeds: [embed]});
      }
      var time = 0;
      embed.setTitle(title);
      embed.setDescription(description);
      if (elist.length != 0) {
        var buttons = gtf_TOOLS.prepareButtons(elist, msg, {id:"ALL", garage: [], settings: gtf_defaultsettings});
      } else {
        var buttons = []
      }

       msg.edit({embeds:[embed], components: buttons}).then(msg => {
         var functionlist = []

         for (var i = 0; i < elist.length; i++) {
           functionlist.push(function([val, userid]) {
             var useri = msg.guild.members.cache.get(userid);
             
    var role = msg.guild.roles.cache.find(r => r.name === elist[val]["value"]);
                    /*
                    if (useri.guild.roles.cache.some(r => r.name === "Consoles ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Consoles ===============================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "Games ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Games ================================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "Settings ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "Settings ================================")).catch(console.error)
                    }
                    if (useri.guild.roles.cache.some(r => r.name === "GTF Items ")) {
                    } else {
                      useri.roles.add(msg.guild.roles.cache.find(r => r.name === "GTF Items ==============================")).catch(console.error)
                    }
                    */

                    if (useri.roles.cache.find(r => r.name === elist[val]["value"])) {
                      gtf_DISCORD.role(msg, useri, role, "REMOVE")
                    } else {
                      gtf_DISCORD.role(msg, useri, role, "ADD")
                    }
         })
         }
        if (elist.length != 0) {
        gtf_TOOLS.createButtons(buttons, elist, functionlist, msg, {id:"ALL", garage: [], settings: gtf_defaultsettings})
      }
         
    })
  })
})
 }
}