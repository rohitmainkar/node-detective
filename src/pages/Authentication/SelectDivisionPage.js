import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"

import { Row, Col, Container, Button } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { Link, useHistory } from "react-router-dom"
import { getUserDetailsAction, roleAceessAction } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-sm.svg"

//Import config
import CarouselPage from "./CarouselPage"
import Select from "react-select";

const SelectDivisionPage = props => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [divisionDropdowSelect, setDivisionDropdowSelect] = useState(null);

  const { divisionDropdown_redux } = useSelector(state => ({
    loginError: state.Login.loginError,
    divisionDropdown_redux: state.Login.divisionDropdown,
  }))


  useEffect(() => {

    if (!(localStorage.getItem("userId"))) {
      history.push("/login")
    }
    else {
      dispatch(getUserDetailsAction(localStorage.getItem("userId")))
    }
  }, [])

  useEffect(() => {
    // debugger
    if (divisionDropdown_redux.length === 1) {

      let value = divisionDropdown_redux[0]
      let employee = value.Employee_id;
      let party = value.Party_id
      if ((party === null)) {
        party = 0;
        value.Party_id = 0
      }


      localStorage.setItem("roleId", JSON.stringify(value))
      dispatch(roleAceessAction(party, employee))
      history.push("/Dashboard")
    }
  }, [divisionDropdown_redux])


  // const divisionDropdown_DropdownOption = divisionDropdown_redux.filter((d) => {
  //   return !(d.Role_id === null)
  // }).map((d) => ({
  //   value: d.Employee_id,
  //   label: d.PartyName,
  // }));

  const divisionDropdown_DropdownOption = divisionDropdown_redux.map((d, key) => ({
    value: key,
    label: d.PartyName,
  }));

  function goButtonHandller() {

    if (divisionDropdowSelect) {

      let value = divisionDropdown_redux[divisionDropdowSelect.value]
      var employee = value.Employee_id;
      var party = value.Party_id

      localStorage.setItem("roleId", JSON.stringify(value))
      dispatch(roleAceessAction(party, employee))
      history.push("/Dashboard")
    }
    else {
      alert("Please Select Division...!")
      return
    }
  }
  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | FoodERP Live</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">FoodERP</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Select Role to Continue FoodERP.</p>
                      </div>


                      <div className="mb-3">
                        {/* <Label className="form-label font-size-13 "></Label> */}
                        <Select
                          value={divisionDropdowSelect}
                          options={divisionDropdown_DropdownOption}
                          autoComplete="off"
                          onChange={(e) => {
                            setDivisionDropdowSelect(e);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <Button className="btn btn-success bg" onClick={() => {
                          goButtonHandller()
                        }}>GO</Button>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} Minia . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SelectDivisionPage


