import {Div} from "../../components/Grid";
import {FormControl, InputLabel, OutlinedInput} from "@material-ui/core";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import {UserDTO} from "../../types/UserModel";
import api from "../../services/BackendApi";
import history from "../../../@history/@history";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
}));


function PasswordChangeForm(props: any){
    const {t} = useTranslation('application');
    const classes = useStyles();
    const {user} = props;
    const [disabled, setDisabled] = useState(false);


    const [values, setValues] = React.useState({
        oldpassword: '',
        newpassword: '',
        amount: '',
        confirmnewpassword: '',
        weight: '',
        weightRange: '',
        showConfirmPassword: false,
        showOldPassword: false,
        showNewPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleClickShowConfirmPassword = () => {
        setValues({...values, showConfirmPassword: !values.showConfirmPassword});
    };

    const handleClickShowOldPassword = () => {
        setValues({...values, showOldPassword: !values.showOldPassword});
    };

    const handleClickShowNewPassword = () => {
        setValues({...values, showNewPassword: !values.showNewPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function handleSubmit() {
    //     if(values.newpassword === values.confirmnewpassword){
    //         api.updatePassword(values.newpassword).then(() => {
    //             history.push('/profile')
    //         });
    //         console.log("Şifre değiştirme başarılı")
    //     }
    //     else
    //     {
    //         console.log("girilen şifreler hatalı")
    //     }

    //
        history.push('/ChangePassword')
        setDisabled(true)
    };



    return (
            <div>
                <Div box>
                    {/*<Div  columns={3} >*/}
                    {/*    <Div justifySelf='flex-start'>*/}
                    {/*    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">*/}
                    {/*        <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>*/}
                    {/*        <OutlinedInput*/}
                    {/*            id="outlined-adornment-password"*/}
                    {/*            type={values.showOldPassword ? 'text' : 'password'}*/}
                    {/*            value={values.oldpassword}*/}
                    {/*            onChange={handleChange('oldpassword')}*/}
                    {/*            endAdornment={*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton*/}
                    {/*                        aria-label="toggle password visibility"*/}
                    {/*                        onClick={handleClickShowOldPassword}*/}
                    {/*                        onMouseDown={handleMouseDownPassword}*/}
                    {/*                        edge="end"*/}
                    {/*                    >*/}
                    {/*                        {values.showOldPassword ? <Visibility /> : <VisibilityOff />}*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            }*/}
                    {/*            labelWidth={70}*/}
                    {/*        />*/}
                    {/*    </FormControl>*/}
                    {/*    </Div>*/}
                    {/*    <Div justifySelf='center'>*/}
                    {/*    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">*/}
                    {/*        <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>*/}
                    {/*        <OutlinedInput*/}
                    {/*            id="outlined-adornment-password"*/}
                    {/*            type={values.showNewPassword ? 'text' : 'password'}*/}
                    {/*            value={values.newpassword}*/}
                    {/*            onChange={handleChange('newpassword')}*/}
                    {/*            endAdornment={*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton*/}
                    {/*                        aria-label="toggle password visibility"*/}
                    {/*                        onClick={handleClickShowNewPassword}*/}
                    {/*                        onMouseDown={handleMouseDownPassword}*/}
                    {/*                        edge="end"*/}
                    {/*                    >*/}
                    {/*                        {values.showNewPassword ? <Visibility /> : <VisibilityOff />}*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            }*/}
                    {/*            labelWidth={70}*/}
                    {/*        />*/}
                    {/*    </FormControl>*/}
                    {/*    </Div>*/}
                    {/*    <Div justifySelf='flex-end'>*/}
                    {/*    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">*/}
                    {/*        <InputLabel htmlFor="outlined-adornment-password">Confirm New Password</InputLabel>*/}
                    {/*        <OutlinedInput*/}
                    {/*            id="outlined-adornment-password"*/}
                    {/*            type={values.showConfirmPassword ? 'text' : 'password'}*/}
                    {/*            value={values.confirmnewpassword}*/}
                    {/*            onChange={handleChange('confirmnewpassword')}*/}
                    {/*            endAdornment={*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton*/}
                    {/*                        aria-label="toggle password visibility"*/}
                    {/*                        onClick={handleClickShowConfirmPassword}*/}
                    {/*                        onMouseDown={handleMouseDownPassword}*/}
                    {/*                        edge="end"*/}
                    {/*                    >*/}
                    {/*                        {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            }*/}
                    {/*            labelWidth={70}*/}
                    {/*        />*/}
                    {/*    </FormControl>*/}
                    {/*    </Div>*/}
                    {/*</Div>*/}
                    <Div alignSelf='flex-end' justifySelf='flex-end'>
                        <Button onClick={handleSubmit}  disabled={disabled} variant="contained" color="primary">
                            {t("CHANGEPASSWORD")}
                        </Button>
                    </Div>
                </Div>
            </div>
        );

}

export default PasswordChangeForm;
