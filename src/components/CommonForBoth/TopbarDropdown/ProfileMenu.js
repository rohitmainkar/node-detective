import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  Input,
  Row,
  FormGroup,
  Label,
  Col,
  Spinner,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect, useDispatch, useSelector } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// users
import {  initialFiledFunc, resetFunction } from "../../Common/validationFunction"
import { ChangePassword, ChangePassword_Succes } from "../../../store/auth/changepassword/action"
import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import {  passwordRgx } from "../../../CustomValidateForm/index";


const ProfileMenu = props => {


  const dispatch = useDispatch();

  const fileds = {
    LoginName: "",
    password: "",
    newpassword: ""
  }

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const [currentPwdError, setCurrentPwdError] = useState("");
  const [newPwdError, setNewPwdError] = useState("");


  const { user, postMsg, divisionDropdown_redux = [], loading } = useSelector((state) => ({
    loading: state.ChangePasswordReducer.loading,
    user: state.Login.afterLoginUserDetails,
    postMsg: state.ChangePasswordReducer.postMsg,
    divisionDropdown_redux: state.Login.divisionDropdown,

  }))



  useEffect(() => {

    if (localStorage.getItem("UserName")) {
      const obj = localStorage.getItem("UserName")
      setusername(obj)
    }
  }, [props.success, user])

  useEffect(async () => {
    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

      dispatch(ChangePassword_Succes({ Status: false }))
      setState(() => resetFunction(fileds, state))// Clear form values  
      setmodal_backdrop(false)
      customAlert({
        Type: 1,
        Message: postMsg.Message,
      })


    } else if
      (postMsg.Status === true) {
      dispatch(ChangePassword_Succes({ Status: false }))
      customAlert({
        Type: 3,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg])

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const currentpwdOnchange = (e) => {
    setCurrentPwd(e.target.value)
  }

  const newpwdOnchange = (e) => {
    let val = e.target.value
    const result = passwordRgx.test(val);
    if (!result) {
      setNewPwdError("Invalid password format.")
    } else {
      setNewPwdError("")

    }
    setNewPwd(e.target.value)
  }


  const SaveHandler = async (event) => {
    

    event.preventDefault();

    if (((newPwd.length < 3) || (newPwd.length < 8))) {
      return
    }

    const jsonBody = JSON.stringify({
      LoginName: username,
      password: currentPwd,
      newpassword: newPwd
    });

    const isConfirmed = await customAlert({
      Type: 7,
      Message: "Do you Want to Change Password ?",
    });

    if (isConfirmed) {
      dispatch(ChangePassword({ jsonBody }));

    };

  };

  return (
    <React.Fragment>

      <Modal

        isOpen={modal_backdrop}
        toggle={() => {
          tog_backdrop()
        }}
        backdrop={'static'}
        id="staticBackdrop"
        className="modal-dialog-centered "
      >
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLabel">Change Password</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setmodal_backdrop(false)
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body row">


          <div className=" col col-7">
            <FormGroup className="mb-2 col col-sm-9 ">
              <Label htmlFor="validationCustom01"> Old Password </Label>
              <Input
                defaultValue={""}
                type="password"
                value={currentPwd}
                autocomplete="off"
                autoFocus={true}
                onChange={currentpwdOnchange}
                placeholder="Enter Old Password"
              />

              {(currentPwdError.length > 0) && (
                <span className="text-danger font-size-12">{currentPwdError}</span>
              )}
            </FormGroup>

            <FormGroup className="mb-3 col col-sm-9">
              <Label> New Password </Label>
              <Input
                value={newPwd}
                type="password"
                placeholder="Enter New Password"
                autoComplete='off'
                autoFocus={true}
                onChange={newpwdOnchange}
              />
              {(newPwdError.length > 0) && (
                <span className="text-danger font-size-12">{newPwdError}</span>
              )}
            </FormGroup>
          </div>
          <div className="col col-1">
            <span className="text-danger">
              *Note
            </span>
          </div>

          <div className="col col-3  font-size-14">
            <span>
              must be 8-16 char and include at least one A-Z letter,
              one a-z letter, one 0-9, and one special character (@$!%*?&).
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={() => {
            setmodal_backdrop(false)
          }}>Close</button>
          {loading ? <button type="button"  className="btn btn-primary  "
            onClick={SaveHandler}
          >
            <div className="dot-pulse"> <span> Change Password</span>     &nbsp;
              <div className="bounce1" style={{ background: "white" }}></div>
              <div className="bounce2" style={{ background: "white" }}></div>
              <div className="bounce3" style={{ background: "white" }}></div>
            </div>
          </button>
            : <button type="button" className="btn btn-primary w-20"
              onClick={SaveHandler}
            >Change Password</button>}

        </div>
      </Modal>

      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          {/* <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          /> */}
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">

          {/* <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}
          </DropdownItem>

          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem> */}


          {divisionDropdown_redux.length > 1 && //If division  then only
            <Link className="dropdown-item">
              <i className="bx bx-user font-size-16 align-middle me-1  text-primary" />
              <span>{props.t("Change Division")}</span>
            </Link>}

          {/* <div className="dropdown-divider" /> */}

          <div style={{ cursor: "pointer" }} onClick={() => {
            tog_backdrop()
          }} className="dropdown-item">
            <i className="fas fa-lock" style={{ marginRight: "7px" }}></i>
            <span>{props.t("Change Password")}</span>
          </div >
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
