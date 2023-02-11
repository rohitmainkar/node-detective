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
import { userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
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
  } catch (error) { }
}

function* getVendorGenFunc() {

  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": userParty() });
    yield put(GetVenderSuccess(response.Data));
  } catch (error) { }
}

function* getSupplierGenFunc() {

  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": userParty() });
    yield put(getSupplierSuccess(response.Data));
  } catch (error) { }
}

function* getCustomerGenFunc() {
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": userParty() });
    yield put(GetCustomerSuccess(response.Data));
  } catch (error) { }
}

function* vendorSupplierCustomer_genFunc({ subPageMode }) {
  debugger
  let response;
  try {
    if (subPageMode === url.ORDER_1) {
      response = yield call(VendorSupplierCustomer, { "Type": 1, "PartyID": userParty() });//vendor mode 1
    }
    else if (subPageMode === url.ORDER_2) {
      response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": userParty() });//supplier mode 2
    }
    else if (subPageMode === url.INVOICE_1) {
      response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": userParty() });
    }
    else if (subPageMode === url.INVOICE_2) {
      response = yield call(IB_Division_DROP_API, { "Company": userCompany(), "Party": userParty() });
    };

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
