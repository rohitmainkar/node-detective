import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Label,
    Input,
    Row,
    Button
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
    onChangeText,
    resetFunction,
} from "../../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { url, mode, pageId } from "../../../../routes/index"
import { Retailer_List } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { postSelect_Field_for_dropdown } from "../../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { saveSalesReturnMaster, InvoiceNumber, InvoiceNumberSuccess, saveSalesReturnMaster_Success } from "../../../../store/Sales/SalesReturnRedux/action";
import CustomTable2 from "../../../../CustomTable2/Table";
import "./salesReturn.scss";
import { CInput, C_DatePicker } from "../../../../CustomValidateForm/index";
import { decimalRegx, } from "../../../../CustomValidateForm/RegexPattern";
import { getpartyItemList } from "../../../../store/Administrator/PartyItemsRedux/action";
import { SalesReturn_add_button_api_For_Invoice, SalesReturn_add_button_api_For_Item } from "../../../../helpers/backend_helper";
import { salesReturnCalculate, calculateSalesReturnFunc, return_discountCalculate_Func } from "./SalesCalculation";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mySearchProps } from "../../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";



const SalesReturn = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        ReturnDate: currentDate_ymd,
        Customer: "",
        ItemName: "",
        InvoiceNumber: "",
        BatchCode: "",
        Comment: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }]);

    const [TableArr, setTableArr] = useState([]);

    const [returnMode, setrRturnMode] = useState(0);
    const [imageTable, setImageTable] = useState([]);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        RetailerList,
        ItemList,
        ReturnReasonList,
        InvoiceNo,
        pageField,
        userAccess,
        saveBtnloading,
    } = useSelector((state) => ({
        saveBtnloading: state.SalesReturnReducer.saveBtnloading,
        postMsg: state.SalesReturnReducer.postMsg,
        RetailerList: state.CommonAPI_Reducer.RetailerList,
        ItemList: state.PartyItemsReducer.partyItem,
        ReturnReasonList: state.PartyMasterBulkUpdateReducer.SelectField,
        InvoiceNo: state.SalesReturnReducer.InvoiceNo,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
    }));

    useEffect(() => {
        dispatch(InvoiceNumberSuccess([]))
        const page_Id = pageId.SALES_RETURN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getpartyItemList(_cfunc.loginJsonBody()))
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        if (TableArr.length === 0) {
            setrRturnMode(0)
        }
    }, [TableArr]);

    const location = { ...history.location }
    // const hasShowloction = location.hasOwnProperty(mode.editValue)
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

    // Return Reason dropdown Values
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 8
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            setTableArr([])
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
                    RedirectPath: url.SALES_RETURN_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveSalesReturnMaster_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])


    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const itemList = ItemList.map((index) => ({
        value: index.Item,
        label: index.ItemName,
        itemCheck: index.selectCheck
    }));

    const ItemList_Options = itemList.filter((index) => {
        return index.itemCheck === true
    });

    const ReturnReasonOptions = ReturnReasonList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));




    const pagesListColumns = [
        {
            text: "Item Name",
            dataField: "ItemName",
            hidden: false,
            formatter: (cellContent, row, key) => {
                return (
                    <Label style={{ minWidth: "200px" }}>{row.ItemName}</Label>
                )
            }
        },
        {
            text: "Invoice Qty",
            hidden: (returnMode === 1) ? false : true,
            formatter: (cellContent, row, key) => {
                return (
                    <Label>{row.Quantity}</Label>
                )
            }
        },
        {
            text: "Quantity",
            dataField: "Quantity",
            classes: () => "sales-discount-row",
            hidden: false,
            formatter: (cellContent, row, key) => {

                return (
                    <div className="parent" >
                        <div className="child" style={{ minWidth: "100px" }}>
                            <CInput

                                defaultValue={row.Quantity}
                                autoComplete="off"
                                type="text"
                                cpattern={decimalRegx}
                                placeholder="Enter Quantity"
                                className="col col-sm text-end"
                                onChange={(event) => row["Qty"] = event.target.value}
                            />
                        </div>
                        <div className="child mt-2 pl-1">
                            <label className="label">&nbsp;{row.UnitName}</label>
                        </div>

                    </div>
                )
            }
        },

        {
            text: "MRP",
            dataField: "MRP",
            hidden: false,
            formatter: (cellContent, row, key) => {
                return (
                    <>
                        <div style={{ minWidth: "90px" }}>
                            <Select
                                id={`MRP${key}`}
                                name="MRP"
                                defaultValue={{ value: row.MRP, label: row.MRPValue }}
                                isSearchable={true}
                                isDisabled={returnMode === 1 && true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                options={row.MRPOptions}
                                onChange={(event) => {
                                    row.MRP = event.value;
                                    row.MRPValue = event.label;
                                }}

                            />
                        </div>
                    </>
                )
            }
        },

        {
            text: "GST",
            dataField: "",
            hidden: false,
            formatter: (cellContent, row, key) => {
                return (<div style={{ minWidth: "90px" }}>
                    <Select
                        id={`GST${key}`}
                        name="GST"
                        defaultValue={{ value: row.GST, label: row.GSTPercentage }}
                        isSearchable={true}
                        isDisabled={returnMode === 1 && true}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={row.GSTOptions}
                        onChange={(event) => {
                            row.GST = event.value;
                            row.GSTPercentage = event.label;
                        }}
                    />
                </div>)
            }
        },
        {
            text: "Rate",
            dataField: "",
            hidden: false,
            classes: () => "sales-rate-row",
            formatter: (cellContent, index1, key,) => {

                return (
                    <>
                        <div className="">
                            <div className="parent  mb-1">
                                <div className="child">
                                    <Select
                                        id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        value={discountDropOption[1]}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                        }}
                                    />
                                </div>
                                <div className="child">
                                    <CInput
                                        className="input"
                                        placeholder="Dist."
                                        style={{ textAlign: "right" }}
                                        type="text"
                                        cpattern={decimalRegx}
                                        onChange={(event) => { index1.Discount = event.target.value }}

                                    />
                                </div>
                            </div>
                            <div className="parent">
                                <CInput
                                    defaultValue={index1.Rate}
                                    placeholder="Enter Rate"
                                    type="text"
                                    cpattern={/^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/}
                                    className="text-end"
                                    onChange={(event) => { index1.Rate = event.target.value }}
                                />
                            </div>

                        </div>

                    </>
                );
            },
        },
        {
            text: "Batch",
            dataField: "",
            classes: () => "sales-rate-row",
            formatter: (cellContent, row,) => {

                return (
                    <>
                        <div className="">
                            <div className="parent mb-1">
                                <Input
                                    defaultValue={row.BatchCode}
                                    placeholder="Enter BatchCode"
                                    type="text"
                                    className="col col-sm text-center"
                                    onChange={(event) => { row.BatchCode = event.target.value }}
                                />
                            </div>
                            <div className="parent">
                                <C_DatePicker
                                    placeholder="Enter BatchDate"
                                    onChange={(e, date) => {
                                        row.BatchDate = _cfunc.date_ymd_func(date)
                                    }}
                                />
                            </div>

                        </div>

                    </>
                );
            },

        },
        {
            text: "Return Reason",
            dataField: "",
            classes: () => "sales-return-row",
            formatter: (cellContent, row) => {

                return (<>


                    <div className="parent mb-1">
                        <div className="child">
                            <Select
                                isSearchable={true}
                                className="react-dropdown"
                                classNamePrefix="dropdown"
                                defaultValue={row.defaultReason}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                                options={ReturnReasonOptions}
                                onChange={event => {
                                    debugger
                                    row["defaultReason"] = event
                                }}
                            />
                        </div>
                    </div>
                    <div className="parent">
                        <div className="child">
                            <Input
                                placeholder="Enter Comment"
                                defaultChecked={row.ItemComment}
                                type="text"
                                onChange={(event) => { row.ItemComment = event.target.value }}
                            />
                        </div>
                    </div>
                </>
                )
            }
        },

        {
            text: "Image",
            dataField: "",
            classes: () => "sales-return-Image-row",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <div>
                        <div className="btn-group btn-group-example mb-3" role="group">
                            <Input
                                type="file"
                                className="form-control "
                                name="image"
                                id="file"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onChange={(event) => { imageSelectHandler(event, row) }}
                            />
                            <button name="image"
                                accept=".jpg, .jpeg, .png ,.pdf"
                                onClick={() => { imageShowHandler(row) }}
                                id="ImageId" type="button" className="btn btn-primary ">Show</button>
                        </div>
                    </div>


                </span>)
            }
        },
        {
            text: "Action ",
            dataField: "",
            hidden: returnMode === 1 ? true : false,
            formatter: (cellContent, row, key) => (
                <>
                    <div style={{ justifyContent: 'center' }} >
                        <Col>
                            <FormGroup className=" col col-sm-4 ">
                                <Button
                                    id={"deleteid"}
                                    type="button"
                                    className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light"
                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete MRP'
                                    onClick={(e) => { deleteButtonAction(row) }}>
                                    <i className="mdi mdi-delete font-size-18"></i>
                                </Button>
                            </FormGroup>
                        </Col>
                    </div>
                </>
            ),
        },
    ];

    const deleteButtonAction = (row) => {
        const newArr = TableArr.filter((index) => !(index.id === row.id))
        setTableArr(newArr)
    }

    const ReturnDate_Onchange = (e, date) => {
        setState((i) => {
            const a = { ...i }
            a.values.ReturnDate = date;
            a.hasValid.ReturnDate.valid = true
            return a
        })
    }

    const AddPartyHandler = async (e, type) => {

        const invalidMsg1 = []
        if ((values.ItemName === '') && (type === 'add')) {
            invalidMsg1.push(`Select Item Name`)
        }
        if ((values.InvoiceNumber === '') && (values.Customer === '') && (type === 'Select')) {
            invalidMsg1.push(`Select Retailer.`)
        }
        else if ((values.InvoiceNumber === '') && (type === 'Select')) {
            invalidMsg1.push(`Select Invoice No.`)
        }

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return
        }

        let apiResponse;
        try {

            if (returnMode === 2) {

                apiResponse = await SalesReturn_add_button_api_For_Item({//Post API Method
                    "ItemID": values.ItemName.value,
                    "BatchCode": values.BatchCode
                })

            }
            else {
                apiResponse = await SalesReturn_add_button_api_For_Invoice(values.InvoiceNumber.value)
                apiResponse.Data = apiResponse.Data.InvoiceItems
            }
            if (apiResponse.StatusCode == 204) {
                customAlert({
                    Type: 3,
                    Message: JSON.stringify(apiResponse.Message)
                })
                return
            }
            const itemArr = [...TableArr];

            apiResponse.Data.forEach((i) => {
                const MRPOptions = i.ItemMRPDetails.map(i => ({ label: i.MRPValue, value: i.MRP }));
                const GSTOptions = i.ItemGSTDetails.map(i => ({ label: i.GSTPercentage, value: i.GST }));
                const defaultGST = { value: i.GST, label: i.GSTPercentage }
                const defaultMRP = { value: i.MRP, label: i.MRPValue }

                itemArr.push({
                    ...i,
                    id: itemArr.length + 1,
                    MRPOptions: MRPOptions,
                    GSTOptions: GSTOptions,
                    defaultGST: defaultGST,
                    defaultMRP: defaultMRP,
                    gstPercentage: i.GSTPercentage,
                });
            });

            setTableArr(itemArr);

            setState((i) => {
                let a = { ...i }
                a.values.ItemName = ""
                a.hasValid.ItemName.valid = true;
                return a
            })
        } catch (error) { _cfunc.CommonConsole(error) }
    }

    const RetailerHandler = (event) => {

        setState((i) => {
            let a = { ...i }
            a.values.ItemName = ""
            a.values.InvoiceNumber = ""
            a.hasValid.ItemName.valid = true;
            a.hasValid.InvoiceNumber.valid = true;
            return a
        })
        setTableArr([])

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginPartyID(),
            CustomerID: event.value
        });

        dispatch(InvoiceNumber(jsonBody));
    }

    // image onchange handler
    const imageSelectHandler = async (event, row) => {

        const file = event.target.files[0]
        const base64 = await convertBase64(file);
        let ImageUpload = base64
        row.Image = ImageUpload
        setImageTable(ImageUpload)
    }

    // image convert in string
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    const imageShowHandler = (row) => {

        var x = document.getElementById("add-img");
        if (x.style.display === "none") {
            x.src = imageTable
            if (imageTable != "") {
                x.style.display = "block";

            }

        } else {
            x.style.display = "none";
        }
    }

    const SaveHandler = async (event) => {

        event.preventDefault();

        const btnId = event.target.id

        let grand_total = 0;
        const ReturnItems = TableArr.map((i) => {

            //** calcualte amount function

            const calculate = return_discountCalculate_Func(i)

            grand_total = grand_total + Number(calculate.roundedTotalAmount)

            return ({
                "Item": i.Item,
                "ItemName": i.ItemName,
                "Quantity": i.Quantity,
                "Unit": i.Unit,
                "BaseUnitQuantity": i.BaseUnitQuantity,
                "BatchCode": i.BatchCode,
                "BatchDate": i.BatchDate,
                "MRP": i.MRP,
                "MRPValue": i.MRPValue,
                "Rate": i.Rate,
                "GST": i.GST,
                "ItemReason": i.defaultReason ? i.defaultReason.value : '',
                "Comment": i.ItemComment,

                "CGST": Number(calculate.CGST_Amount).toFixed(2),
                "SGST": Number(calculate.SGST_Amount).toFixed(2),
                "IGST": Number(calculate.IGST_Amount).toFixed(2),

                "GSTPercentage": calculate.GST_Percentage,
                "CGSTPercentage": calculate.CGST_Percentage,
                "SGSTPercentage": calculate.SGST_Percentage,
                "IGSTPercentage": calculate.IGST_Percentage,

                "BasicAmount": Number(calculate.discountBaseAmt).toFixed(2),
                "GSTAmount": Number(calculate.roundedGstAmount).toFixed(2),
                "Amount": Number(calculate.roundedTotalAmount).toFixed(2),

                "TaxType": 'GST',
                "DiscountType": calculate.discountType,
                "Discount": calculate.discount,
                "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),

                "ReturnItemImages": [],
            })
        })

        const filterData = ReturnItems.filter((i) => {
            return i.Quantity > 0
        })

        if (filterData.length === 0) {
            customAlert({
                Type: 4,
                Message: " Please Enter One Item Quantity"
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        const invalidMsg1 = []

        ReturnItems.forEach((i) => {

            if ((i.Unit === undefined) || (i.Unit === null)) {
                invalidMsg1.push(`${i.ItemName} : Unit Is Required`)
            }
            else if ((i.MRP === undefined) || (i.MRP === null)) {
                invalidMsg1.push(`${i.ItemName} : MRP Is Required`)
            }
            else if ((i.GST === undefined) || (i.GST === null)) {
                invalidMsg1.push(`${i.ItemName} : GST Is Required`)
            }
            else if ((i.Rate === undefined) || (i.Rate === null)) {
                invalidMsg1.push(`${i.ItemName} : Rate Is Required`)
            }
            else if ((i.BatchCode === undefined) || (i.BatchCode === null)) {
                invalidMsg1.push(`${i.ItemName} : BatchCode Is Required`)
            };
        })

        if (invalidMsg1.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(invalidMsg1)
            })
            return _cfunc.btnIsDissablefunc({ btnId, state: false })
        }

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    ReturnDate: values.ReturnDate,
                    ReturnReason: '',
                    BatchCode: values.BatchCode,
                    Customer: values.Customer.value,
                    Comment: values.Comment,
                    GrandTotal: grand_total,
                    Party: _cfunc.loginPartyID(),
                    RoundOffAmount: (grand_total - Math.trunc(grand_total)).toFixed(2),
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    ReturnItems: filterData,
                });
                dispatch(saveSalesReturnMaster({ jsonBody, btnId }));
            }

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >
                            {/* < img id='add-img' className='abc1' src={''} style={{ top: "400px" }} /> */}

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReturnDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReturnDate'
                                                value={values.ReturnDate}
                                                onChange={ReturnDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    RetailerHandler(hasSelect)
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ItemName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ItemName "
                                                name="ItemName"
                                                value={values.ItemName}
                                                isDisabled={(returnMode === 1) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={ItemList_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(2)
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment} </Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Enter Comment"
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="invalid-feedback">{isError.Comment}</span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BatchCode}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="BatchCode"
                                                value={values.BatchCode}
                                                placeholder="Enter BatchCode"
                                                type='text'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.BatchCode.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.BatchCode}</small></span>
                                            )}


                                        </Col>

                                        <Col sm="1" className="mx-6 mt-1">
                                            {
                                                (!(returnMode === 1)) &&
                                                < Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "add")}
                                                > Add</Button>
                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.InvoiceNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="InvoiceNumber "
                                                name="InvoiceNumber"
                                                value={values.InvoiceNumber}
                                                isDisabled={((returnMode === 2) || (TableArr.length > 0)) ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={InvoiceNo_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    setrRturnMode(1)
                                                }}
                                            />

                                        </Col>
                                        <Col sm="1" className="mx-6 mt-1 ">
                                            {((TableArr.length > 0) || (!(values.ItemName === ""))) ?
                                                <Change_Button onClick={(e) => {
                                                    setTableArr([])
                                                    setState((i) => {
                                                        let a = { ...i }
                                                        a.values.ItemName = ""
                                                        a.values.InvoiceNumber = ""
                                                        return a
                                                    })
                                                }} />
                                                :
                                                (!(returnMode === 2)) &&
                                                <Button type="button" color="btn btn-outline-primary border-1 font-size-11 text-center"
                                                    onClick={(e,) => AddPartyHandler(e, "Select")}
                                                >        <i > </i>Select</Button>

                                            }
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </Row>
                        </div>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={TableArr}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table" style={{ minHeight: "60vh" }}>
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        key={`table-key-${returnMode}`}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                        {
                            TableArr.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"SalesReturn"}
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

export default SalesReturn
