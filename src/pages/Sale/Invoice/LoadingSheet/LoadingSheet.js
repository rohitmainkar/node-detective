import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { Breadcrumb_inputName, commonPageFieldSuccess } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState, commonPageField } from "../../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import * as mode from "../../../../routes/PageMode";
import { GetRoutesList } from "../../../../store/Administrator/RoutesRedux/actions";
import { invoiceListGoBtnfilter } from "../../../../store/Sales/Invoice/action";
import { getVehicleList } from "../../../../store/Administrator/VehicleRedux/action";
import {
    LoadingSheet_GoBtn_API,
    LoadingSheet_GoBtn_API_Succcess,
    SaveLoadingSheetMaster,
    SaveLoadingSheetMasterSucccess
} from "../../../../store/Sales/LoadingSheetRedux/action";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../../components/Common/CommonPurchaseList";
import { getDriverList } from "../../../../store/Administrator/DriverRedux/action";
import { selectAllCheck } from "../../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../../CustomValidateForm";

const LoadingSheet = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [array, setArray] = useState([]);

    const fileds = {
        id: "",
        Date: currentDate_ymd,
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        RouteName: "",
        VehicleNumber: "",
        DriverName: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))

    const {
        postMsg,
        pageField,
        userAccess,
        VehicleNumber,
        RoutesList,
        GoButton,
        Driver,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.LoadingSheetReducer.saveBtnloading,
        postMsg: state.LoadingSheetReducer.postMsg,
        GoButton: state.LoadingSheetReducer.goBtnLoadingSheet,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        RoutesList: state.RoutesReducer.RoutesList,
        Driver: state.DriverReducer.DriverList,
    }));

    const { Data = [] } = GoButton;

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
        dispatch(getVehicleList())
        dispatch(invoiceListGoBtnfilter())
        dispatch(getDriverList())
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.LOADING_SHEET_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    const Driver_Options = Driver.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            Party: _cfunc.loginPartyID(),
            Route: "",
            LoadingSheetID: ""
        });
        dispatch(LoadingSheet_GoBtn_API(jsonBody));
    }

    // function SelectAll(event, row, key) {

    //     const arr = []
    //     Data.forEach(ele => {
    //         if (ele.id === row.id) {
    //             ele.Check = event
    //         }
    //         arr.push(ele)
    //     })
    //     setArray(arr)

    // }

    const pagesListColumns = [
        {
            text: "Invoice Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Invoice Number",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "GrandTotal",
            dataField: "GrandTotal",
        },
        // {
        //     text: "Select All",
        //     dataField: "Check",
        //     formatter: (cellContent, row, key) => {

        //         return (<span style={{ justifyContent: 'center' }}>
        //             <Input
        //                 id=""
        //                 key={row.id}
        //                 defaultChecked={row.Check}
        //                 type="checkbox"
        //                 className="col col-sm text-center"
        //                 onChange={e => { SelectAll(e.target.checked, row, key) }}
        //             />
        //         </span>)
        //     }
        // }
    ];

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id

        const CheckArray = Data.filter((index) => {
            return (index.selectCheck === true)
        })

        const trueValues = Data.map((index) => {
            return (index.selectCheck === true)
        })

        const totalInvoices = trueValues.reduce((count, value) => {
            if (value === true) {
                count++
            }
            return count
        }, 0)

        const GrandTotal = CheckArray.reduce((a, v) => a = a + parseFloat(v.GrandTotal), 0)

        const LoadingSheetDetails = CheckArray.map((index) => ({
            Invoice: index.id
        }))

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })
                if (LoadingSheetDetails.length === 0) {
                    dispatch(
                        AlertState({
                            Type: 4,
                            Status: true,
                            Message: "Minimum one Invoice is Select",
                        })
                    );
                    return _cfunc.btnIsDissablefunc({ btnId, state: false })
                }

                const jsonBody = JSON.stringify({
                    Date: values.Date,
                    Party: _cfunc.loginPartyID(),
                    Route: values.RouteName.value,
                    Vehicle: values.VehicleNumber.value,
                    Driver: values.DriverName.value,
                    TotalAmount: GrandTotal.toFixed(2),
                    InvoiceCount: totalInvoices,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    LoadingSheetDetails: LoadingSheetDetails
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(SaveLoadingSheetMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    function FromDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function ToDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={DateOnchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.DriverName}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="DriverName"
                                                value={values.DriverName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={Driver_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {/* {isError.RouteName.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.RouteName}</small></span>
                                                )} */}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </div>

                            <div className="  row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.FromDate} </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='FromDate'
                                                value={values.FromDate}
                                                onChange={FromDateOnchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.ToDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ToDate'
                                                value={values.ToDate}
                                                onChange={ToDateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </div>

                            <div className="row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.RouteName} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="RouteName"
                                                value={values.RouteName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={RouteName_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">{/*Supplier Name */}
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.VehicleNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="VehicleNumber"
                                                value={values.VehicleNumber}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={VehicleNumber_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                        </Col>
                                        <Col sm="1" className="mx-4 ">{/*Go_Button  */}
                                            < Go_Button onClick={(e) => goButtonHandler()} />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </div>
                        </div>

                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={Data}
                                    columns={pagesListColumns}

                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <div className="table">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    bordered={true}
                                                    striped={false}
                                                    selectRow={selectAllCheck()}
                                                    noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {countlabelFunc(toolkitProps, paginationProps, dispatch, "MRP")}
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }

                        </PaginationProvider>
                        {
                            Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={saveHandeller}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                            module={"LoadingSheet"}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default LoadingSheet
