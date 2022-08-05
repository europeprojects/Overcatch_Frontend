import React, {useEffect, useRef, useState} from 'react';
import {createStyles, createTheme, makeStyles} from "@material-ui/core/styles";
import {FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Theme} from "@material-ui/core";
import moment from "moment";
import {Autocomplete} from "@material-ui/lab";
import {currencyListSorted} from "../../types/CurrencyListSorted";
import ForExcel from "./ForExcel";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {CashCurrency, CashInvoice, ExpensesType} from "../../types/UserModel";
import api from "../../services/BackendApi";
import {isEmpty} from "lodash";
import {useSelector} from "react-redux";
import history from '@history';

import { useSnackbar } from "notistack";

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
function CashSave(props){
    const classes = useStyles();
    const {t} = useTranslation('SupportPage');
    const {cashInvoice,cashInvoicesExcel,id}=props;
    const [expensesType, setExpensesType]= useState<ExpensesType[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [progress, setProgress] = useState(0);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [selectedCurrency, setSelectedCurrency] = useState<CashCurrency>(    {
        "code": "GBP",
        "number": "826",
        "digits": 2,
        "currency": "Pound Sterling",
    });
    const { enqueueSnackbar } = useSnackbar();
    const [cashInvoice1, setCashInvoice1] = useState<CashInvoice>();
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    useEffect(()=>{
        api.getExpensesType().then((res)=>{
            setExpensesType(res);
        });
        if(routingData!=null){
            console.log(routingData,"routing data")
            setCashInvoice1(routingData?.cashInvoice)
            setCashInvoice1({...cashInvoice1,
                cashPrice : routingData?.cashPrice,
                cashInvoiceDate: routingData?.invoiceDate,
                cashCurrencyOfPayment: selectedCurrency?.code,
                fileName: routingData?.fileName,
                filePath: routingData?.filePath,
                id: routingData?.id,
                is_active: routingData?.isActive,
            cashInvoiceType:routingData?.cashInvoiceType,
            cashInvoiceTypeId : routingData?.cashInvoiceTypeId
            })
        }else {
            console.log("routing data null")
            setCashInvoice1(cashInvoice);
        }
    },[])

    useEffect(()=>{console.log(cashInvoice1, "cash1")},[cashInvoice1])
    useEffect(()=>{console.log(selectedCurrency, "selected")},[selectedCurrency])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCashInvoice1({...cashInvoice1, fileName: event.target.files[0].name});
        setCashInvoice1({...cashInvoice1, photo: event.target.files[0]});
    };
    const handleSave = () => {
        cashInvoice1.clientId = clientId;
        setCashInvoice1({...cashInvoice1, cashCurrencyOfPayment:selectedCurrency?.code})
        if (isEmpty(selectedCurrency)) {
            enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (!cashInvoice1.cashInvoiceTypeId) {
            enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (progress==0) {
            enqueueSnackbar(<h4>{t('PHOTONULLERROR')}</h4>, {
                variant: 'error',
            })
        }else if (cashInvoice1?.cashPrice<0){
            enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true)
            setCashInvoice1(cashInvoice1);
            api.saveCashInvoice(cashInvoice1).then((res) => {
                console.log(cashInvoice1)
                setProgress(0);
            });
            if(routingData!=null){
                history.push('/cashinvoice');
            }
            history.go(0);
        }
    };
    const handleChange = (event) => {
        setCashInvoice1({...cashInvoice1, [event.target.name]: event.target.value});
        if(event.target.name=="cashInvoiceTypeId"){
            expensesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setCashInvoice1({...cashInvoice1, cashInvoiceType : type.expensesType, [event.target.name]: event.target.value})
            ))
        }
    };
    return (
        <div className={classes.root}>
        <header>
            <div className="flex flex-1 w-full items-center justify-between">
                <div className="flex flex-1 flex-col items-center sm:items-start">
                    <h1>{t('EXPENSES')}</h1>
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
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required={true}
                            type="date"
                            size={"small"}
                            fullWidth={true}
                            name="cashInvoiceDate"
                            className={"object-center"}
                            value={cashInvoice1?.cashInvoiceDate}
                            id="date"
                            label={t('INVOICEDATE')}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                max:'3000-01-01',
                                min:'1000-01-01',
                                defaultValue: new Date(moment().add().toDate()).toISOString().substring(0, 10)}}
                            variant="outlined"
                            onChange={handleChange}/>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <TextField
                            onChange={handleChange}
                            required={true}
                            name={"cashPrice"}
                            id="price"
                            label={t('AMOUNT')}
                            variant="outlined"
                            value={cashInvoice1?.cashPrice}
                            fullWidth={true}
                            className={"object-center"}
                            size={"small"}
                            type={"number"}
                            InputProps={{inputProps: {min: 0}}}
                            InputLabelProps={{shrink: true}}
                        />
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
                                //@ts-ignore
                                onChange={(event, value) => {
                                    //@ts-ignore
                                    setSelectedCurrency(value);
                                    //@ts-ignore
                                    setCashInvoice1({...cashInvoice1, cashCurrencyOfPayment:value.code})
                                }}
                                //@ts-ignore
                                getOptionLabel={(currency) => currency.currency}
                                renderOption={(currency) => (
                                    <React.Fragment>
                                        {currency.currency} ({currency.code})
                                    </React.Fragment>
                                )}
                                renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                    label={t('SELECTCURRENCY')}
                                                                    variant="outlined"/>}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl required={true} fullWidth={true} size={"small"}
                                     variant="outlined">
                            <InputLabel
                                id="demo-simple-select-outlined-label">{t('INVOICETYPE')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                onChange={(event)=>{handleChange(event)}}
                                name={"cashInvoiceTypeId"}
                                label={t('INVOICETYPE')}
                                value={cashInvoice1?.cashInvoiceTypeId}
                            >{expensesType.map((k) =>
                                <MenuItem value={k.id}>{k.expensesType}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <Grid container spacing={1}
              direction="row-reverse"
              justify="flex-start"
              alignItems="center"
        >
            {routingData!=null?
                <Grid item xs={12} sm={3}>
                    <div>
                        <label></label>
                    </div>
                </Grid>
                : <Grid item xs={12} sm={3}>
                    <div>
                        <ForExcel list={cashInvoicesExcel}></ForExcel>
                    </div>
                </Grid>}

            <Grid item xs={12} sm={3}>
                <Button
                    fullWidth={true}
                    variant="contained"
                    color="primary"
                    disabled={disabled}
                    onClick={handleSave} >
                    {t("SAVE")}
                </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
                <div className={classes.root}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        name={"photo"}
                        onChange={(event)=>{
                            setProgress(1)
                            handleFileChange(event);
                        }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button fullWidth={true}
                                variant="contained"
                                color="secondary"
                                component="span"
                        >
                            {t('UPLOADINVOICEPHOTO')}
                        </Button>
                    </label>
                </div>
            </Grid>
        </Grid>
    </Grid>
        </div>
    );
}
export default CashSave;