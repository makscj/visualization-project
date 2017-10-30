d3.json("data.json", function(error, someData) {
    d3.json("data-all.json", function(error, allData){
        console.log("All Data")
        console.log(allData)
        console.log("Some Data")
        console.log(someData)
        console.log("Filtered All Data")
        console.log(allData.filter(x => x.authors[0].affiliation != null))
    })
  })