import { call, put, takeEvery } from "redux-saga/effects";
import {
  CommonConsole,
  concatDateAndTime,
  loginUserID,
} from "../../../components/Common/CommonFunction";
import {
  Invoice_1_GoButton_API,
  Invoice_1_Save_API,
  Invoice_1_Delete_API,
  Invoice_1_Edit_API_Singel_Get,
  Invoice_1_Get_Filter_API,
  IB_Invoice_GoButton_API,
  IB_Invoice_Save_API,
  IB_Invoice_Get_Filter_API,
  IB_Invoice_Edit_API_Singel_Get,
  IB_Invoice_Delete_API,
  EInvoice_Uploade_Get_API,
  EInvoice_Cancel_Get_API,
  EwayBill_Uploade_Get_API,
  EwayBill_Cancel_Get_API,
} from "../../../helpers/backend_helper";
import {
  deleteInvoiceIdSuccess,
  editInvoiceListSuccess,
  invoiceListGoBtnfilterSucccess,
  GoButtonForinvoiceAddSuccess,
  invoiceSaveActionSuccess,
  makeIB_InvoiceActionSuccess,
  InvoiceApiErrorAction,
  Uploaded_EInvoiceSuccess,
  Uploaded_EwayBillSuccess,
  Cancel_EInvoiceSuccess,
  Cancel_EwayBillSuccess,
  Print_EInvoiceAction,
  Print_EwayBillSuccess
} from "./action";
import {
  DELETE_INVOICE_LIST_PAGE,
  EDIT_INVOICE_LIST, INVOICE_LIST_GO_BUTTON_FILTER,
  GO_BUTTON_FOR_INVOICE_ADD,
  INVOICE_SAVE_ADD_PAGE_ACTION,
  MAKE_IB_INVOICE_ACTION,
  UPLOADED_E_INVOICE_ACTION,
  UPLOADED_E_WAY_BILL_ACTION,
  CANCLE_E_WAY_BILL_ACTION,
  CANCLE_E_INVOICE_ACTION,

} from "./actionType";
import *as url from "../../../routes/route_url"
import { discountCalculate } from "../../../pages/Sale/Invoice/invoiceCaculations";
import { orderApprovalActionSuccess } from "../../actions";



