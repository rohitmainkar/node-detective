import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  PageDropdownForRoleAccess: [],
  RoleListDataForRoleListPage: [],
  AddPage_PageMasterListForRoleAccess:[],
  GO_buttonPageMasterListForRoleAccess:[],
}

const RoleAccessReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        RoleListDataForRoleListPage: action.payload,
      }

    case PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        PageDropdownForRoleAccess: action.payload,
      }

    case GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        GO_buttonPageMasterListForRoleAccess: action.payload,
      }

    case ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        AddPage_PageMasterListForRoleAccess: action.payload,
      }
    default:
      return state
  }

}

export default RoleAccessReducer 