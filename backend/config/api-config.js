// api-config.js
export const apiConfiguration = {
    baseUrl: "http://localhost:4000",
    endpoints: {
      doctors: "baseurl/doctors",
      departments: "doctors/speciality",
      appointments: {
        create: "/api/appointments/create",
        update: "/api/appointments/update",
        cancel: "/api/appointments/cancel",
        list: "/api/appointments/list"
      },
      availability: "/api/availability",
      patientInfo: "/api/patients"
    },
    auth: {
      type: "Bearer",
      tokenEndpoint: "/api/auth/token"
    },
    retryPolicy: {
      maxRetries: 3,
      retryIntervalMs: 1000
    }
  };