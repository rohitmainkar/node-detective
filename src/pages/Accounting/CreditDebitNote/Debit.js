import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    currentDate,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import {
    editBankIDSuccess,
    saveBankMaster,
    saveBankMaster_Success,
    updateBankID,
    updateBankIDSuccess
} from "../../../store/Accounting/BankRedux/action";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import CInput from "../../../CustomValidateForm/CInput";
import { decimalRegx } from "../../../CustomValidateForm/RegexPattern";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { CredietDebitType, saveCredit, saveCredit_Success } from "../../../store/Accounting/CreditRedux/action";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";


const Credit = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        DebitDate: currentDate,
        PartyName: "",
        Comment: "",
        Amount: "",
        ServiceItems: "",
        Narration: "",
        ReceiptNO: "",
        ReceiptDate: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        RetailerList,
        ReceiptGoButton,
        ReceiptModeList,
        CreditDebitType,
        updateMsg,
        userAccess } = useSelector((state) => ({
            postMsg: state.CredietDebitReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            userAccess: state.Login.RoleAccessUpdateData,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.DEBIT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    debugger
    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;
    let { Data = [] } = ReceiptGoButton;


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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {
                const { id, Name } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                hasValid.Name.valid = true;

                values.id = id
                values.Name = Name;

                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(editBankIDSuccess({ Status: false }))
        }
    }, [])

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCredit_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))


            if (pageMode === "other") {
                CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                const promise = await CustomAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (promise) {
                    history.push({
                        pathname: url.DEBIT_LIST,
                    })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCredit_Success({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(postMessage.Message),
            })
        }
    }, [postMsg])

    // useEffect(() => {
    //     if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
    //         setState(() => resetFunction(fileds, state)) // Clear form values 
    //         history.push({
    //             pathname: url.BANK_LIST,
    //         })
    //     } else if (updateMsg.Status === true && !modalCss) {
    //         dispatch(updateBankIDSuccess({ Status: false }));
    //         dispatch(
    //             AlertState({
    //                 Type: 3,
    //                 Status: true,
    //                 Message: JSON.stringify(updateMsg.Message),
    //             })
    //         );
    //     }
    // }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 7
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, [])

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));
    debugger
    const CreditDebitTypeId = CreditDebitType.find((index) => {
        return index.Name === "DebitNote"
    });


    function ReciptDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ReceiptDate = date;
            a.hasValid.ReceiptDate.valid = true
            return a
        })
    };


    function DebitDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.DebitDate = date;
            a.hasValid.DebitDate.valid = true
            return a
        })
    };


    // const pagesListColumns = [
    //     {
    //         text: "InvoiceDate",
    //         dataField: "InvoiceDate",
    //     },
    //     {
    //         text: "Invoice No",
    //         dataField: "FullInvoiceNumber",
    //     },
    //     {
    //         text: "Invoice Amount",
    //         dataField: "GrandTotal",
    //     },
    //     {
    //         text: "Paid",
    //         dataField: "PaidAmount",
    //     },
    //     {
    //         text: "Bal Amt",
    //         dataField: "BalanceAmount",
    //     },
    //     {
    //         text: "Calculate",
    //         dataField: "",
    //         // formatter: (cellContent, row, key) => {

    //         //     return (<span style={{ justifyContent: 'center', width: "100px" }}>
    //         //         <CInput
    //         //             key={`Quantity${row.FullInvoiceNumber}${key}`}
    //         //             id={`Quantity${row.FullInvoiceNumber}`}
    //         //             pattern={decimalRegx}
    //         //             defaultValue={pageMode === mode.view ? row.Amount : row.Calculate}
    //         //             disabled={pageMode === mode.view ? true : false}
    //         //             // value={row.Calculate}
    //         //             // type="text"
    //         //             autoComplete="off"
    //         //             className="col col-sm text-center"
    //         //             onChange={(e) => CalculateOnchange(e, row, key)}

    //         //         />
    //         //     </span>)
    //         // },
    //         // headerStyle: (colum, colIndex) => {
    //         //     return { width: '140px', textAlign: 'center' };
    //         // },
    //     },
    // ];


    const saveHandeller = async (event) => {
        debugger
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    CRDRNoteDate: values.DebitDate,
                    Customer: values.PartyName.value,
                    NoteType: CreditDebitTypeId.id,
                    GrandTotal: values.Amount,
                    Narration: values.Narration,
                    Comment: values.Comment,
                    ReceiptNO: values.ReceiptNO,
                    ReceiptDate: values.ReceiptDate,
                    CRDRNoteItems: [],
                    CRDRInvoices: [],
                    Party: loginPartyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateBankID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveCredit({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <form noValidate>

                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.DebitDate}</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='DebitDate'
                                                value={values.DebitDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={DebitDateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Narration"
                                                id="Narration"
                                                value={values.Narration}
                                                type="text"
                                                className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Narration.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Narration}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.PartyName}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="PartyName "
                                                name="PartyName"
                                                value={values.PartyName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.PartyName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Comment}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Comment"
                                                id="Comment"
                                                value={values.Comment}
                                                type="text"
                                                className={isError.Comment.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Comment.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Comment}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ServiceItems}</Label>
                                        <Col sm="7">
                                            <Select
                                                id="ServiceItems "
                                                name="ServiceItems"
                                                value={values.ServiceItems}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />
                                            {isError.ServiceItems.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ServiceItems}</small></span>
                                            )}
                                        </Col>


                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Amount}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Amount"
                                                id="Amount"
                                                value={values.Amount}
                                                type="text"
                                                className={isError.Amount.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Comment"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Amount.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Amount}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row>

                            {values.ServiceItems.label === "Cheque Bounce" ? <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptNO}</Label>
                                        <Col sm="7">

                                            <Select
                                                id=" ReceiptNO"
                                                name="ReceiptNO"
                                                value={values.ReceiptNO}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />

                                            {isError.ReceiptNO.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptNO}</small></span>
                                            )}
                                        </Col>


                                    </FormGroup>
                                </Col >
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}</Label>
                                        <Col sm="7">

                                            <Flatpickr
                                                name='ReceiptDate'
                                                value={values.ReceiptDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={ReciptDateOnchange}
                                            />

                                            {isError.ReceiptDate.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptDate}</small></span>
                                            )}
                                        </Col>

                                    </FormGroup>
                                </Col >

                            </Row> : null}


                            {/* </CardBody> */}
                            {/* </CardBody> */}

                            {/* </div> */}

                        </div>
                        <FormGroup>
                            <Col sm={2} style={{ marginLeft: "3px" }} >
                                <SaveButton pageMode={pageMode}
                                    onClick={saveHandeller}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                    module={"Receipts"}
                                />

                            </Col>
                        </FormGroup >
                        {/* </Card> */}

                        {/* <ToolkitProvider

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
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}

                                        />

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider> */}

                    </form >
                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Credit

