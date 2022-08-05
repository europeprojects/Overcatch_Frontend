import React, {useEffect, useState} from 'react';
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {useTranslation} from "react-i18next";
import {
    Button, Checkbox, Dialog, DialogContent, DialogTitle, Grid,
    IconButton, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell,
    TableContainer, TableFooter, TableHead,
    TablePagination, TableRow, TextField, Typography
} from "@material-ui/core";
import {useSelector} from "react-redux";
import api from "../../services/BackendApi";
import history from '@history';
import CloseIcon from "@material-ui/icons/Close";
import {
    CashInvoice, Client,
    ForFilterDateInEx, Invoice
} from "../../types/UserModel";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import { makeStyles, useTheme} from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";
import Invoice1 from "../invoice/Invoice1";
import Invoice2 from "../invoice/Invoice2";
import Invoice3 from "../invoice/Invoice3";
import Invoice4 from "../invoice/Invoice4";
import Invoice5 from "../invoice/Invoice5";
import InvoiceLayer1 from "../invoice/invoiceLayer1";
import InvoiceLayer2 from "../invoice/invoiceLayer2";
import InvoiceLayer3 from "../invoice/InvoiceLayer3";
import InvoiceLayer4 from "../invoice/invoiceLayer4";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import config from "../../services/Config";
import ForIncomeExpenseExcel from "./ForIncomeExpenseExcel";

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
    table: {
        minWidth: 900,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    container:{
        maxHeight: 410
    }
}));

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles();
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 80;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
function MyIncomeExpense(props){
    const classes = useStyles(props);
    const test1 = useSelector(({auth}) => auth.user.data.usersClient);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const {t} = useTranslation('incomeExpense');
    const [totalIncome,setTotalIncome]=useState(0);
    const [totalExpense,setTotalExpense]=useState(0);
    const [invoice,setInvoice]=useState<Invoice>();
    const [bankList, setBankList] = useState();
    const [cashInvoices, setCashInvoices]=useState();
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [forFilterDate,setForFilterDate]=useState<ForFilterDateInEx>(new ForFilterDateInEx());
    const [forResponse,setForResponse]=useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [client,setClient]=useState<Client>({} as Client);
    const {clientProps}=props;
    const [cashInvoicesExcel, setCashInvoicesExcel] = useState([]);
    const [invoicesExcel, setInvoicesExcel] = useState<Invoice[]>([]);
    const [bankExcel, setBankExcel] = useState([]);
    const [expensesList, setExpensesList] = React.useState([]);
    const [selectedExpenseType,setSelectedExpenseType] = useState([]);
    const [selectedInvoiceType,setSelectedInvoiceType] = useState([]);
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(()=>{
        api.getExpensesType().then((res)=>{
            setExpensesList(res);
        });
        if(clientProps!=null){
            setClient(clientProps);
            api.getClient(clientProps.id).then((res)=>{setClient(res)});
        }else {
            test1.forEach(x => {
                if (x.client.id === clientId) {
                    if (x.client.state !== "3") {
                        props.enqueueSnackbar(<h4>{t('PLEASECREATEAPPLICATIONS')}</h4>, {
                            variant: 'warning',
                        });
                        history.push("/clientapplist")
                    } else {
                        api.getClient(clientId).then((res) => {
                            setClient(res);
                        });
                        setForFilterDate({...forFilterDate, startDate:null,endDate:null,type:'type', clientId:clientId, page:0, size:25, expenseTypes:"", invoiceTypes:""});
                    }
                }
            })
        }
    },[]);
    useEffect(()=>{
        setForFilterDate({...forFilterDate, startDate:null,endDate:null,type:'type', clientId:client.id, page:0, size:25,expenseTypes:"", invoiceTypes : ""});
    },[client]);

    useEffect(()=>{
        setCashInvoicesExcel([]);
        setInvoicesExcel([]);
        setBankExcel([]);
        let inMoney = 0;
        let outMoney = 0;
        for(let i=0 ; i<forResponse?.length ; i++ ){
            let deger = forResponse[i];
            if(deger?.total){
                inMoney = inMoney + forResponse[i].total;
                setInvoicesExcel((currentState) => [ ...currentState, deger as Invoice ]);
            }
            if(forResponse[i]?.price){
                outMoney=outMoney + deger.price;
                setCashInvoicesExcel((currentState) => [ ...currentState, deger as CashInvoice ]);
            }
            if(forResponse[i]?.totalMoneyOut){
                outMoney=outMoney+deger.totalMoneyOut;
                setBankExcel((currentState) => [ ...currentState, deger as CashInvoice ]);
            }
            if(forResponse[i]?.totalMoneyIn){
                inMoney=inMoney+deger.totalMoneyIn;
            }
        }
        setTotalIncome(inMoney)
        inMoney=0;
        setTotalExpense(outMoney)
        outMoney=0;
    },[forResponse]);

    useEffect(()=>{
        if(forFilterDate!=null) {
                api.getIncomeExpenseByFilter(forFilterDate).then(response => {
                    setForResponse(response?.body);
                });
        }
    },[forFilterDate]);

    interface Column {
        id: 'inExType' | 'ExpenseType' | 'moneyIn' | 'moneyOut' | 'currency' | 'objectDate' | 'details';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
    }

    const columns: Column[] = [
        {id: 'inExType', label: t('INCOMEEXPENSETYPE')},
        {id: 'ExpenseType', label: t("EXPENSETYPE")},
        {id: 'moneyIn', label: t('MONEYIN')},
        {id: 'moneyOut', label: t('MONEYOUT')},
        {id: 'currency', label: t('CURRENCY'), align: 'right'},
        {id: 'objectDate', label: t('DATE'), align: 'right'},
        {id: 'details', label: t('DETAILS'), align: 'right'},
    ];

    const handleClickOpen=(event , row)=>{
        if(row?.invoiceType){
            setInvoice(row);
            setOpen(true);
        }
        if(row?.totalMoneyIn){
            setBankList(row);
            setOpen1(true);
        }
        if(row?.price){
            setCashInvoices(row);
            setOpen2(true);
        }
    };
    const handleClear = ()=>{
        setForFilterDate({...forFilterDate, startDate:null,endDate:null,type:'type', clientId:client?.id, page:0, size:rowsPerPage, expenseTypes:"", invoiceTypes : ""})
    }

    const handleChange =(e)=>{
        setForFilterDate({...forFilterDate, [e.target.name]:e.target.value, type:'type', clientId:client?.id,page:0,size:rowsPerPage,expenseTypes:expensesList?.toString(),  invoiceTypes : selectedInvoiceType?.toString()});
    }
    const handleChange1 =(inv : string , checked : boolean)=>{
        if(checked && !selectedInvoiceType.includes(inv))
           setSelectedInvoiceType(oldArray => [...oldArray,inv])
        else if(!checked && selectedInvoiceType.includes(inv))
            setSelectedInvoiceType(selectedInvoiceType.filter(item => item != inv))
        return
        // setForFilterDate({...forFilterDate, type:e.target.value, clientId:client?.id, page:0, size:rowsPerPage,expenseTypes:expensesList?.toString()})
    }
    const printDocument= ()=> {
        const input = document.getElementById('divToPrint');
        const pdf = new jsPDF();
        if (pdf) {
            html2canvas(input, {
                useCORS: true
            })
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, 10,0,0);
                    pdf.save('download.pdf');
                }).catch();
        }
    }
    const getDocumentUrlByFileName = (fileName: string) => {
        var id = sessionStorage.getItem("companyId")
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + client?.id + "/" + fileName
        return url
    }
    function handleChangeCheckbox (exp : string, checked : boolean){
        if(checked && !selectedExpenseType.includes(exp))
            setSelectedExpenseType(oldArray => [...oldArray,exp])
        else if(!checked && selectedExpenseType.includes(exp))
            setSelectedExpenseType(selectedExpenseType.filter(item => item != exp))
        return
    }
    useEffect(()=>{
        setForFilterDate({...forFilterDate, expenseTypes:selectedExpenseType?.toString(), invoiceTypes : selectedInvoiceType?.toString(), type:'type', clientId:client.id, page:0, size:rowsPerPage,startDate:null,endDate:null})
    },[selectedExpenseType,selectedInvoiceType]);

    return (
        <div>
        <FusePageSimple
            classes={{
                root: classes.layoutRoot
            }}
            header={
                <Grid container className="p-24" style={{textAlign: 'left'}}>
                    <Grid item xs={12} sm={2}>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t("INCOMEEXPENSE")}
                            </Typography>
                        </FuseAnimate>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            type="date"
                            size={"small"}
                            fullWidth={true}
                            name="startDate"
                            className={"object-center"}
                            value={forFilterDate?.startDate}
                            id="startDate"
                            label={t("STARTDATE")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                // defaultValue: new Date(moment().add().toDate()).toISOString().substring(0, 10)
                                max: '3000-01-01',
                                min:'1000-01-01'
                            }}
                            variant="outlined"
                            onChange={handleChange}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            type="date"
                            size={"small"}
                            fullWidth={true}
                            name="endDate"
                            className={"object-center"}
                            value={forFilterDate?.endDate}
                            id="date"
                            label={t("ENDDATE")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                // defaultValue: new Date(moment().add().toDate()).toISOString().substring(0, 10)
                                max: '3000-01-01',
                                min:'1000-01-01'
                            }}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className="ml-5 rounded-8"
                            onClick={()=>{
                                handleClear();}}
                        >{t('CLEAR')}</Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <ForIncomeExpenseExcel
                            expenseList={cashInvoicesExcel}
                            incomeList={invoicesExcel}
                            bankList={bankExcel}></ForIncomeExpenseExcel>
                    </Grid>
                </Grid>
            }
            content={
                <Grid container className="p-24">
                    <Grid xs={12} sm={12}
                          style={{marginBottom:"20px"}}
                    >
                        <Grid container>
                            <Grid xs={6} sm={4}>
                                <TextField
                                    variant="outlined"
                                    name="totalIncome"
                                    disabled={true}
                                    fullWidth={true}
                                    id="outlined-disabled"
                                    //@ts-ignore
                                    value={totalIncome?.toFixed(2)}
                                    label={t("TOTALINCOME")}
                                />
                            </Grid>
                            <Grid xs={6} sm={4}>
                                <TextField
                                    //onChange={}
                                    variant="outlined"
                                    name="totalExpense"
                                    disabled={true}
                                    fullWidth={true}
                                    id="outlined-disabled"
                                    //@ts-ignore
                                    value={totalExpense?.toFixed(2)}
                                    label={t("TOTALEXPENSE")}
                                />
                            </Grid>
                            <Grid xs={12} sm={4}>
                                <TextField
                                    //onChange={}
                                    variant="outlined"
                                    name="total"
                                    disabled={true}
                                    fullWidth={true}
                                    id="outlined-disabled"
                                    //@ts-ignore
                                    value={(totalIncome-totalExpense)?.toFixed(2)}
                                    label={t("TOTAL")}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={12} sm={12}>
                    <TableContainer className={classes.container} >
                        <Table className={classes.table} aria-label="simple table" size={"small"} stickyHeader={true}>
                            <TableHead>
                                <TableRow>
                                    {columns.map((head)=>{
                                        return(
                                            head.id=='inExType'?
                                                    <TableCell key={head.id}>
                                                        {head.label}
                                                        <Select style={{marginLeft:"8px",maxWidth:"100px"}}
                                                                className="my-16"
                                                                variant= "standard"
                                                                name="type"
                                                                //onChange={ e => handleChange1(e)}
                                                                labelId="demo-mutiple-checkbox-label"
                                                                id="demo-mutiple-checkbox"
                                                                multiple
                                                                value={selectedInvoiceType}
                                                                renderValue={(selected) => (selected as string[]).join(',')}
                                                                MenuProps={MenuProps}
                                                                >
                                                            <MenuItem value="expenses">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("expenses", checked)}} checked={selectedInvoiceType.indexOf("expenses") > -1}/>
                                                                <ListItemText primary={t("expenses")}  />
                                                            </MenuItem>
                                                            <MenuItem value="INVOICE">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("INVOICE", checked)}} checked={selectedInvoiceType.indexOf("INVOICE") > -1}/>
                                                                <ListItemText primary={t("INVOICE")}  />
                                                            </MenuItem>
                                                            <MenuItem value="CREDITNOTE">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("CREDITNOTE", checked)}} checked={selectedInvoiceType.indexOf("CREDITNOTE") > -1}/>
                                                                <ListItemText primary={t("CREDITNOTE")}  />
                                                            </MenuItem>
                                                            <MenuItem value="PROFORMA">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("PROFORMA", checked)}} checked={selectedInvoiceType.indexOf("PROFORMA") > -1}/>
                                                                <ListItemText primary={t("PROFORMA")}  />
                                                            </MenuItem>
                                                            <MenuItem value="DELIVERYNOTE">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("DELIVERYNOTE", checked)}} checked={selectedInvoiceType.indexOf("DELIVERYNOTE") > -1}/>
                                                                <ListItemText primary={t("DELIVERYNOTE")}  />
                                                            </MenuItem>
                                                            <MenuItem value="SELFCERTIFICATE">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("SELFCERTIFICATE", checked)}} checked={selectedInvoiceType.indexOf("SELFCERTIFICATE") > -1}/>
                                                                <ListItemText primary={t("SELFCERTIFICATE")}  />
                                                            </MenuItem>
                                                            <MenuItem value="bank">
                                                                <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChange1("bank", checked)}} checked={selectedInvoiceType.indexOf("bank") > -1}/>
                                                                <ListItemText primary={t("bank")}  />
                                                            </MenuItem>
                                                        </Select>
                                                    </TableCell>:
                                                head.id == 'ExpenseType' ?
                                                    <TableCell>
                                                        {head.id}
                                                        <Select
                                                            labelId="demo-mutiple-checkbox-label"
                                                            id="demo-mutiple-checkbox"
                                                            multiple
                                                            value={selectedExpenseType}
                                                            style={{maxWidth:"100px"}}
                                                            renderValue={(selected) => (selected as string[]).join(',')}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {expensesList?.map((exp)=>(
                                                                <MenuItem value= {exp.expensesType}>
                                                                    <Checkbox style={{color : '#172a3a'}} onChange={(e,checked) => {handleChangeCheckbox(exp.expensesType, checked)}} checked={selectedExpenseType.indexOf(exp.expensesType) > -1}/>
                                                                    <ListItemText primary={t(exp.expensesType)}  />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                    :
                                                    <TableCell key={head.id}>
                                                        {head.label}
                                                    </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {forResponse?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    ?.map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                <TableCell>
                                                    {row.total? row?.invoiceType :row.totalMoneyIn?"Bank Transaction":"EXPENSES"}
                                                </TableCell>
                                                <TableCell>
                                                    {expensesList?.map((expenseType)=>
                                                            row?.cashInvoiceType == expenseType.expensesType ? expenseType.expensesType : ""
                                                        // <MenuItem value={"cash."+expenseType.expensesType}>{expenseType.expensesType}</MenuItem>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {row.totalMoneyIn?row.totalMoneyIn?.toFixed(2):row.total?.toFixed(2)}
                                                </TableCell>

                                                <TableCell>
                                                    {row.totalMoneyOut?row.totalMoneyOut?.toFixed(2):row.price?.toFixed(2)}
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    {row.currencyOfPayment?row.currencyOfPayment:row.cashCurrencyOfPayment}
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    {row.invoiceDate?row.invoiceDate:row.createdDateTime}
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    <IconButton
                                                        onClick={event => {
                                                            handleClickOpen(event , row)
                                                        }}
                                                    >
                                                        <Icon color="secondary">search</Icon>
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>

                        </Table>
                    </TableContainer>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    width={"1200px"}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={forResponse?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    backIconButtonProps={{
                                        'aria-label': 'Previous Page'
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': 'Next Page'
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Grid>
                </Grid>
            }
        ></FusePageSimple>
            <Dialog
                open={open}
                onClose={()=>{setOpen(false);}}
            >
                <DialogContent>
                    {(invoice?.selectedInvoiceType === 1 || invoice?.selectedInvoiceType==null) && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{
                                            printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <Invoice1 invoice={invoice}
                                          client={client}></Invoice1>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 2 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <Invoice2 invoice={invoice}
                                          client={client}></Invoice2>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 3 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <Invoice3 invoice={invoice}
                                          client={client}></Invoice3>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 4 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <Invoice4 invoice={invoice}
                                          client={client}></Invoice4>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 5 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <Invoice5 invoice={invoice}
                                          client={client}></Invoice5>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 6 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <InvoiceLayer1 invoice={invoice}
                                               client={client}></InvoiceLayer1>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 7 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <InvoiceLayer2 invoice={invoice}
                                               client={client}></InvoiceLayer2>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 8 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <InvoiceLayer3 invoice={invoice}
                                               client={client}></InvoiceLayer3>
                            </div>
                        </div>)}
                    {invoice?.selectedInvoiceType === 9 && (
                        <div>
                            <div style={{margin:'20px', textAlign:'right'}}>
                                <Button variant="contained" color="secondary"
                                        onClick={()=>{printDocument();
                                            setOpen(false)}}>save</Button>
                                <Button variant="contained"
                                        color="primary"
                                        aria-label="close"
                                        onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>
                            </div>
                            <div id='divToPrint'>
                                <InvoiceLayer4 invoice={invoice}
                                               client={client}></InvoiceLayer4>
                            </div>
                        </div>)}
                </DialogContent>
            </Dialog>
            <Dialog
                open={open1}
                onClose={()=>{setOpen1(false)}}
            >
                <DialogTitle>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                    >
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained"
                                    color="primary"
                                    aria-label="close"
                                    onClick={()=>{setOpen1(false)}}>
                                <CloseIcon/>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h4> Bank Transaction Details</h4>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                          id='divToPrint'
                    >
                        <Grid item xs={12} sm={4}>
                            <TextField
                                //onChange={}
                                variant="outlined"
                                name="invoiceDate"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.totalMoneyIn}
                                label={t("TOTALMONEYIN")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="cashCurrencyOfPayment"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.totalMoneyOut}
                                label={t("TOTALMONEYOUT")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="cashInvoiceType"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.businessName}
                                label={t("BUSINESSNAME")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="cashInvoiceType"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.iban}
                                label={"IBAN"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="price"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.bankType}
                                label={t("BANKTYPE")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="cashInvoiceType"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.startDate}
                                label={t("STARTDATE")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                variant="outlined"
                                name="cashInvoiceType"
                                disabled={true}
                                id="outlined-disabled"
                                //@ts-ignore
                                value={bankList?.pdfName}
                                label={t("PDFNAME")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog
                open={open2}
                onClose={()=>{setOpen2(false)}}
            >
                <DialogTitle>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                    >
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained"
                                    color="primary"
                                    aria-label="close"
                                    onClick={()=>{setOpen2(false)}}>
                                <CloseIcon/>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <h4> {t("EXPENSEDETAILS")}</h4>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                          id='divToPrint'
                    >
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={1}
                                  direction="row-reverse"
                                  justify="flex-start"
                                  alignItems="center"
                                  id='divToPrint'
                            >
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        name="invoiceDate"
                                        disabled={true}
                                        id="outlined-disabled"
                                        //@ts-ignore
                                        value={cashInvoices?.invoiceDate}
                                        label={t("EXPENSEDATE")}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        name="cashCurrencyOfPayment"
                                        disabled={true}
                                        id="outlined-disabled"
                                        //@ts-ignore
                                        value={cashInvoices?.currencyOfPayment}
                                        label={t("EXPENSECURRENCY")}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        name="cashInvoiceType"
                                        disabled={true}
                                        id="outlined-disabled"
                                        //@ts-ignore
                                        value={cashInvoices?.cashInvoiceType}
                                        label={t("EXPENSETYPE")}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        name="price"
                                        disabled={true}
                                        id="outlined-disabled"
                                        //@ts-ignore
                                        value={cashInvoices?.price}
                                        label={("EXPENSEPRICE")}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <img
                                //@ts-ignore
                                 src={getDocumentUrlByFileName(cashInvoices?.fileName)}
                                 alt="expense"/>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}
export default MyIncomeExpense;