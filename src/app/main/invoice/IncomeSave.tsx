import React, {useEffect, useRef, useState} from 'react';
import {createStyles, createTheme, makeStyles} from "@material-ui/core/styles";
import {FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Theme} from "@material-ui/core";
import moment from "moment";
import {Autocomplete} from "@material-ui/lab";
import {currencyListSorted} from "../../types/CurrencyListSorted";
import ForExcel from "./ForExcel";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {CashCurrency, CashInvoice, ExpensesType, Income, IncomesType} from "../../types/UserModel";
import api from "../../services/BackendApi";
import {isEmpty} from "lodash";
import {useSelector} from "react-redux";
import history from '@history';

import { useSnackbar } from "notistack";
import ForIncomeExcel from "./ForIncomeExcel";

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
function IncomeSave(props){
    const classes = useStyles();
    const {t} = useTranslation('SupportPage');
    const {income,incomeExcel,id}=props;
    const [incomesType, setIncomesType]= useState<IncomesType[]>([]);
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
    const [income1, setIncome1] = useState<Income>();
    //@ts-ignore
    const routingData = history.location.displayRouteData;

    useEffect(()=>{
        api.getIncomesType().then((res)=>{
            setIncomesType(res);
        });
        if(routingData != null){
            console.log(routingData, "routta")
            setIncome1(routingData?.income)
            setIncome1({...income1,
                price : routingData?.price,
                incomeDate: routingData?.incomeDate,
                currencyOfPayment: selectedCurrency?.code,
                fileName: routingData?.fileName,
                filePath: routingData?.filePath,
                id: routingData?.id,
                is_active: routingData?.isActive,
                incomeType:routingData?.incomeType,
                incomeTypeId : routingData?.incomeTypeId
            })
        }else {
            setIncome1(income);
        }
    },[])

    useEffect(()=>{console.log(income1, "cash1")},[income1])
    useEffect(()=>{console.log(selectedCurrency, "selected")},[selectedCurrency])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncome1({...income1, fileName: event.target.files[0].name});
        setIncome1({...income1, photo: event.target.files[0]});
    };
    const handleSave = () => {
        console.log(income1, "kontrol")
        income1.clientId = clientId;
        setIncome1({...income1, currencyOfPayment: selectedCurrency?.code})
            if (isEmpty(selectedCurrency)) {
                enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
                })
            } else if (!income1.incomeTypeId) {
                enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
                })
            } else if (progress==0) {
                enqueueSnackbar(<h4>{t('PHOTONULLERROR')}</h4>, {
                    variant: 'error',
                })
            }else if (income1?.price<0){
                enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
                })
            }
            else {
                setDisabled(true)
                setIncome1(income1);
                api.saveIncomeInvoice(income1).then((res) => {
                    console.log(income1)
                    setProgress(0);
                });
            if(routingData!=null){
                history.push('/incomenew');
            }
            history.go(0);
            }
    };

    const handleChange = (event) => {
        setIncome1({...income1, [event.target.name]: event.target.value});
        if(event.target.name=="incomeTypeId"){
            incomesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setIncome1({...income1, incomeType : type.incomesType, [event.target.name]: event.target.value})
            ))
        }
    };

return (
    <div className={classes.root}>
        <header>
            <div className="flex flex-1 w-full items-center justify-between">
                <div className="flex flex-1 flex-col items-center sm:items-start">
                    <h1>{t('INCOMES')}</h1>
                </div>
            </div>
        </header>

    <Grid container spacing={3} direction="column"
          justify="space-between"
          alignItems="stretch"
    >
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
                            name="incomeDate"
                            className={"object-center"}
                            value={income1?.incomeDate}
                            id="date"
                            label={t('INCOMEDATE')}
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
                        name={"price"}
                        id="price"
                        label={t('AMOUNT')}
                        variant="outlined"
                        value={income1?.price}
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
                            setIncome1({...income1, currencyOfPayment:value?.code})
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
                                        name={"incomeTypeId"}
                                        label={t('INCOMETYPE')}
                                        value={income1?.incomeTypeId}
                                    >
                                        {incomesType.map((k) =>
                                        <MenuItem value={k.id}>{k.incomesType}</MenuItem>)}
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
                    <ForIncomeExcel list={incomeExcel}></ForIncomeExcel>
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
                            {t('UPLOAD')}
                        </Button>
                    </label>
                </div>
            </Grid>
        </Grid>
    </Grid>
    </div>
);
}
    export default IncomeSave;