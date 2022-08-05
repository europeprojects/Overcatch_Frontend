import React, {useEffect, useState} from 'react';
import FusePageCarded from "../../../@fuse/core/FusePageCarded/FusePageCarded";
import {
    CircularProgress,
    Icon,
    CircularProgressProps,
    createStyles,
    FormControl,
    InputLabel,
    LinearProgress,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Theme,
    withStyles
} from "@material-ui/core";
import {CashInvoice, Client, DocumentClass, DocumentUpload, Help, HelpType} from "../../types/UserModel";
import api from "../../services/BackendApi";
import {useSelector} from 'react-redux';
import Button from "@material-ui/core/Button";
import history from "../../../@history/@history";
import {withSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {supportPageSheme} from "../validations/ValidationSchemes";
import Backdrop from '@material-ui/core/Backdrop';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {userInfo} from "os";

const theme = createTheme();

theme.typography.h3 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2rem',
    },
    marginLeft: '2rem'
}

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            flexGrow: 1,
            padding: 8,
            marginTop: 2
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 10,
            color: '#fff',
        },
    }),
);
const useStylesFacebook = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative',
        },
        bottom: {
            color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        top: {
            color: '#1a90ff',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
        },
        circle: {
            strokeLinecap: 'round',
        },
    }),
);

