import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_INVOICE_DATA_EXPORT_API,
} from "./actionType";
import { postInvoiceDataExport_API_Success, postInvoiceDataExportApiErrorAction } from "./action";
import { InvoiceDataExport_GoBtn_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";



function* InvoiceDataExport_Gen({ config }) {
    
    try {
        const response = yield call(InvoiceDataExport_GoBtn_API, config);
        response.Data["btnId"] = config.btnId;
        const newresponse = yield response.Data.InvoiceExportSerializerDetails.map((i, key) => {
            i["InvoiceDate"] = date_dmy_func(i.InvoiceDate)
            i["OrderDate"] = date_dmy_func(i.OrderDate)
            return i
        })
        response.Data["InvoiceExportSerializerDetails"] = newresponse;
        yield put(postInvoiceDataExport_API_Success(response.Data))
    } catch (error) { yield put(postInvoiceDataExportApiErrorAction()) }
}

function* InvoiceDataExportSaga() {
    yield takeLatest(POST_INVOICE_DATA_EXPORT_API, InvoiceDataExport_Gen)
}
export default InvoiceDataExportSaga;