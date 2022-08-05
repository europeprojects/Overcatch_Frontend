import React, { useEffect, useState } from "react";
import { Node } from "slate";
import LetterTypeSelector from "../components/LetterTypeSelector";
import FusePageSimple from "../../../../@fuse/core/FusePageSimple/FusePageSimple";
import {
    createStyles,
    makeStyles,
    Theme,
    withStyles,
    WithStyles,
} from "@material-ui/core/styles";
import LetterEditComponent from "../components/LetterEditComponent";
import api from "../../../services/BackendApi";
import { LetterType } from "../../../types/UserModel";
import {
    Button, Checkbox,
    DialogContentText,
    Grid,
    Paper,
    Slide,
    TextField,
    Typography,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import history from "@history";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import Dialog from "@material-ui/core/Dialog";
import { TransitionProps } from "@material-ui/core/transitions";
import { string,number } from "prop-types";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { setIn } from 'formik';
import { useHistory } from 'react-router-dom';
import {Label} from "@material-ui/icons";
import {Div} from "../../../components/Grid";
import {Alert} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import CustomDialog from "../components/CustomDialog";
import PdfComponent from "../components/PdfComponent";
import {backgroundColor} from "html2canvas/dist/types/css/property-descriptors/background-color";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    layoutRoot: {},
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme: Theme) =>
  createStyles({
      root: {
          margin: 0,
          padding: theme.spacing(2),
      },
      closeButton: {
          position: "absolute",
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: theme.palette.grey[500],
      },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
                <CloseIcon />
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

function LetterEmployee(props) {
    const classes = useStyles(props);
    const { t } = useTranslation("letter");
    const {isReadOnly} = props

    const history = useHistory();

    const [letter, setLetter] = useState({
        id : null,
        letterTemplate: SampleInitialValue,
        letterTypeName: "",
        clientType: "",
        userRole: ""
    })


    const [open2, setOpen2] = React.useState(false);

    const handleClose2 = () => {
        setOpen2(false);
        // setTimeout(function () {
        //     window.location = window.location;
        // }, 100);
    };

    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    const [letterTypeList, setLetterTypeList] = useState([]);

    const [letterTypeName, setLetterTypeName] = useState("");

    const userRoleList = ["MANAGER", "CLIENT", "EMPLOYEE"]
    const clientTypeList = ["LIMITED", "SOLETRADE", "SELFASSESMENT"]
    const [userRole, setUserRole] = useState([]);
    const [clientType, setClientType] = useState([]);
    const [openAlert, setOpenAlert] = useState(false)
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleChangeNew = (e) => {
        setLetter({
            ...letter, [e.target.name] : e.target.value
        })
    }

    const handleChangeEditor = (value) => {
        setLetter({
            ...letter, letterTemplate : value
        })
    }

    const handleChangeName = (e) =>{
        setLetterTypeName(e.target.value);
        const found = letterTypeList.find(item=>item.letterTypeName === e.target.value);
        if(found)
        api.getLetterTypeByID(found?.id).then(r=>{
            setLetter({...found,  letterTemplate : r })
            setUserRole(found?.userRole?.includes(",") ? found?.userRole?.split(",") : oldSelected => [...oldSelected,found.userRole ])
            setClientType(found?.clientType?.includes(",") ? found?.clientType?.split(",") : oldSelected => [...oldSelected,found.clientType ])
        })
    }

    function handleChangeCheckBoxUser(event, checked){
        let arr = userRole
        if(checked){
            arr.push(event.target.value)
            setUserRole(arr)
        }
        else{
            arr.splice(arr.indexOf(event.target.value), 1)
            setUserRole(arr)
        }
        setLetter({
            ...letter, [event.target.name] : arr.toString()
        })
    }

    function handleChangeCheckBoxClient(event, checked){
        let arr = clientType
        if(checked){
            arr.push(event.target.value)
            setClientType(arr)
        }
        else{
            arr.splice(arr.indexOf(event.target.value), 1)
            setClientType(arr)
        }
        setLetter({
            ...letter, [event.target.name] : arr.toString()
        })
    }

    const handleSubmit = (e) =>{

        if(letter?.userRole.length < 1 || letter?.clientType.length < 1)
            return setOpenAlert(true)

        const saveLetter = {
            ...letter,
            letterTemplate: window.btoa(unescape(encodeURIComponent(JSON.stringify(letter.letterTemplate))))
        }
        console.log(letter)
        if(letter.letterTypeName){
            api.saveLetterType(saveLetter).then((r) => {
                console.log(r);
                props.enqueueSnackbar(<h4>{t('TEMPLATESAVED')}</h4>, {
                    variant: "success",
                });
                history.push("/letter-templates")
            });

        } else {
            props.enqueueSnackbar(<h4>{t('TEMPLATEBLANK')}</h4>, {
                variant: "error",
            });
        }

    }

    useEffect(()=>{

        if(props.letter?.id){
            console.log(props.letter)
            setLetter(props.letter);
            setUserRole(props.letter?.userRole?.includes(",") ? props.letter?.userRole?.split(",") : oldSelected => [...oldSelected,props.letter.userRole ])
            setClientType(props.letter?.clientType?.includes(",") ? props.letter?.clientType?.split(",") : oldSelected => [...oldSelected,props.letter.clientType ])
        }
    },[props.letter])

    function handleDelete() {
        api.deleteLetterByID(props.letter?.id).then( res =>
            history.push("/letter-templates")
        )
        setOpen2(false)
    }

    function handleCloseAlert() {
        setOpenAlert(false)
    }

    function handleClickPreview() {
        setOpenDialog(true)
    }

    return (
      <FusePageSimple
        classes={{
            root: classes.layoutRoot,
        }}
        header={
            <div className="p-24" style={{ textAlign: "center" }}>
                <h4>{t("LETTERPAGE")}</h4>
            </div>
        }
        content={
            <div style={{ padding: "50px" }}>
                <div>
                    <Grid direction="row" item xs={12}>
                        <TextField
                            required={true}
                            id="outlined-basic"
                            label={t("TEMPLATENAME")}
                            name="letterTypeName"
                            variant="outlined"
                            className="w-full my-10"
                            value={letter.letterTypeName}
                            onChange={handleChangeNew}
                        />
                        <div className="w-full my-16">
                                {t("SELECTUSERROLEFORTEMPLATE")}
                                <div className="flex justify-start">
                                    {userRoleList.map(user1 => (
                                        <label className={"inline-block"}>{user1}
                                            <Checkbox
                                                name="userRole"
                                                value={user1}
                                                checked={userRole.includes(user1)}
                                                onChange={(event, checked) => handleChangeCheckBoxUser(event, checked)}
                                            />
                                        </label>
                                    ))}
                            </div>
                            </div>

                        <div className="w-full my-16">
                            <div>
                                {t("SELECTCLIENTTYPEFORTEMPLATE")}
                                <Div className="flex justify-start">
                                    {clientTypeList.map(clientType1 => (
                                        <label className={"inline-block"}>{clientType1}
                                            <Checkbox
                                                name="clientType"
                                                value={clientType1}
                                                checked={clientType.includes(clientType1) ? true : false}
                                                onChange={(event, checked) => handleChangeCheckBoxClient(event, checked)}
                                            />
                                        </label>
                                    ))}
                            </Div>
                            </div>
                        </div>
                        <Div columns={!props.letter?.id ? 2 : 3} className="my-8">
                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full h-1/8 m-8 "
                                onClick={handleSubmit}
                            >
                                {props.letter?.id ? t("UPDATELETTERTEMPLATE") : t("SAVELETTERTEMPLATE")}
                            </Button>

                            <Button variant="contained"
                                    color="secondary"
                                    className="w-full h-1/8 m-8"
                                    onClick={()=>{handleClickPreview()}}>
                                {t("PREVIEW")}
                            </Button>

                            {/*style={!props.letter?.id ? {display:"none"} : null}*/}
                            {/*<IconButton onClick={() => handleClickOpen2()} style={!props.letter?.id ? {display:"none"} : null}>*/}
                            {/*    <Icon style={!props.letter?.id ? {display:"none"} : null}>delete</Icon>*/}
                            {/*</IconButton>*/}
                            <Button variant="outlined" onClick={() => handleClickOpen2()}
                                    endIcon={<DeleteIcon />}
                                    style={!props.letter?.id ? {display:"none"} : null}
                                    className="w-full h-1/8 m-8 bg-red-500 hover:bg-red-700 text-gray-200">
                                {t("DELETE")}
                            </Button>
                        </Div>
                    </Grid>

                    <LetterEditComponent
                        isReadOnly={isReadOnly}
                      name={"letterTemplate"}
                      value={letter.letterTemplate}
                      handleChange={handleChangeEditor}
                    ></LetterEditComponent>
                    <div className="pdf__dialog">
                        <CustomDialog open={openDialog} handleClickOpen={handleClickOpen} handleClose={handleClose}>
                            <div className="show__pdf" style={{height:"100%"}}>
                                <PdfComponent selectedValue={letter?.letterTemplate} />
                            </div>
                        </CustomDialog>
                    </div>
                </div>
                <div>
                    <Dialog
                      onClose={handleClose2}
                      open={open2}
                      TransitionComponent={Transition}
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle onClose={handleClose2} id="alert-dialog-slide-title">
                            {t("DELETELETTER")}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {t("DELETESURE")}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={()=> {handleDelete()}}>{t("YES")}</Button>
                            <Button onClick={handleClose2} color="primary">
                                {t("NO")}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar open={openAlert} autoHideDuration={6000} onClose={()=> handleCloseAlert()}>
                        <Alert onClose={()=>handleCloseAlert()} severity="error" variant="filled">
                            {t("LETTERALERT")}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        }
      />
    );
}

export const SampleInitialValue = [
    {
        type: "paragraph",
        children: [
            { text: "This is editable rich text, " },
            {
                text: "much",
                italic: true,
            },
            { text: " better than a " },
            { text: "<textarea>", code: true },
            { text: "!" },
        ],
    },
    {
        type: "paragraph",
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text ",
            },
            {
                text: "bold",
                bold: true,
            },
            {
                text: ", or add a semantically rendered block quote in the middle of the page, like this:",
            },
        ],
    },
    { type: "paragraph", children: [{ text: "Try it out for yourself!" }] },
];

export default withSnackbar(LetterEmployee);
