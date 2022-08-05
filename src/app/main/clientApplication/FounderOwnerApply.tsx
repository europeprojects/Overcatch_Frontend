import {createStyles, makeStyles, Theme, useTheme, withStyles} from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import history from '@history';
import BusinessCenter from '@material-ui/icons/BusinessCenter';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import CompanyInfoForm from "../components/CompanyInfoForm";
import {Step, StepConnector, StepContent, StepLabel, Stepper, Typography} from "@material-ui/core";
import {Div} from "app/components/Grid";
import clsx from 'clsx';
// import HomeAdresForm from "../../components/HomeAdresForm";
// import SoleTradeInfoForm from "../components/SoleTradeInfoForm";
// import IncorprationInfoForm from "../components/IncorprationInfoForm";
import {
    AddressCreate,
    AddressInfo,
    Client,
    DocumentInfo, DocumentUpload,
    FounderOwner,
    FounderOwnerBusiness,
} from "../../types/UserModel";
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from "@material-ui/core/Button";
// import BusinessAdresForm from "../../components/BusinessAdresForm";
// import DirectorForm from "../../components/DirectorForm";
import api from 'app/services/BackendApi';
import FounderOwnerDetail from "./components/FounderOwnerDetail";
import {Link} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import FounderOwnerDirector from "./components/FounderOwnerDirector";
import HomeAdresForm from "../components/HomeAdresForm";
import DocumentCompanyInfoForm from "../company/components/DocumentCompanyForm";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";

// import DocumentCompanyInfoForm from "../components/DocumentCompanyForm";

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
// const useStyles = makeStyles((theme) => ({
//
//     layoutRoot: {},
//     root: {
//         width: '100%',
//     },
//     heading: {
//         fontSize: theme.typography.pxToRem(15),
//         flexBasis: '33.33%',
//         flexShrink: 0,
//     },
//     secondaryHeading: {
//         fontSize: theme.typography.pxToRem(15),
//         color: theme.palette.text.secondary,
//     },
// }));

function getSteps1() {
    return ['BRP Document', 'Director / Owner', 'Address Details', 'Document Details'];
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

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Select campaign settings...';
        case 1:
            return 'What is an ad group anyways?';
        case 2:
            return 'This is the bit I really care about!';
        default:
            return 'Unknown step';
    }
}

