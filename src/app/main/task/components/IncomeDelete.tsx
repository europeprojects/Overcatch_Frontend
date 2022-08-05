import React, {useEffect, useState} from 'react';
import {
    Button,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Menu,
    MenuItem, Step, StepConnector, StepLabel, Stepper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import history from '@history';
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import api from "../../../services/BackendApi";
import {Client, IncomesType, Task} from "../../../types/UserModel";
import {Link, useParams} from "react-router-dom";
import FusePageCarded from "../../../../@fuse/core/FusePageCarded/FusePageCarded";
import Icon from "@material-ui/core/Icon";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";
import BackendApi from "../../../services/BackendApi";
import {useTranslation} from "react-i18next";
import Paper from "@material-ui/core/Paper";
import config from "../../../services/Config";
import BusinessCenter from "@material-ui/icons/BusinessCenter";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import DescriptionIcon from "@material-ui/icons/Description";
import TasksStatus from "../task/TaskStatus";


function EnhancedTableHead(props) {
    const {t} = useTranslation('document');
    const headCells = [
        {id: 'incomeType', numeric: false, disablePadding: false, label: t("INCOMETYPE")},
        {id: 'incomePricerice', numeric: false, disablePadding: false, label: t('INCOMEAMOUNT')},
        {id: 'currency', numeric: false, disablePadding: false, label: t('CURRENCY')},
        {id: 'incomeDate', numeric: false, disablePadding: false, label: t('DATE')},
        {id: 'delete', numeric: false, disablePadding: false, label: t('DOCUMENT')}
    ];
    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`
    },
    divider: {
        backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    seller: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark),
        marginRight: -88,
        paddingRight: 66,
        width: 480
    }
}));

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

function IncomeDelete(props: any) {
    const [client, setClient] = useState<Client>({} as Client);
    const [taskDetail, setTaskDetail] = useState<Task>();
    const [isLoading, setIsLoading] = useState(false)
    const [open2, setOpen2] = React.useState(false);
    const [confirm, setConfirm] = useState<string>();
    const [message,setMessage] = useState<string>();
    const [incomeType, setIncomeType]= useState<IncomesType>();
    const [activeStep, setActiveStep] = React.useState(0);
    const {t} = useTranslation('task');
    const steps = [t('INCOMESDETAIL'), t('CONFIRMATION')];
    const theme = useTheme();
    //@ts-ignore
    let routerParams = useParams();
    //@ts-ignore
    const {taskid} = routerParams;
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    const [income, setIncome] = useState(null)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    const getProcess = () => {
        setOpen2(false)
        setIsLoading(true);
        BackendApi.getTaskConfirm(confirm, parseInt(window.atob(taskid)),message).then(data => {
            history.push("/tasks/list/"+window.btoa("ADMIN"))
            setIsLoading(false)
        })
    }

    useEffect(()=>{
        console.log("cash", income)
    }, [income])

    useEffect(() => {
        // @ts-ignore
        if (window.atob(taskid)) {
            api.getIncomeByTaskId(window.atob(taskid)).then(res => {
                console.log(res,"delete")
                setIncome(res)
                api.getIncomesTypeById(res?.incomeTypeId).then(res => {
                    setIncomeType(res)
                })
            })
            api.getClientByTaskId(parseInt(window.atob(taskid))).then(response => {
                setClient(response);
                const {company, addressList, customerClients, founderOwner, tasks, documents} = response;
                setTaskDetail(tasks?.find(task => task.id === parseInt(window.atob(taskid))))
            })

        } else {
            history.push("/tasks/list/" + window.btoa("ADMIN"))
        }
    }, [])

    const handleClose3 = () => {
        setOpen2(false);
    };

    const getDocumentUrlByFileName = (fileName: string) => {
        var id = fileName?.split("-")[0]
        var url = config.BACKEND_API_URL + "/api/file/downloadFile/" + id + "/" + fileName
        return url
    }

    return (
        <FusePageCarded
            classes={{
                content: 'flex-grow flex-shrink-0 p-0 print:p-0',
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
                                to={"/tasks/list/" + window.btoa("ADMIN")}
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t('TASKS')}</span>
                            </Typography>
                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                <Typography className="text-16 sm:text-20 truncate">
                                    {t('INCOMEDELETEREQUEST')}{` - ${window.atob(taskid)}`}
                                </Typography>
                                <Typography className="text-12 sm:text-12 truncate">
                                    {t('PROCESSDATE')}{` - ${taskDetail?.processDate}`}
                                </Typography>

                            </div>
                        </div>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>

                                    <Button variant="contained" color="secondary" {...bindTrigger(popupState)} disabled={income?.task?.taskConfirmations?.[income?.task?.taskConfirmations?.length - 1]?.taskConfirm == "DONE"}>
                                        {routingData?.confirmType == null ? (t('SELECTSTATE')) : (t(routingData?.confirmType?.toString()))}
                                        {/*Select State*/}
                                    </Button>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            setConfirm("INPROGRESS")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('INPROGRESS')}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("DONE")
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('DONE')}</MenuItem>
                                        <MenuItem onClick={() => {
                                            setConfirm("REJECTED");
                                            setOpen2(true)
                                            popupState.close()
                                        }}>{t('REJECTED')}</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                        {isLoading && (<CircularProgress color={"secondary"} className={"z-40 float-right"}/>)}

                        {/*CONFIRM OLAYI*/}
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
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <Paper className="h-full my-16">
                        {activeStep == 0 && (
                            <TableContainer>
                                <Table id="myTable"
                                    // className={classes.table}
                                       aria-labelledby="tableTitle"
                                       aria-label="enhanced table"
                                >
                                    <EnhancedTableHead />
                                    <TableBody>
                                        <TableRow id='myTable'
                                                  tabIndex={-1}
                                                  key={income?.clientId}
                                        >
                                            <TableCell>
                                                {incomeType?.incomesType}
                                            </TableCell>
                                            <TableCell align="left" >{income?.price}</TableCell>
                                            <TableCell align="left">{income?.currencyOfPayment}</TableCell>
                                            <TableCell align="left">{income?.incomeDate}</TableCell>
                                            <TableCell align="left">
                                                <a href={getDocumentUrlByFileName(income?.fileName)}>{income?.fileName}</a>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {activeStep === 1 && (
                            <div className="table-responsive">

                                <table className="simple">
                                    <thead className="w-full">
                                    <tr>
                                        <th>{t("")}{t("CONFIRMTYPE")}</th>
                                        <th>{t("")}{t("PROCESSDATE")}</th>
                                        <th>{t("")}{t("APPROVEDSTAFF")}</th>
                                        <th>{t("")}{t("STAFFTYPE")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/*@ts-ignore*/}
                                    {income?.task?.taskConfirmations?.map(confirm => (
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
                                                <span className="truncate">{confirm.personel?.userInfo?.name} {confirm.personel?.userInfo?.surname}</span>
                                            </td>
                                            <td>
                                                <span className="truncate">{confirm.personel?.userInfo?.userType}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>


                        )}
                    </Paper>

                </FuseAnimate>

            }
            innerScroll
        />
    );
}

export default IncomeDelete;
