import {makeStyles ,useTheme ,Theme ,createStyles ,withStyles ,ThemeProvider} from '@material-ui/core/styles';
import React, {useState ,useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Grid, Paper, styled, Icon, LinearProgress} from "@material-ui/core";
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {Div} from 'app/components/Grid';
import {ClientDTO, NoticeLogDTO, NotificationCreateDTO  }  from 'app/types/UserModel'
import Checkbox from '@material-ui/core/Checkbox';
import {Button, FormControlLabel} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Textfield from   '@material-ui/core/TextField'
import api from "../../services/BackendApi";
import history from "../../../@history/@history";
import { withSnackbar } from 'notistack';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FuseAnimate from '@fuse/core/FuseAnimate';
import IconButton from '@material-ui/core/IconButton';
import MailOutlineIcon from '@material-ui/icons/MailOutline'

import {useFormik} from "formik";
import {notificationCreateSettingsScheme} from "../validations/ValidationSchemes";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import Input from "@material-ui/core/Input";
import _, {concat} from "lodash";
import clsx from 'clsx';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { useSelector } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import ReactExport from "react-export-excel";

import {
    FormControl,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Tooltip,
    TableContainer,
    TextField
} from '@material-ui/core';
import i18n from "i18next";
import ForExcelNotification from "./ForExcelNotification";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const useStyles = makeStyles(theme => ({
    layoutRoot: {

    },
    paper: {
        padding: theme.spacing(4),
        textAlign: 'center',
        color: '#172a3a',
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"},
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        // fontWeight: theme.typography.fontWeightRegular,
    },
    rootProgress:{
        flexGrow: 15,
        padding: 11,
        marginTop: 1,
    }
}));

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);

