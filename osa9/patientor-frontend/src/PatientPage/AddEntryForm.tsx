import { useStateValue } from "../state";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { Field, Formik, Form } from "formik";
import { NewEntry, HealthCheckRating, EntryType } from "../types";
import { TextField, SelectField, HealthCheckRatingOption } from "../AddPatientModal/FormField";
import { Grid, Button } from "@material-ui/core";

interface Props {
  onSubmit: (values: NewEntry) => void;
  entryType: EntryType | "";
}

const AddEntryForm = ({ onSubmit, entryType }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const requiredError = "Field is required";

  if (entryType === "") {
    return null;
  }

  const healthCheckRatingOptions: HealthCheckRatingOption[] = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "LowRisk" },
    { value: HealthCheckRating.HighRisk, label: "HighRisk" },
    { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" },
  ];

  const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateBaseValues = (values: {[field: string]: any}, errors: {[field: string]: any}) => {
    if (!values.description) {
      errors.description = requiredError;
    }
    if (!values.date) {
      errors.date = requiredError;
    }
    if (!isDate(values.date as string)) {
      errors.date = "Invalid date format";
    }
    if (!values.specialist) {
      errors.specialist = requiredError;
    }
  };

  const baseValues = {
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
  };

  let initialValues: NewEntry = {
    ...baseValues,
    type: "Hospital",
    discharge: {
      date: "",
      criteria: ""
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let validateValues = (values: {[field: string]: any}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: { [field: string]: any } = {discharge: {}};
    validateBaseValues(values, errors);
    let validDischarge = true;
    if (!values.discharge.date) {
      errors.discharge.date = requiredError;
      validDischarge = false;
    }
    if (!isDate(values.discharge.date as string)) {
      errors.discharge.date = "Invalid date format";
      validDischarge = false;
    }
    if (!values.discharge.criteria) {
      errors.discharge.criteria = requiredError;
      validDischarge = false;
    }
    if (validDischarge) {
      delete errors.discharge;
    }
    console.log(errors);
    return errors;
  };

  switch (entryType) {
    case "HealthCheck":
    initialValues = {
      ...baseValues,
      type: "HealthCheck",
      healthCheckRating: 0
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateValues = (values: {[field: string]: any}) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: { [field: string]: any } = {};
      validateBaseValues(values, errors);
      if (!values.healthCheckRating) {
        errors.healthCheckRating = requiredError;
      }
      return errors;
    };
    break;

    case "OccupationalHealthcare":
    initialValues = {
      ...baseValues,
      type: "OccupationalHealthcare",
      employerName: "",
      sickLeave: {
        startDate: "",
        endDate: ""
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateValues = (values: {[field: string]: any}) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: { [field: string]: any } = {sickLeave: {}};
      validateBaseValues(values, errors);
      if (!values.employerName) {
        errors.employerName = requiredError;
      }
      if (values.sickLeave.startDate || values.sickLeave.endDate) {
        if (!isDate(values.sickLeave.startDate as string) || !isDate(values.sickLeave.endDate as string)) {
          errors.sickLeave.startDate = "Invalid date format";
          errors.sickLeave.endDate = "Invalid date format";
        } else {
          delete errors.sickLeave;
        }
      } else {
        delete errors.sickLeave;
      }
      return errors;
    };
  }

  return (
    <Formik
    initialValues={initialValues}
    enableReinitialize
    onSubmit={onSubmit}
    validate={validateValues}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {entryType === "Hospital"
            ?
            <div>
              <Field
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
              />
              <Field
                label="Discharge criteria"
                placeholder="Discharge criteria"
                name="discharge.criteria"
                component={TextField}
              />
            </div>
            : null
            }
            {entryType === "HealthCheck"
            ?
            <div>
              <SelectField
                label="Health check rating"
                name="healthCheckRating"
                options={healthCheckRatingOptions}
              />
            </div>
            : null
            }
            {entryType === "OccupationalHealthcare"
            ?
            <div>
              <Field
              label="Employer"
              placeholder="Employer"
              name="employerName"
              component={TextField}
              />
              <Field
              label="Starting date of sick leave"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
              />
              <Field
                label="End date of sick leave"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
              />
            </div>
            : null
            }
            <Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;