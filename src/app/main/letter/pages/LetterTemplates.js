import React, { useEffect, useState } from 'react';
import api from '../../../services/BackendApi';
import LetterTemplateList from '../components/LetterTemplateList';
import FusePageSimple from '../../../../@fuse/core/FusePageSimple/FusePageSimple';
import LetterTypeSelector from '../components/LetterTypeSelector';
import { Button, DialogContentText, Grid, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import LetterEditComponent from '../components/LetterEditComponent';
import Dialog from '@material-ui/core/Dialog';
import useStyles from '../../profile/ProfileImages.css';
import { makeStyles } from '@material-ui/core/styles';
import {useTranslation} from "react-i18next";

function LetterTemplates(props) {

	const useStyles = makeStyles((theme) => ({
		layoutRoot: {},
		root: {
			width: "100%",
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			flexBasis: "33.33%",
			flexShrink: 0,
		},
		secondaryHeading: {
			fontSize: theme.typography.pxToRem(15),
			color: theme.palette.text.secondary,
		},
	}));

	const classes = useStyles(props);
	const [letters, setLetters] = useState([]);


	useEffect(()=>{
		api.getLetterTypes().then(r=>setLetters(r));
	},[])
	const {t} = useTranslation("letter")
	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot,
			}}
			header={
				<div className="p-24" style={{ textAlign: "center" }}>
					<h4>{t("LETTERTEMPLATES")}</h4>
				</div>
			}
			content={
				<div>
					<LetterTemplateList data={letters}/>
				</div>
			}
		/>

	);
}

export default LetterTemplates;