import config from '../config/config';
import { notNull } from './utils';

export const rchilliExtractor = (data) => {
  const extractedData = {};

  if (data.ResumeParserData) {
    const resumeData = data.ResumeParserData;

    extractedData['resumeData'] = data;

    extractedData['resumeFileName'] = resumeData['ResumeFileName'];
    extractedData['firstName'] = resumeData['Name']['FirstName'] + ' ' + resumeData['Name']['MiddleName'];
    extractedData['lastName'] = resumeData['Name']['LastName'];
    extractedData['middleName'] = resumeData['Name']['MiddleName'];
    extractedData['email'] = notNull(resumeData['Email'][0]['EmailAddress']) ? resumeData['Email'][0]['EmailAddress'] : null;
    extractedData['city'] = resumeData['Address'][0]['City'];
    extractedData['Address'] = resumeData['Address'][0];
    extractedData['designation'] = resumeData['SubCategory'];
    extractedData['summary'] = resumeData['Summary'];
    extractedData['phone'] = extractedPhoneNumber(resumeData['PhoneNumber']);
    extractedData['overallWorkExperience'] = extractOverallWorkExperience(resumeData['WorkedPeriod']['TotalExperienceInYear']);

    extractedData['skillArray'] = resumeData['SkillKeywords'].split(',');
    console.log('SKILLS', extractedData['skillArray']);

    extractedData['workHistory'] = extractWorkHistory(resumeData['SegregatedExperience']);

    extractedData['projects'] = extractProjects(resumeData['SegregatedExperience']);

    extractedData['education'] = extractEducation(resumeData['SegregatedQualification']);

    extractedData['certifications'] = extractCertification(resumeData['SegregatedCertification']);

    extractedData['publications'] = extractPublication(resumeData['SegregatedPublication']);

    extractedData['socialProfile'] = extractSocialProfile(resumeData['WebSite']);
    extractedData['languages'] = extractLanguages(resumeData['LanguageKnown']);

    extractedData['citizenship'] = extractCitizenship(extractedData['Address']);

    extractedData['detailResume'] = extractDetailResume(resumeData['DetailResume']);

    extractedData['htmlResume'] = resumeData['HtmlResume'];

    extractedData['bagOfWords'] = extractBagOfWords(resumeData['DetailResume']);

    // console.log("extractedData[citizenship] : ",extractedData["citizenship"]);
  }
  // console.log("extracatedData : ",extractedData);

  return extractedData;
};

const extractedPhoneNumber = (data) => {
  if (Array.isArray(data) && data.length) {
    return data[0]['FormattedNumber'].replace(/[^0-9]/g, '');
  } else return null;
};
const extractOverallWorkExperience = (data) => {
  if (![null, undefined, ''].includes(data) && !isNaN(data)) {
    return data;
  }

  return null;
};

const extractCitizenship = (data) => {
  if (![null, undefined, ''].includes(data)) {
    const iso3 = data['CountryCode']['IsoAlpha3'];
    const citizenshipId = config.countries.filter((element) => element.iso3 == iso3)[0];
    return citizenshipId ? citizenshipId.id : null;
  }
  return null;
};

const extractWorkHistory = (data) => {
  const experience = [];
  data.map((details) => {
    experience.push({
      companyName: details['Employer']['EmployerName'],
      positionName: details['JobProfile']['Title'],
      description: details['JobDescription'],
      startDate: dateToMillisec(details['StartDate']),
      endDate: dateToMillisec(details['EndDate']),
      stillWorking: details['IsCurrentEmployer'] === 'true',
    });
  });

  return experience;
};

const extractProjects = (data) => {
  const projects = [];
  data.map((details) => {
    const clientName = details['Employer']['EmployerName'];
    const projectRole = details['JobProfile']['Title'];
    const projectDescription = details['JobDescription'];

    details['Projects'].map((projectDetails) => {
      projects.push({
        projectName: projectDetails['ProjectName'],
        clientName,
        projectRole,
        projectDescription,
        skills: projectDetails['UsedSkills'].split(',').map((item) => item.trim()),
      });
    });
  });

  return projects;
};

const extractEducation = (data) => {
  const education = [];
  data.map((details) => {
    education.push({
      college: details['Institution']['Name'],
      degree: details['Degree']['DegreeName'],
      startDate: dateToMillisec(details['StartDate']),
      endDate: dateToMillisec(details['EndDate']),
    });
  });
  console.log('EDUCATION', education);
  return education;
};

const extractCertification = (data) => {
  const certifications = [];

  data.map((details) => {
    console.log('data : ', details);

    if (!['', undefined, null].includes(details['CertificationTitle'])) {
      console.log('date : ', dateToMillisec(details['EndDate']));
      certifications.push({
        certificationId: details['CertificationTitle'],
        certifiedYear: dateToMillisec(details['EndDate']),
      });
    }
  });

  return certifications;
};

const extractPublication = (data) => {
  const publications = [];
  data.map((details) => {
    if (!['', undefined, null].includes(details['PublicationTitle'])) {
      publications.push({
        title: details['PublicationTitle'],
        link: details['PublicationUrl'],
      });
    }
  });

  return publications;
};

const extractSocialProfile = (data) => {
  const socialProfile = [];
  data.map((details) => {
    if (!['', undefined, null].includes(details['Type'])) {
      socialProfile.push({
        title: details['Type'],
        link: details['Url'],
      });
    }
  });

  return socialProfile;
};

const extractLanguages = (data) => {
  const languages = [];
  console.log(data);
  data.map((details) => {
    if (!['', undefined, null].includes(details['Language'])) {
      console.log(details['Language']);
      languages.push(details['Language']);
    } else {
      languages.push('English');
    }
    if (!languages.includes('English')) {
      languages.push('English');
    }
  });

  return languages;
};

const extractDetailResume = (data) => {
  const resumeList = {};
  const splitByLine = data.replace(/[\t]/g, '').split('\n');
  splitByLine.forEach((element) => {
    resumeList[splitByLine.indexOf(element)] = element.trim(' ');
  });
  return JSON.stringify(resumeList);
};

const extractBagOfWords = (data) => {
  let bow = [];
  const replaceRegex = /[^a-zA-Z\n@. ]/g;
  const splitRegex = /[\s\n]+/;
  const filterRegex = /^[^a-zA-Z0-9]+$/;
  data = data.replace(replaceRegex, '');
  bow = data.split(splitRegex);
  const uniqueChars = [...Array.from(new Set(bow.sort()))];
  const filterUniqueChars = uniqueChars.filter((ele: string) => !filterRegex.test(ele));

  return filterUniqueChars;
};

const dateToMillisec = (dateString) => {
  try {
    if (!['', undefined, null].includes(dateString)) {
      const [day, month, year] = dateString.split('/');
      return new Date(year, month - 1, day).getTime();
    }
  } catch (error) {
    console.log('date parse error : ', error.message);
    return null;
  }
};
