import React, {useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";

import { useSelector } from "react-redux";
import MRPTable from "./Table";

import { loginUserID, loginCompanyID } from "../../../../../components/Common/CommonFunction";
import { customAlert } from "../../../../../CustomAlert/ConfirmDialog";
import { C_DatePicker } from "../../../../../CustomValidateForm";

function MRPTab(props) {

  const [division, setDivision] = useState("");
  const [partyName, setPartyName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [MRP, setMRP] = useState("");

  const { Party, Division } = useSelector((state) => ({
    Division: state.ItemMastersReducer.Division,
    Party: state.ItemMastersReducer.Party,
  }));



  const Party_DropdownOptions = Party.map((data) => ({
    value: data.id,
    label: data.Name,
  }));

  const Division_DropdownOptions = Division.map((data) => ({
    value: data.id,
    label: data.Name,
  }));

  const DivisiontHandler = (event) => {
    setDivision(event);
  };

  const EffectiveDateHandler = (e, date) => {
    setEffectiveDate(date);
  };

  const PartyNameHandler = (event) => {
    setPartyName(event);
  };

  const MRPHandler = (event) => {
    setMRP(event.target.value);
  };

  const addRowsHandler = (e) => {

    const val = {
      Division: division === "" ? "" : division.value,
      DivisionName: division.label,
      PartyName: partyName.label,
      Party: partyName === "" ? "" : partyName.value,
      EffectiveDate: effectiveDate,
      MRP: MRP,
      CreatedBy: loginUserID(),
      UpdatedBy: loginUserID(),
      Company: loginCompanyID(),
      IsDeleted: 0,
      CommonID: 0,
      IsAdd: true
    };

    if (!(effectiveDate === "") && !(MRP === "")) {
      let highestId = -Infinity;
      for (const item of props.tableData) {
          if (item.id !== undefined && item.id > highestId) {
              highestId = item.id;
          }
      }
      val.id = highestId + 1;
      const updatedTableData = [...props.tableData];
      updatedTableData.push(val);
      props.func(updatedTableData);
      clearState();
    } else {
      customAlert({ Type: 4, Message: "Please Enter value" })
    }
  };

  const clearState = () => {
    setDivision("");
    setPartyName("");
    setEffectiveDate("");
    setMRP("");
  };

  return (
    <Row>
      <Col md={12}>
        <Card className="text-black">
          <CardBody className="c_card_body">
            <Row className="mt-3">


              {/* {!(IsSCMCompany === 1) &&
                    <> <div className=" col col-sm-3 ">
                      <Label>Division</Label>
                      <Select
                        id={`dropDivision-${0}`}
                        value={division}
                        styles={{
                          menu: provided => ({ ...provided, zIndex: 2 })
                        }}
                        options={Division_DropdownOptions}
                        onChange={DivisiontHandler}
                      />
                    </div>
                      <div className="mb-3 col col-sm-3 ">
                        <Label>Party Name</Label>
                        <Select
                          id={`dropPartyName-${0}`}
                          value={partyName}
                          styles={{
                            menu: provided => ({ ...provided, zIndex: 2 })
                          }}
                          options={Party_DropdownOptions}
                          onChange={PartyNameHandler}
                        />
                      </div>
                    </>
                  } */}

              <div className="mb-3 col col-sm-3 ">
                <Label>Effective Date</Label>
                <div id={`txtEffectiveDate${0}`}>
                  <C_DatePicker
                    id={`txtEffectiveDate${0}`}
                    value={effectiveDate}
                    placeholder="Please Enter EffectiveDate"
                    onChange={EffectiveDateHandler}
                    options={{
                      altInput: true,
                      altFormat: "d-m-Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                </div>
              </div>

              <div className="mb-3 col col-sm-3 ">
                <Label>MRP</Label>
                <Input
                  type="text"
                  id={`txtMRP${0}`}
                  value={MRP}
                  placeholder="Please Enter MRP"
                  onChange={MRPHandler}
                />
              </div>


              <Col sm={0}>
                <Row className=" mt-3">
                  <Col >
                    <Button

                      //  className="btn btn-sm mt-1 mt-3 btn-light  btn-outline-primary  "
                      className=" button_add"
                      color="btn btn-outline-primary border-2 font-size-12"
                      type="button"
                      onClick={addRowsHandler} >
                      <i className="dripicons-plus"></i>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Row>
          <MRPTable tableData={props.tableData} func={props.func} />
        </Row>
      </Col>
    </Row>
  );
}

export default MRPTab;
