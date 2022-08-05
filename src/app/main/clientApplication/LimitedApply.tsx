import {createStyles, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import history from '@history';
import BusinessCenter from '@material-ui/icons/BusinessCenter';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
    Fab,
    Paper,
    Step,
    StepConnector,
    StepContent,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {Div} from "app/components/Grid";
import clsx from 'clsx';
import {
    AddressCreate,
    AddressInfo,
    AgreementType,
    Client,
    Company,
    DirectorDetail,
    DocumentInfo,
    DocumentUpload,
    FounderOwner,
    NatureBusiness
} from "../../types/UserModel";
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from "@material-ui/core/Button";
import api from 'app/services/BackendApi';
import {Link} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import HomeAdresForm from "../components/HomeAdresForm";
import DocumentCompanyInfoForm from "../company/components/DocumentCompanyForm";
import LimitedBusinessDetail from "./components/LimitedBusinessDetail";
import DirectorDetailForm from "./components/DirectorDetail";
import {useTranslation} from "react-i18next";

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
const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        actionsContainer: {
            marginBottom: theme.spacing(2),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
    }),
);
const useStyles = makeStyles((theme) => ({

    layoutRoot: {},
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

// function getSteps() {
//     return [t("BUSINESSDETAILS"), t("DIRECTOROWNER"), t("ADDRESSDETAILS"), t("DOCUMENTDETAILS")];
// }

function getSteps1() {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '2', '3', '4', '5', '6', '7', '8'];
}

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
}));

