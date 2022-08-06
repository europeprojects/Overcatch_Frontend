import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import {createStyles, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import history from '@history/@history'
import {useSelector} from 'react-redux';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import api from "../../../services/BackendApi";
import {
    AddressInfo, DirectorDetail, DocumentInfo,
    Company, FounderOwner,
    CustomerClientDTO,
    UserDTO, Client, AddressNewInfo
} from "../../../types/UserModel";
import {
    Button, Card, CardContent, Checkbox, DialogContentText, Fab, Grid, InputAdornment,
    MenuItem, OutlinedInput, Paper, Select,

    Step, StepConnector,
    StepLabel,
    Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@material-ui/core";
import BackendApi from "../../../services/BackendApi";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import DescriptionIcon from "@material-ui/icons/Description";
import clsx from "clsx";
import FuseLoading from "../../../../@fuse/core/FuseLoading";
import {Div} from "../../../components/Grid";
import Formsy from "formsy-react";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import UploadPersonel from "../../document/components/UploadPersonel";
import {useTranslation} from "react-i18next";
import DetailSidebarHeader from "../../document/components/DetailSidebarHeader";
import DetailSidebarContent from "../../document/components/DetailSidebarContent";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {DialogTitleProps} from "../../document/components/FileList";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import DirectorDetailForm from "../../clientApplication/components/DirectorDetail";
import UpdateIcon from '@material-ui/icons/Update';
import BorderColorSharpIcon from '@material-ui/icons/BorderColorSharp';
import {add} from "lodash";
const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        },
    },
    line: {
        height: 4,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 0%, rgba(6,62,155,1) 100%, rgba(4,121,194,1) 100%, rgba(7,48,146,1) 100%)',
    },
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const {active, completed} = props;

    const icons = {
        1: <BusinessCenter/>,
        2: <AccountCircleIcon/>,
        3: <EditLocationIcon/>,
        4: <DescriptionIcon/>,
        5: <HourglassEmptyIcon/>
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

function CompanyDetail(props: any) {
    console.log("CompanyDetail(props",props);
    const {t} = useTranslation('companyApplications');
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = [t("BUSINESSDETAILS"), t("OWNER"), t("ADDRESSDETAILS"), t("DOCUMENTDETAILS"),t("STATUS")];
    const [open, setOpen] = useState<boolean>(false);
    const [newDocument, setNewDocument] = useState<DocumentInfo>(null);

    // const order = useSelector(({ eCommerceApp }) => eCommerceApp.order);
    const theme = useTheme();

    const userFolder = useSelector(({auth}) => auth.user.data.userFolder);
    const [client, setClient] = useState<Client>({} as Client);

    const [addressList, setAddressList] = useState<AddressInfo[]>([]);
    const [addressNewList, setNewAddressList] = useState<AddressNewInfo[]>([]);


    const [addressList1,setAddressList1] = useState<AddressInfo[]>([]);
    const [addressList2,setAddressList2] = useState<AddressNewInfo[]>([]);

    const [newAddressList,setAewAddressList] = useState<AddressNewInfo[]>([]);

    const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [isEditable, setIsEditable] = useState(false);

    const [updateAddress, setupdateAddres] = useState(true);
    const [disableButton, setDisableButton] = useState(false);
    const [updateAddressRow, setUpdateAddressRow] = useState();

    const [directorList, setDirectorList] = useState<DirectorDetail[]>([]);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [company, setCompany] = useState<Company>(null);
    const [founderOwner, setFounderOwner] = useState<FounderOwner>(null);
    const [documentsList, setDocumentsList] = useState<DocumentInfo[]>([]);

    const [formState, setFormState] = useState<DirectorDetail>({} as DirectorDetail);
    const [loading, setLoading] = useState(true);
    const [open2, setOpen2] = React.useState(false)
    const [selectedDocument, setSelectedDocument] = React.useState()

    const [currentUser, setCurrentUser] = useState("");

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

    useEffect(() => {
        if (newDocument !== null) {
            api.getDocumentByID(newDocument.id).then(function (value) {
                setDocumentsList(documentsList => [...documentsList, value])
                setNewDocument(null)
            })
        }
    }, [newDocument])
    // const {company, addressList, customerClients, founderOwner, documents} ;

    //@ts-ignore

    useEffect(() => {

        if (routingData?.clientId) {

            api.getNewAddressList(routingData?.clientId).then( newAddressList => {
                //setNewList(newAddressList);
                setAddressList2(newAddressList);
            } )

            api.getClient(routingData?.clientId).then(response => {
                console.log("***** companyDetail response ",response);
                setClient(response);
                console.log("client.vatNumber: ",client.vatNumber)

                const {company,addressList,customerClients, founderOwner, documents , addressNewList} = response;
                if (company != null) {
                    const {directorDetails} = company;
                    setDirectorList(directorDetails);
                }
                setCustomerClients(customerClients);
                setDocumentsList(documents)
                console.log("CompanyDetail founderOwner",founderOwner)
                console.log("founderOwnerNEw***************",company.directorDetails[0].maritalStatus)
                if (founderOwner != null) {
                    setFounderOwner(founderOwner);
                } else {
                    setCompany(company)
                }
                customerClients.map(response => {
                    setUsers([...users, response.customerInfo.userInfo]);
                });

                setLoading(false);
                setAddressList1(addressList);
            });

            api.getCurrentUser().then(response => {
                // @ts-ignore
                setCurrentUser(response?.userType);
            });

        } else {
            history.push('/clients')
        }
    }, [])

    useEffect(()=>{

        // Eski Adres Bilgilerinin Yüklendiği Kısım
        setAddressList(addressList1);

        // Yeni Adres Bilgilerinin Yüklendiği Kısım
        setNewAddressList(addressList2);

    },[addressList1 , addressList2])

    const getDownload = (fileName: string) => {
        BackendApi.getDownloadDocumentByUser(client.id.toString(), fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }

    function handleCompany(event) {
        setCompany({...company, [event.target.name]: event.target.value})
    }

    function handleClient(event) {
        setClient({...client, [event.target.name]: event.target.value})
    }

    const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked){
            setClient({...client, [event.target.name]: event.target.checked})
        }
        else {
            setClient({...client, [event.target.name]: false})
        }
    };

    function handleFounderOwner(event) {
        setFounderOwner({...founderOwner, [event.target.name]: event.target.value})
    }

    function handleDirector(id: number, event) {
        const director = directorList.find(d => d.id === id);
        directorList.splice(directorList.indexOf(director), 1);
        setDirectorList([...directorList, {...director, [event.target.name]: event.target.value}]);
        setFormState({...formState, [event.target.name]: event.target.value})
    }

    function handleAddress(key: number, e) {
        const address = addressList.find(d => d.id === key);
        addressList.splice(addressList.indexOf(address), 1);
        setAddressList([...addressList, {...address, [e.target.name]: e.target.value}]);
    }

    function handleNewAddress(key: number, e) {
        const addressNew = addressNewList.find(d => d.id === key);
        addressNewList.splice(addressNewList.indexOf(addressNew), 1);
        setNewAddressList([...addressNewList, {...addressNew, [e.target.name]: e.target.value}]);
    }

    function editNewAddress(key: number, e) {
        setupdateAddres(false);

        setDisableButton(true);
        setIsEditable(false);

        //setIsEditable(true);

        // @ts-ignore
        setUpdateAddressRow(key);
    }

    //formatDate fonksiyonunda değişiklik oldu
    function formatDate(date) {
        var newdate;
        if (date) {
            let d = new Date(date)
            let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
            let mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
            let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
            newdate = `${ye}-${mo}-${da}`
        } else
            newdate = null
        if (newdate?.split("-")[0].length < 4)
            newdate = null
        else if (newdate?.split("-")[0].length > 4)
            newdate = newdate?.split("-")[0].substring(0, 4)
        return newdate
    }

    if (loading) {
        return <FuseLoading/>;
    }

    function handleSubmit() {

        if (isEditable === true) {

            client.founderOwner = founderOwner;
            if (company !== null) {
                company.directorDetails = directorList;
            }

            if(updateAddress === true) {
                // @ts-ignore
                client.addressNewList = addressList;
            }
            else {
                client.addressNewList = addressNewList;
            }

            client.company = company;

            delete client['tasks'];
            delete client['documents'];
            api.updateCompany(client).then(result => { history.push('/clients') });
        }
        setIsEditable(() => isEditable === true ? false : true)

    }

    const handleClick = (event, name) => {
        const director = directorList.find(l => l.id === name);
        setFormState(director);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    function openPreview(document) {
        setOpen2(true)
        setSelectedDocument(document)
    }
    const handleNext = () => {
        // setPrevState(prevState + 1)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        // setPrevState(prevState - 1)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const deleteDirector = (key) => {
        const director = directorList[key];
        directorList.splice(directorList.indexOf(director), 1);
        setDirectorList([...directorList]);
        console.log(director)

    };
    // @ts-ignore
    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                client && (
                    <div className="flex flex-1 w-full items-center justify-between">
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            <Typography
                                className="normal-case flex items-center sm:mb-12"
                                component={Link}
                                role="button"
                                to={currentUser?.toString() == "CUSTOMER" ? '/mycompany':'/clients'}
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t("CLIENTS")}</span>
                            </Typography>

                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                <Typography className="text-16 sm:text-20 truncate">
                                    {client.code} {founderOwner !== null ? founderOwner?.tradeAsName : company?.name}
                                </Typography>

                                <Typography className="text-14 sm:text-20 truncate" variant="caption">
                                </Typography>
                            </div>
                        </div>
                        <Button onClick={() => handleSubmit()} variant="contained" color="secondary">
                            {isEditable === false ? t("EDIT") : t("SAVE")}
                        </Button>
                    </div>
                )
            }
            contentToolbar={
                <Stepper className="w-full" alternativeLabel activeStep={activeStep}
                         connector={<ColorlibConnector/>}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}
                                       onClick={() => setActiveStep(index)}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            }
            content={

                client && (
                    <div className="p-16 sm:p-24 max-w-4xl w-full">
                        {/* Task Details */}
                        {activeStep === 0 && (
                            <div className="table-responsive h-full">
                                <div className="pb-48">
                                    <div className="mb-24">
                                        <div className="mb-24">
                                            <div className="table-responsive mb-48">
                                                <table className="simple">
                                                    <thead>
                                                    <tr>
                                                        <th>{t("FIRSTANDLASTNAME")}</th>
                                                        <th>{t("EMAIL")}</th>
                                                        <th>{t("PHONE")}</th>
                                                        <th>{t("PAYMENT")}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {users.map((user) => (
                                                        <tr>
                                                            <td>
                                                                <div className="flex items-center">
                                                                    <Avatar src={user?.photoURL}/>
                                                                    <Typography className="truncate">
                                                                        {`${user?.name} ${user?.surname}`}
                                                                    </Typography>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center">
                                                                    <Typography className="truncate">
                                                                        {`${user?.email}`}
                                                                    </Typography>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center">
                                                                    <Typography className="truncate">
                                                                        {`${user?.msisdn}`}
                                                                    </Typography>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center">
                                                                    <Typography className="truncate">
                                                                        {`${client?.payment}`}
                                                                    </Typography>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <div className="pb-16 flex items-center">
                                                    <Icon color="action">account_circle</Icon>
                                                    <Typography className="h2 mx-16" color="textSecondary">
                                                        {client?.clientTypeEnum}
                                                    </Typography>
                                                </div>
                                                {client?.company == null && (
                                                    <table className="simple">
                                                        <thead>
                                                        <tr>
                                                            <th>{t("BUSINESSNAME")}</th>
                                                            <th>{t("BUSINESSEMAIL")}</th>
                                                            <th>{t("BUSINESSPHONE")}</th>
                                                            <th>{t("VATNUMBER")}</th>
                                                            <th>{t("EORINUMBER")}</th>
                                                            <th>{t("FEES")}</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                                           variant="outlined" name="tradeAsName"
                                                                           disabled={isEditable === true ? false : true}
                                                                           id="outlined-disabled"
                                                                           value={founderOwner?.tradeAsName}/>
                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                                           variant="outlined" name="email"
                                                                           disabled={isEditable === true ? false : true}
                                                                           id="outlined-disabled"
                                                                           value={founderOwner?.email}/>
                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                                           variant="outlined" name="phoneNumber"
                                                                           placeholder={"+" + t("CODE") + " XXXXXXXXXX"}
                                                                           disabled={isEditable === true ? false : true}
                                                                           id="outlined-disabled"
                                                                           value={founderOwner?.phoneNumber}/>
                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleClient(e)}
                                                                           variant="outlined" name="vatNumber"
                                                                           disabled={isEditable === true ? false : true}
                                                                           id="outlined-disabled"
                                                                           value={client?.vatNumber}/>

                                                            </td>
                                                            <td>
                                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                                           variant="outlined" name="eoriNumber"
                                                                           disabled={isEditable === true ? false : true}
                                                                           id="outlined-disabled"
                                                                           value={founderOwner?.eoriNumber}/>
                                                            </td>
                                                            <td>
                                                                <OutlinedInput onChange={(e) => handleClient(e)}
                                                                               name="payment"
                                                                               startAdornment={<InputAdornment
                                                                                   position="start">£</InputAdornment>}
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={client?.payment}/>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                )}
                                                {client?.founderOwner == null && (
                                                    <div>
                                                        <table className="simple">
                                                            <thead>
                                                            <tr>
                                                                <th>{t("BUSINESSNAME")}</th>
                                                                <th>{t("BUSINESSEMAIL")}</th>
                                                                <th>{t("BUSINESSPHONE")}</th>
                                                                <th>{t("YEARENDDATE")}</th>
                                                                <th>{t("DUEDATE")}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="name"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.name}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="email"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.email}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="phoneNumber"
                                                                               placeholder={"+" + t("CODE") + " XXXXXXXXXX"}
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.phoneNumber}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="yearEndDate"

                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.yearEndDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="dueDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.dueDate}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className="simple">
                                                            <thead>
                                                            <tr>

                                                                <th>{t("AUTHENTICATIONCODE")}</th>
                                                                <th>{t("NATIONALITY")}</th>
                                                                <th>{t("EORINUMBER")}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="authentication"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.authentication}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="nationality"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.nationality}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="eoriNumber"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.eoriNumber}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>

                                                        <table className="simple">
                                                            <thead>
                                                            <tr>

                                                                <th>{t("VATNUMBER")}</th>
                                                                <th>{("VAT Register Date")}</th>
                                                                <th>{("VAT Period")}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="vatNumber"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.vatNumber}/>
                                                                </td>
                                                                <td>
                                                                    <TextField

                                                                        onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="nationality"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               type={"date"}
                                                                               value={company?.vatRegisterDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="vatPeriod"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.vatPeriod}/>

                                                                </td>
                                                                {console.log("*********company?.vatPeriod",company?.vatPeriod)}
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className="simple">
                                                            <thead>
                                                            <tr>
                                                                <th>{t("NOTES")}</th>
                                                                <th>{t("COMPANYUTR")}</th>
                                                                <th>{("Company Registration Number")}</th>
                                                                <th>{t("INCORPORATEDDATE")}</th>
                                                                <th>{t("PAYMENT")}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <TextField onChange={(e) => handleClient(e)}
                                                                               variant="outlined" name="notes"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={client?.notes}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined" name="companyUtr"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.companyUtr}/>
                                                                </td>
                                                                <td>
                                                                    <TextField onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="companyNumber"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.companyNumber}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="incorporatedDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.incorporatedDate}/>

                                                                </td>
                                                                <td>
                                                                    <OutlinedInput onChange={(e) => handleClient(e)}
                                                                                   name="payment"
                                                                                   startAdornment={<InputAdornment
                                                                                       position="start">£</InputAdornment>}
                                                                                   disabled={isEditable === true ? false : true}
                                                                                   id="outlined-disabled"
                                                                                   value={client?.payment}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className="simple">
                                                            <thead>
                                                            <tr>
                                                                <th>{t("NEXTSTATEMENTDATE")}</th>
                                                                <th>{t("STATEMENTDUEDATE")}</th>
                                                                <th>{t("LASTSTATEMENTDATE")}</th>
                                                                <th>{t("NEXTACCOUNTSDATE")}</th>
                                                                <th>{t("ACCOUNTSDUEDATE")}</th>
                                                                <th>{t("LASTACCOUNTSDATE")}</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="nextStatementDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.nextStatementDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="statementDueDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.statementDueDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="lastStatementDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.lastStatementDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="nextAccountsDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.nextAccountsDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="accountsDueDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.accountsDueDate}/>
                                                                </td>
                                                                <td>
                                                                    <TextField type={"date"}
                                                                               onChange={(e) => handleCompany(e)}
                                                                               variant="outlined"
                                                                               name="lastAccountsDate"
                                                                               disabled={isEditable === true ? false : true}
                                                                               id="outlined-disabled"
                                                                               value={company?.lastAccountsDate}/>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                            {client.company === null ? ("") : (
                                                <div className="table-responsive h-full">

                                                    <br/>
                                                    {t("NATUREBUSINESSINFO")}
                                                    <table className="simple">
                                                        <thead>
                                                        <tr>
                                                            <th className="w-1/6">{t("CODE")}</th>
                                                            <th className="w-5/6">{t("DESCRIPTION")}</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {company?.natureBusinesses.map(nature => (
                                                            <tr key={nature.id}>
                                                                <td className="w-1/6">
                                                                    <span className="truncate">{nature.code}</span>
                                                                </td>
                                                                <td className="w-5/4">
                                                                        <span
                                                                            className="truncate">{nature.description}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>)}
                                            <div className="flex justify-end w-full mt-15">
                                                <div className="justify-self-end">
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => setActiveStep(prevState => prevState + 1)}>
                                                        {t("NEXT")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        {/* Products */}
                        {(activeStep === 1 && company != null) && (
                            <div className="table-responsive h-full">

                                {directorList?.length > 0 && (
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Director Name</TableCell>
                                                    <TableCell>Director Email</TableCell>
                                                    <TableCell>Director Surname</TableCell>
                                                    <TableCell>Delete</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {directorList.map((row, key) => (
                                                    <TableRow key={row.name}>
                                                        <TableCell>
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.email}
                                                        </TableCell>
                                                        <TableCell>{row.surname}</TableCell>
                                                        <TableCell>
                                                            <Fab onClick={() => deleteDirector(key)}
                                                                 color="secondary"
                                                                 aria-label="add"
                                                                // className="absolute bottom-30 ltr:left-0 rtl:right-0 mx-16 -mb-28 z-999 "
                                                            >
                                                                <Icon>delete</Icon>
                                                            </Fab>
                                                            {/*<DeleteIcon onClick={()=>deleteDirector(row.id)}></DeleteIcon>*/}
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>)}

                                <DirectorDetailForm directors={directorList}
                                                    onInput={data => setDirectorList([...directorList, data])}
                                                    handleBack={handleBack} handleNext={handleNext}
                                                    formDetail={formState}
                                                    setFormDetail={setFormState}></DirectorDetailForm>

                                {/*<div className="table-responsive mb-48">*/}
                                {/*    <table className="simple">*/}
                                {/*        <thead>*/}
                                {/*        <tr>*/}
                                {/*            <th>{t("FORENAME")}</th>*/}
                                {/*            <th>{t("LASTNAME")}</th>*/}
                                {/*            <th>{t("EMAIL")}</th>*/}
                                {/*            <th>{t("PHONE")}</th>*/}
                                {/*            <th></th>*/}
                                {/*        </tr>*/}

                                {/*        </thead>*/}
                                {/*        <tbody>*/}
                                {/*        {directorList?.map((selectedDirector, index) => {*/}
                                {/*            return (*/}
                                {/*                <TableRow*/}
                                {/*                    hover*/}
                                {/*                    onClick={event => handleClick(event, selectedDirector.id)}*/}
                                {/*                    role="checkbox"*/}
                                {/*                    // aria-checked={isItemSelected}*/}
                                {/*                    tabIndex={-1}*/}
                                {/*                    key={selectedDirector.id}*/}
                                {/*                >*/}

                                {/*                    <TableCell align="left">{selectedDirector.name}</TableCell>*/}
                                {/*                    <TableCell align="left">{selectedDirector.surname}</TableCell>*/}
                                {/*                    <TableCell align="left">{selectedDirector.email}</TableCell>*/}
                                {/*                    <TableCell*/}
                                {/*                        align="left">{selectedDirector.phoneNumber}</TableCell>*/}

                                {/*                </TableRow>*/}
                                {/*            );*/}
                                {/*        })}*/}

                                {/*        </tbody>*/}
                                {/*    </table>*/}
                                {/*    <Div gap={2}>*/}
                                {/*        <Formsy*/}
                                {/*            className="flex flex-col justify-center w-full"*/}
                                {/*        >*/}
                                {/*            <Div columns={2}>*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    id="mui-theme-provider-outlined-input"*/}
                                {/*                    label={t("FORENAME")}*/}
                                {/*                    name="name"*/}
                                {/*                    value={formState?.name}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 2,*/}
                                {/*                        isExisty: true*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH4"),*/}
                                {/*                        isExisty: t("CANTGO") // "Gidemezsin"*/}
                                {/*                    }}*/}
                                {/*                    fullWidth field="companyName"*/}
                                {/*                    // formState={formState}*/}
                                {/*                    oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                    oninput="setCustomValidity('')"*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required*/}
                                {/*                />*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    id="mui-theme-provider-outlined-input"*/}
                                {/*                    label={t("LASTNAME")}*/}
                                {/*                    name="surname"*/}
                                {/*                    value={formState?.surname}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 2,*/}
                                {/*                        isExisty: true*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH4"),*/}
                                {/*                        isExisty: t("CANTGO") // "Gidemezsin"*/}
                                {/*                    }}*/}
                                {/*                    fullWidth field="companyName"*/}
                                {/*                    // formState={formState}*/}
                                {/*                    oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                    oninput="setCustomValidity('')"*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required*/}
                                {/*                />*/}
                                {/*            </Div>*/}
                                {/*            <Div columns={2}>*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    name="email"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    type="email"*/}
                                {/*                    label={t("EMAIL")}*/}
                                {/*                    value={formState?.email}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 4,*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH4"),*/}

                                {/*                    }}*/}
                                {/*                    fullWidth field="fullName"*/}
                                {/*                    // formState={formState}*/}
                                {/*                    variant="outlined"*/}
                                {/*                />*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    name="phoneNumber"*/}
                                {/*                    className="my-16"*/}
                                {/*                    placeholder={"+" + t("CODE") + " XXXXXXXXXX"}*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    value={formState?.phoneNumber}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 10,*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH10"),*/}

                                {/*                    }}*/}
                                {/*                    label={t("PHONE")}*/}
                                {/*                    fullWidth field="placeOfBirth"*/}
                                {/*                    variant="outlined"/>*/}

                                {/*            </Div>*/}
                                {/*            <Div columns={2}>*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    type="date"*/}
                                {/*                    name="dob"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}





                                {/*                    value={formatDate(formState?.dob)}*/}

                                {/*                    id="date"*/}
                                {/*                    // defaultValue={selectedDate}*/}
                                {/*                    label={t("DATEOFBIRTHDAY")}*/}
                                {/*                    className="my-16"*/}
                                {/*                    InputLabelProps={{*/}
                                {/*                        shrink: true*/}
                                {/*                    }}*/}
                                {/*                    inputProps={{*/}
                                {/*                        max: '3000-01-01',*/}
                                {/*                        min:'1000-01-01'*/}
                                {/*                    }}*/}
                                {/*                    variant="outlined"/>*/}
                                {/*                <TextField*/}
                                {/*                    id="outlined-select-currency"*/}
                                {/*                    select*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    label={t("SEX")}*/}
                                {/*                    name="sex"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    value={formState?.sex ? formState?.sex : "none"}*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required>*/}
                                {/*                    <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>*/}
                                {/*                    <MenuItem value="true">{t("MALE")}</MenuItem>*/}
                                {/*                    <MenuItem value="false">{t("FEMALE")}</MenuItem>*/}
                                {/*                </TextField>*/}
                                {/*            </Div>*/}
                                {/*            <Div columns={2}>*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    id="mui-theme-provider-outlined-input"*/}
                                {/*                    label={t("NINO")}*/}
                                {/*                    name="nino"*/}
                                {/*                    value={formState?.nino}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 4,*/}
                                {/*                        isExisty: true*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH4"),*/}
                                {/*                        isExisty: t("CANTGO")*/}
                                {/*                    }}*/}
                                {/*                    // formState={formState}*/}
                                {/*                    oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                    oninput="setCustomValidity('')"*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required*/}
                                {/*                />*/}
                                {/*                <TextFieldFormsy*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    id="mui-theme-provider-outlined-input"*/}
                                {/*                    label={t("PERSONALUTR")}*/}
                                {/*                    name="utr"*/}
                                {/*                    value={formState?.utr}*/}
                                {/*                    validations={{*/}
                                {/*                        minLength: 4,*/}
                                {/*                        // isExisty:true*/}
                                {/*                    }}*/}
                                {/*                    validationErrors={{*/}
                                {/*                        minLength: t("MINLENGTH4"),*/}
                                {/*                        // isExisty:"Gidemezsin"*/}
                                {/*                    }}*/}
                                {/*                    // formState={formState}*/}
                                {/*                    oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                    oninput="setCustomValidity('')"*/}
                                {/*                    variant="outlined"*/}
                                {/*                />*/}
                                {/*            </Div>*/}




                                {/*            <Div columns={formState?.maritalStatus === 'true' ? 2 : 1}*/}
                                {/*                 className={formState?.maritalStatus === 'true' ? "" : "w-1/2 self-center content-center"}>*/}
                                {/*                <TextField*/}
                                {/*                    select*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    label={t("MARITALSTATUS")}*/}
                                {/*                    name="maritalStatus"*/}
                                {/*                    value={formState?.maritalStatus ? formState?.maritalStatus : "none"}*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required>*/}
                                {/*                    <MenuItem value="none"*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {t("PLEASEENTER")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='true'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {t("MARRIED")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='false'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {t("SINGLE")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                </TextField>*/}
                                {/*                {(formState?.maritalStatus === 'true') && (*/}
                                {/*                    <TextFieldFormsy*/}
                                {/*                        onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                        disabled={isEditable === true ? false : true}*/}
                                {/*                        name="spouseName"*/}
                                {/*                        className="my-16"*/}
                                {/*                        value={formState?.spouseName}*/}
                                {/*                        validations={{*/}
                                {/*                            minLength: 10,*/}
                                {/*                        }}*/}
                                {/*                        validationErrors={{*/}
                                {/*                            minLength: t("MINLENGTH10"),*/}

                                {/*                        }}*/}
                                {/*                        label={t("SPOUSENAME")}*/}
                                {/*                        fullWidth field="placeOfBirth"*/}
                                {/*                        variant="outlined"/>*/}
                                {/*                )*/}

                                {/*                }*/}

                                {/*            </Div>*/}
                                {/*            <Div columns={2}>*/}
                                {/*                <TextField*/}
                                {/*                    select*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    label={("DIRECTOR/OWNER")}*/}
                                {/*                    name="director"*/}
                                {/*                    value={formState?.director ? formState?.director : "none"}*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required>*/}
                                {/*                    <MenuItem value="none"*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {t("PLEASEENTER")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='DIRECTOR'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {("DIRECTOR")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='OWNER'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {("OWNER")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='ALL'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {("ALL")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                </TextField>*/}

                                {/*                <TextField*/}
                                {/*                    select*/}
                                {/*                    onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                    className="my-16"*/}
                                {/*                    disabled={isEditable === true ? false : true}*/}
                                {/*                    label={("TAX RETURN")}*/}
                                {/*                    name="taxReturn"*/}
                                {/*                    value={formState?.taxReturn ? formState?.taxReturn : "none"}*/}
                                {/*                    variant="outlined"*/}
                                {/*                    required>*/}
                                {/*                    <MenuItem value="none"*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {t("PLEASEENTER")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='TAX_RETURN'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {("TAX RETURN")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                    <MenuItem value='NOT_TAX_RETURN'*/}
                                {/*                              disabled={isEditable === true ? false : true}>*/}
                                {/*                        {("NOT TAX RETURN")}*/}
                                {/*                    </MenuItem>*/}
                                {/*                </TextField>*/}
                                {/*            </Div>*/}


                                {/*            <Card variant="outlined">*/}
                                {/*                <CardContent>*/}
                                {/*                    <Typography color="textSecondary"*/}
                                {/*                                gutterBottom>*/}
                                {/*                        {t("NEXTOFKINDESCRIPTION")}*/}
                                {/*                    </Typography>*/}
                                {/*                    <Div columns={2}>*/}
                                {/*                        <TextFieldFormsy*/}
                                {/*                            onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                            disabled={isEditable === true ? false : true}*/}
                                {/*                            className="my-16"*/}
                                {/*                            id="mui-theme-provider-outlined-input"*/}
                                {/*                            label={t("NAMEANDSURNAME")}*/}
                                {/*                            name="nextOfKinName"*/}
                                {/*                            value={formState?.nextOfKinName}*/}
                                {/*                            validations={{*/}
                                {/*                                minLength: 2,*/}
                                {/*                            }}*/}
                                {/*                            validationErrors={{*/}
                                {/*                                minLength: t("MINLENGTH4"),*/}
                                {/*                            }}*/}
                                {/*                            // formState={formState}*/}
                                {/*                            oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                            oninput="setCustomValidity('')"*/}
                                {/*                            variant="outlined"*/}
                                {/*                            required*/}
                                {/*                        />*/}
                                {/*                        <TextFieldFormsy*/}
                                {/*                            onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                            className="my-16"*/}
                                {/*                            disabled={isEditable === true ? false : true}*/}
                                {/*                            id="mui-theme-provider-outlined-input"*/}
                                {/*                            label={t("PHONE")}*/}
                                {/*                            name="nextOfKinNumber"*/}
                                {/*                            placeholder={"+" + t("CODE") + " XXXXXXXXXX"}*/}
                                {/*                            value={formState?.nextOfKinNumber}*/}
                                {/*                            validations={{*/}
                                {/*                                minLength: 10,*/}
                                {/*                                // isExisty:true*/}
                                {/*                            }}*/}
                                {/*                            validationErrors={{*/}
                                {/*                                minLength: t("MINLENGTH4"),*/}
                                {/*                                // isExisty:"Gidemezsin"*/}
                                {/*                            }}*/}
                                {/*                            // formState={formState}*/}
                                {/*                            oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                            oninput="setCustomValidity('')"*/}
                                {/*                            variant="outlined"*/}
                                {/*                        />*/}
                                {/*                    </Div>*/}
                                {/*                    <Div columns={2}>*/}
                                {/*                        <TextFieldFormsy*/}
                                {/*                            onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                            className="my-16"*/}
                                {/*                            disabled={isEditable === true ? false : true}*/}
                                {/*                            id="mui-theme-provider-outlined-input"*/}
                                {/*                            label={t("EMAIL")}*/}
                                {/*                            name="nextOfKinEmail"*/}
                                {/*                            type={"email"}*/}
                                {/*                            value={formState?.nextOfKinEmail}*/}
                                {/*                            validations={{*/}
                                {/*                                minLength: 2,*/}
                                {/*                            }}*/}
                                {/*                            validationErrors={{*/}
                                {/*                                minLength: t("MINLENGTH4"),*/}
                                {/*                            }}*/}
                                {/*                            // formState?={formState}*/}
                                {/*                            oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                            oninput="setCustomValidity('')"*/}
                                {/*                            variant="outlined"*/}
                                {/*                            required*/}
                                {/*                        />*/}
                                {/*                        <TextFieldFormsy*/}
                                {/*                            onChange={(e) => handleDirector(formState?.id, e)}*/}
                                {/*                            className="my-16"*/}
                                {/*                            disabled={isEditable === true ? false : true}*/}
                                {/*                            id="mui-theme-provider-outlined-input"*/}
                                {/*                            label={t("ADDRESS")}*/}
                                {/*                            name="nextOfKinAddress"*/}
                                {/*                            rows={4}*/}
                                {/*                            multiline*/}
                                {/*                            value={formState?.nextOfKinAddress}*/}
                                {/*                            validations={{*/}
                                {/*                                minLength: 4,*/}
                                {/*                                // isExisty:true*/}
                                {/*                            }}*/}
                                {/*                            validationErrors={{*/}
                                {/*                                minLength: t("MINLENGTH4"),*/}
                                {/*                                // isExisty:"Gidemezsin"*/}
                                {/*                            }}*/}
                                {/*                            // formState={formState}*/}
                                {/*                            oninvalid="setCustomValidity('Please Enter')"*/}
                                {/*                            oninput="setCustomValidity('')"*/}
                                {/*                            variant="outlined"*/}
                                {/*                        />*/}

                                {/*                    </Div>*/}
                                {/*                </CardContent>*/}
                                {/*            </Card>*/}

                                {/*        </Formsy>*/}
                                {/*        <div className="flex justify-between w-full mt-15">*/}
                                {/*            <div className="justify-self-start">*/}
                                {/*                <Button variant="contained" color="primary"*/}
                                {/*                        onClick={() => setActiveStep(prevState => prevState - 1)}>*/}
                                {/*                    {t("PREVIOUS")}*/}
                                {/*                </Button>*/}
                                {/*            </div>*/}
                                {/*            <div className="justify-self-end">*/}
                                {/*                <Button variant="contained" color="primary"*/}
                                {/*                        onClick={() => setActiveStep(prevState => prevState + 1)}>*/}
                                {/*                    {t("NEXT")}*/}
                                {/*                </Button>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </Div>*/}
                                {/*</div>*/}


                            </div>
                        )}
                        {(activeStep === 1 && founderOwner !== null) && (
                            <div className="table-responsive h-full">
                                <div className="pb-48">
                                    <div className="table-responsive mb-48">
                                        <Div gap={2}>
                                            <Div columns={2}>
                                                <TextField className="my-16" onChange={(e) => handleFounderOwner(e)}
                                                           label={t("FORENAME")} variant="outlined" name="name"
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled" value={founderOwner?.name}/>
                                                <TextField className="my-16" onChange={(e) => handleFounderOwner(e)}
                                                           label={t("LASTNAME")} variant="outlined" name="surname"
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled" value={founderOwner?.surname}/>
                                            </Div>
                                            <Div columns={2}>
                                                <TextField onChange={(e) => handleFounderOwner(e)} type="email"
                                                           label={t("EMAIL")} variant="outlined" name="email"
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled" value={founderOwner?.email}/>
                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                           label={t("PHONE")}
                                                           variant="outlined" name="phoneNumber"
                                                           placeholder={"+" + t("CODE") + " XXXXXXXXXX"}
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled"
                                                           value={founderOwner?.phoneNumber}/>
                                            </Div>
                                            <Div columns={2}>
                                                {/*dob alanı güncellendi*/}
                                                <TextField
                                                    onChange={(e) => handleFounderOwner(e)}
                                                    type="date"
                                                    name="dob"
                                                    disabled={isEditable === true ? false : true}
                                                    value={formatDate(founderOwner?.dob)}
                                                    id="date"
                                                    label={t("DATEOFBIRTHDAY")}
                                                    // className="my-16"
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    inputProps={{
                                                        max: '3000-01-01',
                                                        min:'1000-01-01'
                                                    }}
                                                    variant="outlined"/>
                                                <TextField
                                                    id="outlined-select-currency"
                                                    select
                                                    label={t("SEX")}
                                                    name="sex"
                                                    value={founderOwner?.sex ? founderOwner?.sex : "none"}
                                                    disabled={isEditable === true ? false : true}
                                                    onChange={(e) => handleFounderOwner(e)}
                                                    // helperText= {t("SELECTCURRENCY")}
                                                    variant="outlined"
                                                >
                                                    <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                    <MenuItem value="true">{t("MALE")}</MenuItem>
                                                    <MenuItem value="false">{t("FEMALE")}</MenuItem>
                                                </TextField>
                                            </Div>
                                            <Div columns={2}>
                                                <TextField onChange={(e) => handleFounderOwner(e)} type="email"
                                                           label={t("NINO")} variant="outlined" name="nino"
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled" value={founderOwner?.nino}/>
                                                <TextField onChange={(e) => handleFounderOwner(e)}
                                                           label={t("PERSONALUTR")}
                                                           variant="outlined" name="utr"
                                                           disabled={isEditable === true ? false : true}
                                                           id="outlined-disabled" value={founderOwner?.utr}/>
                                            </Div>
                                            {/*columns={founderOwner?.maritalStatus === 'true' ? 2 : 1}*/}
                                            {/*className={founderOwner?.maritalStatus === 'true' ? "" : "w-1/2 self-center content-center"}*/}
                                            <Div columns={2}>
                                                <TextField
                                                    id="outlined-select-currency"
                                                    select
                                                    name="maritalStatus"
                                                    label={t("MARITALSTATUS")}
                                                    value={founderOwner?.maritalStatus ? founderOwner?.maritalStatus : "none"}
                                                    disabled={isEditable === true ? false : true}
                                                    onChange={(e) => handleFounderOwner(e)}
                                                    // helperText= {t("SELECTMARITALSTATU")}
                                                    variant="outlined"
                                                >
                                                    <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                    <MenuItem value="true">{t("MARRIED")}</MenuItem>
                                                    <MenuItem value="false">{t("SINGLE")}</MenuItem>
                                                </TextField>
                                                {(founderOwner?.maritalStatus === 'true') && (
                                                    <TextField onChange={(e) => handleFounderOwner(e)}
                                                               label={t("SPOUSENAME")} variant="outlined"
                                                               name="spouseName"
                                                               disabled={isEditable === true ? false : true}
                                                               id="outlined-disabled"
                                                               value={founderOwner?.spouseName}/>
                                                )
                                                }
                                                {client.clientTypeEnum.toString() == "SOLETRADE" &&
                                                <TextField
                                                    onChange={(e) => handleFounderOwner(e)}
                                                    type="date"
                                                    name="

                                                           tDate"
                                                    disabled={isEditable === true ? false : true}
                                                    value={formatDate(founderOwner?.workStartDate)}
                                                    id="date"
                                                    // defaultValue={selectedDate}
                                                    label={t("WORKSTARTDATE")}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    inputProps={{
                                                        max: '3000-01-01',
                                                        min:'1000-01-01'
                                                    }}
                                                    variant="outlined"/>
                                                }

                                            </Div>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography color="textSecondary"
                                                                gutterBottom>
                                                        {t("NEXTOFKINDESCRIPTION")}
                                                    </Typography>
                                                    <Div columns={2}>
                                                        <TextField className="my-16"
                                                                   onChange={(e) => handleFounderOwner(e)}
                                                                   label={t("NAMEANDSURNAME")} variant="outlined"
                                                                   name="nextOfKinName"
                                                                   disabled={isEditable === true ? false : true}
                                                                   id="outlined-disabled"
                                                                   value={founderOwner?.nextOfKinName}/>
                                                        <TextField className="my-16"
                                                                   onChange={(e) => handleFounderOwner(e)}
                                                                   label={t("PHONE")} variant="outlined"
                                                                   placeholder={"+" + t("CODE") + " XXXXXXXXXX"}
                                                                   name="nextOfKinNumber"
                                                                   disabled={isEditable === true ? false : true}
                                                                   id="outlined-disabled"
                                                                   value={founderOwner?.nextOfKinNumber}/>
                                                    </Div>
                                                    <Div columns={2}>
                                                        <TextField className="my-16"
                                                                   onChange={(e) => handleFounderOwner(e)}
                                                                   label={t("EMAIL")} variant="outlined"
                                                                   name="nextOfKinEmail"
                                                                   disabled={isEditable === true ? false : true}
                                                                   id="outlined-disabled"
                                                                   value={founderOwner?.nextOfKinEmail}/>
                                                        <TextField className="my-16"
                                                                   onChange={(e) => handleFounderOwner(e)}
                                                                   label={t("ADDRESS")} variant="outlined"
                                                                   name="nextOfKinAddress"
                                                                   disabled={isEditable === true ? false : true}
                                                                   id="outlined-disabled"
                                                                   value={founderOwner?.nextOfKinAddress}/>
                                                    </Div>
                                                </CardContent>
                                            </Card>
                                            <div className="flex justify-between w-full mt-15">
                                                <div className="justify-self-start">
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => setActiveStep(prevState => prevState - 1)}>
                                                        {t("PREVIOUS")}
                                                    </Button>
                                                </div>
                                                <div className="justify-self-end">
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => setActiveStep(prevState => prevState + 1)}>
                                                        {t("NEXT")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Invoice*/}
                        {activeStep === 2 && (
                            <div className="table-responsive h-full">

                                <div className="pb-48">
                                    <div className="pb-16 flex items-center">
                                        <Icon color="action">home</Icon>
                                        <Typography className="h2 mx-12" color="textSecondary">
                                            {client?.clientTypeEnum}
                                        </Typography>
                                    </div>

                                    {/*<CompanyDetailTab*/}
                                    {/*    addressNewList={addressNewList}*/}
                                    {/*    list={addressList}*/}
                                    {/*    handleAddress={handleAddress}*/}
                                    {/*    handleNewAddress={handleNewAddress}*/}
                                    {/*    isEditable={isEditable} >*/}
                                    {/*</CompanyDetailTab>*/}

                                    {/*ADRES BİLGİLERİNİN OLDUĞU KISIM    */}
                                    {/*Bu kısım Yeni Eklendi*/}
                                    <div className="table-responsive">
                                            <table className="simple">
                                                <thead>
                                                <tr>
                                                    <th>{t("TYPE")}</th>
                                                    <th>{t("LINE1")}</th>
                                                    <th>{t("LINE2")}</th>
                                                    <th>{t("LINE3")}</th>
                                                    <th>{t("POSTCODE")}</th>
                                                    <th>{t("TOWNCITY")}</th>
                                                    <th>{t("COUNTRY")}</th>
                                                    <th>{t("DATE")}</th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {/*Mevcutta yeni adres bilgilerinin bulunduğunu gösteriyor*/}
                                                {/*Eğer Yeni kayıt yok ise eski adres bilgileri gösterilecek*/}
                                                {(addressList)?.sort((a, b) => a.id - b.id).map((address, key) => (
                                                    <tr key={address?.id}>
                                                        <td>
                                                            {address?.addressType !== null && address?.addressType?.toString() == "HOME" ?
                                                                <Icon color="action">home</Icon> :
                                                                <Icon color="action">business</Icon>}

                                                            {addressNewList.length === 0 ?

                                                                <span
                                                                    className="truncate">
                                                                {address?.addressType !== null && address?.addressType?.toString() === "HOME"
                                                                    ?
                                                                    (t("RESIDENTIALADDRESS"))
                                                                    :
                                                                    (address?.addressType?.toString() === "BUSINESS" ? t("COMPANYREGISTERADDRESS") : t("BUSINESSTRADINGADDESS"))
                                                                }
                                                                </span>
                                                                :

                                                                <span
                                                                    className="truncate">
                                                                {address?.addressType !== null && address?.addressType?.toString() === "HOME"
                                                                    ?
                                                                    (t("OLDRESIDENTIALADDRESS"))
                                                                    :
                                                                    (address?.addressType?.toString() === "BUSINESS" ? t("OLDCOMPANYREGISTERADDRESS") : t("OLDBUSINESSTRADINGADDESS"))
                                                                }
                                                                </span>

                                                            }
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address.id, e)}
                                                                       variant="outlined" name="number"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.number}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address?.id, e)}
                                                                       variant="outlined" name="street"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.street}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address?.id, e)}
                                                                       variant="outlined" name="district"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.district}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address?.id, e)}
                                                                       variant="outlined" name="postcode"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.postcode}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address?.id, e)}
                                                                       variant="outlined" name="city"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled"
                                                                       value={address?.city}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <TextField onChange={(e) => handleAddress(address?.id, e)}
                                                                       variant="outlined" name="country"
                                                                       disabled={isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.country}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <TextField variant="outlined"
                                                                       name="country"
                                                                       disabled={true}
                                                                       id="outlined-disabled"/>
                                                        </td>

                                                    </tr>
                                                ))}

                                                {(addressNewList.length !== 0 ? addressNewList : null )?.sort((a, b) => b.id - a.id).map((address, key) => (

                                                    <tr key={address?.id}>
                                                        <td>
                                                            {address?.addressType !== null && address?.addressType?.toString() == "HOME" ?
                                                                <Icon color="action">home</Icon> :
                                                                <Icon color="action">business</Icon>}

                                                            <span
                                                                className="truncate">{address?.addressType !== null && address?.addressType?.toString() === "HOME" ? (t("RESIDENTIALADDRESS"))
                                                                :
                                                                (address?.addressType?.toString() === "BUSINESS" ? t("COMPANYREGISTERADDRESS") : t("BUSINESSTRADINGADDESS"))}</span>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address.id, e)}
                                                                       variant="outlined" name="number"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       id="outlined-disabled" value={address?.number}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="street"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       id="outlined-disabled" value={address?.street}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="district"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       id="outlined-disabled" value={address?.district}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="postcode"
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       id="outlined-disabled" value={address?.postcode}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>
                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="city"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       id="outlined-disabled"
                                                                       value={address?.city}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}
                                                            />
                                                        </td>

                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="country"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={address?.id === updateAddressRow ? false : true}
                                                                       id="outlined-disabled" value={address?.country}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <TextField onChange={(e) => handleNewAddress(address?.id, e)}
                                                                       variant="outlined" name="country"
                                                                       //disabled={addressNewList.length !== 0 && isEditable === true ? false : true}
                                                                       disabled={true}
                                                                       id="outlined-disabled" value={address?.createdDateTime[2] + '/' + address?.createdDateTime[1] + '/' +address?.createdDateTime[0]}
                                                                       inputProps={{
                                                                           maxlength: 150
                                                                       }}/>
                                                        </td>

                                                        <td>
                                                            <Button
                                                                //disabled={disableButton}
                                                                onClick={(e) =>editNewAddress(address.id,e)}
                                                                variant="outlined" color="primary">
                                                                <BorderColorSharpIcon></BorderColorSharpIcon>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}

                                                </tbody>
                                            </table>
                                    </div>

                                    {/*<div className="table-responsive">*/}
                                    {/*    <table className="simple">*/}
                                    {/*        <thead>*/}
                                    {/*        <tr>*/}
                                    {/*            <th>{t("TYPE")}</th>*/}
                                    {/*            <th>{t("LINE1")}</th>*/}
                                    {/*            <th>{t("LINE2")}</th>*/}
                                    {/*            <th>{t("LINE3")}</th>*/}
                                    {/*            <th>{t("POSTCODE")}</th>*/}
                                    {/*            <th>{t("TOWNCITY")}</th>*/}
                                    {/*            <th>{t("COUNTRY")}</th>*/}
                                    {/*        </tr>*/}
                                    {/*        </thead>*/}
                                    {/*        <tbody>*/}
                                    {/*        {addressList?.sort((a, b) => a.id - b.id).map((address, key) => (*/}
                                    {/*            <tr key={address?.id}>*/}
                                    {/*                <td>*/}
                                    {/*                    {address?.addressType !== null && address?.addressType?.toString() == "HOME" ?*/}
                                    {/*                        <Icon color="action">home</Icon> :*/}
                                    {/*                        <Icon color="action">business</Icon>}*/}

                                    {/*                    <span*/}
                                    {/*                        className="truncate">{address?.addressType !== null && address?.addressType?.toString() === "HOME" ? (t("RESIDENTIALADDRESS"))*/}
                                    {/*                        :*/}
                                    {/*                        (address?.addressType?.toString() === "BUSINESS" ? t("COMPANYREGISTERADDRESS") : t("BUSINESSTRADINGADDESS"))}</span>*/}
                                    {/*                </td>*/}
                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address.id, e)}*/}
                                    {/*                               variant="outlined" name="number"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled" value={address?.number}/>*/}
                                    {/*                </td>*/}
                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address?.id, e)}*/}
                                    {/*                               variant="outlined" name="street"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled" value={address?.street}/>*/}
                                    {/*                </td>*/}

                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address?.id, e)}*/}
                                    {/*                               variant="outlined" name="district"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled" value={address?.district}/>*/}
                                    {/*                </td>*/}
                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address?.id, e)}*/}
                                    {/*                               variant="outlined" name="postcode"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled" value={address?.postcode}/>*/}
                                    {/*                </td>*/}
                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address?.id, e)}*/}
                                    {/*                               variant="outlined" name="city"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled"*/}
                                    {/*                               value={address?.city}/>*/}
                                    {/*                </td>*/}

                                    {/*                <td>*/}
                                    {/*                    <TextField onChange={(e) => handleAddress(address?.id, e)}*/}
                                    {/*                               variant="outlined" name="country"*/}
                                    {/*                               disabled={isEditable === true ? false : true}*/}
                                    {/*                               id="outlined-disabled" value={address?.country}/>*/}
                                    {/*                </td>*/}
                                    {/*            </tr>*/}
                                    {/*        ))}*/}
                                    {/*        </tbody>*/}
                                    {/*    </table>*/}
                                    {/*</div>*/}


                                </div>
                                <div className="flex justify-between w-full mt-15">
                                    <div className="justify-self-start">
                                        <Button variant="contained" color="primary"
                                                onClick={() => setActiveStep(prevState => prevState - 1)}>
                                            {t("PREVIOUS")}
                                        </Button>
                                    </div>
                                    <div className="justify-self-end">
                                        <Button variant="contained" color="primary"
                                                onClick={() => setActiveStep(prevState => prevState + 1)}>
                                            {t("NEXT")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeStep === 3 && (

                            <div className="table-responsive">
                                <UploadPersonel open={open} setOpen={setOpen} setNewDocument={setNewDocument} clientId={client.id}></UploadPersonel>
                                <Button disabled={isEditable === true ? false : true} variant="outlined"
                                        color={"primary"} onClick={() => setOpen(true) }>{t("ADDDOCUMENT")}</Button>
                                <table className="simple">
                                    <thead>
                                    <tr>
                                        <th className="w-64 text-right">{t("DOCUMENTTYPE")}</th>
                                        <th>{t("FILENAME")}</th>
                                        <th>{t("ORIGINALFILENAME")}</th>
                                        <th>{t("FILEDESCRIPTION")}</th>
                                        <th>{t("DOWNLOADDOCUMENT")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {documentsList.filter(d => d.isActive != 0).map(document => (
                                        <tr key={document.processID}>
                                            {/*<td className="w-80">*/}
                                            {/*	<img className="product-image" src={product.image} alt="product" />*/}
                                            {/*</td>*/}
                                            <th className="w-64 text-right">
                                                <span className="truncate">{document.documentType}</span>
                                            </th>
                                            <td className="w-64">
                                                <span className="truncate">{document.fileName}</span>
                                            </td>
                                            <td className="w-64">
                                                {/*<span className="truncate">{document.documentName}</span>*/}
                                                <a className="cursor-pointer truncate" onClick={event => openPreview(document)}>{document.documentName}</a>


                                            </td>
                                            <td className="w-64">
                                                <span className="truncate">{document.fileDescription}</span>
                                            </td>
                                            <td className="w-64">
                                                <a className="truncate cursor-pointer"
                                                   onClick={() => getDownload(document.fileName)}>{t("DOWNLOADDOCUMENT")}</a>
                                            </td>
                                        </tr>
                                    ))}
                                    <Dialog onClose={handleClose2}
                                            open={open2}
                                            aria-labelledby="alert-dialog-slide-title"
                                            aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle onClose={handleClose2}
                                                     id="alert-dialog-slide-title">
                                            <DetailSidebarHeader className="mt-3" selectedItem={selectedDocument}
                                                                 client={client} documentList={documentsList}
                                                                 setDocumentList={setDocumentsList}
                                                                 open3={open2} setOpen3={setOpen2}/>
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-slide-description">
                                                <DetailSidebarContent selectedItem={selectedDocument}
                                                                      client={client}/>
                                            </DialogContentText>
                                        </DialogContent>
                                    </Dialog>
                                    </tbody>
                                </table>
                                <div className="flex justify-between w-full mt-15">
                                    <div className="justify-self-start">
                                        <Button variant="contained" color="primary"
                                                onClick={() => setActiveStep(prevState => prevState - 1)}>
                                            {t("PREVIOUS")}
                                        </Button>
                                    </div>
                                    <div className="justify-self-end">
                                        <Button variant="contained" color="primary"
                                                onClick={() => setActiveStep(prevState => prevState + 1)}>
                                            {t("NEXT")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Reminder*/}
                        {(activeStep ===4 && currentUser?.toString() == "MANAGER" ) && (
                            <div className="table-responsive h-full">
                                <div className="pb-48">
                                        <Div gap={2}>
                                            {/*columns={founderOwner?.maritalStatus === 'true' ? 2 : 1}*/}
                                            {/*className={founderOwner?.maritalStatus === 'true' ? "" : "w-1/2 self-center content-center"}*/}
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography color="textSecondary"
                                                                gutterBottom>
                                                        {t("REMINDERDESCRIPTION")}
                                                    </Typography>
                                                        <Grid container>
                                                            <Grid item xs={12} sm={8}>
                                                                <TextField
                                                                    onChange={(e) => handleClient(e)}
                                                                    type="date"
                                                                    name="reminderDate"
                                                                    //disabled={isEditable === true ? false : true}
                                                                    disabled={true}
                                                                    value={formatDate(client?.reminderDate)}
                                                                    id="date"
                                                                    label={t("PROCESSDATE")}
                                                                    className="my-16"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    inputProps={{
                                                                        max: '3000-01-01',
                                                                        min:'1000-01-01'
                                                                    }}
                                                                    variant="outlined"/>
                                                            </Grid>
                                                            <Grid item xs={12} sm={2}>
                                                                <label>In Progress</label>
                                                                <Checkbox
                                                                    disabled={isEditable === true ? false : true}
                                                                    icon={<CheckBoxOutlineBlankIcon fontSize="large"/>}
                                                                    checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                                    checked={client.status === true ? true : false}
                                                                    name="status"
                                                                    onChange={handleChangeCheckBox}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={2}>
                                                                <label>Completed</label>
                                                                <Checkbox
                                                                    disabled={isEditable === true ? false : true}
                                                                    icon={<CheckBoxOutlineBlankIcon fontSize="large"/>}
                                                                    checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                                    checked={client.status_completed === true ? true : false}
                                                                    name="status_completed"
                                                                    onChange={handleChangeCheckBox}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                </CardContent>
                                            </Card>
                                            <div className="flex justify-between w-full mt-15">
                                                <div className="justify-self-start">
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => setActiveStep(prevState => prevState - 1)}>
                                                        {t("PREVIOUS")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
            innerScroll
        />
    );
}
export default CompanyDetail;
