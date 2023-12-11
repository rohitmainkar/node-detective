import React, { useEffect, useMemo } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import { breadcrumbReturnFunc, loginUserDetails, metaTagLabel } from '../../components/Common/CommonFunction';
import * as pageId from "../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getGroupList, getGroupListSuccess, getSubGroupList, getSubGroupListSuccess, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { getExcel_Button_API, getExcel_Button_API_Success } from '../../store/Report/SapLedger Redux/action';
import { useState } from 'react';
import { ReportComponent } from '../ReportComponent';
import { url } from '../../routes';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { mySearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Button } from '../../components/Common/CommonButton';
import { C_Select } from '../../CustomValidateForm';
import { getPartyTypelist } from '../../store/Administrator/PartyTypeRedux/action';
import { priceListByPartyAction, priceListByPartyActionSuccess } from '../../store/Administrator/PriceList/action';
import { getPartyTypelistSuccess } from '../../store/Administrator/PartyTypeRedux/action';
import { Items_On_Group_And_Subgroup_API, Items_On_Group_And_Subgroup_API_Success } from '../../store/Report/ItemSaleReport/action';

function initialState(history) {

    let page_Id = '';
    let buttonLable = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PRODUCT_MARGIN_REPORT) {
        page_Id = pageId.PRODUCT_MARGIN_REPORT;
        buttonLable = "ProductMarginReport"
    }
    return { page_Id, buttonLable }
};

