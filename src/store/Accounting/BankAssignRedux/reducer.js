import {
  SAVE_BANK_ASSIGN_SUCCESS,
  PARTY_BANK_FILTER_SUCCESS,
  EDIT_BANK_ASSIGN_ID_SUCCESS,
  UPDATE_BANK_ASSIGN_ID_SUCCESS,
  UPDATE_BANK_ASSIGN_ID
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  Data: [],
  editMsg: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  loading: false,
}

const BankAssignReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_BANK_ASSIGN_SUCCESS:
      return {
        ...state,
        saveBtnloading: true,

      }

    case SAVE_BANK_ASSIGN_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      }

    case PARTY_BANK_FILTER_SUCCESS:
      return {
        ...state,
        Data: action.payload,
      }

    case EDIT_BANK_ASSIGN_ID_SUCCESS:
      return {
        ...state,
        editMsg: action.payload,
      };

    // update api

    case UPDATE_BANK_ASSIGN_ID:
      return {
        ...state,
        saveBtnloading: true,
      };

    case UPDATE_BANK_ASSIGN_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,

      };

    default:
      return state
  }
}

export default BankAssignReducer  