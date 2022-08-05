import FuseAnimate from '@fuse/core/FuseAnimate';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from '@material-ui/icons/Close';
import {createStyles, lighten, makeStyles, Theme, useTheme, withStyles, WithStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import {
    TableContainer,
    TablePagination,
    Toolbar,
    Typography,
    DialogContentText,
    TableFooter,
    Grid,
    TextField,
    MenuItem,
    Select,
    TableSortLabel,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {any, func, number, object, oneOf, string} from "prop-types";
import {useTranslation} from "react-i18next";
import Icon from "@material-ui/core/Icon";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import api from "../../services/BackendApi";
import DetailCashInvoice from "./DetailCashInvoice";
import DetailCashInvoiceHeader from "./DetailCashInvoiceHeader";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {Autocomplete} from "@material-ui/lab";
import {currencyListSorted} from "../../types/CurrencyListSorted";
import {withSnackbar} from "notistack";
import {Div} from "../../components/Grid";
import {isEmpty, set} from "lodash";
import {CashCurrency} from "../../types/UserModel";
import history from '@history';
import moment, {Moment} from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    input: {
        display: 'none',
    },
    container:{
        maxHeight: 410
    }
}));

function EnhancedTableHead(props) {
    const {clientId,forFilter,setForFilter,forFilterExcell, setForFilterExcell, classes, order, orderBy,expensesType, onRequestSort} = props;
    const {t} = useTranslation('document');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const headCells = [
        {id: 'invoiceType', numeric: false, disablePadding: false, label: t("INVOICETYPE1"),sortable:false},
        {id: 'price', numeric: false, disablePadding: false, label: t('INVOICEAMOUNT'),sortable:true},
        {id: 'cashCurrency', numeric: false, disablePadding: false, label: t('CASHCURRENCY'),sortable:false},
        {id: 'invoiceDate', numeric: false, disablePadding: false, label: t('DATE'),sortable:true},
        {id: 'details', numeric: false, disablePadding: false, label: t('DETAILS'),sortable:false},
        {id: 'update', numeric: false, disablePadding: false, label: t('UPDATE'),sortable:false},
        {id: 'delete', numeric: false, disablePadding: false, label: t('DELETE'),sortable:false},
    ];
    function handleChange(e) {
        //@ts-ignore
        setForFilter({...forFilter, [e.target.name]: e.target.value, page:0})
        setForFilterExcell({...forFilterExcell, [e.target.name]: e.target.value})
        return forFilter;
    }
    function handleChangeForAuto(e, value) {
        //@ts-ignore
       setForFilter({...forFilter, invoiceCurrency : value?.code, page:0})
       setForFilterExcell ({...forFilterExcell, invoiceCurrency : value?.code})
        return forFilter;
    }
    useEffect(()=>{
        //@ts-ignore
        setForFilter({...forFilter, clientId:clientId, page:0})

        //@ts-ignore
        setForFilterExcell({...forFilterExcell, clientId:clientId})
    },[clientId])
    return (
        <TableHead>
            <TableRow>
                {headCells?.map(headCell => (
                    headCell.id==="invoiceType" || headCell.id==="cashCurrency" ?
                        (
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                padding={headCell.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >

                                    {headCell.label}
                                {
                                    headCell.id=='invoiceType' ?
                                        (<Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            onChange={(event)=>{handleChange(event)}}
                                            name={"invoiceType"}
                                            label={t("INVOICETYPE")}>
                                            <MenuItem>{t("INVOICETYPE")}</MenuItem>
                                            {expensesType.map((k) =>
                                                <MenuItem value={k.id}>{k.expensesType}</MenuItem>)}
                                        </Select>):
                                            <Autocomplete
                                                size={"small"}
                                                fullWidth={true}
                                                id="combo-box-demo"
                                                //@ts-ignore
                                                name='invoiceCurrency'
                                                options={currencyListSorted}
                                                //@ts-ignore
                                                onChange={(event, value) =>{
                                                    handleChangeForAuto(event, value)}}
                                                //@ts-ignore
                                                getOptionLabel={(currency) => currency.currency}
                                                renderOption={(currency) => (
                                                    <React.Fragment>
                                                        {currency.currency} ({currency.code})
                                                    </React.Fragment>
                                                )}
                                                renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                                    variant="standard"/>}
                                            />
                                            }

                            </TableCell>
                        ):
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ?
                            (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}

                                    {orderBy === headCell.id ? (
                                        <span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
                                    ) : null}
                                </TableSortLabel>
                            ):headCell.label}

                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
EnhancedTableHead.propTypes = {
    handleClear:func.isRequired,
    forFilter:any,
    forFilterExcell:any,
    expensesType:any,
    setForFilter: any,
    setForFilterExcell: any,
    clientId:number.isRequired,
    classes: object.isRequired,
    numSelected: number.isRequired,
    onRequestSort: func.isRequired,
    onSelectAllClick: func.isRequired,
    order: oneOf(['asc', 'desc']).isRequired,
    orderBy: string.isRequired,
    rowCount: number.isRequired
};
const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}
interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

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

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const {t} = useTranslation('document');
    const {numSelected, cashInvoices} = props;
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
                    {t("EXPENSESLIST")}
                </Typography>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: number.isRequired,
};

function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    console.log(stabilizedThis)
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis?.map(el => el[0]);
}
function rowComparetor(a,b) {

    if (b < a) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;

}
function invoiceDateConverter(x,orderBy)
{
    let dx = x[orderBy].split("-");
    let date = new Date(dx[2] + '/' + dx[1] + '/' + dx[0]).getTime();
    return date;
}

