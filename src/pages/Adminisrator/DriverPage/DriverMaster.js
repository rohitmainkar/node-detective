import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
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
        debugger
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

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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
                                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                                    ref={formRef}>
                                    <Row className="">
                                        <Col md={12}>
                                            <Card>
                                                <CardBody style={{ backgroundColor: "whitesmoke" }}>
                                                    <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">Name </Label>
                                                            <AvField
                                                                name="Name"
                                                                id="txtName"
                                                                value={EditData.Name}
                                                                type="text"
                                                                placeholder="Please Enter Name"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Name ' },
                                                                }}
                                                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
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
                                                            <AvField
                                                                name="Address"
                                                                value={EditData.Address}
                                                                type="text"
                                                                placeholder="Please Enter Address"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter Address ' },
                                                                }}
                                                                unChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
                                                        </FormGroup>
                                                       </Row>

                                                       <Row>
                                                        <FormGroup className="mb-2 col col-sm-4 ">
                                                            <Label htmlFor="validationCustom01">UID </Label>
                                                            <AvField
                                                                name="UID"
                                                                value={EditData.UID}
                                                                type="text"
                                                                placeholder="Please Enter UID"
                                                                autoComplete='off'
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Please Enter UID ' },
                                                                }}
                                                                unChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                            />
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
                                </AvForm>
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

