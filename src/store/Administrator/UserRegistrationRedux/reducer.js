import {
    GET_ROLE_SUCCESS,
    ADD_USER_SUCCESS,
    GET_USER_SUCCESS,
    UPDATE_SUCCESS,
    EDIT_SUCCESS,
    DELETE_SUCCESS,
    GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
    GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
    
    }from './actionType'
  const INIT_STATE = {
    employeelistForDropdown: [],
    Roles:[],
    AddUserMessage:{ Status: false },
    pages:[],
    deleteSuccessRole: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
    userPartiesForUserMaster:[],
  };
  const User_Registration_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS:
        return {
          ...state,
          employeelistForDropdown: action.payload,
        };
  
        case GET_ROLE_SUCCESS:
          return {
            ...state,
            Roles: action.payload,
          }
  
            case ADD_USER_SUCCESS:
              return {
                ...state,
                AddUserMessage: action.payload,
              };
  
                //// get Registration api
          case GET_USER_SUCCESS:
            return {
              ...state,
              pages: action.payload,
            }
  
            //// delete api
        case DELETE_SUCCESS:
          return {
            ...state,
            deleteSuccessRole: action.payload,
          };
    
          //// edit api
        case EDIT_SUCCESS:
          return {
            ...state,
            editData: action.payload,
          };
    
      //// update api
        case UPDATE_SUCCESS:
          return {
            ...state,
            updateMessage: action.payload,
          };

          case GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS:
            return {
              ...state,
              userPartiesForUserMaster: action.payload,
            };
        default:
        return state;
    }
  };
  
  export default User_Registration_Reducer;
  