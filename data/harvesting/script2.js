Set.prototype.union = function (setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function (setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function (setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

divide = (a, b) => (0.0 + a.size) / (b.size)

computeJaccard = function (set1, set2) {
    let intersect = set1.intersection(set2)
    let union = set1.union(set2)

    return divide(intersect, union)
}

computeJaccardFScore = function (set1, set2, stopwords) {

    // console.log(set1)
    // console.log(set2)
    let intersect = set1.intersection(set2)
    let union = set1.union(set2)

    // console.log(intersect)
    // console.log(union)

    let fJacc = (0.0 + intersect.size) / (union.size)

    let intersectStop = intersect.difference(stopwords)
    let unionStop = union.difference(stopwords)


    let prec = divide(intersectStop, unionStop)
    let rec = divide(intersectStop, union)

    // console.log(prec)
    // console.log(rec)

    // console.log("Precision: " + prec)
    // console.log("Recall: " + rec)
    // console.log("F: " + (2*((prec*rec)/(prec + rec))))

    // let sJacc = divide(intersect,union)


    return (2 * ((prec * rec) / (prec + rec)))

    // return (0.0 + intersect.size)/(union.size)
}

computeJaccardFromString = function (str1, str2, stopwords) {
    return computeJaccard(computeWordset(str1), computeWordset(str2), stopwords)
}

computeWordset = function (sentence) {
    return new Set(sentence
        .split(/\W+/)
        .filter(function (token) {
            token = token.toLowerCase();

            return token.length >= 2
        })
        .map(
        x => x.toLowerCase()
            // .replace(/(uni\b\.?|univ\b\.?|u\b\.?)/i, "university")
            .replace(/(st\b\.?)/i, "saint")
        )
    )
}

computeWordsetWithStopwords = function (sentence, stopwords) {
    return new Set(sentence
        .split(/\W+/)
        .filter(function (token) {
            token = token.toLowerCase();

            return token.length >= 2 && (stopwords.indexOf(token) == -1)// || useWords);
        })
        .map(
        x => x.toLowerCase()
            // .replace(/(uni\b\.?|univ\b\.?|u\b\.?)/i, "university")
            .replace(/(st\b\.?)/i, "saint")
        )
    )
}


d3.json("data.json", function (error, someData) {
    d3.json("data-all.json", function (error, allData) {
        // console.log("All Data")
        // console.log(allData)
        // console.log("Some Data")
        // console.log(someData)
        // console.log("Filtered All Data")
        console.log(allData.filter(x => x.authors[0].affiliation != null))
        // ----------------------

        // schools = {}

        regExpressions = [
            /^U [\w]+/,// Catches "U Utah"
            /^.+ (U\.?$|Univ\.?$|Uni\.?$|University$)/, //Catches "Harvard U" or "Harvard Uni" or "Harvard Univ", with our without period abbr on U/Uni/Univ,
            /^(Department|Dept|Dep).+, .+$/, //Catches "Department {of ...}, {...}", with multiple languages and abbrv.
            /(University|Univ\.?|Uni\.?|U\.?)( of)? \w+/, //Catches University of SCHOOL, with different abbr for University,
            /^\w+$/, //Catches one-word names, like Stanford
            /^\w+\/\w+$/, //Catches dual 1-word universities names, like Stanford/Berkeley
            /.*(Institute) (of|for).*/, //catch a couple of insitutes
            /.* [S|s]tate/,
            /^\w+, \w+$/,
            /UC \w/i,
            /.* college/i
        ]

        console.log(regExpressions[1])

        let regMatches = {};

        for (let re of regExpressions) {
            regMatches[re] = []
        }

        testReg = /^U [\w]+/ //Catches 

        countMatches = 0

        matchedSchools = new Set()
        unmatchedSchools = new Set()

        let schoolTriggers = [/(university|u\.? |univ\.?|uni\.?| u\.?|college|state|institute|institution)/i, /college/i, /state/i, /institue/i, /institution/i]

        let schoolsByReg = new Map()

        

        schoolsByReg.set(/^(Department|Dept|Dep|Graduate School)\.? of( \w+)+,/i, []) //0
        schoolsByReg.set(/.+\s?\/\s?.+/, [])
        schoolsByReg.set(/(\buniversity\b|\bu\.?(\s|$)|\buniv\.?\b|\buni\.?\b)/i, []) //2
        // schoolsByReg.set(/^U\.?C\.?\s?(\w+)+/i, [])
        schoolsByReg.set(/^U\.?C\.?\b/i, [])
        schoolsByReg.set(/(college|state|institute|institution)/i, []) //4
        schoolsByReg.set(/^\w+$/, [])
        // schoolsByReg.set(/^\w+( \w+)*-\w+( \w+)*$/, []) //6
        // schoolsByReg.set(/^\w+( \w+)*,\s?\w+( \w+)*$/, [])
        
        // schoolsByReg.set(/^\w+( \w+)*\s?\/\s?\w+( \w+)*$/, [])
        // schoolsByReg.set(/^(\w+[,.]?)(\s?\w+[,.]?)*\s?\/\s?(\w+[,.]?)(\s?\w+[,.]?)*/i, [])


        console.log(schoolsByReg)
        for(let entry of schoolsByReg.keys()){
            console.log(entry)
        }
            

        let schoolTrigger = /(university|u\.? |univ\.?|uni\.?| u\.?|college|state|institute|institution|college|state|institute|institution)/i

        for (record of someData) {
            for (author of record.authors) {
                school = author.affiliation

                if (school == null)
                    continue

                let count = 0

                let anyFound = false

                let loopFound = false
                for(let expression of schoolsByReg.keys()){
                    if(expression.test(school)){
                        schoolsByReg.get(expression).push(school)
                        loopFound = true
                        break
                    }
                }
                if(loopFound)
                    continue;


                unmatchedSchools.add(school)

                // for (re of regExpressions) {
                //     if (re.test(school) && school != null) {
                //         countMatches += 1
                //         count++
                //         regMatches[re].push(school)
                //     }
                // }

                // if (count > 0) {
                //     matchedSchools.add(school)
                // } else {
                //     unmatchedSchools.add(school)
                // }

                // schools[author.affiliation] = schools[author.affiliation] || 0;
                // schools[author.affiliation] ++
            }
        }


        console.log(schoolsByReg)
        console.log(unmatchedSchools)

        let lookupRegex = Array.from(schoolsByReg.keys())


        let cleanedUp = []

        let brokenClean = []
        

        console.log(lookupRegex[0])
        for(let match of schoolsByReg.get(lookupRegex[0])){
            let reg = lookupRegex[0]
            let foundOne = false
            let fixed = match.replace(reg, "").trim()
            cleanedUp.push(fixed)
        }

        for(let match of schoolsByReg.get(lookupRegex[1])){
            // console.log(match)
            let parts = match.split("/")
            for(let part of parts){
                cleanedUp.push(part.trim())
            }
        }

        for(let i = 0; i < cleanedUp.length; i++){
            let match = cleanedUp[i]
            if(lookupRegex[2].test(match)){
                let fixed = match.replace(lookupRegex[2], "University")
                cleanedUp[i] = fixed
            }
            
        }

        for(let match of schoolsByReg.get(lookupRegex[2])){
            let fixed = match.replace(lookupRegex[2], "University")
            cleanedUp.push(fixed)
            
        }

        for(let match of schoolsByReg.get(lookupRegex[3])){
            let fixed = match.replace(lookupRegex[3], "University of California ")
            cleanedUp.push(fixed)
            
        }


        for(let j = 4; j <= 5; j++){
            for(let match of schoolsByReg.get(lookupRegex[j])){
                cleanedUp.push(match)
            }
        }


        console.log(cleanedUp)
        // console.log(brokenClean)



        // console.log(regMatches)


        let stopwordsWithoutUni = ["of", "the", "department", "physics", "math", "astronomy", "astronomia", ".", ","]
        let stopwords = ["university", "of", "the", "univ", "univ.", "uni.", "uni", "department", "physics", "math", "astronomy", "astronomia", "universita", ".", ",",
            "graduate", "school", "science", "technology", "college", "at"]


        let schools = []

        for (let m of cleanedUp) {
            schools.push({
                school: m,
                wordset: computeWordsetWithStopwords(m, stopwords),
                wordsetWithUni: computeWordsetWithStopwords(m, stopwordsWithoutUni)
            })
        }



        // console.log(schools)


        d3.csv("universities-us-cleaned.csv", function (error, universitiesData) {
            let universities = []
            let candidatesForMatched = {}

            for (let u of universitiesData.filter(x => x.size > 5000)) {
                // console.log(u)
                let acronymSet = new Set()
                acronymSet.add(u.shorthand)
                acronymSet.add(u.school.split(" ").filter(x => ["of", "the", "at"].indexOf(x) < 0).map(x => x[0]).join("").toLowerCase())
                universities.push({
                    school: u.school,
                    wordset: computeWordsetWithStopwords(u.school, stopwords),
                    wordsetWithUni: computeWordsetWithStopwords(u.school, stopwordsWithoutUni),
                    acronyms: acronymSet,
                    size: u.size
                })
            }




            for (let school of schools) {
                candidatesForMatched[school.school] = []
                for (let university of universities) {
                    // if(school.school == "BYU" && university.school == "Brigham Young University"){
                    //     console.log(school)
                    //     console.log(university)
                    // }

                    let jaccards = [computeJaccard(school.wordset, university.wordset),
                    computeJaccard(school.wordsetWithUni, university.wordsetWithUni),
                    computeJaccard(school.wordset, university.acronyms)]

                    let fmeasure = 2.0 * (jaccards[0] * jaccards[1]) / (jaccards[0] + jaccards[1] + 0.0)

                    if(isNaN(fmeasure)){
                        fmeasure = 0.0
                    }

                    // if (computeJaccard(school.wordset, university.wordset) > 0 ||
                    //     computeJaccard(school.wordsetWithUni, university.wordsetWithUni) > 0 ||
                    //     computeJaccard(school.wordset, university.acronyms) > 0
                    // ) {
                    //     candidatesForMatched[school.school].push({ school: university.school, size: university.size, jaccards: jaccards, f: fmeasure })
                    // }

                    if (fmeasure > 0 || jaccards[2] > 0) {
                        candidatesForMatched[school.school].push({ school: university.school, size: university.size, jaccards: jaccards, f: fmeasure })
                    }
                }
                candidatesForMatched[school.school].sort((a, b) => {
                    let diff = 0
                    diff = b.f - a.f

                    if (diff == 0) {
                        let acroDiff = b.jaccards[2] - a.jaccards[2]
                        if (acroDiff == 0)
                            return b.size - a.size
                        return acroDiff
                    }
                    return diff
                })
            }

            // for(let matched of matchedSchools){
            //     candidatesForMatched[matched] = []
            //     for(let university of universities.map(x => x.school)){
            //         if(computeJaccardFromString(matched, university, stopwords) > 0){
            //             candidatesForMatched[matched].push(university)
            //         }
            //     }
            // }
            console.log(candidatesForMatched)


            for(let candidateKey of Object.keys(candidatesForMatched)){
                if(candidatesForMatched[candidateKey].length > 0 && (candidatesForMatched[candidateKey][0].f >= 1.0/3.0 || candidatesForMatched[candidateKey][0].jaccards[2] >= 0.5))
                    console.log(candidateKey + " --- " + candidatesForMatched[candidateKey][0].school + " : " + candidatesForMatched[candidateKey][0].f + " " + candidatesForMatched[candidateKey][0].jaccards[2])
            }

        })


        /*
        
                d3.csv("universities-us.csv", function(error, universitiesData) {
        
                    let universities = []
                    let candidatesForMatched = {}
        
                    for(let u of universitiesData){
                        let acronymSet = new Set()
                        acronymSet.add(u.shorthand)
                        acronymSet.add(u.school.split(" ").filter(x => ["of","the","at"].indexOf(x) < 0).map(x => x[0]).join("").toLowerCase())
                        universities.push({
                            school: u.school,
                            wordset: computeWordsetWithStopwords(u.school, stopwords),
                            wordsetWithUni: computeWordsetWithStopwords(u.school, stopwordsWithoutUni),
                            acronyms: acronymSet
                        })
                    }
        
                    console.log(universities)
        
                    for(let school of schools){
                        candidatesForMatched[school.school] = []
                        for(let university of universities){
                            // if(school.school == "BYU" && university.school == "Brigham Young University"){
                            //     console.log(school)
                            //     console.log(university)
                            // }
                            if(computeJaccard(school.wordset, university.wordset) > 0 || 
                                computeJaccard(school.wordsetWithUni, university.wordsetWithUni) > 0 ||
                                computeJaccard(school.wordset, university.acronyms) > 0
                            ){
                                candidatesForMatched[school.school].push(university.school)
                            }
                        }
                    }
        
                    // for(let matched of matchedSchools){
                    //     candidatesForMatched[matched] = []
                    //     for(let university of universities.map(x => x.school)){
                    //         if(computeJaccardFromString(matched, university, stopwords) > 0){
                    //             candidatesForMatched[matched].push(university)
                    //         }
                    //     }
                    // }
                    console.log(candidatesForMatched)
        
                })
        
        
        
        
        */



    })
})


