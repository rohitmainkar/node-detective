import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    deleteDemandId,
    deleteDemandIdSuccess,
    editDemandId,
    postDemandListPage,
    updateDemandIdSuccess,
    demandlistfilters,
    postDivision,
    postGoButtonForDemand,
    postGoButtonForDemandSuccess,
} from "../../../store/Inter Branch/DemandRedux/action";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import Demand from "./Demand";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { MetaTags } from "react-meta-tags";
import { initialFiledFunc } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";



const DemandList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(url.DEMAND_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [demanddate, setdemanddate] = useState(currentDate)


    const reducers = useSelector(
        (state) => ({

            division:state.DemandReducer.division,
            tableList: state.DemandReducer.demandList,
            deleteMsg: state.DemandReducer.deleteMsg,
            updateMsg: state.DemandReducer.updateMsg,
            postMsg: state.DemandReducer.postMsg,
            editData: state.DemandReducer.editData,
            demandlistFilter: state.DemandReducer.demandlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            GoButton:state.DemandReducer.GoButton,
        })
    );

    const { userAccess, pageField, division, tableList, demandlistFilter } = reducers;
    const { fromdate, todate, divisionSelect } = demandlistFilter;
    const page_Id = (pageId.DEMAND_LIST);

    const fileds = {

        Date: currentDate,
        Division: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const values = { ...state.values }

    const action = {
        getList: postDemandListPage,
        deleteId: deleteDemandId,
        postSucc: postMessage,
        updateSucc: updateDemandIdSuccess,
        deleteSucc: deleteDemandIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Demand Count"} :0`))

    }, []);

    const divisiondropdown_Options = division.map((i) => ({ label: i.Name, value: i.id }))


    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])



    useEffect(() => {

        const jsonBody = JSON.stringify({
            Company: userCompany(),
            Party: userParty()
        });
        dispatch(postDivision(jsonBody));
    }, []);


    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])


    function editBodyfunc(rowData) {

        const jsonBody = JSON.stringify({
            Party: rowData.SupplierID,
            Customer: rowData.CustomerID,
            EffectiveDate: rowData.preDemandDate,
            OrderID: rowData.id
        })
        var Mode = "edit"
        dispatch(editDemandId(jsonBody, Mode));
    }



    // useEffect(() => {
     
    //     const jsonBody = JSON.stringify({

    //             FromDate:currentDate,
    //             ToDate:currentDate,
    //             Customer: userParty(),
    //             Supplier: values.Division.value,
            
    //     });
    //     dispatch(postDemandListPage(jsonBody));
    // }, []);


    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            Supplier: values.Division.value,
            Customer: userParty(),
            EffectiveDate: demanddate,
            DemandID: 0
        })

        dispatch(postDemandListPage(jsonBody))
    };

    function FromdateOnchange(e, date) {
        let newObj = { ...demandlistFilter }
        newObj.fromdate = date
        dispatch(demandlistfilters(newObj))
    }

    function TodateOnchange(e, date) {
        let newObj = { ...demandlistFilter }
        newObj.todate = date
        dispatch(demandlistfilters(newObj))
    }

    function divisionOnchange(e) {
        let newObj = { ...demandlistFilter }
        newObj.divisionSelect = e
        dispatch(demandlistfilters(newObj))
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {/* <BreadcrumbNew userAccess={userAccess} pageId={page_Id} /> */}

            <div className="page-content">
                {/* <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === url.ORDER_lIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} /> */}

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "110px" }}>Demand Date</Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name='fromdate'
                                        value={demandlistFilter.fromdate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={FromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "110px" }}>Delivery Date </Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name="todate"
                                        value={demandlistFilter.todate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={TodateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="4">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"

                                    style={{ width: "80px" }}>Division</Label>
                                <Col sm="6">
                                    <Select
                                        classNamePrefix="select2-Customer"
                                        value={divisionSelect}
                                        options={divisiondropdown_Options}
                                        onChange={divisionOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="1" className="mx-4 ">
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
                            MasterModal={Demand}
                            masterPath={url.DEMAND}
                            ButtonMsgLable={"Demand"}
                            pageMode={pageMode}
                            makeBtnShow={pageMode === url.DEMAND_LIST ? false : true}
                            goButnFunc={goButtonHandler}
                            editBodyfunc={editBodyfunc}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default DemandList;