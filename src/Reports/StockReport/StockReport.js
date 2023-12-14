// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Col, FormGroup, Input, Label, Row } from "reactstrap";
// import { useHistory } from "react-router-dom";
// import { C_Button } from "../../components/Common/CommonButton";
// import { C_DatePicker } from "../../CustomValidateForm";
// import * as _cfunc from "../../components/Common/CommonFunction";
// import { MetaTags } from "react-meta-tags";
// import Select from "react-select";
// import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
// import C_Report from "../../components/Common/C_Report";
// import { customAlert } from "../../CustomAlert/ConfirmDialog";
// import { mode, pageId } from "../../routes/index"
// import { stockReport_GoButton_API, stockReport_GoButton_API_Success } from "../../store/Report/StockReport/action";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
// import { ExcelDownloadFunc } from "./ExcelDownloadFunc";

// const StockReport = (props) => {

// 	const dispatch = useDispatch();
// 	const history = useHistory();
// 	const currentDate_ymd = _cfunc.date_ymd_func();
// 	const isSCMParty = _cfunc.loginIsSCMParty();

// 	const [headerFilters, setHeaderFilters] = useState('');
// 	const [userPageAccessState, setUserAccState] = useState('');

// 	const [partyDropdown, setPartyDropdown] = useState("");
// 	const [unitDropdown, setUnitDropdown] = useState({ value: 1, label: 'No' });

// 	const [originalTableData, setOriginalTableData] = useState([]);
// 	const [stockTypeSelect, setStockTypeSelect] = useState({ value: "", label: 'All' });

// 	const [batchWise, setBatchWise] = useState(false);
// 	const [mrpWise, setMrpWise] = useState(false);
// 	const [tableData, setTableData] = useState([]);
// 	const [selectedColumns, setSelectedColumns] = useState([
// 		{
// 			text: "ItemName",
// 			dataField: "ItemName",
// 			sort: true
// 		},
// 		{
// 			text: "Quantity",
// 			dataField: "ActualQty",
// 			align: "right",
// 			sort: true
// 		},
// 		{
// 			text: "Unit",
// 			dataField: "Unit",
// 			sort: true
// 		},
// 		{
// 			text: "Amount",
// 			dataField: "Amount",
// 			align: "right",
// 			sort: true
// 		},
// 	]);

// 	const reducers = useSelector(
// 		(state) => ({
// 			goButtonData: state.StockReportReducer.StockReportGobtn,
// 			BaseUnit: state.ItemMastersReducer.BaseUnit,
// 			SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdown,
// 			GoBtnLoading: state.StockReportReducer.GoBtnLoading,
// 			ExcelBtnLoading: state.StockReportReducer.ExcelBtnLoading,
// 			userAccess: state.Login.RoleAccessUpdateData,
// 			pageField: state.CommonPageFieldReducer.pageField
// 		})
// 	);

// 	const { userAccess, BaseUnit, SSDD_List, pageField, goButtonData = [], GoBtnLoading, ExcelBtnLoading } = reducers;
// 	const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

// 	// Featch Modules List data First Rendering
// 	const location = { ...history.location }
// 	const hasShowModal = props.hasOwnProperty(mode.editValue)

// 	// userAccess useEffect
// 	useEffect(() => {
// 		let userAcc = null;
// 		let locationPath = location.pathname;
// 		if (hasShowModal) {
// 			locationPath = props.masterPath;
// 		};
// 		userAcc = userAccess.find((inx) => {
// 			return (`/${inx.ActualPagePath}` === locationPath)
// 		})
// 		if (userAcc) {
// 			setUserAccState(userAcc)
// 			_cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
// 		};
// 	}, [userAccess])

// 	useEffect(() => {

// 		dispatch(getBaseUnit_ForDropDown());
// 		dispatch(commonPageFieldSuccess(null));
// 		dispatch(commonPageField(pageId.STOCK_REPORT));
// 		dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
// 		return () => {
// 			dispatch(commonPageFieldSuccess(null));
// 			dispatch(stockReport_GoButton_API_Success([]));
// 			dispatch(getBaseUnit_ForDropDownSuccess([]));
// 		}
// 	}, [])

