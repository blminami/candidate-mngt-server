const pdfreader = require('pdfreader');
const Rule = pdfreader.Rule;
const candidate = {};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const doNothing = (value) => {};

const getEmail = (value) => {
  if (value && value.length) {
    candidate.email = value[0];
  }
};

const getSkills = (value) => {
  candidate.skills = value;
};

const getCertifications = (value) => {
  candidate.certifications = value.join(' ');
};

const getResume = (value) => {
  candidate.about = value.join(' ');
};

const getExperience = (value) => {
  const years = value.join(' ').match(/\d{4}/g).filter(onlyUnique).sort();
  let yearsOfExperience = 0;
  if (years && years.length > 0) {
    yearsOfExperience = new Date().getFullYear() - years[0];
  }
  candidate.experience = value.join(' ');
  candidate.yearsOfExperience = yearsOfExperience;
};

const getEducation = (value) => {
  candidate.education = value.join(' ');
};

const processItem = Rule.makeItemProcessor([
  Rule.on(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .extractRegexpValues()
    .then(getEmail),
  Rule.on(/^(Contact|Personal Info)/)
    .accumulateAfterHeading()
    .then(doNothing),
  Rule.on(/^Languages/)
    .accumulateAfterHeading()
    .then(doNothing),
  Rule.on(/^(Aptitudini|Skills|IT knowledge)/)
    .accumulateAfterHeading()
    .then(getSkills),
  Rule.on(/^(Certifications|Certificates)/)
    .accumulateAfterHeading()
    .then(getCertifications),
  Rule.on(/^(Rezumat|Summary)/)
    .accumulateAfterHeading()
    .then(getResume),
  Rule.on(/^Experiență|PROFESSIONAL EXPERIENCE|EXPERIENCE/)
    .accumulateAfterHeading()
    .then(getExperience),
  Rule.on(/^(Studii|Education|STUDIES)/)
    .accumulateAfterHeading()
    .then(getEducation)
]);

const parseFile = async (filename) => {
  return new Promise((resolve, reject) => {
    new pdfreader.PdfReader().parseFileItems(
      `profiles/${filename}`,
      function (err, item) {
        if (err) {
          reject(err);
        }
        processItem(item);
        if (!item) {
          resolve(candidate);
        }
      }
    );
  });
};

export { parseFile };
