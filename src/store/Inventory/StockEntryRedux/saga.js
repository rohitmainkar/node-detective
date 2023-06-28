import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* StockEntry_API_GenFunc({ config }) { // Save GRN  genrator function

    try {
        const response = yield call(apiCall.StockEntry_Post_API, config);
        yield put(action.saveStockEntrySuccess(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEntrySaga() {

    yield takeEvery(actionType.SAVE_STOCK_ENTRY_ACTION, StockEntry_API_GenFunc)
}
export default StockEntrySaga;  