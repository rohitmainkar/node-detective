import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import Order from "../Order/Order";
import { GST_ADD_Mode_2, ORDER, ORDER_lIST } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import PurchaseListPage from "../../../components/Common/CmponentRelatedCommonFile/purchase";
import {
    deleteGRNId,
    deleteGRNIdSuccess,
    editGRNId, getGRNListPage,
    updateGRNIdSuccess
} from "../../../store/Purchase/GRNRedux/actions";
import { goButton } from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";


const GRNList = () => {

    const dispatch = useDispatch();
    const [supplierSelect, setsupplierSelect] = useState({ value: '' });



    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.supplier,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { pageField, supplier } = reducers;
    const action = {
        getList: getGRNListPage,
        editId: editGRNId,
        deleteId: deleteGRNId,
        postSucc: postMessage,
        updateSucc: updateGRNIdSuccess,
        deleteSucc: deleteGRNIdSuccess
    }


    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(56))
        dispatch(getSupplier())
        goButtonHandler();
    }, []);

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const goButtonHandler = () => {
        debugger
        let supplier = supplierSelect.value;
        let todate;
        let fromdate;
        let party;

        try {
            todate = document.getElementById("todate").value
            fromdate = document.getElementById("fromdate").value;
            party = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
            return
        }
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: supplier,
            Party: party,
        }
        );
        dispatch(getGRNListPage(jsonBody));
    }




    return (

        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={"GRN List"}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    pageMode={"GRNMode2"}
                    newBtnPagePath={GST_ADD_Mode_2}
                    excelData={"downList"} />

                <div className="px-2 mb-1 mt-n1" style={{ backgroundColor: "#dddddd" }} >
                    <div className=" mt-1 row">
                        <Col md="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "100px" }}>From Date</Label>
                                <Col md="7">
                                    <Flatpickr
                                        id="fromdate"
                                        name="fromdate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "today"

                                        }}
                                    // onChange={(e, date) => { setpoDate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "100px" }}>To Date</Label>
                                <Col md="7">
                                    <Flatpickr
                                        id="todate"
                                        name="todate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "today"
                                        }}
                                    // onChange={(e, date) => { setpoDate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "130px" }}>Supplier Name</Label>
                                <Col md="7">
                                    <Select
                                        // value={"supplier"}
                                        classNamePrefix="select2-Customer"
                                        // isDisabled={"pageMode" === "edit" ? true : false}
                                        options={supplierOptions}
                                        onChange={(e) => { setsupplierSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col md="1" className="mt-3 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                onClick={goButtonHandler}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            showBreadcrumb={false}
                            reducers={reducers}
                            MasterModal={Order}
                            masterPath={ORDER}
                            ButtonMsgLable={"GRN"}
                            deleteName={"CreatedBy"}
                            pageMode={"List"}

                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default GRNList;