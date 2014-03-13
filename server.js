//digestable node.js based server

//dependencies
var http = require('http'),
	colors = require('colors'),
	express = require('express');
var engines = require('consolidate');
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var app = express();

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
/* ////////////////////////////////////////////
End of initialization
*//////////////////////////////////////////////


//server communications comes in here-
//is this the way we wanna do things?
app.post('*', function(request, response){

}

/* ////////////////////////////////////////////
Methods that get called on our server
*//////////////////////////////////////////////

//generates an entry
function generateNewEntry(roughEntry){
    unique_id = generateMessageIdentifier();
}

//editEntry
function editEntry(roughEntry, oldID){
    unique_id = generateMessageIdentifier();
}

//deletes an entry
function deleteEntry(entryID){

}

//creates a subscription
function subscribeToEmail(EntryId,whatotherparamtersdoweneed){

}

//unsubscribes
function unsubscribe(email,entryID){

}

//scrapes
function scrapeAddress(httpAddress){

}

/* ////////////////////////////////////////////
Internal server functionality
*//////////////////////////////////////////////

//generate a message identifier
function generateMessageIdentifier() {
    // make a list of legal characters
    // we're intentionally excluding 0, O, I, and 1 for readability
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    var result = '';
    for (var i = 0; i < 9; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}
