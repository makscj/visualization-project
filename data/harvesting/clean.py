import re


def clean(entry):
    '''
     schoolsByReg.set(/^(Department|Dept|Dep|Graduate School)\.? of( \w+)+,/i, []) //0
        schoolsByReg.set(/.+\s?\/\s?.+/, [])
        schoolsByReg.set(/(\buniversity\b|\bu\.?(\s|$)|\buniv\.?\b|\buni\.?\b)/i, []) //2
        schoolsByReg.set(/\bU\.?C\.?\b/i, [])
        schoolsByReg.set(/(college|state|institute|institution)/i, []) //4
        schoolsByReg.set(/^\w+$/, [])
        '''

    deptRegex = re.compile("^(Department|Dept|Dep|Graduate School)\.? of( \w+)+,", re.IGNORECASE)
    slashSplitRegex = re.compile(".+\s?\/\s?.+")
    universityRegex = re.compile("(\buniversity\b|\bu\.?(\s|$)|\buniv\.?\b|\buni\.?\b)", re.IGNORECASE)
    ucRegex = re.compile("\bU\.?C\.?\b", re.IGNORECASE)
    collegeRegex = re.compile("(college|state|institute|institution)", re.IGNORECASE)
    singleWordRegex = re.compile("^\w+$")