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




computeJaccard = function (set1, set2) {
    let intersect = set1.intersection(set2)
    let union = set1.union(set2)

    divide = (a, b) => (0.0 + a.size) / (b.size)

    return divide(intersect, union)
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
            .replace(/(st\b\.?)/i, "saint")
        )
    )
}


d3.json("data.json", function (error, someData) {
    d3.json("data-all.json", function (error, allData) {
        

        let schoolsByReg = new Map()
        schoolsByReg.set(/^(Department|Dept|Dep|Graduate School)\.? of( \w+)+,/i, []) //0
        schoolsByReg.set(/.+\s?\/\s?.+/, [])
        schoolsByReg.set(/(\buniversity\b|\bu\.?(\s|$)|\buniv\.?\b|\buni\.?\b)/i, []) //2
        schoolsByReg.set(/\bU\.?C\.?\b/i, [])
        schoolsByReg.set(/(college|state|institute|institution)/i, []) //4
        schoolsByReg.set(/^\w+$/, [])


        let schoolTrigger = /(university|u\.? |univ\.?|uni\.?| u\.?|college|state|institute|institution|college|state|institute|institution)/i

        for (record of someData) {
            for (author of record.authors) {
                school = author.affiliation

                if (school == null)
                    continue



                for(let expression of schoolsByReg.keys()){
                    if(expression.test(school)){
                        schoolsByReg.get(expression).push(school)
                        break
                    }
                }

            }
        }



        let lookupRegex = Array.from(schoolsByReg.keys())


        let cleanedUp = []

        
        //Remove departments
        for(let match of schoolsByReg.get(lookupRegex[0])){
            let reg = lookupRegex[0]
            let foundOne = false
            let fixed = match.replace(reg, "").trim()
            cleanedUp.push(fixed)
        }

        //Split on /
        for(let match of schoolsByReg.get(lookupRegex[1])){
            let parts = match.split("/")
            for(let part of parts){
                cleanedUp.push(part.trim())
            }
        }

        //Replace all university
        for(let i = 0; i < cleanedUp.length; i++){
            let match = cleanedUp[i]
            if(lookupRegex[2].test(match)){
                let fixed = match.replace(lookupRegex[2], "University")
                cleanedUp[i] = fixed
            }
            
        }

        //Replace all university
        for(let match of schoolsByReg.get(lookupRegex[2])){
            let fixed = match.replace(lookupRegex[2], "University")
            cleanedUp.push(fixed)
            
        }

        //Replace UC with University of California
        for(let match of schoolsByReg.get(lookupRegex[3])){
            let fixed = match.replace(lookupRegex[3], "University of California ")
            cleanedUp.push(fixed)
            
        }


        //Add the last two (college-terms, and single words)
        for(let j = 4; j <= 5; j++){
            for(let match of schoolsByReg.get(lookupRegex[j])){
                cleanedUp.push(match)
            }
        }


        console.log(cleanedUp)

        //--------------------------------------------------------------------------------------------------------------

        let stopwordsWithoutUni = ["of", "the", "department", "physics", "math", "astronomy", ".", ","]
        let stopwords = ["university", "of", "the", "univ", "univ.", "uni.", "uni", "department", "physics", "math", "astronomy", ".", ",",
            "graduate", "school", "science", "technology", "college", "at"]


        let schools = []


        //Compute all word sets based on stopwords
        for (let m of cleanedUp) {
            schools.push({
                school: m,
                wordset: computeWordsetWithStopwords(m, stopwords),
                wordsetWithUni: computeWordsetWithStopwords(m, stopwordsWithoutUni)
            })
        }





        d3.csv("universities-us-cleaned.csv", function (error, universitiesData) {
            let universities = []
            

            //Compute all wordsets for universities, and include university size
            for (let u of universitiesData.filter(x => x.size > 5000)) {
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

            let candidatesForMatched = {}


            for (let school of schools) {
                candidatesForMatched[school.school] = []
                for (let university of universities) {
                    let jaccards = [computeJaccard(school.wordset, university.wordset),
                    computeJaccard(school.wordsetWithUni, university.wordsetWithUni),
                    computeJaccard(school.wordset, university.acronyms)]

                    let fmeasure = 2.0 * (jaccards[0] * jaccards[1]) / (jaccards[0] + jaccards[1] + 0.0)

                    //If fmeasure is 0/0, set it to 0
                    if(isNaN(fmeasure)){
                        fmeasure = 0.0
                    }
                    if (fmeasure > 0 || jaccards[2] > 0) {
                        candidatesForMatched[school.school].push({ school: university.school, size: university.size, jaccards: jaccards, f: fmeasure })
                    }
                }
                //Sort the candidates
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

           
            console.log(candidatesForMatched)

            let frequencies = new Map()

            for(let candidateKey of Object.keys(candidatesForMatched)){
                if(candidatesForMatched[candidateKey].length > 0 && (candidatesForMatched[candidateKey][0].f >= 1.0/3.0 || candidatesForMatched[candidateKey][0].jaccards[2] >= 0.5)){
                    let u = candidatesForMatched[candidateKey][0].school
                    if(frequencies.has(u)){
                        let p = frequencies.get(u)
                        frequencies.set(u, p+1)
                    } else {
                        frequencies.set(u, 1)
                    }
                }
            }
            console.log(frequencies)

        })

    })
})


