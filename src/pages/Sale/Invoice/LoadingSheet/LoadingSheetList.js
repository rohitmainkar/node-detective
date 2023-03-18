import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import {
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import * as pageId from "../../../../routes//allPageID";
import { MetaTags } from "react-meta-tags";
import LoadingSheet from "./LoadingSheet";
import { LoadingSheetListAction, LoadingSheetlistfilter, LoadingSheetlistfilters } from "../../../../store/Sales/LoadingSheetRedux/action";
import { LoadingSheet_API, MultipleInvoice_API } from "../../../../helpers/backend_helper";
import * as report from '../../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../../store/Utilites/PdfReport/actions";
import Flatpickr from "react-flatpickr";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { currentDate, loginPartyID } from "../../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList";
import * as url from "../../../../routes/route_url"
import * as mode from "../../../../routes/PageMode"

import { useHistory } from "react-router-dom";

const LoadingSheetList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [headerFilters, setHeaderFilters] = useState('');
 
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const reducers = useSelector(
        (state) => ({
            tableList: state.LoadingSheetReducer.LoadingSheetlist,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            bomlistFilters: state.BOMReducer.bomlistFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { fromdate = currentDate, todate = currentDate } = headerFilters;

    const { userAccess, pageField, LoadingSheetlistfilters } = reducers;
    // const { fromdate, todate } = LoadingSheetlistfilters;


    // const page_Id = pageId.LOADING_SHEET_LIST

    const action = {
        // getList: LoadingSheetListAction,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false
        let newBtnPath = ''

        if (subPageMode === url.LOADING_SHEET_LIST) {
            page_Id = pageId.LOADING_SHEET;
            masterPath = url.LOADING_SHEET;
            newBtnPath = url.LOADING_SHEET;
            page_Mode = mode.modeSTPList
            makeBtnShow = true;
        }
        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        // dispatch(LoadingSheetListAction())
    }, []);

    function goButtonHandler() {
         
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyID: loginPartyID(),
        });
        dispatch(LoadingSheetListAction(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...LoadingSheetlistfilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...LoadingSheetlistfilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    function downBtnFunc(row) {
        var ReportType = report.VanLoadingPartyWiseInvoice;
        dispatch(getpdfReportdata(LoadingSheet_API, ReportType, row.id))
    }


    function downBtnFunc(row) {
        var ReportType = report.invoiceA5;
        dispatch(getpdfReportdata(MultipleInvoice_API, ReportType, row.id))
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="5" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name='fromdate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            value={fromdate}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="5" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "65px" }}>To Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            nane='todate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            value={todate}
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={todateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="2" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={() => goButtonHandler()}
                                >Go</Button>
                            </Col>
                        </div>

                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            pageMode={pageMode}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={"LoadingSheet"}
                            deleteName={"FullGRNNumber"}
                            MasterModal={LoadingSheet}
                        />

                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default LoadingSheetList;