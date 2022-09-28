import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { PostMethodForDriverMaster, getMethodForDriverList, PostMethod_ForDriverMasterSuccess, getMethod_ForDriverListSuccess, editDriverTypeSuccess, updateDriverTypeID } from "../../../store/Administrator/DriverRedux/action";
import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr"

// import { actionChannel } from "redux-saga/effects";

const formValid = ({ isError, required, hasValid },func) => {

    let isValid = false;
    Object.values(isError).forEach(val => {

        if ((val.length >= 0)) {
            isValid = false
        } else {
            isValid = true
        }
    });

    Object.keys(required).forEach((lab) => {

        if ((isError[lab].length >= 0)) {
            isError[lab] = hasValid[lab].inValidMsg
            isValid = false
            func({
                isError,
                hasValid,
                required
            })
        } else {
            isValid = true
        }
    });


    return isValid
};


const formValChange = (e , state,setFunc) => {

    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...state.isError };
    let hasValid = { ...state.hasValid };

    const regExp = RegExp(hasValid[name].regExp)
    isError[name] = regExp.test(value)
        ? ""
        : hasValid[name].inValidMsg

    // switch (name) {
    //     case "name":
    //         isError.name =
    //             value.length < 4 ? "Atleast 4 characaters required" : "";
    //         break;
    //     case "address":
    //         // isError.address =[isvalid.address.FieldValidationName].test(value)
    //         isError.address = address.test(value)
    //             ? ""
    //             : "Email address is invalid";
    //         break;
    //     case "uid":
    //         isError.uid =
    //             value.length < 12 ? "Atleast 6 characaters required" : "";
    //         break;
    //     default:
    //         break;
    // }
    setFunc({
        isError,
        hasValid,
        [name]: value

    })
};

