import {createStyles, createTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import React, {useEffect, useRef, useState} from 'react';
import {
    Backdrop, CircularProgress,
    Grid,
    TextField,
    Theme
} from "@material-ui/core";
import api from "../../services/BackendApi";
import {
    Client, CashInvoice, CashCurrency, ForFilterExpenses, ExpensesType, ForFilterExpensesExcel,
} from "../../types/UserModel";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {isEmpty} from 'lodash';
import history from '@history';
import moment from "moment";
import {useTranslation} from "react-i18next";
import CashInvoiceList from "./CashInvoiceList";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {withSnackbar} from "notistack";
import Typography from "@material-ui/core/Typography";
import CashSave from "./CashSave";

const theme = createTheme();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: 24
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        },
        appBar: {
            position: 'relative',
        },
        input: {
            display: 'none',
        },
        table: {
            minWidth: 700,
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);
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
function CashInvoicePage(props) {
    const classes = useStyles();
    const clientId = useSelector(({company}) => company.currentCompanyId);
    // @ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const [client, setClient] = useState<Client>();
    // @ts-ignore
    const [cashInvoice, setCashInvoice] = useState<CashInvoice>({
        clientId: null,
        cashPrice: 0,
        cashCurrencyOfPayment: 'Pound Sterling(GBP)',
        cashInvoiceTypeId: null,
        cashInvoiceDate: new Date(moment().add().toDate()).toISOString().substring(0, 10),
        is_active:true,
        cashInvoiceType:"",
    } as CashInvoice);
    const pageLayout = useRef(null);
    const [cashInvoices, setCashInvoices] = useState<CashInvoice[]>();
    const [selectedCurrency, setSelectedCurrency] = useState<CashCurrency>(    {
        "code": "GBP",
        "number": "826",
        "digits": 2,
        "currency": "Pound Sterling",
    });
    const [mindateDue, setMindateDue] = useState<string>(new Date(moment().add().toDate()).toISOString().substring(0, 10));
    const {t} = useTranslation('SupportPage');
    const [progress, setProgress] = React.useState(0);
    const [cashInvoicesExcell, setCashInvoicesExcell] = useState<CashInvoice[]>();
    const [totalElementsExcel, setTotalElementsExcel] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [forFilter, setForFilter]= useState<ForFilterExpenses>();
    const [forFilterExcell, setForFilterExcell]= useState<ForFilterExpensesExcel>();
    const [expensesType, setExpensesType]= useState<ExpensesType[]>([]);
    const [openBackDrop, setOpenBackDrop] = useState(false)

    useEffect(() => {
        test.forEach(x => {
            if (x.client.id === clientId) {
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    api.getExpensesType().then((res)=>{
                        setExpensesType(res);
                    });
                    setForFilter({...forFilter, page:page,size:rowsPerPage,clientId: clientId})
                    setForFilterExcell({...forFilterExcell,clientId: clientId})
                }
            }
        })
    }, []);
    function handleClick(){
        getCashInvoicesByFilter(forFilter)
    }
    function handleClear(){
        forFilter.invoiceDate = "";
        forFilter.invoiceEndDate = "";
        forFilter.invoiceType = "";

        setForFilter({...forFilter, page:0,size:25,
            invoiceDate:null,
            invoiceEndDate:null,
            invoiceType:null,
            invoiceCurrency:null,
            search:null,
            clientId:clientId});
        setForFilterExcell({...forFilterExcell,
            invoiceDate:null,
            invoiceEndDate:null,
            invoiceType:null,
            invoiceCurrency:null,
            search:null,
            clientId:clientId});
    }
    function getCashInvoicesByFilter(forFilter){
        if(forFilter!=null){
        api.getCashInvoicesByFilter(forFilter).then(response => {
            expensesType?.filter(type=>response.content?.cashInvoiceTypeId==type.id).map((type)=>(
                response.content.cashInvoiceType=type.expensesType
            ));
            setCashInvoices(response.content);
            setTotalElements(response.totalElements);
        });
        api.getAllForExcelByClientId(forFilterExcell).then(res=>{
            expensesType?.filter(type=>res.content?.cashInvoiceTypeId==type.id).map((type)=>(
                res.content.cashInvoiceType=type.expensesType
            ));
            setForFilterExcell(res);
        })
        }
    }
    useEffect(() => {
        getCashInvoicesByFilter(forFilter);
    }, [forFilter]);

    useEffect(()=>{
       if(forFilterExcell!=null) {
            api.getAllForExcelByClientId(forFilter).then(response => {
                expensesType?.filter(type => response.content?.cashInvoiceTypeId == type.id).map((type) => (
                    response.content.cashInvoiceType = type.expensesType
                ));
                setCashInvoicesExcell(response);
                // setTotalElementsExcel(response.totalElements);
            });
        }
    },[forFilterExcell])

    const handleChange = (event) => {
        setCashInvoice({...cashInvoice, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            expensesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setCashInvoice({...cashInvoice, cashInvoiceType : type.expensesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleChangeForFilter = (event) => {
        setForFilter({...forFilter, [event.target.name]: event.target.value});
        setForFilterExcell({...forFilterExcell, [event.target.name]: event.target.value});
    };

    useEffect(() => {
        setMindateDue(cashInvoice?.cashInvoiceDate);
    }, [handleChange]);

    const handleSave = () => {
        cashInvoice.clientId = clientId;
        if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (!cashInvoice.cashInvoiceTypeId) {
            props.enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (progress==0) {
            props.enqueueSnackbar(<h4>{t('PHOTONULLERROR')}</h4>, {
                variant: 'error',
            })
        }else if (cashInvoice?.cashPrice<0){
            props.enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true)
            setCashInvoice({...cashInvoice, is_active: true})
            setCashInvoice(cashInvoice);
            api.saveCashInvoice(cashInvoice).then((res) => {
                setProgress(0);
                history.go(0);
            })
        }
    }
    useEffect(()=>{console.log(cashInvoice, "cash")},[cashInvoice])
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setCashInvoice({...cashInvoice, fileName: event.target.files[0].name});
            setCashInvoice({...cashInvoice, photo: event.target.files[0]});
    };
    useEffect(() => {
        cashInvoice.cashCurrencyOfPayment = selectedCurrency?.code;
        setCashInvoice(cashInvoice);
    }, [selectedCurrency]);

    useEffect(()=>{
        setCashInvoice({...cashInvoice, filePath:client?.clientFolder})
    },[client])
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <Grid
                    container
                    direction="row"
                    // justify="space-between"
                    alignItems="center"
                    style={{paddingLeft:'10px',paddingRight:'10px'}}>
                    <div>
                        <Backdrop className={classes.backdrop} open={openBackDrop}>
                            <CircularProgress color="inherit" />
                            <ThemeProvider theme={theme}>
                                <Typography variant="h4">  {t('REQUESTSENDING')}</Typography>
                            </ThemeProvider>
                        </Backdrop>
                    </div>
                    <Grid item xs={6} sm={1}>
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            <h2>{t('EXPENSES')}</h2>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={11}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center">
                                    <Grid item xs={6} sm={3}
                                          style={{textAlign:'right'}}>
                                        <h4>{t('FILTERINFORMATION')}</h4>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            type="date"
                                            size={"small"}
                                            fullWidth={true}
                                            name="invoiceDate"
                                            color={'secondary'}
                                            className={"object-center"}
                                            id="date"
                                            label={t('INVOICEDATE')}
                                            value={forFilter?.invoiceDate}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                max: '3000-01-01',
                                                min:'1000-01-01'
                                            }}
                                            variant="outlined"
                                            onChange={handleChangeForFilter}/>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            type="date"
                                            size={"small"}
                                            fullWidth={true}
                                            name="invoiceEndDate"
                                            className={"object-center"}
                                            id="date"
                                            label={t('INVOICEENDDATE')}
                                            value={forFilter?.invoiceEndDate}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                max: '3000-01-01',
                                                min:'1000-01-01'
                                            }}
                                            variant="outlined"
                                            onChange={handleChangeForFilter}/>
                                    </Grid>
                            <Grid xs={6} sm={3}>
                                <Button
                                    className="ml-5 rounded-8"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {handleClear()}}
                                >
                                    {t("CLEAR")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            content={
        <div className={classes.root}>
          <CashSave
              cashInvoice={cashInvoice}
              cashInvoicesExcel={cashInvoicesExcell}
              handleFileChange={handleFileChange}
              handleSave={handleSave}
              handleChange={handleChange}
              handleClick={handleClick}
          ></CashSave>
                <Grid item xs={12} sm={12}>
                    <CashInvoiceList
                        clientId={clientId}
                        pageLayout={pageLayout}
                        selectedItem={cashInvoice}
                        cashInvoices={cashInvoices}
                        setCashInvoices={setCashInvoices}
                        setSelectedItem={setCashInvoice}
                        totalElements={totalElements}
                        setTotalElements={setTotalElements}
                        forFilter={forFilter}
                        setForFilter={setForFilter}
                        forFilterExcell={ forFilterExcell}
                        setForFilterExcell={setForFilterExcell}
                        cashInvoicesExcell={cashInvoicesExcell}
                        setCashInvoicesExcell={setCashInvoicesExcell}
                        expensesType={expensesType}
                        setExpensesType={setExpensesType}
                        handleClick={handleClick}
                        handleClear={handleClear}
                        handleFileChange={handleFileChange}
                        handleSave={handleSave}
                        handleChange={handleChange}
                        openBackDrop={openBackDrop}
                        setOpenBackDrop={setOpenBackDrop}
                        progress={progress}
                        setProgress={setProgress}
                    ></CashInvoiceList>
                </Grid>
        </div>
            }
></FusePageCarded>
    );
}
export default withSnackbar(CashInvoicePage);
