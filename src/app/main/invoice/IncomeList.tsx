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
    const {clientId,forFilter,setForFilter,forFilterExcell, setForFilterExcell, classes, order, orderBy,incomesType, onRequestSort} = props;
    const {t} = useTranslation('document');
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const headCells = [
        {id: 'incomeType', numeric: false, disablePadding: false, label: t("INVOICETYPE1"),sortable:false},
        {id: 'price', numeric: false, disablePadding: false, label: t('INVOICEAMOUNT'),sortable:true},
        {id: 'currency', numeric: false, disablePadding: false, label: t('CASHCURRENCY'),sortable:false},
        {id: 'incomeDate', numeric: false, disablePadding: false, label: t('DATE'),sortable:true},
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
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >

                        { headCell.id=='incomeType'||  headCell.id=='currency'?

                            <>


                                { headCell.label}
                            {headCell.id =='incomeType' &&
                                    (
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            onChange={(event)=>{handleChange(event)}}
                                            name={"incomeType"}
                                            label={t("INCOMETYPE")}>
                                            <MenuItem>{t("INCOMETYPE")}</MenuItem>
                                            {incomesType.map((k) =>
                                                <MenuItem value={k.id}>{k.incomesType}</MenuItem>)}
                                        </Select>

                                    )}

                            </>:
                            headCell.sortable ?
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
                                :headCell.label

                        }

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
    incomesType:any,
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
    const {numSelected, incomes} = props;
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
                    {t("INCOMESLIST")}
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
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis?.map(el => el[0]);
}


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
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
function IncomeList(props) {
    const {t} = useTranslation('document');
    const [open1,setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const {incomes, selectedItem, setSelectedItem,
        clientId, setIncomes, forFilterExcell, setForFilterExcell,
        setTotalElements, forFilter, setForFilter, incomesExcell, setIncomesExcell,
        incomesType} = props
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, incomes?.length - page * rowsPerPage);
    const [dense, setDense] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const classes = useStyles();
    const [selectedIncome, setSelectedIncome] = useState(null);
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
    function handleOpen1(income){
        setOpen1(true);
        setSelectedId(income.id)
        setSelectedIncome(income)
    }
    function handleClickOpen2(income) {
        setOpen2(true);
        setSelectedId(income.id)
        setSelectedIncome(income)
    };
    function handleClickOpenUpdate(income) {
        setOpenUpdate(true);
        setSelectedId(income.id)
        setSelectedIncome(income)
    };
    useEffect(()=>{
        setSelectedCurrency(selectedIncome?.currencyOfPayment)
        setSelectedCurrency({...selectedCurrency,
            //@ts-ignore
            code: [selectedIncome?.currencyOfPayment]})
    },[selectedIncome])

    function deleteFile(incomeId) {
        setDisable(true)
        handleClose2();
        props.setOpenBackDrop(true)
        api.deleteIncomeById(incomeId).then(res => {
            api.getIncomesByFilter(forFilter).then(response => {
                setIncomes(response.content);
                setTotalElements(response.totalElements);
                handleClose2();
                props.setOpenBackDrop(false)
                setDisable(false)
            });
        });
        api.getAllIncomeForExcelByClientId(forFilterExcell).then(res => {
            setIncomesExcell(res);
        })
    };
    function updateFile(selectedIncome) {
        setDisable(true)
        // handleCloseUpdate();
        props.setOpenBackDrop(true)
        //@ts-ignore
        history.push({
            pathname: '/incomeSave',
            displayRouteData: {
                income: selectedIncome,
                id : selectedIncome?.id,
                price : selectedIncome?.price,
                fileName : selectedIncome?.fileName,
                filePath : selectedIncome?.filePath,
                lastUpdatedDateTime : selectedIncome?.lastUpdatedDateTime,
                createdDateTime : selectedIncome?.createdDateTime,
                incomeType : selectedIncome?.incomeType,
                incomeTypeId : selectedIncome?.incomeTypeId,
                client : selectedIncome?.client,
                currencyOfPayment : selectedIncome?.currencyOfPayment,
                isActive : selectedIncome?.isActive,
                task : selectedIncome?.task,
                incomeDate : selectedIncome?.incomeDate,
                cashIncomeDate : selectedIncome?.cashIncomeDate,
            }
        });
    };
    function createDeleteRequest(incomeId) {
        setDisable(true)
        handleClose2();
        props.setOpenBackDrop(true)
        api.createDeleteRequestIncomeById(incomeId).then(res => {
            api.getIncomesByFilter(forFilter).then(response => {
                setIncomes(response.content);
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
    function createUpdateRequest(incomeId) {
        setDisable(true)
        handleCloseUpdate();
        props.setOpenBackDrop(true)
        api.createUpdateRequestIncomeById(incomeId).then(res => {
            api.getIncomesByFilter(forFilter).then(response => {
                setIncomes(response.content);
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

    function handleClick2(income) {
        setSelectedIncome(income)
        setOpenConfirms(true)
    }

    const getDocumentUrlByFileName = (fileName: string) => {
        var id = fileName?.split("-")[0]
        var filePath = selectedIncome?.filePath;
        return filePath + "/" + fileName;
    }

    function handleClose() {
        setOpenConfirms(false)
    }
    const handleChangeUpdate = (event) => {
        setSelectedIncome({...setSelectedIncome, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            incomesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setSelectedIncome({...selectedIncome, incomeType : type.incomesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleChange = (event) => {
        setSelectedIncome({...selectedIncome, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            incomesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setSelectedIncome({...selectedIncome, incomeType : type.incomesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleSave = () => {
        selectedIncome.clientId = clientId;
        if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (!selectedIncome.incomeTypeId) {
            props.enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
            })
        }
        else if (selectedIncome?.price<0){
            props.enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true)
            setSelectedIncome({...selectedIncome, is_active: true})
            setSelectedIncome(selectedIncome);
            updateFile(selectedIncome)
            history.go(0);
        }
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIncome({...selectedIncome, fileName: event.target.files[0].name});
        setSelectedIncome({...selectedIncome, photo: event.target.files[0]});
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
                            incomesType={incomesType}
                            onRequestSort={handleRequestSort}
                            rowCount={incomes?.length}
                            handleClear={handleClear}
                        />
                        <TableBody>
                            {stableSort(incomes, getComparator(order, orderBy))
                                ?.slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
                                ?.map((income) => {
                                    return (
                                        <TableRow id='myTable'
                                                  tabIndex={-1}
                                                  key={income?.id}
                                                  selected={income?.id === selectedItem?.id}
                                        >
                                            <TableCell>
                                                { incomesType?.filter(type=>income.incomeTypeId==type.id).map((type)=>(
                                                    <Typography>
                                                        {type.incomesType}
                                                    </Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell align="left" >{income.price}</TableCell>
                                            <TableCell align="left">{income.currencyOfPayment}</TableCell>
                                            <TableCell align="left">{income.incomeDate}</TableCell>
                                            <TableCell align="left">
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    <IconButton onClick={()=>openPreview(income)}>
                                                        <Icon style={{color:'lightblue'}}>search</Icon>
                                                    </IconButton>
                                                </FuseAnimate>
                                            </TableCell>
                                            <TableCell>
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    {income.deleteState != 0 ? <p>the task is in delete process</p> :
                                                        <Button
                                                            onClick={() => {
                                                                income.updateState == 3 ? updateFile(income)
                                                                    : income.updateState == 0 ? handleClickOpenUpdate(income)
                                                                        : handleClick2(income)
                                                            }}
                                                            className={income.updateState == 0 ? setBgColor("DEFAULT")
                                                                :(income?.task?.taskConfirmations?.length !=0 && income.updateState == 1 )? setBgColor('INPROGRESS')
                                                                    : income.updateState == 2 ? setBgColor("REJECTED")
                                                                        : income.updateState == 3 ? setBgColor("DONE"):setBgColor("DEFAULT")}>
                                                            {
                                                                income.updateState == 0 ? t("UPDATEREQUEST")
                                                                    : income.updateState == 2 ? t("REJECTED")
                                                                        : income.updateState == 3 ? <Icon>update</Icon>
                                                                            // : cashInvoice.updateState == 1 ? t("INPROGRES")
                                                                            :(income?.task?.taskConfirmations?.length !=0 && income.updateState ==1)? t("INPROGRESS")
                                                                                :t("PENDINGTRANSACTION")
                                                            }
                                                        </Button>
                                                    }
                                                </FuseAnimate>
                                            </TableCell>
                                            <TableCell>
                                                <FuseAnimate animation="transition.expandIn"
                                                             delay={200}>
                                                    {income.updateState != 0 ? <p>the task is in update process</p>:
                                                        <Button onClick={() => {(income.deleteState==3 || income.deleteState == 0 )? handleClickOpen2(income)
                                                            :  handleClick2(income) }}
                                                                className={income.deleteState == 0 ? setBgColor("DEFAULT")
                                                                    :(income?.task?.taskConfirmations?.length !=0 && income.deleteState==1)?setBgColor('INPROGRESS')
                                                                        : income.deleteState == 2 ? setBgColor("REJECTED")
                                                                            :income.deleteState ==3 ? setBgColor("DONE"): setBgColor("DEFAULT")}>
                                                            {
                                                                income.deleteState == 0 ? t("DELETEREQUEST")
                                                                    : income.deleteState == 2 ? t("REJECTED")
                                                                        : income.deleteState == 3 ? <Icon>delete</Icon>
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
                                                            selectedIncome?.deleteState==0? createDeleteRequest(selectedId)
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
                                                            selectedIncome?.updateState ==  0 ? createUpdateRequest(selectedId)
                                                                :  updateFile(selectedIncome)

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

                        { selectedIncome?.userRole == "MANAGER" || selectedIncome?.userRole == "EMPLOYEE"  ?
                            <span className={ "p-6 " +
                            (setBgColor("DONE") )}>
                                        {t("DONE")}
                                    </span> :

                            selectedIncome?.task?.taskConfirmations?.length > 0 ?
                                selectedIncome?.task.taskConfirmations.map((confirmations, index) => (
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
                                                    (selectedIncome?.task?.taskConfirmations?.[index + 1] ?
                                                        setBgColor(selectedIncome?.task?.taskConfirmations?.[index + 1]?.taskConfirm) :
                                                        setBgColor("DEFAULT") )}>
                                                        {
                                                            selectedIncome?.task?.taskConfirmations?.[index + 1] ?
                                                                t(selectedIncome?.task?.taskConfirmations?.[index + 1]?.taskConfirm)
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
                                        {index != selectedIncome?.task?.taskConfirmations?.length - 1 && <hr/>}
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
export default withSnackbar(IncomeList);
