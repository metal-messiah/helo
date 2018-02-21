const express = require('express');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser')
const session = require('express-session');
const controller = require(`${__dirname}/controller`);

const cors = require('cors');
const massive = require('massive');

const passport = require('passport');
const strategy = require(`${__dirname}/strategy.js`);

//require('dotenv').config()

const createInitialSession = require(`${__dirname}/middlewares/session.js`);

const app = express();


//app.use(express.static(`${__dirname}/client/build`));
// app.use(cookieParser('brucespringsteinmegaboss'));
app.use(session({ 
    secret: 'brucespringsteinmegaboss',
    resave:true,
    rolling: true,
    saveUninitialized:true,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser(function (user, done) {
    console.log(user)
    console.log("SERIALIZE")
    done(null, { id: user.id, display: user.displayName, nickname: user.nickname, email: user.emails[0].value });
});

passport.deserializeUser( (obj, done) => {
    console.log(obj)
    console.log("deserialize");
    done(null, obj)
});

//app.use((req, res, next) => createInitialSession(req, res, next));
// app.use( ( req, res, next ) => {
//     const { method } = req;
//     if ( method === "POST" || method === "PUT" ) {
//         filter( req, res, next );
//     } else {
//         next();
//     }
// });

massive("postgres://qtsfzuurclzgcr:a8f2fe8717e00e1983e95c82fadb389cc7ece9a4f6d13c97634184322412795c@ec2-184-72-219-186.compute-1.amazonaws.com:5432/d5shi0ki18lf3s?ssl=true")
    .then(dbInstance => app.set('db', dbInstance));

//testing
// app.get("/", function (req, res) {
//     res.sendFile('testing/test.html', {root: __dirname});
// })



const authUrl = "/api/auth";

app.get(`${authUrl}/login`, passport.authenticate('auth0',
    { successRedirect: `${authUrl}/setUser`, failureRedirect: `${authUrl}/login`, failureFlash: true }
));

app.get(`${authUrl}/setUser`,(req, res)=>{
    console.log("SETUSER ENDPOINT")
    res.redirect(`${authUrl}/authenticated`)
});

app.get(`${authUrl}/authenticated`, ( req, res, next) => {
    console.log(req.session)
    console.log("AUTHENTICATE ENDPOINT")
    if ( !req.session.user ) {
      res.status(403).redirect(`${authUrl}/login`);
    } else {
      // req.user === req.session.passport.user
      // console.log( req.user )
      // console.log( req.session.passport.user );
      res.status(200).send( JSON.stringify( req.session.user, null, 10 ) );
    }
  });

// app.post(baseUrl, controller.create);

// app.delete(`${baseUrl}/:id`, controller.delete);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`feeling porty --> ${port}`);
});