


let clientid = "gy0A7Jmy3TbGCx648de6y0bLq4mXk4Qsv5EbmEnDDxnoUqWo_NPnkeKhA46jseXs"
let secret = "32c3f68f231e4c23b8cefc27573a6e0e"
let redirect = "http://localhost:8080"
let token = ""
let expiration = 0

let tracks = []

token = "CEqT5YoGTq3BhMJ4TNE5zqltDLnBsJwDbKT7WstJNvshgAzSJ-lsYfTPuBqblBSw"

$.ajax({
    method: "GET",
    url: "https://api.genius.com/" + "search?q=Hailee%20Steinfeld",
    headers: {
        "Authorization": "Bearer " + token
    },
    success: function(result){
        console.log(result)
    }
})


// $.ajax({
//     method: "GET",
//     url: "https://api.genius.com/oauth/authorize?",
//     params: {
//         "client_id": clientid,
//         "redirect_uri": "https://localhost:8080",
//         "scope": "me",
//         "state": 1995,
//         "response_type": "code"
//     },
//     success: function(result){
//         console.log("HELP")
//         console.log(result)
//         console.log("HELP2")
//     }
// })



// function download(text, name, type) {
//     var a = document.createElement("a");
//     var file = new Blob([text], { type: type });
//     a.href = URL.createObjectURL(file);
//     a.download = name;
//     a.click();
// }


// function lyrics(song, artist) {
//     let song1 = song.replace(/\s/g, "-")
//     let artist1 = artist.replace(/\s/g, "-")
//     let result = "";

//     return $.ajax(
//         {
//             method: "GET",
//             url: "https://genius.com/" + artist1 + "-" + song1 + "-lyrics",
//             success: function (result) {
                
//             },
//         }
//     )



// }

// function callback(result){
//     let element = $("<div>").html(result)[0]

//     let answer = element.querySelector(".lyrics p").textContent
//     // console.log(answer)
//     return answer
// }




// let songs = [
//     {song: "Gucci Gang", artist: "Lil Pump"},
//     {song: "Silence", artist: "Marshmello"},
//     {song: "rockstar", artist: "Post Malone"},
//     {song: "Havana", artist: "Camila Cabello"},
//     {song: "Young Dumb and Broke", artist: "Khalid"},
//     {song: "Let Me Go (with Alesso, Florid", artist: "Hailee Steinfeld"},
// ]

// console.log("Young Dumb and Broke".replace(/\s/g, "-"))

// let requests = [];

// for(var song of songs){
//     requests.push(lyrics(song.song, song.artist))
// }

// $.when.apply(undefined, requests).then(function(){
//     for(let i = 0; i < arguments.length; i++){
//         let dom = arguments[i][0]
//         let out = callback(dom)
//         songs[i].lyrics = out

//     }
// })


// console.log(songs)