function ProductsTableHead(props) {

    const classes = useStyles(props);
    const {selectedMail, setSelectedMail, selected, setSelected, list} = props;
    const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);



    // const { onSelectAllClick } = props;
    const {t} = useTranslation('task');
    const createSortHandler = property => event => {
        props.onRequestSort(event, property);
    };

    const rows = [


        {
            id: 'checkbox',
            align: 'left',
            disablePadding: false,
            label:t(""),
            sort: true
        },
        {
            id: 'companyname',
            align: 'left',
            disablePadding: false,
            label:t("COMPANYNAME"),
            sort: true
        },
        {
            id: 'firstandlastname',
            align: 'left',
            disablePadding: false,
            label:t("FIRSTANDLASTNAME"),
            sort: true
        },
        {
            id: 'director',
            align: 'Left',
            disablePadding: false,
            label:t("DIRECTORNAME"),
            sort: true
        },
        {
            id: 'email',
            align: 'left',
            disablePadding: false,
            label:t("DIRECTOREMAIL"),
            sort: true
        },


    ];

    function openSelectedProductsMenu(event) {
        setSelectedProductsMenu(event.currentTarget);
    }

    function closeSelectedProductsMenu() {
        setSelectedProductsMenu(null);
    }

    function onSelectAllClick(event, checked) {
        if(checked){
            setSelectedMail(list)
        }
        else{
            setSelectedMail([])
        }
    }

    return (
        <TableHead>
            <TableRow className="h-64">
                <TableCell padding="none" className="w-40 md:w-64 text-center z-99">

                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedMail?.length == list?.length ? true : false}
                            onChange={ (e,checked) => {
                                onSelectAllClick(e ,checked)
                            }}
                            style={{ color : '#172a3a'}}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </TableCell>
                    {props.numSelected > 0 && (
                        <div
                            className={clsx(
                                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
                                // classes.actionsButtonWrapper
                            )}
                        >
                            <IconButton
                                aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                                aria-haspopup="true"
                                onClick={openSelectedProductsMenu}
                            >
                                <Icon>more_horiz</Icon>
                            </IconButton>
                            <Menu
                                id="selectedProductsMenu"
                                anchorEl={selectedProductsMenu}
                                open={Boolean(selectedProductsMenu)}
                                onClose={closeSelectedProductsMenu}
                            >
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            closeSelectedProductsMenu();
                                        }}
                                    >
                                        <ListItemIcon className="min-w-40">
                                            <Icon>delete</Icon>
                                        </ListItemIcon>
                                        <ListItemText primary="Remove"/>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    )}
                </TableCell>
                {rows.map(row => {
                    return (
                        <TableCell
                            className="p-12 md:p-16"
                            key={row.id}
                            //@ts-ignore
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {  row.sort &&row.label   }
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

function UserCreatePage(props) {

    const classes = useStyles(props);
    const [clientTypes, setClientTypes] = useState([]);
    const [aggTypes, setAggTypes] = useState([]);
    const [isVats, setIsVats] = useState(null);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [selectedMail, setSelectedMail] = useState<ClientDTO[]>([]);
    const [selected, setSelected] = useState<ClientDTO[]>([]);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [page, setPage] = React.useState(0);

    const mainTheme = useSelector(selectMainTheme);
    const [search, setSearch] = useState<string>("");  // Başlangıç değerleri ""
    const [disabled, setDisabled] = useState<boolean>(true);
    const [checkedButton, setCheckedButton] = useState<boolean>(false);

    const [order, setOrder] = useState({
        direction: 'asc',
        id: null
    });

    // const formState = useState<notific>({} as notific);
    const [notif,setNotif]=useState<NoticeLogDTO>({
        soleTrade:false,
        limited:false,
        selfAssesment:false,
        trading:false,
        ECAA:false,
        other:false,
        vat:false,
        mail:false,
        sms:false,
        app:false,
        subject:"",
        content:"" } as NoticeLogDTO );
    const [value, setValue] = useState<NoticeLogDTO>({} as NoticeLogDTO);
    //Email göndermek istediğinde Subject & Content kısımlarının boş olmaması için doğrulama ekliyorum.
    const formik = useFormik({
        initialValues: {
            subject:'',
            content:'',
            soleTrade:false,
            limited:false,
            selfAssesment:false,
            trading:false,
            ECAA:false,
            other:false,
            vat:false,
            mail:false,
            sms:false,
            app:false,
        },
        validationSchema: notificationCreateSettingsScheme,
        onSubmit: (values) => {
            sendNotification(values);
        },
    });
    const [expanded, setExpanded] = React.useState("");
    const [expandedSecond, setExpandedSecond] = React.useState("panel1");
    const [progress, setProgress] = React.useState(0);
    const [file, setFile] = React.useState<File>(null);

    const sendNotification = (values) => {
        let notificationSend = new  NoticeLogDTO();
        if(selectedMail.length === 0){
            setDisabled(true);
            return props.enqueueSnackbar( <h4>{t('NOTIFICATIONSELECTMAILS')}</h4>,{variant:'info',});
        }
        else {
            setDisabled(true);
        }

        setDisabled(true);

        value.content = formik.values.content;
        value.subject = formik.values.subject;
        value.soleTrade = notif.soleTrade;
        value.limited = notif.limited;
        value.selfAssesment = notif.selfAssesment;
        value.trading = notif.trading;
        value.ECAA = notif.ECAA;
        value.other = notif.other;
        value.vat = notif.vat;
        value.app = notif.app;
        value.sms = notif.sms;
        value.mail = notif.mail;

        //Dökümansız Notification create işlemi gerçekleştiriyor ...
        //@ts-ignore
        notificationSend = {
            soleTrade:value.soleTrade,
            limited:value.limited,
            selfAssesment:value.selfAssesment,
            trading:value.trading,
            ECAA:value.ECAA,
            other:value.other,
            vat:value.vat,
            mail:true, //Yeni bildirim seçenekleri gelidğinde aktif veri kullanılacak
            sms:false,
            app:false,
            content:value.content,
            subject:value.subject,
            clientList:selectedMail
        }

        console.log("Notification Send Data :",notificationSend);
        console.log("Submit Edildiğinde Email Listesi :",selectedMail);
        console.log("Submit Edildiğindeki Doküman:",file);

        // file.size > 20971520
        if (file !== null && file.size > 20971520){
            // Kullanıcı 20MB ' dan yüksek veri yüklemeyecek !
            props.enqueueSnackbar(
                <h4>{t("FILESIZE")}</h4>
                ,{variant:'error',}
            );
            // 3 Saniye sonra ekran yenileniyor ...
            setTimeout(function(){
                window.location.reload();
            }, 4000);
        }
        else {
            api.notificationCreateWithFile(notificationSend, file, progressCallback).then(res => {
                props.enqueueSnackbar(
                    <h4>{t('NOTIFICATIONSHASBEENSENT')}</h4>
                    ,{variant:'success',});
                history.push("/notification");
            }).catch(
                error => {
                    props.enqueueSnackbar(
                        <h4>{t('NOTIFICATIONSCOULDNTSEND')}</h4>
                        ,{variant:'error',});
                })
        }
    };

    const handleChange1 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,[e.target.name]:true})
            clientTypes.push(e.target.name)
        }else{
            setNotif({...notif,[e.target.name]:false})
            clientTypes.splice(clientTypes.indexOf(e.target.name), 1)
        }
        setClientTypes(clientTypes)
    };
    const handleChange2 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,limited:true})
        }else{
            setNotif({...notif,limited:false})
        }
    };
    //Dosya işlemleri için eklenmiş kod
    const handleChangeFiles = (event) => {
        event.target.value = null;
        setProgress(0);
        // setFileDescription(event.target.value)
        // console.log(document)
    };
    //Dosya işlemleri için eklenmiş kod
    const handleFileChange = (event) => {
        // console.log("handle File Change : ",event.target.files[0]);
        setFile(event.target.files[0]);
    }
    //Dosya işlemleri için eklenmiş kod
    const progressCallback = (loaded: number, total: number) => {
        setProgress(Math.round((loaded / total) * 100))
    };

    const handleChange3 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,selfAssesment:true})
        }else{
            setNotif({...notif,selfAssesment:false})
        }
    };
    const handleChange4 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,[e.target.name]:true})
            aggTypes.push(e.target.name)
        }else{
            setNotif({...notif,[e.target.name]:false})
            aggTypes.splice(aggTypes.indexOf(e.target.name), 1)
        }
        setAggTypes(aggTypes)
    };
    const handleChange5 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,ECAA:true})
        }else{
            setNotif({...notif,ECAA:false})
        }
    };
    const handleChange6 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,other:true})
        }else{
            setNotif({...notif,other:false})
        }
    };
    const handleChange7 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,vat:true})
            setIsVats(e.target.value)

        }else{
            setNotif({...notif,vat:false})
            setIsVats(null)
        }
    };
    const handleChange8 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,mail:true})
        }else{
            setNotif({...notif,mail:false})
        }
    };
    const handleChange9 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,sms:true})
        }else{
            setNotif({...notif,sms:false})
        }
    };
    const handleChange10 = (e)=> {
        if(e.target.checked){
            setNotif({...notif,app:true})
        }else{
            setNotif({...notif,app:false})
        }
    };

    const {t}=useTranslation('task')
    const handleSubmit = ()=> {

        // console.log(notif)
        // api.notificationCreate(notif).then(res=>{
        //     props.enqueueSnackbar(<h4>{t('NOTIFICATIONSHASBEENSENT')}</h4>, {variant: 'success',});
        //     history.push("/notification");
        //     setNotif(notif);
        // }).catch(error => {
        //     props.enqueueSnackbar(<h4>{t('NOTIFICATIONSCOULDNTSEND')} </h4>, {variant: 'error',});
        // })

    };

    //Tüm kullanıcıları listeyen buton
    // function handleAllClientsClick (panel)  {
    //     //ShowList Butonuna tıklandığı zaman panel2 açılıyor gerçekleşen işlemler.
    //     if (expanded == panel){
    //         setExpanded("");
    //     }
    //     else{
    //         setExpanded(panel);
    //     }
    //
    //     // clientTypes
    //     // aggTypes
    //     // isVats
    //
    //     console.log("Notification List Data Deteails :" ,notif);
    //     console.log("Notification Vats :" ,isVats);
    //     console.log("Notification ClientType :" ,clientTypes);
    //     console.log("Notification Aggrement Type :" ,aggTypes);
    //
    //     //Mail Send Butonu aktif oluyor ...
    //     setDisabled(false);
    //     api.getClientByFilter(clientTypes.length <1 ? 'LIMITED,SOLETRADE,SELFASSESMENT':clientTypes?.toString()
    //                                 , aggTypes.length <1 ? 'ECAA,OTHER,TRADING':aggTypes?.toString()
    //                                 , isVats).then(
    //         res=>{
    //             setNotif(notif);
    //             setList(res);
    //             setFilteredList(res);
    //             setSelectedMail(res)
    //             console.log("Gelen Res-Datası List Datası : ",res);
    //         })
    // };

    const [isEditable, setIsEditable] = useState(false);
    // Bireysel seçim yapıp listeleme yaptığında çalışacak buton
    function handleClick (panel)  {
        //ShowList Butonuna tıklandığı zaman panel2 açılıyor gerçekleşen işlemler.
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
        setIsEditable(true);

        api.getClientByFilter(clientTypes.length <1 ? '':clientTypes?.toString()
                                            , aggTypes.length <1 ? '':aggTypes?.toString()
                                            , isVats).then(
            res=>{
                setNotif(notif);
                setList(res);
                setFilteredList(res);
                setSelectedMail(res);
                //Mail Send Butonu aktif oluyor ...
                setDisabled(false);
            })
    };

    function handleClickAcordion(panel){
        if (expanded == panel){
            setExpanded("");
        }
        else{
            setExpanded(panel);
        }
    }
    function handleClickSecondAcordion(panel){
        if (expandedSecond == panel){
            setExpandedSecond("");
        }
        else{
            setExpandedSecond(panel);
        }
    }
    const [valueRadio, setValueRadio] = React.useState('female');
    const handleChange = (event) => {
        setValueRadio(event.target.value);
    };

    function handleRequestSort(event, property) {
        const id = property;
        let direction = 'desc';

        if (order.id === property && order.direction === 'desc') {
            direction = 'asc';
        }

        setOrder({
            direction,
            id
        });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

   /* function handleClickSearch(search) {

        setFilteredList( list?.filter( client =>

                                        client.company?.name?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

                                        client.founderOwner?.tradeAsName?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

                                        client.customerClients?.[0].customerInfo?.userInfo?.name?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||

                                        client.customerClients?.[0].customerInfo?.userInfo?.surname?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||

                                        client.founderOwner?.email?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

                                        client.company?.directorDetails?.find( detail =>
                                            detail?.email?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||
                                            detail?.name?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1  ||
                                            detail?.surname?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1)
        ))

        setPage(0)
    }*/
    function handleChangeSearch(search) {

        setFilteredList( list?.filter( client =>

            client.company?.name?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

            client.founderOwner?.tradeAsName?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

            client.customerClients?.[0].customerInfo?.userInfo?.name?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||

            client.customerClients?.[0].customerInfo?.userInfo?.surname?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||

            client.founderOwner?.email?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1 ||

            client.company?.directorDetails?.find( detail =>
                detail?.email?.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||
                detail?.name?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1  ||
                detail?.surname?.toLocaleLowerCase()?.indexOf(search.toLocaleLowerCase()) > -1)
        ))

        setPage(0)
    }


    function handleClear() {
        setPage(0)
        setSearch("");
        handleChangeSearch("")
    }

    function handleCheckBox ( event ,checked, listOfData){

        if(checked && !selectedMail.includes(listOfData)){
            setSelectedMail(oldSelected => [...oldSelected, listOfData])

        }
        else if(!checked && selectedMail.includes(listOfData)) {
            setSelectedMail(selectedMail.filter(item => item.id !== listOfData.id))
        }
    }

    useEffect(() => {
        console.log("Selected Mail :" , selectedMail);
        console.log("Selected :" , selected);
    },[selectedMail , selected]);

    useEffect(() => {
        handleChangeSearch(search)
    },[search]);

    // @ts-ignore
    return (
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={

                <div className="flex flex-1 items-center justify-left px-12">
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">add_alert</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t('NOTIFICATIONCREATE')}
                            </Typography>
                        </FuseAnimate>
                    </div>
                </div>

            }
            content={
                <PageContainer>
                    <PageMain>
                        <PageContent>
                            <div>{/*className={classes.root}*/}
                                <Grid item container  spacing={3}>
                                    <Grid  item xs={12}>
                                        <Paper className={classes.paper}>
                                            <Grid item container
                                                  direction="row"
                                                  justify="flex-start"
                                                  alignItems="flex-start"
                                                  spacing={3}>
                                                <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <div style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                            <label>{t('CLIENTTYPE')}</label>
                                                        </div>
                                                        <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                            <div style={{textAlign:"left", padding:"8px"}}>
                                                                <FormControlLabel
                                                                    control={

                                                                        <Checkbox

                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange1}
                                                                            name="SOLETRADER"
                                                                            style={{ color : '#172a3a'}}
                                                                        />
                                                                    }
                                                                    label={t('SOLETRADER')}
                                                                />
                                                                <FormControlLabel

                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange1}
                                                                            name="LIMITED"
                                                                            style={{ color : '#172a3a'}}
                                                                        />
                                                                    }
                                                                    label={t('LIMITED')}
                                                                />
                                                                <FormControlLabel

                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange1}
                                                                            name="SELFASSESMENT"
                                                                            style={{ color : '#172a3a'}}
                                                                        />
                                                                    }
                                                                    label={t('SELFASSESMENTNOTI')}
                                                                />
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                </FuseAnimate>

                                                <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <div  style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                            <label>{t('AGREEMENTTYPE')}</label>
                                                        </div>

                                                        <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                            <div style={{textAlign:"left", padding:"8px"}}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange4}
                                                                            name="TRADING"
                                                                            style={{ color : '#172a3a'}}
                                                                        />
                                                                    }
                                                                    label={t('TRADING')}
                                                                /><br/>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange4}
                                                                            name="ECAA"
                                                                            style={{ color : '#172a3a'}}
                                                                        />}
                                                                    label={t("ECAA")}
                                                                /><br/>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange4}
                                                                            name="OTHER"
                                                                            style={{ color : '#172a3a'}}
                                                                        />}
                                                                    label={t("OTHERNOTI")}
                                                                />
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                </FuseAnimate>

                                                <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <div  style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                            <label >{t('VAT')}</label>
                                                        </div>

                                                        <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                            <div style={{textAlign:"left", padding:"8px"}}>

                                                                <RadioGroup aria-label="gender" name="gender1" value={valueRadio} onChange={handleChange}>
                                                                    <FormControlLabel
                                                                        value={"1"}
                                                                        control={
                                                                            <Radio style={{ color : '#172a3a'}}
                                                                                   onChange={handleChange7}
                                                                            />
                                                                        }
                                                                        label={t("VAT")} />
                                                                    <FormControlLabel
                                                                        value={"0"}
                                                                        control={<Radio style={{ color : '#172a3a'}}
                                                                                        onChange={handleChange7}/>}
                                                                        label={t("NOTVAT")} />
                                                                    <FormControlLabel
                                                                        value=""
                                                                        control={
                                                                            <Radio style={{ color : '#172a3a'}}
                                                                                   onChange={handleChange7}/>
                                                                        }
                                                                        label={t("ALL")} />
                                                                </RadioGroup>

                                                                {/*<FormControlLabel*/}
                                                                {/*    control={*/}
                                                                {/*        <Checkbox*/}
                                                                {/*            icon={<CheckBoxOutlineBlankIcon/>}*/}
                                                                {/*            checkedIcon={<CheckBoxIcon/>}*/}
                                                                {/*            onChange={handleChange7}*/}
                                                                {/*            name="checkedH"*/}
                                                                {/*            style={{ color : '#172a3a'}}*/}
                                                                {/*        />*/}
                                                                {/*    }*/}
                                                                {/*    label={t("VAT")}*/}
                                                                {/*/><br/>*/}

                                                                {/*<FormControlLabel*/}
                                                                {/*    control={*/}
                                                                {/*        <Checkbox*/}
                                                                {/*            icon={<CheckBoxOutlineBlankIcon/>}*/}
                                                                {/*            checkedIcon={<CheckBoxIcon/>}*/}
                                                                {/*            onChange={handleChange7}*/}
                                                                {/*            // name="checkedH"*/}
                                                                {/*            style={{ color : '#172a3a'}}*/}
                                                                {/*        />*/}
                                                                {/*    }*/}
                                                                {/*    label={t("NOTVAT")}*/}
                                                                {/*/>*/}
                                                            </div>
                                                        </Paper>

                                                    </Grid>
                                                </FuseAnimate>

                                                <FuseAnimate animation="transition.flipBounceYIn" delay={300}>
                                                    <Grid item xs={12} sm={6} lg={3}>
                                                        <div  style={{textAlign: "center", fontWeight: "bold", fontSize: "20px" , marginBottom:'10px' , textTransform:'uppercase'}}>
                                                            <label >{t('FROMWHERE')} </label>
                                                        </div>

                                                        <Paper elevation={3} style={{margin:"auto", width: "200px", height: "180px"}}>
                                                            <div style={{textAlign:"left", padding:"8px"}}>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={true}
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange8}
                                                                            name="checkedMail"
                                                                            style={{ color : '#172a3a'}}
                                                                        />
                                                                    }
                                                                    label={t("MAIL")}
                                                                /><br/>
                                                                {/*<FormControlLabel*/}
                                                                {/*    disabled={true}*/}
                                                                {/*    control={*/}
                                                                {/*        <Checkbox*/}
                                                                {/*            icon={<CheckBoxOutlineBlankIcon/>}*/}
                                                                {/*            checkedIcon={<CheckBoxIcon/>}*/}
                                                                {/*            onChange={handleChange9}*/}
                                                                {/*            name="checkedJ"*/}
                                                                {/*            style={{ color : '#172a3a'}}*/}
                                                                {/*        />*/}
                                                                {/*    }*/}
                                                                {/*    label={t("SMS")}*/}
                                                                {/*/><br/>*/}
                                                                <FormControlLabel
                                                                    disabled={true}
                                                                    control={
                                                                        <Checkbox
                                                                            icon={<CheckBoxOutlineBlankIcon/>}
                                                                            checkedIcon={<CheckBoxIcon/>}
                                                                            onChange={handleChange10}
                                                                            style={{ color : '#172a3a'}}
                                                                            name="checkedK"
                                                                        />
                                                                    }
                                                                    label={t("APP")}
                                                                />
                                                            </div>
                                                        </Paper>
                                                    </Grid>
                                                </FuseAnimate>

                                                <Grid item xs={12} sm={12} lg={12}>
                                                    <div className={classes.root}>
                                                        <Grid xs={12} sm={12} md={12} lg={12}>
                                                            <div className="flex flex-row" style={{textAlign:"center"}}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    className="w-3/4 mx-auto mt-2 normal-case"
                                                                    value="legacy"
                                                                    //disabled={isEditable}
                                                                    onClick={()=> {handleClick("panel2")}}
                                                                >
                                                                    {t('SHOWNOTIFICATIONLIST')}
                                                                </Button>
                                                                {/*<Button*/}
                                                                {/*    variant="outlined"*/}
                                                                {/*    color="primary"*/}
                                                                {/*    className="w-1/8 mx-auto mt-2 normal-case"*/}
                                                                {/*    value="legacy"*/}
                                                                {/*    onClick={()=> {handleAllClientsClick("panel2")}}*/}
                                                                {/*>*/}
                                                                {/*    {t('SHOWNALLCLIENT')}*/}
                                                                {/*</Button>*/}
                                                            </div>
                                                        </Grid>
                                                    </div>
                                                </Grid>

                                                {/*Burası Excel Döküman Indirme Yeri*/}
                                                {/*Burası Excel için yeni eklendi*/}
                                                <Grid item xs={12} sm={12} lg={12} >
                                                    <div className={classes.root}>
                                                        <ForExcelNotification notificationExcel={selectedMail}></ForExcelNotification>
                                                    </div>
                                                </Grid>

                                                {/*Notification List Acordion Menu*/}
                                                <Grid item xs={12} sm={12} lg={12}>
                                                    <Accordion  expanded={expanded === 'panel2'} onChange={() => {handleClickAcordion('panel2')}}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                        >
                                                            <Typography style ={{ fontWeight:'bold' }}>{t('NOTIFICATIONLIST')}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div style={{ width: '100%' , textAlign:"center" }}>
                                                                {/*<DataGrid*/}
                                                                {/*    rows={list}*/}
                                                                {/*    columns={columns}*/}
                                                                {/*    pageSize={5}*/}
                                                                {/*    checkboxSelection*/}
                                                                {/*    disableSelectionOnClick*/}
                                                                {/*/>*/}

                                                                <TableContainer component={Paper} className={classes.paper}>

                                                                    <ThemeProvider theme={mainTheme}>
                                                                        <Paper className="flex items-center w-full px-2 py-12 mb-12 rounded-8" elevation={1}>
                                                                            <Input

                                                                                placeholder={t("COMPANYNAME") +  " , " + t("FIRSTORLASTNAME") + " , " + t("DIRECTORNAME")}
                                                                                className="flex flex-1 mx-8"
                                                                                disableUnderline
                                                                                value={search}
                                                                                inputProps={{
                                                                                    'aria-label': 'Search'
                                                                                }}
                                                                                onChange={ (e) => setSearch(e.target.value)}
                                                                            />
                                                                            {/*<Button
                                                                                className="ml-5 rounded-8"
                                                                                variant="contained"
                                                                                onClick={() => {handleClickSearch(search)}}>{t("SEARCH")}</Button>*/}

                                                                            <Button
                                                                                className="ml-5 rounded-8"
                                                                                variant="contained"
                                                                                onClick={() => {handleClear()}}>{t("SEARCHCLEAR")}</Button>
                                                                        </Paper>
                                                                    </ThemeProvider>
                                                                    <Table stickyHeader={true}>
                                                                        <ProductsTableHead
                                                                            // classes={classes}
                                                                            numSelected={selected.length}
                                                                            order={order}
                                                                            onRequestSort={handleRequestSort}
                                                                            rowCount={list?.length}

                                                                            selectedMail={selectedMail}
                                                                            setSelectedMail={setSelectedMail}
                                                                            list={list}
                                                                            selected={selected}
                                                                            setSelected={setSelected}

                                                                        />

                                                                        <TableBody>
                                                                            {
                                                                                _.orderBy( filteredList,[o => {
                                                                                        switch (order.id) {
                                                                                            // case 'categories': {
                                                                                            //     //@ts-ignore
                                                                                            // 	return o.helpType.helpTypeShowName;
                                                                                            // }
                                                                                            default: {
                                                                                                return o[order.id];
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    ],
                                                                                    //@ts-ignore
                                                                                    [order.direction]
                                                                                )

                                                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                                    .map(listOfData => {
                                                                                        return (
                                                                                            <TableRow
                                                                                                className="cursor-pointer" hover tabIndex={-1} key={listOfData.id}
                                                                                            >
                                                                                                <TableCell padding="none">
                                                                                                    <Checkbox
                                                                                                        // checked
                                                                                                        // value={}
                                                                                                        checked={selectedMail.indexOf(listOfData) > -1 ? true : false}
                                                                                                        inputProps={{ 'aria-label': 'Checkbox A' }}
                                                                                                        style={{ color : '#172a3a'}}
                                                                                                        onChange={ (e,checked) => {
                                                                                                            handleCheckBox(e ,checked,listOfData)
                                                                                                        }}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row"></TableCell>

                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                    { listOfData.company === null ? listOfData.founderOwner.tradeAsName : listOfData.company.name}
                                                                                                </TableCell>

                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                    { listOfData.customerClients[0].customerInfo.userInfo?.name} {listOfData.customerClients[0].customerInfo.userInfo?.surname}
                                                                                                </TableCell>

                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                    { listOfData.company === null ? listOfData.founderOwner.name +" "+ listOfData.founderOwner.surname : listOfData?.company?.directorDetails.map( (detail) =>{
                                                                                                        return(
                                                                                                            <TableRow className="mt-6">
                                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                                    <Typography>{detail.name} {detail.surname}</Typography>
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        );
                                                                                                    } )}
                                                                                                </TableCell>

                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                    { listOfData.company === null ? listOfData.founderOwner.email : listOfData.company?.directorDetails.map( (detail) => {
                                                                                                        return(
                                                                                                            <TableRow className="mt-6">
                                                                                                                <TableCell className="md:p-16 truncate" component="th" scope="row">
                                                                                                                    <Typography>{detail.email}</Typography>
                                                                                                                </TableCell>
                                                                                                            </TableRow>
                                                                                                        );
                                                                                                    })}
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                                    <TablePagination
                                                                        rowsPerPageOptions={[5, 10, 25]}
                                                                        colSpan={3}
                                                                        count={filteredList?.length}
                                                                        className="flex-shrink-0 border-t-1"
                                                                        component="div"
                                                                        rowsPerPage={rowsPerPage}
                                                                        page={page}
                                                                        SelectProps={{
                                                                            inputProps: { 'aria-label': 'rows per page' },
                                                                            native: true
                                                                        }}
                                                                        onPageChange={handleChangePage}
                                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                                        ActionsComponent={TablePaginationActions}
                                                                    />
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Grid>

                                                {/*Notification Send Acordion Menu */}
                                                <Grid item xs={12} sm={12} lg={12}>
                                                    <Accordion expanded={expandedSecond === 'panel1'} onChange={() => {handleClickSecondAcordion('panel1')}}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                        >
                                                            <Typography style ={{ fontWeight:'bold' }}>{t('NOTIFICATIONSEND')}</Typography>
                                                        </AccordionSummary><br/>
                                                        <AccordionDetails>
                                                            <Grid item xs={12} sm={12} lg={12}>
                                                                <form onSubmit={formik.handleSubmit}>
                                                                    <Textfield
                                                                        label={t("SUBJECT")}
                                                                        placeholder={t("NOTIFICATIONSUBJECT")}
                                                                        style={{width:"100%"}}
                                                                        variant={"outlined"}
                                                                        multiline
                                                                        rows={1}
                                                                        inputProps={{
                                                                            maxlength: 50
                                                                        }}
                                                                        id="subject"
                                                                        name={"subject"}
                                                                        value={formik.values.subject}
                                                                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                                                                        helperText={formik.touched.subject && formik.errors.subject || `${formik.values.subject.length} / 50`}
                                                                        onChange={formik.handleChange}
                                                                    >
                                                                    </Textfield><br/><br/>

                                                                    <Textfield
                                                                        label={t("CONTENT")}
                                                                        placeholder={t("NOTIFICATIONCONTENT")}
                                                                        style={{width:"100%"}}
                                                                        variant={"outlined"}
                                                                        multiline
                                                                        rows={4}
                                                                        inputProps={{
                                                                            maxlength: 250
                                                                        }}
                                                                        id="content"
                                                                        name={"content"}
                                                                        value={formik.values.content}
                                                                        error={formik.touched.content && Boolean(formik.errors.content)}
                                                                        helperText={formik.touched.content && formik.errors.content || `${formik.values.content.length} / 250`}
                                                                        onChange={formik.handleChange}
                                                                    >
                                                                    </Textfield>

                                                                    <div className={"flex w-full justify-self-stretch mx-8 my-12"}>

                                                                        <input
                                                                            className={"hidden"}
                                                                            type="file"
                                                                            onClick={handleChangeFiles}
                                                                            onChange={handleFileChange}
                                                                            id="contained-button-file"
                                                                            disabled={disabled}
                                                                        />

                                                                        <label htmlFor="contained-button-file">
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                component="span"
                                                                                startIcon={<CloudUploadIcon />}
                                                                                disabled={disabled}
                                                                            >
                                                                                {t('UPLOAD')}
                                                                            </Button>
                                                                        </label>

                                                                        <div className={classes.rootProgress}  >
                                                                            <BorderLinearProgress
                                                                                variant="determinate"
                                                                                value={progress}
                                                                            />
                                                                        </div>

                                                                        <LinearProgress variant="determinate"
                                                                                          color={progress === 100 ? "secondary" : "primary"}
                                                                                          value={progress}/>

                                                                    </div>

                                                                    <div style={{textAlign:"center"}}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            className="w-1/4 mx-auto mt-8 normal-case"
                                                                            value="legacy"
                                                                            type={"submit"}
                                                                            disabled={disabled}
                                                                        >
                                                                            <MailOutlineIcon>{t('SEND')}</MailOutlineIcon>
                                                                        </Button>
                                                                    </div>
                                                                </form>
                                                            </Grid>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Grid>

                                                {/*<Grid xs={12} sm={12}>*/}
                                                {/*    <Paper>*/}
                                                {/*        <div style={{ height: 400, width: '100%' }}>*/}
                                                {/*            <DataGrid*/}
                                                {/*                rows={JSON.stringify(list)}*/}
                                                {/*                columns={columns}*/}
                                                {/*                pageSize={5}*/}
                                                {/*                rowsPerPageOptions={[5]}*/}
                                                {/*                checkboxSelection*/}
                                                {/*            />*/}
                                                {/*        </div>*/}
                                                {/*    </Paper>*/}
                                                {/*</Grid>*/}
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </div>
                        </PageContent>
                    </PageMain>
                </PageContainer>
            }

        />

    );
}

export const PageContainer = styled('div')(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'grid',
    maxWidth: theme.breakpoints.width('xl'),
    margin: '0 auto',
    padding: theme.spacing(2)
}));

export const PageMain = styled('div')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gridTemplateColumns: '2fr 1fr',
    gridGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr'
    }
}));

export const PageContent = styled('div')(({ theme }) => ({
    width: '100%',
    gridTemplateRows: '1fr auto auto',
}));
export default withSnackbar(UserCreatePage);
