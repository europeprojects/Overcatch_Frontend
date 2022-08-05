import FuseAnimate from '@fuse/core/FuseAnimate';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import BackendApi from "../../services/BackendApi";
import history from "@history/@history";
import {useTranslation} from "react-i18next";
import {useTransition} from "react-spring";
import ListItemText from "@material-ui/core/ListItemText";
import {Delete} from "@material-ui/icons";
import fs from "fs";
import Dialog from "@material-ui/core/Dialog";
import {DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Transition} from "react-spring/renderprops-universal";
import {TransitionProps} from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core/styles";
import {styles} from "@material-ui/pickers/views/Clock/Clock";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import api from "../../services/BackendApi";
import {Div} from "../../components/Grid";

//import { selectFileById } from './store/filesSlice';

function DetailCashInvoiceHeader(props) {
    const [open2, setOpen2] = React.useState(false);
    const [openConfirms, setOpenConfirms] = useState(false)
    const {t} = useTranslation('task');
    //@ts-ignore
    const clientId = useSelector(({company}) => company.currentCompanyId);
    const {selectedItem} = props
    if (!selectedItem) {
        return null;
    }
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
        BackendApi.getDownloadDocumentByUser(clientId.toString(), fileName).then(data => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            // console.log(url)
        })
    }
    function createDeleteRequest(cashId) {
        // props.setOpenBackDrop(true)
        api.createDeleteRequestCashInvoiceById(cashId).then(res => {
        });
    };
    function deleteFile(selectedItem) {
        if(selectedItem?.deleteState==0){
            handleClose();
            createDeleteRequest(selectedItem?.id);
            history.go(0);
            // setTimeout(function () {window.location = window.location;}, 100);
        }else{
            api.deleteCashInvoiceById(selectedItem?.id).then(res => {
                //window.location.reload()
            });
            handleClose();
            setTimeout(function () {window.location = window.location;}, 100);
        }
        //console.log("dokuman id: " + documentId)
    };

    const handleClose2 = () => {
        setOpen2(false);
    };
    function handleClick(cashInvoice) {
        setOpen2(false);
        // setSelectedItem(cashInvoice)
        setOpenConfirms(true)
    }
    function handleClose() {
        setOpenConfirms(false)
    }
    const handleClickOpen2 = () => {
        setOpen2(true);
    };

    function setBgColor(status){
        if(status == "DONE")
            return "bg-green text-white hover:bg-green-700"
        else if(status == "INPROGRESS")
            return "bg-orange text-white hover:bg-orange-700"
        else if(status == "REJECTED")
            return "bg-red text-white hover:bg-red-700"
        else if (status == "DEFAULT")
            return "bg-blue text-white hover:bg-blue-700"
    }

    // @ts-ignore
    return (
        <div className="flex flex-col justify-between h-full p-4 sm:p-12">
            <div className="toolbar flex align-center justify-end">
                <FuseAnimate animation="transition.expandIn" delay={200}>
                    <IconButton onClick={() => getDownload(selectedItem.fileName)}>
                        <Icon>cloud_download</Icon>
                    </IconButton>
                </FuseAnimate>

                <FuseAnimate animation="transition.expandIn" delay={200}>
                    {
                        selectedItem?.updateState !=0 ? <label>
                            Expense in update process
                            </label>
                            : <IconButton onClick={() => handleClickOpen2()}>
                                <Icon>delete</Icon>
                            </IconButton>
                    }

                </FuseAnimate>

                {/*<IconButton>*/}
                {/*    <Icon>more_vert</Icon>*/}
                {/*</IconButton>*/}
            </div>

            <div className="p-12">
                <FuseAnimate delay={200}>
                    <Typography variant="subtitle1" className="mb-8">
                        {selectedItem.cashInvoiceType}
                    </Typography>
                </FuseAnimate>
                <FuseAnimate delay={300}>
                    <Typography variant="caption" className="">
                        {/*<span>{t("EDITED")}</span>*/}
                        {/* <span>: {selectedItem.modified}</span> */}
                    </Typography>
                </FuseAnimate>
            </div>
            <Dialog onClose={handleClose2}
                    open={open2}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle onClose={handleClose2}
                             id="alert-dialog-slide-title">{t("DELETEFILE")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {t("DELETESURE")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="default" onClick={() => selectedItem?.deleteState == 0 || selectedItem?.deleteState == 3 ? deleteFile(selectedItem) : handleClick(selectedItem)}>
                        {t("YES")}
                    </Button>
                    <Button onClick={handleClose2} color="default">
                        {t("NO")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth={true}
                maxWidth={"xs"}
                open={openConfirms}
                onClose={handleClose} aria-labelledby="customized-dialog-title" >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("PROCESSMESSAGE")}
                </DialogTitle>
            <DialogContent dividers>

                { selectedItem?.userRole == "MANAGER" || selectedItem?.userRole == "EMPLOYEE"  ?
                    <span className={ "p-6 " +
                    (setBgColor("DONE") )}>
                                        {t("DONE")}
                                    </span> :

                    selectedItem?.task?.taskConfirmations?.length > 0 ?
                        selectedItem?.task.taskConfirmations.map((confirmations, index) => (
                            <div className="my-8">
                                <p>
                                    {confirmations.message ?
                                        confirmations.message : t("NOMESSAGE")
                                    }
                                </p>
                                {confirmations.personel &&
                                <Div columns={2} className="my-8 flex justify-center">

                                    <Grid xs={6} md={12} lg={12} xl={12}>
                                        <div className="flex justify-start items-center">
                                                    <span className={ "p-6 " +
                                                    (selectedItem?.task?.taskConfirmations?.[index + 1] ?
                                                        setBgColor(selectedItem?.task?.taskConfirmations?.[index + 1]?.taskConfirm) :
                                                        setBgColor("DEFAULT") )}>
                                                        {
                                                            selectedItem?.task?.taskConfirmations?.[index + 1] ?
                                                                t(selectedItem?.task?.taskConfirmations?.[index + 1]?.taskConfirm)
                                                                :
                                                                t("PENDINGTRANSACTION")
                                                        }
                                                    </span>
                                            <Icon>arrow_right</Icon>
                                            <span className={ "p-6 " + setBgColor(confirmations.taskConfirm)}>{t(confirmations.taskConfirm)}</span>
                                        </div>
                                    </Grid>
                                    <Grid xs={6} md={12} lg={12} xl={12}>
                                        <div>
                                            <div className="my-8 flex justify-end">
                                                {
                                                    confirmations.personel.userInfo.name
                                                    + " " +
                                                    confirmations.personel.userInfo.surname
                                                }
                                            </div>
                                            <div className="my-8 flex justify-end">
                                                {
                                                    confirmations.processDate
                                                }
                                            </div>
                                        </div>
                                    </Grid>
                                </Div>
                                }
                                {index != selectedItem?.task?.taskConfirmations?.length - 1 && <hr/>}
                            </div>

                        )) :
                        <span className={ "p-6 " + setBgColor("DEFAULT")}>
								{t("PENDINGTRANSACTION")}
							</span>
                }
            </DialogContent>
        </Dialog>
        </div>

    );
}

export default DetailCashInvoiceHeader;