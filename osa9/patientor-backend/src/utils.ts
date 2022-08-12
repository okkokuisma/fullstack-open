import { NewPatientEntry, Gender, NewEntry, HealthCheckRating } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (content: unknown, fieldKey: string): string => {
  if (!content || !isString(content)) {
    throw new Error(`Incorrect or missing ${fieldKey}`);
  }
  return content;
};

const parseDiagnosisCodes = (codes: unknown): string[] => {
  if (!Array.isArray(codes)) {
    throw new Error('Incorrect type of diagnosis codes: expected an array of values');
  }
  codes.forEach(c => {
    if (!isString(c)) {
      throw new Error('Incorrect or missing diagnosis code: ' + c);
    }
  });

  return codes as string[];
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
  return rating;
};

type PatientFields = {
  dateOfBirth : unknown,
  name: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown
};

export const newPatientEntry = ({ dateOfBirth, name, ssn, gender, occupation }: PatientFields): NewPatientEntry => {
  const newEntry = {
      name: parseString(name, "name"),
      dateOfBirth: parseDate(dateOfBirth),
      ssn: parseString(ssn, "ssn"),
      gender: parseGender(gender),
      occupation: parseString(occupation, "occupation")
    }
  ;
  return newEntry;
};

interface BaseEntryFields {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
}

interface HealthCheckEntryFields extends BaseEntryFields {
  type: "HealthCheck";
  healthCheckRating: unknown;
}

interface HospitalEntryFields extends BaseEntryFields {
  type: "Hospital";
  discharge: {
    date: unknown;
    criteria: unknown;
  }
}

interface OccupationalHealthcareEntryFields extends BaseEntryFields {
  type: "OccupationalHealthcare";
  employerName: unknown;
  sickLeave?: {
    startDate: unknown;
    endDate: unknown;
  }
}

export const newEntriesEntry = (entry: HealthCheckEntryFields | HospitalEntryFields | OccupationalHealthcareEntryFields ): NewEntry => {
  const baseEntry = {
    description: parseString(entry.description, "description"),
    date: parseDate(entry.date),
    specialist: parseString(entry.specialist, "specialist"),
    diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes)
  };

  switch (entry.type) {
    case "Hospital":
      return {
        ...baseEntry,
        type: entry.type,
        discharge: {
          date: parseDate(entry.discharge.date),
          criteria: parseString(entry.discharge.criteria, "discharge criteria")
        }
      };
    case "HealthCheck":
      return {
        ...baseEntry,
        type: entry.type,
        healthCheckRating: parseHealthRating(entry.healthCheckRating)
      };
    case "OccupationalHealthcare":
      const requiredFields = {
        ...baseEntry,
        type: entry.type,
        employerName: parseString(entry.employerName, "employer name"),
      };
      if (!entry.sickLeave?.startDate || !entry.sickLeave?.endDate) {
        return requiredFields;
      } else {
        return {
          ...requiredFields,
          sickLeave: {
            startDate: parseDate(entry.sickLeave?.startDate),
            endDate: parseDate(entry.sickLeave?.endDate)
          }
        };
      }
    default:
      throw new Error('Incorrect type of entry');
  }
};