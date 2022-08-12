import { Router } from 'express';
import patientService from '../services/patientService';
import { newPatientEntry, newEntriesEntry } from '../utils';

const patientRouter = Router();

patientRouter.get('/', (_req, res) => {
  res.send(patientService.getAll());
});

patientRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const patient = patientService.getOne(id);
  if (patient) {
    res.status(200).send(patient);
  } else {
    res.status(400).send({error: 'invalid id'});
  }
});

patientRouter.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = newPatientEntry(req.body);
    const addedPatient = patientService.create(newEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

patientRouter.post('/:id/entries', (req, res) => {
  const patientId = req.params.id;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = newEntriesEntry(req.body);
    const editedPatient = patientService.createEntry(patientId, newEntry);
    res.json(editedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default patientRouter;