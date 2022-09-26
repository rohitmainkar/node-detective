import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
} from "reactstrap"
import Flatpickr from "react-flatpickr"
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames"
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { AvField, AvForm, AvInput } from "availity-reactstrap-validation"
import Select from "react-select";
import { getPriceListData } from "../../../store/Administrator/PriceList/action";
import {
    postItemData,
    updateItemID
} from "../../../store/Administrator/ItemsRedux/action";
import { getState } from "../../../store/Administrator/M_EmployeeRedux/action"
import { editPartyIDSuccess, getAddressTypes, getCompany, getDistrictOnState, getPartyTypes, getPriceList, postPartyData, postPartyDataSuccess, updatePartyID } from "../../../store/Administrator/PartyRedux/action"
import { AlertState, BreadcrumbShow } from "../../../store/actions"
import Tree from "./Tree"
import AddressDetails_Tab from "."

const PartyMaster = (props) => {
    const dispatch = useDispatch();
    const history = useHistory()

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let propsPageMode = props.pageMode;
    let pageModeProps = props.pageMode;
    console.log("editDataGatingFromList", editDataGatingFromList)

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState(11);
    const [selectedFiles, setselectedFiles] = useState([])
    const [DOB_Date_Select, setDOB_Date_Select] = useState("");
    const [activeTab1, setactiveTab1] = useState("1")
    const [state_DropDown_select, setState_DropDown_select] = useState("");
    const [FSSAIExipry_Date_Select, setFSSAIExipry_Date_Select] = useState("");
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState("");
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [PriceList_dropdown_Select, setPriceList_dropdown_Select] = useState("");
    const [MKupMkdown_DropdownSelect, setMKupMkdown_DropdownSelect] = useState("");
    const [AddressType_DropdownSelect, setAddressType_DropdownSelect] = useState("");
    const [dropOpen, setDropOpen] = useState(false);
    const [priceList, setParicelist] = useState({});
    const [AddressDetailsMaster, setAddressDetailsMaster] = useState([]);
    const toggle1 = tab => {
        if (activeTab1 !== tab) {
            setactiveTab1(tab)
        }
    }

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        State,
        DistrictOnState,
        Company,
        PartyTypes,
        PriceList,
        AddressTypes,
        priceListByPartyType,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        PostAPIResponse: state.PartyMasterReducer.PartySaveSuccess,
        State: state.M_EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        Company: state.PartyMasterReducer.Company,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        PriceList: state.PartyMasterReducer.PriceList,
        AddressTypes: state.PartyMasterReducer.AddressTypes,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
        priceListByPartyType: state.PriceListReducer.priceListByPartyType,

    }));

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

    useEffect(() => {
        dispatch(getState());
        dispatch(getDistrictOnState());
        dispatch(getAddressTypes());
        dispatch(getPriceList());
        dispatch(getPartyTypes());
        dispatch(getCompany());


    }, [dispatch]);


    // MkupMkdown  Dropdown
    const MkupMkdown_DropdownOption = [
        {
            value: 1,
            label: "MKUp",
        },
        {
            value: 2,
            label: "MkDown",
        },
    ];

    useEffect(() => {

        if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            dispatch(BreadcrumbShow(editDataGatingFromList.Name))
            setPageMode(pageModeProps);
            setFSSAIExipry_Date_Select(editDataGatingFromList.FSSAIExipry)

            setDistrict_dropdown_Select({
                value: editDataGatingFromList.District_id,
                label: editDataGatingFromList.DistrictName
            })

            setCompanyList_dropdown_Select({
                value: editDataGatingFromList.Company_id,
                label: editDataGatingFromList.CompanyName
            })

            setPartyType_dropdown_Select({
                value: editDataGatingFromList.PartyType_id,
                label: editDataGatingFromList.PartyTypeName
            })
            setPriceList_dropdown_Select({
                value: editDataGatingFromList.PriceList_id,
                label: editDataGatingFromList.PriceListName
            })
            setState_DropDown_select({
                value: editDataGatingFromList.State_id,
                label: editDataGatingFromList.StateName
            })

            setAddressType_DropdownSelect({
                value: editDataGatingFromList.Address_id,
                label: editDataGatingFromList.AddressName
            })
            setAddressDetailsMaster(editDataGatingFromList.PartyAddress)

            dispatch(editPartyIDSuccess({ Status: false }))
        }
        else if (!(propsPageMode === undefined)) {
            setPageMode(propsPageMode)
        }
    }, [editDataGatingFromList, propsPageMode])


    useEffect(() => {

        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postPartyDataSuccess({ Status: false }))
            setCompanyList_dropdown_Select('')
            setPartyType_dropdown_Select('')
            setPriceList_dropdown_Select('')
            setDistrict_dropdown_Select('')
            setState_DropDown_select('')
            setFSSAIExipry_Date_Select('')
            setAddressType_DropdownSelect('')
            setMKupMkdown_DropdownSelect('')
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
                    RedirectPath: '/PartyList',
                    AfterResponseAction: false
                }))
            }
        }
        else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostAPIResponse.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse.Status])

    const StateValues = State.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const DistrictOnStateValues = DistrictOnState.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const companyListValues = Company.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const PartyTypeDropdown_Options = PartyTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const AddressType_DropdownOption = AddressTypes.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    function handllerState(e) {
        setState_DropDown_select(e)
        dispatch(getDistrictOnState(e.value))
        setDistrict_dropdown_Select('')

    }

    function handllerDistrictOnState(e) {
        setDistrict_dropdown_Select(e)

    }

    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)

    }

    function PartyType_Dropdown_OnChange_Handller(e) {
        setPartyType_dropdown_Select(e)
        // dispatch(GetPartyTypeByDivisionTypeID(e.value))
        // dispatch(GetCompanyByDivisionTypeID(e.value))
        setPriceList_dropdown_Select({label:''})
        setCompanyList_dropdown_Select('')
        dispatch(getPriceListData(e.value))

    }

    // for AddressType dropdown
    const AddressTypes_DropdownSelectHandller = (e) => {
        setAddressType_DropdownSelect(e);
    };


    //for MKupMKdown dropdown
    const MKupMkdown_DropdownSelectHandller = (e) => {
        setMKupMkdown_DropdownSelect(e);
    };

    const test1 = () => {
        return (
            <>



                <Modal
                    isOpen={dropOpen}
                    toggle={() => { setDropOpen(!dropOpen) }}
                    size="sm"
                    centered={true}
                // backdrop={'static'}
                >
                    <div>
                        <div className="text-center mt-2">
                            {/* <Label className="text-primary text-center "> {priceList.label}</Label> */}
                            <Input type="button" className="btn btn-light text-primary"

                                onClick={() => {
                                    // sub_Price_Add_Handler()
                                }}
                                value={PriceList_dropdown_Select.label}
                            />


                        </div>
                        <Tree data={priceListByPartyType} priceList={PriceList_dropdown_Select}
                            func1={setPriceList_dropdown_Select} func2={setDropOpen} />
                    </div>

                </Modal>

            </>
        )
    }

    const FormSubmitButton_Handler = (event, values) => {

        const jsonBody = JSON.stringify({
            Name: values.Name,
            PriceList: PriceList_dropdown_Select.value,
            PartyType: partyType_dropdown_Select.value,
            Company: companyList_dropdown_Select.value,
            PAN: values.PAN,
            Email: values.Email,
            MobileNo: values.MobileNo,
            AlternateContactNo: values.AlternateContactNo,
            State: state_DropDown_select.value,
            District: district_dropdown_Select.value,
            Taluka: 0,
            City: 0,
            GSTIN: values.GSTIN,
            isActive: values.isActive,
            IsDivision: false,
            CreatedBy: 1,
            CreatedOn: "2022-06-24T11:16:53.165483Z",
            UpdatedBy: 1,
            UpdatedOn: "2022-06-24T11:16:53.330888Z",
            PartyAddress: AddressDetailsMaster,

            
        });

        if (pageMode === 'edit') {
            dispatch(updatePartyID(jsonBody, EditData.id));
        }
        else {
            dispatch(postPartyData(jsonBody));
            console.log("jsonBody",jsonBody)
        }
    };

    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };
    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <MetaTags>
                        <title>Item Master| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    <Container fluid>
                        <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v); }}>
                            {/* Render Breadcrumbs */}
                            <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

                            <Row>

                                <Col lg={12}>
                                    <Card className="text-black" >
                                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                                            <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                            <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                                        </CardHeader>
                                        <CardBody>
                                            <Nav tabs className="nav-tabs-custom nav-justified">
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-1"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "1",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("1")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Party Master</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        id="nave-link-2"
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({
                                                            active: activeTab1 === "2",
                                                        })}
                                                        onClick={() => {
                                                            toggle1("2")
                                                        }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        <span className="d-none d-sm-block">Address Details</span>

                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>

                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                    // className={classnames({
                                                    //     active: activeTab1 === "7",
                                                    // })}
                                                    // onClick={() => {
                                                    //     toggle1("7")
                                                    // }}
                                                    >
                                                        <span className="d-block d-sm-none">
                                                            <i className="fas fa-home"></i>
                                                        </span>
                                                        {/* <span className="d-none d-sm-block">Tab7</span> */}
                                                        {/* <Button type="submit"> save</Button> */}
                                                        <Row >
                                                            <Col sm={2}>
                                                                <div>
                                                                    {
                                                                        pageMode === "edit" ?
                                                                            userPageAccessState.RoleAccess_IsEdit ?
                                                                                <button
                                                                                    type="submit"
                                                                                    data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
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
                                                                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
                                                                                        className="btn btn-primary w-md"
                                                                                    > <i className="fas fa-save me-2"></i> Save
                                                                                    </button>
                                                                                    :
                                                                                    <></>
                                                                            )
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                                <TabPane tabId="1">
                                                    <Row>
                                                        <Card className="text-black" style={{ backgroundColor: "whitesmoke" }} >

                                                            <Row className="mt-3 ">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Name </Label>
                                                                        <AvField name="Name" id="txtName"
                                                                            value={EditData.Name}
                                                                            type="text"
                                                                            placeholder="Please Enter Name"
                                                                            // autoComplete='off'
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter Name' },
                                                                            }}
                                                                            onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Mobile Number </Label>
                                                                        <AvField name="MobileNo" type="tel"
                                                                            value={EditData.MobileNo}
                                                                            id="mobileNo"
                                                                            placeholder="Enter Mobile No."
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Enter your Mobile Number' },
                                                                                tel: {
                                                                                    pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                                                                                    errorMessage: "Please Enter 10 Digit Mobile Number."
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>

                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Alternate Contact Number(s)</Label>
                                                                        <AvField name="AlternateContactNo" type="tel"
                                                                            value={EditData.AlternateContactNo}
                                                                            id="mobileNo"
                                                                            // defaultValue={''}
                                                                            placeholder="Alternate Contact Number(s)"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row className="mt-3">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Email </Label>
                                                                        <AvField name="Email" type="email"
                                                                            id="email"
                                                                            value={EditData.Email}
                                                                            placeholder="Enter your Email"
                                                                            validate={{
                                                                                required: { value: true, errorMessage: 'Please Enter your Email' },
                                                                                tel: {
                                                                                    pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/",
                                                                                    errorMessage: "Please Enter valid Email Address.(Ex:abc@gmail.com)"
                                                                                }
                                                                            }
                                                                            }
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Row>
                                                    <Row>
                                                        <Card className=" text-black mt-n2" style={{ backgroundColor: "whitesmoke" }} >
                                                            <Row className="mt-3 ">
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> Party Type </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={partyType_dropdown_Select}
                                                                                options={PartyTypeDropdown_Options}
                                                                                onChange={(e) => { PartyType_Dropdown_OnChange_Handller(e) }}
                                                                            />

                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Price List </Label>

                                                                        {/* <Select
                                                                        value={PriceList_dropdown_Select}
                                                                        options={PriceList_DropdownOptions}
                                                                        onChange={(e) => { handllerPriceList(e) }}
                                                                    /> */}

                                                                        <Input
                                                                            value={PriceList_dropdown_Select.label}
                                                                            placeholder="Select..."
                                                                            onClick={(e) => setDropOpen(!dropOpen)}>
                                                                        </Input>
                                                                        {test1()}





                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="1">  </Col>

                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">Company Name </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={companyList_dropdown_Select}
                                                                                options={companyListValues}
                                                                                onChange={(e) => { handllercompanyList(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                {/* <Col md="3">
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="validationCustom01">CustomerDivision </Label>
                                                            <Col sm={12}>
                                                                <Select
                                                                    value={""}
                                                                    options={""}
                                                                // onChange={(e) => { handllerDesignationID(e) }}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col> */}
                                                                {/* <Col md="1">  </Col> */}
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> PAN </Label>
                                                                        <AvField
                                                                            name="PAN"
                                                                            value={EditData.PAN}
                                                                            placeholder="Please Enter PAN"
                                                                            type="text"
                                                                            errorMessage="Please Enter PAN Number."
                                                                            className="form-control"
                                                                            validate={{
                                                                                required: { value: true },
                                                                                tel: {
                                                                                    pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                                                                    errorMessage: 'Please Enter valid PAN Number.(Ex:AAAAA1234A).'
                                                                                }
                                                                            }}
                                                                            id="validationCustom01"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01"> GSTIN </Label>
                                                                        <AvField
                                                                            name="GSTIN"
                                                                            value={EditData.GSTIN}
                                                                            placeholder="Please Enter GSTIN"
                                                                            type="text"
                                                                            errorMessage="Please Enter GSTIN Number."
                                                                            className="form-control"
                                                                            validate={{
                                                                                required: { value: true },
                                                                                tel: {
                                                                                    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                                                                    errorMessage: 'Please Enter valid GSTIN number.(Ex:27AAAAA0000A1Z5).'
                                                                                }
                                                                            }}
                                                                            id="validationCustom01"
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">MKUp MkDown</Label>
                                                                        <Select
                                                                            value={MKupMkdown_DropdownSelect}
                                                                            options={MkupMkdown_DropdownOption}
                                                                            autoComplete="off"
                                                                            onChange={(e) => {
                                                                                MKupMkdown_DropdownSelectHandller(e);
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">State </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={state_DropDown_select}
                                                                                options={StateValues}
                                                                                onChange={(e) => { handllerState(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1">  </Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Label htmlFor="validationCustom01">District </Label>
                                                                        <Col sm={12}>
                                                                            <Select
                                                                                value={district_dropdown_Select}
                                                                                options={DistrictOnStateValues}
                                                                                onChange={(e) => { handllerDistrictOnState(e) }}
                                                                            />
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="1"></Col>
                                                                <Col md="3">
                                                                    <FormGroup className="mb-3">
                                                                        <Row style={{ marginTop: '25px' }}>
                                                                            <Label
                                                                                htmlFor="horizontal-firstname-input"
                                                                                className="col-sm-4 col-form-label"
                                                                            >
                                                                                Active
                                                                            </Label>
                                                                            <Col md={4} style={{ marginTop: '7px' }} className=" form-check form-switch form-switch-sm ">
                                                                                <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                    <AvInput type="checkbox" className="form-check-input " id="inp-isActive"
                                                                                        checked={EditData.isActive}
                                                                                        defaultChecked={true}
                                                                                        name="isActive"
                                                                                    />
                                                                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="2">
                                                    <Row>
                                                        <Col md={12}  >
                                                            <Row className="mt-3">
                                                                <Col className=" col col-11 ">
                                                                    <AddressDetails_Tab tableData={AddressDetailsMaster} func={setAddressDetailsMaster} />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </TabPane>

                                                <TabPane tabId="3">
                                                   
                                                </TabPane>
                                            </TabContent>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>

                        </AvForm>
                    </Container>
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default PartyMaster;