function sortByInvoiceDate(a,b,orderBy) {

     let da = invoiceDateConverter(a,orderBy);
     let db = invoiceDateConverter(b,orderBy);
    console.log(da)
    return  rowComparetor(da,db)

}


function descendingComparator(a, b, orderBy) {
    if(orderBy==="invoiceDate")
    {
      return  sortByInvoiceDate(a,b,orderBy);
    }
    else {
       return rowComparetor(a[orderBy],b[orderBy])
    }

}

function getComparator(order, orderBy) {
    console.log(order,orderBy);
    
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
function CashInvoiceList(props) {
    const {t} = useTranslation('document');
    const [open1,setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const {cashInvoices, selectedItem, setSelectedItem,
        clientId, setCashInvoices, forFilterExcell, setForFilterExcell,
        setTotalElements, forFilter, setForFilter, cashInvoicesExcell, setCashInvoicesExcell,
        expensesType} = props
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, cashInvoices?.length - page * rowsPerPage);
    const [dense, setDense] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const classes = useStyles();
    const [selectedCashInvoice, setSelectedCashInvoice] = useState(null);
    const [openConfirms, setOpenConfirms] = useState(false)
    const [disable, setDisable] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CashCurrency>(    {
        "code": "GBP",
        "number": "826",
        "digits": 2,
        "currency": "Pound Sterling",
    });
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };
    const handleClose2 = () => {
        setOpen2(false);
    };
    const handleClose3 = () => {
        setOpen3(false);
    };
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };
    function handleOpen1(cashInvoice){
        setOpen1(true);
        setSelectedId(cashInvoice.id)
        setSelectedCashInvoice(cashInvoice)
    }
    function handleClickOpen2(cashInvoice) {
        setOpen2(true);
        setSelectedId(cashInvoice.id)
        setSelectedCashInvoice(cashInvoice)
    };
    function handleClickOpenUpdate(cashInvoice) {
        setOpenUpdate(true);
        setSelectedId(cashInvoice.id)
        setSelectedCashInvoice(cashInvoice)
    };
    useEffect(()=>{
        setSelectedCurrency(selectedCashInvoice?.cashCurrencyOfPayment)
        setSelectedCurrency({...selectedCurrency,
            //@ts-ignore
            code: [selectedCashInvoice?.cashCurrencyOfPayment]})
    },[selectedCashInvoice])

    function deleteFile(cashId) {
        setDisable(true)
        handleClose2();
        props.setOpenBackDrop(true)
        api.deleteCashInvoiceById(cashId).then(res => {
            api.getCashInvoicesByFilter(forFilter).then(response => {
                setCashInvoices(response.content);
                setTotalElements(response.totalElements);
                handleClose2();
                props.setOpenBackDrop(false)
                setDisable(false)
            });
        });
        api.getAllForExcelByClientId(forFilterExcell).then(res => {
            setCashInvoicesExcell(res);
        })
    };
    function updateFile(selectedCash) {
        setDisable(true)
        // handleCloseUpdate();
        props.setOpenBackDrop(true)
        //@ts-ignore
        history.push({
            pathname: '/cashSave',
            displayRouteData: {
                cashInvoice: selectedCash,
                id : selectedCash?.id,
                cashPrice : selectedCash?.price,
                fileName : selectedCash?.fileName,
                filePath : selectedCash?.filePath,
                lastUpdatedDateTime : selectedCash?.lastUpdatedDateTime,
                createdDateTime : selectedCash?.createdDateTime,
                cashInvoiceType : selectedCash?.cashInvoiceType,
                cashInvoiceTypeId : selectedCash?.cashInvoiceTypeId,
                client : selectedCash?.client,
                currencyOfPayment : selectedCash?.currencyOfPayment,
                isActive : selectedCash?.isActive,
                task : selectedCash?.task,
                invoiceDate : selectedCash?.invoiceDate,
                cashInvoiceDate : selectedCash?.cashInvoiceDate,
            }
        });
    };
    function createDeleteRequest(cashId) {
        setDisable(true)
        handleClose2();
        props.setOpenBackDrop(true)
        api.createDeleteRequestCashInvoiceById(cashId).then(res => {
            api.getCashInvoicesByFilter(forFilter).then(response => {
                setCashInvoices(response.content);
                setTotalElements(response.totalElements);
                handleClose2();
                props.setOpenBackDrop(false)
                setDisable(false)
            });
            // api.getAllForExcelByClientId(forFilterExcell).then(res=>{
            //     setCashInvoicesExcell(res);
            // });
        });
    };
    function createUpdateRequest(cashId) {
        setDisable(true)
        handleCloseUpdate();
        props.setOpenBackDrop(true)
        api.createUpdateRequestCashInvoiceById(cashId).then(res => {
            api.getCashInvoicesByFilter(forFilter).then(response => {
                setCashInvoices(response.content);
                setTotalElements(response.totalElements);
                handleCloseUpdate();
                props.setOpenBackDrop(false)
                setDisable(false)
            });
            // api.getAllForExcelByClientId(forFilterExcell).then(res=>{
            //     setCashInvoicesExcell(res);
            // }).catch((err)=>console.log(err));
        });
    };
    function openPreview(cashInvoice) {
        setSelectedItem(cashInvoice)
        setOpen3(true)
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setForFilter({...forFilter, page:newPage})
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForFilter({...forFilter, page:0,size:parseInt(event.target.value, 10)})
    };
    function handleClear() {
        props.handleClear()
    }

    function setBgColor(status){
        if(status == "DONE")
            return "bg-green text-white hover:bg-green-700"
        else if(status == "INPROGRESS")
            return "bg-orange text-white hover:bg-orange-700"
        else if(status == "REJECTED")
            return "bg-red text-white hover:bg-red-700"
        else if (status == "DEFAULT")
            return "bg-blue text-white hover:bg-blue-700"
    }

    function handleClick2(cashInvoice) {
        setSelectedCashInvoice(cashInvoice)
        setOpenConfirms(true)
    }
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = fileName?.split("-")[0]
        var filePath = selectedCashInvoice?.filePath;
        return filePath + "/" + fileName;
    }

    function handleClose() {
        setOpenConfirms(false)
    }
    const handleChangeUpdate = (event) => {
        setSelectedCashInvoice({...selectedCashInvoice, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            expensesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setSelectedCashInvoice({...selectedCashInvoice, cashInvoiceType : type.expensesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleChange = (event) => {
        setSelectedCashInvoice({...selectedCashInvoice, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            expensesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setSelectedCashInvoice({...selectedCashInvoice, cashInvoiceType : type.expensesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleSave = () => {
        selectedCashInvoice.clientId = clientId;
        if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (!selectedCashInvoice.cashInvoiceTypeId) {
            props.enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
            })
        }
        else if (selectedCashInvoice?.cashPrice<0){
            props.enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true)
            setSelectedCashInvoice({...selectedCashInvoice, is_active: true})
            setSelectedCashInvoice(selectedCashInvoice);
            updateFile(selectedCashInvoice)
            history.go(0);
        }
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCashInvoice({...selectedCashInvoice, fileName: event.target.files[0].name});
        setSelectedCashInvoice({...selectedCashInvoice, photo: event.target.files[0]});
    };
    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Paper className="h-full">
                <TableContainer className={classes.container}>
                    <Table id="myTable"
                           className={classes.table}
                           aria-labelledby="tableTitle"
                           size={dense ? 'small' : 'medium'}
                           aria-label="enhanced table"
                           stickyHeader={true}
                    >
                        <EnhancedTableHead
                            clientId={clientId}
                            forFilter={forFilter}
                            setForFilter={setForFilter}
                            forFilterExcell={forFilterExcell}
                            setForFilterExcell={setForFilterExcell}
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            expensesType={expensesType}
                            onRequestSort={handleRequestSort}
                            rowCount={cashInvoices?.length}
                            handleClear={handleClear}
                        />
                        <TableBody>
                            {stableSort(cashInvoices, getComparator(order, orderBy))
                                ?.slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
                                ?.map((cashInvoice) => {
                                    return (
                                        <TableRow id='myTable'
                                                  tabIndex={-1}
                                                  key={cashInvoice?.id}
                                                  selected={cashInvoice?.id === selectedItem?.id}
                                        >
                                            <TableCell>
                                                { expensesType?.filter(type=>cashInvoice.cashInvoiceTypeId==type.id).map((type)=>(
                                                    <Typography>
                                                        {type.expensesType}
                                                    </Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell align="left" >{cashInvoice.price}</TableCell>
                                            <TableCell align="left">{cashInvoice.currencyOfPayment}</TableCell>
                                            <TableCell align="left">{cashInvoice.invoiceDate}</TableCell>
                                            <TableCell align="left">
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    <IconButton onClick={()=>openPreview(cashInvoice)}>
                                                        <Icon style={{color:'lightblue'}}>search</Icon>
                                                    </IconButton>
                                                </FuseAnimate>
                                            </TableCell>
                                            <TableCell>
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    {cashInvoice.deleteState != 0 ? <p>the task is in delete process</p> :
                                                        <Button
                                                            onClick={() => {
                                                                cashInvoice.updateState == 3 ? updateFile(cashInvoice)
                                                                    : cashInvoice.updateState == 0 ? handleClickOpenUpdate(cashInvoice)
                                                                        : handleClick2(cashInvoice)
                                                            }}
                                                            className={cashInvoice.updateState == 0 ? setBgColor("DEFAULT")
                                                                :(cashInvoice?.task?.taskConfirmations?.length !=0 && cashInvoice.updateState == 1 )? setBgColor('INPROGRESS')
                                                                    : cashInvoice.updateState == 2 ? setBgColor("REJECTED")
                                                                        : cashInvoice.updateState == 3 ? setBgColor("DONE"):setBgColor("DEFAULT")}>
                                                            {
                                                                cashInvoice.updateState == 0 ? t("UPDATEREQUEST")
                                                                    : cashInvoice.updateState == 2 ? t("REJECTED")
                                                                        : cashInvoice.updateState == 3 ? <Icon>update</Icon>
                                                                        // : cashInvoice.updateState == 1 ? t("INPROGRES")
                                                                            :(cashInvoice?.task?.taskConfirmations?.length !=0 && cashInvoice.updateState ==1)? t("INPROGRESS")
                                                                                :t("PENDINGTRANSACTION")
                                                            }
                                                        </Button>
                                                    }
                                                </FuseAnimate>
                                            </TableCell>
                                            <TableCell>
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    {cashInvoice.updateState != 0 ? <p>the task is in update process</p>:
                                                        <Button onClick={() => {(cashInvoice.deleteState==3 || cashInvoice.deleteState == 0 )? handleClickOpen2(cashInvoice)
                                                        :  handleClick2(cashInvoice) }}
                                                                className={cashInvoice.deleteState == 0 ? setBgColor("DEFAULT")
                                                                    :(cashInvoice?.task?.taskConfirmations?.length !=0 && cashInvoice.deleteState==1)?setBgColor('INPROGRESS')
                                                                        : cashInvoice.deleteState == 2 ? setBgColor("REJECTED")
                                                                            :cashInvoice.deleteState ==3 ? setBgColor("DONE"): setBgColor("DEFAULT")}>
                                                        {
                                                            cashInvoice.deleteState == 0 ? t("DELETEREQUEST")
                                                                : cashInvoice.deleteState == 2 ? t("REJECTED")
                                                                    : cashInvoice.deleteState == 3 ? <Icon>delete</Icon>
                                                                        : t("PENDINGTRANSACTION")
                                                        }
                                                    </Button>}
                                                </FuseAnimate>
                                            </TableCell>

                                            <div>
                                                <Dialog onClose={handleClose2}
                                                        open={open2}

                                                        aria-labelledby="alert-dialog-slide-title"
                                                        aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle onClose={handleClose2}
                                                                 id="alert-dialog-slide-title">{t("DELETEINVOICE")}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            {t("DELETESURE")}
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button color="primary" onClick={() => {
                                                            selectedCashInvoice?.deleteState==0? createDeleteRequest(selectedId)
                                                            : deleteFile(selectedId)
                                                        }} disabled={disable}>
                                                            {t("YES")}
                                                        </Button>
                                                        <Button onClick={handleClose2} color="primary">
                                                            {t("NO")}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <Dialog onClose={handleCloseUpdate}
                                                        open={openUpdate}

                                                        aria-labelledby="alert-dialog-slide-title"
                                                        aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle onClose={handleCloseUpdate}
                                                                 id="alert-dialog-slide-title">{t("UPDATEINVOICE")}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            {t("UPDATESURE")}
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button color="primary" onClick={() => {
                                                            selectedCashInvoice?.updateState ==  0 ? createUpdateRequest(selectedId)
                                                                :  updateFile(selectedCashInvoice)

                                                        }} disabled={disable}>
                                                            {t("YES")}
                                                        </Button>
                                                        <Button onClick={handleCloseUpdate} color="primary">
                                                            {t("NO")}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <Dialog onClose={handleClose3}
                                                        open={open3}
                                                        aria-labelledby="alert-dialog-slide-title"
                                                        aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle onClose={handleClose3}
                                                                 id="alert-dialog-slide-title">
                                                        <DetailCashInvoiceHeader className="mt-3" selectedItem={selectedItem}
                                                                                 createDeleteRequest={createDeleteRequest}/>
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            <DetailCashInvoice selectedItem={selectedItem}/>
                                                        </DialogContentText>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableRow>
                                    );
                                })}
                            {/*{emptyRows > 0 && (*/}
                            {/*    <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>*/}
                            {/*        <TableCell colSpan={6}/>*/}
                            {/*    </TableRow>*/}
                            {/*)}*/}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={props.totalElements}
                            rowsPerPage={forFilter?.size}
                            page={forFilter?.page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>

                <Dialog
                    fullWidth={true}
                    maxWidth={"xs"}
                    open={openConfirms}
                    onClose={handleClose} aria-labelledby="customized-dialog-title" >
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {t("PROCESSMESSAGE")}
                    </DialogTitle>
                    <DialogContent dividers>

                        { selectedCashInvoice?.userRole == "MANAGER" || selectedCashInvoice?.userRole == "EMPLOYEE"  ?
                            <span className={ "p-6 " +
                            (setBgColor("DONE") )}>
                                        {t("DONE")}
                                    </span> :

                            selectedCashInvoice?.task?.taskConfirmations?.length > 0 ?
                                selectedCashInvoice?.task.taskConfirmations.map((confirmations, index) => (
                                    <div className="my-8">
                                        <p>
                                            {confirmations.message ?
                                                confirmations.message : t("NOMESSAGE")
                                            }
                                        </p>
                                        {confirmations.personel &&
                                        <Div columns={2} className="my-8 flex justify-center">

                                            <Grid xs={6} md={12} lg={12} xl={12}>
                                                <div className="flex justify-start items-center">
                                                    <span className={ "p-6 " +
                                                    (selectedCashInvoice?.task?.taskConfirmations?.[index + 1] ?
                                                        setBgColor(selectedCashInvoice?.task?.taskConfirmations?.[index + 1]?.taskConfirm) :
                                                        setBgColor("DEFAULT") )}>
                                                        {
                                                            selectedCashInvoice?.task?.taskConfirmations?.[index + 1] ?
                                                                t(selectedCashInvoice?.task?.taskConfirmations?.[index + 1]?.taskConfirm)
                                                                :
                                                                t("PENDINGTRANSACTION")
                                                        }
                                                    </span>
                                                    <Icon>arrow_right</Icon>
                                                    <span className={ "p-6 " + setBgColor(confirmations.taskConfirm)}>{t(confirmations.taskConfirm)}</span>
                                                </div>
                                            </Grid>
                                            <Grid xs={6} md={12} lg={12} xl={12}>
                                                <div>
                                                    <div className="my-8 flex justify-end">
                                                        {
                                                            confirmations.personel.userInfo.name
                                                            + " " +
                                                            confirmations.personel.userInfo.surname
                                                        }
                                                    </div>
                                                    <div className="my-8 flex justify-end">
                                                        {
                                                            confirmations.processDate
                                                        }
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Div>
                                        }
                                        {index != selectedCashInvoice?.task?.taskConfirmations?.length - 1 && <hr/>}
                                    </div>
                                )) :
                                <span className={ "p-6 " + setBgColor("DEFAULT")}>
								{t("PENDINGTRANSACTION")}
							</span>
                        }
                    </DialogContent>
                </Dialog>
            </Paper>
        </FuseAnimate>
    );
}
export default withSnackbar(CashInvoiceList);
