import { call, delay, put, takeEvery } from "redux-saga/effects";
import { date_dmy_func } from "../../../components/Common/CommonFunction";
import {
  Discount_Delete_Api,
  Discount_List_Api,
  Discount_Save_Api,
  Discount_Edit_Api,
  Discount_Update_Api,
  Discount_Go_Button_Api
} from "../../../helpers/backend_helper";
import {
  deleteDiscountIDSuccess,
  editDiscountIDSuccess,
  getDiscountListSuccess,
  saveDiscountActionSuccess,
  updateDiscountIDSuccess,
  discountApiErrorAction,
  goBtnDiscountAddActionSuccess
} from "./actions";
import {
  DELETE_DISCOUNT_ID,
  EDIT_DISCOUNT_ID,
  GET_DISCOUNT_LIST,
  GO_BUTTON_DISCOUNT_ACTION,
  SAVE_DISCOUNT_SUBMIT,
  UPDATE_DISCOUNT_ID,
} from "./actionType";

// Discount Master Go button API
function* GoBtn_Discount_GenFunc({ config }) {

  try {
    yield delay(100)
    const response = yield call(Discount_Go_Button_Api, config);
    yield put(goBtnDiscountAddActionSuccess(response));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* Save_Method_ForDiscount_GenFun({ config }) {
  try {
    const response = yield call(Discount_Save_Api, config);
    yield put(saveDiscountActionSuccess(response));
  } catch (error) { yield put(discountApiErrorAction()) }
}

// Discount List API
function* Get_Discount_List_GenFunc({ filterBody }) {

  try {
    const response = yield call(Discount_List_Api, filterBody);
    const newList = yield response.Data.map((i) => {
      if (i.DiscountType === 2) {
        i.DiscountType = "%"
      }
      else {
        i.DiscountType = "Rs"
      }
      i.FromDate = date_dmy_func(i.FromDate)
      i.ToDate = date_dmy_func(i.ToDate)
      return i
    })

    yield put(getDiscountListSuccess(newList));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* deleteDiscount_ID({ config }) {
  try {
    const response = yield call(Discount_Delete_Api, config);
    yield put(deleteDiscountIDSuccess(response))
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* editDiscount_ID({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(Discount_Edit_Api, config);
    response.pageMode = btnmode
    yield put(editDiscountIDSuccess(response));
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* update_Discount({ config }) {
  try {
    const response = yield call(Discount_Update_Api, config);
    yield put(updateDiscountIDSuccess(response))
  } catch (error) { yield put(discountApiErrorAction()) }
}

function* DiscountSaga() {
  yield takeEvery(GO_BUTTON_DISCOUNT_ACTION, GoBtn_Discount_GenFunc);
  yield takeEvery(GET_DISCOUNT_LIST, Get_Discount_List_GenFunc);
  yield takeEvery(EDIT_DISCOUNT_ID, editDiscount_ID);
  yield takeEvery(SAVE_DISCOUNT_SUBMIT, Save_Method_ForDiscount_GenFun);
  yield takeEvery(DELETE_DISCOUNT_ID, deleteDiscount_ID);
  yield takeEvery(UPDATE_DISCOUNT_ID, update_Discount);
}

export default DiscountSaga;
