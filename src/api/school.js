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
