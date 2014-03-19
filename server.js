//digestable node.js based server

//dependencies
var http = require('http'),
	colors = require('colors'),
	express = require('express');
var engines = require('consolidate');
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://digestible.db');
var app = express();

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));

function Entry(entry-id, collection-id, collection-title, 
    creator-email, author TEXT, title TEXT, date-submitted TEXT, content TEXT) {
    this.entry-id = entry-id;
    this.collection-id = collection-id;
    this.collection-title = collection-title;
    this.creator-email = creator-email;
    this.author = author;
    this.title = title;
    this.date-submitted = date-submitted;
    this.content = content;
}

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
function makeNewEntry(entry, collection-id){
    conn.query('INSERT INTO Entries (entry-id, collection-id, collection-title, ' + 
        'creator-email, author, title, date-submitted, content)' + 
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [
            entry.entry-id, 
            entry.collection-id, 
            entry.collection-title,
            entry.creator-email
            entry.author,
            entry.title,
            entry.date-submitted,
            entry.content
        ])
        .on('error', console.error);
}

//editEntry
function editEntry(entry, entryID){
    unique_id = generateMessageIdentifier();
}

//deletes an entry
function deleteEntry(entryID){
    conn.query('DELETE FROM Entries WHERE entry-id=$1', [entryID])
        .on('error', console.error);
}



//creates a subscription
function subscribeToEmail(EntryId,whatotherparamtersdoweneed){

}

//unsubscribes
function unsubscribe(email,entryID){

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