const DriverMaster = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()

    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;

    const formRef = useRef(null);
    const [pageMode, setPageMode] = useState("");
    const [userPageAccessState, setUserPageAccessState] = useState("");
    const [EditData, setEditData] = useState([]);
    const [DOB_Date_Select, setDOB_Date_Select] = useState("");


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse, DriverList, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
        PostAPIResponse: state.DriverReducer.PostDataMessage,
        DriverList: state.DriverReducer.DriverList,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,

    }));


    useEffect(() => {
        dispatch(getMethodForDriverList());

    }, [dispatch]);

    //userAccess useEffect
    useEffect(() => {
        let userAcc = undefined
        if ((editDataGatingFromList === undefined)) {

            let locationPath = history.location.pathname
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === locationPath)
            })
        }
        else if (!(editDataGatingFromList === undefined)) {
            let relatatedPage = props.relatatedPage
            userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
                return (`/${inx.ActualPagePath}` === relatatedPage)
            })

        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }

    }, [RoleAccessModifiedinSingleArray])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {

            setEditData(editDataGatingFromList);
            setPageMode(pageModeProps);
            setDOB_Date_Select(editDataGatingFromList.DOB)

            dispatch(editDriverTypeSuccess({ Status: false }))
            dispatch(BreadcrumbShow(editDataGatingFromList.DriverMaster))
            return
        }
    }, [editDataGatingFromList])


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {
            dispatch(PostMethod_ForDriverMasterSuccess({ Status: false }))
            formRef.current.reset();
            if (pageMode === "dropdownAdd") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PostAPIResponse.Message,
                    RedirectPath: '/DriverList',
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(getMethod_ForDriverListSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])


    const FormSubmitButton_Handler = (event, values) => {
        const jsonBody = JSON.stringify({
            Name: values.Name,
            Address: values.Address,
            DOB: DOB_Date_Select,
            UID: values.UID
        });

        if (pageMode === 'edit') {
            dispatch(updateDriverTypeID(jsonBody, EditData.id));
        }

        else {
            dispatch(PostMethodForDriverMaster(jsonBody));
        }
    };

    const PageFieldMaster = [
        {
            ControlID: 2,
            ControlType: 2,
            ControlTypeName: "Dropdown",
            FieldLabel: "demo data List",
            IsCompulsory: true,
            DefaultSort: true,
            FieldValidation: 4,
            FieldValidationName: "Mobile",
            ListPageSeq: 1,
            ShowInListPage: true,
            ShowInDownload: true,
            DownloadDefaultSelect: false
        },
        {
            ControlID: 1,
            ControlType: 1,
            ControlTypeName: "TextBox",
            FieldLabel: "demo data List",
            IsCompulsory: true,
            DefaultSort: true,
            FieldValidation: 1,
            FieldValidationName: "Length(50)",
            ListPageSeq: 1,
            ShowInListPage: true,
            ShowInDownload: false,
            DownloadDefaultSelect: false
        },
        {
            ControlID: 2,
            ControlType: 2,
            ControlTypeName: "Dropdown",
            FieldLabel: "demo data List",
            IsCompulsory: true,
            DefaultSort: true,
            FieldValidation: 4,
            FieldValidationName: "MobileNo",
            ListPageSeq: 1,
            ShowInListPage: true,
            ShowInDownload: true,
            DownloadDefaultSelect: true
        },

    ]


    const [state, setState] = useState({
        value: {},
        isError: {
            name: '',
            address: '',
            uid: '',
        },
        hasValid: {
            name: {
                regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                inValidMsg: "Name  is invalid",
            },
            address: {
                regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                inValidMsg: "Email address is invalid",
            },

            uid: {
                regExp: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                inValidMsg: "UID  is invalid",
            },
        },
        required: {
            name: true,
            address: true,
            uid: false,
        }
    }
    )
    // const [hasField, setHasField] = useState({
    //     name: {},
    //     address: {},
    //     uid: {},
    // }

    // )



   



    


    const onSubmit = e => {

        e.preventDefault();
        if (formValid(state,setState)) {
            console.log("isvalid", state)
        } else {
            console.log("Form is invalid!");
        }
    };
    console.log(state)
    const { isError } = state;

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>DriverMaster | FoodERP-React FrontEnd</title>
                        </MetaTags>
                        <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                                <form onSubmit={onSubmit} noValidate>

                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <Input
                                                                type="text"
                                                                className={isError.name.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                name="name"
                                                                placeholder="Please Enter Name"
                                                                onChange={(e) => {
                                                                    formValChange(e,setState);
                                                                    dispatch(BreadcrumbShow(e.target.value))
                                                                }}

                                                            />
                                                            {isError.name.length > 0 && (
                                                                <span className="invalid-feedback">{isError.name}</span>
                                                            )}
                                                        </FormGroup>
                                                        <Row>
                                                            <Col md="4">
                                                                <FormGroup className="mb-3">
                                                                    <Label>Date of Birth</Label>
                                                                    <Flatpickr
                                                                        id="FSSAIExipry"
                                                                        name="FSSAIExipry"
                                                                        value={DOB_Date_Select}
                                                                        className="form-control d-block p-2 bg-white text-dark"
                                                                        placeholder="YYYY-MM-DD"
                                                                        autoComplete='off'
                                                                        options={{
                                                                            altInput: true,
                                                                            altFormat: "F j, Y",
                                                                            dateFormat: "Y-m-d"
                                                                        }}
                                                                        onChange={(selectedDates, dateStr, instance) => {
                                                                            setDOB_Date_Select(dateStr)
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">Address </Label>
                                                                <Input
                                                                    type="text"
                                                                    value={EditData.Address}
                                                                    className={isError.address.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    name="address"
                                                                    placeholder="Please Enter Address"
                                                                    autoComplete='off'
                                                                    onChange={(e) => { formValChange(e,setState) }}
                                                                />
                                                                {isError.address.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.address}</span>
                                                                )}
                                                            </FormGroup>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="mb-2 col col-sm-4 ">
                                                                <Label htmlFor="validationCustom01">UID </Label>
                                                                <Input
                                                                    name="uid"
                                                                    value={EditData.UID}
                                                                    type="text"
                                                                    placeholder="Please Enter UID"
                                                                    autoComplete='off'
                                                                    className={isError.uid.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    onChange={(e) => { formValChange(e,setState) }}
                                                                />
                                                                {isError.name.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.uid}</span>
                                                                )}
                                                            </FormGroup>

                                                        </Row>
                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    <div>
                                                                        {
                                                                            pageMode === "edit" ?
                                                                                userPageAccessState.RoleAccess_IsEdit ?
                                                                                    <button
                                                                                        type="submit"
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
                                                                                        className="btn btn-success w-md mt-3"
                                                                                    >
                                                                                        <i class="fas fa-edit me-2"></i>Update
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                                : (

                                                                                    userPageAccessState.RoleAccess_IsSave ?
                                                                                        <button
                                                                                            type="submit"
                                                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
                                                                                            className="btn btn-primary w-md mt-3 "
                                                                                        > <i className="fas fa-save me-2"></i> Save
                                                                                        </button>
                                                                                        :
                                                                                        <></>
                                                                                )
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Row>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>

                    </Container>
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

export default DriverMaster




const Email = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)

const Mobile = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)
const NotNull = RegExp(
    /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
)