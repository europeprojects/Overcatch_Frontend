import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import {FormControl, Grid, Icon, InputLabel, MenuItem, Paper, Select, Slide, TextField, Theme} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import api from "../../services/BackendApi";
import {BuyerInfo, Client, ClientAccount, Currency, Invoice, InvoiceDetail, InvoiceType} from "../../types/UserModel";
import {useSelector} from "react-redux";
import InvoiceDetailComponent from "./InvoiceDetailComponent";
import {green} from "@material-ui/core/colors";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {TransitionProps} from "@material-ui/core/transitions";
import {isEmpty} from 'lodash';
import history from '@history';
import {withSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import moment from "moment";
import {currencyListSorted} from "../../types/CurrencyListSorted";
import {useTranslation} from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import Invoice1 from "./Invoice1";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Invoice2 from "./Invoice2";
import Invoice3 from "./Invoice3";
import Invoice4 from "./Invoice4";
import Invoice5 from "./Invoice5";
import InvoiceLayer2 from "./invoiceLayer2";
import InvoiceLayer3 from "./InvoiceLayer3";
import InvoiceLayer4 from "./invoiceLayer4";

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

function UpdateInvoice(props) {
    const classes = useStyles();
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [buyerList, setBuyerList] = useState<BuyerInfo[]>();
    //@ts-ignore
    const [invoice, setInvoice] = useState<Invoice>({} as Invoice);
    const [invoiceDetailList, setInvoiceDetailList] = useState<InvoiceDetail[]>([{
        quantity: 1.00,
        unitPrice: 1.00,
        vatRate: 0.00
    } as InvoiceDetail]);
    const [client,setClient]=useState<Client>();
    const [hover, setHover] = useState<number>();
    const [clientAccountList, setClientAccountList] = useState<ClientAccount[]>();
    const [total, setTotal] = useState<number>(0);
    const [subTotal, setSubTotal] = useState<number>(0);
    const [vatAmount, setVatAmount] = useState<number>(0);
    const [sortCode, setSortCode] = useState<string>("");
    const [selectedBuyer, setSelectedBuyer] = useState<BuyerInfo>();
    const [selectedAccount, setSelectedAccount] = useState<ClientAccount>();
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>();
    const [open, setOpen] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");
    const [web, setWeb] = useState<string>("");
    //@ts-ignore
    const {id} = useParams();
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const mindate = new Date(moment().add(-7, "days").toDate()).toISOString().substring(0, 10)
    const {t}=useTranslation('document');

    useEffect(() => {
        test.forEach(x => {
            if (x.client.id === clientId) {
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    api.getBuyersByClientId(clientId).then(res => setBuyerList(res));
                    api.getClientAccountsByClientId(clientId).then(res => setClientAccountList(res));
                    api.getClient(clientId).then((res)=>{setClient(res)});
                    api.getInvoiceUpdate(id).then(res => {
                        setInvoice(res);
                        setInvoiceDetailList(res.invoiceDetails);
                    });
                }
            }
        })
    }, [])
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

    const handleChange = (event) => {
        setInvoice({...invoice, [event.target.name]: event.target.value});
    };

    const handleAddLine = () => {
        setInvoiceDetailList([...invoiceDetailList, {quantity: 1.00, unitPrice: 1.00, vatRate: 0.00} as InvoiceDetail])
    }

    const handleDeleteLine = (key) => {
        if(invoiceDetailList.length>1) {
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
        invoice.client = client;
        const input = document.getElementById('divToPrint');
        html2canvas(input, {
            useCORS: true
        })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png')
                invoice.pdf=imgData;
        if (isEmpty(invoiceDetailList)) {
            props.enqueueSnackbar(<h4>{t('PLEASEADDINVOICE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedBuyer)) {
            props.enqueueSnackbar(<h4>{t('PLEASEBILL')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedAccount)) {
            props.enqueueSnackbar(<h4>{t('PLEASESELECT')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('PLEASECURRENCYTYPE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(invoice.invoiceType)) {
            props.enqueueSnackbar(<h4>{t('PLEASEINVOICETYPE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(invoice.invoiceDate)) {
            props.enqueueSnackbar(<h4>{t('PLEASEINVOIEDATE')}</h4>, {
                variant: 'error',
            })
        } else {
            invoice.invoiceDetails = invoiceDetailList;
            invoice.vat = vatAmount;
            invoice.total = total;
            invoice.subTotal = subTotal;
            api.saveInvoice(invoice).then(res => history.push("/invoicelist"))
            setInvoice(invoice);
        }
            }).catch();
    }

    useEffect(() => {
        invoice.commercialTitle = selectedBuyer?.commercialTitle;
        invoice.buyerName = selectedBuyer?.buyerName;
        invoice.buyerAddress = address;
        invoice.buyerPhone = selectedBuyer?.buyerPhone;
        invoice.buyerEmail = selectedBuyer?.buyerEmail;
        invoice.bank = selectedAccount;
        setInvoice(invoice);
    }, [selectedCurrency, selectedAccount, selectedBuyer])

    function handlePreview() {
        invoice.client = client;
        if (isEmpty(invoiceDetailList)) {
            props.enqueueSnackbar(<h4>{t('PLEASEADDINVOICE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedBuyer)) {
            props.enqueueSnackbar(<h4>{t('PLEASEBILL')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedAccount)) {
            props.enqueueSnackbar(<h4>{t('PLEASESELECT')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('PLEASECURRENCYTYPE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(invoice.invoiceType)) {
            props.enqueueSnackbar(<h4>{t('PLEASEINVOICETYPE')}</h4>, {
                variant: 'error',
            })
        } else if (isEmpty(invoice.invoiceDate)) {
            props.enqueueSnackbar(<h4>{t('PLEASEINVOIEDATE')}</h4>, {
                variant: 'error',
            })
        } else {
            invoice.invoiceDetails = invoiceDetailList;
            invoice.vat = vatAmount;
            invoice.total = total;
            invoice.subTotal = subTotal;
            invoice.web=web;
            setInvoice(invoice);
            setOpen(true);
        }
    }
    useEffect(()=>{
        setSelectedBuyer({...selectedBuyer, buyerName:invoice?.buyerName,
            buyerAddress: invoice?.buyerAddress,
            buyerPhone:invoice?.buyerPhone,
            buyerEmail:invoice?.buyerEmail})
        setSelectedCurrency({...selectedCurrency, currency:invoice?.currencyOfPayment})
        setAddress(invoice?.buyerAddress)
        setSelectedAccount(invoice?.bank);
        setWeb(invoice?.web);
    },[invoice])

    useEffect(() => {
        setTotal(parseFloat(subTotal.toString()) + parseFloat(vatAmount.toString()))
    }, [subTotal, vatAmount])

    useEffect(() => {
        let tempSubTotal = 0.00;
        let tempVatAmount = 0.00;
        let tempTotal = 0.00;
        invoiceDetailList.map(ch => {
            tempSubTotal = (ch.unitPrice * ch.quantity) + tempSubTotal
            tempVatAmount = tempVatAmount + ch.vatAmount
            tempTotal = tempSubTotal + tempVatAmount
            setSubTotal(tempSubTotal);
            setVatAmount(tempVatAmount);
            setTotal(tempTotal);
        })
    }, [invoiceDetailList])

    return (
        <div className={classes.root}>
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
                            <Grid item xs={12} sm={3}>
                                {/*<FormControl required={true} fullWidth={true} size={"small"}*/}
                                {/*             variant="outlined">*/}
                                {/*    <InputLabel*/}
                                {/*        id="demo-simple-select-outlined-label">{invoice?.invoiceType}</InputLabel>*/}
                                {/*    <Select*/}
                                {/*        labelId="demo-simple-select-outlined-label"*/}
                                {/*        id="demo-simple-select-outlined"*/}
                                {/*        value={invoice?.invoiceType}*/}
                                {/*        onChange={handleChange}*/}
                                {/*        name={"invoiceType"}*/}
                                {/*        label={invoice?.invoiceType}*/}
                                {/*        defaultValue={invoice?.invoiceType}*/}
                                {/*    >{Object.keys(InvoiceType).map((k) => <MenuItem*/}
                                {/*        value={k.toString()}>{InvoiceType[k]}</MenuItem>)}*/}
                                {/*    </Select>*/}
                                {/*</FormControl>*/}
                                <TextField onChange={handleChange}
                                           size={"small"}
                                    // required={true}
                                           disabled={true}
                                           name={"invoiceCode"}
                                           id="invoice-code"
                                           // label={"invoice Type"}
                                           variant="outlined"
                                           value={invoice?.invoiceType}
                                    // defaultValue={invoice?.invoiceNumber}
                                           fullWidth={true}
                                           className={"object-center"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField onChange={handleChange}
                                           size={"small"}
                                           // required={true}
                                           disabled={true}
                                           name={"invoiceCode"}
                                           id="invoice-code"
                                           // label={"invoice Code"}
                                           variant="outlined"
                                           value={invoice?.invoiceCode}
                                           // defaultValue={invoice?.invoiceNumber}
                                           fullWidth={true}
                                           className={"object-center"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="dueDate"
                                    className={"object-center"}
                                    value={invoice?.dueDate}
                                    id="date"
                                    label={"invoice End Date"}
                                    defaultValue={invoice?.dueDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        max:'3000-01-01',
                                        min: mindate,
                                    }}
                                    variant="outlined"
                                    onChange={handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    type="date"
                                    size={"small"}
                                    fullWidth={true}
                                    name="invoiceDate"
                                    className={"object-center"}
                                    value={invoice?.invoiceDate}
                                    id="date"
                                    defaultValue={invoice?.invoiceDate}
                                    label={"invoice Start Date"}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        min:'1000-01-01',
                                        max:'3000-01-01',
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
                                    getOptionLabel={(buyerList) => buyerList.buyerName}
                                    value={selectedBuyer}
                                    aria-label={invoice?.buyerName}
                                    defaultValue={invoice?.buyerName}
                                    //@ts-ignore
                                    onChange={(event, value) => setSelectedBuyer(value)}
                                    renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                        label={invoice?.buyerName}
                                                                        variant="outlined"/>}
                                />) : (<Autocomplete
                                    size={"small"}
                                    fullWidth={true}
                                    id="combo-box-demo"
                                    disabled={true}
                                    options={buyerList}
                                    aria-label={invoice?.buyerName}
                                    defaultValue={invoice?.buyerName}
                                    getOptionLabel={(buyerList) => buyerList.buyerName}
                                    value={selectedBuyer}
                                    //@ts-ignore
                                    onChange={(event, value) => setSelectedBuyer(value)}
                                    renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                        label="Please Add Bill Recipient"
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
                                        value={invoice?.currencyOfPayment}
                                        defaultValue={invoice?.currencyOfPayment}
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
                                                                            label={invoice?.currencyOfPayment}
                                                                            variant="outlined"/>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {(clientAccountList?.length !== 0 ? (<Autocomplete size={"small"}
                                                                                   fullWidth={true}
                                                                                   id="client-account-list"
                                                                                   options={clientAccountList}
                                                                                   defaultValue={invoice?.bank?.accountNumber}
                                                                                   //@ts-ignore
                                                                                   onChange={(event, value) => setSelectedAccount(value)}
                                                                                   getOptionLabel={(clientAccountList) =>clientAccountList?.bankName+ " "+  clientAccountList.accountNumber.toString()}
                                                                                   renderInput={(params) =>
                                                                                       <TextField {...params}
                                                                                                  fullWidth={true}
                                                                                                  label={invoice?.bank?.bankName  + " " + invoice?.bank?.accountNumber}
                                                                                                  variant="outlined"/>}
                                />) : (<Autocomplete size={"small"}
                                                     fullWidth={true}
                                                     id="client-account-list"
                                                     options={clientAccountList}
                                                     disabled={true}
                                                     defaultValue={invoice?.bank?.accountNumber}
                                                     //@ts-ignore
                                                     onChange={(event, value) => setSelectedAccount(value)}
                                                     getOptionLabel={(clientAccountList) => clientAccountList?.bankName+ " "+  clientAccountList.accountNumber.toString()}
                                                     renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                                         label={invoice?.bank?.bankName + " " + invoice?.bank?.accountNumber}
                                                                                         variant="outlined"/>}
                                />))}

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Grid container spacing={1}
                              direction="row"
                              justify="space-between"
                              alignItems="flex-start"
                        >
                            <Grid item xs={12} sm={4}>
                                <h2 className={"flex"}>{t('INVOICEDETAILS')}</h2>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h2 className={"justify-self-end"}>{t('ADDNEWLINE')}
                                    <Icon fontSize="large" onClick={handleAddLine}
                                          style={{color: green[500]}}>add_circle</Icon></h2>
                            </Grid>
                        </Grid>

                        {
                            invoiceDetailList?.map((invoiceDetail, index) =>
                                <FuseAnimate delay={150}>
                                    <Grid container spacing={1}
                                          direction="row"
                                          justify="space-between"
                                          alignItems="center"
                                    ><Grid item xs={12} sm={11}>
                                        <InvoiceDetailComponent index={index} total={total} subtotal={subTotal}
                                                                setSubTotal={setSubTotal} setTotal={setTotal}
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
                                <h3>{t('SUBTOTAL')}{subTotal?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <h3>Total Vat Amount : {vatAmount?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <h3>{t('TOTAL')} : {total?.toFixed(2)}</h3>
                            </Grid>
                        </Grid>):(<Grid container spacing={3}
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <h3>{t('SUBTOTAL')}{subTotal?.toFixed(2)}</h3>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <h3>{t('TOTAL')} : {total?.toFixed(2)}</h3>
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
                            <Button variant="contained" color="primary" onClick={handlePreview}>
                                {t('PREVIEWSAVE')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={"auto"}>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                    <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                        <Dialog maxWidth={"xl"} open={open} onClose={() => setOpen(false)}
                                TransitionComponent={Transition}>
                            {client?.selectedInvoiceType === 1 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{handleSave();
                                                    // printDocument();
                                                    setOpen(false)}}>{t('SAVE')}</Button>
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
                                                // printDocument();
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
                                                    // printDocument();
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
                                                    // printDocument();
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
                                                    // printDocument();
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
                            {/*{client?.selectedInvoiceType === 6 && (*/}
                            {/*    <div>*/}
                            {/*        <div style={{margin:'20px', textAlign:'right'}}>*/}
                            {/*            <Button variant="contained" color="secondary"*/}
                            {/*                    onClick={()=>{*/}
                            {/*                        // printDocument();*/}
                            {/*                        handleSave();*/}
                            {/*                        setOpen(false)}}>save</Button>*/}
                            {/*            <Button variant="contained"*/}
                            {/*                    color="primary"*/}
                            {/*                    aria-label="close"*/}
                            {/*                    onClick={()=>{setOpen(false)}}> <CloseIcon/> </Button>*/}
                            {/*        </div>*/}
                            {/*        <div id='divToPrint'>*/}
                            {/*            <InvoiceLayer1 invoice={invoice}*/}
                            {/*                           client={client}></InvoiceLayer1>*/}
                            {/*        </div>*/}
                            {/*    </div>)}*/}
                            {client?.selectedInvoiceType === 6 && (
                                <div>
                                    <div style={{margin:'20px', textAlign:'right'}}>
                                        <Button variant="contained" color="secondary"
                                                onClick={()=>{
                                                    // printDocument();
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
                                                    // printDocument();
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
                                                    // printDocument();
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

export default withSnackbar(UpdateInvoice);