function FacebookCircularProgress(props: CircularProgressProps) {
    const classes = useStylesFacebook();
    return (
        <div className={classes.root}>
            <CircularProgress
                variant="determinate"
                className={classes.bottom}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                className={classes.top}
                classes={{
                    circle: classes.circle,
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </div>
    );
}

export function CustomizedProgressBars() {
    const classes = useStyles();
}

export function IntegrationNotistack() {
    return (
        <SnackbarProvider maxSnack={3}>
            <SupportPage />
        </SnackbarProvider>
    );
}

function SupportPage(props: any) {

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant: VariantType) => () => {
        // variant could be success, error, warning, info, or default
        // enqueueSnackbar('Please Wait ! Your support ticket is sending sent .', { variant });
        console.log("formik.values.divided ->",formik.values.divided);
        if(formik.values?.description?.length != 0 && formik?.values?.helpType?.length != 0){
            setOpenBackDrop(!openBackDrop);
        }
    };

    const [value, setValue] = useState<Help>({} as Help);
    const [help, setHelp] = useState<Help>({} as Help);
    const [helpTypes, setHelpTypes] = useState([]);

    const clientId = useSelector(({company}) => company.currentCompanyId);
    const classes = useStyles();

    const [progress, setProgress] = React.useState(0);

    const [document, setDocument] = useState<DocumentClass>();
    const [documentUpload, setDocumentUpload] = useState<DocumentUpload>({} as DocumentUpload);
    const [file, setFile] = React.useState<File>(null);

    const [error, setError] = useState<string>('');

    const [selectedType, setSelectedType] = useState<HelpType>();
    const [disabled, setDisabled] = useState<boolean>(false);
    const [openDetail, setOpenDetail] = useState<boolean>(true);

    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const {t} = useTranslation('SupportPage');

    const [help1, setHelp1]= useState<HelpType>({id : null, email : "email@email.com", duration:3, helpTypeShowName : "Dividend Voucher" } as HelpType);
    let sayi=0;
    const [firstLoad, setFirstLoad] = React.useState(false);
    const [client,setClient] = useState<Client>({} as Client);
    useEffect(() => {
        test.forEach(x => {

            if (x.client.id === clientId) {
                if (x.client.state !== "3") {
                    props.enqueueSnackbar(<h4>{t("COMPANYAPPLICATIONERROR")}</h4>, {
                        variant: 'warning',
                    });
                    history.push("/clientapplist")
                } else {
                    helpType();
                    api.getClient(clientId).then((res)=> {
                        setClient(res);
                    });
                    if(!firstLoad){
                        setFirstLoad(true)
;                    }
                }

            }
        })
    }, []);

    function helpType (){
        api.getHelpTypes().then(response => setHelpTypes(response))
    }

    // useEffect(()=>{
    //
    //     {selectedTask?.task?.taskConfirmations?.filter(confirmation=>confirmation?.personel?.userInfo?.userType=="MANAGER").map((confirmation)=>(confirmation?.message))}
    //     setBankExcel((currentState) => [ ...currentState, deger as CashInvoice ]);
    //     if(firstLoad){
    //         for(let i=0; i<helpTypes.length ;i++){
    //             if(helpTypes[i].helpTypeShowName == "divided"){
    //                 console.log("ifte")
    //                 sayi=sayi+1;
    //             }
    //         }
    //
    //         helpTypes?.filter((a)=>a.helpTypeShowName=="divided").map((a)=>(sayi = sayi +1))
    //         if(sayi==0) {
    //             setHelp1({...help1, id: null, helpTypeShowName: "divided", email: "email@email.com", duration: 3})
    //         }
    //
    //         api.saveHelpType(help1).then(res => {
    //             history.push("/supportSettings");
    //         })
    //         //@ts-ignore
    //         setHelpTypes((forDivided)=>[...forDivided, help1]);
    //     }
    //        // @ts-ignore
    //         setHelpTypes((forDivided)=>[...forDivided, {helpTypeShowName: "divided", email :"email@email.com", duration: 3 }])
    //         setHelpTypes({...helpTypes,//@ts-ignore
    //              helpTypeShowName : "divided", email : "email@eemail.com", duration : 3})
    //     }
    // },[firstLoad])

    const handleChange2 = (event) => {
        event.target.value = null;
        setProgress(0)
        // setFileDescription(event.target.value)
        // console.log(document)
    };

    const open = (event) => {
        setOpenDetail(false);
    };

    function saveHelp() {
        let help1: Help;
        // @ts-ignore
        value.helpType = formik.values.helpType
        //value.helpType = formik.values.helpType.helpTypeShowName
        value.priorityLevel = formik.values.priorityLevel
        value.description = formik.values.description
        value.divided = formik.values.divided
        if (!file) {
            //@ts-ignore
            help1 = {
                client: {id: clientId} as Client,
                // document: document.id !== null && (document),
                priorityLevel: value.priorityLevel,
                helpType: value.helpType,
                task: null,
                id: null,
                request_user:null,
                //****** FBY***************
                description: value.description,
                //*************************
                divided : value.divided
            };
        } else {
            help1 = {
                file: file,
                client: {id: clientId} as Client,
                document: document,
                priorityLevel: value.priorityLevel,
                createdDateTime:value.createdDateTime,
                documentName:value.documentName,
                confirmType:value.confirmType,
                helpType: value.helpType,
                taskConfirmations:value.taskConfirmations,
                taskConfirm:value.taskConfirm,
                task:value.task,
                id: null,
                answer: null,
                request_user:null,
                divided:value.divided,
                //****** FBY***************
                description: value.description
                // user:value.client.customerClients[0].customerInfo.userInfo
                //*************************
            };
        }
        api.saveHelp2(help1, file, progressCallback).then(res => {
            history.push("/supportlist");
        })

        return help1;
    }

    const progressCallback = (loaded: number, total: number) => {
        setProgress(Math.round((loaded / total) * 100))
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }
//
//     function onSubmitHandle() {
//         setDisabled(true)
//         if (!documentUpload) {
//             return;
//
//         }
//         let progressCallback = (loaded: number, total: number) => {
//             setProgress(Math.round((loaded / total) * 100))
//         };
//
//         // setUploadDocumentList([...uploadDocumentList, document])
//
//         // @ts-ignore
//         api.uploadDocumentData1(file, "HELP", clientId, "asda", progressCallback).then((data) => {
//             setDocument({...document, ["id"]: parseInt(data.processId)})
//             console.log(parseInt(data.processId))
//             return parseInt(data.processId);
//         }).catch(err => {
//             if (isValidErrorResponse(err)) {
//                 setError(err.response.data.message)
//             } else {
//                 setError("Service error");
//             }
//         });
//         // setTimeout(()=>{ saveHelp();},1000)
//     }

    // useEffect(() => {
    //     console.log("Döküman",document)
    // }, [file])

    const formik = useFormik({

        initialValues: {
            priorityLevel: 'LOW',
            helpType: '',
            description: '',
            divided:null,
        },
        validationSchema: supportPageSheme,
        onSubmit: (values) => {
            setDisabled(true)
            saveHelp()
        },
    });

    const [openBackDrop, setOpenBackDrop] = React.useState(false);
    const handleClose = () => {
        setOpenBackDrop(false);
    };
    const handleToggle = () => {
        setOpenBackDrop(!openBackDrop);
    };

    return (

        <FusePageCarded

            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 items-center justify-left px-12">
                    <div className="flex items-center">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Icon className="insert_drive_file">contact_support</Icon>
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
                                {t('SUPPORTPAGE')}
                            </Typography>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={

                <div className="w-full m-20">
                    <div className="w-2/3">
                        <form onSubmit={formik.handleSubmit}>

                            <FormControl variant="outlined" className={"hidden"}>
                                <InputLabel id="demo-simple-select-outlined-label">{t('PRIORTIYLEVEL')}</InputLabel>
                                <Select
                                    name={"priorityLevel"}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label={t('PRIORITYLEVEL')}
                                    //value={formik.values.priorityLevel}
                                    value={"LOW"}
                                    onChange={formik.handleChange}
                                    error={formik.touched.priorityLevel && Boolean(formik.errors.priorityLevel)}
                                    className={"w-full"}
                                    disabled={true}
                                >
                                    <MenuItem value=""><em>{t('NONE')}</em></MenuItem>
                                    <MenuItem selected={true} value={"LOW"}>{t('LOW')}</MenuItem>
                                    <MenuItem value={"MEDIUM"}>{t('MEDIUM')}</MenuItem>
                                    <MenuItem value={"HIGH"}>{t('HIGH')}</MenuItem>
                                </Select>
                            </FormControl>


                            <FormControl variant="outlined" className={"flex w-full justify-self-stretch mt-8 mb-12"}>

                                {/*<InputLabel id="demo-simple-select-outlined-label">{t('TOPICOFREQUEST')}</InputLabel>*/}
                                <TextField
                                    select={true}
                                    className={"flex w-full"}
                                    name={"helpType"}
                                    //labelId={"demo-simple-select-outlined-label"}
                                    id="demo-simple-select-outlined"
                                    label={t('TOPICOFREQUEST')}
                                    value={formik.values.helpType}
                                    onChange={formik.handleChange}
                                    onClick={open}
                                    error={formik.touched.helpType && Boolean(formik.errors.helpType )}
                                    helperText={formik.touched.helpType && formik.errors.helpType}
                                >
                                    {helpTypes?.map(ht =>
                                        <MenuItem
                                        //@ts-ignore
                                        value={ht}>
                                            {ht.helpTypeShowName}
                                        </MenuItem>)
                                    }

                                </TextField>
                                {
                                    // console.log(client,"client")
                                    helpTypes.map((ht)=>(ht==formik.values.helpType && ht.helpTypeShowName == "Dividend Voucher" && ((client.company.directorDetails.length > 0) || (client.customerClients.length > 0)) )
                                        ?
                                        <TextField
                                            select={true}
                                            className={"flex w-full"}
                                            name={"divided"}
                                            //labelId={"demo-simple-select-outlined-label"}
                                            id="demo-simple-select-outlined"
                                            label={"directors"}
                                            value={formik.values.divided}
                                            // onChange={(event)=>handleClient(event.target.value)}
                                            disabled={openDetail}
                                            onChange={formik.handleChange}
                                            error={formik.touched.divided && Boolean(formik.errors.divided )}
                                            helperText={formik.touched.divided && formik.errors.divided}
                                        >
                                                {client?.company?.directorDetails.map((directors)=>
                                                    <MenuItem value={directors.id}>{directors.name + " " + directors.surname + " director"}</MenuItem>
                                                )}
                                                {client?.customerClients?.map((user)=>
                                                    <MenuItem value={user?.customerInfo?.userInfo?.id}>{user?.customerInfo?.userInfo?.name + " " + user?.customerInfo?.userInfo?.surname + " customer"}</MenuItem>
                                                )}
                                        </TextField>
                                        :
                                        <label></label>)
                                }
                                    <TextField
                                               className={"flex w-full justify-self-stretch mt-12 mb-12"}
                                               multiline={true}
                                               disabled={openDetail}
                                               rows={5}
                                               value={formik.values.description}
                                               onChange={formik.handleChange}
                                               error={formik.touched.description && Boolean(formik.errors.description)}
                                               helperText={formik.touched.description && formik.errors.description}
                                               fullWidth={true}
                                               name="description"
                                               placeholder={t("EMAILTEXTBOX")}
                                               label={t('DETAIL')}
                                               variant="outlined"
                                    />

                                    <div className={"flex w-full justify-self-stretch mx-8 my-12"}>

                                        <input
                                               className={"hidden"}
                                               type="file"
                                               onClick={handleChange2}
                                               onChange={handleFileChange}
                                               id="contained-button-file"
                                        />

                                        <label htmlFor="contained-button-file">
                                            <Button variant="contained" color="primary" component="span">
                                                {t('UPLOAD')}
                                            </Button>
                                        </label>

                                        <div className={classes.root}>
                                            <BorderLinearProgress variant="determinate" value={progress}/>
                                        </div>

                                        {/*<LinearProgress variant="determinate"*/}
                                        {/*                  color={progress === 100 ? "secondary" : "primary"}*/}
                                        {/*                  value={progress}/>*/}

                                    </div>

                                    <div className={"flex mx-8 my-12"}>

                                        <Button
                                                 type={"submit"}
                                                 className={"justify-self-end"}
                                                 disabled={disabled}
                                                 variant="contained"
                                                 color="primary"
                                                 onClick={handleClickVariant('info')}
                                                 >{t('SEND')}
                                        </Button>

                                    </div>

                                    <div className={"flex mx-8 my-12"}>
                                        <Backdrop className={classes.backdrop} open={openBackDrop}>
                                            <CircularProgress color="inherit"/>
                                            <ThemeProvider theme={theme}>
                                                    <Typography variant="h3">{t('WAIT')}</Typography>
                                            </ThemeProvider>
                                        </Backdrop>
                                    </div>

                            </FormControl>
                        </form>
                    </div>
                </div>
            }
            innerScroll
        />
    );
}
export default withSnackbar(SupportPage);
