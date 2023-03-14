import { call, put, takeEvery } from "redux-saga/effects";
import {
  challanItemForDropdownSuccess,
  deleteChallanIdSuccess,
  challanList_ForListPageSuccess,
  GoButtonForChallanAddSuccess,
  makeChallanActionSuccess,
  saveChallan_ChallanAddSuccess,
} from "./actions";
import {
  Challan_delete_API,
  Challan_get_API,
  Challan_items_API,
  Challan_items_Stock_API,
  Challan_Make_API,
  Challan_Save_API,
} from "../../../helpers/backend_helper";
import {
  CHALLAN_POST_API,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  CHALLAN_LIST_FOR_LIST_PAGE,
  GO_BUTTON_CHALLAN_POST_API,
  ITEM_DROPDOWN_CHALLAN,
  MAKE_CHALLAN_ACTION,
} from "./actionType";
import { CommonConsole, convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


function* Post_Challan_GerFunc({ data }) {                   // Save Challan  genrator function
  try {
    const response = yield call(Challan_Save_API, data);
    yield put(saveChallan_ChallanAddSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Challan_List_filterGerFunc({ filters }) {          // Challan List Filter  genrator function
  try {
    const response = yield call(Challan_get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.ChallanDate)
      var time = convertTimefunc(i.CreatedOn)
      i.ChallanDate = (`${date} ${time}`)
      return i
    })
    yield put(challanList_ForListPageSuccess(newList))

  } catch (error) { CommonConsole(error) }
}

function* DeleteChallanGenFunc({ id }) {                     // Delete Challan  genrator function
  try {
    const response = yield call(Challan_delete_API, id);

    yield put(deleteChallanIdSuccess(response));
  } catch (error) { CommonConsole(error) }
};

function* Make_Challan_GerFunc({ data }) {                  // Make Chalan Challan  genrator function
  const { jsonBody, pageMode = '', path = '' } = data
  try {
    const response = yield call(Challan_Make_API, jsonBody);
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath
    yield put(makeChallanActionSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* gobutton_challan_genFunc({ data }) {              //  GoButton Challan Addpage genrator function
  try {
    const arr = []
    const response = yield call(Challan_items_Stock_API, data);
    arr.push({ StockDetails: response.Data, })
    yield put(GoButtonForChallanAddSuccess(arr));
  } catch (error) { CommonConsole(error) }
}

function* itemDropDown_Challan_AddPage_genFunc({ data }) {   //  Challan Addpage  IttemDropDown genrator function
  try {
    const response = yield call(Challan_items_API, data);
    yield put(challanItemForDropdownSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ChallanSaga() {
  yield takeEvery(CHALLAN_POST_API, Post_Challan_GerFunc);
  yield takeEvery(CHALLAN_LIST_FOR_LIST_PAGE, Challan_List_filterGerFunc);
  yield takeEvery(GO_BUTTON_CHALLAN_POST_API, gobutton_challan_genFunc);
  yield takeEvery(MAKE_CHALLAN_ACTION, Make_Challan_GerFunc);
  yield takeEvery(DELETE_CHALLAN_FOR_CHALLAN_PAGE, DeleteChallanGenFunc);
  yield takeEvery(ITEM_DROPDOWN_CHALLAN, itemDropDown_Challan_AddPage_genFunc);
}

export default ChallanSaga;
