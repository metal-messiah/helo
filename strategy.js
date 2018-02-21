const Auth0Strategy = require('passport-auth0');
const config = require(`${__dirname}/config.js`);
const { domain, clientID, clientSecret } = config;
// const massive = require('massive');
// const massiveInstance = massive.connectSync({connectionString: "postgres://qtsfzuurclzgcr:a8f2fe8717e00e1983e95c82fadb389cc7ece9a4f6d13c97634184322412795c@ec2-184-72-219-186.compute-1.amazonaws.com:5432/d5shi0ki18lf3s?ssl=true"})

module.exports = new Auth0Strategy({
    domain: domain,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3001/api/auth/setUser'
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        console.log(profile)
        done(null, profile)
    }
);