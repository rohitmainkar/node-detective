import { call, put, takeEvery } from "redux-saga/effects";
import {
  delete_ImportFiledAdd_Success,
  edit_ImportFiledAdd_Success,
  get_ImportFiledAdd_Success,
  save_ImportFiledAdd_Success,
  update_ImportFiledAdd_Success,
} from "./action";
import {
  ImportFieldAdd_Delete_API,
  ImportFieldAdd_Edit_API,
  ImportFieldAdd_Get_API,
  ImportFieldAdd_Save_API,
  ImportFieldAdd_Update_API,
} from "../../../helpers/backend_helper";
import {
  DELETE_IMPORT_FIELD_ADD,
  EDIT_IMPORT_FIELD_ADD,
  GET_IMPORT_FIELD_ADD,
  SAVE_IMPORT_FIELD_ADD,
  UPDATE_IMPORT_FIELD_ADD,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";





function* Save_ImportFieldAdd_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportFieldAdd_Save_API, config);
    yield put(save_ImportFiledAdd_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_ImportFieldAdd_GenFun({ config }) {                                   // getList API
  try {
    const response = yield call(ImportFieldAdd_Get_API, config);
    yield put(get_ImportFiledAdd_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Delete_ImportFieldAdd_GenFun({ config }) {                    // delete API
  try {
    const response = yield call(ImportFieldAdd_Delete_API, config);
    yield put(delete_ImportFiledAdd_Success(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_ImportFieldAdd_GenFun({ config }) {                      // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(ImportFieldAdd_Edit_API, config);
    response.pageMode = btnmode;
    yield put(edit_ImportFiledAdd_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_ImportFieldAdd_GenFun({ config }) {                    // update API
  try {
    const response = yield call(ImportFieldAdd_Update_API, config);
    yield put(update_ImportFiledAdd_Success(response))
  } catch (error) { CommonConsole(error) }
}

function* ImportFieldAdd_Saga() {
  yield takeEvery(SAVE_IMPORT_FIELD_ADD, Save_ImportFieldAdd_GenFun)
  yield takeEvery(GET_IMPORT_FIELD_ADD, Get_ImportFieldAdd_GenFun)
  yield takeEvery(EDIT_IMPORT_FIELD_ADD, Edit_ImportFieldAdd_GenFun)
  yield takeEvery(UPDATE_IMPORT_FIELD_ADD, Update_ImportFieldAdd_GenFun)
  yield takeEvery(DELETE_IMPORT_FIELD_ADD, Delete_ImportFieldAdd_GenFun)
}

export default ImportFieldAdd_Saga;