// 	useEffect(() => {
// 		try {
// 			let nextId = 1;
// 			let updatedReduxData = [];
// 			if (goButtonData.Status === true && goButtonData.StatusCode === 200) {
// 				const { goBtnMode } = goButtonData;
// 				updatedReduxData = goButtonData.Data.map((obj) => {
// 					return { ...obj, ID: nextId++ };
// 				});

// 				if (goBtnMode === "downloadExcel") {
// 					const { filterTableData } = SortButtonFunc(updatedReduxData);
// 					ExcelDownloadFunc({
// 						pageField,
// 						excelData: filterTableData,
// 						excelFileName: "Current_Stock_Report",
// 						mrpWise: mrpWise,
// 						batchWise: batchWise
// 					});
// 				}
// 				else if (goBtnMode === "showOnTable") {
// 					const { filterTableData } = SortButtonFunc(updatedReduxData)
// 					setTableData(filterTableData)
// 				}

// 			} else if (goButtonData.Status === true) {
// 				updatedReduxData = [];
// 			}

// 			setOriginalTableData(updatedReduxData);

// 		} catch (e) { }
// 	}, [goButtonData]);

// 	useEffect(() => {

// 		const { filterTableData } = SortButtonFunc(originalTableData)
// 		setTableData(filterTableData)

// 	}, [mrpWise, batchWise, originalTableData])

// 	const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
// 		.map(data => ({
// 			value: data.id,
// 			label: data.Name
// 		}));

// 	const Party_Option = SSDD_List.map(i => ({
// 		value: i.id,
// 		label: i.Name
// 	}));

// 	const StockTypeOptions = [
// 		{
// 			value: "",
// 			label: "All"
// 		},

// 		{
// 			value: 0,
// 			label: "Saleable Stock"
// 		},
// 		{
// 			value: 1,
// 			label: "Damage Stock"
// 		}]

// 	function goButtonHandler(goBtnMode) {

// 		try {
// 			if ((isSCMParty) && (partyDropdown === "")) {
// 				customAlert({ Type: 3, Message: "Please Select Party" });
// 				return;
// 			}

// 			const jsonBody = JSON.stringify({
// 				"FromDate": fromdate,
// 				"ToDate": todate,
// 				"Unit": unitDropdown.value,
// 				"PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
// 				"IsDamagePieces": stockTypeSelect.value
// 			});
// 			const config = { jsonBody, btnId: goBtnMode, };
// 			dispatch(stockReport_GoButton_API(config))

// 		} catch (error) { _cfunc.CommonConsole(error) }
// 	}

// 	function fromdateOnchange(e, date) {
// 		let newObj = { ...headerFilters }
// 		newObj.fromdate = date
// 		setHeaderFilters(newObj)
// 	}

// 	function todateOnchange(e, date) {
// 		let newObj = { ...headerFilters }
// 		newObj.todate = date
// 		setHeaderFilters(newObj)
// 	}

// 	function SortButtonFunc(baseData) {

// 		// Define an array of field names and their corresponding checkbox and select states
// 		const buttonStateArray = [
// 			{
// 				text: 'DistributorCode',
// 				dataField: 'DistributorCode',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'DistributorName',
// 				dataField: 'DistributorName',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},

// 			{
// 				text: 'Productcode',
// 				dataField: 'Item',
// 				showing: ['', 0, 1].includes(stockTypeSelect.value),
// 				groupBy: true,
// 				sequence: 1
// 			},
// 			{
// 				text: 'Item',
// 				dataField: 'ItemName',
// 				showing: ['', 0, 1].includes(stockTypeSelect.value),
// 				groupBy: true,
// 				sequence: 1
// 			}, {
// 				text: 'Product',
// 				dataField: 'GroupName',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			}, {
// 				text: 'SubProduct',
// 				dataField: 'SubGroupName',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			}, {
// 				text: 'ProductType',
// 				dataField: 'GroupTypeName',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'BatchCode',
// 				dataField: 'BatchCode',
// 				showing: batchWise,
// 				groupBy: batchWise,
// 				sequence: 2
// 			},
// 			{
// 				text: 'MRP',
// 				dataField: 'MRP',
// 				align: "right",
// 				showing: mrpWise,
// 				groupBy: mrpWise,
// 				sequence: 3
// 			},

// 			{
// 				text: 'PurchaseRate',
// 				dataField: 'PurchaseRate',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},

