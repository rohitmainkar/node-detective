import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    ListGroupItemHeading,
    Progress,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess, } from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import * as pageId from "../../../../routes/allPageID";
import * as mode from "../../../../routes/PageMode";
import { Go_Button, SaveButton } from "../../../../components/Common/CommonButton";
import { breadcrumbReturnFunc, loginCompanyID } from "../../../../components/Common/CommonFunction";
import { comAddPageFieldFunc, formValid, initialFiledFunc, } from "../../../../components/Common/validationFunction";
import { getPartyListAPI } from "../../../../store/Administrator/PartyRedux/action";
import Dropzone from "react-dropzone"
import { readExcelFile } from "./readFile";
import CInput from "../../../../CustomValidateForm/CInput";
import { GoButton_ImportFiledMap_Add, GoButton_ImportFiledMap_AddSuccess } from "../../../../store/Administrator/ImportFieldMapRedux/action";

const UploadExcel = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()


    const [EditData, setEditData] = useState({});
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [preUploadjson, setPreUploadjson] = useState([])
    const [partySelect, SetPartySelect] = useState([])

    const fileds = {
        id: "",
        Party: "",
        ImportType: "",
        PatternType: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [selectedFiles, setselectedFiles] = useState([])


    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        VehicleNumber,
        partyList,
        compareParam = []
    } = useSelector((state) => ({
        postMsg: state.BOMReducer.PostData,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        partyList: state.PartyMasterReducer.partyList,
        compareParam: state.ImportFieldMap_Reducer.addGoButton,
    }));

    useEffect(() => {
        const page_Id = pageId.UPLOAD_EXCEL
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getPartyListAPI());
        dispatch(GoButton_ImportFiledMap_AddSuccess([]));
    }, []);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const PartyDropdown_Options = partyList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));



    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            PartyID: partySelect.value,
            CompanyID: loginCompanyID()
        })
        dispatch(GoButton_ImportFiledMap_Add({ jsonBody }))
    };


    const SaveHandler = (event) => {
        event.preventDefault();
        // const BOMItems = ItemTabDetails.map((index) => ({
        //     Item: index.Item,
        //     Quantity: index.Quantity,
        //     Unit: index.Unit
        // }))
        // if (formValid(state, setState)) {

        //     let BOMrefID = 0
        //     if ((pageMode === mode.edit)) {
        //         BOMrefID = EditData.id
        //     };

        //     const jsonBody = JSON.stringify({
        //         // BomDate: values.BomDate,
        //         // EstimatedOutputQty: values.EstimatedOutputQty,
        //         // Comment: values.Comment,
        //         // IsActive: values.IsActive,
        //         // Item: values.ItemName.value,
        //         // Unit: values.UnitName.value,
        //         // CreatedBy: loginUserID(),
        //         // Company: loginCompanyID(),
        //         // BOMItems: BOMItems,
        //         // IsVDCItem: values.IsVDCItem,
        //         // ReferenceBom: BOMrefID
        //     });



        //     // if (pageMode === mode.edit) {
        //     //     dispatch(updateBOMList(jsonBody, `${EditData.id}/${EditData.Company}`));
        //     // }
        //     // else {
        //     //     dispatch(saveBOMMaster(jsonBody));
        //     // }
        // }
    };


    function upload() {

        var files = selectedFiles;
        if (files.length == 0) {
            alert("Please choose any file...");
            return;
        }
        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.XLS' || extension == '.XLSX' || extension == '.CSV') {
            const exjson = readExcelFile({ file: files[0], compareParam, })

            const btnerify = document.getElementById("btn-verify")
            const btnupload = document.getElementById('btn-upload')

            if (exjson) {
                setPreUploadjson(exjson)
                btnerify.style.display = "none"
                btnupload.style.display = "block"
            }

        } else {
            alert("Please select a valid excel file.");
        }
    }

    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        )
        setselectedFiles(files)
    }
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    }


    // useEffect(() => {
    //     try {


    //         let a = document.getElementById("preloader1")
    //         if (a) {
    //             setTimeout(() => {
    //                 a.style.display = 'none'
    //             }, 7000);
    //         }
    //         let k = document.getElementById("pace-progress1")

    //         if (k) {

    //             let t = 80
    //             let myInterval
    //             setTimeout(() => {
    //                 myInterval = setInterval(myTimer, 500);
    //             }, 4000);

    //             function myTimer() {

    //                 console.log("myInterval")
    //                 t = t + 5

    //                 let b = document.getElementById("pace-progress1")
    //                 
    //                 // let c = document.getElementById("sr-only")

    //                 b.style.width = `${t}%`
    //                 // c.innerText = `${t}%`
    //                 if (t === 100) {
    //                     clearInterval(myInterval)
    //                 }

    //             }


    //         }

    //     } catch (e) { }

    // })


    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <form onSubmit={(event) => SaveHandler(event)} noValidate>
                    <div className="page-content">

                        <div className="px-2 c_card_header text-black" >
                            <div className="px-2   c_card_filter text-black" >
                                <div className="row" >
                                    <Col sm="3">
                                        <FormGroup className="mb-2 row mt-3 " >
                                            <Label className=" p-2"

                                                style={{ width: "115px" }}>{fieldLabel.Party}</Label>
                                            <Col >
                                                <Select
                                                    classNamePrefix="select2-Customer"
                                                    value={partySelect}
                                                    options={PartyDropdown_Options}
                                                    onChange={(e) => { SetPartySelect(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >



                                    <Col md="1"></Col>
                                    <Col sm="2" className="mt-3 ">
                                        <Go_Button
                                            onClick={goButtonHandler}
                                        />
                                    </Col>
                                </div>

                            </div>

                        </div>



                        <div className="mb-3 mt-3">
                            <Container className='p-4'>

                            </Container >

                            <Dropzone
                                onDrop={acceptedFiles => {
                                    handleAcceptedFiles(acceptedFiles)
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="dropzone">
                                        <div
                                            className="dz-message needsclick mt-2"
                                            {...getRootProps()}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="mb-3">
                                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                                            </div>
                                            <h4>Drop files here or click to upload.</h4>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>

                            <div className="dropzone-previews mt-3" id="file-previews">
                                {selectedFiles.map((f, i) => {
                                    return (
                                        <Card
                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                            key={i + "-file"}
                                        >
                                            <div className="p-2 d-flex justify-containt-space-between">

                                                <Row className="align-items-center">
                                                    <Col className="col-auto">
                                                        <img
                                                            data-dz-thumbnail=""
                                                            height="80"
                                                            className="avatar-sm rounded bg-light"
                                                            alt={f.name}
                                                            src={f.preview}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                            to="#"
                                                            className="text-muted font-weight-bold"
                                                        >
                                                            {f.name}
                                                        </Link>
                                                        <p className="mb-0">
                                                            <strong>{f.formattedSize}</strong>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div id="file-proccess" style={{
                                                width: "80%",
                                                paddingRight: "40%",
                                                marginBottom: "10px",
                                                display: "none"
                                            }}>
                                                <div className='progress'>
                                                    <div className='progress-bar progress-bar-animated bg-primary progress-bar-striped'
                                                        id="_progressbar"
                                                        role='progressbar'
                                                        aria-valuenow={10}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ width: '0%' }}>
                                                        <span id='file-proccess-lable'>0% </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>

                        </div>
                        <div className="text-center mt-4" >
                          
                            <button
                                type="button"
                                style={{ display: "none" }}
                                id='btn-upload'
                                className="btn btn-success "
                                onClick={upload}
                            >
                                Upload Files
                            </button>
                            <button
                                type="button"
                                id='btn-verify'
                                className="btn btn-primary "
                                onClick={upload}
                            >
                                Verify Files
                            </button>
                        </div>




                    </div>

                </form>


            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default UploadExcel






