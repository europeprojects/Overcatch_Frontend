import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import JWTLoginTab from './tabs/JWTLoginTab';
import LanguageSwitcher from '../../fuse-layouts/shared-components/LanguageSwitcher';
import { submitLogin } from '../../auth/store/loginSlice';


const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));


  function Login() {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const classes = useStyles();
	const { t } = useTranslation('LoginPage');
	const [isFormValid, setIsFormValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);


	const formRef = useRef(null);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			console.log("login.err",login.error)
			disableButton();
		}
	}, [login.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		dispatch(submitLogin(model));
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
					<Card
						className={clsx(
							classes.leftSection,
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

						<JWTLoginTab languages={t} />
						</CardContent>

						<div className="flex flex-col items-center justify-center pb-32">
							<div>
								<Typography>
									<span className="font-medium mr-8">{t('FORGOTPASSDISPLAY')}</span>
								</Typography>
							</div>
							<div>
								<Typography>
									<Link color="inherit"  className="font-medium" to="/forgot-password">
										{t('FORGOTPASS')}
									</Link>
								</Typography>

							</div>
							{/*<Link className="font-medium mt-8" to="/">*/}
							{/*	{t('BACK')}*/}
							{/*</Link>*/}
						</div>
					</Card>

					<div
						className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}
					>
						<div className="max-w-320">
							<FuseAnimate animation="transition.slideUpIn" delay={400}>
								<Typography variant="h3" color="inherit" className="font-800 leading-tight">
									{t('WELCOMEMESSAGE')}
								</Typography>
							</FuseAnimate>

							<FuseAnimate delay={500}>
								<Typography variant="subtitle1" color="inherit">
									{t('LOGINMESSAGE')}
								</Typography>
							</FuseAnimate>
						</div>
					</div>
				</div>
			</FuseAnimate>
		</div>
	);
}

export default Login;
