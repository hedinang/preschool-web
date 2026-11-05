import { apiRequest } from '../api';
import {
  ATTENDANCE,
  CLASSROOM,
  DASHBOARD,
  LIST_DEFAULTS,
  MESSAGE,
  PARENT,
  SCHEDULE,
  STUDENT,
  TEACHER,
  TUITION,
  USER,
} from './apiConstant';

function listBody(params = {}) {
  return {
    sequence: params.sequence ?? LIST_DEFAULTS.sequence,
    limit: params.limit ?? LIST_DEFAULTS.limit,
    direction: params.direction ?? LIST_DEFAULTS.direction,
    ...params,
  };
}

export const getStudents = (token, params) =>
  apiRequest(`${STUDENT}/list`, { token, method: 'POST', body: listBody(params) });

export const createStudent = (token, student) =>
  apiRequest(STUDENT, { token, method: 'POST', body: student });

export const updateStudent = (token, id, student) =>
  apiRequest(`${STUDENT}/${encodeURIComponent(id)}`, { token, method: 'PUT', body: student });

export const deleteStudent = (token, id) =>
  apiRequest(`${STUDENT}/${encodeURIComponent(id)}`, { token, method: 'DELETE' });

export const getAttendance = (token, date, params) => {
  return apiRequest(`${ATTENDANCE}/list`, {
    token,
    method: 'POST',
    body: listBody({ ...params, date }),
  });
};

export const getParents = (token, params) =>
  apiRequest(`${PARENT}/list`, { token, method: 'POST', body: listBody(params) });

export const getTeachers = (token, params) =>
  apiRequest(`${TEACHER}/list`, { token, method: 'POST', body: listBody(params) });

export const createTeacher = (token, teacher) =>
  apiRequest(TEACHER, { token, method: 'POST', body: teacher });

export const updateTeacher = (token, id, teacher) =>
  apiRequest(`${TEACHER}/${encodeURIComponent(id)}`, { token, method: 'PUT', body: teacher });

export const deleteTeacher = (token, id) =>
  apiRequest(`${TEACHER}/${encodeURIComponent(id)}`, { token, method: 'DELETE' });

export const getUsers = (token, params) =>
  apiRequest(`${USER}/list`, { token, method: 'POST', body: listBody(params) });

export const createUser = (token, user) =>
  apiRequest(USER, { token, method: 'POST', body: user });

export const updateUser = (token, id, user) =>
  apiRequest(`${USER}/${encodeURIComponent(id)}`, { token, method: 'PUT', body: user });

export const deleteUser = (token, id) =>
  apiRequest(`${USER}/${encodeURIComponent(id)}`, { token, method: 'DELETE' });

export const getClasses = (token, params) =>
  apiRequest(`${CLASSROOM}/list`, { token, method: 'POST', body: listBody(params) });

export const getSchedule = (token, params) =>
  apiRequest(`${SCHEDULE}/list`, { token, method: 'POST', body: listBody(params) });

export const getTuition = (token, month, params) => {
  return apiRequest(`${TUITION}/list`, {
    token,
    method: 'POST',
    body: listBody({ ...params, month }),
  });
};

export const getMessages = (token, params) =>
  apiRequest(`${MESSAGE}/list`, { token, method: 'POST', body: listBody(params) });

export const getDashboardSummary = (token, date, month) => {
  const query = new URLSearchParams({ date, month });
  return apiRequest(`${DASHBOARD}/summary?${query.toString()}`, { token });
};
