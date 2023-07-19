import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, onChangeSelect } from "../../components/Common/validationFunction";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { postOrderSummary_API, postOrderSummary_API_Success } from "../../store/Report/OrderSummaryRedux/action";
import * as XLSX from 'xlsx';
import { SSDD_List_under_Company } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import C_Report from "../../components/Common/C_Report";

const RetailerDataReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();


    const fileds = {
        PartyName: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [groupByDate, setGroupByDate] = useState(false);
    const [groupByParty, setGroupByParty] = useState(false);


    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.OrderSummaryReducer.listBtnLoading,
            orderSummaryGobtn: state.OrderSummaryReducer.orderSummaryGobtn,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, orderSummaryGobtn, SSDD_List } = reducers;
    const { Data = [] } = orderSummaryGobtn;
    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(SSDD_List_under_Company());
    }, [])

    useEffect(() => {
        if ((orderSummaryGobtn.Status === true) && (orderSummaryGobtn.StatusCode === 204)) {
            dispatch(postOrderSummary_API_Success([]))
            customAlert({
                Type: 3,
                Message: orderSummaryGobtn.Message,
            })
            return
        }
    }, [orderSummaryGobtn])

    useEffect(() => {
        if (Data.length > 0) {
            var arr = []
            if (groupByDate) {
                arr.push('OrderDate')
            }
            if (groupByParty) {
                arr.push('CustomerName')
            }

            const groupData = groupByColumnsWithSumFunc(Data, [...arr, ...['Group', 'SubGroup', 'MaterialName']]);
            _cfunc.CommonConsole(JSON.stringify("groupData", Data))
            const worksheet = XLSX.utils.json_to_sheet(groupData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary Report");
            XLSX.writeFile(workbook, `From ${values.FromDate} To ${values.ToDate} ${isSCMParty ? values.PartyName.label : _cfunc.loginUserDetails().PartyName}.XLSX`);
            dispatch(postOrderSummary_API_Success([]));
        }
    }, [Data]);

    const groupByColumnsWithSumFunc = (jsonData, columnNames) => {
        const columnSumsByGroup = jsonData.reduce((result, item) => {
            const groupKey = columnNames.map(columnName => item[columnName]).join('|');
            if (!result[groupKey]) {
                result[groupKey] = {
                    sums: {},
                    data: []
                };

                columnNames.forEach((key) => {
                    result[groupKey].sums[key] = item[key];
                })
            }

            const group = result[groupKey];
            group.data.push(item);

            Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    group.sums[key] = (group.sums[key] || 0) + value;
                }
            });

            return result;
        }, {});
        let arr = []
        Object.keys(columnSumsByGroup).forEach(i => {
            delete columnSumsByGroup[i].sums.Orderid
            arr.push(columnSumsByGroup[i].sums)
        })

        return arr
    };

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));
    Party_Option.unshift({
        value: "",
        label: " All"
    });

    const onselecthandel = (e) => {

        setState((i) => {
            const a = { ...i }
            a.values.PartyName = e;
            a.hasValid.PartyName.valid = true
            return a
        })
    }


    function goButtonHandler() {

        const btnId = `gobtn-${url.ORDER_SUMMARY_REPORT}`
        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "CompanyID": _cfunc.loginCompanyID(),
            "PartyID": isSCMParty ? values.PartyName.value : _cfunc.loginPartyID()

        });
        dispatch(postOrderSummary_API({ jsonBody, btnId }));
    }

   

    return (
        <React.Fragment>
        <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
        <div className="page-content">
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >

                    {isSCMParty &&
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Party</Label>
                                <Col sm="7">
                                    <Select
                                        name="DistrictName"
                                        value={values.PartyName}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={(e) => { onselecthandel(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    }

                    <Col sm="1" className="mt-3 ">
                        <Go_Button onClick={goButtonHandler} loading={reducers.listBtnLoading} />
                    </Col>
                </div>
            </div>

        </div>
    </React.Fragment >
    )
}

export default RetailerDataReport;