function LimitedApply(props: any) {
    // @ts-ignore
    const routingData = history.location.displayRouteData;
    const classes1 = useStyles1();
    const [activeStep1, setActiveStep1] = React.useState(0);
    const steps1 = getSteps1();
    const [documentUploadList, setDocumentUploadList] = useState<DocumentUpload[]>([])
    const handleNext1 = () => {
        setIsNext(true)

        setActiveStep1((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack1 = () => {
        setActiveStep1((prevActiveStep) => prevActiveStep - 1);
    };

    const [client, setClient] = useState<Client>({} as Client);
    const [addressForm, setAddressForm] = useState<AddressCreate>({} as AddressCreate);
    const [company, setCompany] = React.useState<Company>({} as Company);
    let addresses: AddressInfo[] = [];
    const [addressList, setAddressList] = React.useState<AddressInfo[]>([])
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [DocumentInfo, setDocumentInfo] = useState<DocumentInfo>({} as DocumentInfo)
    const [director, setDirector] = useState<DirectorDetail>({} as DirectorDetail);
    const [uploadDocumentList, setUploadDocumentList] = useState<DocumentInfo[]>([]);
    const [directors, setDirectors] = useState<DirectorDetail[]>([]);
    let documensList: DocumentInfo[] = [];
    const classes = useStyles(props);
    let natureBusinessCompanies: NatureBusiness[] = [];
    const [selected, setselected] = useState<Boolean>(true);
    const [tabValue, setTabValue] = useState(0);
    const [value, setValue] = React.useState('0');
    const [activeStep, setActiveStep] = React.useState(0);
    const [founderOwner, setFounderOwner] = React.useState<FounderOwner>({} as FounderOwner);
    const [description, setDescription] = useState<String[]>([]);
    const [itemNatureBusiness, setItemNatureBusiness] = useState<NatureBusiness[]>([]);
    const [natureList, setNatureList] = useState<NatureBusiness[]>([]);
    const {t} = useTranslation('application');
    const steps = [t("BUSINESSDETAILS"), t("DIRECTOROWNER"), t("ADDRESSDETAILS"), t("DOCUMENTDETAILS")];
    const classes2 = useStyles2();
    const [desable,setDesable]=useState(false);
    const handleNext = () => {
        setTabValue(tabValue + 1)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const theme = useTheme();
    const handleBack = () => {
        setTabValue(tabValue - 1)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const deleteDirector = (key) => {
        const director = directors[key];
        directors.splice(directors.indexOf(director), 1);
        setDirectors([...directors]);
        console.log(director)

    };
    const handleReset = () => {
        setActiveStep(0);
    };
    useEffect(() => {
        if (routingData?.clientId) {
            api.getClient(routingData?.clientId).then(response => {
                setClient(response);
                const {founderOwner} = response;
                console.log(response);
                setFounderOwner(founderOwner);
            });
        } else {
            history.push("/clientapplist")
        }

    }, [])

    useEffect(() => {
        setItemNatureBusiness(itemNatureBusiness)
    }, [itemNatureBusiness])


    function handleSubmit(e) {
        setDesable(true);
        e.preventDefault();

        company.natureBusinesses = itemNatureBusiness;
        console.log(company)
        company.directorDetails = directors;
        client.company = company;
        client.addressList = addressList;
        api.createCompany(client).then(result => {
            // setCompanyId(result.id)
            // if (result.id) {
            //     setTabValue(tabValue + 1)
            // }
            history.push('/clientapplist')
        });
    }

    useEffect(()=>{console.log(directors)},[directors])

    return (

        <FusePageCarded
            header={
                client && (
                    <div className="flex flex-1 w-full items-center justify-between">
                        <div className="flex flex-1 flex-col items-center sm:items-start">
                            {/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
                            <Typography
                                className="normal-case flex items-center sm:mb-12"
                                component={Link}
                                role="button"
                                to="/clientapplist"
                                color="inherit"
                            >
                                <Icon className="text-20">
                                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                                </Icon>
                                <span className="mx-4">{t("CLIENTAPPLICATIONS")}</span>
                            </Typography>
                            {/*</FuseAnimate>*/}

                            <div className="flex flex-col min-w-0 items-center sm:items-start">
                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                {/*<Typography className="text-16 sm:text-20 truncate">*/}
                                {/*    {`Application ${routingData?.clientId}`}*/}
                                {/*</Typography>*/}
                                {/*</FuseAnimate>*/}

                                {/*<FuseAnimate animation="transition.slideLeftIn" delay={300}>*/}
                                <Typography className="text-14 sm:text-20 truncate" variant="caption">
                                    {client?.clientTypeEnum} {client?.agreementType == null}
                                </Typography>

                                {/*</FuseAnimate>*/}
                            </div>
                        </div>
                    </div>
                )
            }
            classes={{
                toolbar: 'p-0',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}

            contentToolbar={
                <Stepper className="w-full" alternativeLabel activeStep={activeStep} connector={<ColorlibConnector/>}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            }
            content={
                (

                    <div className="w-full">
                        <hr/>
                        <div className="p-16 sm:p-24 max-w-4xl">


                            <Div>
                                {tabValue === 0 && (
                                    <Div>
                                        <LimitedBusinessDetail formDetail={company}
                                                               handleNext={handleNext}
                                                               handleBack={handleBack}
                                                               onInput={data => setCompany(data)}
                                                               itemNatureBusiness={itemNatureBusiness}
                                                               natureList={natureList}
                                                               setItemNatureBusiness={setItemNatureBusiness}
                                                               setNatureList={setNatureList}
                                        ></LimitedBusinessDetail>
                                    </Div>
                                )}
                                {tabValue === 1 && (
                                    <Div>
                                        {directors?.length > 0 && (
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
                                                        {directors.map((row, key) => (
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

                                        <DirectorDetailForm directors={directors}
                                                            onInput={data => setDirectors([...directors, data])}
                                                            handleBack={handleBack} handleNext={handleNext}
                                                            formDetail={director}
                                                            setFormDetail={setDirector}></DirectorDetailForm>
                                    </Div>


                                )}
                                {tabValue === 2 && (
                                    <Div>
                                        <HomeAdresForm setAddressList={setAddressList} handleNext={handleNext}
                                                       handleBack={handleBack} formDetail={addressForm}
                                                       onInput={data => setAddressForm(data)}></HomeAdresForm>
                                    </Div>
                                )}
                                {/*{tabValue === 3 && (*/}
                                {/*    <Div>*/}
                                {/*        /!*<DirectorForm onInput={data => setDirectorDetail(data)}></DirectorForm>*!/*/}
                                {/*        <Button variant="contained" color="primary" type="submit"*/}
                                {/*       onClick={handleSubmit}>Create Company and Continue</Button>*/}
                                {/*    </Div>*/}
                                {/*)}*/}
                                {tabValue === 3 && (client.isExisting === true ? (
                                    <Div>
                                        <Div>
                                            <Div box columns={1} alignItems='center'>
                                                <Div justifyItems='center'>
                                                    <div className={classes1.root}>
                                                        <Stepper activeStep={activeStep1} orientation="vertical">
                                                            <Step>
                                                                <StepLabel>{t('COMPANYAUTHENTICATIONCODE')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"COMPANYAUTHENTICATIONCODE"}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             activeStep1={activeStep1}
                                                                                             setIsNext={setIsNext}
                                                                                             setDescription={setDescription}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>

                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('COMPANYUTR')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"COMPANYUTR"}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             activeStep1={activeStep1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             setIsNext={setIsNext}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             setDescription={setDescription}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('PAYEREGISTRATIAONLETTER')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"PAYE"}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             activeStep1={activeStep1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             setIsNext={setIsNext}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             setDescription={setDescription}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('VATACKNOWLEDGEMENT')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"VATACKNOWLEDGEMENT"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('EXPENSE')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"EXPENSE"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('LASTYEARENDACCOUNTS')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"LASTYEARENDACCOUNTS"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            {client.agreementType !== AgreementType.TRADING ? (
                                                                <Step>
                                                                    <StepLabel>{t('BRPCARDFRONTFACE')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"BRPFRONT"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            activeStep1={activeStep1}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            isNext={isNext}
                                                                            steps1={steps1}
                                                                            setIsNext={setIsNext}
                                                                            documentUploadList={documentUploadList}
                                                                            setDocumentUploadList={setDocumentUploadList}
                                                                            description={description}
                                                                            setDescription={setDescription}
                                                                            clientId={routingData?.clientId}
                                                                            setUploadDocumentList={setUploadDocumentList}
                                                                            uploadDocumentList={uploadDocumentList}
                                                                            onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}
                                                            {client.agreementType !== AgreementType.TRADING ? (
                                                                <Step>
                                                                    <StepLabel>{t('BRPCARDBACKFACE')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"BRPBACK"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            activeStep1={activeStep1}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            isNext={isNext}
                                                                            steps1={steps1}
                                                                            setIsNext={setIsNext}
                                                                            documentUploadList={documentUploadList}
                                                                            setDocumentUploadList={setDocumentUploadList}
                                                                            description={description}
                                                                            setDescription={setDescription}
                                                                            clientId={routingData?.clientId}
                                                                            setUploadDocumentList={setUploadDocumentList}
                                                                            uploadDocumentList={uploadDocumentList}
                                                                            onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}
                                                            {client.agreementType !== AgreementType.TRADING ? (
                                                                <Step>
                                                                    <StepLabel>{t('POLICEREGISTRATION')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"POLICEREGISTRATION"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            activeStep1={activeStep1}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            isNext={isNext}
                                                                            steps1={steps1}
                                                                            setIsNext={setIsNext}
                                                                            documentUploadList={documentUploadList}
                                                                            setDocumentUploadList={setDocumentUploadList}
                                                                            description={description}
                                                                            setDescription={setDescription}
                                                                            clientId={routingData?.clientId}
                                                                            setUploadDocumentList={setUploadDocumentList}
                                                                            uploadDocumentList={uploadDocumentList}
                                                                            onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}
                                                            {client.agreementType !== AgreementType.TRADING ? (
                                                                <Step>
                                                                    <StepLabel>{t('PASSPORT')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"PASSPORT"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            activeStep1={activeStep1}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            isNext={isNext}
                                                                            steps1={steps1}
                                                                            setIsNext={setIsNext}
                                                                            documentUploadList={documentUploadList}
                                                                            setDocumentUploadList={setDocumentUploadList}
                                                                            description={description}
                                                                            setDescription={setDescription}
                                                                            clientId={routingData?.clientId}
                                                                            setUploadDocumentList={setUploadDocumentList}
                                                                            uploadDocumentList={uploadDocumentList}
                                                                            onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}
                                                            {client.agreementType !== AgreementType.TRADING ? (
                                                                <Step>
                                                                    <StepLabel>{t('TC')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm documentType={"TC"}
                                                                                                 setIsSuccess={setIsSuccess}
                                                                                                 activeStep1={activeStep1}
                                                                                                 handleNext1={handleNext1}
                                                                                                 handleBack1={handleBack1}
                                                                                                 isNext={isNext}
                                                                                                 steps1={steps1}
                                                                                                 setIsNext={setIsNext}
                                                                                                 documentUploadList={documentUploadList}
                                                                                                 setDocumentUploadList={setDocumentUploadList}
                                                                                                 description={description}
                                                                                                 setDescription={setDescription}
                                                                                                 clientId={routingData?.clientId}
                                                                                                 setUploadDocumentList={setUploadDocumentList}
                                                                                                 uploadDocumentList={uploadDocumentList}
                                                                                                 onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}

                                                            {client.agreementType !== AgreementType.TRADING ? (

                                                                <Step>
                                                                    <StepLabel>{t('VISA')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm documentType={"VISA"}
                                                                                                 activeStep1={activeStep1}
                                                                                                 description={description}
                                                                                                 handleNext1={handleNext1}
                                                                                                 handleBack1={handleBack1}
                                                                                                 isNext={isNext}
                                                                                                 setIsNext={setIsNext}
                                                                                                 steps1={steps1}
                                                                                                 documentUploadList={documentUploadList}
                                                                                                 setDocumentUploadList={setDocumentUploadList}
                                                                                                 setDescription={setDescription}
                                                                                                 setIsSuccess={setIsSuccess}
                                                                                                 clientId={routingData?.clientId}
                                                                                                 setUploadDocumentList={setUploadDocumentList}
                                                                                                 uploadDocumentList={uploadDocumentList}
                                                                                                 onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>

                                                                    </StepContent>
                                                                </Step>
                                                            ) : ("")}
                                                        </Stepper>

                                                    </div>
                                                    <Div columns={2} className="self-end ">
                                                        <Button
                                                            variant="contained"
                                                            disabled={desable}
                                                            onClick={handleSubmit}
                                                        >
                                                            {t('SAVE')}
                                                        </Button>
                                                    </Div>
                                                </Div>

                                            </Div>

                                        </Div>
                                    </Div>
                                ) : (
                                    <Div>
                                        <Div>
                                            <Div box columns={1} alignItems='center'>
                                                <Div justifyItems='center'>
                                                    <div className={classes1.root}>
                                                        <Stepper activeStep={activeStep1} orientation="vertical">
                                                            <Step>
                                                                <StepLabel>{t('COMPANYAUTHENTICATIONCODE')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"COMPANYAUTHENTICATIONCODE"}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             activeStep1={activeStep1}
                                                                                             setIsNext={setIsNext}
                                                                                             setDescription={setDescription}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>

                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('COMPANYUTR')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"COMPANYUTR"}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             activeStep1={activeStep1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             setIsNext={setIsNext}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             setDescription={setDescription}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('PAYEREGISTRATIAONLETTER')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm documentType={"PAYE"}
                                                                                             setIsSuccess={setIsSuccess}
                                                                                             activeStep1={activeStep1}
                                                                                             handleNext1={handleNext1}
                                                                                             handleBack1={handleBack1}
                                                                                             isNext={isNext}
                                                                                             steps1={steps1}
                                                                                             setIsNext={setIsNext}
                                                                                             documentUploadList={documentUploadList}
                                                                                             setDocumentUploadList={setDocumentUploadList}
                                                                                             description={description}
                                                                                             setDescription={setDescription}
                                                                                             clientId={routingData?.clientId}
                                                                                             setUploadDocumentList={setUploadDocumentList}
                                                                                             uploadDocumentList={uploadDocumentList}
                                                                                             onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('VATACKNOWLEDGEMENT')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"VATACKNOWLEDGEMENT"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('EXPENSE')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"EXPENSE"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                            <Step>
                                                                <StepLabel>{t('LASTYEARENDACCOUNTS')}</StepLabel>
                                                                <StepContent>
                                                                    <DocumentCompanyInfoForm
                                                                        documentType={"LASTYEARENDACCOUNTS"}
                                                                        setIsSuccess={setIsSuccess}
                                                                        activeStep1={activeStep1}
                                                                        handleNext1={handleNext1}
                                                                        handleBack1={handleBack1}
                                                                        isNext={isNext}
                                                                        steps1={steps1}
                                                                        setIsNext={setIsNext}
                                                                        documentUploadList={documentUploadList}
                                                                        setDocumentUploadList={setDocumentUploadList}
                                                                        description={description}
                                                                        setDescription={setDescription}
                                                                        clientId={routingData?.clientId}
                                                                        setUploadDocumentList={setUploadDocumentList}
                                                                        uploadDocumentList={uploadDocumentList}
                                                                        onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>
                                                                </StepContent>
                                                            </Step>
                                                        </Stepper>

                                                    </div>
                                                    <Div columns={2} className="flex flex-end self-end">

                                                        <Button onClick={() => handleBack()}

                                                                variant="contained"
                                                                color="secondary">
                                                            {t("BACK")}
                                                        </Button>


                                                        <Button
                                                            variant="contained"
                                                            disabled={desable}
                                                            onClick={handleSubmit}
                                                        >
                                                            {t('SAVE')}
                                                        </Button>
                                                    </Div>
                                                </Div>

                                            </Div>

                                        </Div>
                                    </Div>))}

                                {/*// )}*/}
                                {/*{tabValue >= 1 && tabValue < 4 && (*/}
                                {/*    <Div>*/}
                                {/*        <Div columns={2}>*/}

                                {/*            <Button onClick={() => setTabValue(tabValue - 1)} variant="contained"*/}
                                {/*                    color="primary">*/}
                                {/*                Previous*/}
                                {/*            </Button>*/}
                                {/*            {companyId == null && tabValue == 3 ?*/}
                                {/*                <Button variant="contained" color="primary" type="submit"*/}
                                {/*                        onClick={handleSubmit}>Create Company and Continue</Button> :*/}
                                {/*                <Button type="submit" onClick={() => setTabValue(tabValue + 1)}*/}
                                {/*                        variant="contained"*/}
                                {/*                        color="primary">*/}
                                {/*                    Next*/}
                                {/*                </Button>*/}
                                {/*            }*/}

                                {/*        </Div>*/}
                                {/*    </Div>*/}
                                {/*)}*/}
                            </Div>
                        </div>
                    </div>
                )
            }
            innerScroll
        />


    );
}


export default LimitedApply;
