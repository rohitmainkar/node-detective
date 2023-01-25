import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Inward_Delete_API, Inward_List_API, Inward_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteInwardIdSuccess, getInwardListPageSuccess, postInwardSuccess } from "./action";
import { DELETE_INWARD_LIST_PAGE, GET_INWARD_LIST_PAGE, POST_INWARD } from "./actionType";

//post api
function* Post_Inward_GenratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {

    const response = yield call(Inward_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postInwardSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// Inward List API
function* get_InwardList_GenFunc({ filters }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Inward_List_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.IBInwardDate)
      var time = convertTimefunc(i.CreatedOn)
      i.IBInwardDate = (`${date} ${time}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(getInwardListPageSuccess(newList))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Inward List",
    }));
  }
}

function* DeleteInward_GenFunc({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Inward_Delete_API, id);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) yield put(deleteInwardIdSuccess(response))
    else yield put(AlertState({
      Type: 4,
      Status: true, Message: JSON.stringify(response.Message),
    }));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Delete Inward",
    }));
  }
}

function* InwardSaga() {
  yield takeEvery(POST_INWARD, Post_Inward_GenratorFunction)
  yield takeEvery(GET_INWARD_LIST_PAGE, get_InwardList_GenFunc)
  yield takeEvery(DELETE_INWARD_LIST_PAGE, DeleteInward_GenFunc)

}

export default InwardSaga;