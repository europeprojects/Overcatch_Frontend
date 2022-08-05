import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import {ThemeProvider} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectMainTheme} from 'app/store/fuse/settingsSlice';
import {Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
//******************
import api from "../../../services/BackendApi";
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {string} from 'prop-types';
import {TextField} from "@material-ui/core";
//******************

function TasksHeader(props) {
	const dispatch = useDispatch();
	// const searchText = useSelector(({ documents }) => documents.searchText);
	const mainTheme = useSelector(selectMainTheme);
	const {t} = useTranslation('task');

	function handleClick() {
		props.handleClick()
	}

	function handleClear() {
		props.handleClear()
	}

	return (

		<div className="flex flex-1 items-center justify-center px-12">
			<div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="insert_drive_file">insert_drive_file</Icon>
				</FuseAnimate>
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
						{t("TASKS")}
					</Typography>
				</FuseAnimate>
			</div>

			{/*<div className="flex flex-1 items-center justify-center px-12">*/}
			{/*	<ThemeProvider theme={mainTheme}>*/}
			{/*		<FuseAnimate animation="transition.slideDownIn" delay={300}>*/}
			{/*			<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>*/}
			{/*				<Icon color="action">{t("SEARCH")}</Icon>*/}

			{/*				<Input*/}
			{/*					placeholder={t("SEARCH")}*/}
			{/*					className="flex flex-1 mx-8"*/}
			{/*					disableUnderline*/}
			{/*					fullWidth*/}
			{/*					// value={searchText}*/}
			{/*					inputProps={{*/}
			{/*						'aria-label': 'Search'*/}
			{/*					}}*/}
			{/*				/>*/}
			{/*			</Paper>*/}
			{/*		</FuseAnimate>*/}
			{/*	</ThemeProvider>*/}
			{/*</div>*/}

			<ThemeProvider theme={mainTheme}>
				<FuseAnimate animation="transition.slideDownIn" delay={300}>
					<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
						<Icon color="action">{t("SEARCH")}</Icon>

						<Input

							placeholder={t("SEARCHFORANYTHING")}
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
			{/*<FuseAnimate animation="transition.slideRightIn" delay={300}>*/}
			{/*<Button*/}
			{/*	className="ml-5 rounded-8 bg-white"*/}
			{/*	variant="contained"*/}
			{/*	onClick={() => {handleClick()}}*/}
			{/*>{t("SEARCH")}*/}
			{/*</Button>*/}
			<TextField
				type="date"
				size={'small'}
				name="startDate"
				className={'ml-6 object-center'}
				id="date"
				label={t("STARTDATETIME")}
				InputLabelProps={{
					shrink: true
				}}
				inputProps={{
					max: '3000-01-01',
					min:'1000-01-01'
				}}
				value={props.startDate}
				variant="outlined"
				onChange={event => {
					props.setStartDate(event.target.value);
				}}
			/>
			<TextField
				type="date"
				size={'small'}
				name="endDate"
				className={'ml-6 object-center'}
				id="date"
				label={t("ENDDATETIME")}
				InputLabelProps={{
					shrink: true
				}}
				inputProps={{
					max: '3000-01-01',
					min:'1000-01-01'
				}}
				variant="outlined"
				value={props.endDate}
				onChange={event => {
					props.setEndDate(event.target.value)
				}}
			/>
			{/*</FuseAnimate>*/}
			<FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button
					className="ml-5 rounded-8 bg-white"
					variant="contained"
					onClick={() => {handleClear()}}
				>{t("SEARCHCLEAR")}
				</Button>
			</FuseAnimate>
			<FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button
					component={Link}
					role="button"
					to="/tasks"
					className="whitespace-no-wrap normal-case ml-6"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">{t("BACKTOMODULES")}</span>
				</Button>
			</FuseAnimate>
		</div>
	);
}

export default TasksHeader;
