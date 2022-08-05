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
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import api from "../../services/BackendApi";
import history from "@history/@history";
import {useParams} from "react-router";
import {withSnackbar} from "notistack";
import {CircularProgress} from "@material-ui/core";
import {useTranslation} from "react-i18next";
const useStyles = makeStyles(theme => ({
	root: {
		background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`,
		color: theme.palette.primary.contrastText
	}
}));

function ChangeForgotPassword(props) {
	const classes = useStyles();
	let { changeCode,email } = useParams();
	const {t} = useTranslation('task');

	const [isLoading,setIsLoading]=useState(false);
	const { form, handleChange, resetForm } = useForm({
		changeCode: changeCode? changeCode:'',
		password:'',
		repeatPassword:''
	});

	function isFormValid() {
		return form.changeCode.length > 5 && form.password.length > 7 && form.repeatPassword.length > 7;
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		setIsLoading(true);
		var model={changeCode:form?.changeCode,email:email,password:form?.password}
		if(form.password===form.repeatPassword){
			api.resetPassword(model).then(res=> {

				setIsLoading(false);
				props.enqueueSnackbar(<h4>{res.message}</h4>,{
					variant: res.success?'success':'error',
				})
				setTimeout(function(){
					history.push("/login");
				}, 1000);
				}
			);
		}else {
			setIsLoading(false);
			props.enqueueSnackbar(<h4>{t("PASSNOTMACHED")}</h4>, {
				variant: 'error',
			})
		}
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32')}>
			{isLoading===true &&(<CircularProgress color="secondary" className={"m-10"}/>)}
			<div className="flex flex-col items-center justify-center w-full">
				<FuseAnimate animation="transition.expandIn">
					<Card className="w-full max-w-384 rounded-8">
						<CardContent className="flex flex-col items-center justify-center p-32">
							<div className="w-150 m-32">
								<img src="assets/images/logos/overbeyaz500.jpg" alt="logo" />
							</div>

							<Typography variant="h6" className="mt-16 mb-32">
								{t("RECOVERYOURPASSWORD")}
							</Typography>

							<form
								name="recoverForm"
								noValidate
								className="flex flex-col justify-center w-full"
								onSubmit={handleSubmit}
							>
								<TextField
									className="mb-16"
									label= {t("CODE")}
									autoFocus
									type="number"
									name="changeCode"
									value={form.changeCode}
									onChange={handleChange}
									variant="outlined"
									required
									fullWidth
								/>
								<TextField
									className="mb-16"
									label= {t("NEWPASSWORD")}
									autoFocus
									type="password"
									name="password"
									value={form.password}
									onChange={handleChange}
									variant="outlined"
									required
									fullWidth
								/>
								<TextField
									className="mb-16"
									label= {t("REPEATPASSWORD")}
									autoFocus
									type="password"
									name="repeatPassword"
									value={form.repeatPassword}
									onChange={handleChange}
									variant="outlined"
									required
									fullWidth
									/>
								<Button
									variant="contained"
									color="primary"
									className="w-224 mx-auto mt-16"
									aria-label="Reset"
									disabled={!isFormValid()}
									type="submit"
								>
									{t("CHANGEPASSWORD")}
								</Button>
							</form>

							<div className="flex flex-col items-center justify-center pt-32 pb-24">
								<Link style={{color:"black"}} className="font-medium" to="/login">
									{t("GOBACKLOGIN")}
								</Link>
							</div>
						</CardContent>
					</Card>
				</FuseAnimate>
			</div>
		</div>
	);
}

export default withSnackbar(ChangeForgotPassword);
