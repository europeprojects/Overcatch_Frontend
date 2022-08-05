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
import {CircularProgress} from "@material-ui/core";
import {withSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
const useStyles = makeStyles(theme => ({
	root: {
		background: `radial-gradient(${darken(theme.palette.primary.dark, 0.5)} 0%, ${theme.palette.primary.dark} 80%)`,
		color: theme.palette.primary.contrastText
	}
}));

function ForgotPassword(props) {
	const {t} = useTranslation('task');
	const classes = useStyles();
	const { form, handleChange, resetForm } = useForm({
		email: ''
	});
	const [isLoading,setIsLoading]=useState(false);
	function isFormValid() {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(form.email).toLowerCase());
	}

	function handleSubmit(ev) {
		ev.preventDefault();
		setIsLoading(true);
		api.forgotPasswordStep1(form.email).then(res=> {

			setIsLoading(false);

			if(res.success===true){
				props.enqueueSnackbar(<h4>{t('PASSWORDRESETLINK')}</h4>,{
					variant: 'success',
					autoHideDuration: 1500
				})
				setTimeout(function(){
					history.push(res.message);
				}, 1000);


			}else{
				props.enqueueSnackbar(<h4>{res.message}</h4>,{
					variant: 'error',
				})
			}
		});
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
									label="Email"
									autoFocus
									type="email"
									name="email"
									value={form.email}
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
									{t("SENDRESETLINK")}
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

export default withSnackbar(ForgotPassword);
