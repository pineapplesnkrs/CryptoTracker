const dbMan = require("../backend/dbConn.js");

async function addUser(username, password, email){
    const myDb = await dbMan.get("cryptoTracker");
    var newUser = { username : username, password : password, email : email };
    const result = await myDb.collection("users").insertOne(newUser)
    console.log(`inserted with id ${result.insertedId}`);
    return result;
}

async function run(){
    await addUser("test", "test", "test@gmail.com");
}

run()