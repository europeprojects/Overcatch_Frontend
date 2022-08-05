//
//
//
//
//
//
//
//
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//
// const useStyles = makeStyles((theme) => ({
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
//
//
//
//
// export default function ControlledAccordions() {
//     const classes = useStyles();
//     const [expanded, setExpanded] = React.useState(false);
//
//     const handleChange = (panel) => (event, isExpanded) => {
//         setExpanded(isExpanded ? panel : false);
//     };

//
//     return (
//         <div className={classes.root}>
//             <Accordion onChange={handleChange('panel1')}>
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="panel1bh-content"
//                     id="panel1bh-header"
//                 >
//                     <Typography className={classes.heading}>Bank</Typography>
//                     <Typography className={classes.secondaryHeading}>I am an accordion</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <Typography>
//                         Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
//                         maximus est, id dignissim quam.
//                     </Typography>
//                 </AccordionDetails>
//             </Accordion>
//             <Accordion  onChange={handleChange('panel2')}>
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="panel2bh-content"
//                     id="panel2bh-header"
//                 >
//                     <Typography className={classes.heading}>Visa</Typography>
//                     <Typography className={classes.secondaryHeading}>
//                         You are currently not an owner
//                     </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <Typography>
//                         Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
//                         diam eros in elit. Pellentesque convallis laoreet laoreet.
//                     </Typography>
//                 </AccordionDetails>
//             </Accordion>
//             <Accordion  onChange={handleChange('panel3')}>
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="panel3bh-content"
//                     id="panel3bh-header"
//                 >
//                     <Typography className={classes.heading}>UTR</Typography>
//                     <Typography className={classes.secondaryHeading}>
//                         Filtering has been entirely disabled for whole web server
//                     </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <Typography>
//                         <div>
//                             <input type="file" onChange={onFileChange} />
//                             <button onClick={onFileUpload}>
//                                 Upload!
//                             </button>
//                         </div>
//                     </Typography>
//                 </AccordionDetails>
//             </Accordion>
//             <Accordion  onChange={handleChange('panel4')}>
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="panel4bh-content"
//                     id="panel4bh-header"
//                 >
//                     <Typography className={classes.heading}>Personal data</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <Typography>
//                         Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
//                         vitae egestas augue. Duis vel est augue.
//                     </Typography>
//                 </AccordionDetails>
//             </Accordion>
//         </div>
//     );
// }


// import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    createStyles,
    LinearProgress,
    makeStyles, StepContent,
    TextareaAutosize,
    TextField,
    TextFieldProps,
    Theme, Typography
} from "@material-ui/core";
import {Div} from "app/components/Grid";
import React, {useEffect, useMemo, useState} from "react";
import {Company, DocumentClass, DocumentInfo, DocumentUpload, FileUploadResult} from "../../../types/UserModel";
import api from "../../../services/BackendApi";
import {useForm} from "../../../../@fuse/hooks";
import {isValidErrorResponse} from "app/utils/utils";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import {useTranslation} from "react-i18next";


export type DocumentFormProps = {
    onInput: (form: DocumentInfo) => void
    documentType: string
    setIsSuccess: any
    setUploadDocumentList: any
    uploadDocumentList: any
    clientId: number
    description:any
    setDescription:any
    documentUploadList:any
    setDocumentUploadList:any
    isNext:boolean
    setIsNext:any
    activeStep1:any
    steps1:any
    handleBack1:any
    handleNext1:any
}

