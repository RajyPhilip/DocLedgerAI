
const URL_CONSTANTS = {
  USERS: {
    SIGNUP: "/auth/signup",
    SIGNIN: "/auth/login",
    VERIFY_USER: "/auth/verify-user",
    
  },
  DOCUMENTS: {
    GET: "/documents",
    UPLOAD_FILE: "/documents/upload",
    UPDATE_FILE:(fileID)=>`/delete-file/${fileID}`,
    DELETE:(fileID)=>`/delete-file/${fileID}`,
  },
  
};

export default URL_CONSTANTS;