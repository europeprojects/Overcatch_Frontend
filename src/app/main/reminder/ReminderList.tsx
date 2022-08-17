import React, { useEffect, useState } from 'react';
import PropTypes, { any, number } from 'prop-types';
import clsx from 'clsx';
import {createStyles, createTheme, lighten, makeStyles, Theme, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import {
    Button, Card,
    CircularProgress,
    DialogContent, FormControlLabel,
    Grid,
    MenuItem,
    Select, Switch,
    TableFooter,
    TextField
} from '@material-ui/core';
import { PageContainer, PageContent, PageMain } from './notifCreate';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import api from '../../services/BackendApi';
import {Client, NoticeLog, NoticeLogDTO, NotificationLogFilter, Reminder, ReminderType} from '../../types/UserModel';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import CloseIcon from '@material-ui/icons/Close';
import {Form, useFormik} from "formik";
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';

import _ from 'lodash';

import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';

import FuseAnimate from '@fuse/core/FuseAnimate';
import {resetSettings, selectMainTheme} from 'app/store/fuse/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Checkbox from "@material-ui/core/Checkbox";
import {Div} from "../../components/Grid";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import history from "../../../@history/@history";
import Backdrop from "@material-ui/core/Backdrop";
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import ContactsTable from "../user/components/UITable";
import {openEditContactDialog} from "../user/store/contactsSlice";
import config from "../../services/Config";
import ContactsMultiSelectMenu from "../user/ContactsMultiSelectMenu";
import Avatar from "@material-ui/core/Avatar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Textfield from "@material-ui/core/TextField";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import SaveIcon from "@material-ui/icons/Save";
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

import {withSnackbar} from "notistack";

const theme = createTheme();

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    title: {
        flex: '1 1 100%'
    }
}));

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5)
        }
    })
);

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
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
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

function EnhancedTableHead(props) {
    const { t } = useTranslation('task');

    const headCells = [
        { id: 'reminderTemplateName', numeric: false, disablePadding: false, label: t('REMINDERTEMPLATENAME') },
        { id: 'reminderTemplateDate', numeric: true, disablePadding: false, label: t('REMINDERTEMPLATEDATE') },
        { id: 'reminderTemplateDate', numeric: true, disablePadding: false, label: t('REMINDERTYPE') },
        { id: 'reminderType', numeric: true, disablePadding: false, label: t('REMINDERUSED') },
        { id: 'details', numeric: false, disablePadding: false, label: t('REMINDERTEMPLATEDETAIL') }
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell =>
                    headCell.id == 'clienttype' || headCell.id == 'notitype' ? (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'center'}
                        >
                            {headCell.id == 'clienttype' ? t('CLIENTTYPE') : t('NOTIFICATIONTYPE')}
                        </TableCell>
                    ) : (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'center' : 'left'}
                        >
                            {headCell.label}
                        </TableCell>
                    )
                )}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const { t } = useTranslation('task');

    //Bugünün tarihini alan metot
    function MyFunction() {
        var myCurrentDate = new Date();
        //var date = myCurrentDate.getFullYear() + '-' + (myCurrentDate.getMonth() + 1) + '-' + myCurrentDate.getDate();
        var date = (myCurrentDate.getDate()) + '-' + (myCurrentDate.getMonth() +1) + '-' + myCurrentDate.getFullYear();
        return date;
    }
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    {t('REMINDERTEMPLATELISTS')}
                </Typography>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    container: {
        maxHeight: 410
    }
}));

