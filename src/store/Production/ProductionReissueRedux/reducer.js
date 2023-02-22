import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  DELETE_PRODUCTION_RE_ISSUE_FOR_PRODUCTION_RE_ISSUE_PAGE_SUCCESS,
  DELETE_PRODUCTION_RE_ISSUE_SUCCESS,
  EDIT_PRODUCTION_RE_ISSUE_SUCCESS,
  GET_PRODUCTION_RE_ISSUE_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS,
  GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  GO_BTN_FOR_PRODUNCTION_RE_ISSUE_ADD_PAGE_SUCCESS,
  ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS,
  SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS,
  SET_PRODUCTION_RE_ISSUE_LIST_FILTERS,
  UPDATE_PRODUCTION_RE_ISSUE_SUCCESS,
} from "./actionType"


// const date = currentDate();

const INIT_STATE = {
  postMsg: { Status: false },
  editData: { Status: false, },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  ProductionList: [],
  grnItemList: [],
  produtionMake: { Status: false,  },
  itemOption:[],
  goButtonList:[]
}

const ProductionReIssueReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    // case GET_PRODUCTION_RE_ISSUE_ITEM_MODE_2_SUCCESS:
    //   return {
    //     ...state,
    //     produtionMake: action.payload,
    //   }
  
    case GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS:
      return {
        ...state,
        ProductionList : action.payload,
      }
    case SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }
    case EDIT_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case UPDATE_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }
    case DELETE_PRODUCTION_RE_ISSUE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
      case ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS:
        return {
          ...state,
          itemOption: action.payload,
        }
      
        case GO_BTN_FOR_PRODUNCTION_RE_ISSUE_ADD_PAGE_SUCCESS:
          return {
            ...state,
           goButtonList: action.payload,
          }
        
    default:
      return state
  }
}

export default ProductionReIssueReducer