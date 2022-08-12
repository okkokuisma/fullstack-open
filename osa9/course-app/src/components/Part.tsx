import { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.type) {
    case "normal":
      return (
        <div>
          <br />
          <b key={coursePart.name}>
            {coursePart.name} {coursePart.exerciseCount}
          </b><br />
          {coursePart.description}
        </div>
      );
    case "groupProject":
      return (
        <div>
          <br />
          <b key={coursePart.name}>
            {coursePart.name} {coursePart.exerciseCount}
          </b><br />
          project exercises {coursePart.groupProjectCount}
        </div>
      );
    case "submission":
      return (
        <div>
          <br />
          <b key={coursePart.name}>
            {coursePart.name} {coursePart.exerciseCount}
          </b><br />
          {coursePart.description} <br />
          submit to {coursePart.exerciseSubmissionLink}
        </div>
      );
    case "special":
      return (
        <div>
          <br />
          <b key={coursePart.name}>
            {coursePart.name} {coursePart.exerciseCount}
          </b><br />
          {coursePart.description} <br />
          required skills: {coursePart.requirements.join(", ")}
        </div>
      );
    default:
      return assertNever(coursePart);
  }
};

export default Part;