import {
  DELETE_PARTY_SUB_PARTY_SUCCESS,
  EDIT_PARTY_SUB_PARTY_SUCCESS,
  GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  POST_PARTY_SUB_PARTY_SUCCESS,
  UPDATE_PARTY_SUB_PARTY_SUCCESS,

} from "./actionType";

const INIT_STATE = {
  listData: [],
  postMsg: { Status: false },
  editData: [],
  updateMsg: { Status: false },
  deleteMsg: { Status: false }
}

const PartySubPartyReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case GET_PARTY_SUB_PARTY_LIST_SUCCESS:
      return {
        ...state,
        listData: action.payload,
      }

    case POST_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }


    case EDIT_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }
    case DELETE_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }

    default:
      return state
  }
}

export default PartySubPartyReducer