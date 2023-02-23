import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Label,
  FormGroup
} from "reactstrap";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoles,
  addUser,
  updateID,
  addUserSuccess,
  GetUserPartiesForUserMastePage,
  getEmployeeForUseRegistration,
  editSuccess
}
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { breadcrumbReturn, createdBy, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as pageId from "../../../routes/allPageID"
import BreadcrumbNew from "../../../components/Common/BreadcrumbNew";
import * as mode from "../../../routes/PageMode"
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";

const AddUser = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [partyRoleData, setPartyRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");
  const [userPartiesForUserMaster, setUserPartiesForUserMaster] = useState([]);
  const [editCreatedBy, seteditCreatedBy] = useState("");


  // M_Roles DropDown

  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPassword, setisCPassword] = useState(false);

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setisCPassword(true);
  }

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    PostAPIResponse,
    employeelistForDropdown,
    Roles,
    userPartiesForUserMaster_redux,
    userAccess
  } = useSelector((state) => ({
    PostAPIResponse: state.User_Registration_Reducer.AddUserMessage,
    userPartiesForUserMaster_redux: state.User_Registration_Reducer.userPartiesForUserMaster,
    employeelistForDropdown: state.User_Registration_Reducer.employeelistForDropdown,
    Roles: state.User_Registration_Reducer.Roles,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField
  }));

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const hasShowModal = props.hasOwnProperty(mode.editValue)

  useEffect(() => {
    if (isCPassword) {
      if (password === cPassword) {
        setShowErrorMessage(false);
        setCPasswordClass('form-control is-valid')
      } else {
        setShowErrorMessage(true)
        setCPasswordClass('form-control is-invalid')
      }
    }
  }, [cPassword])

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
      breadcrumbReturn({dispatch,userAcc});
    };
  }, [userAccess])

  const FindPartyID = userPartiesForUserMaster_redux.find((index) => {
    return index.Party_id === null
  })

  useEffect(() => {

    let newArray = userPartiesForUserMaster_redux.map((i) => (
      {
        PartyRoles: [],
        Party: i.Party_id,
        PartyName: i.PartyName
      }
    ))
    setUserPartiesForUserMaster(newArray)

  }, [userPartiesForUserMaster_redux])

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
        dispatch(Breadcrumb_inputName(hasEditVal.LoginName))
        dispatch(GetUserPartiesForUserMastePage(hasEditVal.Employee))
        setEditData(hasEditVal)
        seteditCreatedBy(hasEditVal.CreatedBy)


        setEmployeeSelect({
          value: hasEditVal.Employee,
          label: hasEditVal.EmployeeName,
        })

        setUserPartiesForUserMaster(hasEditVal.UserRole)

        let arraynew = []
        hasEditVal.UserRole.map((i) => {
          i.PartyRoles.map((i2) => {
            arraynew.push({ Party: i.Party, Role: i2.Role })
          })
        })
        console.log("arraynew", arraynew)
        setPartyRoleData(arraynew)
        dispatch(editSuccess({ Status: false }))
      }
    }
  }, [])


  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
      dispatch(addUserSuccess({ Status: false }))
      setEmployeeSelect('')
      setPartyRoleData('')

      if (pageMode === "other") {
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
          RedirectPath: '/UserList',
          AfterResponseAction: false
        }))
      }
    }

    else if ((PostAPIResponse.Status === true) && !(pageMode === mode.dropdownAdd)) {
      dispatch(addUserSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])


  useEffect(() => {
    dispatch(getEmployeeForUseRegistration());
    dispatch(getRoles());
  }, [dispatch]);

  const EmployeeValues = employeelistForDropdown.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
    dispatch(GetUserPartiesForUserMastePage(e.value))
  }

  /// Role dopdown
  function RoleDropDown_select_handler(event, pty, key) {

    const nwPtRole = event.map((ind) => ({
      Party: pty.Party,
      Role: ind.value
    }))

    const find = partyRoleData.filter((index, key1) => {
      return !(index.Party === pty.Party)
    })
    if ((find === undefined)) {
      setPartyRoleData(nwPtRole)
    } else {
      setPartyRoleData(nwPtRole.concat(find))
    }
  };

  const handleValidSubmit = (event, values) => {

    const jsonBody = JSON.stringify({
      email: values.email,
      LoginName: values.loginName,
      password: pageMode === mode.edit ? EditData.AdminPassword : values.password,
      AdminPassword: pageMode === mode.edit ? EditData.AdminPassword : values.password,
      Employee: EmployeeSelect.value,
      isActive: values.isActive,
      isSendOTP: values.isSendOTP,
      isLoginUsingMobile: values.isLoginUsingMobile,
      isLoginUsingEmail: values.isLoginUsingEmail,
      CreatedBy: createdBy(),
      UpdatedBy: createdBy(),
      UserRole: partyRoleData
    })

    if (partyRoleData.length <= 0 && !(FindPartyID)) {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "At Least One Role Data Add in the Table",
        RedirectPath: false,
        PermissionAction: false,
      }));

    }

    else if (pageMode === mode.edit) {
      dispatch(updateID(jsonBody, EditData.id));
      setEditData([]);
      console.log("Update jsonBody", jsonBody)
    }
    else {
      dispatch(addUser(jsonBody));
      console.log("Post jsonBody", jsonBody)
    }
  };

  const rolaTable = () => {

    return (
      <table className="table table-bordered ">
        <Thead >
          <tr>
            <th>Party Name</th>
            <th>RoleName</th>

          </tr>
        </Thead>
        <Tbody  >
          {userPartiesForUserMaster.map((index, key) => (
            <tr key={index.Role}>
              <td className="col-sm-6">
                {index.PartyName}
              </td>
              <td>
                <FormGroup className="" >
                  <Select
                    defaultValue={pageMode === mode.edit ? index.PartyRoles.map((i) => ({ value: i.Role, label: i.RoleName })) : null}
                    options={RolesValues}
                    isMulti={true}
                    className="basic-multi-select"
                    onChange={(event) => { RoleDropDown_select_handler(event, index, key) }}
                    classNamePrefix="select2-selection"
                  />
                </FormGroup>
              </td>
            </tr>
          ))}
        </Tbody>
      </table>
    )
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (modalCss || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
        {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.USER} /> */}

        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Container fluid>
            <div >
              <Row>
                <Col lg={12}>
                  <Card className="text-black" >
                    <CardHeader className="card-header   text-black c_card_header" >
                      <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                      <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                    </CardHeader>
                    <CardBody className="text-black">
                      <AvForm
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v);
                        }}
                        ref={formRef}
                      >
                        <Card className=" text-black">
                          <CardBody className="c_card_body">
                            <Row>

                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01"> Employee </Label>
                                <Col sm={12}>
                                  <Select
                                    id="EmployeeDropDown "
                                    isDisabled={pageMode === mode.edit ? true : false}
                                    value={EmployeeSelect}
                                    options={EmployeeValues}
                                    onChange={(e) => { handllerEmployeeID(e) }}
                                  />
                                </Col>
                              </FormGroup>

                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">Login Name</Label>
                                <AvField
                                  name="loginName" id="txtName"
                                  type="text"
                                  placeholder="Please Enter Login Name"
                                  defaultvalue=''
                                  value={EditData.LoginName}
                                  disabled={pageMode === mode.edit ? true : false}
                                  autoComplete='off'
                                  validate={{
                                    required: { value: true, errorMessage: 'Please Enter Name' },
                                  }}
                                  onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
                                />
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">Password</Label>
                                <AvField name="password" id="password"
                                  type="password"
                                  placeholder="Please Enter Password"
                                  autoComplete="new-password"
                                  className="form-control"
                                  value={password}
                                  onChange={(e) => { setPassword(e.target.value) }} />
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">Confirm Password</Label>
                                <AvField name="password" id="password"
                                  type="password"
                                  placeholder="Please Enter Password"
                                  autoComplete="new-password"
                                  className={cPasswordClass}
                                  value={cPassword}
                                  onChange={handleCPassword} />
                                {showErrorMessage && isCPassword ? <div> Passwords did not match </div> : ''}
                              </FormGroup>
                            </Row>

                            <Row className="mt-2">
                              <FormGroup className="mb-1 col col-sm-12 " >
                                <Row className="justify-content-md-left">
                                  <Label htmlFor="horizontal-firstname-input" className=" col-sm-2 col-form-label" >Enable Mobile Login</Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md ml-4 " dir="ltr">
                                      <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={EditData.isLoginUsingMobile}
                                        name="isLoginUsingMobile"
                                        defaultChecked={true}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Active </Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                      <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={EditData.isActive}
                                        defaultChecked={true}
                                        name="isActive"
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            <Row >
                              <FormGroup className="col col-sm-12  " >
                                <Row className="justify-content-md-left">
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Enable Email Login</Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={EditData.isLoginUsingEmail}
                                        name="isLoginUsingEmail"
                                        defaultChecked={true}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Send OTP </Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        defaultChecked={EditData.isSendOTP}
                                        name="isSendOTP"
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            {(EmployeeSelect.length === 0) ?
                              <Row className="mt-3">
                                <Col sm={2}>
                                  <div>
                                    {
                                      (pageMode === mode.edit) ?
                                        (userPageAccessState.RoleAccess_IsEdit) ?
                                          <button
                                            type="submit"
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
                                            className="btn btn-success w-md"
                                          >
                                            <i class="fas fa-edit me-2"></i>Update
                                          </button>
                                          :
                                          null
                                        : ((pageMode === mode.defaultsave) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) ? (
                                          (userPageAccessState.RoleAccess_IsSave) ?
                                            <button
                                              type="submit"
                                              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                              className="btn btn-primary w-md"
                                            > <i className="fas fa-save me-2"></i> Save
                                            </button>
                                            :
                                            null
                                        )
                                          : null
                                    }
                                  </div>
                                </Col>
                              </Row> : <></>}
                          </CardBody>
                        </Card>

                        {!(EmployeeSelect.length === 0) ?
                          < Card className="mt-n2">
                            <CardBody style={{ backgroundColor: "whitesmoke" }}>
                              <Row className="">
                                {!(userPartiesForUserMaster.length === 0) ? userPartiesForUserMaster[0].Party > 0 ?
                                  <Col sm={6} style={{ marginTop: '28px' }}>
                                    {partyRoleData ? (
                                      <div >
                                        {rolaTable()}
                                      </div>
                                    ) :
                                      null
                                    }
                                  </Col> : <div className="col-lg-3 col-md-6">
                                    <div className="mb-3">
                                      <Label className="form-label font-size-13 ">Role name</Label>
                                      <Select
                                        defaultValue={pageMode === mode.edit ? userPartiesForUserMaster[0].PartyRoles.map((i) => ({ value: i.Role, label: i.RoleName })) : null}
                                        options={RolesValues}
                                        isMulti={true}
                                        className="basic-multi-select"
                                        onChange={(event) => { RoleDropDown_select_handler(event, userPartiesForUserMaster[0], 0) }}
                                        classNamePrefix="select2-selection"
                                      />
                                    </div>
                                  </div> :
                                  <></>}

                                <Row>
                                  <Col sm={2}>
                                    <div>
                                    <SaveButton
                                  pageMode={pageMode}
                                  userAcc={userPageAccessState}
                                  editCreatedBy={editCreatedBy}
                                  module={"User"}
                                />
                                      {/* {
                                        pageMode === mode.edit ?
                                          userPageAccessState.RoleAccess_IsEdit ?
                                            <button
                                              type="submit"
                                              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update User"
                                              className="btn btn-success w-md"
                                            >
                                              <i class="fas fa-edit me-2"></i>Update
                                            </button>
                                            :
                                            <></>
                                          : (
                                            userPageAccessState.RoleAccess_IsSave ?
                                              <button
                                                type="submit"
                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save User"
                                                className="btn btn-primary w-md"
                                              > <i className="fas fa-save me-2"></i> Save
                                              </button>
                                              :
                                              <></>
                                          )
                                      } */}
                                    </div>
                                  </Col>
                                </Row>
                              </Row>
                            </CardBody>
                          </Card>
                          : <></>}

                      </AvForm>
                    </CardBody>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </Card>
                </Col>
              </Row>
            </div>
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
export default AddUser;
