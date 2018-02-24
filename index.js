const express = require('express');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser')
const session = require('express-session');
const controller = require(`${__dirname}/controller`);

const cors = require('cors');
const massive = require('massive');

const passport = require('passport');
const strategy = require(`${__dirname}/strategy.js`);

const config = require(`${__dirname}/config.js`);
const {
    domain,
    clientID,
    clientSecret,
    db
} = config;

//require('dotenv').config()

const createInitialSession = require(`${__dirname}/middlewares/session.js`);

const app = express();

app.use(cors());


//users 
massive(db)
    .then(dbInstance => app.set('db', dbInstance));

app.use(express.static(`${__dirname}/client/build`));
app.use(session({
    secret: 'brucespringsteinmegaboss',
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser(function (user, done) {
    console.log("SERIALIZE")
    let {
        id,
        first,
        last
    } = user;
    done(null, {
        id: id || '',
        first: first || '',
        last: last || '',
        picture: 'https://robohash.org/me'
    });

});

passport.deserializeUser((user, done) => {
    console.log("DESERIALIZE")
    let {
        id,
        first,
        last
    } = user;
    let dbInstance = app.get('db');
    dbInstance.find_user([id]).then((match) => {
        if (match.length) {
            console.log("user exists")
            done(null, match[0])
        } else {
            dbInstance.create_user([id, first, last, 'https://robohash.org/me']).then((r) => {
                console.log("added new user to DB")
                dbInstance.find_user([id]).then((newMatch) => {
                    done(null, newMatch[0])
                })
            })
        }
    })

});

const authUrl = "/api/auth";
const friendUrl = "/api/friend";
const userUrl = "/api/user";
const recommendedUrl = "/api/recommended";

app.get(`${authUrl}/login/`, passport.authenticate('auth0', {
    successRedirect: `${authUrl}/setUser/`,
    failureRedirect: `${authUrl}/login/`,
    failureFlash: true
}));

app.get(`${authUrl}/setUser/`, passport.authenticate('auth0'), (req, res) => {
    console.log("SETUSER ENDPOINT")
    //res.status(200).send(JSON.stringify(req.user, null, 10));
    res.redirect(`${authUrl}/loggedin/`)
    // res.redirect("http://localhost:3000/")
});

app.get(`${authUrl}/loggedin/`, (req, res, next) => {
    //console.log(req.user)
    console.log("LOGGEDIN ENDPOINT")
    if (!req.user) {
        console.log("REDIRECT TO LOGIN")
        res.status(403).redirect(`${authUrl}/login/`);
    } else {
        console.log("REDIRECT TO DASHBOARD")
        res.status(200).redirect("/#/");
    }
});

app.get(`${authUrl}/authenticated/`, (req, res, next) => {
    console.log(req.user)
    console.log("AUTHENTICATE ENDPOINT")
    if (!req.user) {
        res.send(false);
    } else {
        res.send(true);
    }
});

app.get(`${authUrl}/logout/`, (req, res, next) => {
    req.logout();
    delete req.session;
    delete req.user;
    res.status(200).redirect(`${authUrl}/login/`);
});

app.get(`${friendUrl}/list/`, controller.listFriends);
app.post(`${friendUrl}/add/`, controller.addFriends);
app.post(`${friendUrl}/remove/`, controller.removeFriends);

app.patch(`${userUrl}/patch/`, controller.updateUser);
app.get(`${userUrl}/list/`, controller.listUsers);
app.get(`${userUrl}/search/:page/`, controller.searchUsers);

app.post(`${recommendedUrl}/`, controller.listRecommended);
app.post(`${recommendedUrl}/add/`, controller.addRecommended);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`feeling porty --> ${port}`);
});