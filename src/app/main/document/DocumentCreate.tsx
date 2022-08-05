import {makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useRef, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {DocumentInfo} from "../../types/UserModel";
import {DialogContentText, Fab, Icon, IconButton, styled} from "@material-ui/core";
import api from "../../services/BackendApi";
import FuseAnimate from "../../../@fuse/core/FuseAnimate/FuseAnimate";
import FileList from "./components/FileList";
import DetailSidebarHeader from "./components/DetailSidebarHeader";
import DetailSidebarContent from "./components/DetailSidebarContent";
import Breadcrumb from "./components/Breadcrumb";
import {useDispatch, useSelector} from 'react-redux';
import DocumentCompanyInfoForm from "../company/components/DocumentCompanyForm";
import UploadDialog from "./components/UploadDialog";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";


const useStyles = makeStyles((theme) => ({

    layoutRoot: {},
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));


function DocumentCreatePage(props: any) {


    const classes = useStyles(props);
    const [DocumentInfo, setDocumentInfo] = useState<DocumentInfo>({} as DocumentInfo);
    const [documentList, setDocumentList] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const formState = useState<DocumentInfo>({} as DocumentInfo);
    const [form] = formState;
    const [uploadDocumentList, setUploadDocumentList] = useState<DocumentInfo[]>([]);
    const [expanded, setExpanded] = React.useState(false);
    //const selectedItem = useSelector(state => selectFileById(state, state.fileManagerApp.files.selectedItemId));
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [selectedItem, setSelectedItem] = useState();
    const pageLayout = useRef(null);
    const [open, setOpen] = useState<boolean>(false);
    const clientId = useSelector(({company}) => company.currentCompanyId);


    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        api.getDocuments(clientId).then(response => {
            setLoading(false);
            setDocumentList(response);
            console.log(selectedItem);
        });
    }, [open]);

    //useEffect(() => {
    //    dispatch(getFiles());
    //}, [dispatch]);


    // setDocumentList(this);


    // function handleFormData(e) {
    //     e.preventDefault();
    //     CompanyInfo.incorprationCompany = IncorprationInfo;
    //     console.log(CompanyInfo);
    // }
    // useEffect(() => {
    //     api.getDocuments().then(response => {
    //         setLoading(false);
    //         console.log(response);
    //         setDocumentList(response);
    //     });
    // }, []);
    useEffect(() => {
        api.getDocuments(clientId).then(response => {
            setLoading(false);
            // setDocumentList(response);
            setIsSuccess(false)
        });
    }, [isSuccess]);

const {t} = useTranslation('documents');
    return (

        <FusePageSimple
            classes={{
                root: 'bg-red',
                header: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
                sidebarHeader: 'h-96 min-h-96 sm:h-160 sm:min-h-160',
                rightSidebar: 'w-320'
            }}
            header={
                <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
                    <div className="flex items-center justify-between">
                        {/*<IconButton*/}
                        {/*    onClick={ev => {*/}
                        {/*        pageLayout.current.toggleLeftSidebar();*/}
                        {/*    }}*/}
                        {/*    aria-label="open left sidebar"*/}
                        {/*>*/}
                        {/*<Icon>menu</Icon>*/}
                        {/*</IconButton>*/}
                        {/*<FuseAnimate animation="transition.expandIn" delay={200}>*/}
                        {/*    <IconButton aria-label="search">*/}
                        {/*        <Icon>search</Icon>*/}
                        {/*    </IconButton>*/}
                        {/*</FuseAnimate>*/}
                        <UploadDialog open={open} setOpen={setOpen}></UploadDialog>
                    </div>
                    <div className="flex flex-1 items-end">
                        <FuseAnimate animation="transition.expandIn" delay={600} >
                            <Fab onClick={handleClickOpen}
                                color="secondary"
                                aria-label="add"
                                className="absolute bottom-30 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999 "
                            >
                                <Icon>add</Icon>
                            </Fab>
                        </FuseAnimate>
                        <FuseAnimate delay={200}>
                            <div>
                                {/*selectedItem && (
                                    <Breadcrumb
                                        //selected={selectedItem}
                                        className="flex flex-1 ltr:pl-72 rtl:pr-72 pb-12 text-16 sm:text-24"
                                    />
                                )*/}
                            </div>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={<FileList pageLayout={pageLayout}
                               documentList={documentList}
                               setDocumentList={setDocumentList}
                               selectedItem={selectedItem}
                               setSelectedItem={setSelectedItem}/>}
            //leftSidebarVariant="temporary"
            //leftSidebarHeader={<MainSidebarHeader />}
            //leftSidebarContent={<MainSidebarContent />}
            // rightSidebarHeader={<DetailSidebarHeader selectedItem={selectedItem}/>}
            // rightSidebarContent={<DetailSidebarContent selectedItem={selectedItem}/>}
            ref={pageLayout}
            innerScroll

        />


    );
}

export const PageContainer = styled('div')(({theme}) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    maxWidth: theme.breakpoints.width('xl'),
    margin: '0 auto',
    padding: theme.spacing(2)
}));

export const PageMain = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    gridTemplateColumns: '2fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr'
    }
}));

export const PageContent = styled('div')(({theme}) => ({
    width: '100%',
    gridTemplateRows: '1fr auto auto',
}));

export default DocumentCreatePage;
