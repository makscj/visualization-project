var Spotify = require('spotify-web-api-js');
var s = new Spotify();



let clientid = "eb8971d82d674024903bc6488998b737"
let secret = "32c3f68f231e4c23b8cefc27573a6e0e"
let redirect = "http://localhost:8080"
let token = ""
let expiration = 0

let tracks = []


function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}


let getTopSongs = function (t) {
    s.setAccessToken(t)
    s.getUserPlaylists('Spotify')
        .then(function (data) {
            return data.items[0].id //Top 50
        })
        .then(function (playlistId) {
            return s.getPlaylistTracks('spotify', playlistId)
        })
        .then(function (playlistData) {
            console.log(playlistData);
            tracks =  playlistData.items.map(obj => {
                let track = obj.track;
                return {
                    song: track.name,
                    album: track.album.name,
                    artists: track.artists.map(a => a.name),
                    songId: track.id,
                    popularity: track.popularity,
                    href: track.href,
                    markets: track.available_markets,
                    explicit: track.explicit,
                    images: track.album.images
                } 
            })
            // console.log(tracks)
            return tracks;
        })
        .then(function(tracks){
            console.log(tracks)
            let ids = tracks.map(x => x.songId)
            console.log(ids)
            return s.getAudioFeaturesForTracks(ids);
            
        })
        .then(function(features){
            let L = tracks.length;
            console.log(features)
            console.log(features.audio_features)
            for(let i = 0; i < L; i++){
                tracks[i].features = features.audio_features[i]
            }
            return tracks
        })
        .then(function(tracks){
            download(JSON.stringify(tracks), "top50.json", "text/plain")
        })
        .catch(function (error) {
            console.log(error);
        })

}


let tokenIsSet = true

if (tokenIsSet) {
    token = "BQAVf_A-TgMc7aHShZd44Gbl4-B2zWt1v8SiCcN4ih-JHHqN7HQ7KmJWT4N-cxS_9H7oAWeOEdRNdR0antVOtw"
    getTopSongs(token)
}
else {
    $.ajax(
        {
            method: "POST",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                'Authorization': 'Basic ' + btoa(clientid + ":" + secret)
            },
            data: {
                "grant_type": "client_credentials",
                "redirect_uri": redirect,
                "client_id": clientid,
            },
            success: function (result) {
                token = result.access_token
                console.log(token)
                expiration = result.expires_in
                getTopSongs(token)


            },
        }
    );
}



