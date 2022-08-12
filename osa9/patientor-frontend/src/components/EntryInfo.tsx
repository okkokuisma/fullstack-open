import { Entry } from "../types";
import { useStateValue } from "../state";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const entryType = (type: string): string => {
  switch (type) {
    case "HealthCheck":
      return "Health Check";
    case "OccupationalHealthcare":
      return "Occupational Healthcare";
    default:
      return "Hospital";
  }
};

const EntryBase = ({ entry }: { entry: Entry }) => {
  const [{ diagnoses },] = useStateValue();
  return (
    <div key={entry.id}>
      <p>{entry.date} {entryType(entry.type)}</p>
      <p>description: {entry.description}</p>
      {entry.diagnosisCodes && diagnoses
      ?
      <div>
        <h4>diagnoses</h4>
        <ul>
          {entry.diagnosisCodes.map(dc => (
          <li key={dc}>{dc} {diagnoses[dc]?.name}</li>
          ))}
        </ul>
      </div>
      : null
      }
    </div>
  );
};

const EntryInfo = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div style={{border: "2pt solid", marginTop: 10}}>
          <EntryBase entry={entry} />
          <p>discharge: {entry.discharge.date} {entry.discharge.criteria}</p>
        </div>
      );
    case "HealthCheck":
      return (
        <div style={{border: "2pt solid", marginTop: 10}}>
          <EntryBase entry={entry} />
          <p>health rating: {entry.healthCheckRating}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{border: "2pt solid", marginTop: 10}}>
          <EntryBase entry={entry} />
          <p>employer: {entry.employerName}</p>
          {entry.sickLeave
            ? <p>sick leave: from {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate} </p>
            : null
          }
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryInfo;