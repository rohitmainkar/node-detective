import React, { useEffect, useState, } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Row,
} from "reactstrap";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
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
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import {
    PartyBankfilter,
    saveBankAssign,
    saveBankAssign_Success
} from "../../../store/Accounting/BankAssignRedux/action";

const BankAssign = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        id: "",
        Name: "",
        IFSC: "",
        BranchName: "",
        AccountNo: "",
        IsSelfDepositoryBank: false
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
        Data,
        userAccess } = useSelector((state) => ({
            postMsg: state.BankAssignReducer.postMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            Data: state.BankAssignReducer.Data,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.BANK_ASSIGN
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(PartyBankfilter())
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
    // useEffect(() => {

    //     if ((hasShowloction || hasShowModal)) {

    //         let hasEditVal = null
    //         if (hasShowloction) {
    //             setPageMode(location.pageMode)
    //             hasEditVal = location.editValue
    //         }
    //         else if (hasShowModal) {
    //             hasEditVal = props.editValue
    //             setPageMode(props.pageMode)
    //             setModalCss(true)
    //         }

    //         if (hasEditVal) {
    //             const { id, Name, BranchName, IFSC, AccountNo, IsSelfDepositoryBank } = hasEditVal
    //             const { values, fieldLabel, hasValid, required, isError } = { ...state }

    //             hasValid.Name.valid = true;
    //             hasValid.BranchName.valid = true;
    //             hasValid.IFSC.valid = true;
    //             hasValid.AccountNo.valid = true;
    //             hasValid.IsSelfDepositoryBank.valid = true;

    //             values.id = id
    //             values.Name = Name;
    //             values.BranchName = BranchName;
    //             values.IFSC = IFSC;
    //             values.AccountNo = AccountNo;
    //             values.IsSelfDepositoryBank = IsSelfDepositoryBank;

    //             setState({ values, fieldLabel, hasValid, required, isError })
    //             dispatch(Breadcrumb_inputName(hasEditVal.Name))
    //             seteditCreatedBy(hasEditVal.CreatedBy)
    //         }
    //         dispatch(editBankIDSuccess({ Status: false }))
    //     }
    // }, [])

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveBankAssign_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
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
                    RedirectPath: url.BANK_ASSIGN,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveBankAssign_Success({ Status: false }))
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


    const pagesListColumns = [
        {
            text: "Name",
            dataField: "BankName",
            sort: true,
        },
        {
            text: "Depository Bank",
            dataField: "IsSelfDepositoryBank",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        key={row.BankName}
                    />
                </span>
                )
            },
        },
        {
            text: " Default",
            dataField: "IsDefault",
            sort: true,
            formatter: (cellContent, row, col, k) => {
                return (<span >
                    <Input type="checkbox"
                        defaultChecked={cellContent}
                        key={row.BankName}
                    />
                </span>
                )
            },
        },
        {
            text: "Account No",
            dataField: "AccountNo",
            sort: true,
        },
        {
            text: "IFSC",
            dataField: "IFSC",
            sort: true,
        },
        {
            text: "Branch ",
            dataField: "BranchName",
            sort: true,
        },
    ];

    const pageOptions = {
         sizePerPage: 10,
          custom: true,
    };


    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    Name: values.Name,
                    BranchName: values.BranchName,
                    IFSC: values.IFSC,
                    AccountNo: values.AccountNo,
                    IsSelfDepositoryBank: values.IsSelfDepositoryBank,
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    Party: loginPartyID(),
                    Company: loginCompanyID(),
                });

                if (pageMode === mode.edit) {
                    // dispatch(updateBankID({ jsonBody, updateId: values.id, btnId }));
                }

                else {
                    dispatch(saveBankAssign({ jsonBody, btnId }));
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
                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                                <form noValidate>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody className="c_card_body">
                                                    <FormGroup>
                                                        <Row>
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
                                                                                        bordered={true}
                                                                                        striped={false}
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

                                                            <Col sm={2}>
                                                                <SaveButton pageMode={pageMode}
                                                                    onClick={saveHandeller}
                                                                    userAcc={userPageAccessState}
                                                                    editCreatedBy={editCreatedBy}
                                                                    module={"BankAssign"}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </FormGroup>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default BankAssign

