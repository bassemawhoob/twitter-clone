$(document).ready(function() {
  $(".favorite").on("click", function(e) {
    const tweetID = $(e.currentTarget).data("tweetid");
    const url = "/tweets/" + tweetID + "/favorites";
    $.ajax({
      type: "POST",
      url: url,
      success: function(data) {
        alert("Favorited");
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".unfavorite").on("click", function(e) {
    const tweetID = $(e.currentTarget).data("tweetid");
    const url = "/tweets/" + tweetID + "/favorites";
    $.ajax({
      type: "DELETE",
      url: url,
      success: function(data) {
        alert("Unfavorited");
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".retweet").on("click", function(e) {
    const tweetID = $(e.currentTarget).data("tweetid");
    const url = "/tweets/" + tweetID + "/retweets";
    $.ajax({
      type: "POST",
      url: url,
      success: function(data) {
        alert("Retweeted");
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".unretweet").on("click", function(e) {
    const tweetID = $(e.currentTarget).data("tweetid");
    const url = "/tweets/" + tweetID + "/retweets";
    $.ajax({
      type: "DELETE",
      url: url,
      success: function(data) {
        alert("Unretweeted");
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".profile__follow-button").on("click", function(e) {
    const userID = $(e.currentTarget).data("userid");
    const url = "/users/" + userID + "/follow";
    $(this).addClass("following");
    $.ajax({
      type: "POST",
      url: url,
      success: function(data) {
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".profile__follow-button.following").on("click", function(e) {
    const userID = $(e.currentTarget).data("userid");
    const url = "/users/" + userID + "/follow";
    $.ajax({
      type: "DELETE",
      url: url,
      success: function(data) {
        location.reload();
      },
      error: function(data) {
        console.log("not sent");
      }
    });
  });

  $(".tweet__edit").on("click", function(e) {
    e.preventDefault();
    let $editButton = $(e.target);
    if ($editButton.hasClass("tweet__edit")) {
      // Change "edit" to "save" on the button
      $editButton
        .text("Save")
        .removeClass("tweet__edit")
        .addClass("tweet__save");
      // Get the tweet content text
      let $originalTweet = $(e.target)
        .parent()
        .siblings(".tweet__content");
      let tweetText = $originalTweet.text();
      // Replace the tweet text element with a textarea element
      let $modifiedText = $("<textarea>")
        .addClass("edit-tweet")
        .val(tweetText)
        .attr("placeholder", tweetText);
      $originalTweet.after($modifiedText).remove();
    } else if ($editButton.hasClass("tweet__save")) {
      // Change "save" to "edit" on the button
      $editButton
        .text("Edit")
        .removeClass("tweet__save")
        .addClass("tweet__edit");
      let $modifiedTweet = $(e.target)
        .parent()
        .siblings("textarea");
      let originalText = $modifiedTweet.attr("placeholder");
      let modifiedText = $modifiedTweet.val();
      if (modifiedText !== originalText) {
        // Make a PUT request to /tweets/:id
        let tweetId = $editButton.closest(".tweet").attr("data-tweetId");
        $.ajax($editButton.attr("href"), {
          method: "POST",
          data: { id: tweetId, tweet: modifiedText },
          success: function(data) {},
          error: function(data) {}
        });
      }
      let $tweetElement = $("<p>")
        .addClass("tweet__content")
        .text(modifiedText);
      $modifiedTweet.after($tweetElement).remove();
    }
  });
});
