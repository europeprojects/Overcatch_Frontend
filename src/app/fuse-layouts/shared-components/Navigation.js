import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { selectNavigation } from 'app/store/fuse/navigationSlice';
import jwtService from "../../services/jwtService/jwtService";
import history from "../../../@history/@history";
import api from "../../services/BackendApi";

function Navigation(props) {

	const navigation = useSelector(selectNavigation);

	useEffect(() => {
		api.getCurrentUser().then(currentUser=>{
			if(!currentUser.isActive){
				jwtService.logout();
				history.push("/login");
			}
		})
	});

	return (
		<FuseNavigation
			className={clsx('navigation', props.className)}
			navigation={navigation}
			layout={props.layout}
			dense={props.dense}
			active={props.active}
		/>
	);
}

Navigation.defaultProps = {
	layout: 'vertical'
};

export default React.memo(Navigation);
