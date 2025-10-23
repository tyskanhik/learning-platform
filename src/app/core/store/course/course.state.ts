import { CourseModel } from "../../models/course.model";

export interface CourseState {
  courses: CourseModel[];
}

export const initialCourseState: CourseState = {
  courses: []
};