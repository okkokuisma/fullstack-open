interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface DescriptiveCoursePart extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends DescriptiveCoursePart {
  type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends DescriptiveCoursePart {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseRequirementsPart extends DescriptiveCoursePart {
  type: "special";
  requirements: string[];
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseRequirementsPart;