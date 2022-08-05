import React, {useEffect, useRef, useState} from 'react';
import {ClientAccount, InvoiceSettings, InvoiceType} from "../../types/UserModel";
import {useSelector} from "react-redux";
import FusePageCarded from "../../../@fuse/core/FusePageCarded";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import {withSnackbar} from "notistack";
import {createStyles, makeStyles, Theme, useTheme, withStyles, WithStyles} from "@material-ui/core/styles";
import {Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Slide,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import {TransitionProps} from "@material-ui/core/transitions";
import api from "../../services/BackendApi";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog, {DialogProps} from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import DialogActions from "@material-ui/core/DialogActions";
import history from '@history';
import {useFormik} from "formik";
import DialogContentText from '@material-ui/core/DialogContentText';
import {clientAccountScheme} from "../validations/ValidationSchemes";
import Tabs from "@material-ui/core/Tabs";
import Example1 from "./Examples/Example1";
import Example2 from "./Examples/Example2";
import Example3 from "./Examples/Example3";
import Example5 from "./Examples/Example5";
import Example8 from "./Examples/Example8";
import Example9 from "./Examples/Example9";
import Example10 from "./Examples/Example10";
import Example6 from "./Examples/Example6";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import config from "../../services/Config";
import {isEmpty} from 'lodash';
import {isValid} from "js-base64";

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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}
const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),);

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

const DialogTitle1 = withStyles(styles)((props: DialogTitleProps) => {
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

const DialogContent1 = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions1 = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

interface Column {
    id: 'bankName' | 'sortCode' | 'accountNumber' | 'accountIBAN';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexgrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    },
    table: {
        minWidth: 650,
    },
    listItem: {
        color: 'inherit!important',
        textDecoration: 'none!important',
        height: 40,
        width: 'calc(100% - 16px)',
        borderRadius: '0 20px 20px 0',
        paddingLeft: 24,
        paddingRight: 12,
        '&.active': {
            backgroundColor: theme.palette.secondary.main,
            color: `${theme.palette.secondary.contrastText}!important`,
            pointerEvents: 'none',
            '& .list-item-icon': {
                color: 'inherit'
            }
        },
        '& .list-item-icon': {
            marginRight: 16
        },
    },
    container: {
        // maxHeight: 440,
    },
    input: {
        display: 'none',
    },
}));