// 			{
// 				text: 'SaleableStock',
// 				dataField: 'SaleableStock',
// 				align: "right",
// 				showing: ['', 0].includes(stockTypeSelect.value),
// 				groupBy: false,
// 				sequence: 4
// 			},
// 			{
// 				text: 'UnSaleableStock',
// 				dataField: 'UnSaleableStock',
// 				showing: ['', 1].includes(stockTypeSelect.value),
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'SaleableStockValue',
// 				dataField: 'SaleableStockValue',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},

// 			{
// 				text: 'SaleableStockTaxValue',
// 				dataField: 'SaleableStockTaxValue',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			}, {
// 				text: 'UnSaleableStockValue',
// 				dataField: 'UnSaleableStockValue',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'UnSaleableStockTaxValue',
// 				dataField: 'UnSaleableStockTaxValue',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'TotalStockValue',
// 				dataField: 'TotalStockValue',
// 				showing: ['', 0, 1].includes(stockTypeSelect.value),
// 				groupBy: true,
// 				sequence: 5
// 			},

// 			{
// 				text: 'TaxValue',
// 				dataField: 'TaxValue',
// 				groupBy: true,
// 				sequence: 5
// 			},
// 			{
// 				text: 'Stockvaluewithtax',
// 				dataField: 'Stockvaluewithtax',
// 				showing: stockTypeSelect.value === "",
// 				groupBy: true,
// 				sequence: 5
// 			},

// 			{
// 				text: 'Unit',
// 				dataField: 'Unit',
// 				showing: true,
// 				groupBy: true,
// 				sequence: 5
// 			},



// 		];

// 		let filterTableData = [...baseData];
// 		const newSelectedColumns = buttonStateArray.filter(option => option.showing)

// 		setSelectedColumns(newSelectedColumns);

// 		// Apply grouping and filtering logic for each checkbox option
// 		if (buttonStateArray.some(option => option.groupBy)) {
// 			const groupedData = {};

// 			filterTableData.forEach(item => {
// 				
// 				const groupValues = buttonStateArray
// 					.filter(option => option.groupBy)
// 					.map(option => item[option.text]);

// 				const groupKey = groupValues.join('-');
// 				if (!groupedData[groupKey]) {
// 					groupedData[groupKey] = {
// 						...item,
// 						SaleableStock: 0,
// 						TotalStockValue: 0
// 					};
// 				}

// 				groupedData[groupKey].SaleableStock += parseFloat(item.SaleableStock);
// 				groupedData[groupKey].TotalStockValue += parseFloat(item.TotalStockValue);

// 			});

// 			const groupedArray = Object.values(groupedData);
// 			filterTableData = groupedArray;

// 			// Apply filters based on selected options
// 			buttonStateArray.forEach(option => {
// 				if (option.groupBy && option.selectValue && option.selectValue.value !== '') {
// 					filterTableData = filterTableData.filter(item => item[option.text] === option.selectValue.label);
// 				}
// 			});
// 		}
// 		// Format "Amount" to have exactly two decimal places using toFixed
// 		filterTableData.forEach(item => {
// 			item.TotalStockValue = parseFloat(item.TotalStockValue).toFixed(2);
// 		});
// 		return { filterTableData };
// 	}

// 	function StockTypeHandler(e) {
// 		setStockTypeSelect(e);
// 		setTableData([]);
// 	}

// 	return (
// 		<React.Fragment>
// 			<MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
// 			<div className="page-content">
// 				<div className="px-2 c_card_filter text-black mb-1" >

// 					<Row>
// 						<Col className="col col-11  mt-1">
// 							<Row className="mb-2 row ">
// 								<Col sm={3}>
// 									<FormGroup className="mb-n2 row mt-1">

// 										<Label className="col-sm-3 p-2">FromDate</Label>
// 										<Col sm={6}>
// 											<C_DatePicker
// 												name='fromdate'
// 												value={fromdate}
// 												disabled={true}
// 												onChange={fromdateOnchange}
// 											/>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 								<Col sm={3} className="custom-to-date-col">
// 									<FormGroup className="mb-n3 row mt-1">
// 										<Label className="col-sm-4 p-2">ToDate</Label>
// 										<Col>
// 											<C_DatePicker
// 												nane='todate'
// 												value={todate}
// 												disabled={true}
// 												onChange={todateOnchange}
// 											/>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 								<Col sm={3}>
// 									<FormGroup className="mb-n3 row mt-1">

