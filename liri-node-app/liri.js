//liri info bot for spotify, omdb, twitter,
//require dot env for all the private info
require("dotenv").config();

// Create variable to store imported keys info
var keys = require("./keys.js");
//other variables for npms:
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var inquirer = require("inquirer");



// Create variables to store keys for Twitter & Spotify
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb.api_key || 'trilogy';


// create a variable for the data to return in

/// Twitter gets last 20 tweets 
twitter = function (handle) {
	handle = handle || 'remnep_elocin';
console.log('Fetching the last 20 tweets from "'+ handle +'"...');
client.get('statuses/user_timeline',{screen_name: handle,count: 20}, (error, tweet, response) => {
if(!error){
 //Loop through and display/log returned tweets 
	for (var i = 0; i < tweet.length; i++) {
	console.log('['+tweet[i].created_at + '] ' + tweet[i].text);
	}
	}else {
 ///If there is an error
return console.log('Error occurred: ' + error);
	}
	});
},


////////////////// SPOTIFY 
/// Spotify Gets Songs
spotify = function (song) {
    song = song || 'The Sign Ace of Base';
    spotify.search({ type: 'track', query: song, limit: 1 }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var result = data.tracks.items;
        for (var i = 0; i < result.length; i++) {
            // setup variables
            var artists = result[i].artists;
            var song = result[i].name;
            var link = result[i].external_urls.spotify;
            var album = result[i].album.name;
            var albumType = result[i].album.album_type;

            // Display list of artists
            for (var r = 0; r < artists.length; r++) {
                console.log('Artist[' + (r + 1) + ']: ' + artists[r].name);
                actions.writeToLogFile('Artist[' + (r + 1) + ']: ' + artists[r].name);
            }

            // Display data in console
            console.log('Song name: ' + song);
            console.log('Preview Link: ' + link);
            console.log('Album (' + albumType + '): ' + album);
        }
    });
},



    ///////////////////////////// OMDB
    ///omdb movie part//uses request 
    //* `movie-this`//<movie name here>'
    //output: //title, yeah, raiting, rotton tomatoes, country, language, p,ot, actors
    movies = function (movie) {
        // Store all of the arguments in an array
        var nodeArgs = process.argv;
        // Create an empty variable for holding the movie name
        var movieName = "";

        // Loop through all the words in the node argument
        // And do a little for-loop magic to handle the inclusion of "+"s
        for (var i = 2; i < nodeArgs.length; i++) {
            if (i > 2 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
            }
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        // Then run a request to the OMDB API with the movie specified

        //return 'mr. nobody if no input
        movieName = movieName || "Mr. Nobody";

        request(queryUrl, function (error, response, body) {
            //if error, return error
            if (error) {
                return console.log('Error occurred: ' + error);
            }
            // If the request is successful
            if (!error && response.statusCode === 200) {
                if (movieName === "") {
                    return (movieName === "Mr. Nobody");
                }
                // Parse the body of the site and get the info 
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("Rated: " + JSON.parse(body).Rated);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Rating: " + JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            }
        });



        ////////////////////////////////////

        // DO SOMETHING gets txt

        random = function (file) {
            file = file || 'random.txt';
            // Read data from the file
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) throw err;
                // Convert data Buffer to a string
                var fileData = data.split(',');
                // Extract the command from the file
                var fileCommand = fileData[0];
                // Extract the query from the file
                // Remove quotes from query string 
                var fileQuery = fileData[1].replace(/\"/g, '');

                // Use recursion to run the command from the file
                if (!(fileCommand === "do-what-it-says")) {
                    execute(fileCommand, fileQuery);
                };



                /////////////////// command executions
                execute = function (command, query) {
                    if (command === "my-tweets") {
                        console.log['twitter'](query);
                    } else if (command === "spotify-this-song") {
                        console.log['spotify'](query);
                    } else if (command === "movie-this") {
                        console.log['omdb'](query);
                    } else if (command === "do-what-it-says") {
                        console.log['random'](query);
                    } else {
                        console.log("Sorry, " + command + " is not a valid command.");
                    }
                };




                //call all the funcitons
                movies();
                song();
                //tweets();
                random();

                // annnnnd ACTION!
                execute(process.argv[2], process.argv[3]);

