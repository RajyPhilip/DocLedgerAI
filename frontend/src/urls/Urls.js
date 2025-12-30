
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
    DELETE:(fileID)=>`/delete-document/${fileID}`,
  },
  
};

export default URL_CONSTANTS;