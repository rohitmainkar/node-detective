import { call, put, takeEvery } from "redux-saga/effects";
import {
  GetCustomerSuccess,
  getOrderTypeSuccess,
  getSupplierAddressSuccess,
  getSupplierSuccess,
  GetVenderSuccess,
  GetVenderSupplierCustomerSuccess,
} from "./actions";
import {
  get_OrderType_Api,
  IB_Division_DROP_API,
  Party_Master_Edit_API,
  VendorSupplierCustomer,
} from "../../../helpers/backend_helper";

import {
  GET_CUSTOMER,
  GET_ORDER_TYPE,
  GET_SUPPLIER,
  GET_SUPPLIER_ADDRESS,
  GET_VENDER,
  GET_VENDER_SUPPLIER_CUSTOMER,
} from "./actionType";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { CommonConsole, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";

function* supplierAddressGenFunc() {

  try {
    const response = yield call(Party_Master_Edit_API, userParty());
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
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error for Party API ",
    }));
  }
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
    const response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": userParty(), "Company": userCompany() });
    yield put(GetVenderSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* getSupplierGenFunc() {

  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": userParty(), "Company": userCompany() });
    yield put(getSupplierSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* getCustomerGenFunc() {
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": userParty(), "Company": userCompany() });
    yield put(GetCustomerSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* vendorSupplierCustomer_genFunc({ subPageMode }) {
  let response;
  try {
    debugger
    if ((subPageMode === url.ORDER_1) || (subPageMode === url.ORDER_LIST_1)) {
      response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": userParty(), "Company": userCompany() });//vendor mode 1
    }
    else if ((subPageMode === url.ORDER_2) || (subPageMode === url.ORDER_LIST_2)) {
      response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": userParty(), "Company": userCompany() });//supplier mode 2
    }
    else if ((subPageMode === url.IB_ORDER) || (subPageMode === url.IB_ORDER_PO_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": userParty(), "Company": userCompany() });//divisions mode 4
    }
    else if ((subPageMode === url.ORDER_4) || (subPageMode === url.ORDER_LIST_4)) {
      response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": userParty(), "Company": userCompany() });//Customer mode 3
    }
    else if ((subPageMode === url.INVOICE_1) || (subPageMode === url.INVOICE_LIST_1)) {
      response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": userParty(), "Company": userCompany() });
    }
    else if ((subPageMode === url.IB_INVOICE) || (subPageMode === url.IB_INVOICE_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": userParty(), "Company": userCompany() });
      // response = yield call(IB_Division_DROP_API, { "Company": userCompany(), "Party": userParty() });
    }
    else if ((subPageMode === url.INWARD) || (subPageMode === url.INWARD_LIST)) {
      response = yield call(VendorSupplierCustomer, { "Type": 4, "PartyID": userParty(), "Company": userCompany() });
    } else {
      response = { Data: [] }
    }

    yield put(GetVenderSupplierCustomerSuccess(response.Data));
  }
  catch (e) { }
}

function* SupplierSaga() {
  yield takeEvery(GET_SUPPLIER, getSupplierGenFunc);
  yield takeEvery(GET_SUPPLIER_ADDRESS, supplierAddressGenFunc);
  yield takeEvery(GET_ORDER_TYPE, OrderType_GenFunc);
  yield takeEvery(GET_VENDER, getVendorGenFunc);
  yield takeEvery(GET_VENDER_SUPPLIER_CUSTOMER, vendorSupplierCustomer_genFunc);
  yield takeEvery(GET_CUSTOMER, getCustomerGenFunc);
}

export default SupplierSaga;
