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
    Client, CashCurrency, Income,
    ForFilterIncomes, ForFilterIncomeExcel, IncomesType,
} from "../../types/UserModel";
import {useSelector} from "react-redux";
import Button from "@material-ui/core/Button";
import {isEmpty} from 'lodash';
import history from '@history';
import moment from "moment";
import {useTranslation} from "react-i18next";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import {withSnackbar} from "notistack";
import Typography from "@material-ui/core/Typography";
import IncomeSave from "./IncomeSave";
import IncomeList from "./IncomeList";

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
function IncomePage(props) {
    const classes = useStyles();
    const clientId = useSelector(({company}) => company.currentCompanyId);
    // @ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const [client, setClient] = useState<Client>();
    // @ts-ignore
    const [income, setIncome] = useState<Income>({
        clientId: null,
        price: 0,
        currencyOfPayment: 'Pound Sterling(GBP)',
        incomeTypeId: null,
        incomeDate: new Date(moment().add().toDate()).toISOString().substring(0, 10),
        is_active:true,
        incomeType:"",
    } as Income);
    const pageLayout = useRef(null);
    const [incomes, setIncomes] = useState<Income[]>();
    const [selectedCurrency, setSelectedCurrency] = useState<CashCurrency>(    {
        "code": "GBP",
        "number": "826",
        "digits": 2,
        "currency": "Pound Sterling",
    });
    const [mindateDue, setMindateDue] = useState<string>(new Date(moment().add().toDate()).toISOString().substring(0, 10));
    const {t} = useTranslation('SupportPage');
    const [progress, setProgress] = React.useState(0);
    const [incomeExcel, setIncomeExcel] = useState<Income[]>();
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [forFilter, setForFilter]= useState<ForFilterIncomes>();
    const [forFilterExcell, setForFilterExcell]= useState<ForFilterIncomeExcel>();
    const [incomesType, setIncomesType]= useState<IncomesType[]>([]);
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
                    api.getIncomesType().then((res)=>{
                        setIncomesType(res);
                    });
                    setForFilter({...forFilter, page:page,size:rowsPerPage,clientId: clientId})
                    setForFilterExcell({...forFilterExcell,clientId: clientId})
                }
            }
        })
    }, []);
    function handleClick(){
        getIncomesByFilter(forFilter)
    }
    function handleClear(){
        forFilter.incomeDate = "";
        forFilter.incomeEndDate = "";
        forFilter.incomeType = "";

        setForFilter({...forFilter, page:0,size:25,
            incomeDate:null,
            incomeEndDate:null,
            incomeType:null,
            currency:null,
            search:null,
            clientId:clientId});
        setForFilterExcell({...forFilterExcell,
            incomeDate:null,
            incomeEndDate:null,
            incomeType:null,
            currency:null,
            search:null,
            clientId:clientId});
    }

    function getIncomesByFilter(forFilter){
        if(forFilter!=null){
            api.getIncomesByFilter(forFilter).then(response => {
                incomesType?.filter(type=>response.content?.incomeTypeId==type.id).map((type)=>(
                    response.content.incomeType=type.incomesType
                ));
                setIncomes(response.content);
                setTotalElements(response.totalElements);
            });
            api.getAllIncomeForExcelByClientId(forFilterExcell).then(res=>{
                incomesType?.filter(type=>res.content?.incomeTypeId==type.id).map((type)=>(
                    res.content.incomesType=type.incomesType
                ));
                setForFilterExcell(res);
            })
        }
    }
    useEffect(() => {
        getIncomesByFilter(forFilter);
    }, [forFilter]);

    useEffect(()=>{
        if(forFilterExcell!=null) {
            api.getAllIncomeForExcelByClientId(forFilter).then(response => {
                incomesType?.filter(type => response.content?.incomeTypeId == type.id).map((type) => (
                    response.content.incomeType = type.incomesType
                ));
                setIncomeExcel(response);
            });
        }
    },[forFilterExcell])

    const handleChange = (event) => {
        setIncome({...income, [event.target.name]: event.target.value});
        if(event.target.name=="incomeTypeId"){
            incomesType?.filter(type=>event.target.value==type.id).map((type)=>(
                setIncome({...income, incomeType : type.incomesType, [event.target.name]: event.target.value})
            ))
        }
    };
    const handleChangeForFilter = (event) => {
        setForFilter({...forFilter, [event.target.name]: event.target.value});
        setForFilterExcell({...forFilterExcell, [event.target.name]: event.target.value});
    };

    useEffect(() => {
        setMindateDue(income?.incomeDate);
    }, [handleChange]);

    const handleSave = () => {
        income.clientId = clientId;
        if (isEmpty(selectedCurrency)) {
            props.enqueueSnackbar(<h4>{t('CURRENCYNULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (!income.incomeTypeId) {
            props.enqueueSnackbar(<h4>{t('INVOICENULLERROR')}</h4>, {
                variant: 'error',
            })
        } else if (progress==0) {
            props.enqueueSnackbar(<h4>{t('PHOTONULLERROR')}</h4>, {
                variant: 'error',
            })
        }else if (income?.price<0){
            props.enqueueSnackbar(<h4>{t('NEGATIVEVALUEERROR')}</h4>, {
                variant: 'error',
            })
        }
        else {
            setDisabled(true)
            setIncome({...income, is_active: true})
            setIncome(income);
            api.saveIncomeInvoice(income).then((res) => {
                setProgress(0);
                history.go(0);
            })
        }
    }
    useEffect(()=>{console.log(income, "cash")},[income])
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncome({...income, fileName: event.target.files[0].name});
        setIncome({...income, photo: event.target.files[0]});
    };
    useEffect(() => {
        income.currencyOfPayment = selectedCurrency?.code;
        setIncome(income);
    }, [selectedCurrency]);

    useEffect(()=>{
        setIncome({...income, filePath:client?.clientFolder})
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
                            <h2>{t('INCOMES')}</h2>
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
                                    name="incomeDate"
                                    color={'secondary'}
                                    className={"object-center"}
                                    id="date"
                                    label={t('INCOMEDATE')}
                                    value={forFilter?.incomeDate}
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
                                    name="incomeEndDate"
                                    className={"object-center"}
                                    id="date"
                                    label={t('INCOMEENDDATE')}
                                    value={forFilter?.incomeEndDate}
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
                    <IncomeSave
                        income={income}
                        incomeExcel={incomeExcel}
                        handleFileChange={handleFileChange}
                        handleSave={handleSave}
                        handleChange={handleChange}
                        handleClick={handleClick}
                    ></IncomeSave>
                    <Grid item xs={12} sm={12}>
                        <IncomeList
                            clientId={clientId}
                            pageLayout={pageLayout}
                            selectedItem={income}
                            incomes={incomes}
                            setIncomes={setIncomes}
                            setSelectedItem={setIncome}
                            totalElements={totalElements}
                            setTotalElements={setTotalElements}
                            forFilter={forFilter}
                            setForFilter={setForFilter}
                            forFilterExcell={ forFilterExcell}
                            setForFilterExcell={setForFilterExcell}
                            incomeExcel={incomeExcel}
                            setIncomeExcel={setIncomeExcel}
                            incomesType={incomesType}
                            setIncomesType={setIncomesType}
                            handleClick={handleClick}
                            handleClear={handleClear}
                            handleFileChange={handleFileChange}
                            handleSave={handleSave}
                            handleChange={handleChange}
                            openBackDrop={openBackDrop}
                            setOpenBackDrop={setOpenBackDrop}
                            progress={progress}
                            setProgress={setProgress}
                        ></IncomeList>
                    </Grid>
                </div>
            }
        ></FusePageCarded>
    );
}
export default withSnackbar(IncomePage);
