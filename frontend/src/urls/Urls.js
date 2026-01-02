
const URL_CONSTANTS = {
  USERS: {
    SIGNUP: "/auth/signup",
    SIGNIN: "/auth/login",
    VERIFY_USER: "/auth/verify-user",
    
  },
  DOCUMENTS: {
    GET: "/documents",
    GET_DETAIL: (id)=>`/documents/${id}`,
    UPLOAD_FILE: "/documents/upload",
    UPDATE_FILE:(id)=>`/documents/${id}`,
    DELETE:(id)=>`/documents/${id}`,
    TRANSLATE: (id) => `/documents/${id}/translate`,
    GENERATE_SUMMARY: (id) => `/documents/${id}/summary`,
    EXTRACT_DATA: (id) => `/documents/${id}/extract`,
  },
  
};

export default URL_CONSTANTS;