// 										<Label className="col-sm-4 p-2">Unit</Label>
// 										<Col>
// 											<Select
// 												name="Unit"
// 												value={unitDropdown}
// 												isSearchable={true}
// 												className="react-dropdown"
// 												classNamePrefix="dropdown"
// 												styles={{
// 													menu: provided => ({ ...provided, zIndex: 2 })
// 												}}
// 												options={BaseUnit_DropdownOptions}
// 												onChange={(e) => {
// 													setUnitDropdown(e);
// 													setTableData([]);
// 												}}
// 											/>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 								{isSCMParty &&
// 									<Col sm={3}>
// 										<FormGroup className="mb-n3 row mt-1">
// 											<Label className="col-sm-4 p-2">Party</Label>
// 											<Col>
// 												<Select
// 													name="Party"
// 													value={partyDropdown}
// 													isSearchable={true}
// 													className="react-dropdown"
// 													classNamePrefix="dropdown"
// 													styles={{
// 														menu: provided => ({ ...provided, zIndex: 2 })
// 													}}
// 													options={Party_Option}
// 													onChange={(e) => {
// 														setPartyDropdown(e);
// 														setTableData([]);
// 													}}
// 												/>
// 											</Col>
// 										</FormGroup>
// 									</Col>}
// 							</Row>
// 						</Col>

// 						<Col sm="1" className="mt-2 mb-1 ">
// 							<C_Button
// 								type="button"
// 								spinnerColor="white"
// 								loading={GoBtnLoading === "showOnTable"}
// 								className="btn btn-success"
// 								onClick={() => goButtonHandler("showOnTable")}
// 							>
// 								Show
// 							</C_Button>
// 						</Col>
// 					</Row>

// 					<Row>
// 						<Col className="col col-11  mt-1">
// 							<Row className="mb-2 row ">
// 								<Col sm={3}>
// 									<FormGroup className="mb-n2 row mt-1">

// 										<Label className="col-sm-3 p-2">Stock Type</Label>
// 										<Col sm={6}>
// 											<Select
// 												name="stockType"
// 												value={stockTypeSelect}
// 												isSearchable={true}
// 												className="react-dropdown"
// 												classNamePrefix="dropdown"
// 												styles={{
// 													menu: provided => ({ ...provided, zIndex: 2 })
// 												}}
// 												options={StockTypeOptions}
// 												onChange={(e) => {
// 													StockTypeHandler(e)

// 												}}
// 											/>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 								<Col sm={2}>
// 									<FormGroup className=" row mt-1 " >
// 										<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >MRP-Wise</Label>
// 										<Col md={2} style={{ marginTop: '7px' }} >
// 											<div className="form-check form-switch form-switch-md ">
// 												<Input type="checkbox" className="form-check-input"
// 													checked={mrpWise}
// 													name="mrpWise"
// 													onChange={(e) => {
// 														setMrpWise(e.target.checked);
// 													}}
// 												/>
// 											</div>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 								<Col sm={1}></Col>
// 								<Col sm={2}>
// 									<FormGroup className=" row mt-1 " >
// 										<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >Batch-Wise</Label>
// 										<Col md={2} style={{ marginTop: '7px' }} >
// 											<div className="form-check form-switch form-switch-md ">
// 												<Input type="checkbox" className="form-check-input"
// 													checked={batchWise}
// 													name="batchWise"
// 													onChange={(e) => {
// 														setBatchWise(e.target.checked);
// 													}}
// 												/>
// 											</div>
// 										</Col>
// 									</FormGroup>
// 								</Col>

// 							</Row>
// 						</Col>

// 						<Col sm="1" className="mt-2 mb-1 ">
// 							<C_Button
// 								type="button"
// 								spinnerColor="white"
// 								loading={ExcelBtnLoading === "downloadExcel"}
// 								className="btn btn-primary"
// 								onClick={() => goButtonHandler("downloadExcel")}
// 							>
// 								Excel
// 							</C_Button>
// 						</Col>
// 					</Row>
// 				</div>

