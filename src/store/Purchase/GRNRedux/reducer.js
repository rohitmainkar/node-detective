import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  GET_GRN_ITEM_MODE_2_SUCCESS,
  GET_GRN_LIST_PAGE_SUCCESS,
  POST_GRN_FROM_GRN_PAGE_SUCCESS,
  SET_GRN_LIST_FILTERS,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
} from "./actionType"


const date = currentDate();

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  GRNList: [],
  grnItemList: [],
  GRNitem: { Status: false, Data: [], },
  grnlistFilter: { fromdate: date, todate: date, supplierSelect: '' }
}

const GRNReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_GRN_LIST_FILTERS:
      return {
        ...state,
        grnlistFilter: action.payload,
      }

    case GET_GRN_ITEM_MODE_2_SUCCESS:
      return {
        ...state,
        GRNitem: action.payload,
      }
    case "GET_GRN_ITEM_MODE_3":
      return {
        ...state,
        grnItemList: action.payload,
      }

    // GRN List Page 
    case GET_GRN_LIST_PAGE_SUCCESS:
      return {
        ...state,
        GRNList: action.payload,
      }

    case POST_GRN_FROM_GRN_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }


    case EDIT_GRN_FOR_GRN_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }

    case DELETE_GRN_FOR_GRN_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }


    default:
      return state
  }

}

export default GRNReducer