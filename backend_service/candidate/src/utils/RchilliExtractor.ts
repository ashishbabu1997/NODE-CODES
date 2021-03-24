import config from '../config/config';

export const rchilliExtractor = (data) =>{
    let extractedData = {};
    
    if(data.ResumeParserData)
    {
        let resumeData = data.ResumeParserData;
        
        extractedData["resumeData"] = data;
        
        extractedData["resumeFileName"] = resumeData["ResumeFileName"];
        extractedData["firstName"] = resumeData["Name"]["FirstName"];
        extractedData["lastName"] = resumeData["Name"]["LastName"];
        extractedData["email"] = resumeData["Email"][0]["EmailAddress"];
        extractedData["city"] = resumeData["Address"][0]["City"];
        extractedData["Address"] = resumeData["Address"][0];
        extractedData["designation"] = resumeData["SubCategory"];
        extractedData["summary"] = resumeData["Summary"];
        extractedData["phone"] = extractedPhoneNumber(resumeData["PhoneNumber"]);
        
        
        extractedData["overallWorkExperience"] = extractOverallWorkExperience(resumeData["WorkedPeriod"]["TotalExperienceInYear"]);
        
        extractedData["skillArray"] = resumeData["SkillKeywords"].split(",");
        
        extractedData["workHistory"] = extractWorkHistory(resumeData["SegregatedExperience"]);
        
        extractedData["projects"] = extractProjects(resumeData["SegregatedExperience"]);
        
        extractedData["education"] = extractEducation(resumeData["SegregatedQualification"]);
        
        extractedData["certifications"] = extractCertification(resumeData["SegregatedCertification"]);
        
        extractedData["publications"] = extractPublication(resumeData["SegregatedPublication"]);
        
        extractedData["socialProfile"] = extractSocialProfile(resumeData["WebSite"]);
        
        extractedData["languages"] = extractLanguages(resumeData["LanguageKnown"]);
        
        extractedData["citizenship"] = extractCitizenship(extractedData["Address"]);
        
        // console.log("extractedData[citizenship] : ",extractedData["citizenship"]);
    }
    // console.log("extracatedData : ",extractedData);
    
    return extractedData;
}

const extractedPhoneNumber = (data) =>{
    if(Array.isArray(data) && data.length)
    return data[0]["FormattedNumber"].replace(/[^0-9]/g,'');
    else return null;
    
}
const extractOverallWorkExperience = (data) =>{
    if(![null,undefined,''].includes(data) && !isNaN(data))
    return data;

    return null;

}



const extractCitizenship = (data) => {    
    if(![null,undefined,''].includes(data))
    {
        let iso3 = data["CountryCode"]["IsoAlpha3"];        
        let citizenshipId = config.countries.filter(element=>element.iso3 == iso3)[0];
        return citizenshipId?citizenshipId.id:null;
    }
    return null;
}

const extractWorkHistory = (data) =>{
    let experience = [];
    data.map((details)=>{
        experience.push({
            companyName:details["Employer"]["EmployerName"],
            positionName : details["JobProfile"]["Title"],
            description : details["JobDescription"],
            startDate : dateToMillisec(details["StartDate"]),
            endDate : dateToMillisec(details["EndDate"]),
            stillWorking : details["IsCurrentEmployer"] === "true"
        })
    })
    
    return experience;
}


const extractProjects = (data) =>{
    let projects = [];
    data.map((details)=>{
        let clientName = details["Employer"]["EmployerName"],
        projectRole = details["JobProfile"]["Title"],
        projectDescription = details["JobDescription"];
        
        details["Projects"].map((projectDetails)=>{
            projects.push({
                projectName : projectDetails["ProjectName"],
                clientName,
                projectRole,
                projectDescription,
                skills : projectDetails["UsedSkills"].split(",").map(item=>item.trim()),
            })
        })
    })
    
    return projects;
}

const extractEducation = (data) =>{
    let education = [];
    data.map((details)=>{
        education.push({
            college:details["Institution"]["Name"],
            degree:details["Degree"]["DegreeName"],
            startDate:dateToMillisec(details["StartDate"]),
            endDate:dateToMillisec(details["EndDate"])
        })
    })
    
    return education;
}


const extractCertification = (data) =>{
    let certifications = [];
    
    data.map((details)=>{
        console.log("data : ",details);
        
        if(!['',undefined,null].includes(details["CertificationTitle"]))
        {
            console.log("date : ",dateToMillisec(details["EndDate"]));
            certifications.push({
                certificationId: details["CertificationTitle"],
                certifiedYear : dateToMillisec(details["EndDate"]),
            })
        }
        
    })
    
    return certifications;
}

const extractPublication = (data) =>{
    let publications = [];
    data.map((details)=>{
        if(!['',undefined,null].includes(details["PublicationTitle"]))
        publications.push({
            title: details["PublicationTitle"],
            link : details["PublicationUrl"]
        })
    })
    
    return publications;
}

const extractSocialProfile = (data) =>{
    let socialProfile = [];
    data.map((details)=>{
        if(!['',undefined,null].includes(details["Type"]))
        socialProfile.push({
            title:details["Type"],
            link : details["Url"]
        })
    })
    
    return socialProfile;
}

const extractLanguages = (data) =>{
    let languages = [];
    data.map((details)=>{
        if(!['',undefined,null].includes(details["Language"]))
        languages.push(details["Language"])
    })
    
    return languages;
}

const dateToMillisec = (dateString) =>{
    try {
        if(!['',undefined,null].includes(dateString))
        {
            const [day, month, year] = dateString.split("/");
            return new Date(year, month - 1, day).getTime();
        }
    } catch (error) {
        console.log("date parse error : ",error.message);
        return null;
    }
    
}
