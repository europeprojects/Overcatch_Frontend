import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import React, {useEffect} from "react";

export type DialogDetail = {
    header: any
    primaryButton: any
    secodaryButton:any
    handleFunction: any
    content:any
    detail:any
}

function DialogComponent({header,primaryButton,secodaryButton,content,handleFunction,detail}:DialogDetail){

    const [open, setOpen] = React.useState(detail);

    const handleClickOpen = () => {
        setOpen(true);
        handleFunction();
    };

    const handleClose = () => {
        setOpen(false);
    };
return(
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{header}</DialogTitle>
        <DialogContent>
            {content}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                {primaryButton}
            </Button>
            <Button onClick={()=>handleClickOpen} color="primary">
                {secodaryButton}
            </Button>
        </DialogActions>
    </Dialog>

)
}
export default DialogComponent;