function ReminderList(props) {

    const { t } = useTranslation('task');
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('soletraderaccountsdue');
    const [selected, setSelected] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [pageDialog, setPageDialog] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [rowsPerPageDialog, setRowsPerPageDialog] = React.useState(25);

    const [totalElements, setTotalElements] = React.useState(0);
    const [totalElementsDialog, setTotalElementsDialog] = React.useState(0);

    const [dense, setDense] = React.useState(false);
    const [openBackDrop, setOpenBackDrop] = React.useState(false);

    //const user = useSelector(({ contactsApp }) => contactsApp.user);
    //const dispatch = useDispatch();

    const [reminderTemplates, setReminderTemplates] = useState<ReminderType[]>();
    const [selectedTemplate, setSelectedTemplate] = useState<ReminderType>();
    const [reminder, setReminder] = useState<Reminder>({} as Reminder);

    const [template, setTemplate] = useState();

    const [clientOfReminder, setClientOfReminder] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [showList, setShowList] = React.useState(false);
    const [disabled, setDisabled] = useState<boolean>(true);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangePageDialog = (event: unknown, newPage: number) => {
        setPageDialog(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
    };

    const handleChangeRowsPerPageDialog = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPageDialog(parseInt(event.target.value, 10))
    };

    const handleClickOpen = (template: ReminderType) => {
        setOpen(true);
        setPageDialog(0);
        setRowsPerPageDialog(5);
        setDisabled(true);

        console.log('Selected Reminder Variables : ', template);
        api.getReminderTypeByID(template.id).then( reminderTemplateDetail => {
            setSelectedTemplate(reminderTemplateDetail);
        })

        api.getClients(template.reminderClientType).then( clientList =>{
            console.log('Clients : ',clientList);
            // @ts-ignore
            setClientOfReminder(clientList);
        })
    };

    //Reminder - Template Update
    const formik = useFormik({
        initialValues: {
            subject:'',
            content:'',
            reminderClientType:''
        },
        onSubmit: (values) => {
            updateReminderTemplate(values);
        },
    });

    const updateReminderTemplate = (values) => {

        if (selectedTemplate.reminderTemplate.length < 1 || selectedTemplate.reminderTypeName.length < 1 ){
            props.enqueueSnackbar(<h4>{t("REMINDERWARNING")}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true);
            api.saveReminderType(selectedTemplate).then(responsive =>{
                props.enqueueSnackbar(<h4>{t("REMINDERUPDATE")}</h4>, {
                    variant: 'warning',
                })
                window.location.reload()
            })
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    //Bugünün tarihini alan metot
    function MyFunction() {
        var myCurrentDate = new Date();
        var date = myCurrentDate.getFullYear() + '-' + (myCurrentDate.getMonth() + 1) + '-' + myCurrentDate.getDate();
        return date;
    }

    //formatDate fonksiyonunda değişiklik oldu
    function formatDate(date) {
        var newdate;
        if (date) {
            let dayTime = new Date(date)
            let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(dayTime);
            let mount = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(dayTime);
            let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(dayTime);
            newdate = `${year}-${mount}-${day}`
        }
        else
            newdate = null

        if (newdate?.split("-")[0].length < 4)
            newdate = null
        else if (date?.split("-")[0].length > 4)
            date = date?.split("-")[0].substring(0, 4)
        return date
    }

    useEffect(() => {
        //Oluşturulan Reminder - Templatelerin api 'den çağrıldığı kısım .
        api.getReminderTypes().then( reminderTemplates =>{
            setReminderTemplates(reminderTemplates);
            setTotalElements(reminderTemplates.length);
            console.log('Reminder Template List :',reminderTemplates);
        })
        api.getReminder().then( data => {
            console.log('Reminder Tablosundaki Son data :',data);
            setReminder(data);
            console.log("DATAAA-----", data)
        })
    }, [])

    function setBGColor(status){
        if(status == "true")
            return "bg-green text-white hover:bg-green-700 md:p-16 truncate rounded-12 text-bold"
        else if(status == "false")
            return "bg-red text-white hover:bg-red-700 md:p-16 truncate rounded-12 text-bold"
        else if(status == "null")
            return "bg-black text-white hover:bg-black-700 md:p-16 truncate rounded-12 text-bold"
    }

    const handleDelete = (template: ReminderType) => {
        if (selectedTemplate?.id === reminder?.reminderType?.id){
            props.enqueueSnackbar(<h4>{t("REMINDERREQUESTDELETE")}</h4>, {
                variant: 'warning',
            })
            //3 Saniye Bekletme
            const timeout = setTimeout(() => {
                history.push("/ReminderTemplate");
            }, 3000);
        }
        else {
            api.deleteReminderType(selectedTemplate).then(responsive =>{
                console.log(responsive);
                props.enqueueSnackbar(<h4>{t("REMINDERDELETE")}</h4>, {
                    variant: 'success',
                })
                window.location.reload()
            })
        }
    };

    /*
    const getPhotoUrlByFileName = (user) => {
        var id = user?.id
        var filename = user?.photoURL
        var url = config.BACKEND_API_URL + "/api/file/downloadPhoto/" + id + "/" + filename
        return url
    }

    const columns = React.useMemo(
        () => [
            {
                Header: ({ selectedFlatRows }) => {
                    const selectedRowIds = selectedFlatRows.map((row) => row.original.id);

                    return (
                        selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
                    );
                },
                accessor: 'avatar',
                Cell: ({ row }) => {
                    // var blobData= stringToBlob(row.original.photo);
                    //console.log("row.original.photo"+row.original.photo);
                    // console.log(blobToFile(blobData,row.original.photoURL));
                    // console.log((window.URL || window.webkitURL).createObjectURL(blobData));

                    //data:image/jpeg;base64,${row.original.photo}
                    return (row.original.photoURL ? (
                        <Avatar className="mx-3" alt={row.original.name}  src={getPhotoUrlByFileName(row.original)}/>
                        //	{(window.URL || window.webkitURL).createObjectURL(blobToFile(stringToBlob(row.original.photo)))
                    ) : (
                        <Avatar className="mx-3" alt={row.original.name}  src="assets/images/avatars/alice.jpg"/> ));

                },
                className: 'justify-center',
                width: 50,
                sortable: false
            },
            {
                Header: t("FIRSTNAME"),
                accessor: 'name',
                className: 'font-bold',
                sortable: true,
                isFrozen: true,
            },
            {
                Header: t("LASTNAME"),
                accessor: 'surname',
                className: 'font-bold',
                sortable: true
            },
            {
                Header: t("EMAIL"),
                accessor: 'email',
                sortable: true
            },
            {
                Header: t("USERTYPE"),
                accessor: 'userType',
                sortable: true
            },
            {
                Header: t("PHONE"),
                accessor: 'msisdn',
                sortable: true
            }
        ],
        [dispatch, user.starred, t]
    );
    */

    return (
        <FusePageCarded
            classes={{
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 items-center justify-left px-12">
                    <div className="flex items-left">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">update_two_one</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t('REMINDERTEMPLATELIST')}
                            </Typography>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                <PageContainer>
                    <PageMain>
                        <PageContent>
                            <div>
                                {/*box autoRow*/}
                                <div>
                                    {/*autoCol*/}
                                    <div className={classes.root}>
                                        <Paper className={classes.paper}>
                                            <TableContainer className={classes.container}>
                                                <Table
                                                    stickyHeader={true}
                                                    className={classes.table}
                                                    aria-labelledby="tableTitle"
                                                    size={dense ? 'small' : 'medium'}
                                                    aria-label="enhanced table"
                                                >
                                                    <EnhancedTableHead
                                                        classes={classes}
                                                        numSelected={selected.length}
                                                        order={order}
                                                        orderBy={orderBy}
                                                        onRequestSort={handleRequestSort}
                                                        rowCount={reminderTemplates?.length}
                                                    />
                                                    <TableBody>
                                                        {_.orderBy(reminderTemplates)
                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                            .map(template => {
                                                                console.log("TEMPLATE-------", template)
                                                                // @ts-ignore
                                                                return (
                                                                    <TableRow
                                                                        className="cursor-pointer"
                                                                        hover
                                                                        tabIndex={-1}
                                                                        key={template?.id}
                                                                    >
                                                                        <TableCell
                                                                            // className="md:p-16 truncate"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {template?.reminderTypeName}
                                                                        </TableCell>

                                                                        <TableCell
                                                                            // className="md:p-16 truncate"
                                                                            component="th"
                                                                            scope="row"
                                                                            style={{
                                                                                fontSize: '14px',
                                                                                padding: '2px',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            {template?.createdDateTime?.[2]} / {template?.createdDateTime?.[1]} / {template?.createdDateTime?.[0]}
                                                                        </TableCell>

                                                                        <TableCell
                                                                            // className="md:p-16 truncate"
                                                                            component="th"
                                                                            scope="row"
                                                                            style={{
                                                                                fontSize: '14px',
                                                                                padding: '2px',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            {template?.reminderClientType}
                                                                        </TableCell>

                                                                        <TableCell
                                                                            className="truncate text-center"
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {reminder?.reminderType?.id === template?.id ?
                                                                                <Icon
                                                                                    className={'animate-bounce'}
                                                                                    style={{
                                                                                        color: 'black',
                                                                                        fontSize: 30
                                                                                    }}
                                                                                >
                                                                                    done_icon
                                                                                </Icon>
                                                                                :
                                                                                <Icon
                                                                                    color={'secondary'}
                                                                                    style={{

                                                                                        fontSize: 30
                                                                                    }}
                                                                                >
                                                                                    clear_outlined_icon
                                                                                </Icon>
                                                                            }

                                                                        </TableCell>

                                                                        <TableCell>
                                                                            <Button
                                                                                variant="text"
                                                                                color="secondary"
                                                                                onClick={() => handleClickOpen(template)}
                                                                            >
                                                                                <Icon
                                                                                    style={{
                                                                                        color: 'secondary',
                                                                                        fontSize: 35,
                                                                                        justifyContent: 'center'
                                                                                    }}
                                                                                >
                                                                                    find_in_page_qutlined_icon
                                                                                </Icon>
                                                                            </Button>
                                                                        </TableCell>
                                                                        <div>
                                                                            <Dialog fullScreen open={open} onClose={handleClose} >
                                                                                <AppBar className={classes.appBar}>
                                                                                    <Toolbar>
                                                                                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                                                                            <CloseIcon />
                                                                                        </IconButton>
                                                                                        <Button autoFocus color="inherit" onClick={handleClose}>
                                                                                            {t('REMINDERTEMPLATEDETAILANDUSERS')}
                                                                                        </Button>
                                                                                    </Toolbar>
                                                                                </AppBar>
                                                                                <DialogContent>
                                                                                    {/*Reminder-Template Update Menu */}
                                                                                    <Card  className="w-full rounded-8 shadow-1 mt-12">
                                                                                        <Grid item xs={12} sm={12} lg={12}>
                                                                                            <form onSubmit={formik.handleSubmit}>
                                                                                                <Div className={'m-12'}>
                                                                                                    <Textfield
                                                                                                        label={t("REMINDERSUBJECT")}
                                                                                                        placeholder={t("REMINDERSUBJECT")}
                                                                                                        style={{width:"100%"}}
                                                                                                        variant={"outlined"}
                                                                                                        multiline
                                                                                                        rows={1}
                                                                                                        inputProps={{
                                                                                                            maxlength: 50
                                                                                                        }}
                                                                                                        id="reminderTypeName"
                                                                                                        name={"reminderTypeName"}
                                                                                                        disabled={disabled}
                                                                                                        className={'text-justify'}

                                                                                                        value={selectedTemplate?.reminderTypeName}
                                                                                                        error={formik.touched.subject && Boolean(formik.errors.subject)}
                                                                                                        helperText={formik.touched.subject && formik.errors.subject || `${selectedTemplate?.reminderTypeName.length} / 50`}

                                                                                                        onChange={(e)=>setSelectedTemplate({...selectedTemplate,[e.target.name]:e.target.value})}
                                                                                                    >
                                                                                                    </Textfield>
                                                                                                    <Textfield
                                                                                                        label={t("REMINDERCONTENT")}
                                                                                                        placeholder={t("REMINDERCONTENT")}
                                                                                                        style={{width:"100%"}}
                                                                                                        variant={"outlined"}
                                                                                                        multiline
                                                                                                        rows={8}
                                                                                                        inputProps={{
                                                                                                            maxlength: 250
                                                                                                        }}
                                                                                                        id="reminderTemplate"
                                                                                                        name={"reminderTemplate"}
                                                                                                        disabled={disabled}
                                                                                                        className={'text-justify'}

                                                                                                        value={selectedTemplate?.reminderTemplate}
                                                                                                        error={formik.touched.content && Boolean(formik.errors.content)}
                                                                                                        helperText={formik.touched.content && formik.errors.content || `${selectedTemplate?.reminderTemplate.length} / 250`}
                                                                                                        onChange={(e)=>setSelectedTemplate({...selectedTemplate,[e.target.name]:e.target.value})}
                                                                                                    ></Textfield>
                                                                                                </Div>


                                                                                                <Div columns={3} className={'m-12 text-center'}>
                                                                                                    <div >
                                                                                                        <Button
                                                                                                            variant="outlined"
                                                                                                            className="mx-auto normal-case rounded-8 w-1/2 mx-auto"
                                                                                                            value="legacy"
                                                                                                            disabled={disabled}
                                                                                                            onClick={() => handleDelete(template)}
                                                                                                        >
                                                                                                            <DeleteForeverOutlinedIcon color={'error'}></DeleteForeverOutlinedIcon>
                                                                                                        </Button>
                                                                                                    </div>

                                                                                                    <div>
                                                                                                        <Button
                                                                                                            variant="outlined"
                                                                                                            color="primary"
                                                                                                            className="mx-auto normal-case rounded-8 w-1/2 mx-auto"
                                                                                                            value="legacy"
                                                                                                            type={"submit"}
                                                                                                            disabled={disabled}
                                                                                                        >
                                                                                                            <SaveIcon color={'primary'}></SaveIcon>
                                                                                                        </Button>
                                                                                                    </div>

                                                                                                    <div>
                                                                                                        <Button
                                                                                                            variant="outlined"
                                                                                                            color="default"
                                                                                                            className="mx-auto normal-case  inline-flex rounded-8 w-1/2 mx-auto"
                                                                                                            onClick={() => setDisabled(false)}
                                                                                                        >
                                                                                                            <EditSharpIcon color={'error'} className={'animate-pulse'}></EditSharpIcon>
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </Div>
                                                                                            </form>
                                                                                        </Grid>
                                                                                    </Card>
                                                                                    <Card className="w-full rounded-8 shadow-1 mt-12">
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table className={classes.table} aria-label="simple table">
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell align="left">{t("")}</TableCell>
                                                                                                        <TableCell align="left">{t("FIRSTANDLASTNAME")}</TableCell>
                                                                                                        <TableCell align="left">{t("REMINDERWASSENT")}</TableCell>
                                                                                                        <TableCell align="center">{t("REMINDERTEMPLATEREPLYDATE")}</TableCell>
                                                                                                        <TableCell align="center">{t("REMINDERTEMPLATERESPONSIVE")}</TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    {
                                                                                                        _.orderBy(clientOfReminder)
                                                                                                            .slice(pageDialog * rowsPerPageDialog, pageDialog * rowsPerPageDialog + rowsPerPageDialog)
                                                                                                            .map( client =>{
                                                                                                                const logCreatedTime = moment(client?.reminderDate).format('DD-MM-YYYY');
                                                                                                                // @ts-ignore
                                                                                                                return(
                                                                                                                    <TableRow
                                                                                                                        className="cursor-pointer" hover tabIndex={-1} key={client.id}
                                                                                                                    >
                                                                                                                        <TableCell className="md:p-16 truncate " component="th" scope="row"></TableCell>

                                                                                                                        <TableCell align="left" className="md:p-16 truncate " component="th" scope="row">
                                                                                                                            { client.customerClients?.[0].customerInfo.user?.name} {client.customerClients?.[0].customerInfo.user?.surname}
                                                                                                                        </TableCell>

                                                                                                                        <TableCell className="md:p-16 truncate " component="th" scope="row">
                                                                                                                            { client.customerClients[0].customerInfo.user?.email}
                                                                                                                        </TableCell>

                                                                                                                        <TableCell align="center" className="md:p-16 truncate " component="th" scope="row">
                                                                                                                            <span className={logCreatedTime === 'Invalid date' ? setBGColor('null'): setBGColor('true')}>
                                                                                                                                  {logCreatedTime === 'Invalid date' ? t('REMINDERDATEFIND') : logCreatedTime}
                                                                                                                            </span>
                                                                                                                        </TableCell>

                                                                                                                        <TableCell align="center" className="md:p-16 truncate " component="th" scope="row">
                                                                                                                            <span
                                                                                                                                className={client?.status === null || client?.status?.toString() === 'false' ? setBGColor('false') :setBGColor('true')}>
                                                                                                                                { client?.status === null || client?.status?.toString() === 'false' ? t('REMINDERNOANSWER') : t('REMINDERANSWER')}
                                                                                                                            </span>
                                                                                                                        </TableCell>
                                                                                                                    </TableRow>
                                                                                                                );
                                                                                                            })
                                                                                                    }
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                            <TablePagination
                                                                                                className="flex justify-end border-t-1"
                                                                                                rowsPerPageOptions={[5, 10, 25]}
                                                                                                component="div"
                                                                                                colSpan={3}
                                                                                                count={clientOfReminder.length}
                                                                                                rowsPerPage={rowsPerPageDialog}
                                                                                                page={pageDialog}
                                                                                                SelectProps={{
                                                                                                    inputProps: { 'aria-label': 'rows per page' },
                                                                                                    native: true
                                                                                                }}
                                                                                                onPageChange={handleChangePageDialog}
                                                                                                onRowsPerPageChange={handleChangeRowsPerPageDialog}
                                                                                                ActionsComponent={TablePaginationActions}
                                                                                            />
                                                                                        </TableContainer>
                                                                                    </Card>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                        </div>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                className="flex justify-end border-t-1"
                                                colSpan={3}
                                                count={totalElements}
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
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        </PageContent>
                    </PageMain>
                </PageContainer>
            }
            innerScroll
        />
    );
}
export default withSnackbar(ReminderList);
