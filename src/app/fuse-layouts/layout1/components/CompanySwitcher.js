import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from "@material-ui/core/Icon";
import { changeCompany } from 'app/store/companySlice';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import history from '@history';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
// const languages = [
//     {
//         id: '1000',
//         title: 'Company A'
//     },
//     {
//         id: '1001',
//         title: 'Company B'
//     }
// ];
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

function CompanySwitcher(props) {
    const dispatch = useDispatch();
    const languages = useSelector(({ auth }) => auth.user.data.usersClient);
    const currentCompanyId = useSelector(({ company }) => company.currentCompanyId);
    const [selectCompany,setSelectCompany] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [openToast, setOpenToast] = React.useState(false);
    const [openToast2, setOpenToast2] = React.useState(false);
    const [currentCompany,setCurrentCompany] = useState(languages[0]);
    // useEffect(()=>{setCurrentCompany(languages[0])})

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };
    const handleCloseToast2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast2(false);
    };
    const handleClickOpen = (lng) => {
        setSelectCompany(lng);
        setMenu(null);
        if(lng.client.id!=currentCompany?.client?.id){
            setOpen(true);
        }else{
            setOpenToast(true);
        }

    };
    const handleClose = () => {
        setOpen(false);
    };
    // useEffect(() => {
    //     console.log(languages)
    // }, [languages]);


    useEffect(() => {
        let value=sessionStorage.getItem('clientId');
        console.log(currentCompanyId)
        if (value){
            setCurrentCompany(languages?.find(lng => lng.client.id === parseInt(value)));
        }else{
            setCurrentCompany(languages[0])
        }
    }, [currentCompanyId]);

    useEffect(() => {
        if(languages?.length>0){
            let value=sessionStorage.getItem('clientId');
            dispatch(changeCompany(value!==null?parseInt(value):languages[0].client.id));
        }
    }, []);
    // const currentLanguageId = useSelector(({ i18n }) => auth.);

    const [menu, setMenu] = useState(null);

    const langMenuClick = event => {
        setMenu(event.currentTarget);
    };

    const langMenuClose = () => {
        setMenu(null);
    };

    function handleLanguageChange() {
        if(selectCompany){
            dispatch(changeCompany(selectCompany.client.id));
            sessionStorage.setItem('clientId', selectCompany.client.id);
            setOpen(false);
            setOpenToast2(true);
			history.go(0);
        }

        langMenuClose();
    }

    return (
        <>

            <Button className="h-40 w-100" onClick={langMenuClick}>
                <Icon className="text-30" color="disabled">
                    business
                </Icon>
                <Typography className="mx-4 font-bold" color="textSecondary">
                    {currentCompany?.client?.company?.name ===null?"UNNAMED":currentCompany?.client?.company?.name}
                    {currentCompany?.client?.founderOwner?.tradeAsName ===null?"UNNAMED":currentCompany?.client?.founderOwner?.tradeAsName}
                    %{languages[0]?.sharePercent}
                </Typography>
            </Button>
            <Popover
                open={Boolean(menu)}
                anchorEl={menu}
                onClose={langMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                classes={{
                    paper: 'py-8'
                }}
            >

                {languages?.map(lng => (
                    <MenuItem key={lng.client.id} onClick={() => handleClickOpen(lng)}>
                      {lng.client.company != null ? (
                        <ListItemText primary={lng?.client?.company?.name+ " " +lng.sharePercent} />
                      ):(
                        <ListItemText primary={lng?.client?.founderOwner?.tradeAsName+ " " +lng.sharePercent} />
                      )}

                    </MenuItem>
                ))}

                {/*<MenuItem*/}
                {/*    // component={Link}*/}
                {/*    // to="/companycreate"*/}
                {/*    // onClick={langMenuClose}*/}
                {/*    // role="button"*/}
                {/*>*/}
                {/*    <ListItemText primary="Not Exist" />*/}
                {/*</MenuItem>*/}
            </Popover>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Confirm Switch Company"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        If you approve, you will make your processes through that company and your unsaved actions will be lost
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        Decline
                    </Button>
                    <Button onClick={handleLanguageChange} variant="contained" color="primary">
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={openToast} zIndex="tooltip" autoHideDuration={2000} onClose={handleCloseToast}>
                <Alert onClose={handleCloseToast} severity="info">
                    Already Selected
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={openToast2} zIndex="tooltip" autoHideDuration={2000} onClose={handleCloseToast2}>
                <Alert onClose={handleCloseToast2} severity="success">
                  {currentCompany?.client?.company?.name} {currentCompany?.client?.founderOwner?.tradeAsName} Selected
                </Alert>
            </Snackbar>
        </>
    );
}

export default CompanySwitcher;
