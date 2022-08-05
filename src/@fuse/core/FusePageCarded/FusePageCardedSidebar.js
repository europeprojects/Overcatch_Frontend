import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden'; 
import clsx from 'clsx';
import React, { useImperativeHandle, useState, useEffect } from 'react';
import FusePageCardedSidebarContent from './FusePageCardedSidebarContent';


function FusePageCardedSidebar(props, ref) {
	//const {enqueueSnackbar} = useSnackbar();
	//const [loading, setLoading] = React.useState(false);
	//const [open, setOpen] = React.useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const { classes } = props;

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	const handleToggleDrawer = () => {
		setIsOpen(!isOpen);
	};
	/*const handleMenuClick = () => {
		setOpen(state => !state);
	  };

	useEffect(() => {
		ApiStatusServiceInstance.onProgress("progress-listener", inProgress => {
		  setLoading(inProgress)
		})
		ApiStatusServiceInstance.onError("error-listener", message => {
		  enqueueSnackbar(message, {variant: 'warning'})
		})
	  }, [enqueueSnackbar])
    */
	return (
		<>
			<Hidden lgUp={props.variant === 'permanent'}>
				<Drawer
					variant="temporary"
					anchor={props.position}
					open={isOpen}
					onClose={ev => handleToggleDrawer()}
					classes={{
						root: clsx(classes.sidebarWrapper, props.variant),
						paper: clsx(
							classes.sidebar,
							props.variant,
							props.position === 'left' ? classes.leftSidebar : classes.rightSidebar
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					container={props.rootRef.current}
					BackdropProps={{
						classes: {
							root: classes.backdrop
						}
					}}
					style={{ position: 'absolute' }}
				>
					<FusePageCardedSidebarContent {...props} />
				</Drawer>
			</Hidden>
			{props.variant === 'permanent' && (
				<Hidden mdDown>
					<Drawer
						variant="permanent"
						className={clsx(classes.sidebarWrapper, props.variant)}
						open={isOpen}
						classes={{
							paper: clsx(
								classes.sidebar,
								props.variant,
								props.position === 'left' ? classes.leftSidebar : classes.rightSidebar
							)
						}}
					>
						<FusePageCardedSidebarContent {...props} />
					</Drawer>
				</Hidden>
			)}
		</>
	);
}

export default React.forwardRef(FusePageCardedSidebar);
