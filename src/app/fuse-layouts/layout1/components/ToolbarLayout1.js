import FuseSearch from '@fuse/core/FuseSearch';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import clsx from 'clsx';
import React from 'react';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import { useSelector } from 'react-redux';
import { selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { useTranslation } from 'react-i18next';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import ChatPanelToggleButton from '../../shared-components/chatPanel/ChatPanelToggleButton';
import CompanySwitcher from './CompanySwitcher';
const useStyles = makeStyles(theme => ({
	root: {}
}));

function ToolbarLayout1(props) {
	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(selectToolbarTheme);
	const role = useSelector(({ auth }) => auth.user.role);
	const classes = useStyles(props);
	const {t} = useTranslation('application');

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx(classes.root, 'flex relative z-10')}
				color="default"
				style={{ backgroundColor: toolbarTheme.palette.background.paper }}
				elevation={2}
			>
				<Toolbar className="p-0 min-h-48 md:min-h-64">
					{config.navbar.display && config.navbar.position === 'left' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
						</Hidden>
					)}

					<div className="flex flex-1">
						{/* <Hidden mdDown> */}
						{/*	<FuseShortcuts className="px-16" /> */}
						{/* </Hidden> */}
					</div>
					<label style={{ fontWeight: 'bolder', color: 'red', marginRight: '300px', fontSize: '16px',width:"300px" }}>
						{t("WARNING")}
					</label>
					<div className="flex items-center px-16">
						{role[0] === 'CUSTOMER' && <CompanySwitcher />}

						<LanguageSwitcher />

						<FullScreenToggle />

						<FuseSearch />

						<UserMenu />
						{/* <QuickPanelToggleButton /> */}
						<Hidden lgUp>
							{(role[0] === 'MANAGER' || role[0] === 'EMPLOYEE') && <ChatPanelToggleButton />}
						</Hidden>
					</div>

					{config.navbar.display && config.navbar.position === 'right' && (
						<Hidden lgUp>
							<NavbarMobileToggleButton />
						</Hidden>
					)}
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout1);