//post api for Invoice Master
function* save_Invoice_Genfun({ config }) {
  const { subPageMode } = config;
  try {

    if (subPageMode === url.INVOICE_1) {
      let response = yield call(Invoice_1_Save_API, config);
      yield put(invoiceSaveActionSuccess(response))
    } if (subPageMode === url.IB_INVOICE) {
      let response = yield call(IB_Invoice_Save_API, config);
      yield put(invoiceSaveActionSuccess(response))
    }
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// Invoice List
function* InvoiceListGenFunc({ config }) {
  try {
    const { subPageMode } = config
    let response;

    if ((subPageMode === url.INVOICE_LIST_1) || (subPageMode === url.LOADING_SHEET)) {
      response = yield call(Invoice_1_Get_Filter_API, config);
    } else if (subPageMode === url.IB_INVOICE_LIST || subPageMode === url.IB_GRN_LIST || subPageMode === url.IB_INWARD_STP) {
      response = yield call(IB_Invoice_Get_Filter_API, config);
    }

    const newList = yield response.Data.map((i) => {
      if (i.LoadingSheetCreated === true) {
        i["LoadingSheetCreated"] = "LoadingSheet Created"
      } else {
        i["LoadingSheetCreated"] = ""
      }
      i["preInvoiceDate"] = i.InvoiceDate
      i.InvoiceDate = concatDateAndTime(i.InvoiceDate, i.CreatedOn)
      return i
    })
    yield put(invoiceListGoBtnfilterSucccess(newList));

  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// edit List page
function* editInvoiceListGenFunc({ config }) {
  try {
    const { subPageMode, btnmode } = config;
    let response;

    if (subPageMode === url.INVOICE_LIST_1) {
      response = yield call(Invoice_1_Edit_API_Singel_Get, config);
    } else if (subPageMode === url.IB_INVOICE_LIST) {
      response = yield call(IB_Invoice_Edit_API_Singel_Get, config);
    }

    response.pageMode = btnmode
    yield put(editInvoiceListSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// Invoice List delete List page
function* DeleteInvoiceGenFunc({ config }) {
  try {
    const { subPageMode } = config;
    let response;

    if (subPageMode === url.INVOICE_LIST_1) {
      response = yield call(Invoice_1_Delete_API, config)
    } else if (subPageMode === url.IB_INVOICE_LIST) {
      response = yield call(IB_Invoice_Delete_API, config)
    }

    yield put(deleteInvoiceIdSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// GO-Botton SO-invoice Add Page API
export function invoice_GoButton_dataConversion_Func(response) {

  // Iterate over OrderItemDetails array and perform data conversion
  response.OrderItemDetails = response.OrderItemDetails.map(index1 => {
    const defaultunit = index1.UnitDetails.find(findEle => findEle.UnitID === index1.Unit);
    let tAmount = 0;

    // Set properties for data conversion
    index1["OrderQty"] = index1.Quantity;
    index1["default_UnitDropvalue"] = {
      value: index1.Unit,
      label: index1.UnitName,
      ConversionUnit: '1',
      Unitlabel: index1.UnitName,
      BaseUnitQuantity: defaultunit.BaseUnitQuantity,
      BaseUnitQuantityNoUnit: defaultunit.BaseUnitQuantity,
    };

    index1["InpStockQtyTotal"] = `${Number(index1.Quantity) * Number(index1.ConversionUnit)}`;
    index1["ItemTotalStock"] = 0;
    index1["StockInValid"] = false;
    index1["StockInvalidMsg"] = '';

    let orderQty = Number(index1.Quantity);

    // Iterate over StockDetails array and perform data conversion
    index1.StockDetails = index1.StockDetails.map(index2 => {
      index2["initialRate"] = index2.Rate;
      index2["Rate"] = ((defaultunit.BaseUnitQuantity / defaultunit.BaseUnitQuantityNoUnit) * index2.initialRate).toFixed(2);
      index2["ActualQuantity"] = (index2.BaseUnitQuantity / defaultunit.BaseUnitQuantity).toFixed(2);
      index1["Quantity"] = Number(index1.Quantity).toFixed(2);

      index1["ItemTotalStock"] += Number(index2.ActualQuantity);

      let stockQty = Number(index2.ActualQuantity);

      // Adjust order quantity based on stock availability
      if (orderQty > stockQty && orderQty !== 0) {
        orderQty -= stockQty;
        index2.Qty = stockQty.toFixed(2);
      } else if (orderQty <= stockQty && orderQty > 0) {
        index2.Qty = orderQty.toFixed(2);
        orderQty = 0;
      } else {
        index2.Qty = 0;
      }

      // Calculate total amount if quantity is greater than 0
      if (index2.Qty > 0) {
        const calculate = discountCalculate(index2, index1);
        tAmount += Number(calculate.tAmount);
      }

      return index2;
    });

    const t1 = Number(index1.ItemTotalStock).toFixed(3);
    const t2 = Number(index1.Quantity);
    const tA4 = tAmount.toFixed(2);

    index1["tAmount"] = tA4;

    // Check for stock availability and set corresponding message
    if (t1 < t2) {
      index1["StockInValid"] = true;
      const diffrence = Math.abs(t1 - t2);
      const msg1 = `Short Stock Quantity ${Number(index1.Quantity).toFixed(3)}`;
      const msg2 = `Short Stock Quantity ${Number(diffrence).toFixed(3)}`;
      index1["StockInvalidMsg"] = index1.ItemTotalStock === 0 ? msg1 : msg2;
    }

    return index1;
  });

  return response;
}

function* gobutton_invoiceAdd_genFunc({ config }) {
  const { subPageMode, path, pageMode, customer, errorMsg } = config;

  try {

    let response;

    if (subPageMode === url.INVOICE_1) {
      response = yield call(Invoice_1_GoButton_API, config); // GO-Botton SO-invoice Add Page API
    }
    else if (subPageMode === url.IB_INVOICE) {
      response = yield call(IB_Invoice_GoButton_API, config); // GO-Botton IB-invoice Add Page API
    }

    response["path"] = path
    response["page_Mode"] = pageMode
    response["customer"] = customer
    debugger
    const newData = invoice_GoButton_dataConversion_Func(response.Data)
    debugger
    response.Data = newData
    yield put(GoButtonForinvoiceAddSuccess(response));

  } catch (error) {
    debugger
    yield put(InvoiceApiErrorAction())

    if (errorMsg) {//if ErrorMsg True means the SO-Order GOTo-Invoice Button hit After GoBtnAdd Api Hitt and get error
      yield put(orderApprovalActionSuccess({
        Status: true,
        Message: errorMsg
      }))
    }
    CommonConsole(error)
  }
}

function* makeIB_InvoiceGenFunc({ body }) {
  try {
    const { jsonBody, goBtnId, path, pageMode, customer } = body
    const response = yield call(IB_Invoice_GoButton_API, jsonBody); // GO-Botton IB-invoice Add Page API
    response["path"] = path
    response["page_Mode"] = pageMode
    response["customer"] = customer

    yield invoice_GoButton_dataConversion_Func({ response, goBtnId })
    yield put(makeIB_InvoiceActionSuccess(response))

  } catch (error) {
    yield put(InvoiceApiErrorAction())
    CommonConsole(error)
  }
}
//**************************** E-Invoice (upload ,cancel,) ***************************************/

function* Uploade_EInvoiceGenFunc({ config }) {
  config["UserID"] = loginUserID();
  try {
    const response = yield call(EInvoice_Uploade_Get_API, config)
    yield put(Uploaded_EInvoiceSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

function* Cancle_EInvoiceGenFunc({ config }) {
  config["UserID"] = loginUserID();
  try {
    const response = yield call(EInvoice_Cancel_Get_API, config)
    yield put(Cancel_EInvoiceSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

//**************************** E-WayBill (upload ,cancel) actions ***************************************/

function* Uploade_EwayBillGenFunc({ config }) {
  config["UserID"] = loginUserID()
  try {
    const response = yield call(EwayBill_Uploade_Get_API, config)
    yield put(Uploaded_EwayBillSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

function* Cancle_EwayBillGenFunc({ config }) {
  config["UserID"] = loginUserID()
  try {
    const response = yield call(EwayBill_Cancel_Get_API, config)
    yield put(Cancel_EwayBillSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// MAKE_IB_INVOICE_ACTION
function* InvoiceSaga() {

  yield takeEvery(INVOICE_SAVE_ADD_PAGE_ACTION, save_Invoice_Genfun)
  yield takeEvery(INVOICE_LIST_GO_BUTTON_FILTER, InvoiceListGenFunc)
  yield takeEvery(EDIT_INVOICE_LIST, editInvoiceListGenFunc)
  yield takeEvery(DELETE_INVOICE_LIST_PAGE, DeleteInvoiceGenFunc)
  yield takeEvery(GO_BUTTON_FOR_INVOICE_ADD, gobutton_invoiceAdd_genFunc)
  yield takeEvery(MAKE_IB_INVOICE_ACTION, makeIB_InvoiceGenFunc)
  yield takeEvery(UPLOADED_E_INVOICE_ACTION, Uploade_EInvoiceGenFunc)
  yield takeEvery(UPLOADED_E_WAY_BILL_ACTION, Uploade_EwayBillGenFunc)
  yield takeEvery(CANCLE_E_WAY_BILL_ACTION, Cancle_EwayBillGenFunc)
  yield takeEvery(CANCLE_E_INVOICE_ACTION, Cancle_EInvoiceGenFunc)
}

export default InvoiceSaga;