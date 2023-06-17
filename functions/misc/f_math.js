// REMOTE
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

//MATH
module.exports.round = function(num, multiplier) {
  multiplier = Math.pow(10, multiplier)

  return Math.round(num * multiplier) / multiplier
}
module.exports.sum = function(array) {
  return array.reduce((x, y) => x + y)
}
module.exports.median = function (array) {
    var median = 0, numsLen = array.length;
    array.sort();

    if (
        numsLen % 2 === 0
    ) {
        median = (array[numsLen / 2 - 1] + array[numsLen / 2]) / 2;
    } else {
        median = array[(numsLen - 1) / 2];
    }

    return median;
}
module.exports.average = function (array) {
 return array.reduce((x, y) => x + y) / array.length;
}
module.exports.weightedaverage = (nums, weights) => {
  const [sum, weightSum] = weights.reduce(
    (acc, w, i) => {
      acc[0] = acc[0] + nums[i] * w;
      acc[1] = acc[1] + w;
      return acc;
    },
    [0, 0]
  );
  return sum / weightSum;
};

//RANDOM
module.exports.randomInt = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

module.exports.randomIntSeed = function (min, max, seed) {
  var Random = require('yy-random')
  Random.seed(seed)
  var num = Random.get(max)
  return num
};

///
module.exports.numFormat = function (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
module.exports.betweenInt = function (number, min, max) {
  if (isNaN(number)) {
    return false;
  }
  return parseInt(number) >= min && parseInt(number) <= max;
};

//SAMPLE
module.exports.weightedSample = function (items) {
    const total = Object.values(items).reduce((sum, weight) => sum + (weight * 100), 0)

    const rnd = Math.random() * total
    let accumulator = 0

    for (const [item, weight] of Object.entries(items)) {
        accumulator += (weight * 100)

        if (rnd < accumulator) {
            return item
        }
    }
}
// https://stackoverflow.com/questions/64010126/get-pseudo-random-item-with-given-probability
