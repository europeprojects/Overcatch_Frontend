import React, {useEffect, useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {DocumentClass, DocumentUpload} from "../../../types/UserModel";
import {Div} from "../../../components/Grid";
import {LinearProgress, TextField, Typography} from "@material-ui/core";
import api from "../../../services/BackendApi";
import {isValidErrorResponse} from "../../../utils/utils";
import {useSelector} from 'react-redux';
import {withSnackbar} from "notistack";
import moment from "moment";
import {useTranslation} from "react-i18next";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            width: 'fit-content',
        },
        formControl: {
            marginTop: theme.spacing(2),
            minWidth: 120,
        },
        formControlLabel: {
            marginTop: theme.spacing(1),
        },
    }),
);

export type UploadDialogProps = {
    open: any,
    setOpen: any
}

function UploadDialog(props) {
//@ts-ignore
//     const routingData = history.location.displayRouteData;
    const {open,setOpen} = props;
    const clientId = useSelector(({company}) => company.currentCompanyId);
    // const classes = useStyles();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');
    const [progress, setProgress] = React.useState(0);
    const [document, setDocument] = useState<DocumentClass>({} as DocumentClass);
    const [file, setFile] = React.useState<File>(null);
    const [error, setError] = useState<string>('');
    const [documentType, setDocumentType] = useState<string>('none');
    // const [clientId, setClientId]=useState<number>();
    const [disabled, setDisabled] = useState(false);
    const [documentUpload, setDocumentUpload] = useState<DocumentUpload>({} as DocumentUpload);
    const [uploadDocument, setUploadDocument] = useState<DocumentUpload>()
    const {t} = useTranslation('task');
    const [description, setDescription] = useState<String>("");


    const handleClose = () => {
        setOpen(false);
        setDocument({} as DocumentClass)
        setDocumentType("none")
        setProgress(0)
        setFile(null)
    };


    const handleDocumentType = (event) => {
        setDocumentType(event.target.value)
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setDocumentUpload({...documentUpload, file: event.target.files[0]})

    }
    // const handleMaxWidthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setMaxWidth(event.target.value as DialogProps['maxWidth']);
    // };
    //
    // const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setFullWidth(event.target.checked);
    // };

    const handleChange = (event) => {
        setDescription(event.target.value)
        // setDocumentUpload({...documentUpload, description: event.target.value})
        // document.fileDescription = event.target.value;
        // setFileDescription(event.target.value)
        console.log(documentUpload)
    };

    const handleChange2 = (event) => {
        event.target.value = null;
        setProgress(0)
        // setFileDescription(event.target.value)
        // console.log(document)

    };

    // useEffect(())
    const saveDocument = (event) => {
        setProgress(0)
        if (!documentUpload) {
            return;
        }
        let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
            setDisabled(true)
        };

        api.uploadDocumentData1(file, documentType, clientId, description, progressCallback).then((data) => {
            setDocument({...document, ["id"]: parseInt(data.processId)})
            console.log(parseInt(data.processId))
        }).catch(err => {
            if (isValidErrorResponse(err)) {
                setError(err.response.data.message)
            } else {
                setError("Service error");
            }
        });
        // if (file) {
        //     api.updateDocument(document).then((data) => {
        //         setError("Başarılı")
        //         // setResponseFile(data);
        //     }).catch(err => {
        //         if (isValidErrorResponse(err)) {
        //             setError(err.response.data.message)
        //         } else {
        //             setError("Service error");
        //         }
        //     });
        // }
    }

    useEffect(() => {
        console.log(progress)
        if (progress === 100) {
            props.enqueueSnackbar(<h4>Success</h4>, {
                variant: 'success',
            });
            setTimeout(function () {
                setOpen(false);
                setDisabled(false)

            }, 2000);
        }
    }, [progress])

    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">
                    <Select
                        className="my-16"
                        label="New / Exist"
                        value={documentType}
                        name="isExisting"
                        variant="outlined"
                        onChange={handleDocumentType}
                    >
                        <MenuItem value="none">
                            <em>{t("PLEASESELECT")}</em>
                        </MenuItem>
                        <MenuItem value="BANK">Bank</MenuItem>
                        <MenuItem value="VISA">Visa</MenuItem>
                        <MenuItem value="UTR">UTR</MenuItem>
                        <MenuItem value="NINO">NINO</MenuItem>
                        <MenuItem value="PAYE">PAYE</MenuItem>
                        <MenuItem value="BRPCARD">BRP</MenuItem>
                        <MenuItem value="PASSPORT">Passport</MenuItem>
                        <MenuItem value="TC">TC</MenuItem>
                        <MenuItem value="POLICEREGISTRATION">Police Registration</MenuItem>
                        <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                        <MenuItem value="PERSONALUTR">Personal UTR</MenuItem>
                        <MenuItem value="COMPANYUTR">Company UTR</MenuItem>
                        <MenuItem value="CERTIFICATE">Certificate</MenuItem>
                        <MenuItem value="SHARECERTS">Sharecerts</MenuItem>
                        <MenuItem value="MERMARTS">MERMARTS</MenuItem>
                        <MenuItem value="VATCERTIFICATE">VAT Certificate</MenuItem>
                        <MenuItem value="BRPFRONT">BRP Card Front Face</MenuItem>
                        <MenuItem value="BRPBACK">BRP Card Back Face</MenuItem>
                        <MenuItem value="DRIVINGLICENCE">Driving Licence</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                    </Select></DialogTitle>
                <DialogContent>
                    {documentType === "none" ? ("") : (
                        <Div>
                            <Div className="w-full" columns={2} justifySelf="flex-start">
                                <Div columns={1} className="h-full">
                                    <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
                                        <input
                                            lang="en"
                                            type="file"
                                            accept= ".pdf, .jpeg, .jpg, .png"
                                            onClick={handleChange2}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </Div>
                                <Div columns={1} className="self-end h-full">
                                    <LinearProgress variant="determinate"
                                                    color={progress === 100 ? "secondary" : "primary"}
                                                    value={progress}/>
                                </Div>
                            </Div>

                            <hr/>
                            <Div>
                                <Typography>
                                    {t("FILEDESCRIPTION")}
                                </Typography>
                                <Div columns={1}>

                                    <TextField
                                        id="outlined-multiline-flexible"
                                        multiline
                                        value={document.fileDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        rowsMax={4}
                                        variant={"outlined"}
                                    />
                                </Div>
                            </Div>

                            <Div>
                                <Button variant="contained" color="primary"
                                        onClick={saveDocument} disabled={disabled}>
                                    {t("SAVEDOCUMENT")}
                                </Button>
                            </Div>
                        </Div>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        {t("CLOSE")}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}


export default withSnackbar(UploadDialog);