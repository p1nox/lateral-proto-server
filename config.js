
var config = {

  env: process.env.NODE_ENV || 'development',
  isDevelopment: function() {
    return this.env === 'development';
  },
  isProduction: function() {
    return this.env === 'production';
  },

  port: process.env.PORT || 9000,

  db: {
    url: process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/lateral'
  },

  app: {
    token:  'f34fb8d0e97d9681875572ebb3a9a06642eaab74e8a16b1aaf41984c486f854be228d743396b522fbcafad4999237445bc8d0b2949eb9bf70425d1e8fbad2844ddb01de86c9b737e0a506305104c66799efece31ed68b1b2dc84f7238be43c6fee2d73f8326a234211d265c5947e3e0dbd4335f2ac34f98c824fa70c071627e1',
    secret: '2e8e30fbd47735307e111f604f20e7d21090e7b36c3b0c0cecdc195424afbadb2c5fb328f1ebbfb1a68c937e1e2989fd3158af85f6ce9a3ec61fddf8fe7b8e87fc850c5b57fbc0e35efface8a98f27b6f1ba6c7cd78a4f81a179477895a8f4685cf7c5700bed34c6f8da89a9d2032288fc2a6ef132ca488f3ad4ec1a422a80fa'
  },

  twitter: {
    consumer_key: process.env.TWT_KEY,
    consumer_secret: process.env.TWT_SECRET,
    access_token_key: process.env.TWT_TOKEN_KEY,
    access_token_secret: process.env.TWT_TOKEN_SECRET,
    callback: process.env.TWT_CALLBACK_URL || 'http://127.0.0.1:9000/auth/twitter/callback'
  },

  twilio: {
    account_sid: process.env.TWL_SID,
    auth_token: process.env.TWL_TOKEN,
    from_number: process.env.TWL_FROM_NUMBER
  }

};

console.log("CONFIG: ", config);

module.exports = config;