export default function DocumentCompanyInfoForm({onInput,activeStep1,steps1, documentType,handleBack1,handleNext1, setIsSuccess, setUploadDocumentList, uploadDocumentList,clientId}: DocumentFormProps) {
    const formState = useState<DocumentInfo>({} as DocumentInfo);
    const [documentUpload,setDocumentUpload]=useState<DocumentUpload>({} as DocumentUpload)
    const [progress, setProgress] = React.useState(0);
    // const {formUpload, handleChange, setFormUpload} = useForm(null);
    const [error, setError] = useState<string>('')
    const [fileDescription, setFileDescription] = React.useState<string>(null);
    const [document, setCompanyInfo] = useState<DocumentClass>({} as DocumentClass);
    const [documentId, setDocumentId] = React.useState<number>(null);
    const [responseFile, setResponseFile] = React.useState<FileUploadResult>(null);
    const [file, setFile] = React.useState<File>(null);
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
        }),
    );

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };
    // useEffect(() => {
    //     console.log(fileDescription)
    //     //console.log(form);
    //
    // }, [fileDescription]);
    // useEffect(() => {
    //     if(isNext && activeStep1==number){
    //
    //         setIsNext(false)
    //         document.id=parseInt(responseFile?.processId);
    //         console.log(document)
    //         console.log(isNext)
    //         // api.updateDocument(document).then((data) => {
    //         //     // setError("Başarılı")
    //         //     // setResponseFile(data);
    //         // }).catch(err => {
    //         //     if (isValidErrorResponse(err)) {
    //         //         setError(err.response.data.message)
    //         //     } else {
    //         //         setError("Service error");
    //         //     }
    //         // });
    //     }
    // }, [isNext]);

    useEffect(() => {
        console.log("responseFile")
        document.id=parseInt(responseFile?.processId);
        console.log(responseFile)
        //console.log(form);

    }, [responseFile]);
    const [form] = formState;

    useEffect(() => {
        onInput(form)

    }, [form]);
    // useEffect(() => {
    //     if(documentUpload){
    //         setDocumentUploadList([...documentUploadList,documentUpload])
    //     }
    //
    // }, [documentUpload]);
    useEffect(() => {
        setDocumentUpload({...documentUpload,documentType:documentType})

    }, []);
    useEffect(() => {

        console.log(documentUpload)

    }, [documentUpload]);
    // function handleUploadChange(e) {
    //     const file = e.target.files[0];
    //     if (!file) {
    //         return;
    //     }
    //     const reader = new FileReader();
    //     reader.readAsBinaryString(file);
    //
    //
    //
    //     reader.onerror = () => {
    //         console.log('error on load image');
    //     };
    // }

    function handleUploadChange(e) {
        setProgress(0)
        e.preventDefault();
        const document = new DocumentClass;
        document.documentName = "form.documentName";
        document.fileName = "form.fileName";


        const file = e.target.files[0];
        setFile(e.target.files[0]);
        // setDocumentUpload({...documentUpload,file:e.target.files})
        if (!file) {
            return;

        }
        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        // setUploadDocumentList([...uploadDocumentList, document])

        api.uploadDocumentData1(file, documentType,clientId,document.fileDescription,progressCallback).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            setIsSuccess(true)
            // console.log(data)
            console.log(parseInt(data.processId))
            setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });

        console.log(file);


    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        document.fileDescription=event.target.value;
        // setFileDescription(event.target.value)
    };
    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value=null;
        setProgress(0)
        // setFileDescription(event.target.value)
    };
    function saveDocument(){
        if(file)
        {
        api.updateDocument(document).then((data) => {
            setError("Başarılı")
            setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });}
        handleNext1()
    }
    // function handleSubmit(model:UserDTO) {
    //     // UserService.addUser(model).then(result => {
    //     //     history.push('/users')
    //     // });
    //     model.userType=UserType.CUSTOMER;
    //     const data=null;
    //
    //     api.createUser(model).then(
    //         result => {
    //             history.push('/users')
    //         });
    //
    //     // if(data!=null){
    //     //     console.log(data);
    //     //     history.push('/users')
    //     // }
    // }
    const {t} = useTranslation('companyApplications');
    return (
        <Div>
            <Div  columns={2} justifySelf="flex-start">
                <Div columns={1}>
                    <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                        <input
                            type="file"
                            onClick={event => handleChange2}
                            onChange={handleUploadChange}
                        />
                    </div>
                </Div>
            </Div>
            <Div columns={1} className="self-end">
                <LinearProgress variant="determinate" color={progress===100 ? "secondary":"primary"} value={progress} />
            </Div>
            <hr/>
            <Div >
                <Typography>
                    {t("FILEDESCRIPTION")}
                </Typography>
                <Div columns={1}>

                    <TextField
                        id="outlined-multiline-flexible"
                        multiline
                        // value={fileDescription}
                        onChange={handleChange}
                        rows={3}
                        rowsMax={4}
                        variant={"outlined"}
                    />
                </Div>
            </Div>
            <Div columns={2} className="my-16 flex flex-end self-end">
                <Button
                    disabled={activeStep1 === 0}
                    onClick={handleBack1}
                >
                    {t("BACK")}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>saveDocument()}
                >
                    {activeStep1 === steps1.length - 1 ? t('NEXT') : t('NEXT')}
                </Button>
            </Div>
            {/*<Div>*/}
            {/*    <Button variant="contained" color="primary" onClick={saveDocument}>*/}
            {/*        Save Documents*/}
            {/*    </Button>*/}
            {/*</Div>*/}
        </Div>
    )
};


function FormTextField(
    {formState, field, ...props}:
        TextFieldProps & { formState: any, field: string }
) {
    const [state, dispatch] = formState;
    // Performans sorunu olduğu için onChange yerine onBlur'da state güncellemesi yapıyoruz.
    return (
        <TextField  {...props} onBlur={e => dispatch({...state, [field]: e.target.value})}/>
    )
}
