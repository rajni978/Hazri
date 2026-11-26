
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return sessionStorage.getItem('hazri-token');
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---------- Student APIs ----------

export const apiListStudents = () =>
  request('/api/students');

export const apiCreateStudent = (body) =>
  request('/api/students', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiUpdateStudent = (id, body) =>
  request(`/api/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDeleteStudent = (id) =>
  request(`/api/students/${id}`, {
    method: 'DELETE',
  });

// ---------- Mentor APIs ----------

export const apiListMentors = () =>
  request('/api/mentors');

export const apiCreateMentor = (body) =>
  request('/api/mentors', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiUpdateMentor = (id, body) =>
  request(`/api/mentors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDeleteMentor = (id) =>
  request(`/api/mentors/${id}`, {
    method: 'DELETE',
  });

// ---------- Class APIs ----------

export const apiListClasses = () =>
  request('/api/classes');

export const apiGetClass = (id) =>
  request(`/api/classes/${id}`);

export const apiCreateClass = (body) =>
  request('/api/classes', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiUpdateClass = (id, body) =>
  request(`/api/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDeleteClass = (id) =>
  request(`/api/classes/${id}`, {
    method: 'DELETE',
  });

// ---------- Subject APIs ----------

export const apiListSubjects = () =>
  request('/api/subjects');

export const apiGetSubject = (id) =>
  request(`/api/subjects/${id}`);

export const apiCreateSubject = (body) =>
  request('/api/subjects', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiUpdateSubject = (id, body) =>
  request(`/api/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDeleteSubject = (id) =>
  request(`/api/subjects/${id}`, {
    method: 'DELETE',
  });

// ---------- Assignment APIs ----------

export const apiListAssignments = () =>
  request('/api/assignments');

export const apiAssignMentorsToClass = (body) =>
  request('/api/assignments/class', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiAssignMentorsToSubject = (body) =>
  request('/api/assignments/subject', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiAssignSubjectsToClass = (classId, body) =>
  request(`/api/assignments/class/${classId}/subjects`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiRemoveMentorFromClass = (classId, mentorId) =>
  request(`/api/assignments/class/${classId}/mentors/${mentorId}`, {
    method: 'DELETE',
  });

export const apiRemoveMentorFromSubject = (subjectId, mentorId) =>
  request(`/api/assignments/subject/${subjectId}/mentors/${mentorId}`, {
    method: 'DELETE',
  });

export const apiRemoveSubjectFromClass = (classId, subjectId) =>
  request(`/api/assignments/class/${classId}/subjects/${subjectId}`, {
    method: 'DELETE',
  });

// ---------- Profile APIs ----------

export const apiGetStudentProfile = () =>
  request('/api/profile/student');

export const apiUpdateStudentProfile = (body) =>
  request('/api/profile/student', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiGetMentorProfile = () =>
  request('/api/profile/mentor');

export const apiUpdateMentorProfile = (body) =>
  request('/api/profile/mentor', {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// ---------- Admin APIs ----------

export const apiGetAdminStats = () =>
  request('/api/admin/stats');

// ---------- Attendance APIs ----------

export const apiCreateAttendanceSession = (body) =>
  request('/api/attendance/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiListAttendanceSessions = () =>
  request('/api/attendance/sessions');

export const apiStudentCheckIn = (body) =>
  request('/api/attendance/check-in', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiGetSessionAttendance = (sessionId) =>
  request(`/api/attendance/sessions/${sessionId}/attendance`);

export const apiGetMyAttendance = () =>
  request('/api/attendance/my');

export const apiRegenerateAttendanceOTP = (sessionId) =>
  request(`/api/attendance/sessions/${sessionId}/regenerate`, {
    method: 'POST',
  });

export const apiUpdateAttendance = (attendanceId, body) =>
  request(`/api/attendance/${attendanceId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const apiFinalizeAttendanceSession = (sessionId) =>
  request(`/api/attendance/sessions/${sessionId}/finalize`, {
    method: 'PATCH',
  });

export const apiExportSessionAttendance = async (sessionId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/attendance/sessions/${sessionId}/export`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Could not export attendance');
  }

  return response.blob();
};
