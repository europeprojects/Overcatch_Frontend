import Icon from '@material-ui/core/Icon';
import {createStyles, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
// import reducer from '../store';
// import { getOrder } from '../store/orderSlice';
import history from '@history/@history'
import FusePageCarded from '../../../../@fuse/core/FusePageCarded/FusePageCarded';
import api from "../../../services/BackendApi";
import BackendApi from "../../../services/BackendApi";
import {
    AddressInfo,
    Client,
    Company,
    CustomerClientDTO,
    DirectorDetail,
    DocumentInfo,
    FounderOwner, Task, TaskConfirm, TaskConfirmation,
    UserDTO
} from "../../../types/UserModel";
import {
    Button,
    Card,
    CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    Menu,
    MenuItem,
    Step,
    StepConnector,
    StepLabel,
    Stepper, TextField
} from "@material-ui/core";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import DescriptionIcon from "@material-ui/icons/Description";
import clsx from "clsx";
import {PlaylistAddCheck} from "@material-ui/icons";
import Formsy from "formsy-react";
import {Div} from "../../../components/Grid";
import {SelectFormsy, TextFieldFormsy} from "../../../../@fuse/core/formsy";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TasksStatus from "./TaskStatus";
import { withSnackbar } from 'notistack';
import {useTranslation} from "react-i18next";
function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const {active, completed} = props;

    const icons = {
        1: <BusinessCenter/>,
        2: <AccountCircleIcon/>,
        3: <EditLocationIcon/>,
        4: <DescriptionIcon/>,
        5: <PlaylistAddCheck/>,
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

const useStyles2 = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    title: {
        fontSize: 14,
    },
}));
function ApplicationTask(props: any) {
    const {t} = useTranslation('task');
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const [activeStep, setActiveStep] = React.useState(0);
    const dispatch = useDispatch();
    // const order = useSelector(({ eCommerceApp }) => eCommerceApp.order);
    const theme = useTheme();
    const routeParams = useParams();
    const [isLoading,setIsLoading]=useState(false)
    const [client, setClient] = useState<Client>({} as Client);
    const [addressList, setAddressList] = useState<AddressInfo[]>([]);
    const [customerClients, setCustomerClients] = useState<CustomerClientDTO[]>([]);
    const [directorDetails, setDirectorDetails] = useState<DirectorDetail[]>([]);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [company, setCompany] = useState<Company>(null);
    const [founderOwner, setFounderOwner] = useState<FounderOwner>(null);
    const [documentsList, setDocumentsList] = useState<DocumentInfo[]>([]);
    const [confirmations,setConfirmations]  =useState<TaskConfirmation[]>([])
    const [taskDetail,setTaskDetail]=useState<Task>()
    const steps = [t("BUSINESSDETAILS"), t("DIRECTOR"), t("ADDRESSDETAILS"), t("DOCUMENTDETAILS"), t("CONFIRMATION")];
    const [formState, setFormState] = useState<DirectorDetail>();
    const classes = useStyles2();
    // const [order, setOrder] = React.useState('asc');
    // const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [open2, setOpen2] = React.useState(false);
    const [confirm,setConfirm] = useState<string>();
    const [message,setMessage] = useState<string>();

    const handleClose3 = () => {
        setOpen2(false);
    };
    useEffect(() => {
        // @ts-ignore

        // @ts-ignore
        const { taskid } = routeParams;
        // @ts-ignore
        if (window.atob(taskid)){
            api.getClientByTaskId(parseInt(window.atob(taskid))).then(response => {
                setClient(response);
                const {company, addressList, customerClients, founderOwner,tasks, documents} = response;
                setCustomerClients(customerClients);

                if (company != null) {

                    const {directorDetails} = company;
                    setDirectorDetails(directorDetails);
                }
                setTaskDetail(tasks?.find(task=> task.id === parseInt(window.atob(taskid))))
                // const {taskConfirmations}
                // setFormState(directorDetails[0]);
                setDocumentsList(documents)
                if (founderOwner != null) {
                    setFounderOwner(founderOwner);
                } else {
                    setCompany(company)
                }
                window.atob(taskid)
                console.log(customerClients);

                customerClients.map(customerResponse => {
                    console.log(customerResponse.customerInfo);
                    customerResponse.customerInfo.userInfo.brpExpireDate = customerResponse.customerInfo.brpExpireDate;
                    customerResponse.customerInfo.userInfo.brpNumber = customerResponse.customerInfo.brpNumber;
                    customerResponse.customerInfo.userInfo.payment = response.payment;
                    setUsers([...users, customerResponse?.customerInfo.userInfo]);
                });
                setAddressList(addressList);
            })
        } else {
            history.push("/tasks/list/"+window.btoa("ADMIN"))
        }


    }, [])

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
    const getProcess = () => {
        setOpen2(false)
        setIsLoading(true);
        BackendApi.getTaskConfirm(confirm, parseInt(window.atob(taskid)),message).then(data => {
            history.push("/tasks/list/"+window.btoa("ADMIN"))
            setIsLoading(false)
        })
    }

    const handleFunction = (type: string) => {

    }
    const isSelected = name => selected.indexOf(name) !== -1;


    const handleClick = (event, name) => {
        const director = directorDetails.find(l => l.id === name);
        setFormState(director);
        // console.log(director)
    };

    function formatDate(date){
        var newdate;
        if(date) {
            let d = new Date(date)
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
            newdate = `${ye}-${mo}-${da}`
        }
        else
            newdate = null
        if (newdate?.split("-")[0].length<4)
            newdate = null
        else if(newdate?.split("-")[0].length>4)
            newdate = newdate?.split("-")[0].substring(0,4)
        return newdate
    }

    //@ts-ignore
    const { taskid } = routeParams;
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
                            {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                            <Typography

                                className="normal-case flex items-center sm:mb-12"
                                component={Link}
                                role="button"
                                to={"/tasks/list/"+window.btoa("ADMIN")}
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t("TASKS")}</span>
                            </Typography>
                            {/*</FuseAnimate>*/}

                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                <Typography className="text-16 sm:text-20 truncate">
                                    {t('APPLICATIONTASKS')}{` - ${window.atob(taskid)}`}
                                </Typography>
                                <Typography className="text-12 sm:text-12 truncate">
                                    {t('PROCESSDATE')}{` - ${taskDetail?.processDate}`}
                                </Typography>
                                {/*</FuseAnimate>*/}

                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                <Typography className="text-14 sm:text-20 truncate" variant="caption">
                                    {/*{company.fullName} - {soleTraderCompany !=null ?"Sole Trader":"Incorpration"}*/}
                                </Typography>
                                {/*</FuseAnimate>*/}
                            </div>
                        </div>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <Button variant="contained" color="secondary" {...bindTrigger(popupState)}>
                                        {routingData?.confirmType == null ? (t('SELECTSTATE')):(t(routingData?.confirmType.toString()))}
                                        {/*Select State*/}
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            setConfirm("INPROGRESS")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("INPROCESS")}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("DONE")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("DONE")}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("REJECTED");
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t("DENIED")}</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                        {isLoading && (<CircularProgress color={"secondary"} className={"z-40 float-right"} />)}
                    </div>
                )
            }
            contentToolbar={
                <Stepper className="w-full" alternativeLabel activeStep={activeStep} connector={<ColorlibConnector/>}>
                    {steps.map((label, indis) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}
                                       onClick={() => setActiveStep(indis)}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            }
            content={

                client && (
                    <div className="p-16 sm:p-24 w-full">
                        <Dialog
                            fullWidth={true}
                            maxWidth={"xs"}
                                 open={open2}
                                 onClose={handleClose3} aria-labelledby="customized-dialog-title" >
                            <DialogTitle id="customized-dialog-title" >
                                {t("CONFIRMMESSAGE")}
                            </DialogTitle>
                            <DialogContent dividers>
                                    <FormControl className={"w-full"}>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            multiline
                                            // value={fileDescription}
                                            value={message}
                                            onChange={(e)=>setMessage(e.target.value)}
                                            rows={3}
                                            rowsMax={4}
                                            name="message"
                                            variant={"outlined"}
                                        />
                                    </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button variant={"contained"} onClick={handleClose3} color="secondary">
                                    {t("CLOSE")}
                                </Button>
                                <Button variant={"contained"} onClick={()=>getProcess()} color="primary">
                                    {t("SAVE")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {/* Task Details */}
                        {activeStep === 0 && (
                            <div className="table-responsive h-full">
                                <div className="pb-48">
                                    <div className="pb-16 flex items-center">
                                        <Icon color="action">account_circle</Icon>
                                        <Typography className="h2 mx-16" color="textSecondary">
                                            {client?.clientTypeEnum}
                                        </Typography>
                                    </div>

                                    <div className="mb-24">


                                        <div className="mb-24">
                                            <div className="table-responsive mb-48">
                                                <table className="simple">
                                                    {client.company == null ? (<thead>
                                                    <tr>
                                                        <th>{t("BUSINESSNAME")}</th>
                                                        <th>{t("BUSINESSEMAIL")}</th>
                                                        <th>{t("BUSINESSPHONE")}</th>
                                                    </tr>
                                                    </thead>) : (<thead>
                                                    <tr>
                                                        <th>{t("BUSINESSNAME")}</th>
                                                        <th>{t("BUSINESSEMAIL")}</th>
                                                        <th>{t("BUSINESSPHONE")}</th>
                                                        <th>{t("YEARENDDATE")}</th>
                                                        <th>{t("DUEDATE")}</th>
                                                        <th>{t("REGISTRATIONNUMBER")}</th>
                                                        <th>{t("AUTHENTICATIONCODE")}</th>
                                                        <th>{t("NATIONALITY")}</th>
                                                    </tr>
                                                    </thead>)}

                                                    {client.company == null ? (
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <span
                                                                    className="truncate">{founderOwner?.tradeAsName}</span>
                                                            </td>
                                                            <td>
                                                                <span className="truncate">{founderOwner?.email}</span>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className="truncate">{founderOwner?.phoneNumber}</span>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className="truncate">{founderOwner?.vatNumber}</span>
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className="truncate">{founderOwner?.eoriNumber}</span>
                                                            </td>

                                                        </tr>
                                                        </tbody>) : (<tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="truncate">{company?.name}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.email}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.phoneNumber}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.yearEndDate}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.dueDate}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.registration}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.authentication}</span>
                                                        </td>
                                                        <td>
                                                            <span className="truncate">{company?.nationality}</span>
                                                        </td>
                                                    </tr>
                                                    </tbody>)}
                                                </table>
                                            </div>
                                            {client.company == null ? ("") : (<div className="table-responsive h-full">

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
                                                                <span className="truncate">{nature.description}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>)}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        {/* Products */}
                        {activeStep === 1 && (
                            client.company == null ? (<div className="table-responsive mb-48">
                                <table className="simple">
                                    <thead>
                                    <tr>
                                        <th>{t("FORENAME")}</th>
                                        <th>{t("LASTNAME")}</th>
                                        <th>{t("EMAIL")}</th>
                                        <th>{t("PHONENUMBER")}</th>

                                    </tr>

                                    </thead>
                                    <tbody>

                                    <TableRow
                                        hover
                                        // onClick={event => handleClick(event, selectedDirector.id)}
                                        role="checkbox"
                                        // aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        // key={selectedDirector.id}
                                        // selected={isItemSelected}
                                    >

                                        <TableCell align="left">{founderOwner.name}</TableCell>
                                        <TableCell align="left">{founderOwner.surname}</TableCell>
                                        <TableCell align="left">{founderOwner.email}</TableCell>
                                        <TableCell align="left">{founderOwner.phoneNumber}</TableCell>

                                    </TableRow>

                                    </tbody>
                                </table>
                                <Div gap={2}>
                                    <Formsy
                                        // onValidSubmit={handleSubmit}
                                        // onValid={enableButton}
                                        // onInvalid={disableButton}
                                        // onChange={handleSubmitChange}
                                        // ref={formRef}
                                        className="flex flex-col justify-center w-full"
                                    >
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("FORENAME")}
                                                name="name"
                                                value={founderOwner?.name}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                fullWidth field="companyName"
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("LASTNAME")}
                                                name="surname"
                                                value={founderOwner?.surname}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                fullWidth field="companyName"
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                name="email"
                                                type="email"
                                                label={t("EMAIL")}
                                                value={founderOwner?.email}
                                                validations={{
                                                    minLength: 4,
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),

                                                }}
                                                fullWidth field="fullName"
                                                // formState={formState}
                                                variant="outlined"
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                name="phoneNumber"
                                                className="my-16"
                                                value={founderOwner?.phoneNumber}
                                                validations={{
                                                    minLength: 10,
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH10")

                                                }}
                                                label={t("PHONENUMBER")}
                                                fullWidth field="placeOfBirth"
                                                variant="outlined"/>

                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                type="date"
                                                name="dob"
                                                // value={formDetail.dob}
                                                id="date"
                                                // defaultValue={selectedDate}
                                                label={t("DATEOFBIRTHDAY")}
                                                className="my-16"
                                                // validations={{
                                                //     minLength: 4,
                                                // }}
                                                // validationErrors={{
                                                //     minLength: 'Min character length is 4',
                                                //
                                                // }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                inputProps={{
                                                    max: '3000-01-01',
                                                    min:'1000-01-01'
                                                }}
                                                variant="outlined"/>
                                            <SelectFormsy
                                                open={false}
                                                className="my-16"
                                                label={t("SEX")}
                                                name="sex"
                                                value={founderOwner?.sex ? founderOwner?.sex : "none"}
                                                variant="outlined"
                                                required>
                                                <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                <MenuItem value="true">{t("MALE")}</MenuItem>
                                                <MenuItem value="false">{t("FEMALE")}</MenuItem>
                                            </SelectFormsy>
                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("NINO")}
                                                name="nino"
                                                value={founderOwner?.nino}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("UTR")}
                                                name="utr"
                                                value={founderOwner?.utr}
                                                validations={{
                                                    minLength: 4,
                                                    // isExisty:true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    // isExisty:"Gidemezsin"
                                                }}
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                            />
                                        </Div>
                                        <Div columns={2}>
                                            <SelectFormsy
                                                className="my-16"
                                                open={false}
                                                // className="my-16"
                                                label={t("MARITALSTATUS")}
                                                name="maritalStatus"
                                                value={founderOwner?.maritalStatus ? founderOwner?.maritalStatus : "none"}
                                                variant="outlined"
                                                required>
                                                <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                <MenuItem value='true'>{t("MARRIED")}</MenuItem>
                                                <MenuItem value='false'>{t("SINGLE")}</MenuItem>
                                            </SelectFormsy>
                                            {(founderOwner?.maritalStatus === 'true') && (
                                                <TextFieldFormsy
                                                    className="my-16"
                                                    disabled={true}
                                                    name="spouseName"
                                                    // className="my-16"
                                                    value={founderOwner?.spouseName}
                                                    validations={{
                                                        minLength: 10,
                                                    }}
                                                    validationErrors={{
                                                        minLength: t("MINLENGTH10"),

                                                    }}
                                                    label={t("SPOUSENAME")}
                                                    fullWidth field="placeOfBirth"
                                                    variant="outlined"/>
                                            )

                                            }

                                            {client?.clientTypeEnum.toString() == "SOLETRADE" &&
                                            <TextField
                                                className="my-16"
                                                disabled={true}
                                                type="date"
                                                name="workStartDate"
                                                value={founderOwner?.workStartDate ? formatDate(founderOwner?.workStartDate) : null}
                                                label={t("WORKSTARTDATE")}
                                                variant="outlined"
                                                inputProps={{
                                                    max: '3000-01-01',
                                                    min:'1000-01-01'
                                                }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                            }

                                        </Div>
                                        <Card className={classes.root + " mt-32"} variant="outlined">
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary"
                                                            gutterBottom>
                                                    {t("NEXTOFKINDESCRIPTION")}
                                                </Typography>
                                                <Div columns={2}>
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("FOREANDLASTNAME")}
                                                        name="nextOfKinName"
                                                        value={founderOwner?.nextOfKinName}
                                                        validations={{
                                                            minLength: 2,
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4"),
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                        required
                                                    />
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("PHONENUMBER")}
                                                        name="nextOfKinNumber"
                                                        value={founderOwner?.nextOfKinNumber}
                                                        validations={{
                                                            minLength: 2,
                                                            // isExisty:true
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4"),
                                                            // isExisty:"Gidemezsin"
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                    />
                                                </Div>
                                                <Div columns={2}>
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("EMAIL")}
                                                        name="nextOfKinEmail"
                                                        type={"email"}
                                                        value={founderOwner?.nextOfKinEmail}
                                                        validations={{
                                                            minLength: 2,
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4")
                                                        }}
                                                        // formState?={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                        required
                                                    />
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("ADDRESS")}
                                                        name="nextOfKinAddress"
                                                        rows={4}
                                                        multiline
                                                        value={founderOwner?.nextOfKinAddress}
                                                        validations={{
                                                            minLength: 2,
                                                            // isExisty:true
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4")
                                                            // isExisty:"Gidemezsin"
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                    />

                                                </Div>
                                            </CardContent>
                                        </Card>

                                    </Formsy>
                                </Div>
                            </div>) : (<div className="table-responsive mb-48">
                                <table className="simple">
                                    <thead>
                                    <tr>
                                        <th>{t("FORENAME")}</th>
                                        <th>{t("LASTNAME")}</th>
                                        <th>{t("EMAIL")}</th>
                                        <th>{t("PHONENUMBER")}</th>
                                        <th>{t("DOB")}</th>

                                    </tr>

                                    </thead>
                                    <tbody>
                                    {directorDetails?.map((selectedDirector, index) => {
                                        const isItemSelected = isSelected(selectedDirector.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => handleClick(event, selectedDirector.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={selectedDirector.id}
                                                selected={isItemSelected}
                                            >

                                                <TableCell align="left">{selectedDirector.name}</TableCell>
                                                <TableCell align="left">{selectedDirector.surname}</TableCell>
                                                <TableCell align="left">{selectedDirector.email}</TableCell>
                                                <TableCell align="left">{selectedDirector.phoneNumber}</TableCell>
                                                <TableCell align="left">{selectedDirector.dob}</TableCell>

                                            </TableRow>
                                        );
                                    })}

                                    </tbody>
                                </table>
                                <Div gap={2}>
                                    <Formsy
                                        // onValidSubmit={handleSubmit}
                                        // onValid={enableButton}
                                        // onInvalid={disableButton}
                                        // onChange={handleSubmitChange}
                                        // ref={formRef}
                                        className="flex flex-col justify-center w-full"
                                    >
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("FORENAME")}
                                                name="name"
                                                value={formState?.name}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                fullWidth field="companyName"
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("LASTNAME")}
                                                name="surname"
                                                value={formState?.surname}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                fullWidth field="companyName"
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                name="email"
                                                type="email"
                                                label={t("EMAIL")}
                                                value={formState?.email}
                                                validations={{
                                                    minLength: 4,
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4")

                                                }}
                                                fullWidth field="fullName"
                                                // formState={formState}
                                                variant="outlined"
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                name="phoneNumber"
                                                className="my-16"
                                                value={formState?.phoneNumber}
                                                validations={{
                                                    minLength: 10,
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH10"),

                                                }}
                                                label={t("PHONENUMBER")}
                                                fullWidth field="placeOfBirth"
                                                variant="outlined"/>

                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                type="date"
                                                name="dob"
                                                // value={formDetail.dob}
                                                id="date"
                                                // defaultValue={selectedDate}
                                                label={t("DATEOFBIRTHDAY")}
                                                className="my-16"
                                                // validations={{
                                                //     minLength: 4,
                                                // }}
                                                // validationErrors={{
                                                //     minLength: 'Min character length is 4',
                                                //
                                                // }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                inputProps={{
                                                    max: '3000-01-01',
                                                    min:'1000-01-01'
                                                }}
                                                variant="outlined"/>
                                            <SelectFormsy
                                                open={false}
                                                className="my-16"
                                                label={t("SEX")}
                                                name="sex"
                                                value={formState?.sex ? formState?.sex : "none"}
                                                variant="outlined"
                                                required>
                                                <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                <MenuItem value="true">{t("MALE")}</MenuItem>
                                                <MenuItem value="false">{t("FEMALE")}</MenuItem>
                                            </SelectFormsy>
                                        </Div>
                                        <Div columns={2}>
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("NINO")}
                                                name="nino"
                                                value={formState?.nino}
                                                validations={{
                                                    minLength: 4,
                                                    isExisty: true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4"),
                                                    isExisty: t("CANTGO")
                                                }}
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                                required
                                            />
                                            <TextFieldFormsy
                                                disabled={true}
                                                className="my-16"
                                                id="mui-theme-provider-outlined-input"
                                                label={t("UTR")}
                                                name="utr"
                                                value={formState?.utr}
                                                validations={{
                                                    minLength: 4,
                                                    // isExisty:true
                                                }}
                                                validationErrors={{
                                                    minLength: t("MINLENGTH4")
                                                    // isExisty:"Gidemezsin"
                                                }}
                                                // formState={formState}
                                                oninvalid="setCustomValidity('Please Enter')"
                                                oninput="setCustomValidity('')"
                                                variant="outlined"
                                            />
                                        </Div>
                                        <Div columns={formState?.maritalStatus === 'true' ? 2 : 1}
                                             className={formState?.maritalStatus === 'true' ? "" : "w-1/2 self-center content-center"}>
                                            <SelectFormsy
                                                open={false}
                                                className="my-16"
                                                label={t("MARITALSTATUS")}
                                                name="maritalStatus"
                                                value={formState?.maritalStatus ? formState?.maritalStatus : "none"}
                                                variant="outlined"
                                                required>
                                                <MenuItem value="none">{t("PLEASEENTER")}</MenuItem>
                                                <MenuItem value='true'>{t("MARRIED")}</MenuItem>
                                                <MenuItem value='false'>{t("SINGLE")}</MenuItem>
                                            </SelectFormsy>
                                            {(formState?.maritalStatus === 'true') && (
                                                <TextFieldFormsy
                                                    disabled={true}
                                                    name="spouseName"
                                                    className="my-16"
                                                    value={formState?.spouseName}
                                                    validations={{
                                                        minLength: 10,
                                                    }}
                                                    validationErrors={{
                                                        minLength: t("MINLENGTH10")

                                                    }}
                                                    label={t("SPOUSENAME")}
                                                    fullWidth field="placeOfBirth"
                                                    variant="outlined"/>
                                            )

                                            }


                                        </Div>
                                        <Card className={classes.root} variant="outlined">
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary"
                                                            gutterBottom>
                                                    {t("NEXTOFKINDESCRIPTION")}
                                                </Typography>
                                                <Div columns={2}>
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("FOREANDLASTNAME")}
                                                        name="nextOfKinName"
                                                        value={formState?.nextOfKinName}
                                                        validations={{
                                                            minLength: 2,
                                                        }}
                                                        validationErrors={{
                                                            minLength:  t("MINLENGTH4")
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                        required
                                                    />
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("PHONENUMBER")}
                                                        name="nextOfKinNumber"
                                                        value={formState?.nextOfKinNumber}
                                                        validations={{
                                                            minLength: 2,
                                                            // isExisty:true
                                                        }}
                                                        validationErrors={{
                                                            minLength:  t("MINLENGTH4")
                                                            // isExisty:"Gidemezsin"
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                    />
                                                </Div>
                                                <Div columns={2}>
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("EMAIL")}
                                                        name="nextOfKinEmail"
                                                        type={"email"}
                                                        value={formState?.nextOfKinEmail}
                                                        validations={{
                                                            minLength: 2,
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4")
                                                        }}
                                                        // formState?={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                        required
                                                    />
                                                    <TextFieldFormsy
                                                        disabled={true}
                                                        className="my-16"
                                                        id="mui-theme-provider-outlined-input"
                                                        label={t("ADDRESS")}
                                                        name="nextOfKinAddress"
                                                        rows={4}
                                                        multiline
                                                        value={formState?.nextOfKinAddress}
                                                        validations={{
                                                            minLength: 2,
                                                            // isExisty:true
                                                        }}
                                                        validationErrors={{
                                                            minLength: t("MINLENGTH4")
                                                            // isExisty:"Gidemezsin"
                                                        }}
                                                        // formState={formState}
                                                        oninvalid="setCustomValidity('Please Enter')"
                                                        oninput="setCustomValidity('')"
                                                        variant="outlined"
                                                    />

                                                </Div>
                                            </CardContent>
                                        </Card>

                                    </Formsy>
                                </Div>
                            </div>)


                        )}
                        {/* Invoice*/}
                        {/*{tabValue === 2 && <OrderInvoice order={order} />}*/}
                        {activeStep === 2 && (
                            <div className="table-responsive h-full">

                                <div className="pb-48">
                                    <div className="pb-16 flex items-center">
                                        <Icon color="action">home</Icon>
                                        <Typography className="h2 mx-12" color="textSecondary">
                                            {client.clientTypeEnum + " "}
                                            {t("ADDRESSLIST")}
                                        </Typography>
                                    </div>

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
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {addressList.map(address => (
                                                <tr key={address.id}>
                                                    <td>
                                                        {address.addressType?.toString() == "HOME" ?
                                                            <Icon color="action">{t("RESIDENTIALADDRESS")}</Icon> :
                                                            (address.addressType?.toString() == "BUSINESS" ? <Icon color="action">{t("COMPANYREGISTERADDRESS")}</Icon> :
                                                                <Icon color="action">{t("BUSINESSTRADINGADDESS")}</Icon>)
                                                        }
                                                        {address.addressType?.toString() == "HOME" ?
                                                            <span className="truncate">{t("RESIDENTIALADDRESS")}</span>
                                                            :
                                                            (address.addressType?.toString() == "BUSINESS" ? <span className="truncate">{t("COMPANYREGISTERADDRESS")}</span> :
                                                                <span className="truncate">{t("BUSINESSTRADINGADDESS")}</span>)
                                                        }
                                                    </td>
                                                    <td>
                                                        <span className="truncate">{address.number}</span>
                                                    </td>
                                                    <td>

                                                        <span className="truncate">{address.street}</span>
                                                    </td>

                                                    <td>
                                                        <span className="truncate">{address.district}</span>
                                                    </td>
                                                    <td>
                                                        <span className="truncate">{address.postcode}</span>
                                                    </td>
                                                    <td>
                                                        <span className="truncate">{address.city}</span>
                                                    </td>
                                                    <td>
                                                        <span className="truncate">{address.country}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>


                            </div>

                        )}
                        {activeStep === 3 && (
                            <div className="table-responsive">

                                <table className="simple">
                                    <thead className="w-full">
                                    <tr>
                                        <th>{t("DOCUMENTTYPE")}</th>
                                        <th>{t("FILENAME")}</th>
                                        <th>{t("ORIGINALFILENAME")}</th>
                                        <th>{t("FILEDESCRIPTION")}</th>
                                        <th>{t("DOWNLOADDOCUMENT")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {documentsList.map(document => (
                                        <tr key={document.processID}>
                                            {/*<td className="w-80">*/}
                                            {/*	<img className="product-image" src={product.image} alt="product" />*/}
                                            {/*</td>*/}
                                            <th>
                                                <span className="truncate">{document.documentType}</span>
                                            </th>
                                            <td>
                                                <span className="truncate">{document.fileName}</span>
                                            </td>
                                            <td>
                                                <span className="truncate">{document.documentName}</span>
                                            </td>
                                            <td>
                                                <span className="truncate">{document.fileDescription}</span>
                                            </td>
                                            <td>
                                                <a className="truncate"
                                                   onClick={() => getDownload(document.fileName)}>{t("DOWNLOAD")}</a>
                                                {/*<a className="truncate"  href={config.BACKEND_API_URL+"/api/file/downloadFile/"+document.fileName} >Download Document</a>*/}
                                            </td>
                                            {/*<td className="w-64 text-right">*/}
                                            {/*	<span className="truncate">{product.quantity}</span>*/}
                                            {/*</td>*/}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        )}
                        {activeStep === 4 && (
                            <div className="table-responsive">

                                <table className="simple">
                                    <thead className="w-full">
                                    <tr>
                                        <th>{t("CONFIRMTYPE")}</th>
                                        <th>{t("PROCESSDATE")}</th>
                                        <th>{t("APPROVEDSTAFF")}</th>
                                        <th>{t("STAFFTYPE")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {taskDetail?.taskConfirmations?.map(confirm => (
                                        <tr key={confirm.id}>
                                            <th>
                                                <span className="truncate">
                                                    {confirm?.taskConfirm.toString()==='INPROGRESS' || confirm?.taskConfirm.toString()==='DONE' ||
                                                    confirm?.taskConfirm.toString()==='REJECTED' ?
                                                        <TasksStatus id={confirm?.taskConfirm}></TasksStatus>
                                                        :<TasksStatus id={"DEFAULT"}></TasksStatus>}
                                                </span>
                                            </th>
                                            <td>
                                                <span className="truncate">{confirm.processDate}</span>
                                            </td>

                                            <td>
                                                <span className="truncate">{confirm.personel.userInfo.name} {confirm.personel.userInfo.surname}</span>
                                            </td>
                                            <td>
                                                <span className="truncate">{confirm.personel.userInfo.userType}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        )}
                        <div className="flex justify-between w-full mt-15">
                            <div className="justify-self-start">
                                <Button variant="contained" color="primary"
                                        onClick={() => setActiveStep(prevState => prevState - 1)}>
                                    {t("PREVIOUS")}
                                </Button>
                            </div>
                            {activeStep!==4 &&(
                                <div className="justify-self-end">
                                    <Button variant="contained" color="primary"
                                    onClick={() => setActiveStep(prevState => prevState + 1)}>
                                        {t("NEXT")}
                                    </Button>
                                </div>
                            )
                            }

                        </div>
                    </div>
                )
            }
            innerScroll
        />
    );
}
export default withSnackbar(ApplicationTask);
