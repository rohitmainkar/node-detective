import {
  SAVE_DRIVER_MASTER_SUCCESS,
  GET_DRIVER_LIST_SUCCESS,
  DELETE_DRIVER_TYPE_ID_SUCCESS,
  EDIT_DRIVER_TYPE_ID_SUCCESS,
  UPDATE_DRIVER_TYPE_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  DriverList: [],
  postMsg: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  deleteMessage: { Status: false },
}
const DriverReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_DRIVER_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case GET_DRIVER_LIST_SUCCESS:
      return {
        ...state,
        DriverList: action.payload,
      }

    case DELETE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    default:
      return state
  }
}

export default DriverReducer