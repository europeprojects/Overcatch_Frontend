
import {
    Button,
    createStyles,
    LinearProgress,
    makeStyles,
    TextField,
    TextFieldProps,
    Theme,
    Typography
} from "@material-ui/core";
import {Div} from "app/components/Grid";
import React, {useEffect, useMemo, useState} from "react";
import {DocumentClass, DocumentInfo, FileUploadResult} from "../../../types/UserModel";
import api from "../../../services/BackendApi";
import {useForm} from "../../../../@fuse/hooks";
import {isValidErrorResponse} from "app/utils/utils";
import {TextFieldFormsy} from "../../../../@fuse/core/formsy";
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {useTranslation} from "react-i18next";

export type DocumentFormProps = {
    onInput: (form: DocumentInfo) => void
    documentType: string
    setIsSuccess: any
    setUploadDocumentList: any
    uploadDocumentList: any
}
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}
export default function DocumentInfoForm({onInput, documentType, setIsSuccess, setUploadDocumentList, uploadDocumentList}: DocumentFormProps) {
    const formState = useState<DocumentInfo>({} as DocumentInfo);
    const [progress, setProgress] = React.useState(0);
    // const {formUpload, handleChange, setFormUpload} = useForm(null);
    const [error, setError] = useState<string>('')
    const companyId = useSelector(({ company }) => company.currentCompanyId);
    const [currentCompanyId,setCurrentCompanyId]=React.useState(companyId);
    const [document, setCompanyInfo] = useState<DocumentClass>({} as DocumentClass);
    const [documentId, setDocumentId] = React.useState<number>(null);
    const [responseFile, setResponseFile] = React.useState<FileUploadResult>(null);
    const [openToast, setOpenToast] = React.useState(false);
    const {t} = useTranslation('task');
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 200,
            },
        }),
    );
    useEffect(() => {
        // console.log(companyId)
        setCurrentCompanyId(companyId);

    }, [companyId]);
    useEffect(() => {
        // console.log("responseFile")
        document.id=parseInt(responseFile?.processId);
        // console.log(responseFile)
        //console.log(form);

    }, [responseFile]);
    const [description,setDescription]=useState({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        document.fileDescription=event.target.value;
         setDescription(event.target.value);
    };

    // useEffect(() => {
    //     console.log("Current")
    //     console.log(currentCompanyId)
    //     // setCurrentCompanyId(companyId);
    // }, [currentCompanyId]);
    useEffect(()=> {
        console.log(document)
    }, [document]);

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const [form] = formState;
    useEffect(() => {
        onInput(form) 

    }, [form]);
    useEffect(() => {
        onInput(form) 

    }, [form]);

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
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };
    // function handleUploadChange(e) {
    //
    //
    //     e.preventDefault();
    //
    //     const document = new DocumentClass;
    //     document.documentName = "form.documentName";
    //     document.fileName = "form.fileName";
    //     const file = e.target.files[0];
    //     if (!file) {
    //         return;
    //
    //     }
    //     let progressCallback = (loaded: number, total: number) => {
    //         setProgress(Math.round((loaded / total) * 100))
    //     };
    //
    //     console.log(currentCompanyId)
    //     setUploadDocumentList([...uploadDocumentList, document])
    //
    //     api.uploadDocumentData1(file, documentType,companyId, document.fileDescription, progressCallback).then((data) => {
    //         // history.push('/documentcreate' )
    //         // history.go(0)
    //         setIsSuccess(true)
    //         setResponseFile(data);
    //     }).catch(err => {
    //         if (isValidErrorResponse(err)) {
    //             setError(err.response.data.message)
    //         } else {
    //             setError("Service error");
    //         }
    //     });
    //
    //     console.log(file);
    //
    //
    // }

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

    function saveDocument(e){
        // console.log(fileDescription)
        e.preventDefault();
        const document = new DocumentClass;
        document.documentName = "form.documentName";
        document.fileName = "form.fileName";
        //@ts-ignore
        document.fileDescription = description;
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        // console.log(currentCompanyId)
        setUploadDocumentList([...uploadDocumentList, document])

        api.uploadDocumentData1(file, documentType,companyId, document.fileDescription, progressCallback).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            setIsSuccess(true)
            setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });
        api.updateDocument(document).then((data) => {
            // history.push('/documentcreate' )
            // history.go(0)
            setIsSuccess(true)
            setOpenToast(true)
            // console.log(data)
            // console.log(parseInt(data.processId))
            setResponseFile(data);
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });
    }
    return useMemo(() => (
        <Div>
            <Div  columns={3} justifySelf="flex-start">
                <Div columns={1}>
                    <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                        <input
                            type="file"
                            // onChange={handleUploadChange}
                        />
                    </div>
                </Div>
                <Div columns={1}>
                    <LinearProgress variant="determinate" color={progress===100 ? "secondary":"primary"} value={progress} />
                </Div>
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
                        value={(e)=>e.target.value}
                        onChange={handleChange}
                        rows={3}
                        rowsMax={4}
                        variant={"outlined"}
                        inputProps={{ maxLength: 12 }}
                        required
                    />
                </Div>
            </Div>
            <Div>
                <Button variant="contained" color="primary" onClick={saveDocument}>
                    {t("SAVEDOCUMENT")}
                </Button>
            </Div>

        </Div>
    ), [form, progress, setIsSuccess, uploadDocumentList])
};

//
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
