// ### Create Retweet
exports.create = (req, res) => {
  const tweet = req.tweet;
  tweet._retweets = req.user;
  tweet.save(err => {
    if (err) {
      return res.send(400);
    }
    res.send(201, {});
  });
};

// ### Delete Retweet
exports.destroy = (req, res) => {
  const tweet = req.tweet;
  tweet._retweets = req.user;
  tweet.save(err => {
    if (err) {
      return res.send(400);
    }
    res.send(200);
  });
};
