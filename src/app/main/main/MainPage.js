import DemoContent from '@fuse/core/DemoContent';
import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import { Div } from "app/components/Grid";
import {useSelector} from "react-redux";
import history from '@history';

const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function MainPage(props) {
	const user = useSelector(({ auth }) => auth.user);

	useEffect(() => {
		// Update the document title using the browser API 
		if(user.role[0] === "MANAGER"){
			history.push("/dashboard")
		}
		else if(user.role[0] === "EMPLOYEE"){
			history.push("/dashboard2")
		}
		else if(user.role[0] === "CUSTOMER"){
			history.push("/dashboard3")
		}
	},[user]);

	const classes = useStyles(props);
	const { t } = useTranslation('examplePage');


	return (
		<div></div>
	);
}

export default MainPage;
