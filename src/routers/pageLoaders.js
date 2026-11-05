import { loadAttendance } from '../pages/attendance/data';
import { loadClasses } from '../pages/classes/data';
import { loadMessages } from '../pages/messages/data';
import { loadOverview } from '../pages/overview/data';
import { loadParents } from '../pages/parents/data';
import { loadSchedule } from '../pages/schedule/data';
import { loadStudents } from '../pages/students/data';
import { loadTeachers } from '../pages/teachers/data';
import { loadTuition } from '../pages/tuition/data';

export const pageLoaders = {
  overview: loadOverview,
  students: loadStudents,
  teachers: loadTeachers,
  parents: loadParents,
  classes: loadClasses,
  schedule: loadSchedule,
  attendance: loadAttendance,
  tuition: loadTuition,
  messages: loadMessages,
};
