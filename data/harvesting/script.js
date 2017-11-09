Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

divide = (a,b) => (0.0 + a.size)/(b.size)

computeJaccard = function(set1, set2, stopwords){
    let intersect = set1.intersection(set2)
    let union = set1.union(set2)

    let fJacc = (0.0 + intersect.size)/(union.size)

    let intersectStop = intersect.difference(stopwords)
    let unionStop = union.difference(stopwords)

    
    let prec = divide(intersectStop, unionStop)
    let rec = divide(intersectStop, union)

    
    // console.log("Precision: " + prec)
    // console.log("Recall: " + rec)
    // console.log("F: " + (2*((prec*rec)/(prec + rec))))

    // let sJacc = divide(intersect,union)


    return (2*((prec*rec)/(prec + rec)))

    // return (0.0 + intersect.size)/(union.size)
}

computeJaccardFromString = function(str1, str2, stopwords){
    return computeJaccard(computeWordset(str1), computeWordset(str2), stopwords)
}

computeWordset = function(sentence, stopwords){
    return new Set(sentence
        .split(/\W+/)
        .filter(function(token) {
            token = token.toLowerCase();
            
            return token.length >= 2// && (stopwords.indexOf(token) == -1 || useWords);
        })
        .map(
            x => x.toLowerCase()
                .replace(/(uni\b\.?|univ\b\.?|u\b\.?)/i, "university")
                .replace(/(st\b\.?)/i, "saint")
            )
        )
}


d3.json("data.json", function(error, someData) {
    d3.json("data-all.json", function(error, allData){
        // console.log("All Data")
        // console.log(allData)
        // console.log("Some Data")
        // console.log(someData)
        // console.log("Filtered All Data")
        console.log(allData.filter(x => x.authors[0].affiliation != null))
        // ----------------------

        schools = {}

        regExpressions = [
            /^U [\w]+/,// Catches "U Utah"
            /^.+ (U\.?$|Univ\.?$|Uni\.?$|University$)/, //Catches "Harvard U" or "Harvard Uni" or "Harvard Univ", with our without period abbr on U/Uni/Univ,
            /^(Department|Dipartimento|Dept\.|Dip\.|Dep\.|Departamento).+, .+$/, //Catches "Department {of ...}, {...}", with multiple languages and abbrv.
            /(Universidad|Universit\xE9|University|Universite|Univ\.?|Uni\.?|U\.?)( of| de)? \w+/, //Catches University of SCHOOL, with different abbr for University,
            /^\w+$/, //Catches one-word names, like Stanford
            /^\w+\/\w+$/, //Catches dual 1-word universities names, like Stanford/Berkeley
            /.*(Institute|Instituto) (of|de|for).*/, //catch a couple of insitutes
        ]


        testReg =  /^U [\w]+/ //Catches 

        countMatches = 0

        matchedSchools = new Set()
        unmatchedSchools = new Set()

        for(record of someData){
            for(author of record.authors){
                school = author.affiliation
                
                let count = 0
                for(re of regExpressions){
                    if(re.test(school) && school != null){
                        countMatches += 1
                        count++
                    }
                    
                }
                if(count > 0){
                    matchedSchools.add(school)
                }else{
                    unmatchedSchools.add(school)
                }

                schools[author.affiliation] = schools[author.affiliation] || 0;
                schools[author.affiliation] ++
            }
        }

        console.log(schools)
        console.log(Object.keys(schools).length)
        // console.log(countMatches)

        console.log(matchedSchools)

        let matchedSets = {}

        
    

        let clusters = []

        
        let stopwordsWithoutUni = ["of", "the", "department", "physics", "math", "astronomy", "dipartimento", "astronomia", "universita", ".", ",", "state"]
        let stopwords = ["university", "of", "the", "univ", "univ.", "uni.", "uni", "department", "physics", "math", "astronomy", "dipartimento", "astronomia", "universita", ".", ",", 
    "graduate", "school", "science", "technology", "college", "central", "eastern", "northern", "western", "southern"]


        let tests = ["University of California", "Univ. California", "California Coast University", "California State University"]

        for(t1 of tests){
            for(t2 of tests){
                if(t1 != t2){
                    console.log(t1 + " : " + t2)// + " -> " + computeJaccardFromString(t1,t2,stopwords))
                    computeJaccardFromString(t1, t2, stopwords)
                    console.log("---------")
                }
            }
        }

        for(school of matchedSchools){
            let cluster = {
                name: school,
                tokens: computeWordset(school, stopwords),
                choices: [],
                center: ""
            }
            clusters.push(cluster)
        }

        console.log(clusters)

        


        // for(let i = 0; i < 3; i++){
        //     for(cluster1 of clusters){
        //         for(cluster2 of clusters){
        //             if(cluster1 == cluster2)
        //                 continue
        //             let intersect = cluster1.set.intersection(cluster2.set)
        //             let union = cluster1.set.union(cluster2.set)
        //             let jaccard = (intersect.size/(0.0 + union.size))
        //             if(jaccard > 0.45){
        //                 // console.log(cluster1.name, "|||",cluster2.name, "|||", jaccard)
        //                 cluster1.set = intersect
        //                 let index = clusters.indexOf(cluster2)
        //                 clusters.splice(index,1)

        //             }        
        //         }
        //     }
        // }
        // console.log(clusters)
            



        // console.log(unmatchedSchools)


        d3.csv("universities-us.csv", function(error, universities) {
            // let webregex = /^(?:www\.)?(.*?)\.(?:com|au\.uk|co\.in)$/
            // console.log(universities)
            // console.log(universities.map(x => x.website.match(webregex)))
            uniMap = new Map()
            for(let uniTuple of universities){
                let acronymSet = new Set()
                acronymSet.add(uniTuple.shorthand)
                acronymSet.add(uniTuple.school.split(" ").map(x => x[0]).join(""))
                // console.log(schoolSet)
                // console.log("-----")
                uniMap.set(uniTuple.school, {"name": uniTuple.school, "tokens": computeWordset(uniTuple.school, stopwords), "acronyms":acronymSet , "valid":[]})
            }
            let neverAdded = []
            for(let cluster of clusters){
                let wasAdded = false
                for(let key of uniMap.keys()){
                    let buckets = uniMap.get(key).tokens
                    let acronymBuckets = uniMap.get(key).acronyms
                    


                    let similarity = computeJaccard(cluster.tokens, buckets, new Set(stopwords))
                    let similarityNoStops = computeJaccard(cluster.tokens, buckets, new Set(stopwordsWithoutUni))
                    let similarityAcro = computeJaccard(cluster.tokens, acronymBuckets, new Set(stopwords))


                    let threshold = 1.0/3.0

                    let pairSim = {
                        school: key,
                        similarity: similarity >= threshold ? similarity : -1,
                        acronymSimilarity: similarityAcro >= threshold ? similarityAcro : -1,
                        noStopWordSimilarity: similarityNoStops >= threshold ? similarityNoStops : -1
                    }
                    if(similarity >= threshold || similarityAcro >= threshold)
                        cluster.choices.push(pairSim)
                    // if(similarity >= 0.5 || similarityAcro > 0.5){
                    //     // console.log(key, similarity)
                    //     uniMap.get(key).valid.push(cluster.name)
                    //     wasAdded = true
                    // }
                }
                if(!wasAdded)
                    neverAdded.push(cluster.name)
            }




            let bestChoices = clusters.filter(x => x.choices.length > 0)
            bestChoices.forEach(x => x.center = x.choices.reduce(function(l, e) {
                return e.similarity > l.similarity ? e : l;
              }).school)
            console.log(bestChoices)
        
        
        })





    })
  })


