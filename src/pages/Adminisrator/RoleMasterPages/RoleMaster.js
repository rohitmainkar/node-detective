import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, Input, } from "reactstrap";
import { AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID, PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import Select from "react-select";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import {
  comAddPageFieldFunc,
  formValid,
  onChangeSelect,
  onChangeText,
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";

const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [modalCss, setModalCss] = useState(false);

  const [userPageAccessState, setUserPageAccessState] = useState('');

  // ////////////////////////////////////
  const [state, setState] = useState({
    values: {
      Name: "",
      Description: "",
      Dashboard: "",
      RoleEmployeeTypes: "",
      isActive: false,
      isSCMRole: false,
      IsPartyConnection: false

    },
    fieldLabel: {
      Name: "",
      Description: "",
      Dashboard: "",
      RoleEmployeeTypes: "",
      isActive: false,
      isSCMRole: false,
      IsPartyConnection: false
    },

    isError: {
      Name: "",
      Description: "",
      Dashboard: "",
      RoleEmployeeTypes: "",
      isActive: false,
      isSCMRole: false,
      IsPartyConnection: false
    },

    hasValid: {
      Name: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      Description: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },

      Dashboard: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      RoleEmployeeTypes: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      isActive: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      isSCMRole: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      IsPartyConnection: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
    },
    required: {

    }
  }
  )

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    PostAPIResponse,
    pageField,
    userAccess,
    EmployeeType } = useSelector((state) => ({
      PostAPIResponse: state.RoleMaster_Reducer.postMsg,
      EmployeeType: state.EmployeeTypeReducer.EmployeeTypeList,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField

    }));

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty("editValue")
  const hasShowModal = props.hasOwnProperty("editValue")


  useEffect(() => {
    dispatch(commonPageFieldSuccess());
    dispatch(commonPageField(12))
    dispatch(getEmployeeTypelist());
  }, []);

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
      setUserPageAccessState(userAcc)
    };
  }, [userAccess])

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })// new change
    }
  }, [pageField])

  useEffect(() => {
    debugger
    // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
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
        debugger
        const listItems = hasEditVal.RoleEmployeeTypes.map((data) => ({
          value: data.EmployeeType,
          label: data.EmployeeTypeName
        }))

        const { Name, Description, Dashboard, isActive, isSCMRole, IsPartyConnection, RoleEmployeeTypes } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }

        hasValid.Name.valid = true;
        hasValid.Description.valid = true;
        hasValid.Dashboard.valid = true;
        hasValid.isActive.valid = true;
        hasValid.isSCMRole.valid = true;
        hasValid.IsPartyConnection.valid = true;
        hasValid.RoleEmployeeTypes.valid = true;

        values.Name = Name
        values.Description = Description
        values.Dashboard = Dashboard
        values.isActive = isActive
        values.isSCMRole = isSCMRole
        values.IsPartyConnection = IsPartyConnection
        values.RoleEmployeeTypes =listItems;

        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(BreadcrumbShow(hasEditVal.RoleMaster))

      }
      dispatch(editSuccess({ Status: false }))

    }

  }, [])

  useEffect(() => {
    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
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
          RedirectPath: '/RoleList',

        }))
      }
    }
    else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])

  const EmployeeType_DropdownOptions = EmployeeType.map((data) => ({
    value: data.id,
    label: data.Name
  }));


  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  const formSubmitHandler = (event) => {
    debugger
    event.preventDefault();
    if (formValid(state, setState)) {

      // console.log("isvalid", values.party.value)

      const jsonBody = JSON.stringify({
        Name: values.Name,
        Description: values.Description,
        Dashboard: values.Dashboard,
        isActive: values.isActive,
        isSCMRole: values.isSCMRole,
        IsPartyConnection: values.IsPartyConnection,
        RoleEmployeeTypes: values.employeeType.map((i) => { return ({ EmployeeType: i.value }) }),
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      });

      if (pageMode === 'edit') {
        dispatch(updateID(jsonBody, EditData.id));
        console.log("update jsonBody", jsonBody)
      }

      else {
        dispatch(postRole(jsonBody));
        console.log("jsonBody", jsonBody)
      }
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (modalCss || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

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

                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                  <Row className="">
                    <Col md={12}>
                      <Card>
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row>
                            <FormGroup className="mb-2 col col-md-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                              <Input
                                type="text"
                                className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                                name="Name"
                                defaultValue={values.Name}
                                placeholder="Please Enter Name"
                                onChange={(event) => {
                                  onChangeText({ event, state, setState })
                                  dispatch(BreadcrumbShow(event.target.value))
                                }}
                              />
                              {isError.Name.length > 0 && (
                                <span className="invalid-feedback">{isError.Name}</span>
                              )}
                            </FormGroup>

                            <Col md="1"> </Col>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.RoleEmployeeTypes} </Label>
                                <Select
                                  name="RoleEmployeeTypes"
                                  // defaultValue={EmployeeType_DropdownOptions[0]}
                                  value={values.RoleEmployeeTypes}
                                  isSearchable={false}
                                  isMulti={true}
                                  className="react-dropdown"
                                  options={EmployeeType_DropdownOptions}
                                  onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                  classNamePrefix="dropdown"
                                  styles={{
                                    control: base => ({
                                      ...base,
                                      border: isError.RoleEmployeeTypes.length > 0 ? '1px solid red' : '',

                                    })
                                  }}
                                />
                                {isError.RoleEmployeeTypes.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.RoleEmployeeTypes}</small></span>
                                )}
                              </div>
                            </div>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Description} </Label>
                                <Input
                                  type="text"
                                  defaultValue={values.Description}
                                  className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Description"
                                  placeholder="Please Enter description"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Description.length > 0 && (
                                  <span className="invalid-feedback">{isError.Description}</span>
                                )}
                              </FormGroup>

                              <Col md="1">  </Col>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Dashboard} </Label>
                                <Input
                                  type="text"
                                  value={values.Dashboard}
                                  className={isError.Dashboard.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Dashboard"
                                  placeholder="Please Enter dashboard"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Dashboard.length > 0 && (
                                  <span className="invalid-feedback">{isError.Dashboard}</span>
                                )}
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >{fieldLabel.isSCMRole}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" >
                                      <Input type="checkbox" className="form-check-input"
                                        value={values.isSCMRole}
                                        name="isSCMRole"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-3 col-form-label" >{fieldLabel.isActive}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={values.isActive}
                                        defaultChecked={true}
                                        name="isActive"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >{fieldLabel.IsPartyConnection}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        defaultChecked={values.IsPartyConnection}
                                        name="IsPartyConnection"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
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
export default RoleMaster