// 				<div className="mt-1">
// 					<ToolkitProvider
// 						keyField="ID"
// 						data={tableData}
// 						columns={selectedColumns}
// 						search
// 					>
// 						{(toolkitProps,) => (
// 							<React.Fragment>
// 								<Row>
// 									<Col xl="12">
// 										<div className="table-responsive table">
// 											<BootstrapTable
// 												keyField="ID"
// 												classes={"table  table-bordered table-hover"}
// 												noDataIndication={
// 													<div className="text-danger text-center ">
// 														Record Not available
// 													</div>
// 												}
// 												onDataSizeChange={({ dataSize }) => {
// 													dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
// 												}}
// 												{...toolkitProps.baseProps}
// 											/>
// 											{mySearchProps(toolkitProps.searchProps)}
// 										</div>
// 									</Col>
// 								</Row>

// 							</React.Fragment>
// 						)}
// 					</ToolkitProvider>
// 				</div>

// 			</div>
// 			<C_Report />
// 		</React.Fragment >
// 	)
// }

// export default StockReport;






























import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { mode, pageId } from "../../routes/index"
import { stockReport_GoButton_API, stockReport_GoButton_API_Success } from "../../store/Report/StockReport/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { ExcelDownloadFunc } from "./ExcelDownloadFunc";