function FounderOwnerPage(props: any) {
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

    const handleReset1 = () => {
        setActiveStep(0);
    };
    const [client, setClient] = useState<Client>({} as Client);
    // const [IncorprationInfo, setIncorprationInfo] = useState<IncorprationInfo>({} as IncorprationInfo);
    const [addressForm, setAddressForm] = useState<AddressCreate>({} as AddressCreate);
    const [founderOwnerBusiness, setFounderOwnerBusiness] = React.useState<FounderOwnerBusiness>({} as FounderOwnerBusiness);
    const [addressList, setAddressList] = React.useState<AddressInfo[]>([])
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isNext, setIsNext] = useState<boolean>(false);
    const [DocumentInfo, setDocumentInfo] = useState<DocumentInfo>({} as DocumentInfo);
    const [uploadDocumentList, setUploadDocumentList] = useState<DocumentInfo[]>([]);
    const [tabValue, setTabValue] = useState(0);
    //const [, setDocumentInfo] = useState<DocumentInfo>({} as DocumentInfo)
    const [value, setValue] = React.useState('0');
    // const formState = useState<CompanyInfo>({} as CompanyInfo);
    // const [form] = formState;
    const [expanded, setExpanded] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [founderOwner, setFounderOwner] = React.useState<FounderOwner>({} as FounderOwner);
    const [description, setDescription] = useState<String[]>([]);
    const {t} = useTranslation('application');

    const steps = [t("BUSINESSDETAILS"), t("OWNER"), t("ADDRESSDETAILS"), t("DOCUMENTDETAILS")];
    const classes2 = useStyles2();
    const handleNext = () => {
        setTabValue(tabValue + 1)
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const theme = useTheme();
    const handleBack = () => {
        setTabValue(tabValue - 1)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleFounderOwner = (data: FounderOwner) => {

    };
    const handleReset = () => {
        setActiveStep(0);
    };
    useEffect(() => {
        if (routingData?.clientId) {
            api.getClient(routingData?.clientId).then(response => {
                setClient(response);
                const {company, addressList, customerClients, directorDetails, founderOwner, documents} = response;
                console.log(response);
                setFounderOwner(founderOwner);
                // setCustomerClients(customerClients);
                // setDirectorDetails(directorDetails);
                // setDocumentsList(documents)
                // if(founderOwner!=null){
                //     setsoleTraderCompany(founderOwner);
                // }
                // else{
                //     setCompany(company)
                // }
                //
                // customerClients.map(response=>{
                //     setUsers([...users,response.userInfo]);
                // });
                //
                // setAddressList(addressList);
            });
        } else {
            history.push("/clientapplist")
        }

    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        founderOwner.id = client.founderOwner.id;
        // directors.push(DirectorDetail);
        founderOwner.tradeAsName = founderOwnerBusiness.tradeAsName;
        founderOwner.businessEmail = founderOwnerBusiness.businessEmail;
        founderOwner.phoneNumber = founderOwnerBusiness.phoneNumber;
        founderOwner.vatNumber = founderOwnerBusiness.vatNumber;
        founderOwner.eoriNumber = founderOwnerBusiness.eoriNumber;
        founderOwner.payeNumber = founderOwnerBusiness.payeNumber;
        client.founderOwner = founderOwner;
        client.addressList = addressList;
        console.log(client)
        // HomeAddress.addressType = AddressType.HOME;
        // BusinessAddress.addressType = AddressType.BUSINESS;
        // addresses.push(HomeAddress);
        // addresses.push(BusinessAddress);
        // CompanyInfo.directorDetails = directors;
        // if (!selected) {
        //     CompanyInfo.companyType = CompanyType.INCORPRATION;
        //     // CompanyInfo.incorprationCompany = IncorprationInfo;
        // }
        // if (selected) {
        //     CompanyInfo.companyType = CompanyType.SOLETRADER;
        //     CompanyInfo.founderOwner = founderOwner;
        // }
        // CompanyInfo.addressList = addresses;
        // CompanyInfo.documents = documensList;

        //console.log(CompanyInfo);
        api.createCompany(client).then(result => {
            // setCompanyId(result.id)
            // if (result.id) {
            //     setTabValue(tabValue + 1)
            // }
            history.push('/clientapplist')
        });
    }

    useEffect(() => {
        console.log(documentUploadList)
    }, [documentUploadList])

    function handleChangeTab(event, value) {
        setTabValue(value);
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

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
                                        <FounderOwnerDetail formDetail={founderOwnerBusiness} handleNext={handleNext}
                                                            handleBack={handleBack}
                                                            onInput={data => setFounderOwnerBusiness(data)}></FounderOwnerDetail>
                                    </Div>
                                )}
                                {tabValue === 1 && (
                                    <Div>
                                        <FounderOwnerDirector onInput={data => setFounderOwner(data)}
                                                              handleBack={handleBack} handleNext={handleNext}
                                                              formDetail={founderOwner} client={client}></FounderOwnerDirector>

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
                                {tabValue === 3 && (
                                    client.isExisting == true ? (
                                        <Div>
                                            <Div>
                                                <Div box columns={1} alignItems='center'>
                                                    <Div justifyItems='center'>
                                                        <div className={classes1.root}>
                                                            <Stepper activeStep={activeStep1} orientation="vertical">
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
                                                                <Step>
                                                                    <StepLabel>{t('UTILITYBILL')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"UTILITYBILL"}
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

                                                                    <StepLabel>{t('DRIVINGLICENCE')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"DIRIVINGLICENCE"}
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
                                                                <Step>
                                                                    <StepLabel>{t('NINO')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"NINO"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            isNext={isNext}
                                                                            activeStep1={activeStep1}
                                                                            setIsNext={setIsNext}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            steps1={steps1}
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
                                                                    <StepLabel>{t('UTR')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"UTR"}
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
                                                                    <StepLabel>{t('LASTTAXRETURN')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm documentType={"TAXRETURN"}
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
                                                                {/*<Step>*/}
                                                                {/*    <StepLabel>Personal UTR</StepLabel>*/}
                                                                {/*    <StepContent>*/}
                                                                {/*        <DocumentCompanyInfoForm*/}
                                                                {/*            documentType={"PERSONALUTR"}*/}
                                                                {/*            setIsSuccess={setIsSuccess}*/}
                                                                {/*            activeStep1={activeStep1}*/}
                                                                {/*            handleNext1={handleNext1}*/}
                                                                {/*            handleBack1={handleBack1}*/}
                                                                {/*            isNext={isNext}*/}
                                                                {/*            steps1={steps1}*/}
                                                                {/*            setIsNext={setIsNext}*/}
                                                                {/*            documentUploadList={documentUploadList}*/}
                                                                {/*            setDocumentUploadList={setDocumentUploadList}*/}
                                                                {/*            description={description}*/}
                                                                {/*            setDescription={setDescription}*/}
                                                                {/*            clientId={routingData?.clientId}*/}
                                                                {/*            setUploadDocumentList={setUploadDocumentList}*/}
                                                                {/*            uploadDocumentList={uploadDocumentList}*/}
                                                                {/*            onInput={data => setDocumentInfo(data)}></DocumentCompanyInfoForm>*/}
                                                                {/*    </StepContent>*/}
                                                                {/*</Step>*/}
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
                                                                disabled={activeStep1 === 7}
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
                                                                <Step>
                                                                    <StepLabel>{t('UTILITYBILL')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"UTILITYBILL"}
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

                                                                    <StepLabel>{t('DRIVINGLICENCE')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"DIRIVINGLICENCE"}
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
                                                                <Step>
                                                                    <StepLabel>{t('NINO')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"NINO"}
                                                                            setIsSuccess={setIsSuccess}
                                                                            isNext={isNext}
                                                                            activeStep1={activeStep1}
                                                                            setIsNext={setIsNext}
                                                                            handleNext1={handleNext1}
                                                                            handleBack1={handleBack1}
                                                                            steps1={steps1}
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
                                                                    <StepLabel>{t('UTR')}</StepLabel>
                                                                    <StepContent>
                                                                        <DocumentCompanyInfoForm
                                                                            documentType={"UTR"}
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
                                                            </Stepper>

                                                        </div>
                                                        <Div columns={2} className="self-end">
                                                            <Button onClick={() => handleBack()}

                                                                    variant="contained"
                                                                    color="secondary">
                                                                {t("BACK")}
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                disabled={activeStep1 === 5}
                                                                onClick={handleSubmit}
                                                            >
                                                                {t("SAVE")}
                                                            </Button>
                                                        </Div>
                                                    </Div>

                                                </Div>

                                            </Div>
                                        </Div>

                                    )

                                )}
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


export default FounderOwnerPage;
