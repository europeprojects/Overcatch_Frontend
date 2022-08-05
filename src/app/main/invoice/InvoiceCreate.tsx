import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {
    FormControl,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextField,
    Theme
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import api from "../../services/BackendApi";
import {
    BuyerInfo,
    Client,
    ClientAccount,
    Currency,
    Invoice,
    InvoiceDetail,
} from "../../types/UserModel";
import {useSelector} from "react-redux";
import InvoiceDetailComponent from "./InvoiceDetailComponent";
import { green} from "@material-ui/core/colors";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import InvoicePrintDialog from "./InvoicePrintDialog";
import {TransitionProps} from "@material-ui/core/transitions";
import {isEmpty} from 'lodash';
import history from '@history';
import {withSnackbar} from "notistack";
import {currencyListSorted} from "../../types/CurrencyListSorted";
import Invoice1 from "./Invoice1";
import Invoice3 from "./Invoice3";
import Invoice2 from "./Invoice2";
import Invoice4 from "./Invoice4";
import Invoice5 from "./Invoice5";
import InvoiceLayer2 from "./invoiceLayer2";
import InvoiceLayer3 from "./InvoiceLayer3";
import InvoiceLayer4 from "./invoiceLayer4";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import {useTranslation} from "react-i18next";
import html2canvas from "html2canvas";

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
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function InoviceCreate(props) {
    // @ts-ignore
    const pushedInvoice = history.location.displayRouteData;
    const classes = useStyles();
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [client, setClient]= useState<Client>();
    const [buyerList, setBuyerList] = useState<BuyerInfo[]>();
    //@ts-ignore
    const [invoice, setInvoice] = useState<Invoice>(pushedInvoice? pushedInvoice : {} as Invoice);
    const [invoiceDetailList, setInvoiceDetailList] = useState<InvoiceDetail[]>([{quantity:1,unitPrice:1,vatRate:0} as InvoiceDetail]);
    const [hover, setHover] = useState<number>();
    const [clientAccountList, setClientAccountList] = useState<ClientAccount[]>();
    const [total, setTotal] = useState<number>(0);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [web, setWeb] = useState<string>("");
    const [vatAmount, setVatAmount] = useState<number>(0);
    const [selectedBuyer, setSelectedBuyer] = useState<BuyerInfo>();
    const [selectedAccount, setSelectedAccount] = useState<ClientAccount>();
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(    {
        "code": "GBP",
        "number": "826",
        "digits": 2,
        "currency": "Pound Sterling",
        "countries": [
            "Guernsey",
            "Isle of Man",
            "Jersey",
            "United Kingdom of Great Britain and Northern Ireland (The)"
        ]
    });
    const [open, setOpen] = useState<boolean>(false);
    const [mindateDue, setMindateDue]=useState<string>("");
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const [progress, setProgress] = React.useState(0);
    const [unitPrice, setUnitPrice] = React.useState(0);
    const [quantity, setQuantity] = React.useState(0);
    const [vatRate, setVatRate] = React.useState(0);
    const {t}=useTranslation('task');
    const [invoiceTypeList, setInvoiceTypeList] = useState([]);

    //@ts-ignore
    useEffect(() => {
        invoice.invoiceDate=(new Date(moment().add().toDate()).toISOString().substring(0, 10))
        setInvoice(invoice);
        if (clientId === null){
            props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>,{
                variant: 'warning',
            });
            history.push("/clientapplist")
        }
        test.forEach(x=>{
            if(x.client.id===clientId){
                if(x.client.state!=="3"){
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>,{
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                }else{
                    api.getBuyersByClientId(clientId).then(res => setBuyerList(res));
                    api.getClientAccountsByClientId(clientId).then(res => setClientAccountList(res));
                    api.invoiceSettingsType(clientId).then(res=>setInvoiceTypeList(res));
                    api.getNewInvoice(clientId, "INVOICE", invoice?.invoiceDate).then((res) => {
                        setInvoice(res);
                    }).catch((res)=>{
                        props.enqueueSnackbar(<h4>Please do settings</h4>, {
                            variant: 'error',
                        })
                    });
                    // @ts-ignore
                    api.getClient(clientId).then(res=> setClient(res))                }
            }
        })
    }, []);

    // useEffect(()=>{
    //     if(invoiceTypeList.length<=0){
    //
    //     }
    // },[invoiceTypeList])
    const handleChange = (event) => {
        if (invoice.invoiceDate==null){
            invoice.invoiceDate=(new Date(moment().add().toDate()).toISOString().substring(0, 10))
        }
        setInvoice({...invoice, [event.target.name]: event.target.value});
    };

    const handleControlInvoiceDate = (event) => {
        if (invoice.invoiceDate == null) {
            invoice.invoiceDate = (new Date(moment().add().toDate()).toISOString().substring(0, 10))
        } else {
            var control = parseInt( event.target.value.split("-")[0] + event.target.value.split("-")[1] + event.target.value.split("-")[2]);
            var controlFounderOwner = 20210405;
            if ((client?.company != null && client?.status_completed == false) || (client?.company != null && client?.status_completed == null) ) {
                setInvoice({...invoice, invoiceDate: event.target.value});
            } else if (client?.company != null && client?.status_completed == true) {
                if(client?.yearEndDate != null)
                {
                    var controlYear = parseInt(client.yearEndDate.split("-")[0] + client.yearEndDate.split("-")[1] + client.yearEndDate.split("-")[2]);

                }else{
                    props.enqueueSnackbar(<h4>invalid year end day</h4>, {
                        variant: 'error',
                    })
                }
                if (controlYear < control) {
                    setInvoice({...invoice, invoiceDate: event.target.value})
                } else {
                    props.enqueueSnackbar(<h4>Please select a valid date</h4>, {
                        variant: 'error',
                    })
                }
            }
        else if (client?.founderOwner != null && controlFounderOwner < control) {
                setInvoice({...invoice, invoiceDate: event.target.value})
            } else {
                props.enqueueSnackbar(<h4>Please select a valid date</h4>, {
                    variant: 'error',
                })
            }
        }
    }

    useEffect(()=>{
        setMindateDue(invoice?.invoiceDate);
    }, [handleControlInvoiceDate]);

    useEffect(()=>{

        if(invoiceTypeList.length > 0 ){
            invoiceTypeList.map((type) => {
                if(invoice.invoiceType==type.invoiceType){
                    api.getNewInvoice(clientId, type.invoiceType, invoice?.invoiceDate).then((res)=> {
                        // setInvoice(res);
                        setInvoice({...invoice, invoiceCode : res.invoiceCode});
                    }).catch((res)=>{
                        props.enqueueSnackbar(<h4>Please do settings</h4>, {
                        variant: 'error',})
                    });
                }
            })
        }
    },[invoice.invoiceType, invoice.invoiceDate])

    const handleAddLine = () => {
        setInvoiceDetailList([...invoiceDetailList, {quantity:1,unitPrice:1,vatRate:0} as InvoiceDetail])
    }
    const handleDeleteLine = (key) => {
        if(invoiceDetailList.length>1){
            const invoiceDetail1 = invoiceDetailList[key];
            invoiceDetailList.splice(invoiceDetailList.indexOf(invoiceDetail1), 1);
            setInvoiceDetailList([...invoiceDetailList]);
        }else{
            props.enqueueSnackbar(<h4>{t("DELETELASTLINEERROR")}</h4>,{
                variant: 'warning',
            });
        }
    }

    const handleSave = () => {
        setOpen(false)
        const input = document.getElementById('divToPrint');
            html2canvas(input, {
                useCORS: true
            })
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png')
                    invoice.pdf=imgData;

                    if (isEmpty(invoiceDetailList)) {
                        props.enqueueSnackbar(<h4>{t('INVOICEDETAILERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else if (isEmpty(selectedBuyer)) {
                        props.enqueueSnackbar(<h4> {t('BILLRESIPENTERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else if (isEmpty(selectedAccount)) {
                        props.enqueueSnackbar(<h4>{t('ACCOUNTERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else if (isEmpty(selectedCurrency)) {
                        props.enqueueSnackbar(<h4>{t('CURRENCYERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else if (isEmpty(invoice.invoiceType)) {
                        props.enqueueSnackbar(<h4>{t('INVOICETYPEERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else if (isEmpty(invoice.invoiceDate)) {
                        props.enqueueSnackbar(<h4>{t('INVOICEDATEERROR')}</h4>, {
                            variant: 'error',
                        })
                    } else {
                        // invoice.pdf=forEmail();
                        invoice.invoiceDetails = invoiceDetailList;
                        invoice.vat = vatAmount;
                        invoice.total = total;
                        invoice.subTotal = subTotal;
                        if(client?.company!=null){
                            invoice.clientEmail=client?.company?.email;
                            invoice.clientName=client?.company?.name;
                            invoice.clientPhone=client?.company?.phoneNumber;
                            invoice.companyNumber=client?.company?.companyNumber;
                        }else{
                            invoice.clientEmail=client?.founderOwner?.email;
                            invoice.clientName=client?.founderOwner?.tradeAsName;
                            invoice.clientPhone=client?.founderOwner?.phoneNumber;
                            invoice.companyNumber=client?.founderOwner?.eoriNumber;
                        }
                        setInvoice(invoice);
                        api.saveInvoice(invoice).then((res) =>{
                            history.push("/invoicelist");})
                        // api.sendMessageWithAttachment(invoice?.buyerEmail,"invoice",invoice?.clientName, "C\\tein\\test\\client\\").then(res=>{})
                    }
                }).catch();

    }

    useEffect(() => {
        invoice.bank=selectedAccount;
        invoice.commercialTitle = selectedBuyer?.commercialTitle;
        invoice.buyerName = selectedBuyer?.buyerName;
        invoice.buyerAddress = selectedBuyer?.buyerAddress;
        invoice.buyerPhone = selectedBuyer?.buyerPhone;
        invoice.buyerEmail = selectedBuyer?.buyerEmail;
        invoice.currencyOfPayment = selectedCurrency?.code;
        if (client?.company){
            invoice.companyNumber=client.company.companyNumber;
        }
        if(client?.web){
            invoice.web=client.web;
        }
        setInvoice(invoice);
    }, [selectedCurrency, selectedAccount, selectedBuyer])

    useEffect(()=>{
        invoiceDetailList.map((detail,index)=>{
            setUnitPrice(detail?.unitPrice);
            setQuantity(detail?.quantity);
            setVatRate(detail?.vatRate);
        })
    },[invoiceDetailList])

    function handlePreview() {
        invoice.client = client;
        setInvoice({...invoice, client:client as Client})
        if (isEmpty(invoiceDetailList)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTADDINVOICE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedBuyer)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTBILLRECIPIENT')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedAccount)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTSELECTACCOUNT')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTSELECTCURRENCYTYPE')}</h4>, {
                variant: 'error',
            })
        }
        else if (isEmpty(invoice.invoiceType)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTINVOICETYPE')}</h4>, {
                variant: 'error',
            })
        }
        else if (isEmpty(invoice.invoiceDate)) {
            props.enqueueSnackbar(<h4>{t('INVOICEALERTINVOICEDATE')}</h4>, {
                variant: 'error',
            })
        } else if(unitPrice<0){
            props.enqueueSnackbar(<h4>{t('INVOICEALERTPOSITIVEUNITDATE')}</h4>, {
                variant: 'warning',
            });
        }else if(quantity<0){
            props.enqueueSnackbar(<h4>{t('INVOICEALERTPOSITIVEQUANTITY')}</h4>, {
                variant: 'warning',
            });
        } else if(vatRate<0){
            props.enqueueSnackbar(<h4>{t('INVOICEALERTPOSITIVEVATRATE')}</h4>, {
                variant: 'warning',
            });
        } else if(vatRate>100){
            props.enqueueSnackbar(<h4>{t('INVOICEALERTVATMAX')}</h4>, {
                variant: 'warning',
            });
        }
        else {
            invoice.invoiceDetails = invoiceDetailList;
            invoice.vat = vatAmount;
            invoice.total = total;
            invoice.subTotal = subTotal;
            setInvoice(invoice);
            setOpen(true);
        }
    }
    useEffect(() => {
        let tempSubTotal = 0;
        let tempVatAmount = 0;
        let tempTotal = 0;
        let web = "";
        invoiceDetailList.map(ch=>{
            tempSubTotal = (ch.unitPrice*ch.quantity) + tempSubTotal
            tempVatAmount = tempVatAmount + ch.vatAmount
            tempTotal = tempSubTotal + tempVatAmount
            setSubTotal(tempSubTotal);
            setVatAmount(tempVatAmount);
            setTotal(tempTotal);
            setWeb(web);
        })
    }, [invoiceDetailList])

    useEffect(() => {
        if (progress === 100) {
            props.enqueueSnackbar(<h4>Success</h4>, {
                variant: 'success',
            });
            setTimeout(function () {
                setOpen(false);
            }, 2000);
        }
    }, [progress])

    return (
        <div className={classes.root}>
            <header>
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                        {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                        <h1>{t('INVOICECREATE')}</h1>
                    </div>
                </div>
            </header>
            <Grid container spacing={3} direction="column"
                  justify="space-between"
                  alignItems="stretch">
                <Grid item>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}
                              direction="row"
                              justify="space-between"
                              alignItems="flex-start"
                        >
                            <Grid item xs={12} sm={4}>
                                <FormControl required={true} fullWidth={true} size={"small"}
                                             variant="outlined">
                                    <InputLabel
                                        id="demo-simple-select-outlined-label">{t('INVOICETYPE')}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        //value={invoice?.invoiceType}
                                        onChange={handleChange}
                                        name={"invoiceType"}
                                        label={t('INVOICETYPE')}
                                    >
                                        {invoiceTypeList?.map((type)=>
                                            <MenuItem value={type.invoiceType}>{type.invoiceType}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceDate"
                                    className={"object-center"}
                                    value={invoice?.invoiceDate}
                                    id="date"
                                    label={t('INVOICEDATE')}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:'1000-01-01'
                                    }}
                                    variant="outlined"
                                    onChange={handleControlInvoiceDate}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="dueDate"
                                    className={"object-center"}
                                    value={invoice?.dueDate}
                                    id="date"
                                    label={t('INVOICEDUEDATE')}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max: '3000-01-01',
                                        min:mindateDue
                                    }}
                                    variant="outlined"
                                    onChange={handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {buyerList?.length !== 0 ? (<Autocomplete
                                    size={"small"}
                                    fullWidth={true}
                                    id="combo-box-demo"
                                    options={buyerList}
                                    getOptionLabel={(buyerList) => buyerList?.buyerName + " / " + buyerList?.buyerAddress}
                                    value={selectedBuyer}
                                    //@ts-ignore
                                    onChange={(event, value) => setSelectedBuyer(value)}
                                    renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                        label={t('INVOICESELECTRECIPIENT')}
                                                                        variant="outlined"/>}
                                />) : (<Autocomplete
                                    size={"small"}
                                    fullWidth={true}
                                    id="combo-box-demo"
                                    disabled={true}
                                    options={buyerList}
                                    getOptionLabel={(buyerList) => buyerList?.buyerName + " / " + buyerList?.buyerAddress}
                                    value={selectedBuyer}
                                    //@ts-ignore
                                    onChange={(event, value) => setSelectedBuyer(value)}
                                    renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                        label={t('INVOICESELECTRECIPIENTPLEASE')}
                                                                        variant="outlined"/>}
                                />)}

                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl required={true} fullWidth={true} size={"small"}
                                             variant="outlined">
                                    <Autocomplete
                                        size={"small"}
                                        fullWidth={true}
                                        id="combo-box-demo"
                                        options={currencyListSorted}
                                        value={selectedCurrency}
                                        defaultValue={"Pound Sterling (GBP)"}
                                        //@ts-ignore
                                        onChange={(event, value) => setSelectedCurrency(value)}
                                        //@ts-ignore
                                        getOptionLabel={(currency) => currency.currency}
                                        renderOption={(currency) => (
                                            <React.Fragment>
                                                {currency.currency} ({currency.code})
                                            </React.Fragment>
                                        )}
                                        renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                            label={t('INVOICEPOUND')}
                                                                            variant="outlined"/>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {(clientAccountList?.length !== 0 ? (<Autocomplete size={"small"}
                                                                                   fullWidth={true}
                                                                                   id="client-account-list"
                                                                                   options={clientAccountList}
                                                                                    //@ts-ignore
                                                                                   onChange={(event, value) => setSelectedAccount(value)}
                                                                                   getOptionLabel={(clientAccountList) => clientAccountList.bankName + "  " +clientAccountList.accountNumber.toString()}
                                                                                   renderInput={(params) =>
                                                                                       <TextField {...params}
                                                                                                  fullWidth={true}
                                                                                                  label={t('INVOICESELECT')}
                                                                                                  variant="outlined"/>}
                                />) : (<Autocomplete size={"small"}
                                                     fullWidth={true}
                                                     id="client-account-list"
                                                     options={clientAccountList}
                                                     disabled={true}
                                    //@ts-ignore
                                                     onChange={(event, value) => setSelectedAccount(value)}
                                                     getOptionLabel={(clientAccountList) => clientAccountList.accountNumber.toString()}
                                                     renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                                         label={t('INVOICEADD')}
                                                                                         variant="outlined"/>}
                                />))}

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}
                              direction="row"
                              justify="space-between"
                              alignItems="flex-start"
                        >
                            <Grid item xs={12} sm={4}>
                                <h2 className={"flex"}>{t('INVOICEDETAILS')}</h2>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h2 className={"justify-self-end"}>{t('INVOICEADDLINE')}
                                    <Icon className={"align-middle mx-4"} fontSize="large" onClick={handleAddLine}
                                          style={{color: green[500]}}>add_circle</Icon></h2>
                            </Grid>
                        </Grid>
                        {
                            invoiceDetailList?.map((invoiceDetail, index) =>
                                <FuseAnimate delay={150}>
                                    <Grid container spacing={3}
                                          direction="row"
                                          justify="space-between"
                                          alignItems="center"
                                    ><Grid item xs={12} sm={11}>
                                        <InvoiceDetailComponent
                                            index={index}
                                            total={total}
                                            subtotal={subTotal}
                                            setSubTotal={setSubTotal}
                                            setTotal={setTotal}
                                            setVatAmount={setVatAmount}
                                            vatAmount={vatAmount}
                                            invoiceDetailList={invoiceDetailList}
                                            setInvoiceDetailList={setInvoiceDetailList}
                                            client={client}/>
                                    </Grid>
                                        <Grid item xs={12} sm={1} key={index} onMouseEnter={() => setHover(index)}
                                              onMouseLeave={() => setHover(null)}>
                                            <label onClick={() => handleDeleteLine(index)}>
                                                <Icon className="list-item-icon text-28 "
                                                      color={hover === index ? "error" : "inherit"}
                                                >
                                                    delete
                                                </Icon>
                                            </label>
                                        </Grid>
                                    </Grid>
                                </FuseAnimate>)}
                        {((client?.vatNumber != "" && client?.vatNumber != null) || (client?.company?.vatNumber!="" && client?.company?.vatNumber!=null))?(<Grid container spacing={3}
                               direction="row"
                               justify="space-between"
                               alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <h3>Sub Total : {subTotal?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <h3>Total Vat Amount : {vatAmount?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <h3>Total : {total?.toFixed(2)}</h3>
                            </Grid>
                        </Grid>):(<Grid container spacing={3}
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <h3>{t('INVOICESUBTOTAL')}{subTotal?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h3>{t('INVOICETOTAL')}:{total?.toFixed(2)}</h3>
                            </Grid>
                        </Grid>)}
                    </Paper>

                </Grid>
                <Grid item>
                    <Grid container spacing={1}
                          direction="row-reverse"
                          justify="flex-start"
                          alignItems="center"
                    >
                        <Grid item xs={12} sm={"auto"}>
                        </Grid>

                        <Grid item xs={12} sm={"auto"}>
                            <Button variant="contained" color="primary"
                                    onClick={()=>{handlePreview()}}>
                                {t('INVOICEPREVIEW')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div>
                <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                    <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                        <Dialog fullWidth={false} open={open} onClose={() => setOpen(false)}
                                TransitionComponent={Transition}>
                            {client?.selectedInvoiceType === 0 && (
                                //@ts-ignore
                                <InvoicePrintDialog invoice={invoice} client={client} ></InvoicePrintDialog>)}

                            {client?.selectedInvoiceType === 1 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false);
                                                }}>save</Button>
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
                            {client?.selectedInvoiceType === 2 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 3 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 4 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 5 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 6 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 7 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                            {client?.selectedInvoiceType === 8 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    handleSave();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                        </Dialog>
                    </Paper>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default withSnackbar(InoviceCreate);