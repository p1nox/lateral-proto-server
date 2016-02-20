var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('../../../config');
var User   = require('../../models/user');

module.exports = function(passport) {

  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumer_key,
      consumerSecret: config.twitter.consumer_secret,
      callbackURL: config.twitter.callback
    },

    // twitter will send back the tokens and profile
    function(token, tokenSecret, profile, done) {
      // console.log('profile', token, tokenSecret, profile);

      // asynchronous
      process.nextTick(function() {

        // find the user in the database based on their twitter id
        User.findOne({'twId': profile.id}, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) {
              return done(err);
            }

            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that twitter id, create them
                var newUser = new User();

                // set all of the twitter information in our user model
                newUser.twId      = profile.id; // set the users twitter id
                newUser.name      = profile.displayName;
                newUser.user_name = profile.username;
                newUser.picture   = (profile.photos.length ? profile.photos[0].value : '');

                newUser.twitter = {
                  // we will save the tokens that twitter provides to the user
                  token:        token,
                  token_secret: tokenSecret,

                  user_name: profile.username,
                  name:      profile.displayName,
                  photo:     (profile.photos.length ? profile.photos[0].value : ''),
                  _json:     profile._json,
                };

                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }

        });

      });
    }
  ));

};

// profile response example:
// { id: '4329449297',
//   username: 'l4t3r4l',
//   displayName: 'lateral-tests',
//   photos: [ { value: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png' } ],
//   provider: 'twitter',
//   _raw: '{"id":4329449297,"id_str":"4329449297","name":"lateral-tests","screen_name":"l4t3r4l","location":"","profile_location":null,"description":"","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":0,"friends_count":0,"listed_count":0,"created_at":"Mon Nov 30 13:52:01 +0000 2015","favourites_count":0,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":1,"lang":"en","status":{"created_at":"Mon Nov 30 15:12:05 +0000 2015","id":671345963525652482,"id_str":"671345963525652482","text":"Hello world!","source":"\\u003ca href=\\"https:\\/\\/www.alphacity.com\\" rel=\\"nofollow\\"\\u003eLateralLocal\\u003c\\/a\\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"favorited":false,"retweeted":false,"lang":"en"},"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_image_url_https":"https:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_tile":false,"profile_image_url":"http:\\/\\/abs.twimg.com\\/sticky\\/default_profile_images\\/default_profile_5_normal.png","profile_image_url_https":"https:\\/\\/abs.twimg.com\\/sticky\\/default_profile_images\\/default_profile_5_normal.png","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":true,"default_profile_image":true,"following":false,"follow_request_sent":false,"notifications":false,"suspended":false,"needs_phone_verification":false}',
//   _json:
//    { id: 4329449297,
//      id_str: '4329449297',
//      name: 'lateral-tests',
//      screen_name: 'l4t3r4l',
//      location: '',
//      profile_location: null,
//      description: '',
//      url: null,
//      entities: { description: [Object] },
//      protected: false,
//      followers_count: 0,
//      friends_count: 0,
//      listed_count: 0,
//      created_at: 'Mon Nov 30 13:52:01 +0000 2015',
//      favourites_count: 0,
//      utc_offset: null,
//      time_zone: null,
//      geo_enabled: false,
//      verified: false,
//      statuses_count: 1,
//      lang: 'en',
//      status:
//       { created_at: 'Mon Nov 30 15:12:05 +0000 2015',
//         id: 671345963525652500,
//         id_str: '671345963525652482',
//         text: 'Hello world!',
//         source: '<a href="https://www.alphacity.com" rel="nofollow">LateralLocal</a>',
//         truncated: false,
//         in_reply_to_status_id: null,
//         in_reply_to_status_id_str: null,
//         in_reply_to_user_id: null,
//         in_reply_to_user_id_str: null,
//         in_reply_to_screen_name: null,
//         geo: null,
//         coordinates: null,
//         place: null,
//         contributors: null,
//         retweet_count: 0,
//         favorite_count: 0,
//         entities: [Object],
//         favorited: false,
//         retweeted: false,
//         lang: 'en' },
//      contributors_enabled: false,
//      is_translator: false,
//      is_translation_enabled: false,
//      profile_background_color: 'C0DEED',
//      profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
//      profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
//      profile_background_tile: false,
//      profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
//      profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_normal.png',
//      profile_link_color: '0084B4',
//      profile_sidebar_border_color: 'C0DEED',
//      profile_sidebar_fill_color: 'DDEEF6',
//      profile_text_color: '333333',
//      profile_use_background_image: true,
//      has_extended_profile: false,
//      default_profile: true,
//      default_profile_image: true,
//      following: false,
//      follow_request_sent: false,
//      notifications: false,
//      suspended: false,
//      needs_phone_verification: false },
//   _accessLevel: 'read-write' }
