const cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const uuid = require('uuid-random');
const rateLimit = require('express-rate-limit');
var randomUid = uuid();
const app = express();
const client = require('./redisConnector');
const ratelimiter = rateLimit({
    max: 500,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send
});



app.use(cors());
app.use(ratelimiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

loadFile();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    next();
});

function loadFile() {
    app.use(express.static(__dirname));
    app.use(bodyParser.json());

    var users = {}
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var normalizedPath = require("path").join(__dirname);
    app.use(express.static(normalizedPath));
    //Adding admin on server load
    async function addAdmin() {
        // Check if admin already exists
        await client.hget("users", "admin", async function (error, result) {
            var user = JSON.parse(result);
            if (!user || user === 'nil') {
                let admin = {
                    name: "admin",
                    password: "admin",
                    email: "admin",
                    cart: {},
                    purchases: {}
                }
                client.hset('users', "admin", JSON.stringify(admin));
            }
        });
    }
    addAdmin();

    app.post('/register', async (req, res) => {
        try {
            let email = req.body.email;
            let user = {
                name: req.body.username,
                password: req.body.password,
                email: req.body.email,
                cart: {},
                purchases: {}
            }
            client.hset('users', email, JSON.stringify(user));
            return res.send('OK');
        } catch (err) {
            console.log(err);
            return res.send('FAIL');
        }
    });

    app.post('/login', async function (req, res) {
        try {
            var givenMail = req.body.email;
            var givenPassword = req.body.password;
        } catch (err) {
            console.log(err)
            res.status(400).send("bad input")
        }
        await client.hget("users", givenMail, async function (error, result) {
            try {
                var user = JSON.parse(result);
                if (!user || user === 'nil') {
                    res.status(200).send('NOT EXIST');
                }
                else if (user.password === givenPassword) {
                    let loginList = {};
                    loginTime = new Date();
                    await client.hget('logins', givenMail, async function (error, result) {
                        if (!result || result === "") {
                            loginList = { 0: loginTime }
                        } else {
                            loginList = JSON.parse(result);
                            var lastIndex = Object.keys(loginList).length
                            loginList[lastIndex + 1] = loginTime
                        }
                        await client.hset('logins', givenMail, JSON.stringify(loginList))

                    })
                    users[randomUid] = { email: givenMail, id: randomUid, cart: {} };
                    res.status(200).send({ uid: randomUid, userName: givenMail, mail: givenMail, name: user.name });
                }
                else {
                    res.status(200).send("FAIL");
                }
            } catch (err) {
                console.log(err);
                res.status.send(err);
            }
        });
    });

    app.post('/auth', async function (req, res) {
        try {
            if (!users || Object.keys(users).length === 0) {
                res.send('false');
                return;
            }
            let cookieUid = req.body.uid;
            if (!cookieUid) {
                res.send('false');
                return;
            }
            user = users[cookieUid];
            let userEmail = user.email;
            res.send(userEmail);
        } catch (err) {
            console.log(err);
            return res.send('false');
        }
    });

    app.get('/adminLoadLogins', async function (req, res) {
        try {
            await client.hgetall("logins", function (error, result) {
                res.send(result)
            })
        } catch (err) {
            throw err;
        }
    });

    app.get('/adminLoadData', async function (req, res) {
        try {
            await client.hgetall("users", function (error, result) {
                var users = result;
                if (!users || users === 'nil') {
                    res.status(500).send("couldn't find any users");
                }
                else {
                    res.send(users);
                }

            });
        } catch (err) {
            console.log(err);
            res.status(500).send();
        }
    });

    app.post('/deleteUser', async function (req, res) {
        // Not using a DELETE request here because we rely on the body
        try {
            const userToDelete = req.body.email;
            await client.hdel("users", userToDelete);
            await client.hdel("logins", userToDelete);
        } catch (err) {
            res.send("err");
        } finally {
            res.send("success");
        }
    });

    app.post('/cart', async function (req, res) {
        try {
            var mail = req.body.email;
            if (mail === "" || mail === undefined) {
                //received empty email
                return res.send('FAIL');
            }
            await client.hget("users", mail, async function (error, result) {
                try {
                    var user = JSON.parse(result);
                    console.log(user);
                    if (!user || user === 'nil') {
                        console.log("not exists");
                        res.send('cart user NOT EXIST');
                    } else {
                        var cartProducts = user.cart;
                        res.send(cartProducts);
                    }
                } catch (err) {
                    console.log(err);
                    return res.send('FAIL');
                }
            });
        } catch (err) {
            console.log(err);
            return res.send('FAIL');
        }
    });

    app.put('/addProduct', async function (req, res) {
        try {
            var userId = req.body.userId;
            var productId = req.body.productId;
            var number = req.body.count;
            var givenMail = req.body.email;
            products = {}
            products[productId] = number
        } catch (err) {
            console.log(err);
            res.status(400).send("FAIL");
        }
        await client.hget("users", givenMail, async function (error, result) {
            try {
                var resultProc = JSON.parse(result);
                var cart = resultProc.cart;
                var newCart = Object.assign({}, products, cart);
                let newUser = {
                    name: resultProc.name,
                    password: resultProc.password,
                    email: resultProc.email,
                    cart: newCart,
                    purchases: resultProc.purchases
                }
                console.log(`new user is ${JSON.stringify(newUser)}`);
                users[userId] = { email: givenMail, id: randomUid, cart: newUser.cart }
                await client.hset("users", givenMail, JSON.stringify(newUser))
                res.send("OK");
            } catch (err) {
                res.send("FAIL");
            }
        })

    });

    app.post('/purchaseOrder', async function (req, res) {
        try {
            var userEmail = req.body.email;
        } catch (err) {
            res.status(500).send(err)
            await client.hget("users", userEmail, async function (error, result) {
                try {
                    var resultProc = JSON.parse(result);
                    var purchases = Object.assign({}, resultProc.purchases, resultProc.cart);
                    var user = {
                        name: resultProc.name,
                        password: resultProc.password,
                        email: resultProc.email,
                        cart: {},
                        purchases: purchases
                    }
                    await client.hset("users", userEmail, JSON.stringify(user))
                    res.send("OK");
                } catch (err) {
                    res.send("FAIL");
                }
            })
            res.status(200).send('');
        }
    });

    app.post('/logout', async function (req, res) {
        try {
            uid = req.body.uid;
            delete users[uid];
            res.send("great");
        } catch (err) {
            res.send(err);
            throw err;
        }
    });

    app.post('/removeItemFromCart', async function (req, res) {
        try {
            var userEmail = req.body.email;
            var itemId = req.body.itemId;
        } catch (err) {
            res.status(400).send("bad input")
        }
        await client.hget("users", userEmail, async function (error, result) {
            try {
                var resultProc = JSON.parse(result);
                var newCart = {};
                for (var key in resultProc.cart) {
                    if (key !== itemId) {
                        newCart[key] = resultProc.cart[key];
                    }
                }
                var user = {
                    name: resultProc.name,
                    password: resultProc.password,
                    email: resultProc.email,
                    cart: newCart,
                    purchases: resultProc.purchases
                }
                await client.hset("users", userEmail, JSON.stringify(user));
                res.send("OK");
            } catch (err) {
                res.send("FAIL");
            }
        })
    });
}

app.listen(3000, function () {
    console.log("Express server listening on port ", 3000);
});

module.exports = app;
