import React, { useEffect, useState } from 'react';
import api from '../../../services/BackendApi';
import CustomSentLettersList from './CustomSentLettersList';
import FusePageCarded from '../../../../@fuse/core/FusePageCarded';
import {string} from "prop-types";
import SentLettersHeader from "../components/SentLettersHeader";
import {Letter, LetterType} from "../../../types/UserModel";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import {ThemeProvider} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FuseAnimate from "../../../../@fuse/core/FuseAnimate";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectMainTheme} from "../../../store/fuse/settingsSlice";



function CustomSentLetters(props:any) {

	const [letters,setLetters] = useState([]);
	const [letterTypes,setLetterTypes] = useState([]);
	const [letterType,setLetterType]=useState<LetterType[]>([])
	const [search, setSearch] = useState<string>("");
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25)
	const [orderColumn, setOrderColumn] = useState("insert_time")
	const [orderBy, setOrderBy] = useState("desc")
	const [total, setTotal] = useState(0)

	const { t } = useTranslation('letter');
	const mainTheme = useSelector(selectMainTheme);
	function getLetters(){
		api.getLetters(letterTypes.length < 1 ? "" : letterTypes?.toString(), search, orderColumn, orderBy, page, rowsPerPage).then(response => {
			console.log("custom-letters",response)
			setLetters(response.content);
			setTotal(response.totalElements);
		});
	}
	function getLetterTypes() {
		api.getLetterTypes().then(response => {
			setLetterTypes(response);
		});
	}

	function handleClear() {
	//	setPage(0);
		setSearch('');
		setLetterTypes([]);
		setPage(0)
		setRowsPerPage(25)
		setOrderColumn("insert_time")
		setOrderBy("desc")
		getLetters()
	}
	/*function handleClick() {
		getLetters();
	}*/

	useEffect(() => {
		getLetters()
	}, []);

	useEffect(() => {
		getLetters()
	}, [letterTypes, orderColumn, orderBy, page, rowsPerPage]);



	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				//<div className="p-24" style={{ textAlign: "center" }}>
		//			<SentLettersHeader
		//				data={letters}
		//				selectedLetterTypes={letterTypes}
		//				setSelectedLetterTypes={setLetterTypes}
		//				search={search}
		//				setSearch={setSearch}
		//				handleClick={handleClick}
		//				handleClear={handleClear}
					//>
					//</SentLettersHeader>
				//</div>
				<div className="flex flex-1 w-full items-center justify-between">
					<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="insert_drive_file">insert_drive_file</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
					{t("SENTLETTERS")}
					</Typography>
					</FuseAnimate>
					</div>

					<div className="flex flex-1 items-center justify-center px-12">
					<ThemeProvider theme={mainTheme}>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
					<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
					<Icon color="action">{t("SEARCH")}</Icon>

					<Input
					placeholder={t("FIRSTNAME") + " " + t("LASTNAME")}
					className="flex flex-1 mx-8"
					disableUnderline
					fullWidth
					value={search}
					inputProps={{
					'aria-label': 'Search'
				}}
					onChange={(e)=>setSearch(e.target.value)}
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
					</div>
				</div>
			}
			content={

				<CustomSentLettersList data={letters}
									   selectedLetterTypes={letterTypes}
									   setSelectedLetterTypes={setLetterTypes}
									   search={search}
									   setSearch={setSearch}
									   handleClear={handleClear}
									   page={page} setPage={setPage}
									   rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
									   total={total}
									   orderColumn={orderColumn} setOrderColumn={setOrderColumn}
									   orderBy1={orderBy} setOrderBy1={setOrderBy}
				/>
			}


		/>
	);
}

export default CustomSentLetters;