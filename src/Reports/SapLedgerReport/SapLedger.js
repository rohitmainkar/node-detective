
import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { mode, pageId } from "../../routes/index"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import * as _cfunc from "../../components/Common/CommonFunction";
import { C_DatePicker } from "../../CustomValidateForm";
import { commonPageField } from "../../store/actions";
import { SapLedger_Go_Button_API, SapLedger_Go_Button_API_Success } from "../../store/Report/SapLedger Redux/action";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { damageStockReport_GoButton_API_Success } from "../../store/Report/DamageStockReportRedux/action";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";

const SapLedger = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();
    const userAdminRole = _cfunc.loginUserAdminRole();

    const [userPageAccessState, setUserAccState] = useState('');
    const [headerFilters, setHeaderFilters] = useState('');

    const {
        userAccess,
        List,
        goBtnLoading,
        partyList,
        pageField
    } = useSelector((state) => ({
        goBtnLoading: state.SapLedgerReducer.goBtnLoading,
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
        List: state.SapLedgerReducer.goBtnSapLedger,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { data = [], Data = [] } = List
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.SAP_LEDGER))
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(damageStockReport_GoButton_API_Success([]));
        }
    }, [])

    const [tableColumns] = DynamicColumnHook({ pageField })

    const rowStyle = (row, rowIndex) => {

        const style = {};
        if (row.id > 0) {

        } else {
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
        }
        return style;
    };

    useEffect(() => {
        dispatch(SapLedger_Go_Button_API_Success([]))
        const page_Id = pageId.SAP_LEDGER
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

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
        dispatch(BreadcrumbShowCountlabel(`${"Count"} :${Number(data.length > 0 && data.length - 1)}`))
    }, [List])

    const PartyDropdown = partyList.map((data) => ({
        value: data.id,
        label: data.Name,
        SAPPartyCode: data.SAPPartyCode
    }))

    const PartyDropdownOptions = [...PartyDropdown.filter((index) => !(index.SAPPartyCode === null))];

    let partdata = localStorage.getItem("roleId")
    var partyDivisiondata = JSON.parse(partdata);

    const SelectedPartyDropdown = () => {//+++++++++++++++++++++ Session common party dropdown id +++++++++++++++++++++++++++++++
        try {
            return JSON.parse(localStorage.getItem("selectedParty"));
        } catch (e) {
            _cfunc.CommonConsole(e);
        }
        return 0;
    };

    function goButtonHandler() {
        try {

            if ((userAdminRole) && (SelectedPartyDropdown().value === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;

            }
            const jsonBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                SAPCode: (userAdminRole) ? SelectedPartyDropdown().SAPPartyCode : partyDivisiondata.SAPPartyCode
            });
            dispatch(SapLedger_Go_Button_API_Success([]))
            dispatch(SapLedger_Go_Button_API(jsonBody));
        }
        catch (e) {
            _cfunc.CommonConsole(e);
        }

    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        dispatch(SapLedger_Go_Button_API_Success([]))
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
        dispatch(SapLedger_Go_Button_API_Success([]))
    }

    function partySelectOnChangeHandler() {
        dispatch(SapLedger_Go_Button_API_Success([]))
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <PartyDropdown_Common
                        changeButtonHandler={partySelectOnChangeHandler}
                        SAPLedgerOptions={PartyDropdownOptions} />

                    <div className="px-2  c_card_filter text-black " >
                        <div className="row">
                            <div className=" row">
                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "83px" }}>From Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='fromdate'
                                                value={fromdate}
                                                onChange={fromdateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "65px" }}>To Date</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                nane='todate'
                                                value={todate}
                                                onChange={todateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="1" className="mt-2 ">
                                    <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />
                                </Col>

                                {/* <Col sm={1} className="mt-2" >
                                    <C_Button
                                        type="button"
                                        spinnerColor="white"
                                        // loading={btnMode === 1 && true}
                                        className="btn btn-success"
                                        onClick={(e) => goButtonHandler(e, 1)}
                                    >
                                        Show
                                    </C_Button>

                                </Col>

                                <Col sm={2} className="mt-2 ">
                                    <C_Button
                                        type="button"
                                        spinnerColor="white"
                                        // loading={btnMode === 2 && true}
                                        className="btn btn-primary"
                                        onClick={(e) => goButtonHandler(e, 2)}
                                    >
                                        Excel Download
                                    </C_Button>
                                </Col> */}

                            </div>

                        </div>
                    </div>
                    <ToolkitProvider
                        keyField="id"
                        data={data}
                        columns={tableColumns}
                        search
                    >
                        {toolkitProps => (
                            <React.Fragment>
                                <Row>
                                    <Col sm={9}>
                                        <Label className="col-sm-6 mt-1 p-1 text-black"
                                            style={{ width: "270px", background: "#efefef", borderRadius: "5px" }}>Opening Balance:  {Data.OpeingBal}
                                        </Label>
                                    </Col>
                                    <Col sm={3}>

                                        <Label className="col-sm-6 mt-1 p-1 text-black"
                                            style={{ width: "257px", background: "#efefef", borderRadius: "5px" }}>Closing Balance: {Data.ClosingBal}
                                        </Label>
                                    </Col>

                                </Row>

                                <div className="table-responsive" id="TableDiv" >
                                    <BootstrapTable
                                        keyField={"id"}
                                        bordered={true}
                                        striped={false}
                                        rowStyle={rowStyle}
                                        // selectRow={selectAllCheck(rowSelected())}
                                        noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                        classes={"table align-middle table-nowrap table-hover"}
                                        headerWrapperClasses={"thead-light"}

                                        {...toolkitProps.baseProps}

                                    />
                                    {mySearchProps(toolkitProps.searchProps)}
                                </div>
                                {/* <div >Closing Balance :<Label className="col-sm-5"
                                    style={{ width: "65px" }}>{List.ClosingBal}</Label></div> */}

                            </React.Fragment>
                        )
                        }
                    </ToolkitProvider>


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

export default SapLedger;




