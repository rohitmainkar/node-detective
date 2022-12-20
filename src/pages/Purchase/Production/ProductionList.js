import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbFilterSize, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { PRODUCTION_LIST, PRODUCTION_MASTER, WORK_ORDER, WORK_ORDER_LIST } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { updateBOMListSuccess } from "../../../store/Purchase/BOMRedux/action";
import { deleteWorkOrderId, deleteWorkOrderIdSuccess, editWorkOrderList, getWorkOrderListPage, updateWorkOrderListSuccess } from "../../../store/Purchase/WorkOrder/action";
import ProductionMaster from "./ProductionMaster";
// import BOMMaster from "../BOMMaster/BOMIndex";

const ProductionList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(PRODUCTION_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();
    const reducers = useSelector(
        (state) => ({
            tableList: state.ProductionReducer.ProductionList,
            deleteMsg: state.WorkOrderReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.WorkOrderReducer.editData,
            productionFilter: state.ProductionReducer.productionFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            
        })
    );

    const action = {
        getList: getWorkOrderListPage,
        editId: editWorkOrderList,
        deleteId: deleteWorkOrderId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: deleteWorkOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        dispatch(BreadcrumbFilterSize(`${"Work Order Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(78))
        goButtonHandler(true)
    }, []);

    const { userAccess, pageField, tableList } = reducers;
    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])
    useEffect(() => {
        const pageId = 78
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])
    const goButtonHandler = (onload = false) => {
        debugger
        let FromDate
        let ToDate
        if (onload) {
            FromDate = currentDate;
            ToDate = currentDate;
        } else {
            ToDate = todate;
            FromDate = fromdate;
        }
        const jsonBody = JSON.stringify({
            
            FromDate: FromDate,
            ToDate: ToDate,
        });
        debugger
        dispatch(getWorkOrderListPage(jsonBody));
        console.log("go button post json", jsonBody)
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} />
                <div className="px-2 mt-n1  c_card_header" style={{ marginBottom: "-12px" }} >
                    <div className="mt-1  row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name='fromdate'
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setFromdate(date) }}
                                        onReady={(e, date) => { setFromdate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="5">
                            <FormGroup className=" mb-1 row mt-3 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "65px", marginRight: "0.4cm" }}>To Date</Label>
                                <Col sm="6 ">
                                    <Flatpickr
                                        name="todate"
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setTodate(date) }}
                                        onReady={(e, date) => { setTodate(date) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="1"className="mx-4 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                                onClick={() => goButtonHandler()}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={ProductionMaster}
                            masterPath={PRODUCTION_MASTER}
                            ButtonMsgLable={"Work Order"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}
export default ProductionList;