import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
} from "reactstrap";
import {
    AvForm,
    AvGroup,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
    PostModelsSubmit,
    updateModuleID,
    PostModelsSubmitSuccess,
    editModuleIDSuccess,
} from "../../../store/Administrator/ModulesRedux/actions";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { MetaTags } from "react-meta-tags";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const Modules = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);

    //'IsEdit'--if true then update data otherwise it will perfrom save operation
    const [IsEdit, setIsEdit] = useState(false);
    const [PageMode, setPageMode] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    let CheckPageMode = props.IsComponentMode;

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { APIResponse, } = useSelector((state) => ({
        APIResponse: state.Modules.modulesSubmitSuccesss,
    }));

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        document.getElementById("txtName").focus();
        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            setIsEdit(true);
            dispatch(editModuleIDSuccess({ Status: false }))
            return
        }
        if (!(CheckPageMode === undefined)) {
            setPageMode(true)
            return
        }
    }, [editDataGatingFromList, CheckPageMode])

    // This UseEffect clear Form Data and when modules Save Successfully.
    useEffect(() => {
        if ((APIResponse.Status === true) && (APIResponse.StatusCode === 200)) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
            formRef.current.reset();
            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: APIResponse.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: APIResponse.Message,
                    RedirectPath: '/modulesList',

                }))
            }
        } else if (APIResponse.Status === true) {
            dispatch(PostModelsSubmitSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: "error Message",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [APIResponse.Status])

    //'Save' And 'Update' Button Handller
    const handleValidSubmit = (event, values) => {
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                DisplayIndex: values.DisplayIndex,
                IsActive: values.IsActive,
                Icon: values.Icon,
                CreatedBy: 9,
                UpdatedBy: 9
            }),
        };
        if (IsEdit) {
            dispatch(updateModuleID(requestOptions.body, EditData.ID));
        }
        else {
            dispatch(PostModelsSubmit(requestOptions.body));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true || PageMode == true) { IsEditMode_Css = "-3.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>Modules| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Module Page "} />
                <Container fluid  >
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody >
                                    <AvForm onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                                        ref={formRef}
                                    >
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Name
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Name" id="txtName" value={EditData.Name}
                                                        type="text"
                                                        placeholder="Please Enter Name"
                                                        autoComplete='off' validate={{
                                                            required: { value: true, errorMessage: 'Please enter a Name' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Display Index
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="DisplayIndex" autoComplete='off'
                                                        placeholder="Please Enter DisplayIndex"
                                                        value={EditData.DisplayIndex} type="number"
                                                        validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Display Index is Required' },
                                                            tel: {
                                                                pattern: /^\d{1,4}$/,
                                                                errorMessage: 'Display Index is Required (Only Two Digit) '
                                                            }
                                                        }}
                                                    />

                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    IconPath
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Icon"
                                                        autoComplete='off'
                                                        placeholder="Please Enter IconPath"
                                                        value={EditData.Icon} type="text" validate={{
                                                            required: { value: true, errorMessage: 'Please enter a Icon' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    IsActive
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="IsActive"
                                                        checked={(EditData.ID === 0) ? false : EditData.IsActive}
                                                        type="checkbox" validate={{
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                    {
                                                        IsEdit ? (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
                                                                className="btn btn-success w-md"
                                                            >
                                                                <i class="fas fa-edit me-2"></i>Update
                                                            </button>) : (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default Modules
