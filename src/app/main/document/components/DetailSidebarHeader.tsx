import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {useSelector} from 'react-redux';
import BackendApi from "../../../services/BackendApi";
import history from "@history/@history";
import {useTranslation} from "react-i18next";
import {useTransition} from "react-spring";
import ListItemText from "@material-ui/core/ListItemText";
import {Delete} from "@material-ui/icons";
import fs from "fs";
import FileList, {DialogTitleProps} from "./FileList";
import Dialog from "@material-ui/core/Dialog";
import {DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Transition} from "react-spring/renderprops-universal";
import {TransitionProps} from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core/styles";
import {styles} from "@material-ui/pickers/views/Clock/Clock";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import api from "../../../services/BackendApi";

//import { selectFileById } from './store/filesSlice';

function DetailSidebarHeader(props) {
    const [open2, setOpen2] = React.useState(false);
    //@ts-ignore
    const routingData = history.location.displayRouteData;
    //@ts-ignore
    const userFolder = useSelector(({ auth }) => auth.user.data.userFolder);
    //@ts-ignore
    const clientId = useSelector(({company}) => company.currentCompanyId);
    //const selectedItem = useSelector(state => selectFileById(state, state.fileManagerApp.files.selectedItemId));
    const {selectedItem} = props
    const {client} = props
    const {documentList, setDocumentList} = props
    const {open3, setOpen3} = props
    const {t} = useTranslation('task');

    if (!selectedItem) {
        return null;
    }

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children?: React.ReactElement<any, any> },
        ref: React.Ref<unknown>,
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
                position: 'absolute',
                right: theme.spacing(1),
                top: theme.spacing(1),
                color: theme.palette.grey[500],
            },
        });

    interface DialogTitleProps extends WithStyles<typeof styles> {
        id: string;
        children: React.ReactNode;
        onClose: () => void;
    }
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

    const DialogActions = withStyles((theme: Theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    const getDownload = (fileName: string) => {
        BackendApi.getDownloadDocumentByUser(client?.id, fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })
    }

    function deleteFile(documentId) {
        api.deleteFileById(documentId).then(res => {
            //window.location.reload()
        });
        handleClose2();
        // setTimeout(function () {
        //     window.location = window.location;
        // }, 100);
        // console.log("dokuman id: " + documentId)

        setDocumentList(documentList.filter(doc => doc?.id != selectedItem?.id))
        setOpen3(false)
    };

    const handleClose2 = () => {
        setOpen2(false);
    };
    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    // @ts-ignore
    return (
        <div className="flex flex-col justify-between h-full p-4 sm:p-12">
            <div className="toolbar flex align-center justify-start">
                <FuseAnimate animation="transition.expandIn" delay={200}>
                    <IconButton onClick={() => getDownload(selectedItem.fileName)}>
                        <Icon>cloud_download</Icon>
                    </IconButton>
                </FuseAnimate>

                <FuseAnimate animation="transition.expandIn"  delay={200}>
                    <IconButton onClick={() => handleClickOpen2()} >
                        <Icon>delete</Icon>
                    </IconButton>
                </FuseAnimate>

                {/*<IconButton>*/}
                {/*    <Icon>more_vert</Icon>*/}
                {/*</IconButton>*/}
            </div>

            <div className="p-12">
                <FuseAnimate delay={200}>
                    <Typography variant="subtitle1" className="mb-8">
                        {selectedItem.documentName}
                    </Typography>
                </FuseAnimate>
                <FuseAnimate delay={300}>
                    <Typography variant="caption" className="">
                        {/*<span>Edited</span>*/}
                        {/* <span>: {selectedItem.modified}</span> */}
                    </Typography>
                </FuseAnimate>
            </div>
            <Dialog  onClose={handleClose2}
                     open={open2}
                     // TransitionComponent={Transition}


                     aria-labelledby="alert-dialog-slide-title"
                     aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle onClose={handleClose2}
                             id="alert-dialog-slide-title">{t('DELETEFILE')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {t('DELETESURE')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button  color="default" onClick={() => deleteFile(selectedItem.id)}>
                        {t('YES')}
                    </Button>
                    <Button onClick={handleClose2} color="default">
                        {t('NO')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default DetailSidebarHeader;
