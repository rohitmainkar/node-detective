
import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {

    Item_Image_Upload,
    Item_Image_Upload_Success,
    commonPageField,
    commonPageFieldSuccess,
    getItemList,

} from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
} from "../../../../components/Common/validationFunction";

import {

    metaTagLabel
} from "../../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../../routes/index";
import { userAccessUseEffect } from "../../../../components/Common/CommonUseEffect";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import Slidewithcaption from "../../../../components/Common/CommonImageComponent";

const ItemImageUpload = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {

        ItemName: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [Image, setImage] = useState({})
    const [imageTable, setImageTable] = useState([]);  // Selected Image Array
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not





    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        UploadImageLoading,
        ItemList,
        UploadImage,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GroupReducer.saveBtnloading,
            postMsg: state.GroupReducer.postMsg,
            ItemList: state.ItemMastersReducer.ItemList,
            UploadImage: state.ItemMastersReducer.UploadImage,
            UploadImageLoading: state.ItemMastersReducer.UploadImageLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.GROUP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());

    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,

    }), [userAccess]);



    useEffect(() => {

        if (UploadImage.Status === true && UploadImage.StatusCode === 200) {
            dispatch(Item_Image_Upload_Success({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(UploadImage.Message),
            })

        }


    }, [UploadImage])

    useEffect(() => {
        if (imageTable.length > 0) {
            setmodal_backdrop(true)
        }
    }, [imageTable])

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const Items = ItemList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));



    const onchangeHandler = async ({ event, Type, TypeOf }) => {

        const obj = {
            file: event.target.files[0],
            type: Type
        }
        setImage({
            ...Image, [TypeOf]: obj,
        })

    }

    const imageShowHandler = ({ Type }) => { // image Show handler
        debugger
        let slides = []

        Object.values(Image).forEach((element) => {
            if (element.type === Type) {
                slides = [{
                    Image: URL.createObjectURL(element.file)
                }];
            }
        });

        setImageTable(slides)
    }


    const imageUploadHandler = ({ Type }) => {

        if (values.ItemName === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Item",
            })
            return
        }
        const formData = new FormData()
        console.log(Image)
        try {
            formData.append(`Item`, values.ItemName.value);
            formData.append(`ImageType`, Type);
            Object.values(Image).forEach((element) => {
                debugger
                if (element.type === Type) {
                    formData.append(`Item_pic_${values.ItemName.value}`, element.file);
                    dispatch(Item_Image_Upload({ formData }));
                }
            });
        } catch (e) { console.log(e) }


    }


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)

    if ((modalCss) || (pageMode === mode.dropdownAdd));

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Modal
                        isOpen={modal_backdrop}
                        toggle={() => {
                            tog_backdrop()
                        }}

                        style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                        className="modal-dialog-centered "
                    >
                        {(imageTable.length > 0) && <Slidewithcaption Images={imageTable} />}
                    </Modal>
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <CardBody className="  c_card_header text-black mb-2" >

                                    {/* <div className="px-2 c_card_header text-black mb-1"> */}

                                    <Row>
                                        <FormGroup className="mb-3 col col-sm-4 " >
                                            <Label >Item</Label>
                                            <Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={Items}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                        </FormGroup>

                                    </Row>
                                    {/* </div> */}
                                </CardBody>


                                <form noValidate>
                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Front View</Label>
                                                        <Input type="file" className="form-control "
                                                            name="image"
                                                            id="file"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={(event) => { onchangeHandler({ event, Type: 1, TypeOf: "FrontView" }) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 1 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>

                                                <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        onClick={() => {
                                                            imageShowHandler({ Type: 1 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">Show</button>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Side View</Label>
                                                        <Input type="file" className="form-control "
                                                            name="image"
                                                            id="file"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={(event) => { onchangeHandler({ event, Type: 2, TypeOf: "SideView" }) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 2 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>

                                                <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        onClick={() => {
                                                            imageShowHandler({ Type: 2 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">Show</button>
                                                </Col>

                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Top View</Label>
                                                        <Input type="file" className="form-control "
                                                            name="image"
                                                            id="file"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={(event) => { onchangeHandler({ event, Type: 3, TypeOf: "TopView" }) }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 3 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>


                                                <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        onClick={() => {
                                                            imageShowHandler({ Type: 3 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">Show</button>
                                                </Col>

                                            </Row>

                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ItemImageUpload



