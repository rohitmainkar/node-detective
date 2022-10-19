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
    Row,
    Table,
    Button,
    Input,
} from "reactstrap";
import { AvField, AvForm, } from "availity-reactstrap-validation";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShow, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Tbody, Thead } from "react-super-responsive-table";
import { AlertState } from "../../../store/actions";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import {
    PostMethodForVehicleMaster,
    getMethodForVehicleList,
    getMethod_DriverList_ForDropDown,
    getMethod_VehicleTypes_ForDropDown,
    PostMethod_ForVehicleMasterSuccess,
    getMethod_ForVehicleListSuccess,
    editVehicleTypeSuccess,
    updateVehicleTypeID
} from "../../../store/Administrator/VehicleRedux/action";
import { get_Division_ForDropDown, } from "../../../store/Administrator/ItemsRedux/action";
import { useHistory } from "react-router-dom";
// import { actionChannel } from "redux-saga/effects";
import { SaveButton } from "../../../components/CommonSaveButton";
import { VEHICLE_lIST } from "../../../routes/route_url";
import {
    comAddPageFieldFunc,
    formValid,
    onChangeSelect,
    onChangeText
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";


const VehicleMaster = (props) => {
    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let pageModeProps = props.pageMode;
    let propsPageMode = props.pageMode;

    const dispatch = useDispatch();
    const history = useHistory()
    const formRef = useRef(null);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    const [EditData, setEditData] = useState({});
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const [divisionData, setDivisionData] = useState([]);
    const [divisionType_dropdown_Select, setDivisionType_dropdown_Select] = useState("");
    const [DriverList_dropdown_Select, setDriverList_dropdown_Select] = useState("");
    const [VehicleType_dropdown_Select, setVehicleType_dropdown_Select] = useState("");

    const [state, setState] = useState({
        values: {
            id: "",
            VehicleNumber: "",
            Description: "",
            DriverName: "",
            Vehicletype: "",
            VehicleDivisions: ""
        },
        fieldLabel: {
            VehicleNumber: "",
            Description: "",
            DriverName: "",
            Vehicletype: "",
            VehicleDivisions: ""
        },

        isError: {
            VehicleNumber: "",
            Description: "",
            DriverName: "",
            Vehicletype: "",
            VehicleDivisions: ""
        },

        hasValid: {
            VehicleNumber: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            Description: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            DriverName: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },
            Vehicletype: {
                regExp: '',
                inValidMsg: "",
                valid: false
            },

            VehicleDivisions: {
                regExp: '',
                inValidMsg: "",
                valid: false
            }
        },
        required: {

        }
    }
    )


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PostAPIResponse,
        VehicleList,
        Divisions,
        VehicleTypes,
        pageField,
        DriverList_redux,
        userAccess } = useSelector((state) => ({
            PostAPIResponse: state.VehicleReducer.PostDataMessage,
            VehicleList: state.VehicleReducer.VehicleList,
            Divisions: state.ItemMastersReducer.Division,
            VehicleTypes: state.VehicleReducer.VehicleTypes,
            DriverList_redux: state.VehicleReducer.DriverList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));


    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty("editValue")
    const hasShowModal = props.hasOwnProperty("editValue")

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(29))
    }, []);   



    useEffect(() => {
        //  dispatch(PostMethodForVehicleMaster());
        dispatch(getMethodForVehicleList());
        dispatch(getMethod_DriverList_ForDropDown());
        dispatch(getMethod_VehicleTypes_ForDropDown());
        dispatch(get_Division_ForDropDown());
    }, [dispatch]);



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

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

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
                setEditData(hasEditVal)
                setDriverList_dropdown_Select({
                    value: hasEditVal.Driver,
                    label: hasEditVal.DriverName
                });
                setVehicleType_dropdown_Select({
                    value: hasEditVal.VehicleType,
                    label: hasEditVal.VehicleTypeName
                });
                let division = hasEditVal.VehicleDivisions.map((index) => {
                    return {
                        label: index.DivisionName,
                        value: index.Division
                    }
                })
                setDivisionData(division)
                dispatch(editVehicleTypeSuccess({ Status: false }))
                dispatch(BreadcrumbShow(hasEditVal.VehicleTypeName))

            }
        }

    }, []);


    useEffect(() => {
        if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200)) {

            dispatch(PostMethod_ForVehicleMasterSuccess({ Status: false }))
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
                    RedirectPath: VEHICLE_lIST,
                }))
            }
        }
        else if (PostAPIResponse.Status === true) {
            dispatch(getMethod_ForVehicleListSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMessage.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostAPIResponse])

    useEffect(() => {

        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const DivisionType_DropdownOptions = Divisions.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DivisionType_DropDown_handller(e) {
        setDivisionType_dropdown_Select(e)
    }

    const DriverList_DropdownOptions = DriverList_redux.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function DriverList_DropDown_handller(e) {
        setDriverList_dropdown_Select(e)
    }

    const VehicleType_DropdownOptions = VehicleTypes.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    function VehicleType_DropDown_handller(e) {
        setVehicleType_dropdown_Select(e)
    }

    // const VehicleList_DropdownOptions = VehicleList_redux.map((data) => ({
    //     value: data.id,
    //     label: data.Name
    // }));

    // function VehicleList_DropDown_handller(e) {
    //     setVehicleList_dropdown_Select(e)
    // }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if (formValid(state, setState)) {
            var division = divisionData.map(i => ({ Division: i.value }))
            const jsonBody = JSON.stringify({
                VehicleNumber: values.VehicleNumber,
                Description: values.Description,
                Driver: DriverList_dropdown_Select.value,
                VehicleType: VehicleType_dropdown_Select.value,
                Divisions: division,
            });


            if (pageMode === 'edit') {
                dispatch(updateVehicleTypeID(jsonBody, values.id));
            }
            else {
                dispatch(PostMethodForVehicleMaster(jsonBody));

            }
        }
    };

    /// Role Table Validation
    function AddDivisionHandler() {
        const find = divisionData.find((element) => {
            return element.value === divisionType_dropdown_Select.value
        });

        if (divisionType_dropdown_Select.length <= 0) {
            dispatch(AlertState({
                Type: 3, Status: true,
                Message: "Select One Role",
            }));
        }
        else if (find === undefined) {
            setDivisionData([...divisionData, divisionType_dropdown_Select]);
        }
        else {
            dispatch(AlertState({
                Type: 4, Status: true,
                Message: "DivisionType already Exists ",
            }));
        }
    }


    // For Delete Button in table
    function UserRoles_DeleteButton_Handller(tableValue) {
        setDivisionData(divisionData.filter(
            (item) => !(item.value === tableValue)
        )
        )
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                    <Container fluid>
                        <MetaTags>
                            <title>{userPageAccessState.PageHeading}  | FoodERP-React FrontEnd</title>
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


                                                    <Row className="mt-3">
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.DriverName} </Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        id="DriverDropDown "
                                                                        // disabled={true}
                                                                        name="DriverName"
                                                                        value={values.Driver}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={DriverList_DropdownOptions}
                                                                        onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                    />
                                                                    {isError.DriverName.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.DriverName}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>


                                                        <Col md="1">  </Col>
                                                        <Col md="3">
                                                            <FormGroup className="mb-3">
                                                                <Label htmlFor="validationCustom01"> {fieldLabel.Vehicletype}</Label>
                                                                <Col sm={12}>
                                                                    <Select
                                                                        id="VehicleDropDown "
                                                                        // disabled={true}
                                                                        name="Vehicletype"
                                                                        value={values.Vehicle}
                                                                        isSearchable={false}
                                                                        className="react-dropdown"
                                                                        classNamePrefix="dropdown"
                                                                        options={VehicleType_DropdownOptions}
                                                                        onChange={(v, e) => onChangeSelect({ e, v, state, setState })}
                                                                    />
                                                                    {isError.Vehicletype.length > 0 && (
                                                                        <span className="text-danger f-8"><small>{isError.Vehicletype}</small></span>
                                                                    )}
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>


                                                        <Col md="1">
                                                        </Col>
                                                        <Col md="4">
                                                            <FormGroup className="mb-2 col col-sm-8 ">
                                                                <Label htmlFor="validationCustom01">{fieldLabel.VehicleNumber} </Label>
                                                                <Input
                                                                    name="VehicleNumber"
                                                                    id="VehicleNumber"
                                                                    value={values.VehicleNumber}
                                                                    type="text"
                                                                    className={isError.VehicleNumber.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                    placeholder="Please Enter VehicleNumber"
                                                                    autoComplete='off'
                                                                    onChange={(event) => {
                                                                        onChangeText({ event, state, setState })
                                                                        dispatch(BreadcrumbShow(event.target.value))
                                                                    }}
                                                                />
                                                                {isError.VehicleNumber.length > 0 && (
                                                                    <span className="invalid-feedback">{isError.VehicleNumber}</span>
                                                                )}
                                                            </FormGroup>

                                                        </Col>

                                                        <Row>
                                                            <Col md="3">
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom01"> {fieldLabel.Description} </Label>
                                                                    <Input
                                                                        name="Description"
                                                                        id="Description"
                                                                        value={values.Description}
                                                                        type="text"
                                                                        className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                                        placeholder="Please Enter Description"
                                                                        autoComplete='off'
                                                                        onChange={(event) => {
                                                                            onChangeText({ event, state, setState })
                                                                            dispatch(BreadcrumbShow(event.target.value))
                                                                        }}
                                                                    />
                                                                    {isError.Description.length > 0 && (
                                                                        <span className="invalid-feedback">{isError.Description}</span>
                                                                    )}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <FormGroup className="col col-sm-3">
                                                            <Label htmlFor="validationCustom21">Division</Label>
                                                                <Select
                                                                    value={divisionType_dropdown_Select}
                                                                    options={DivisionType_DropdownOptions}
                                                                    onChange={(e) => { DivisionType_DropDown_handller(e) }}
                                                                />
                                                            </FormGroup>
                                                            <Col sm={1} style={{ marginTop: '28px' }} >
                                                                {" "}
                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary"
                                                                    onClick={() =>
                                                                        AddDivisionHandler()
                                                                    }
                                                                >
                                                                    <i className="dripicons-plus "></i>
                                                                </Button>
                                                            </Col>
                                                            <Col sm={3} style={{ marginTop: '28px' }}>
                                                                {divisionData.length > 0 ? (

                                                                    <div className="table-responsive">
                                                                        <Table className="table table-bordered  text-center">
                                                                            <Thead >
                                                                                <tr>
                                                                                    <th>Division Type</th>

                                                                                    <th>Action</th>
                                                                                </tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {divisionData.map((TableValue) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            {TableValue.label}
                                                                                        </td>
                                                                                        <td>
                                                                                            <i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                                                                UserRoles_DeleteButton_Handller(TableValue.value)
                                                                                            }} >
                                                                                            </i>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </Tbody>
                                                                        </Table>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                    </>
                                                                )}
                                                            </Col>
                                                        </Row>

                                                        <FormGroup>
                                                            <Row>
                                                                <Col sm={2}>
                                                                    {SaveButton({ pageMode, userPageAccessState, module: "VehicleMaster" })}
                                                                </Col>
                                                            </Row>
                                                        </FormGroup >
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

export default VehicleMaster

