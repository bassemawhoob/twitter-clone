const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");
const Schema = mongoose.Schema;
const scrypt = require("../../lib/scrypt");
const authTypes = ["local", "github"];

// ## Define UserSchema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Why no email?"]
    },
    provider: String,
    hashedPassword: String,
    avatar_url: String,
    salt: String,
    followers: [{ type: Schema.ObjectId, ref: "User" }],
    following: [{ type: Schema.ObjectId, ref: "User" }],
    tweets: Number
  },
  { usePushEach: true }
);

UserSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = scrypt.hash(password + this.salt);
  })
  .get(function() {
    return this._password;
  });

const validatePresenceOf = value => value && value.length;

UserSchema.path("email").validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, "Email cannot be blank");

UserSchema.path("email").validate(function(value, done) {
  this.model("User").count({ email: value }, function(err, count) {
    if (err) {
      return done(err);
    }
    done(!count);
  });
}, "Email already exists");

UserSchema.path("hashedPassword").validate(function(hashedPassword) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return hashedPassword.length;
}, "Password cannot be blank");

UserSchema.pre("save", function(next) {
  if (
    !validatePresenceOf(this.password) &&
    authTypes.indexOf(this.provider) === -1
  ) {
    next(new Error("Invalid password"));
  } else {
    this.avatar_url = "https://api.adorable.io/avatars/250/" + this.email;
    next();
  }
});

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText + this.salt) === this.hashedPassword;
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random());
  },

  encryptPassword: function(password) {
    if (!password) {
      return "";
    }
    return scrypt.hash(password);
  }
};

UserSchema.statics = {
  addfollow: function(id, cb) {
    this.findOne({ _id: id })
      .populate("followers")
      .exec(cb);
  },
  countUserTweets: function(id, cb) {
    return Tweet.find({ user: id })
      .count()
      .exec(cb);
  },
  load: function(options, cb) {
    options.select = options.select || "name username github";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options) {
    const criteria = options.criteria || {};
    console.log(criteria);
    return this.find(criteria)
      .populate("user", "name email")
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  },
  countTotalUsers: function() {
    return this.find({}).count();
  }
};

mongoose.model("User", UserSchema);
