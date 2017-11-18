





function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}


function lyrics(song, artist) {
    let song1 = song.replace(/\s/g, "-")
    let artist1 = artist.replace(/\s/g, "-")
    let result = "";
    
    return $.ajax(
        {
            method: "GET",
            url: "https://genius.com/" + artist1 + "-" + song1 + "-lyrics",
            complete: function (result) {
                
            },
            error:function (xhr, ajaxOptions, thrownError){
                if(xhr.status==404) {
                    //alert(thrownError);
                }
            }
        }
    )



}

function callback(result){
    console.log("ok")
    let element = $("<div>").html(result)[0]

    let answer = element.querySelector(".lyrics p").textContent
    // console.log(answer)
    console.log("ok")
    return answer
}

let requests = []



// let songs = [
//     {song: "Gucci Gang", artist: "Lil Pump"},
//     {song: "Silence", artist: "Marshmello"},
//     {song: "rockstar", artist: "Post Malone"},
//     {song: "Havana", artist: "Camila Cabello"},
//     {song: "Young Dumb and Broke", artist: "Khalid"},
//     {song: "Let Me Go (with Alesso, Florid", artist: "Hailee Steinfeld"},
// ]

d3.json("top50.json", function(err, data){
    let songs = data.map(x => {return {
        song: x.song, artist: x.artists[0]
    }})

    for(var song of songs){
        requests.push(lyrics(song.song, song.artist))
    }
    
    $.when.apply(undefined, requests).then(function(){
        for(let i = 0; i < arguments.length; i++){
            let dom = arguments[i][0]
            let out = callback(dom)
            songs[i].lyrics = out
    
        }
        console.log(songs)
    }, function(error){
        console.log(error)
    })
    
    
    
})

// console.log("Young Dumb and Broke".replace(/\s/g, "-"))

// let requests = [];


