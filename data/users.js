const stripe = require('stripe')('sk_test_51IhyPDAWkB06UtUHrj9tcPEAlpW08bJB0CUcrRRUd3Sz2lMFMhl4yT59nT6vJhXZkVQ4SloqaMDs4Y8PNLjDss7W00QrMmpJZB'); // Add your Secret Key Here
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const result = await userCollection.find().toArray();
        return result;
    },

    async getUserByName(username, password) {
        if (!username || !password) {
            // console.log('Error: username or password is not referred while getUserByName');
            return undefined;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserByName`);
            return undefined;
        }

        if (user.password != password) {
            // console.log(`Error: user "${username}" password is not correct while getUserByName`);
            return undefined;
        }

        return user;
    },

    async getUserInfo(username) {
        if (!username) {
            // console.log('Error: username is not referred while getUserInfo');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while getUserInfo`);
            return false;
        }

        return user;
    },

    async addUser(data) {
        if (data.username === undefined || data.password === undefined || data.email === undefined) {
            // console.log("Failed in AddUser! Username or Password is undefined");
            return false;
        }

        const userCollection = await users();

        const newuser = {
            username: data.username,
            password: data.password,
            email: data.email,
            avatar: 0,
            point: 0,
            heart: 3,
            coin: 0,
            revive: 24,
            remove_admob: 0,
        };

        const newInsertInformation = await userCollection.insertOne(newuser);
        if (newInsertInformation.insertedCount === 0) {
            // console.log('Could not add user');
            return false;
        }
        return true;
    },

    async addUserValue(username, data) {
        if (!username || !data) {
            console.log('ReferenceError: Username is not supplied while addUserValue');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while addUserValue`);
            return false;
        }

        const updateduserData = user;

        if (data.point) updateduserData.point = Number.parseInt(updateduserData.point) + data.point;
        if (data.coin) updateduserData.coin = Number.parseInt(updateduserData.coin) + data.coin;
        if (data.heart!=0)
        {
            updateduserData.heart += data.heart;
            var date = new Date();
            var hour = date.getHours();
            updateduserData.revive = hour;
        } 
        if (updateduserData.heart > 3) updateduserData.heart = 3;

        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update UserValue successfully');
            return false;
        }

        return updateduserData;
    },

    async changeUser(username, avatar) {
        if (!username) {
            console.log('ReferenceError: Username is not supplied while addUserValue');
            return false;
        }

        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });

        if (!user) {
            // console.log(`Error: user "${username}" not exist while addUserValue`);
            return false;
        }

        const updateduserData = user;

        updateduserData.avatar = avatar;
        const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });

        if (updatedInfo.modifiedCount === 0) {
            console.log('could not update UserValue successfully');
            return false;
        }

        return true;
    },

    async purchaseCoin(username, tokenId, method, socket) {
        console.log(tokenId.id)
        if (!username || !tokenId) {
            console.log('ReferenceError: Username is not supplied while addUserValue');
            return false;
        }
        console.log('stage1')
        const userCollection = await users();
        console.log('stage2')
        const user = await userCollection.findOne({ username: username });
        console.log(user)
        if (!user) {
            // console.log(`Error: user "${username}" not exist while addUserValue`);
            return false;
        }

        try {
            let purchase_amount = 0;
            let purchase_description = "";
            if(method == 0){
                purchase_amount = 299;
                purchase_description = "Line_chaser Remove Admob for this month";
            }
            else if(method == 1){
                purchase_amount = 99;
                purchase_description = "Line_chaser Purchase 1000 Coin";
            }
            else if(method == 2){
                purchase_amount = 299;
                purchase_description = "Line_chaser Purchase 10000 Coin";
            }
            console.log("--------------we are here for stripe!")
            stripe.customers.create({
                name: user.username,
                email: user.email,
                source: tokenId.id
              })
              .then(customer => {
                  console.log("we are here for stripe!")
                  stripe.charges.create({
                    amount: purchase_amount,
                    currency: "gbp",
                    customer: customer.id,
                    description: purchase_description,
                  })
              }
              )
              .then(async () => {
                    const updateduserData = user;
                    if(method == 2)
                        updateduserData.coin += 10000;
                    else if(method == 1)
                        updateduserData.coin += 1000;
                    else if(method == 0){
                        var date = new Date();
                        var month = date.getMonth();
                        updateduserData.remove_admob = month;
                    }
                    const updatedInfo = await userCollection.updateOne({ _id: user._id }, { $set: updateduserData });
            
                    if (updatedInfo.modifiedCount === 0) {
                        console.log('could not update UserValue successfully');
                    }
                    socket.emit('update_userdata', {result: updateduserData});
                    socket.emit('purchase_coin', {result: "Purchase Succeed"});
                })
                .catch((err) =>{
                    socket.emit('purchase_coin', {result: false});
                    console.log(err)
                });
            } catch (err) {
            console.log(err)
        }


        return true;
    },

    async ranking(username) {
        if (!username) {
            console.log('ReferenceError: Username is not supplied while addUserValue');
            return false;
        }

        const userCollection = await users();
        const my_rank = await userCollection.aggregate(
            { $sort : {"point" : -1}},
            {
                "$group": {
                    "_id": false,
                    "users": {
                        "$push": {
                            "_id": "$_id",
                            "username": "$username",
                            "point": "$point"
                        }
                    }
                }
            },
            {
                "$unwind": {
                    "path": "$users",
                    "includeArrayIndex": "ranking"
                }
            },
            {
                "$match": {
                    "users.username": username
                }
            },
            { $sort : {"ranking" : 1}}).toArray();

        const rank_list = await userCollection.find().sort({point:-1}).limit(10).toArray();
        let a=rank_list[0].username;
        return {my_rank: my_rank, rank_list: rank_list};
    },
};

module.exports = exportedMethods;