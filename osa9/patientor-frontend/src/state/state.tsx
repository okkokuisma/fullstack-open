import React, { createContext, useContext, useReducer } from "react";
import { Patient, Diagnosis } from "../types";

import { Action } from "./reducer";

export const setPatientList = (patients: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patients };
};

export const setDiagnosisList = (diagnoses: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: diagnoses };
};

export const cachePatientData = (patient: Patient): Action => {
  return { type: "CACHE_PATIENT_DATA", payload: patient };
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient };
};

export type State = {
  patients: { [id: string]: Patient };
  patientCache: { [id: string]: Patient };
  diagnoses: { [id: string]: Diagnosis };
};

const initialState: State = {
  patients: {},
  patientCache: {},
  diagnoses: {}
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
