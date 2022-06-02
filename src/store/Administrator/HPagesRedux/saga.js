import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteModuleIDSuccess,
  editHPagesIDSuccess,
  GetHpageListData,
  GetHpageListDataSuccess,
  getH_ModulesSuccess,
  getH_SubModulesSuccess,
  getPageListSuccess,
  getPageTypeSuccess,
  saveHPagesSuccess,
  updateHPagesSuccess,
} from "./actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  deletHPagesUsingID_API,
  edit_HPageID,
  Fetch_HPagesListApi,
  get_H_SubModule_HPages,
  get_Module_HPages,
  saveHPagesAPI,
  updateHPages
} from "../../../helpers/backend_helper";
import {
  DELETE_HPAGES_USING_ID,
  EDIT_H_PAGES_ID,
  GET_HPAGES_LIST_DATA,
  GET_H_SUB_MODULES,
  GET_PAGELIST,
  SAVE_HPAGES,
  UPDATE_H_PAGES,
} from "./actionType";
import PageListDropdownData from "./PageListData";


// function* fetchHPagesList_GneratorFunction() {
//   // yield put(SpinnerState(true))
//   try {
//     const response = yield call(Fetch_HPagesListApi,put);
//     yield put(SpinnerState(false))
//     yield put(GetHpageListDataSuccess(response.Data));
//   } catch (error) {
//     // yield put(SpinnerState(false))
//     yield put(AlertState({ Type: 3, Status: true, Message: "Network error Message", RedirectPath: false, AfterResponseAction: false }));
//   }
// }

function* fetchHPagesList_GneratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Fetch_HPagesListApi);
    yield put(GetHpageListDataSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* GetH_Sub_Modules({ id }) {
  try {
    const response = yield call(get_Module_HPages, id);
    yield put(getH_ModulesSuccess(response.Data))
  } catch (error) {
    yield put(AlertState({ Type: 3, Status: true, Message: " GetH_Sub_Modules Network error Message", RedirectPath: false, AfterResponseAction: false }));
  }
}


function* saveHPageSaga_GneratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(saveHPagesAPI, data);
    yield put(SpinnerState(false))
    yield put(saveHPagesSuccess(response));
    console.log("response",response)
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* editHpages_ID({ id }) {
  try {
    // console.log("saga file is",id)
    const response = yield call(edit_HPageID, id);
    yield put(editHPagesIDSuccess(response));
    // console.log("saga file response",response)
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* update_HPagesUsingID_GenratorFunction({ data, id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(updateHPages, data, id);
    yield put(SpinnerState(false))
    yield put(updateHPagesSuccess(response))
  }
    catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* deleteHpagesUsingID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(deletHPagesUsingID_API, id);
    yield put(SpinnerState(false))
    yield put(deleteModuleIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}
//  PageType dropdown list
function* PageList_DropDown_GenratorFunction() {
  try {
    // const response = yield call("");
    console.log("PageList Data saga file",PageListDropdownData.Data)
    yield put(getPageListSuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("PageList_saga page error", error);
  }
}
function* HPageSaga() {
  yield takeEvery(SAVE_HPAGES, saveHPageSaga_GneratorFunction)
  yield takeEvery(GET_HPAGES_LIST_DATA, fetchHPagesList_GneratorFunction);
  yield takeEvery(EDIT_H_PAGES_ID, editHpages_ID);
  yield takeEvery(GET_H_SUB_MODULES, GetH_Sub_Modules);
  yield takeEvery(UPDATE_H_PAGES, update_HPagesUsingID_GenratorFunction);
  yield takeEvery(DELETE_HPAGES_USING_ID, deleteHpagesUsingID_GenratorFunction)
  yield takeEvery(GET_PAGELIST, PageList_DropDown_GenratorFunction)


}

export default HPageSaga;