const getDocumentUrlByFileName = (fileName: string) => {
    var id = sessionStorage.getItem("companyId")
    var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + id + "/" + fileName
    return url
}
function InvoiceSettingsPage(props: any) {
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>({
        selectedInvoiceType: 1,
        isInvoiceNumber: false,
        invoiceNumber: 1,
        clientId: clientId,
        logo: null,
        photo: null,
        web : '',
        fileName : "",
        isMailSend:false,
        invoiceType:"INVOICE",
    } as InvoiceSettings);
    const [invoiceTypeList, setInvoiceTypeList] = useState([]);
    const pageLayout = useRef(null);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [clientAccount, setClientAccount] = useState<ClientAccount>({} as ClientAccount)
    const [clientAccountList, setClientAccountList] = useState<ClientAccount[]>()
    const [bankList, setBankList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [hover, setHover] = useState<number>();
    const [selectedAccount, setSelectedAccount] = useState<ClientAccount>({} as ClientAccount);
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const {t}=useTranslation('document');
    const [firstLoad, setFirstLoad] = React.useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [checked, setChecked] = React.useState(false);
    let forControl;
    let forControl1;

    const columns: Column[] = [
        {id: 'bankName', label: t('BANKNAME')},
        {id: 'sortCode', label: t('BANKSORTCODE'),},
        {id: 'accountNumber', label: t('ACCOUNTNUMBER')},
        {id: 'accountIBAN', label: 'IBAN'},
    ];

    let invoiceLogo :File;
        useEffect(() => {
        test.forEach(x => {
            if (x.client.id === clientId) {
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    api.getAllBankMaster().then((res)=> {
                        setBankList(res);
                    } );
                    api.getClientAccountsByClientId(clientId).then(res => setClientAccountList(res));
                    api.invoiceSettingsType(clientId).then((res)=> {
                        setInvoiceTypeList(res);
                    });
                    api.getInvoiceSettings(clientId, invoiceSettings.invoiceType).then(res => {
                        setInvoiceSettings(res)
                        if(!firstLoad)
                            setFirstLoad(true);
                    });
                }
            }
        })
    }, [])
    useEffect(()=>{
        if(firstLoad){
            forControl1=invoiceSettings?.invoiceNumber;
            forControl=invoiceSettings?.invoiceNumber;
            var id = sessionStorage.getItem("companyId")
            api.getDocumentForClient(id,invoiceSettings.fileName).then(res => {
                var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + id + "/" + invoiceSettings.fileName
                invoiceLogo  = new File([res.data], invoiceSettings.fileName, { type: res.data.type })
                setInvoiceSettings({...invoiceSettings, logo:invoiceLogo})
            });
        }
    },[firstLoad])

    useEffect(()=>{
        setSelectedTab(invoiceSettings.selectedInvoiceType);
        if(invoiceSettings?.invoiceNumber<0){
            props.enqueueSnackbar(<h4>{t('PLEASEENTERPOSITIVEINVOICENUMBER')}</h4>, {
                variant: 'error',
            });
        }else if(forControl<forControl1){
            props.enqueueSnackbar(<h4>{t('PLEASEENTERINVOICENUMBERBIGGER')}:{forControl1}</h4>, {
                variant: 'error',
            });
        }
    },[invoiceSettings])

    let kontrol = 0;

    useEffect(()=>{
        kontrol = 0;
        invoiceTypeList?.map((type)=>{
            if(type.invoiceType==invoiceSettings.invoiceType){
                setInvoiceSettings({...invoiceSettings, invoiceNumber: type.invoiceNumber, isMailSend : type.isMailSend})
                kontrol = kontrol +1;
            }
        })
        if(kontrol == 0){
            setInvoiceSettings({...invoiceSettings, invoiceNumber : 1})
        }
    }, [invoiceSettings.invoiceType])


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangeInvoiceType = (event : React.ChangeEvent<HTMLInputElement>)=>{
        setInvoiceSettings({...invoiceSettings, invoiceType : event.target.value})
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "true") {
            setInvoiceSettings({...invoiceSettings, [event.target.name]: true});
        } else if (event.target.value === "false") {
            setInvoiceSettings({...invoiceSettings, [event.target.name]: false});
        } else {
            setInvoiceSettings({...invoiceSettings, [event.target.name]: event.target.value});
        }
    };

    const handleChange1 = (e)=>{
        setInvoiceSettings({...invoiceSettings, web: e.target.value});
    }
    const handleChange2 =(e)=>{
        setInvoiceSettings({...invoiceSettings, [e.target.name]: e.target.value})
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInvoiceSettings({...invoiceSettings, fileName: event.target.files[0].name})
        setInvoiceSettings({...invoiceSettings, photo :event.target.files[0]});
        setInvoiceSettings({...invoiceSettings, [event.target.name]: event.target.files[0]});
        invoiceLogo= event.target.files[0];
    };

    const handleClickOpen2 = (account) => {
        setSelectedAccount(account)
        setOpen2(true);
    };
    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = (selectedAccount) => {
        formik.values.clientId = selectedAccount.clientId;
        formik.values.id = selectedAccount.id;
        formik.values.bankName = selectedAccount.bankName;
        formik.values.sortCode = selectedAccount.sortCode;
        formik.values.accountNumber = selectedAccount.accountNumber;
        formik.values.accountIBAN = selectedAccount.accountIBAN;
        setClientAccount(selectedAccount);
        setOpen(true);
    };

    useEffect(()=>{
        invoiceSettings.isMailSend=checked;
        },[checked]);
    let kontrol1 = 0;
    const saveSettings = (selected) => {
        invoiceSettings.selectedInvoiceType=(selected ? selected : 1);
        invoiceSettings.isMailSend=checked;
        invoiceSettings.web = (invoiceSettings.web? invoiceSettings.web : "")
        setInvoiceSettings(invoiceSettings)
        kontrol1 = 0;
        invoiceTypeList?.map((type)=>{

            if(type.invoiceType == invoiceSettings.invoiceType && type.invoiceNumber>invoiceSettings.invoiceNumber){
                kontrol1 = kontrol +1;
            }
        })
        if(kontrol1>0){
            props.enqueueSnackbar(<h4>{t('invoice number')}</h4>, {
                variant: 'error',
            })
        }
        else if(!invoiceSettings.logo){
            props.enqueueSnackbar(<h4>{t('PLEASEUPLOADLOGO')}</h4>, {
                variant: 'error',
            })
        } else if(!invoiceSettings.invoiceType){
            props.enqueueSnackbar(<h4>{t('INVOICETYPENULL')}</h4>, {
                variant: 'error',
            })
        }
        else {
            api.saveInvoiceSettings(invoiceSettings).then(res => {
                history.go(0)
            }).catch(error => {
                props.enqueueSnackbar(<h4>{error.message}</h4>, {
                    variant: 'error',
                });
            });
        }
    };
    const handleSave = (model) => {
        if (clientAccount.id) {
            var updateIndex = clientAccountList.findIndex(function (c) {
                return c.id == clientAccount.id;
            });
            let newArr = [...clientAccountList];
            api.controlBankForDelete( clientId?.toString() ,clientAccount?.id?.toString()).then((res)=>{
                if(res<1){
                    api.saveClientAccount(model).then(res => {
                        newArr[updateIndex] = res;
                        setClientAccountList(newArr);
                    });
                }else{
                    props.enqueueSnackbar(<h4>{t("CANTDELETE")}</h4>, {
                        variant: 'error',
                    })
                }
            })

        } else {
            api.saveClientAccount(model).then(res => setClientAccountList([...clientAccountList, res]))
        }
        setOpen(false)
    };

    const handleDelete = () => {

        //@ts-ignore
        api.controlBankForDelete(selectedAccount?.clientId,selectedAccount?.id).then(
            (res)=>{
                if(res<1){
                    // @ts-ignore
                    api.deleteClientAccountById(selectedAccount?.id).then(setClientAccountList(clientAccountList?.filter(i => i.id !== selectedAccount?.id)));
                }else{
                    props.enqueueSnackbar(<h4>{t("CANTDELETE")}</h4>, {
                        variant: 'error',
                    })
                }
            }
        )
        setOpen2(false);
    }

    const formik = useFormik({
        initialValues: {
            clientId: clientAccount?.clientId,
            id: clientAccount?.id,
            bankName: clientAccount?.bankName,
            sortCode: clientAccount?.sortCode,
            accountNumber: clientAccount?.accountNumber,
            accountIBAN: clientAccount?.accountIBAN,
        },
        validationSchema: clientAccountScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSave(values)
        },
    });
    const [open1, setOpen1] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const handleClickOpen1 = (scrollType: DialogProps['scroll']) => () => {
        setOpen1(true);
        setScroll(scrollType);
    };

    const handleClose1 = () => {
        setSelectedTab(invoiceSettings.selectedInvoiceType)
        setOpen1(false);
    };
    const handleNext = () => {
        if (selectedTab < 8) {
            let nextTab = selectedTab + 1
            setSelectedTab(nextTab)
        }
    };
    const handleBack = () => {
        if (selectedTab > 1) {
            let backTab = selectedTab - 1
            setSelectedTab(backTab)
        }
    };

    function handleSelected(selected) {
        invoiceSettings.selectedInvoiceType=selected
        setInvoiceSettings({...invoiceSettings,selectedInvoiceType:selected})
        let temp = invoiceSettings
        setInvoiceSettings(temp)
        setOpen1(false)
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open1) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open1]);

    const handleTabChange3 = (event, value) => {
        setSelectedTab(value);
    };

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                        {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                        <h1>{t("INVOICESETTINGS")}</h1>
                    </div>
                </div>
            }
            content={
                <FusePageSimple
                    classes={{
                        contentWrapper: 'p-0 sm:p-16 h-full',
                        content: 'flex flex-col h-full',
                        leftSidebar: 'w-256 border-0',
                        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
                        wrapper: 'min-h-0'
                    }}
                    content={
                        <div className={classes.root}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Grid item container
                                              direction="row"
                                              justify="space-between"
                                              alignItems="center"
                                              spacing={3}>
                                            <Grid item xs={12} sm={3}>
                                                <h2>{t("INVOICESETTINGS")}</h2>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Button className={"w-full"} variant="contained" color="primary"
                                                        onClick={handleClickOpen1('paper')}>
                                                    {t("INVOICETYPE")}
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Button className={"w-full"} variant="contained" color="primary"
                                                        onClick={()=>saveSettings(selectedTab)}>
                                                    {t("SAVESETTINGS")}
                                                </Button>
                                            </Grid>
                                            <Grid item container
                                                  direction="row"
                                                  justify="space-evenly"
                                                  alignItems="center">
                                                <Grid item xs={12} sm={3}>
                                                    <FormControl required={true} fullWidth={true} size={"small"}
                                                                 variant="outlined">
                                                        <InputLabel
                                                            id="demo-simple-select-outlined-label">{t('INVOICETYPE')}</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={invoiceSettings?.invoiceType}
                                                            onChange={handleChangeInvoiceType}
                                                            name={"invoiceType"}
                                                            label={t('INVOICETYPE')}
                                                        >{Object.keys(InvoiceType).map((k) => <MenuItem
                                                            value={k.toString()}>{InvoiceType[k]}</MenuItem>)}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <FormControl className={"object-center"} component="fieldset"
                                                                 required={true}>
                                                        <FormLabel component="legend">{t('INVOICENUMBERTYPE')}</FormLabel>
                                                        <RadioGroup row aria-label="gender" name="isInvoiceNumber"
                                                                    value={invoiceSettings?.isInvoiceNumber}
                                                                    onChange={handleChange}>
                                                            <FormControlLabel value={false}
                                                                              control={<Radio size={"small"}/>}
                                                                              label={t("DATE")}/>
                                                            <FormControlLabel value={true}
                                                                              control={<Radio size={"small"}/>}
                                                                              label={t("NUMBER")}/>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                {invoiceSettings.isInvoiceNumber === true && (
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            onChange={handleChange2}
                                                            value={invoiceSettings?.invoiceNumber}
                                                            fullWidth={true}
                                                            name="invoiceNumber"
                                                            id="invoice-number"
                                                            label={t('INVOICESTARTNUMBER')}
                                                            type="number"
                                                            InputProps={{inputProps: {min: 0}}}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            required={true}
                                                        />
                                                    </Grid>
                                                )}
                                                <Grid item xs={12} sm={3}>
                                                    {invoiceSettings.logo ?
                                                        <img className={"w-80"} style={{
                                                            minWidth: "300px",
                                                            minHeight: "200px",
                                                            maxWidth: "300px",
                                                            maxHeight: "200px"
                                                        }}
                                                             src={getDocumentUrlByFileName(invoiceSettings?.fileName)}/>:
                                                        <Typography>
                                                            <div className="w-80 h-80"><label>

                                                            </label></div>
                                                        </Typography>
                                                    }
                                                    <div className={classes.root}>
                                                        <input
                                                            accept="image/*"
                                                            className={classes.input}
                                                            id="contained-button-file"
                                                            multiple
                                                            type="file"
                                                            name={"logo"}
                                                            onChange={handleFileChange}

                                                        />
                                                        <label htmlFor="contained-button-file">
                                                            <Button fullWidth={true} variant="contained"
                                                                    color="secondary"
                                                                    component="span"
                                                            >
                                                                {t("UPDATELOGO")}
                                                            </Button>
                                                            <br/>
                                                            <br/>
                                                        </label>
                                                    </div>
                                                </Grid>
                                                <Grid item container
                                                      direction="row"
                                                      justify="space-evenly"
                                                      alignItems="center">
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            onChange={handleChange1}
                                                            value={invoiceSettings?.web?invoiceSettings.web:""}
                                                            fullWidth={true}
                                                            name="web"
                                                            id="invoice-web"
                                                            label={t("COMPANYWEB")}
                                                            type="string"
                                                            variant="outlined"
                                                            required={true}
                                                            InputProps={{inputProps: {min: 0}}}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={handleChangeCheckBox}
                                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                                        />
                                                        <label>{t('SENDMAIL')}</label>
                                                    </Grid>
                                                    <Grid item xs={3}></Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="space-between"
                                            alignItems="center"
                                            spacing={3}
                                        >
                                            <Grid item xs={6} sm={3}>
                                                <h2>{t('BANKACCOUNTS')}</h2>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Button className={"w-full"} variant="contained" color="primary"
                                                        onClick={() => handleClickOpen({clientId: clientId} as ClientAccount)}>
                                                    {t("ADDACCOUNT")}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TableContainer component={Paper} className={"shadow-2xl"}>
                                                    <Table className={classes.table} aria-label="simple table"
                                                           size={"small"}>
                                                        <TableHead>
                                                            <TableRow>
                                                                {columns.map((column) => (
                                                                    <TableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        style={{minWidth: column.minWidth}}
                                                                    >
                                                                        {column.label}
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell align={"right"}>
                                                                    {t("DELETE")}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {clientAccountList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                                return (
                                                                    <TableRow hover role="checkbox" tabIndex={-1}
                                                                              key={row.id}>
                                                                        {columns.map((column) => {
                                                                            const value = row[column.id];
                                                                            return (<TableCell
                                                                                    onClick={() => handleClickOpen(row)}
                                                                                    key={column.id}
                                                                                    align={column.align}>
                                                                                    {value}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                        <TableCell
                                                                            onClick={() => handleClickOpen2(row)}
                                                                            align={"right"}
                                                                            onMouseEnter={() => setHover(row.id)}
                                                                            onMouseLeave={() => setHover(null)}>
                                                                            <Icon className="list-item-icon text-28 "
                                                                                  color={hover === row.id ? "error" : "inherit"}>
                                                                               delete
                                                                            </Icon>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <TablePagination
                                                    rowsPerPageOptions={[10, 25, 100]}
                                                    component="div"
                                                    count={clientAccountList?.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                    ActionsComponent={TablePaginationActions}
                                                />
                                            </Grid>

                                        </Grid>
                                        <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                                            <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                                                <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                                    <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                                            aria-labelledby="customized-dialog-title" open={open}>
                                                        <form onSubmit={formik.handleSubmit}>
                                                            <DialogTitle1 id="customized-dialog-title"
                                                                          onClose={handleClose}>
                                                                {t("DETAILS")}
                                                            </DialogTitle1>
                                                            <DialogContent1 dividers>
                                                                <div className={"w-full p-32"}>
                                                                    <div className={"w-full"}>

                                                                        <Grid
                                                                            container
                                                                            direction="row"
                                                                            justify="space-evenly"
                                                                            alignItems="center"
                                                                            spacing={3}
                                                                        >
                                                                            <Grid item xs>
                                                                                <FormControl required={true}
                                                                                             fullWidth={true}
                                                                                             variant="outlined">
                                                                                    <InputLabel
                                                                                        id="demo-simple-select-outlined-label">{t("BANKNAME")}</InputLabel>
                                                                                    <Select
                                                                                        id="bank-name"
                                                                                        variant={"outlined"}
                                                                                        value={formik.values.bankName}
                                                                                        onChange={formik.handleChange}
                                                                                        error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                                                                                        //@ts-ignore
                                                                                        helperText={formik.touched.bankName && formik.errors.bankName}
                                                                                        name={"bankName"}
                                                                                        select={true}
                                                                                        label={t("BANKNAME")}
                                                                                    >
                                                                                        <MenuItem value="">
                                                                                            <em>{t('BANKNAME')}</em>
                                                                                        </MenuItem>
                                                                                        {bankList.map((k) =>
                                                                                        <MenuItem value={k.name}>{k.name}</MenuItem>)}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"MONESE"}>Monese</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"BARCLAYS"}>Barclays</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"HSBC"}>HSBC</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"TURKISHBANKUK"}>Turkish Bank UK</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"TIDEBANK"}>Tide Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"STARLINGBANK"}>Starling Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"SANTANDEBANK"}>Santande Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"NATWESTBANK"}>NatWest Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"MONZOBANK"}>Monzo Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"METROBANK"}>METRO Bank</MenuItem>*/}
                                                                                        {/*<MenuItem*/}
                                                                                        {/*    value={"LLOYDSBANK"}>Lloyds Bank</MenuItem>*/}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </Grid>
                                                                            <Grid item xs>
                                                                                <TextField
                                                                                    name={"sortCode"}
                                                                                    id="sort-code"
                                                                                    label={t("SORTCODE")}
                                                                                    variant="outlined"
                                                                                    type="number"
                                                                                    value={formik.values.sortCode}
                                                                                    onChange={formik.handleChange}
                                                                                    error={formik.touched.sortCode && Boolean(formik.errors.sortCode)}
                                                                                    helperText={formik.touched.sortCode && formik.errors.sortCode}
                                                                                    fullWidth={true}
                                                                                    className={"object-center"}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item xs>
                                                                                <TextField
                                                                                    name={"accountNumber"}
                                                                                    id="account-number"
                                                                                    label={t("ACCOUNTNUMBER")}
                                                                                    variant="outlined"
                                                                                    type="number"

                                                                                    value={formik.values.accountNumber}
                                                                                    onChange={formik.handleChange}
                                                                                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                                                                                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                                                                                    fullWidth={true}
                                                                                    className={"object-center"}
                                                                                />
                                                                            </Grid>

                                                                        </Grid>
                                                                        <Grid
                                                                            container
                                                                            direction="row"
                                                                            justify="space-evenly"
                                                                            alignItems="center"
                                                                            spacing={3}
                                                                        >
                                                                            <Grid item xs>
                                                                                <TextField
                                                                                    name={"accountIBAN"}
                                                                                    id="account-IBAN"
                                                                                    label="IBAN"
                                                                                    variant="outlined"
                                                                                    value={formik.values.accountIBAN}
                                                                                    onChange={formik.handleChange}
                                                                                    error={formik.touched.accountIBAN && Boolean(formik.errors.accountIBAN)}
                                                                                    helperText={formik.touched.accountIBAN && formik.errors.accountIBAN}
                                                                                    fullWidth={true}
                                                                                    rows={4}
                                                                                    className={"object-center"}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </div>
                                                                </div>
                                                            </DialogContent1>
                                                            <DialogActions1>
                                                                <Button autoFocus type={"submit"} color="primary">
                                                                    {t("SAVECHANGES")}
                                                                </Button>
                                                            </DialogActions1>
                                                        </form>
                                                    </Dialog>
                                                </Paper>
                                            </FuseAnimate>
                                        </div>
                                        <div>
                                            <Dialog
                                                open={open2}
                                                TransitionComponent={Transition}
                                                keepMounted
                                                onClose={handleClose2}
                                                aria-labelledby="alert-dialog-slide-title"
                                                aria-describedby="alert-dialog-slide-description"
                                            >
                                                <DialogTitle1 onClose={handleClose}
                                                              id="alert-dialog-slide-title">{t("DELETEACCOUNT")}</DialogTitle1>
                                                <DialogContent1>
                                                    <DialogContentText id="alert-dialog-slide-description">
                                                        {t("DELETEQUESTIONS")}
                                                    </DialogContentText>
                                                </DialogContent1>
                                                <DialogActions1>
                                                    <Button onClick={handleClose2} color="primary">
                                                        {t("DISAGREE")}
                                                    </Button>
                                                    <Button onClick={handleDelete} color="primary">
                                                        {t("AGREE")}
                                                    </Button>
                                                </DialogActions1>
                                            </Dialog>
                                        </div>
                                        <div>
                                            <Dialog
                                                open={open1}
                                                onClose={handleClose1}
                                                //@ts-ignore
                                                scroll={scroll}
                                                aria-labelledby="scroll-dialog-title"
                                                aria-describedby="scroll-dialog-description"
                                            >
                                                <DialogTitle id="scroll-dialog-title" style={{textAlign:'center'}}>
                                                    {invoiceSettings.selectedInvoiceType==selectedTab?<label style={{color: "red"}}>ACTIVE</label>:
                                                        <label></label>}
                                                </DialogTitle>
                                                <DialogContent dividers={scroll === 'paper'}>
                                                    <DialogContentText
                                                        id="scroll-dialog-description"
                                                        ref={descriptionElementRef}
                                                        tabIndex={-1}
                                                    >
                                                        <div className="p-24">
                                                            <Tabs
                                                                value={selectedTab}
                                                                defaultValue={1}
                                                                onChange={handleTabChange3}
                                                                indicatorColor="primary"
                                                                textColor="primary"
                                                                variant="scrollable"
                                                                scrollButtons="on"
                                                                className="w-full h-64"
                                                            >
                                                            </Tabs>
                                                            {selectedTab === 1 && (
                                                                <div >
                                                                    <Example1></Example1>
                                                                </div>
                                                            )}
                                                            {selectedTab === 2 && (
                                                                <div >
                                                                    <Example2></Example2>
                                                                </div>
                                                            )}
                                                            {selectedTab === 3 && (
                                                                <div >
                                                                    <Example3></Example3>
                                                                </div>
                                                            )}
                                                            {selectedTab === 4 && (
                                                                <div >
                                                                    <Example5></Example5>
                                                                </div>
                                                            )}
                                                            {selectedTab === 5 && (
                                                                <div >
                                                                    <Example6></Example6>
                                                                </div>
                                                            )}
                                                            {/*{selectedTab === 6 && (*/}
                                                            {/*    <div >*/}
                                                            {/*        <Example7></Example7>*/}
                                                            {/*    </div>*/}
                                                            {/*)}*/}
                                                            {selectedTab === 6 && (
                                                                <div >
                                                                    <Example8></Example8>
                                                                </div>
                                                            )}
                                                            {selectedTab === 7 && (
                                                                <div >
                                                                    <Example9></Example9>
                                                                </div>
                                                            )}
                                                            {selectedTab === 8 && (
                                                                <div>
                                                                    <Example10></Example10>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <div>
                                                    <Button onClick={handleBack} color="primary">
                                                        {'<'}
                                                    </Button>
                                                    <Button onClick={() => handleSelected(selectedTab)}
                                                            color="primary">
                                                        {t("SELECT")}
                                                    </Button>
                                                    <Button onClick={handleNext} color="primary">
                                                        {'>'}
                                                    </Button>
                                                    <Button onClick={handleClose1} color="primary">
                                                        {t("CANCEL")}
                                                    </Button>
                                                    </div>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    </Paper>
                                </Grid>

                            </Grid>
                        </div>

                    }
                    sidebarInner
                    ref={pageLayout}
                    innerScroll
                />
            }
            innerScroll
        />
    );
}


export default withSnackbar(InvoiceSettingsPage);
