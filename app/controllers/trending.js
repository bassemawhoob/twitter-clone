const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");

exports.index = (req, res) => {
  let tweets;
  Tweet.trending().then(result => {
    tweets = result;
    return res.render("pages/trending", {
      tweets: tweets
    });
  });
};
