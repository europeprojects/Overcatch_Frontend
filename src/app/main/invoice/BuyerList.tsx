import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';
import {
    DialogContentText,
    FormControl,
    Grid, MenuItem,
    Paper, Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField,
} from "@material-ui/core";
import {createStyles, makeStyles, Theme, useTheme, withStyles, WithStyles} from "@material-ui/core/styles";
import {BuyerInfo} from "../../types/UserModel";
import Icon from "@material-ui/core/Icon";
import { useSelector} from 'react-redux';
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import FuseAnimate from "../../../@fuse/core/FuseAnimate";
import api from "../../services/BackendApi";
import {TransitionProps} from "@material-ui/core/transitions";
import history from "../../../@history/@history";
import {withSnackbar} from "notistack";
import {useFormik} from "formik";
import {buyerValidationScheme} from "../validations/ValidationSchemes";
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import {useTranslation} from "react-i18next";

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

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
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
        maxHeight: 440,
    },
}));

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function CreateBuyerFirm(props: any) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [buyer, setBuyer] = useState<BuyerInfo>({} as BuyerInfo);
    const [buyerList, setBuyerList] = useState<BuyerInfo[]>();
    const pageLayout = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [hover, setHover] = useState<number>();
    const [selectedBuyer, setSelectedBuyer] = useState<BuyerInfo>();
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const {t}=useTranslation('document');
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    interface Column {
        id: 'buyerName' | 'commercialTitle' | 'buyerEmail' | 'buyerPhone' | 'buyerAddress' | 'vatNumber' | 'companyRegister';
        label: string;
        minWidth?: number;
        align?: 'right';
        format?: (value: number) => string;
    }

    const columns: Column[] = [
        {id: 'buyerName', label: t('NAME')},
        {id: 'commercialTitle', label: t('TRADEASNAME'),},
        {id: 'buyerPhone', label: t('PHONE')},
        {id: 'buyerAddress', label: t('ADDRESS')},
        {id: 'buyerEmail', label: t('EMAIL'),},
        {id: 'vatNumber', label: t('VATNUMBER')},
        {id: 'companyRegister', label: t('COMPANYREGISTER')},
    ];

    const formik = useFormik({
        initialValues: {
            clientId:buyer.clientId,
            id:buyer.id,
            accountType: buyer.accountType,
            buyerName: buyer.buyerName,
            commercialTitle: buyer.commercialTitle,
            buyerAddress: buyer.buyerAddress,
            buyerPhone: buyer.buyerPhone,
            buyerEmail: buyer.buyerEmail,
            vatNumber:buyer.vatNumber,
            companyRegister:buyer.companyRegister,
        },
        validationSchema: buyerValidationScheme,
        onSubmit: (values) => {
            // @ts-ignore
            handleSave(values)
            // alert(JSON.stringify(values))
        },
    });

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        test.forEach(x=>{
            if(x.client.id===clientId){
                if(x.client.state!=="3"){
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>,{
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                }else{
                    setBuyer({...buyer, clientId: clientId});
                    //@ts-ignore
                    api.getBuyersByClientId(clientId).then(res => setBuyerList(res));
                }
            }
        })
    }, [])

    const handleClickOpen = (selectedBuyer) => {
        formik.values.clientId=selectedBuyer.clientId;
        formik.values.id=selectedBuyer.id;
        formik.values.accountType=selectedBuyer.accountType;
        formik.values.buyerName=selectedBuyer.buyerName;
        formik.values.commercialTitle=selectedBuyer.commercialTitle;
        formik.values.buyerAddress=selectedBuyer.buyerAddress;
        formik.values.buyerPhone=selectedBuyer.buyerPhone;
        formik.values.buyerEmail=selectedBuyer.buyerEmail;
        formik.values.vatNumber=selectedBuyer.vatNumber;
        formik.values.companyRegister=selectedBuyer.companyRegister;
        setBuyer(selectedBuyer);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen2 = (buyer) => {
        setSelectedBuyer(buyer)
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleSave = (model) => {
        if (buyer?.id) {
            var updateIndex = buyerList.findIndex(function (c) {
                return c.id == buyer.id;
            });
            let newArr = [...buyerList];
            api.controlForDeleteCustomer(clientId,buyer?.buyerName).then((res)=>{
                if(res<1){
                    api.saveBuyer(model).then(res => {
                        newArr[updateIndex] = res;
                        setBuyerList(newArr);
                    });
                }else{
                    props.enqueueSnackbar(<h4>{t("CANTDELETE")}</h4>, {
                        variant: 'error',
                    })
                }
            })
        } else {
            api.saveBuyer(model).then(res => setBuyerList([...buyerList, res]))
        }
        setOpen(false)
    };

    const handleChangeDialog = (event) => {
        setBuyer({...buyer, [event.target.name]: event.target.value});
    };

    const handleDelete = () => {
        api.controlForDeleteCustomer(clientId,selectedBuyer.buyerName).then((res)=>{
            if(res<1){
                // @ts-ignore
                api.deleteBuyerById(selectedBuyer?.id).then(setBuyerList(buyerList.filter(i => i.id !== selectedBuyer?.id)));
            } else{
                props.enqueueSnackbar(<h4>{t("DELETECONTROL")}</h4>, {
                    variant: 'error',
                })
            }
        })
        setOpen2(false);
    }
    const useStyles1 = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexShrink: 0,
                marginLeft: theme.spacing(2.5),
            },
        }),
    );

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
                        <h1>{t("INVOICE")}</h1>
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
                        <div>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                spacing={3}>
                                <Grid item xs={6} sm={3}>
                                    <h2>{t('CUSTOMERLIST')}</h2>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Button className={"w-full"} variant="contained" color="primary"
                                            onClick={() => handleClickOpen({clientId: clientId} as BuyerInfo)}>                                            
                                        {t('ADDCUSTOMER')}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} className={classes.paper}>
                                        <Table className={classes.table} aria-label="simple table" size={"small"}>
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
                                                    <TableCell>
                                                        {t('DELETE')}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {buyerList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <TableCell onClick={() => handleClickOpen(row)}
                                                                               key={column.id} align={column.align}>
                                                                        {value}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                            <TableCell onClick={() => handleClickOpen2(row)}
                                                                       align={"center"}
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
                                        count={buyerList?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}/>
                                </Grid>
                            </Grid>
                            <div className=" p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4 ">
                                <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                                    <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                                        <Dialog fullWidth={true} maxWidth={"md"} onClose={handleClose}
                                                aria-labelledby="customized-dialog-title" open={open}>
                                            <form onSubmit={formik.handleSubmit}>
                                                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                                    {t(' DETAILS')}
                                                </DialogTitle>
                                                <DialogContent dividers>
                                                    <div className={"w-full p-32"}>
                                                        <div className={"w-full"}>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justify="space-evenly"
                                                                alignItems="center"
                                                                spacing={3}>
                                                                <Grid item xs>
                                                                    <FormControl fullWidth={true}
                                                                                 variant="outlined">
                                                                        <TextField
                                                                            id="accountType"
                                                                            variant={"outlined"}
                                                                            value={formik.values.accountType}
                                                                            onChange={formik.handleChange}
                                                                            error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                                                                            helperText={formik.touched.accountType && formik.errors.accountType}
                                                                            name={"accountType"}
                                                                            select={true}
                                                                            label={t('ACCOUNTTYPE')}>
                                                                            <MenuItem value="">
                                                                                <em>None</em>
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                value={"COMPANY"}>{t('COMPANY')}</MenuItem>
                                                                            <MenuItem
                                                                                value={"SOLETRADER"}>{t("SOLETRADER")}</MenuItem>
                                                                            <MenuItem
                                                                                value={"INDIVIDUAL"}>{t("INDIVIDUAL")}</MenuItem>
                                                                        </TextField>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        name={"buyerName"}
                                                                        id="buyer-Name"
                                                                        label={t("NAME")}
                                                                        variant="outlined"
                                                                        value={formik.values.buyerName}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.buyerName && Boolean(formik.errors.buyerName)}
                                                                        helperText={formik.touched.buyerName && formik.errors.buyerName}
                                                                        fullWidth={true}
                                                                        className={"object-center"}/>
                                                                </Grid>
                                                                {(formik.values.accountType === "SOLETRADER") ? (
                                                                    <Grid item xs>
                                                                        <TextField
                                                                            name={"commercialTitle"}
                                                                            id="commercial-Title"
                                                                            label={t("TRADEASNAME")}
                                                                            variant="outlined"
                                                                            value={formik.values.commercialTitle}
                                                                            onChange={formik.handleChange}
                                                                            fullWidth={true}
                                                                            className={"object-center"}/>
                                                                    </Grid>
                                                                ) : ("")}
                                                            </Grid>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justify="space-evenly"
                                                                alignItems="center"
                                                                spacing={3}>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        name={"buyerAddress"}
                                                                        id="buyer-Address"
                                                                        label={t("ADDRESS")}
                                                                        variant="outlined"
                                                                        value={formik.values.buyerAddress}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.buyerAddress && Boolean(formik.errors.buyerAddress)}
                                                                        helperText={formik.touched.buyerAddress && formik.errors.buyerAddress}
                                                                        fullWidth={true}
                                                                        rows={4}
                                                                        className={"object-center"}/>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justify="space-evenly"
                                                                alignItems="center"
                                                                spacing={3}>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        className={"object-center"}
                                                                        name={"buyerPhone"}
                                                                        id="buyer-Phone"
                                                                        label={t('PHONE')}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        value={formik.values.buyerPhone}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.buyerPhone && Boolean(formik.errors.buyerPhone)}
                                                                        helperText={formik.touched.buyerPhone && formik.errors.buyerPhone}/>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        className={"object-center"}
                                                                        name={"buyerEmail"}
                                                                        id="buyer-Email"
                                                                        label={t('EMAIL')}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        value={formik.values.buyerEmail}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.buyerEmail && Boolean(formik.errors.buyerEmail)}
                                                                        helperText={formik.touched.buyerEmail && formik.errors.buyerEmail}/>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container
                                                                direction="row"
                                                                justify="space-evenly"
                                                                alignItems="center"
                                                                spacing={3}>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        className={"object-center"}
                                                                        name={"vatNumber"}
                                                                        id="vatNumber"
                                                                        label={t('VATNUMBER')}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        value={formik.values.vatNumber}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.vatNumber && Boolean(formik.errors.vatNumber)}
                                                                        helperText={formik.touched.vatNumber && formik.errors.vatNumber}/>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <TextField
                                                                        className={"object-center"}
                                                                        name={"companyRegister"}
                                                                        id="companyRegister"
                                                                        label={t('COMPANYREGISTER')}
                                                                        variant="outlined"
                                                                        fullWidth={true}
                                                                        value={formik.values.companyRegister}
                                                                        onChange={formik.handleChange}
                                                                        error={formik.touched.companyRegister && Boolean(formik.errors.companyRegister)}
                                                                        helperText={formik.touched.companyRegister && formik.errors.companyRegister}/>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button autoFocus type={"submit"} color="primary">
                                                        {t('SAVECHANGES')}
                                                    </Button>
                                                </DialogActions>
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
                                    aria-describedby="alert-dialog-slide-description">
                                    <DialogTitle onClose={handleClose2}
                                                 id="alert-dialog-slide-title">{"Delete account?"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                            {t("DELETEQUESTION")}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose2} color="primary">
                                            {t('DISAGREE')}
                                        </Button>
                                        <Button onClick={handleDelete} color="primary">
                                            {t('AGREE')}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
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

export default withSnackbar(CreateBuyerFirm);
