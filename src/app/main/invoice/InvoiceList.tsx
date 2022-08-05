import React, {useEffect, useRef, useState} from 'react';
import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';

import {
    ButtonGroup, Checkbox,
    DialogContentText,
    Grid, ListItemText, MenuItem,
    Paper, Select,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    ThemeProvider,
    useTheme,
    withStyles,
    WithStyles
} from "@material-ui/core/styles";
import {Invoice, Client, InvoiceType, BuyerInfo, ForFilter, ClientAccount, InvoiceDetail,} from "../../types/UserModel";
import {useSelector} from 'react-redux';
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import FusePageSimple from "../../../@fuse/core/FusePageSimple";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import api from "../../services/BackendApi";
import {TransitionProps} from "@material-ui/core/transitions";
import InvoicePrintDialog from "./InvoicePrintDialog";
import {withSnackbar} from "notistack";
import history from '@history';
import {Link} from 'react-router-dom';
import {Alert, Autocomplete} from "@material-ui/lab";
import ReactDOM from "react-dom";
import moment from "moment";
import {useTranslation} from "react-i18next";
import Invoice2 from "./Invoice2";
import Invoice3 from "./Invoice3";
import Invoice4 from "./Invoice4";
import Invoice5 from "./Invoice5";
import InvoiceLayer1 from "./invoiceLayer1";
import InvoiceLayer2 from "./invoiceLayer2";
import InvoiceLayer3 from "./InvoiceLayer3";
import InvoiceLayer4 from "./invoiceLayer4";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FuseAnimate from '@fuse/core/FuseAnimate';
import LastPageIcon from "@material-ui/icons/LastPage";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import Invoice1 from "./Invoice1";
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input";
import {currencyListSorted} from "../../types/CurrencyListSorted";


