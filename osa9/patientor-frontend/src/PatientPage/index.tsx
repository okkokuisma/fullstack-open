import { useEffect, useState } from "react";
import axios from "axios";
import { useStateValue, cachePatientData } from "../state";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { EntryType, Patient, NewEntry } from "../types";
import Entry from "../components/EntryInfo";
import AddEntryForm from "./AddEntryForm";
import { Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export type EntryTypeOption = {
  value: EntryType;
  label: string;
};

const PatientPage = () => {
  const [{ patientCache }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const [ entryType, setEntryType ] = useState<EntryType | "">("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      if (!patientCache[id]) {
        console.log("hellu");
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(cachePatientData(patient));
      }
    };

    if (id) {
      fetchPatient(id)
        .catch(e => console.log(e));
    }
  }, [dispatch]);

  const entryTypeOptions: EntryTypeOption[] = [
    { value: "Hospital", label: "Hospital" },
    { value: "HealthCheck", label: "Health Check" },
    { value: "OccupationalHealthcare", label: "Occupational Healthcare" }
  ];

  const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setEntryType(event.target.value as EntryType);
  };

  const submitNewEntry = async (values: NewEntry) => {
    console.log(values);
    try {
      if (id) {
        const { data: patient } = await axios.post<Patient>(
          `${apiBaseUrl}/patients/${id}/entries`,
          values
        );
        dispatch(cachePatientData(patient));
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  if (!id || !patientCache[id]) {
    return null;
  }

  return (
    <div>
      {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
      <div key={patientCache[id].id}>
        <h2>{patientCache[id].name}</h2>
        <p>{patientCache[id].occupation}</p>
        <p>{patientCache[id].gender}</p>
        <p>{patientCache[id].ssn}</p>
        <h3>entries</h3>
        {patientCache[id].entries.map(e => (
          <Entry entry={e} key={e.id} />
        ))}
      </div>
      <h2>add entries</h2>
      <FormControl fullWidth>
        <InputLabel>Entry type</InputLabel>
        <Select
          value={""}
          label="Entry type"
          onChange={handleChange}
        >
          {entryTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <AddEntryForm onSubmit={submitNewEntry} entryType={entryType} />
    </div>
  );
};

export default PatientPage;