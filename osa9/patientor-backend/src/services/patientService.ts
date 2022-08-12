import patients from "../../data/patients";
import { SsnOmittedPatient, NewPatientEntry, Patient, NewEntry } from "../types";
import { v1 as uuid } from 'uuid';

const getAll = (): SsnOmittedPatient[] => {
  return patients.map(({ name, dateOfBirth, id, gender, occupation, entries }) => {
    return {
      name,
      dateOfBirth,
      id,
      gender,
      occupation,
      entries
    };
  });
};

const create = (newEntry: NewPatientEntry): Patient => {
  const addedPatient: Patient = { ...newEntry, id: uuid(), entries: [] };
  patients.push(addedPatient);
  return addedPatient;
};

const getOne = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

const createEntry = (patientId: string, newEntry: NewEntry): Patient => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error("invalid patient id");
  patient?.entries.push({...newEntry, id: uuid()});
  return patient;
};

export default { getAll, create, getOne, createEntry };