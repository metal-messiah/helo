//     id SERIAL UNIQUE,
//     name VARCHAR(40)
//     description TEXT,
//     address VARCHAR(100),
//     city VARCHAR(40),
//     state VARCHAR(20),
//     zip VARCHAR(10),
//     image TEXT,
//     loanamt INTEGER,
//     monthly INTEGER,
//     rent INTEGER

module.exports = {
    listFriends: (req, res) => {
        let dbInstance = req.app.get('db');

        const {
            id
        } = req.user;
        dbInstance.list_friends([id]).then((friends) => {
            res.status(200).send(JSON.parse(friends))
        }).catch(err => res.status(500).send(err))
    },
    addFriends: (req, res) => {
        let dbInstance = req.app.get('db');

        var {
            friendID
        } = req;
        const {
            id
        } = req.user;
        dbInstance.list_friends([id]).then((friends) => {
            var friendsArr = JSON.parse(friends);
            friendsArr.push(friendID)
            dbInstance.update_friends([friendsArr, id]).then(() => {
                res.status(200).send(friendsArr)
            }).catch(err => res.status(500).send(err))
        }).catch(err => res.status(500).send(err))
    },
    removeFriends: (req, res) => {
        let dbInstance = req.app.get('db');

        var {
            friendID
        } = req;
        const {
            id
        } = req.user;
        dbInstance.list_friends([id]).then((friends) => {
            var friendsArr = JSON.parse(friends);
            var i = friendsArr.findIndex((friend) => friend == friendID);
            friendsArr.splice(i, 1);
            dbInstance.update_friends([friendsArr, id]).then(() => {
                res.status(200).send(friendsArr)
            }).catch(err => res.status(500).send(err))
        }).catch(err => res.status(500).send(err))
    },
    updateUser: (req, res) => {
        let dbInstance = req.app.get('db');
        const {
            id
        } = req.user;

        const {
            firstname,
            lastname,
            gender,
            haircolor,
            eyecolor,
            hobby,
            birthday,
            birthmonth,
            birthyear,
            picture
        } = req;

        dbInstance.update_user([id, firstname, lastname, gender, haircolor, eyecolor, hobby, birthday, birthmonth, birthyear, picture]).then(() => {
            dbInstance.find_user([id]).then(user => {
                res.status(200).send(user)
            }).catch(err => res.status(500).send(err))
        }).catch(err => res.status(500).send(err))
    },
    listUsers: (req, res) => {
        let dbInstance = req.app.get('db');
        const {
            id
        } = req.user;
        //console.log(id)

        let pageID = req.query.page || 1;
        //console.log(pageID)
        var offset = (pageID * 24) - 24;
        //console.log(offset)

        let output = {};
        dbInstance.count_users([id]).then(count => {
            // console.log()
            output.count = Number(count[0].count);
            output.pages = Math.ceil(output.count / 24);
            // console.log(output)
            dbInstance.list_users([id, offset]).then(users => {
                output.users = users;
                // console.log(output)
                res.status(200).send(output)
            }).catch(err => res.status(500).send(err))
        })

    },
    searchUsers: (req, res) => {
        var {
            page
        } = req.params;
        let dbInstance = req.app.get('db');
        var {
            type,
            name
        } = req.query;
        var offset = (page * 24) - 24;
        dbInstance.search_users([type, name, offset]).then(users => {
            res.status(200).send(users)
        }).catch(err => res.status(500).send(err))

    },
    listRecommended: (req, res) => {
        const {
            id
        } = req.user;
        let dbInstance = req.app.get('db');
        var type = req.params.type;

        dbInstance.find_user([id]).then(user => {
            dbInstance.search_recommended([id, type, user[type]]).then(users => {
                res.status(200).send(users)
            }).catch(err => res.status(500).send(err))

        })


    },
    addRecommended: (req, res) => {
        let dbInstance = req.app.get('db');

        var {
            friendID
        } = req;
        const {
            id
        } = req.user;
        dbInstance.list_friends([id]).then((friends) => {
            var friendsArr = JSON.parse(friends);
            friendsArr.push(friendID)
            dbInstance.update_friends([friendsArr, id]).then(() => {
                // res.status(200).send(friendsArr)
                dbInstance.find_user([id]).then(user => {
                    dbInstance.search_recommended([id, type, user[type]]).then(users => {
                        res.status(200).send(users)
                    }).catch(err => res.status(500).send(err))
        
                })
            }).catch(err => res.status(500).send(err))
        }).catch(err => res.status(500).send(err))
    }
};