const ProductMarginReport = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const [userPageAccessState, setUserAccState] = useState('');

    const [page_Id] = useState(() => initialState(history).page_Id);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState("");
    const [columns, setcolumn] = useState([{}]);
    const [columnsCreated, setColumnsCreated] = useState(false)

    const [partyTypeSelect, setPartyTypeSelect] = useState({ value: 0, label: "All" });
    const [priceListSelect, setPriceListSelect] = useState({ value: 0, label: "All" });
    const [itemNameSelect, setItemNameSelect] = useState([{ value: 0, label: "All" }]);
    const [groupSelect, setGroupSelect] = useState([{ value: 0, label: "All" }]);
    const [subGroupSelect, setSubGroupSelect] = useState([{ value: 0, label: "All" }]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        ProductMargin,
        userAccess,
        downloadProductMargin,
        pageField,
        PartyTypeLoading,
        PartyType,
        PriceList,
        ItemDropdownloading,
        ItemNameList,
        productLoading,
        productDropdown,
        subProductLoading,
        subProductDropdown,
        getSubProductbyProduct,
        priceListDropDownLoading
    } = useSelector((state) => ({

        downloadProductMargin: state.SapLedgerReducer.downloadProductMargin,
        ProductMargin: state.SapLedgerReducer.ProductMargin,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,

        PartyTypeLoading: state.PartyTypeReducer.goBtnLoading,
        PartyType: state.PartyTypeReducer.ListData,

        priceListDropDownLoading: state.PriceListReducer.priceListDropDownLoading,
        PriceList: state.PriceListReducer.priceListByPartyType,

        ItemDropdownloading: state.ItemSaleReportReducer.itemListLoading,
        ItemNameList: state.ItemSaleReportReducer.itemList,

        productLoading: state.GroupReducer.goBtnLoading,
        productDropdown: state.GroupReducer.groupList,

        subProductLoading: (state.SubGroupReducer.goBtnLoading || state.ItemMastersReducer.subgroupDropDownLoading),
        subProductDropdown: state.SubGroupReducer.SubgroupList,
        getSubProductbyProduct: state.ItemMastersReducer.SubGroupList,
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyTypelist());
        dispatch(getGroupList());
        dispatch(getSubGroupList());
        dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));

        return () => {
            dispatch(getExcel_Button_API_Success([]));
            dispatch(getPartyTypelistSuccess([]));
            dispatch(priceListByPartyActionSuccess([]));
            dispatch(getGroupListSuccess([]));
            dispatch(getSubGroupListSuccess([]));
            dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        }
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if ((ProductMargin.length > 0)) {
            let columns = []
            const objectAtIndex0 = ((ProductMargin[0]));
            for (const key in objectAtIndex0) {
                const column = {
                    text: key,
                    dataField: key,
                    sort: true,
                    classes: "table-cursor-pointer",
                };
                columns.push(column);
            }
            setcolumn(columns)
            setColumnsCreated(true)
        }
    }, [columnsCreated, ProductMargin]);

    useEffect(() => {

        if ((ProductMargin.length > 0)) {

            if (btnMode === "showOnTable") {
                setTableData(ProductMargin)
            } else if (btnMode === "downloadExcel") {

                ReportComponent({  // Download CSV
                    excelData: ProductMargin,
                    excelFileName: "Product Margin Report"
                })
            }
            dispatch(getExcel_Button_API_Success([]));   // Reset Excel Data
        }
    }, [ProductMargin, pageField]);

    function GobtnExcelhandler(Type) {

        setBtnMode(Type)
        const userDetails = loginUserDetails();

        const jsonBody = JSON.stringify({
            "IsSCM": (userDetails.IsSCMPartyType).toString(),
            "Party": 3,
            "PartyType": partyTypeSelect.value,
            "PriceList": priceListSelect.value,
            "Group": groupSelect[0].value === 0 ? "" : groupSelect.map(i => i.value).join(','),
            "SubGroup": subGroupSelect[0].value === 0 ? "" : subGroupSelect.map(i => i.value).join(','),
            "Item": itemNameSelect[0].value === 0 ? "" : itemNameSelect.map(i => i.value).join(',')
        });
        dispatch(getExcel_Button_API({ jsonBody }))
    }

    const partyTypeOptions = PartyType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    partyTypeOptions.unshift({
        value: 0,
        label: " All"
    });

    const priceListOptions = PriceList.map((i) => ({
        value: i.value,
        label: i.label,
    }));

    priceListOptions.unshift({
        value: 0,
        label: " All"
    });

    const subProductDropdownOptions = useMemo(() => {
        let options = [];
        if (groupSelect[0].value === 0) {
            options = subProductDropdown.map((i) => ({
                value: i.id,
                label: i.Name,
            }));
        } else {
            options = getSubProductbyProduct.map((i) => ({
                value: i.id,
                label: i.Name,
            }));
        }
        return options;
    }, [groupSelect, subProductDropdown, getSubProductbyProduct]);

    const generateOptions1 = (
        sourceArray,
        labelField = "Name",
        valueField = "id"
    ) => [
            ...sourceArray.map((item) => ({
                value: item[valueField],
                label: item[labelField],
            })),
        ];

    const itemNameDropdownOptions = useMemo(
        () => generateOptions1(ItemNameList),
        [ItemNameList]
    );

    const productDropdownOptions = useMemo(
        () => generateOptions1(productDropdown),
        [productDropdown]
    );

    function PartyTypeOnchange(e) {
        setPartyTypeSelect(e);
        setPriceListSelect({ value: 0, label: "All" });
        dispatch(getExcel_Button_API_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // setColumnsCreated(false);
        dispatch(priceListByPartyAction(e.value))
    }

    function PriceListOnChange(e) {
        setPriceListSelect(e);
        dispatch(getExcel_Button_API_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // setColumnsCreated(false);
    }

    function GroupOnchange(e = []) {
        dispatch(getExcel_Button_API_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // setColumnsCreated(false);
        dispatch(getSubGroupListSuccess([]));
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        setSubGroupSelect([{ value: 0, label: "All" }]);
        setItemNameSelect([{ value: 0, label: "All" }]);

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }];
            dispatch(getGroupList());
            dispatch(getSubGroupList());
            dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
        } else {
            e = e.filter((i) => i.value > 0);
            if (e.length === 1) {
                dispatch(get_Sub_Group_By_Group_ForDropDown(e[0].value));
                dispatch(
                    Items_On_Group_And_Subgroup_API({ Group: e[0].value, SubGroup: 0 })
                );
            } else {
                dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
                dispatch(Items_On_Group_And_Subgroup_API_Success([]));
                setSubGroupSelect([{ value: 0, label: "All" }]);
                setItemNameSelect([{ value: 0, label: "All" }]);
            }
        }
        setGroupSelect(e);
    }

    function Sub_GroupOnChange(e = []) {
        dispatch(getExcel_Button_API_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // setColumnsCreated(false);
        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        setItemNameSelect([{ value: 0, label: "All" }]);

        if (e.length === 0) {
            e = [{ value: 0, label: "All" }];
            dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
            setItemNameSelect([{ value: 0, label: "All" }]);
        } else {
            e = e.filter((i) => i.value > 0);
            if (e.length === 1) {
                dispatch(
                    Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: e[0].value })
                );
            } else {
                dispatch(Items_On_Group_And_Subgroup_API_Success([]));
                setItemNameSelect([{ value: 0, label: "All" }]);
            }
        }
        setSubGroupSelect(e);
    }

    function ItemOnChange(e = []) {
        dispatch(getExcel_Button_API_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // setColumnsCreated(false);
        if (e.length === 0) {
            e = [{ value: 0, label: "All" }];
        } else {
            e = e.filter((i) => i.value > 0);
        }
        setItemNameSelect(e);
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <div className="px-2 c_card_filter text-black" >

                    <Row className="mb-1 row ">
                        <Col sm="3 mt-1" >
                            <FormGroup>
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2">
                                        Party Type
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            value={partyTypeSelect}
                                            isLoading={PartyTypeLoading}
                                            onChange={(e) => {
                                                PartyTypeOnchange(e)

                                            }}
                                            options={partyTypeOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1"></Col>
                        <Col sm="3 mt-1" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        PriceList
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            value={priceListSelect}
                                            isLoading={priceListDropDownLoading}
                                            onChange={(e) => { PriceListOnChange(e) }}
                                            options={priceListOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="4 mt-1" ></Col>

                        <Col sm="1" className="mt-2 mb-1 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadProductMargin && btnMode === "showOnTable") && true}
                                className="btn btn-success"
                                onClick={() => GobtnExcelhandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                        </Col>
                    </Row>

                    <Row className="mb-1  row ">
                        <Col sm="3" >
                            <FormGroup>
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2">
                                        Group
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={productLoading}
                                            isMulti={true}
                                            value={groupSelect}
                                            onChange={GroupOnchange}
                                            options={productDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col sm="1"></Col>

                        <Col sm="3" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        Sub Group
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={subProductLoading}
                                            isMulti={true}
                                            value={subGroupSelect}
                                            onChange={Sub_GroupOnChange}
                                            options={subProductDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1"></Col>
                        <Col sm="3" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        ItemName
                                    </Label>
                                    <Col sm="7">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={ItemDropdownloading}
                                            isMulti={true}
                                            value={itemNameSelect}
                                            onChange={ItemOnChange}
                                            options={itemNameDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1" className="mt-2 mb-1 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadProductMargin && btnMode === "downloadExcel") && true}
                                className="btn btn-primary"
                                onClick={() => GobtnExcelhandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div >

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="FE2ItemID"
                        data={tableData}
                        columns={columns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="FE2ItemID"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>

            </div>
        </React.Fragment>
    );
}

export default ProductMarginReport;