const StockReport = (props) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const currentDate_ymd = _cfunc.date_ymd_func();
	const isSCMParty = _cfunc.loginIsSCMParty();

	const [headerFilters, setHeaderFilters] = useState('');
	const [userPageAccessState, setUserAccState] = useState('');

	const [partyDropdown, setPartyDropdown] = useState("");
	const [unitDropdown, setUnitDropdown] = useState({ value: 1, label: 'No' });

	const [originalTableData, setOriginalTableData] = useState([]);
	const [stockTypeSelect, setStockTypeSelect] = useState({ value: "", label: 'All' });

	const [batchWise, setBatchWise] = useState(false);
	const [mrpWise, setMrpWise] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [selectedColumns, setSelectedColumns] = useState([
		{
			text: "ItemName",
			dataField: "ItemName",
			sort: true
		},
		{
			text: "Quantity",
			dataField: "ActualQty",
			align: "right",
			sort: true
		},
		{
			text: "Unit",
			dataField: "Unit",
			sort: true
		},
		{
			text: "Amount",
			dataField: "Amount",
			align: "right",
			sort: true
		},
	]);

	const reducers = useSelector(
		(state) => ({
			goButtonData: state.StockReportReducer.StockReportGobtn,
			BaseUnit: state.ItemMastersReducer.BaseUnit,
			SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdown,
			GoBtnLoading: state.StockReportReducer.GoBtnLoading,
			ExcelBtnLoading: state.StockReportReducer.ExcelBtnLoading,
			userAccess: state.Login.RoleAccessUpdateData,
			pageField: state.CommonPageFieldReducer.pageField
		})
	);

	const { userAccess, BaseUnit, SSDD_List, pageField, goButtonData = [], GoBtnLoading, ExcelBtnLoading } = reducers;
	const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

	// Featch Modules List data First Rendering
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

		dispatch(getBaseUnit_ForDropDown());
		dispatch(commonPageFieldSuccess(null));
		dispatch(commonPageField(pageId.STOCK_REPORT));
		dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
		return () => {
			dispatch(commonPageFieldSuccess(null));
			dispatch(stockReport_GoButton_API_Success([]));
			dispatch(getBaseUnit_ForDropDownSuccess([]));
		}
	}, [])

	useEffect(() => {
		try {
			let nextId = 1;
			let updatedReduxData = [];
			if (goButtonData.Status === true && goButtonData.StatusCode === 200) {
				const { goBtnMode } = goButtonData;
				updatedReduxData = goButtonData.Data.map((obj) => {
					return { ...obj, ID: nextId++ };
				});

				if (goBtnMode === "downloadExcel") {
					const { filterTableData } = SortButtonFunc(updatedReduxData);
					ExcelDownloadFunc({
						pageField,
						excelData: filterTableData,
						excelFileName: "Current_Stock_Report",
						mrpWise: mrpWise,
						batchWise: batchWise
					});
				}
				else if (goBtnMode === "showOnTable") {
					const { filterTableData } = SortButtonFunc(updatedReduxData)
					setTableData(filterTableData)
				}

			} else if (goButtonData.Status === true) {
				updatedReduxData = [];
			}

			setOriginalTableData(updatedReduxData);

		} catch (e) { }
	}, [goButtonData]);

	useEffect(() => {

		const { filterTableData } = SortButtonFunc(originalTableData)
		setTableData(filterTableData)

	}, [mrpWise, batchWise, originalTableData])

	const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
		.map(data => ({
			value: data.id,
			label: data.Name
		}));

	const Party_Option = SSDD_List.map(i => ({
		value: i.id,
		label: i.Name
	}));

	const StockTypeOptions = [
		{
			value: "",
			label: "All"
		},

		{
			value: 0,
			label: "Saleable Stock"
		},
		{
			value: 1,
			label: "Damage Stock"
		}]

	function goButtonHandler(goBtnMode) {

		try {
			if ((isSCMParty) && (partyDropdown === "")) {
				customAlert({ Type: 3, Message: "Please Select Party" });
				return;
			}

			const jsonBody = JSON.stringify({
				"FromDate": fromdate,
				"ToDate": todate,
				"Unit": unitDropdown.value,
				"PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
				"IsDamagePieces": stockTypeSelect.value
			});
			const config = { jsonBody, btnId: goBtnMode, };
			dispatch(stockReport_GoButton_API(config))

		} catch (error) { _cfunc.CommonConsole(error) }
	}

	function fromdateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.fromdate = date
		setHeaderFilters(newObj)
	}

	function todateOnchange(e, date) {
		let newObj = { ...headerFilters }
		newObj.todate = date
		setHeaderFilters(newObj)
	}

	function SortButtonFunc(baseData) {

		// Define an array of field names and their corresponding checkbox and select states
		const buttonStateArray = [
			{
				text: 'DistributorCode',
				dataField: 'DistributorCode',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},
			{
				text: 'DistributorName',
				dataField: 'DistributorName',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				sequence: 5
			},

			{
				text: 'Productcode',
				dataField: 'Item',
				showing: ['', 0, 1].includes(stockTypeSelect.value),
				groupBy: true,
				align: 'right',
				sequence: 1
			},
			{
				text: 'Item',
				dataField: 'ItemName',
				showing: ['', 0, 1].includes(stockTypeSelect.value),
				groupBy: true,
				sequence: 1
			}, {
				text: 'Product',
				dataField: 'GroupName',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				sequence: 5
			}, {
				text: 'SubProduct',
				dataField: 'SubGroupName',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				sequence: 5
			}, {
				text: 'ProductType',
				dataField: 'GroupTypeName',
				showing: false,
				groupBy: false,
				sequence: 5
			},
			{
				text: 'BatchCode',
				dataField: 'BatchCode',
				showing: batchWise,
				groupBy: batchWise,
				sequence: 2
			},
			{
				text: 'MRP',
				dataField: 'MRP',
				align: "right",
				showing: mrpWise,
				groupBy: mrpWise,
				sequence: 3
			},

			{
				text: 'PurchaseRate',
				dataField: 'PurchaseRate',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},

			{
				text: 'SaleableStock',
				dataField: 'SaleableStock',
				align: "right",
				showing: ['', 0].includes(stockTypeSelect.value),
				groupBy: false,
				align: 'right',
				sequence: 4
			},
			{
				text: 'UnSaleableStock',
				dataField: 'UnSaleableStock',
				showing: ['', 1].includes(stockTypeSelect.value),
				groupBy: false,
				align: 'right',
				sequence: 5
			},
			{
				text: 'SaleableStockValue',
				dataField: 'SaleableStockValue',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},

			{
				text: 'SaleableStockTaxValue',
				dataField: 'SaleableStockTaxValue',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			}, {
				text: 'UnSaleableStockValue',
				dataField: 'UnSaleableStockValue',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},
			{
				text: 'UnSaleableStockTaxValue',
				dataField: 'UnSaleableStockTaxValue',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},
			{
				text: 'TotalStockValue',
				dataField: 'TotalStockValue',
				showing: ['', 0, 1].includes(stockTypeSelect.value),
				groupBy: false,
				align: 'right',
				sequence: 5
			},

			{
				text: 'TaxValue',
				dataField: 'TaxValue',
				groupBy: false,
				align: 'right',
				sequence: 5
			},
			{
				text: 'Stockvaluewithtax',
				dataField: 'Stockvaluewithtax',
				showing: stockTypeSelect.value === "",
				groupBy: false,
				align: 'right',
				sequence: 5
			},

			{
				text: 'Unit',
				dataField: 'Unit',
				showing: true,
				groupBy: false,
				sequence: 5
			},

		];

		let filterTableData = [...baseData];
		const newSelectedColumns = buttonStateArray.filter(option => option.showing)

		setSelectedColumns(newSelectedColumns);

		if (buttonStateArray.some(option => option.groupBy)) {
			const groupedItems = filterTableData.reduce((accumulator, currentItem) => {

				const { SaleableStock, UnSaleableStock, TotalStockValue, UnSaleableStockTaxValue, UnSaleableStockValue, SaleableStockTaxValue, SaleableStockValue, MRP, BatchCode, Item, ItemName, PurchaseRate, DistributorCode, DistributorName, GroupName, SubGroupName, GroupTypeName, Stockvaluewithtax, Unit } = currentItem;
				let key = "";
				if (mrpWise) {
					key = ItemName + '_' + MRP + '_' + Item;
				} else {
					key = ItemName + '_' + Item;
				}
				if (accumulator[key]) {
					accumulator[key].SaleableStock += Number(SaleableStock);
					accumulator[key].UnSaleableStock += Number(UnSaleableStock);
					accumulator[key].TotalStockValue += Number(TotalStockValue);
					accumulator[key].UnSaleableStockTaxValue += Number(UnSaleableStockTaxValue);
					accumulator[key].UnSaleableStockValue += Number(UnSaleableStockValue);
					accumulator[key].SaleableStockTaxValue += Number(SaleableStockTaxValue);
					accumulator[key].SaleableStockValue += Number(SaleableStockValue);
					// accumulator[key].BatchCode += BatchCode;

				} else {
					accumulator[key] = {
						ItemName,
						MRP, PurchaseRate, SaleableStock: Number(SaleableStock),
						UnSaleableStock: Number(UnSaleableStock), TotalStockValue: Number(TotalStockValue),
						UnSaleableStockTaxValue: Number(UnSaleableStockTaxValue), UnSaleableStockValue: Number(UnSaleableStockValue),
						SaleableStockTaxValue: Number(SaleableStockTaxValue), SaleableStockValue: Number(SaleableStockValue), BatchCode,
						DistributorCode, DistributorName, Item, GroupName, SubGroupName, GroupTypeName, BatchCode, Stockvaluewithtax, Unit
					};
				}

				return accumulator;
			}, {});
			const groupedArray = Object.values(groupedItems);

			groupedArray.forEach(i => {
				;
				i.SaleableStock = i.SaleableStock.toFixed(2); // Update i.SaleableStock with rounded value
				i.UnSaleableStock = i.UnSaleableStock.toFixed(2)
				i.TotalStockValue = i.TotalStockValue.toFixed(2)
				i.UnSaleableStockTaxValue = i.UnSaleableStockTaxValue.toFixed(2)
				i.UnSaleableStockValue = i.UnSaleableStockValue.toFixed(2)
				i.SaleableStockTaxValue = i.SaleableStockTaxValue.toFixed(2)
				i.SaleableStockValue = i.SaleableStockValue.toFixed(2)
				i.Stockvaluewithtax = i.Stockvaluewithtax.toFixed(2)

			});

			filterTableData = groupedArray;

		}

		return { filterTableData };
	}

	function StockTypeHandler(e) {
		setStockTypeSelect(e);
		setTableData([]);
	}

	return (
		<React.Fragment>
			<MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
			<div className="page-content">
				<div className="px-2 c_card_filter text-black mb-1" >

					<Row>
						<Col className="col col-11  mt-1">
							<Row className="mb-2 row ">
								<Col sm={3}>
									<FormGroup className="mb-n2 row mt-1">

										<Label className="col-sm-3 p-2">FromDate</Label>
										<Col sm={6}>
											<C_DatePicker
												name='fromdate'
												value={fromdate}
												disabled={true}
												onChange={fromdateOnchange}
											/>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={3} className="custom-to-date-col">
									<FormGroup className="mb-n3 row mt-1">
										<Label className="col-sm-4 p-2">ToDate</Label>
										<Col>
											<C_DatePicker
												nane='todate'
												value={todate}
												disabled={true}
												onChange={todateOnchange}
											/>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={3}>
									<FormGroup className="mb-n3 row mt-1">

										<Label className="col-sm-4 p-2">Unit</Label>
										<Col>
											<Select
												name="Unit"
												value={unitDropdown}
												isSearchable={true}
												className="react-dropdown"
												classNamePrefix="dropdown"
												styles={{
													menu: provided => ({ ...provided, zIndex: 2 })
												}}
												options={BaseUnit_DropdownOptions}
												onChange={(e) => {
													setUnitDropdown(e);
													setTableData([]);
												}}
											/>
										</Col>
									</FormGroup>
								</Col>

								{isSCMParty &&
									<Col sm={3}>
										<FormGroup className="mb-n3 row mt-1">
											<Label className="col-sm-4 p-2">Party</Label>
											<Col>
												<Select
													name="Party"
													value={partyDropdown}
													isSearchable={true}
													className="react-dropdown"
													classNamePrefix="dropdown"
													styles={{
														menu: provided => ({ ...provided, zIndex: 2 })
													}}
													options={Party_Option}
													onChange={(e) => {
														setPartyDropdown(e);
														setTableData([]);
													}}
												/>
											</Col>
										</FormGroup>
									</Col>}
							</Row>
						</Col>

						<Col sm="1" className="mt-2 mb-1 ">
							<C_Button
								type="button"
								spinnerColor="white"
								loading={GoBtnLoading === "showOnTable"}
								className="btn btn-success"
								onClick={() => goButtonHandler("showOnTable")}
							>
								Show
							</C_Button>
						</Col>
					</Row>

					<Row>
						<Col className="col col-11  mt-1">
							<Row className="mb-2 row ">
								<Col sm={3}>
									<FormGroup className="mb-n2 row mt-1">

										<Label className="col-sm-3 p-2">Stock Type</Label>
										<Col sm={6}>
											<Select
												name="stockType"
												value={stockTypeSelect}
												isSearchable={true}
												className="react-dropdown"
												classNamePrefix="dropdown"
												styles={{
													menu: provided => ({ ...provided, zIndex: 2 })
												}}
												options={StockTypeOptions}
												onChange={(e) => {
													StockTypeHandler(e)

												}}
											/>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={2}>
									<FormGroup className=" row mt-1 " >
										<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >MRP-Wise</Label>
										<Col md={2} style={{ marginTop: '7px' }} >
											<div className="form-check form-switch form-switch-md ">
												<Input type="checkbox" className="form-check-input"
													checked={mrpWise}
													name="mrpWise"
													onChange={(e) => {
														setMrpWise(e.target.checked);
													}}
												/>
											</div>
										</Col>
									</FormGroup>
								</Col>

								<Col sm={1}></Col>
								<Col sm={2}>
									<FormGroup className=" row mt-1 " >
										<Label htmlFor="horizontal-firstname-input" className="col-sm-6 col-form-label" >Batch-Wise</Label>
										<Col md={2} style={{ marginTop: '7px' }} >
											<div className="form-check form-switch form-switch-md ">
												<Input type="checkbox" className="form-check-input"
													checked={batchWise}
													name="batchWise"
													onChange={(e) => {
														setBatchWise(e.target.checked);
													}}
												/>
											</div>
										</Col>
									</FormGroup>
								</Col>

							</Row>
						</Col>

						<Col sm="1" className="mt-2 mb-1 ">
							<C_Button
								type="button"
								spinnerColor="white"
								loading={ExcelBtnLoading === "downloadExcel"}
								className="btn btn-primary"
								onClick={() => goButtonHandler("downloadExcel")}
							>
								Excel
							</C_Button>
						</Col>
					</Row>
				</div>

				<div className="mt-1">
					<ToolkitProvider
						keyField="ID"
						data={tableData}
						columns={selectedColumns}
						search
					>
						{(toolkitProps,) => (
							<React.Fragment>
								<Row>
									<Col xl="12">
										<div className="table-responsive table">
											<BootstrapTable
												keyField="ID"
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
			<C_Report />
		</React.Fragment >
	)
}

export default StockReport;













// const Inatial_State = {
// 	loading: false
// }

// const reducers = (state = { Inatial_State, action }) => {
// 	switch (action.type) {
// 		case value:

// 			break;

// 		default:
// 			break;
// 	}


// }