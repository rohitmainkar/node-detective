import {
  EDIT_PARTY_ITEM_ID_SUCCESS,
  GO_BUTTON_PARTY_ITEM_ADD,
  GO_BUTTON_PARTY_ITEM_ADD_SUCCESS,
 
  PARTY_ITEM_API_ERROR_ACTION,
  SAVE_PARTY_ITEMS_ACTION,
  SAVE_PARTY_ITEMS_ACTION_SUCCESS,
} from "./actionType"
const INIT_STATE = {

  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  partyItem: [],

  goBtnloading:false,
  partyItemListLoading: false,
  saveBtnloading: false
}

const PartyItemsReducer = (state = INIT_STATE, action) => {

  switch (action.type) {

    case SAVE_PARTY_ITEMS_ACTION:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_PARTY_ITEMS_ACTION_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }



    case GO_BUTTON_PARTY_ITEM_ADD:
      return {
        ...state,
        partyItemListLoading: true,
      }

    case GO_BUTTON_PARTY_ITEM_ADD_SUCCESS:
      return {
        ...state,
        partyItem: action.payload,
        partyItemListLoading: false,
      }

    case EDIT_PARTY_ITEM_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case PARTY_ITEM_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        goBtnloading:false,
        partyItemListLoading: false,
      }

    default:
      return state
  }
}

export default PartyItemsReducer