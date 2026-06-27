export const notificationLinks = {
  manager: {
    internships: () => "/manager/internships",
    internshipDetail: (internshipId) => `/manager/internships/${internshipId}`,
    documents: () => "/manager/documents",
    finalDecisions: () => "/manager/final-decisions",
    complaints: (complaintId) =>
      complaintId
        ? `/manager/complaints?complaintId=${complaintId}`
        : "/manager/complaints",
  },
  student: {
    internship: (options = {}) => {
      const params = new URLSearchParams();
      if (options.detail) params.set("detail", "1");
      const query = params.toString();
      return query ? `/student/internship?${query}` : "/student/internship";
    },
    reports: (reportId) =>
      reportId
        ? `/student/reports?reportId=${reportId}`
        : "/student/reports",
    meetings: () => "/student/meetings",
    documents: (documentId) =>
      documentId
        ? `/student/documents?documentId=${documentId}`
        : "/student/documents",
    complaints: (complaintId) =>
      complaintId
        ? `/student/complaints?complaintId=${complaintId}`
        : "/student/complaints",
  },
  supervisor: {
    students: () => "/supervisor/students",
    internshipDetail: (internshipId) => `/supervisor/internships/${internshipId}`,
    reports: (reportId) =>
      reportId
        ? `/supervisor/reports?reportId=${reportId}`
        : "/supervisor/reports",
    meetings: () => "/supervisor/meetings",
    pfeDocuments: (documentId) =>
      documentId
        ? `/supervisor/pfe-documents?documentId=${documentId}`
        : "/supervisor/pfe-documents",
    finalDecisions: () => "/supervisor/final-decisions",
  },
  departmentHead: {
    dashboard: () => "/department-head/dashboard",
    internships: () => "/department-head/internships",
    finalDecisions: () => "/department-head/final-decisions",
  },
};
