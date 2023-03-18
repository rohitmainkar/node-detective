import { call, put, takeEvery } from "redux-saga/effects";
import {
  GetCustomerSuccess,
  getOrderTypeSuccess,
  getSupplierAddressSuccess,
  getSupplierSuccess,
  GetVenderSuccess,
  GetVenderSupplierCustomerSuccess,
  Retailer_List_Success,
  SSDD_List_under_Company_Success,
} from "./actions";
import {
  get_OrderType_Api,
  Party_Master_Edit_API,
  Retailer_List_under_Company_PartyAPI,
  SSDD_List_under_Company_API,
  VendorSupplierCustomer,
} from "../../../helpers/backend_helper";

import {
  GET_CUSTOMER,
  GET_ORDER_TYPE,
  GET_SUPPLIER,
  GET_SUPPLIER_ADDRESS,
  GET_VENDER,
  GET_VENDER_SUPPLIER_CUSTOMER,
  RETAILER_LIST,
  SSDD_LIST_UNDER_COMPANY,
} from "./actionType";

import { CommonConsole, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";

function* supplierAddressGenFunc() {
  const config = { editId: loginPartyID() }
  try {
    const response = yield call(Party_Master_Edit_API, config);
    let first = [], secd = [], newArr = []
    const arr = response.Data.PartyAddress;
    arr.forEach((i, k) => {
      if (i.IsDefault === true) {

        first.push({
          value: i.id,
          label: i.Address,
        })
      } else {
        secd.push({
          value: i.id,
          label: i.Address,
        })
      }
    })
    newArr = [...first, ...secd]

    yield put(getSupplierAddressSuccess(newArr));
  } catch (error) { CommonConsole(error) }
}

// OrderType Dropdown
function* OrderType_GenFunc() {
  try {
    const response = yield call(get_OrderType_Api);
    yield put(getOrderTypeSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* getVendorGenFunc() {

  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": loginPartyID(), "Company": loginCompanyID() });
    yield put(GetVenderSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* getSupplierGenFunc() {

  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": loginPartyID(), "Company": loginCompanyID() });
    yield put(getSupplierSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* getCustomerGenFunc() {
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": loginPartyID(), "Company": loginCompanyID() });
    yield put(GetCustomerSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* vendorSupplierCustomer_genFunc({ subPageMode }) {
  let response;
  try {

    if ((subPageMode === url.ORDER_1) || (subPageMode === url.ORDER_LIST_1) || (subPageMode === url.GRN_STP)) {
      response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": loginPartyID(), "Company": loginCompanyID() });//vendor mode 1
    }
    else if ((subPageMode === url.ORDER_2) || (subPageMode === url.ORDER_LIST_2)) {
      response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": loginPartyID(), "Company": loginCompanyID() });//supplier mode 2
    }
    else if ((subPageMode === url.IB_ORDER) || (subPageMode === url.IB_ORDER_PO_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": loginPartyID(), "Company": loginCompanyID() });//divisions mode 4
    }
    else if ((subPageMode === url.ORDER_4) || (subPageMode === url.ORDER_LIST_4)) {
      response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": loginPartyID(), "Company": loginCompanyID() });//Customer mode 3
    }
    else if ((subPageMode === url.INVOICE_1) || (subPageMode === url.INVOICE_LIST_1)) {
      response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": loginPartyID(), "Company": loginCompanyID() });
    }
    else if ((subPageMode === url.IB_INVOICE) || (subPageMode === url.IB_INVOICE_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": loginPartyID(), "Company": loginCompanyID() });
      // response = yield call(IB_Division_DROP_API, { "Company": loginCompanyID(), "Party": loginPartyID() });
    }
    else if ((subPageMode === url.INWARD) || (subPageMode === url.INWARD_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": loginPartyID(), "Company": loginCompanyID() });
    } else {
      response = { Data: [] }
    }

    yield put(GetVenderSupplierCustomerSuccess(response.Data));
  }
  catch (e) { }
}

function* SSDD_List_under_Company_GenFunc() {
  try {
    const response = yield call(SSDD_List_under_Company_API, { "Type": 3, "PartyID": loginPartyID(), "CompanyID": loginCompanyID() });
    yield put(SSDD_List_under_Company_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Retailer_List_GenFunc({ data }) {
    
  try {
    const response = yield call(Retailer_List_under_Company_PartyAPI, data);
    yield put(Retailer_List_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* SupplierSaga() {
  yield takeEvery(GET_SUPPLIER, getSupplierGenFunc);
  yield takeEvery(GET_SUPPLIER_ADDRESS, supplierAddressGenFunc);
  yield takeEvery(GET_ORDER_TYPE, OrderType_GenFunc);
  yield takeEvery(GET_VENDER, getVendorGenFunc);
  yield takeEvery(GET_VENDER_SUPPLIER_CUSTOMER, vendorSupplierCustomer_genFunc);
  yield takeEvery(GET_CUSTOMER, getCustomerGenFunc);
  yield takeEvery(SSDD_LIST_UNDER_COMPANY, SSDD_List_under_Company_GenFunc);
  yield takeEvery(RETAILER_LIST, Retailer_List_GenFunc);

}

export default SupplierSaga;
