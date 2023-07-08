import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { amountCommaSeparateFunc, concatDateAndTime } from "../../../components/Common/CommonFunction";

// Bank list Dropdown API
function* Invoice_No_List_GenFunc({ jsonBody }) {

    try {
        const response = yield call(apiCall.Invoice_No_list_API, jsonBody);
        yield put(action.InvoiceNumberSuccess(response.Data));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// add button api for sales return
function* save_SalesReturn_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.SalesReturn_post_API, config);
        yield put(action.saveSalesReturnMaster_Success(response));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// GoButton Post API for Sales Return List
function* SalesReturn_List_GenFun({ filters }) {

    try {
        const response = yield call(apiCall.SalesReturn_list_API, filters);
        const newList = yield response.Data.map((i) => {
            i.GrandTotal = amountCommaSeparateFunc(i.GrandTotal)
            i.ReturnDate = concatDateAndTime(i.ReturnDate, i.CreatedOn)
            return i
        })

        yield put(action.salesReturnListAPISuccess(newList));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// delete API
function* delete_SalesReturn_ID_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.SalesReturn_Delete_API, config);
        yield put(action.delete_SalesReturn_Id_Succcess(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}
function* addButton_saleReturn_GenFunc({ config }) {
    try {
        const { jsonBody, InvoiceId, returnMode } = config;
        
        if (returnMode === 2) {//returnMode 1 = "itemWise"
            const response = yield call(apiCall.SalesReturn_add_button_api_For_Item, jsonBody);
            
            yield put(action.SalesReturnAddBtn_Action_Succcess(response));
        }
        else {//returnMode 2 = "invoiceWise"
            let response = yield call(apiCall.SalesReturn_add_button_api_For_Invoice, InvoiceId);
            response.Data = response.Data.InvoiceItems
            yield put(action.SalesReturnAddBtn_Action_Succcess(response))
        }

    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}



function* SalesReturnSaga() {
    yield takeLatest(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)
    yield takeLatest(actionType.SAVE_SALES_RETURN_MASTER, save_SalesReturn_GenFunc)
    yield takeLatest(actionType.SALES_RETURN_LIST_API, SalesReturn_List_GenFun)
    yield takeLatest(actionType.DELETE_SALES_RETURN_ID, delete_SalesReturn_ID_GenFunc)
    yield takeLatest(actionType.SALES_RETURN_ADD_BUTTON_ACTION, addButton_saleReturn_GenFunc)
}
export default SalesReturnSaga;  