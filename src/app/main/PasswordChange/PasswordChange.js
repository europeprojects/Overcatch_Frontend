import FuseAnimate from '@fuse/core/FuseAnimate';
import { useForm } from '@fuse/hooks';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from "../../fuse-layouts/shared-components/LanguageSwitcher";
import {Alert} from "@material-ui/lab";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import api from "../../services/BackendApi";
import history from "@history/@history"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
const useStyles = makeStyles(theme => ({
    root: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
            theme.palette.primary.dark,
            0.5
        )} 100%)`,
        color: theme.palette.primary.contrastText
    }
}));

function PasswordChange() {
    const classes = useStyles();
    const [disabled, setDisabled] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const isPassChanged = useSelector(({ auth }) => auth.user.data.isPassChanged);
    const { form, handleChange, resetForm } = useForm({
        oldpassword:'',
        password: '',
        passwordConfirm: ''
    });
    const { t } = useTranslation('passwordChange');
    const [error,setError] =useState();

    // useEffect(()=>{
    //
    //     if(form.password != form.passwordConfirm ){
    //         if(form.passwordConfirm.length>0 && form.password.length>0)
    //         setError("Eşleşmiyor")
    //     }else{
    //         setError(null)
    //     }
    // },[form])

    function handleSubmit(ev) {
        ev.preventDefault();
        if(form.password.length === 0 || form.oldpassword.length === 0 || form.passwordConfirm.length===0){
            setError(t("FILLALLFIELDS"))
        }
        else if(form.passwordConfirm !== form.password){
            setError(t("DOESNOTMATCH"))
            return
        }else{
            if(form.password.length < 7 || form.passwordConfirm.length < 7){
                setError(t("MINLENGTH8"))
            }else {
                setDisabled(true)
                setError(null)
                // resetForm();
                api.changePassword(form.oldpassword,form.password).then(()=>{
                    history.push("/")
                }).catch(()=>{
                    setError(t("UNSUCCESSFUL"))
                })

            }
        }
    }

    return (
        <div
            className={clsx(
                classes.root,
                'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
            )}
        >
            <FuseAnimate animation="transition.bounceDownIn">
                <div className="flex w-full max-w-400 md:max-w-3xl rounded-12 shadow-2xl overflow-hidden">
                    <div
                        className={clsx(classes.leftSection, 'hidden md:flex flex-1 items-center justify-center p-64')}
                    >
                        <div className="max-w-320">
                            <FuseAnimate animation="transition.slideUpIn" delay={400}>
                                <Typography variant="h3" color="inherit" className="font-800 leading-tight">
                                    {t('WELCOMEOVERCATCH')}
                                </Typography>
                            </FuseAnimate>

                            <FuseAnimate delay={500}>
                                <Typography variant="subtitle1" color="inherit" className="mt-32">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                </Typography>
                            </FuseAnimate>
                        </div>
                    </div>
                    <Card
                        className={clsx(
                            classes.rightSection,
                            'flex flex-col w-full max-w-sm items-center justify-center'
                        )}
                        square
                        elevation={0}
                    >
                        <LanguageSwitcher />
                        <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
                            <FuseAnimate delay={300}>
                                <div className="flex items-center mb-32">
                                    <img className="logo-icon" src="assets/images/logos/overbeyaz250.jpg" alt="logo" />

                                </div>
                            </FuseAnimate>

                            {/* <Tabs
								value={selectedTab}
								onChange={handleTabChange}
								variant="fullWidth"
								className="w-full mb-32"
							>
								<Tab
									icon={
										<img
											className="h-40 p-4 bg-black rounded-12"
											src="assets/images/logos/jwt.svg"
											alt="firebase"
										/>
									}
									className="min-w-0"
									label="Login"
								/>
							</Tabs> */}

                            <Typography variant="h6" className="md:w-full mb-32">
                                {t('RESETYOURPASSWORD')}
                            </Typography>

                            <form
                                name="resetForm"
                                noValidate
                                className="flex flex-col justify-center w-full"
                                onSubmit={handleSubmit}
                            >
                                <TextField
                                    className="mb-16"
                                    label={t('OLDPASSWORD')}
                                    autoFocus
                                    name="oldpassword"
                                    type="password"
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: t("MINLENGTH4")
                                    }}
                                    value={form.oldpassword}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        className: 'pr-2',
                                        type: showPassword1 ? 'text' : 'password',
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword1(!showPassword1)}>
                                                    <Icon className="text-20" color="action">
                                                        {showPassword1 ? 'visibility' : 'visibility_off'}
                                                    </Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <TextField
                                    className="mb-16"
                                    label={t('PASSWORD')}
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        className: 'pr-2',
                                        type: showPassword2 ? 'text' : 'password',
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword2(!showPassword2)}>
                                                    <Icon className="text-20" color="action">
                                                        {showPassword2 ? 'visibility' : 'visibility_off'}
                                                    </Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <TextField
                                    className="mb-16"
                                    label={t('PASSWORDCONF')}
                                    type="password"
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    InputProps={{
                                        className: 'pr-2',
                                        type: showPassword3 ? 'text' : 'password',
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword3(!showPassword3)}>
                                                    <Icon className="text-20" color="action">
                                                        {showPassword3 ? 'visibility' : 'visibility_off'}
                                                    </Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                {error? <Alert severity="error">{error}!</Alert>:""}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="w-224 mx-auto mt-16"
                                    aria-label="Reset"
                                    disabled={disabled}
                                    type="submit"
                                >
                                    {t('RESETMYPASSWORD')}
                                </Button>
                            </form>
                        </CardContent>

                        <div className="flex flex-col items-center justify-center pb-32">
                            <div>
                                <span className="font-medium mr-8">
                                </span>
                            </div>
                            <div>
                                {isPassChanged !=false &&(
                                    <Link color="inherit"  className="font-medium" to="/profile">
                                        {t('BACK')}
                                    </Link> )}

                            </div>
                            {/*<Link className="font-medium mt-8" to="/">*/}
                            {/*	{t('BACK')}*/}
                            {/*</Link>*/}
                        </div>
                    </Card>

                </div>
            </FuseAnimate>
        </div>
    );
}

export default PasswordChange;
