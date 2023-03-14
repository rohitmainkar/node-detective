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
  FormGroup,
  Input
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserMasterAction,
  userUpdateAction,
  saveUserMasterActionSuccess,
  GetUserPartiesForUserMastePage,
  getEmployeeForUseRegistration,
  userEditActionSuccess
}
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { breadcrumbReturn, btnIsDissablefunc, loginUserID } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";
import * as mode from "../../../routes/PageMode"
import * as pageId from "../../../routes/allPageID"
import { SaveButton } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect, onChangeText } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";

const AddUser = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const fileds = {
    id: "",
    Name: "",
    LoginName: '',
    Password: '',
    EmployeeName: '',
    isActive: false,
    isLoginUsingEmail: false,
    isLoginUsingMobile: false,
    isSendOTP: false,
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [partyRoleData, setPartyRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");
  const [editCreatedBy, seteditCreatedBy] = useState("");


  // M_Roles DropDown

  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPassword, setisCPassword] = useState(false);

  const handleCPassword = (event) => {
    onChangeText({ event, state, setState });
    setCPassword(event.target.value);
    setisCPassword(true);
  }

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    PostAPIResponse,
    employeelistForDropdown,
    Roles,
    employePartyWiseRoleState,
    userAccess,
    pageField
  } = useSelector((state) => ({
    PostAPIResponse: state.User_Registration_Reducer.AddUserMessage,
    employePartyWiseRoleState: state.User_Registration_Reducer.userPartiesForUserMaster,
    employeelistForDropdown: state.User_Registration_Reducer.employeelistForDropdown,
    Roles: state.RoleMaster_Reducer.roleList,
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField
  }));


  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;
  
  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const hasShowModal = props.hasOwnProperty(mode.editValue)

  useEffect(() => {

    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(pageId.USER))
    dispatch(getEmployeeForUseRegistration());
    dispatch(getRole());
  }, []);

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
      breadcrumbReturn({ dispatch, userAcc });
    };
  }, [userAccess])


  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])


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
        const { id, LoginName, AdminPassword, CreatedBy, EmployeeName, Employee, UserRole,
          isLoginUsingMobile, isActive, isSendOTP, isLoginUsingEmail
        } = hasEditVal
        const { values, hasValid, } = { ...state }

        values.id = id;
        values.LoginName = LoginName;
        values.Password = AdminPassword;
        values.EmployeeName = { label: EmployeeName, value: Employee };
        values.isActive = isActive;
        values.isLoginUsingEmail = isLoginUsingEmail;
        values.isLoginUsingMobile = isLoginUsingMobile;
        values.isSendOTP = isSendOTP;


        hasValid.id.valid = true;
        hasValid.LoginName.valid = true;
        hasValid.Password.valid = true;
        hasValid.EmployeeName.valid = true;
        hasValid.isActive.valid = true;
        hasValid.isLoginUsingEmail.valid = true;
        hasValid.isLoginUsingMobile.valid = true;
        hasValid.isSendOTP.valid = true;

        dispatch(Breadcrumb_inputName(LoginName))
        dispatch(GetUserPartiesForUserMastePage({ id: Employee, editRole: UserRole }))

        seteditCreatedBy(CreatedBy)

        dispatch(userEditActionSuccess({ Status: false }))
      }
    }
  }, [])

  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
      dispatch(saveUserMasterActionSuccess({ Status: false }))
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
      dispatch(saveUserMasterActionSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])



  const EmployeeOptions = employeelistForDropdown.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
    dispatch(GetUserPartiesForUserMastePage({ id: e.value }))
  }

  /// Role dopdown
  function RoleDropDown_select_handler(event, pty, key) {
    employePartyWiseRoleState.forEach((index, key1) => {
      if (key === key1) {
        index.PartyRoles = event
      }
    })
  };

  const saveHandler = (event) => {
    
    event.preventDefault();
    const btnId = event.target.id;
    // btnIsDissablefunc({ btnId: btnId, state: true })
    try {

      const userRoleArr = []
      employePartyWiseRoleState.map(i1 => {
        i1.PartyRoles.map(i2 => {
          userRoleArr.push({
            Party: i1.Party,
            Role: i2.value
          })
        })
      })
      if (userRoleArr.length <= 0) {
        CustomAlert({
          Type: 4,
          Message: "At Least One Role  Add in the Table",
        })
        return btnIsDissablefunc({ btnId: btnId, state: false })
      }
      const jsonBody = JSON.stringify({
        LoginName: values.LoginName,
        password: values.Password,
        AdminPassword: values.Password,
        Employee: values.EmployeeName.value,
        isActive: values.isActive,
        isSendOTP: values.isSendOTP,
        isLoginUsingMobile: values.isLoginUsingMobile,
        isLoginUsingEmail: values.isLoginUsingEmail,
        CreatedBy: loginUserID(),
        UpdatedBy: loginUserID(),
        UserRole: userRoleArr
      })

      if (pageMode === mode.edit) {
        dispatch(userUpdateAction({ jsonBody, updateId: values.id, btnId }));
      }
      else {
        dispatch(saveUserMasterAction({ jsonBody, btnId }));
      }
    } catch (error) { btnIsDissablefunc({ btnId: btnId, state: false }) }
  }

  const PartyWiseRoleTable = () => {

    if (!partyRoleData || EmployeeSelect === '') {
      return null
    }
    if (!(employePartyWiseRoleState.length === 0)) {
      if ((employePartyWiseRoleState[0].Party > 0)) {
        return (
          <div className="col col-6" style={{ marginTop: '28px' }}>
            <table className="table table-bordered ">
              <Thead >
                <tr>
                  <th>Party Name</th>
                  <th>RoleName</th>
                </tr>
              </Thead>
              <Tbody  >
                {employePartyWiseRoleState.map((index, key) => (
                  <tr key={index.Role}>
                    <td className="col-sm-6">
                      {index.PartyName}
                    </td>
                    <td>
                      <FormGroup className="" >
                        <Select
                          defaultValue={index.PartyRoles}
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
          </div>
        )
      }
      else {
        return <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <Label className="form-label font-size-13 ">Role name</Label>
            <Select
              defaultValue={employePartyWiseRoleState[0].PartyRoles}
              options={RolesValues}
              isMulti={true}
              className="basic-multi-select"
              onChange={(event) => { RoleDropDown_select_handler(event, employePartyWiseRoleState[0], 0) }}
              classNamePrefix="select2-selection"
            />
          </div>
        </div>
      }
    }
    return null
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
                      <form>
                        <Card className=" text-black">
                          <CardBody className="c_card_body">
                            <Row>

                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01"> {fieldLabel.EmployeeName} </Label>
                                <Col sm={12}>
                                  <Select
                                    id="EmployeeName "
                                    name="EmployeeName"
                                    isDisabled={pageMode === mode.edit ? true : false}
                                    value={values.EmployeeName}
                                    options={EmployeeOptions}
                                    onChange={(hasSelect, evn) => {
                                      handllerEmployeeID(hasSelect)
                                      onChangeSelect({ hasSelect, evn, state, setState, })
                                    }}
                                  />
                                  {isError.EmployeeName.length > 0 && (
                                    <span className="invalid-feedback">{isError.EmployeeName}</span>
                                  )}
                                </Col>
                              </FormGroup>

                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.LoginName}</Label>
                                <Input
                                  name="LoginName"
                                  id="txtName"
                                  type="text"
                                  placeholder="Please Enter Login Name"
                                  value={values.LoginName}
                                  disabled={pageMode === mode.edit ? true : false}
                                  autoComplete='off'
                                  onChange={(event) => {
                                    onChangeText({ event, state, setState });
                                    dispatch(Breadcrumb_inputName(event.target.value))
                                  }}
                                />
                                {isError.LoginName.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.LoginName}</small></span>
                                )}
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">Password</Label>
                                <Input name="password" id="password"
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
                                <Input
                                  name="Password" id="password"
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
                                  <Label htmlFor="horizontal-firstname-input" className=" col-sm-2 col-form-label" >{fieldLabel.isLoginUsingMobile}</Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md ml-4 " dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isLoginUsingMobile}
                                        name="isLoginUsingMobile"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isLoginUsingMobile = event.target.checked
                                            return a
                                          })
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >{fieldLabel.isActive} </Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isActive}
                                        defaultChecked={true}
                                        name="isActive"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isActive = event.target.checked
                                            return a
                                          })
                                        }}
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
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >{fieldLabel.isLoginUsingEmail}</Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isLoginUsingEmail}
                                        name="isLoginUsingEmail"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isLoginUsingEmail = event.target.checked
                                            return a
                                          })
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >{fieldLabel.isSendOTP}</Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isSendOTP}
                                        name="isSendOTP"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isSendOTP = event.target.checked
                                            return a
                                          })

                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>


                          </CardBody>
                        </Card>

                        < Card className="mt-n2">
                          <CardBody style={{ backgroundColor: "whitesmoke" }}>
                            <Row >
                              <PartyWiseRoleTable />
                              <Row>
                                <Col sm={2}>
                                  <div>
                                    <SaveButton
                                      pageMode={pageMode}
                                      onClick={saveHandler}
                                      userAcc={userPageAccessState}
                                      editCreatedBy={editCreatedBy}
                                      module={"User"}
                                    />

                                  </div>
                                </Col>
                              </Row>
                            </Row>
                          </CardBody>
                        </Card>

                      </form>
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
