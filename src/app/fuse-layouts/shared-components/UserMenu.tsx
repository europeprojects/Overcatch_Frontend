import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import api from 'app/services/BackendApi';
import { UserDTO } from 'app/types/UserModel';
import {useTranslation} from "react-i18next";

function UserMenu(props:any) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);

	const [userMenu, setUserMenu] = useState(null);
	const {t} = useTranslation('examplePage');
	const [userInfo, setUserInfo] = useState<UserDTO>({} as UserDTO);
    const [imageSrc, setImageSrc] = React.useState<any>(null)
	const activeSession = sessionStorage.activeSession;
	let imageSrcflag =0;

    useEffect(() => {

		if(user.role.length>0){
			api.getCurrentUser().then(response => {
				setUserInfo(response);
				if(response.photoURL) {
					console.log("UserMenu-photo")
					api.getProfilImage(response.photoURL).then(res => {setImageSrc(URL.createObjectURL(res)); });
				}
			});
		}

    }, []);



	
	const userMenuClick = event => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	//tarayıcı kapatılınca oturum kapanması
	sessionStorage.setItem('activeSession', 'true');
	/*if (sessionStorage.loggedOutOnAuth) {
		console.log('Logged out due to expiry already')
	}
	else if (!activeSession) {
		sessionStorage.loggedOutOnAuth = true;
		dispatch(logoutUser());
	}*/

	return (
		<>
			<Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
				<div className="hidden md:flex flex-col mx-4 items-end">
					<Typography component="span" className="normal-case font-bold flex">
						{user.data.displayName}
					</Typography>
					<Typography className="text-11 capitalize" color="textSecondary">
						{user.role?.toString() == "CUSTOMER" ? "CLIENT" : user.role?.toString()}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.data.photoURL ? (
					<Avatar className="md:mx-4" alt="user photo" src={imageSrc} />
				) : (
					<Avatar className="md:mx-4" src="assets/images/avatars/profile.jpg"> </Avatar>
				)}
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
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
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem component={Link} to="/login" role="button">
							<ListItemIcon className="min-w-40">
								<Icon>lock</Icon>
							</ListItemIcon>
							<ListItemText primary={t("LOGIN")} />
						</MenuItem>
						<MenuItem component={Link} to="/register" role="button">
							<ListItemIcon className="min-w-40">
								<Icon>person_add</Icon>
							</ListItemIcon>
							<ListItemText primary={t("REGISTER")} />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem component={Link} to="/profile" onClick={userMenuClose} role="button">
							<ListItemIcon className="min-w-40">
								<Icon>account_circle</Icon>
							</ListItemIcon>
							<ListItemText primary={t("PROFILE")} />
						</MenuItem>
						{/*<MenuItem component={Link} to="/apps/mail" onClick={userMenuClose} role="button">*/}
						{/*	<ListItemIcon className="min-w-40">*/}
						{/*		<Icon>mail</Icon>*/}
						{/*	</ListItemIcon>*/}
						{/*	<ListItemText primary="Inbox" />*/}
						{/*</MenuItem>*/}
						<MenuItem
							onClick={() => {
								dispatch(logoutUser());
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<Icon>exit_to_app</Icon>
							</ListItemIcon>
							<ListItemText primary={t("LOGOUT")} />
						</MenuItem>
					</>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