interface Column {
    id: 'invoiceCode' | 'invoiceType' | 'invoiceDate' | 'buyerName' | 'total' | 'currencyOfPayment';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    {id: 'invoiceCode', label: 'Invoice Code'},
    {id: 'invoiceType', label: 'Invoice Type',},
    {id: 'buyerName', label: 'Bill Recipient'},
    {id: 'total', label: 'Total', align: 'right'},
    {id: 'currencyOfPayment', label: 'Currency', align: 'right'},
    {id:'invoiceDate', label:'Date'}
];

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
    }),
);

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
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    table: {
        minWidth: 650,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
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
        maxHeight: 480,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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
function InvoiceDetailx(props: any) {
    // @ts-ignore
    const pushedInvoice = history.location.displayRouteData;
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [totalElements, setTotalElements] = React.useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice>({} as Invoice);
    const pageLayout = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const [updateState, setUpdateState] = useState(false);
    const [client, setClient] = useState<Client>();
    const [invoice, setInvoice] = useState<Invoice>(pushedInvoice ? pushedInvoice : {} as Invoice);
    const [invoiceList, setInvoiceList] = useState<Invoice[]>();
    const [buyerList, setBuyerList] = useState<BuyerInfo[]>();
    const [clientAccountList, setClientAccountList] = useState<ClientAccount[]>();
    // const {t} = useTranslation('letter');
    const [letterType, setLetterType] = React.useState([]);
    const [letterTypeSelected, setLetterTypeSelected] = React.useState([]);
    const {t} = useTranslation('task');
    const [forFilter, setForFilter] = useState<ForFilter>();

    // const [invoiceDetailList, setInvoiceDetailList] = useState<InvoiceDetail[]>([{quantity:1,unitPrice:1,vatRate:0} as InvoiceDetail]);
    const [disable, setDisable]=useState(false);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleClose4 = () => {
        setOpen3(false);
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setForFilter({...forFilter, page:newPage, size:rowsPerPage})
    };

    function getInvoicesByFilter(forFilter) {
        if (forFilter != null) {
            api.getInvoicesByFilter(forFilter).then(response => {
                setInvoiceList(response.content);
                setTotalElements(response.totalElements);
            });
        }
    }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForFilter({...forFilter, page:0,size:parseInt(event.target.value, 10)});
    };
    useEffect(() => {
        invoice.invoiceDate = (new Date(moment().add().toDate()).toISOString().substring(0, 10))
        setInvoice(invoice);
        test.forEach(x => {
            if (x.client.id === clientId) {
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    setForFilter({...forFilter, page:page,size:rowsPerPage,client_id: clientId})
                    api.getBuyersByClientId(clientId).then((res) => {
                        setBuyerList(res);
                        console.log(res,"buyer");
                        console.log(clientId,"client");
                    });
                    api.getClientAccountsByClientId(clientId).then(res => setClientAccountList(res));
                    // api.getInvoiceListByClientId(clientId).then((res) => {
                    //     setInvoiceList(res);
                    // })
                    // api.getNewInvoice(clientId).then(res => setInvoice(res));
                    // @ts-ignore
                    api.getClient(clientId).then((res) => {setClient(res);})
                }
            }
        })
    }, [])
    const handleClickOpen = (clickedInvoice) => {
        setSelectedInvoice(clickedInvoice)
        setOpen(true);
    };
    // useEffect(() => {
    //     if (selectedInvoice.selectedInvoiceType == null) {
    //         setSelectedInvoice({...selectedInvoice, selectedInvoiceType: 1})
    //     }
    // }, [selectedInvoice]);
    useEffect(() => {
        getInvoicesByFilter(forFilter);
    }, [forFilter]);
    const handleClickOpenDeneme = (clickedInvoice) => {
        setSelectedInvoice(clickedInvoice);
        setOpen(true);
    };
    const handleClickOpen2 = (invoice) => {
        setSelectedInvoice(invoice);
        setOpen2(true);
    };
    const handleClose2 = () => {
        setDisable(false);
        setOpen2(false);
    };
    const handleUpdate = () => {
        api.getInvoiceUpdateRequest(selectedInvoice?.id).then(res => res)
        setTimeout(() => {
            history.go(0)
        }, 2000)
    }
    const handleDeleteRequest = () => {
        setOpen2(false);
        api.getInvoiceDeleteRequest(selectedInvoice?.id).then(res => res)

        setTimeout(() => {
            history.go(0)
        }, 2000)
    }

    const printDocument = () => {
        const input = document.getElementById('divToPrint');
        const pdf = new jsPDF();
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        if (pdf) {
            html2canvas(input, {
                useCORS: true
            })
                .then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, 10, width, height);
                    // pdf.addImage(imgData, 'PNG', 10, 10, 0, 0);
                    pdf.save('download.pdf');
                }).catch();
        }
    }

    const modalBody = () => (
        <div>
            <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                <Paper className=" rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                    <Dialog fullWidth={true} open={open} onClose={() => {
                        setOpen(false);
                        setUpdateState(false);
                    }}
                            TransitionComponent={Transition}>
                        {client?.selectedInvoiceType === 0 && (
                            //@ts-ignore
                            <InvoicePrintDialog invoice={selectedInvoice} client={client}></InvoicePrintDialog>)}
                        {selectedInvoice?.selectedInvoiceType === 1 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'800px'}} id='divToPrint'>
                                    <Invoice1 invoice={selectedInvoice}
                                              client={client}></Invoice1>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 2 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <Invoice2 invoice={selectedInvoice}
                                              client={client}></Invoice2>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 3 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <Invoice3 invoice={selectedInvoice}
                                              client={client}></Invoice3>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 4 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <Invoice4 invoice={selectedInvoice}
                                              client={client}></Invoice4>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 5 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >save</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}}  id='divToPrint'>
                                    <Invoice5 invoice={selectedInvoice}
                                              client={client}></Invoice5>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 6 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <InvoiceLayer1 invoice={selectedInvoice}
                                                   client={client}></InvoiceLayer1>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 7 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <InvoiceLayer2 invoice={selectedInvoice}
                                                   client={client}></InvoiceLayer2>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 8 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <InvoiceLayer3 invoice={selectedInvoice}
                                                   client={client}></InvoiceLayer3>
                                </div>
                            </div>)}
                        {selectedInvoice?.selectedInvoiceType === 9 && (
                            <div>
                                <div style={{margin: '20px', textAlign: 'right'}}>
                                    {updateState == true ?
                                        <div>
                                            <h1>{t('INVOICEUPDATEDIALOG')}</h1>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        handleUpdate();
                                                    }}>{t('YES')}</Button>
                                            <Button variant="contained" color="primary" aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false);
                                                        setDisable(false);
                                                    }}>
                                                {t('NO')}</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="contained" color="secondary"
                                                    onClick={() => {
                                                        printDocument();
                                                        setOpen(false)
                                                    }}
                                            >{t('SAVE')}</Button>
                                            <Button variant="contained"
                                                    color="primary"
                                                    aria-label="close"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setUpdateState(false)
                                                    }}> <CloseIcon/> </Button>
                                        </div>

                                    }
                                </div>
                                <div style={{width:'700px', height:'900px'}} id='divToPrint'>
                                    <InvoiceLayer4 invoice={selectedInvoice}
                                                   client={client}></InvoiceLayer4>
                                </div>
                            </div>)}
                    </Dialog>
                </Paper>
            </FuseAnimate>
        </div>
    );
    function handleClick(){
        getInvoicesByFilter(forFilter)
    }
    function handleClear(){
        setForFilter({...forFilter, page:0,size:5,
            invoiceType:null,
            invoiceDate:"",
            invoiceEndDate:"",
            search:"",
            currency:"",
            client_id:clientId});
        setBuyerList([]);
        setLetterType([]);
        getInvoicesByFilter(forFilter);





    }

    useEffect(()=>{
        handleChange(letterType)
    },[letterType])


    function handleChange(e) {
        //@ts-ignore
        if (letterType.toString()!=[]){
            setForFilter({...forFilter, invoiceType: letterType.toString(), page:0, size:rowsPerPage });
        }else if(invoice?.buyerName) {
            setForFilter({...forFilter, buyerName: invoice?.buyerName, page:0, size:rowsPerPage });
        }
        return forFilter;
    }

    function handleChangeBuyer(e){
        setForFilter({...forFilter, buyerName:e.target.value, page:0, size :rowsPerPage})
    }
    function handleChangeCurrency(e, value){


        setForFilter({...forFilter, currency:value?.code, page:0, size :rowsPerPage})
        console.log(forFilter)

    }
    function handleChange1(e, type) {
    }

    function handleChangeCheckbox(value: string, checked: boolean, type: string) {
            if(checked && !letterType.includes(value))
                setLetterType(oldArray => [...oldArray, value])
            else if(!checked && letterType.includes(value))
                setLetterType(letterType.filter(item => item != value))
            return
        }
    return (
                <FusePageSimple
    classes={{
        contentWrapper: 'p-0 sm:p-16 h-full',
        content: 'flex flex-col h-full',
        leftSidebar: 'w-256 border-0',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        wrapper: 'min-h-0'
    }}

    header={
        <div className="flex flex-1 w-full items-center justify-between">
            <Grid
                container
                direction="row"
                // justify="space-between"
                alignItems="center"
                style={{paddingLeft: '30px'}}
            >
                <Grid item xs={6} sm={2}  lg={2} >
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">insert_drive_file</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t('INVOICE')}
                            </Typography>
                        </FuseAnimate>
                    </div>
                </Grid>


                <Grid item xs={6} sm={10} lg={10} >
                    <Grid
                        container
                        direction="row"
                        // justify="space-between"
                        alignItems="center">
                            <Grid item xs={6} sm={5} lg={6}>
                                <Grid container
                                      direction="row"
                                      //justify="space-between"
                                      alignItems="center">
                                    <Grid item xs={6} sm={6}>
                                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                            <Paper className="flex items-center px-8 py-4 ml-12 rounded-8"
                                                   elevation={1}>
                                                <Icon color="action">search</Icon>
                                                <Input
                                                    placeholder={t("SEARCH")}
                                                    className="flex flex-1 mx-8 max-w-512"
                                                    disableUnderline

                                                    value={forFilter?.search}
                                                    inputProps={{
                                                        'aria-label': 'Search'
                                                    }}
                                                    onChange={(e) => {
                                                        setForFilter({...forFilter, search: e.target.value, page:0})
                                                    }}
                                                />
                                            </Paper>
                                        </FuseAnimate>
                                    </Grid>
                                    <Grid>
                                        {/* <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                            <Button
                                                className="ml-6 rounded-8"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    handleClick()
                                                }}
                                            >
                                                {t("SEARCH")}
                                            </Button>
                                        </FuseAnimate>*/}
                                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                            <Button
                                                className="ml-6 rounded-8"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    handleClear()
                                                }}
                                            >
                                                {t("SEARCHCLEAR")}
                                            </Button>
                                        </FuseAnimate>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={6} sm={7} lg={6}>
                                <Grid container
                                      direction="row"
                                    //justify="space-between"
                                      alignItems="center">

                                    <Grid item xs={6} sm={4} lg={2}
                                          style={{textAlign: 'right'}}>
                                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
                                            <Typography className="hidden sm:flex mx-0 sm:mx-12 bold">{t('SELECTDATEFORFILTER')}</Typography>
                                        </FuseAnimate>
                                    </Grid>

                                    <Grid item xs={6} sm={4} lg={4} className={'mr-8'}>
                                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
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
                                                    // defaultValue: new Date(moment().add().toDate()).toISOString().substring(0, 10)
                                                    max: '3000-01-01',
                                                    min: '1000-01-01'
                                                }}
                                                variant="outlined"
                                                onChange={(e) => {
                                                    setForFilter({...forFilter, invoiceDate: e.target.value, page:0})
                                                }}
                                            />
                                        </FuseAnimate>
                                    </Grid>

                                    <Grid item xs={6} sm={4} lg={4}>
                                        <FuseAnimate animation="transition.slideDownIn" delay={300}>
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
                                                    // defaultValue: new Date(moment().add().toDate()).toISOString().substring(0, 10)
                                                    max: '3000-01-01',
                                                    min: '1000-01-01'
                                                }}
                                                variant="outlined"
                                                onChange={(e) => {
                                                    setForFilter({...forFilter, invoiceEndDate: e.target.value, page:0})
                                                }}
                                            />
                                        </FuseAnimate>
                                    </Grid>
                                </Grid>
                            </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    }

    content={
        <div>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                            >
                                <Grid item xs={6} sm={4}>
                                    <Typography variant={"h5"}>{t('INVOICELIST')}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} className={classes.container}>
                                        <Table className={classes.table} aria-label="simple table" size={"small"} stickyHeader={true}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align={"center"}>
                                                        {t('INVOICECODE')}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {t('INVOICETYPE')}
                                                        <Select
                                                            labelId="demo-mutiple-checkbox-label"
                                                            id="demo-mutiple-checkbox"
                                                            multiple
                                                            value={letterTypeSelected}
                                                            style={{maxWidth:"100px"}}
                                                            onChange={e => handleChange1(e, "")}
                                                            input={<Input />}
                                                            renderValue={(selected) => (selected as string[]).join(',')}
                                                            MenuProps={MenuProps}
                                                        >
                                                            <MenuItem  value={"0"}>
                                                                <Checkbox onChange={(e,checked) =>
                                                                {handleChangeCheckbox("0", checked,"")}} checked={letterType?.indexOf("0") > -1} />
                                                                <ListItemText primary={"INVOICE"} />
                                                            </MenuItem>
                                                            <MenuItem  value={"1"}>
                                                                <Checkbox onChange={(e,checked) =>
                                                                {handleChangeCheckbox("1", checked,"")}} checked={letterType?.indexOf("1") > -1} />
                                                                <ListItemText primary={"CREDITNOTE"} />
                                                            </MenuItem>
                                                            <MenuItem  value={"2"}>
                                                                <Checkbox onChange={(e,checked) =>
                                                                {handleChangeCheckbox("2", checked,"")}} checked={letterType?.indexOf("2") > -1} />
                                                                <ListItemText primary={"PROFORMA"} />
                                                            </MenuItem>
                                                            <MenuItem  value={"3"}>
                                                                <Checkbox onChange={(e,checked) =>
                                                                {handleChangeCheckbox("3", checked,"")}} checked={letterType?.indexOf("3") > -1} />
                                                                <ListItemText primary={"DELIVERYNOTE"} />
                                                            </MenuItem>
                                                            <MenuItem  value={"4"}>
                                                                <Checkbox onChange={(e,checked) =>
                                                                {handleChangeCheckbox("4", checked,"")}} checked={letterType?.indexOf("4") > -1} />
                                                                <ListItemText primary={"SELFCERTIFICATE"} />
                                                            </MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {t('INVOICERECIPIENT')}
                                                        <Select style={{marginLeft: "8px"}}
                                                                className="my-16"
                                                                variant="standard"
                                                                name="buyerName"
                                                                value={invoice.buyerName}
                                                                onChange={e => handleChangeBuyer(e)}>
                                                            <MenuItem>{t('INVOICERECIPIENT')}</MenuItem>
                                                            {buyerList?.map((buyer) => {
                                                                return (
                                                                    <MenuItem value={buyer?.buyerName}>{buyer?.buyerName}</MenuItem>
                                                                );
                                                            })}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {t('INVOICETOTAL')}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                         {t('INVOICECURRENCY')}
                                                        <Autocomplete
                                                            value={null}
                                                            size={"small"}
                                                            fullWidth={true}
                                                            id="combo-box-demo"
                                                            //@ts-ignore
                                                            name='currency'
                                                            options={currencyListSorted}
                                                            //@ts-ignore
                                                            onChange={(event, value) =>{
                                                                handleChangeCurrency(event, value)}}
                                                            //@ts-ignore
                                                            getOptionLabel={(currency) => currency.currency}
                                                            renderOption={(currency) => (
                                                                <React.Fragment>
                                                                    {currency.currency} ({currency.code})
                                                                </React.Fragment>
                                                            )}
                                                            renderInput={(params) => <TextField {...params} fullWidth={true}
                                                                                                variant="standard"/>}
                                                        />
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {t('DATE')}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                        {t('INVOICEACTION')}
                                                    </TableCell>
                                                    <TableCell align={"center"}>
                                                       {t('INVOICESTATE')}
                                                    </TableCell>
                                                    {/*<TableCell align={"center"}>*/}
                                                    {/* Date*/}
                                                    {/*</TableCell>*/}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {invoiceList?.slice(0 * rowsPerPage, 1 * rowsPerPage + rowsPerPage)
                                                    .map((row) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                {columns?.map((column) => {
                                                                    const value = row[column.id];
                                                                    return (
                                                                        <TableCell
                                                                            onClick={() => handleClickOpen(row)}
                                                                            key={column.id} align={column.align}>
                                                                            {value}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                                <TableCell align={"center"}>
                                                                    <ButtonGroup disableElevation variant="contained"
                                                                                 color="primary">
                                                                        <Button
                                                                            onClick={() => handleClickOpenDeneme(row)}>
                                                                            {t('INVOICECLICK')}
                                                                        </Button>
                                                                        {((row.deleteState === 0 && row.updateState === 0)) && (
                                                                            <Button
                                                                                disabled={disable}
                                                                                onClick={() => {
                                                                                    setDisable(true);
                                                                                    setUpdateState(true);
                                                                                    handleClickOpenDeneme(row);
                                                                            }}>{t('INVOICEUPDATE')}
                                                                            </Button>
                                                                        )}
                                                                        {((row.deleteState === 0 && row.updateState === 0)) && (
                                                                            <Button
                                                                                disabled={disable}
                                                                                onClick={() => {
                                                                                    setDisable(true);
                                                                                    handleClickOpen2(row);
                                                                                }}>
                                                                                {t('INVOICEUPDELETE')}
                                                                            </Button>
                                                                        )}
                                                                        {row.updateState === 2 && (
                                                                            <Link to={"/invoice/detail/" + row.id}>
                                                                                <Button fullWidth={true}
                                                                                        disabled={disable}
                                                                                        onClick={()=>{setDisable(true);}}
                                                                                        variant="contained"
                                                                                        color="primary">
                                                                                    {t('INVOICEUPDATE')}
                                                                                </Button>
                                                                            </Link>
                                                                        )}
                                                                        {(row.deleteState === 1 || row.updateState === 1) && (
                                                                            <p>....</p>
                                                                        )}
                                                                        <Link to={"/invoice/copy/" + row.id}>
                                                                            <Button fullWidth={true}
                                                                                    disabled={disable}
                                                                                    onClick={()=>{setDisable(true);}}
                                                                                    variant="contained"
                                                                                    color="primary">
                                                                                {t('INVOICECOPY')}
                                                                            </Button>
                                                                        </Link>
                                                                    </ButtonGroup>

                                                </TableCell>
                                                {row.deleteState === 0 && row.updateState === 0 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('INVOICEREQUEST')}</Alert>
                                                </TableCell>
                                                }
                                                {row.deleteState === 1 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('INVOICEDELETEREQUEST')}</Alert>
                                                </TableCell>
                                                }
                                                {row.updateState === 1 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('INVOICEUPDATEQUEST')}</Alert>

                                                </TableCell>
                                                }
                                                {row.updateState === 2 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('INVOICEUPDATED')}</Alert>
                                                </TableCell>
                                                }
                                                {row.deleteState === 3 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('DELETEREJECTED')}</Alert>
                                                </TableCell>
                                                }
                                                {row.updateState === 3 &&
                                                <TableCell
                                                    align={"center"}
                                                >
                                                    <Alert severity="info">{t('UPDATEREJECTED')}</Alert>
                                                </TableCell>
                                                }
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        colSpan={3}
                        count={totalElements}
                        rowsPerPage={forFilter?.size}
                        page={forFilter?.page}
                        SelectProps={{
                            inputProps: {'aria-label': 'rows per page'},
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Grid>

            </Grid>

            <div>
                <Dialog
                    open={open2}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose2}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle onClose={handleClose2}
                                 id="alert-dialog-slide-title">{t('INVOICEDELETE')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {t('INVOICEDIALOG')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose2} color="primary">
                            {t('NO')}
                        </Button>
                        <Button onClick={handleDeleteRequest} color="primary">
                            {t('YES')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog
                    open={open3}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose4}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle onClose={handleClose4}
                                 id="alert-dialog-slide-title">{t('INVOICEUPDATEREQUESTT')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {t('INVOICEDIALOGUPDATE')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose4} color="primary">
                            {t('NO')}
                        </Button>
                        <Button onClick={handleUpdate} color="primary">
                            {t('YES')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            {open && ReactDOM.createPortal(modalBody(), document.body)}
        </div>
            }
    sidebarInner
    ref={pageLayout}
    innerScroll/>
    );
}
export default InvoiceDetailx;
