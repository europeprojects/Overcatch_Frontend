import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import {useTranslation} from "react-i18next";

function CompanyListHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);
	const {t} = useTranslation('companyApplications');


	/*function handleClick() {
		props.handleClick()
	}*/

	//search 'de yapılan değişikliği component'e anlık olarak yansıtmak için
	useEffect(()=>{
		props.handleChange()
	},[props.search])

	function handleClear() {
		props.handleClear()
	}

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="insert_drive_file">insert_drive_file</Icon>
				</FuseAnimate>
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
						{t("CLIENTSLIST")}
					</Typography>
				</FuseAnimate>
			</div>

			<div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
							<Icon color="action">search</Icon>

							<Input
								placeholder={t("SEARCHCLIENT")}
								className="flex flex-1 mx-8"
								disableUnderline
								fullWidth
								value={props.search}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={(e)=>props.setSearch(e.target.value)}
							/>
						</Paper>
					</FuseAnimate>
				</ThemeProvider>

				{/*<Button
					className="ml-5 rounded-8 bg-white"
					variant="contained"
					onClick={() => {handleClick()}}
				>
					{t("SEARCH")}
				</Button>*/}
				<Button
					className="ml-5 rounded-8 bg-white"
					variant="contained"
					onClick={() => {handleClear()}}
				>
					{t("CLEAR")}
				</Button>
				<Link to='/usercreate' style={{ textDecoration: 'none' }}>
					<Button
						variant="outlined"
						color="secondary"
						className="ml-5 rounded-8"
						textPrimary="white"
						startIcon={<Icon style={{ color: "secondary", fontSize: 30 }}>add_circle</Icon>}
					>
						{t("NEWCLIENT")}
					</Button>
				</Link>
			</div>
			{/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
			{/*	/!*<Button*!/*/}
			{/*	/!*	component={Link}*!/*/}
			{/*	/!*	to="/apps/e-commerce/products/new"*!/*/}
			{/*	/!*	className="whitespace-no-wrap normal-case"*!/*/}
			{/*	/!*	variant="contained"*!/*/}
			{/*	/!*	color="secondary"*!/*/}
			{/*	/!*>*!/*/}
			{/*	/!*	/!*<span className="hidden sm:flex">Add New Company</span>*!/*!/*/}
			{/*	/!*	/!*<span className="flex sm:hidden">New</span>*!/*!/*/}
			{/*	/!*</Button>*!/*/}
			{/*</FuseAnimate>*/}
		</div>
	);
}

export default CompanyListHeader;
