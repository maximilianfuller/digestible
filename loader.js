var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://digestible.db');

conn.query('CREATE TABLE Emails (email_id INT AUTO_INCREMENT PRIMARY KEY, recipient TEXT, ' + 
    'date_to_send TEXT, entry_id TEXT, collection_id TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Entries (entry_id INT AUTO_INCREMENT PRIMARY KEY, collection_id TEXT, ' + 
    'author TEXT, title TEXT, date_submitted TEXT, subject TEXT, content TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Collections (collection_id INT PRIMARY AUTO_INCREMENT KEY, ' + 
    'collection_title TEXT, creator_email TEXT);') 
    .on('error', function() {
        console.error; 
    });

conn.query('CREATE TABLE Creator_login (email TEXT PRIMARY KEY, password TEXT)')
	.on('error', function() {
		console.error;
	});


//DATABASES
    //email TABLE
    	//email id
    	//recipient
    	//date to send
    	//entry id
    	//collection id
    	//(to delete an email, select by collection id and recipient)
    	//hash map of email ids to jobs

    //entry TABLE
    	//(primary) entry id
    	//collection id
    	//author
    	//title
    	//date_submitted
    	//content
    	//color scheme
    	//more data

    //collections TABLE
        //(primary) collection_id
        //collection title
        //creator email

    //username and password TABLE (for creators only)
    	//(primary) email
    	//password

    //////////OPTIONAL///////////
    //(for creator's dashboard)
    	//(primary) creator id
    	//collection id



