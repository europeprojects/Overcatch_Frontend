import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ContactsMultiSelectMenu from './ContactsMultiSelectMenu';
import ContactsTable from './components/UITable';
import {getContacts, openEditContactDialog, removeContact, selectContacts} from './store/contactsSlice';
import {blobToFile, stringToBlob} from "app/utils/utils";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Div} from "../../components/Grid";
import DialogContentText from "@material-ui/core/DialogContentText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from '@material-ui/core/styles';
import Formsy from "formsy-react";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import {FormControlLabel, MenuItem, Slide, Switch} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SelectFormsy from "../../../@fuse/core/formsy/SelectFormsy";
import TextFieldFormsy from "../../../@fuse/core/formsy/TextFieldFormsy";
import Snackbar from "@material-ui/core/Snackbar";
import api from "../../services/BackendApi";
import {useSnackbar, withSnackbar} from "notistack";
import MuiAlert from '@material-ui/lab/Alert';
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";
import {contactListScheme} from "../validations/ValidationSchemes";
import config from "../../services/Config";
import {Alert} from "@material-ui/lab";
import jwtService from "../../services/jwtService/jwtService";
import {UserTypeFilter} from "./UserTypeFilter";
//import {ColumnFilter} from "./ColumnFilter";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});



function ContactsList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ contactsApp }) => contactsApp.contacts.searchText);
	const user = useSelector(({ contactsApp }) => contactsApp.user);
	const [filteredData, setFilteredData] = useState(null);
	const [userId, setUserId] = useState(0);
	const [isSelfAssesment, setIsSelfAssesment] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [open1, setOpen1] = React.useState(false);
	const [open2, setOpen2] = React.useState(false);
	const [open3, setOpen3] = React.useState(false);
	const [openErrorMessgae, setOpenErrorMessgae] = React.useState(false);
	const [isOther, setIsOther] = useState(false);
	const [changeObje, setChangeObje] = useState({});
	const [name, setName] = useState(false);
	const [selectedUser, setSelectedUser] = useState(0);
	const [checked, setChecked] = React.useState(false);
	const {t} = useTranslation('usercreate');
	//const [filtered,setFiltered] = useState([]);
	function changeSelf() {
		setIsSelfAssesment(true)
		setIsOther(false)
	}
	function deletefield(){
		formik.values.clientTypeEnum='';
		formik.values.agreementType='';
		formik.values.isExisting='';
		formik.values.notes='';
		formik.values.payment='';
		formik.values.visaType='';
	}

	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />
	}

	const formik = useFormik({
		initialValues: {
			clientTypeEnum:'',
			agreementType:'',
			isExisting:'',
			notes:'',
			payment:'',
			visaType:'',
		},
		validationSchema: contactListScheme,
		onSubmit: (values) => {
			// @ts-ignore
			handleSubmit(values)
			// alert(JSON.stringify(values))
		},
	});



	const handleClickOpen = (model) => {
		setName(model.name+ " "+model.surname)
		setUserId(model.id);
		setOpen(true);
	};
	const handleClose = (id) => {

		setUserId(id);
		formik.values.clientTypeEnum='';
		formik.values.agreementType='';
		formik.values.isExisting='';
		formik.values.notes='';
		formik.values.payment='';
		formik.values.visaType='';
		setOpen(false);
	};
	const handleOpen2 = (user) => {
		setSelectedUser(user);
		setOpen2(true);
	};
	const handleOpen3 = (id) => {
		setOpen3(true);
	};
	const handleClose3 = () => {
		setOpen3(false);
	};
	const handleClose1 = () => {
		setOpen1(false);
	};
	const handleActiveOrDeactive = () => {
		if(!changeObje.status){
			api.userPassivetoActive(changeObje.id).then(data=>{
				dispatch(getContacts({page:1, perpage:10}));
				props.enqueueSnackbar(<h4>{data.message}</h4>, {
					variant: 'success',})
			});

		}
		else{
			api.userActivetoPassive(changeObje.id).then(data=>{
				dispatch(getContacts());
				//jwtService.logout(changeObje?.id);
			});

		}
		setOpen3(false);

	};
	const handleClose2 = () => {
		setOpen2(false);
	};
	const handleSubmit = (model) => {
		model.userId=userId;
		// model.clientTypeEnum=formik.values.clientTypeEnum
		// model.agreementType=formik.values.agreementType
		// model.isExisting=formik.values.isExisting
		// model.notes=formik.values.notes
		// model.payment=formik.values.payment
		// model.visaType=formik.values.visaType

		// console.log(model)
		api.addClient(model).then(data=>{
			// console.log(data);
			setOpen(false);
			setOpen1(true);
		})
	};
	const handleDelete = () => {
		api.getUserById(selectedUser?.id).then(res =>{
			if (!res.isPassChanged)
				dispatch(removeContact(selectedUser?.id));
			else
				setOpenErrorMessgae(true)
		})
		setOpen2(false);
	};

	function handleCloseError(){
		setOpenErrorMessgae(false)
	}
	const toggleChecked = () => {
		setChecked((prev) => !prev);
	};

	const getPhotoUrlByFileName = (user) => {
		var id = user?.id
		var filename = user?.photoURL
		var url = config.BACKEND_API_URL + "/api/file/downloadPhoto/" + id + "/" + filename
		return url
	}
	function multiSelectFilter(rows, columnIds, filterValue) {
		// Filters only if filters are selected
		console.log("multi : "+filterValue)
		console.log("multi : "+columnIds)

		filterValue.map((type)=>{
			let temp = rows.filter((data)=>data.values.userType===type);
			//setFiltered(filtered=>[...filtered,...temp])
		})
		//filtered.map(data=>console.log(data))

		return filterValue.length === 0 ? rows : rows.filter((row) =>  filterValue.includes(String(row.values.userType)));

	}
	const customStringSort = (rowA, rowB, columnId, desc) => {
		let A = String(rowA.values[columnId]).toLowerCase();
		let B = String(rowB.values[columnId]).toLowerCase();
		return A.localeCompare(B)
	};
	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map((row) => row.original.id);

					return (
						selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
					);
				},
				accessor: 'avatar',
				Cell: ({ row }) => {
					// var blobData= stringToBlob(row.original.photo);
					 //console.log("row.original.photo"+row.original.photo);
					// console.log(blobToFile(blobData,row.original.photoURL));
					// console.log((window.URL || window.webkitURL).createObjectURL(blobData));

					//data:image/jpeg;base64,${row.original.photo}
					return (row.original.photoURL ? (
						<Avatar className="mx-3" alt={row.original.name}  src={getPhotoUrlByFileName(row.original)}/>
							//	{(window.URL || window.webkitURL).createObjectURL(blobToFile(stringToBlob(row.original.photo)))
					) : (
						<Avatar className="mx-3" alt={row.original.name}  src="assets/images/avatars/alice.jpg"/> ));

				},
				className: 'justify-center',
				width: 50,
				sortable: false
			},
			{
				Header: t("FIRSTNAME"),
				accessor: 'name',
				className: 'font-bold',
				sortable: true,
				isFrozen: true,
				sortType:customStringSort,
			},
			{
				Header: t("LASTNAME"),
				accessor: 'surname',
				className: 'font-bold',
				sortable: true,
				sortType:customStringSort,
			},
			{
				Header: t("EMAIL"),
				accessor: 'email',
				sortable: true
			},
			{
				Header: t("USERTYPE"),
				accessor: 'userType',
				sortable: false,
				Filter : UserTypeFilter,
				filter: multiSelectFilter,
			},
			{
				Header: t("PHONE"),
				accessor: 'msisdn',
				sortable: true
			},
			{
				Header: t("NEWUPDATEDELETE"),
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">

						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								row.original.userType === "CLIENT" ?
									handleClickOpen(row.original): props.enqueueSnackbar(<h4>{t('BEADDEDCLIENTS')}</h4>,{
										variant: 'error',
									})

							}}
						>
							<Icon>add_circle_outline</Icon>
						</IconButton>
						{/*<IconButton*/}
						{/*	onClick={ev => {*/}
						{/*		ev.stopPropagation();*/}
						{/*		dispatch(toggleStarredContact(row.original.id));*/}
						{/*	}}*/}
						{/*>*/}
						{/*	{user.starred && user.starred.includes(row.original.id) ? (*/}
						{/*		<Icon>star</Icon>*/}
						{/*	) : (*/}
						{/*		<Icon>star_border</Icon>*/}
						{/*	)}*/}
						{/*</IconButton>*/}
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(openEditContactDialog(row.original));
							}}
						>
							<Icon>sync</Icon>
						</IconButton>
						{/*<IconButton*/}
						{/*	onClick={ev => {*/}
						{/*		ev.stopPropagation();*/}

						{/*		handleOpen2(row.original);*/}
						{/*	}}*/}
						{/*>*/}
						{/*	<Icon>delete</Icon>*/}
						{/*</IconButton>*/}
						<FormControlLabel
							onClick={(ev)=> {
								ev.stopPropagation();
								// console.log(row.original)
							}}
							control={<Switch checked={row?.original.isActive} onChange={(ev)=>{
								ev.stopPropagation();
								setOpen3(true)
								setChangeObje({id:row.original.id,status:row?.original.isActive})
								// handleActiveOrDeactive(row.original.id,row?.original.isActive);
							}} />}
							label={row?.original.isActive ?t('ACTIVE'):t('PASSIVE')}
						/>
					</div>
				)
			}
		],
		[dispatch, user.starred, t]
	);

	// useEffect(()=>{
	// 	console.log(formik)
	// },[formik])


	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		//if (contacts) {
		//	setFilteredData(getFilteredArray(contacts, searchText));
		//}

		const filteredRows = contacts?.filter((row) => {
			const nameSurname = row?.name +
				" " + row?.surname;
			const email = row?.email;
			const phone = row?.msisdn != null ? row?.msisdn : "";
			const userType = row?.userType;
			return nameSurname?.toLowerCase()?.includes(searchText?.toLowerCase())
				||
				email?.toLowerCase()?.includes(searchText?.toLowerCase())
				||
				phone?.toLowerCase()?.includes(searchText?.toLowerCase())
				||
				userType?.toLowerCase()?.includes(searchText?.toLowerCase());
		});
		setFilteredData(filteredRows);
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					{t('NOCONTACTS')}
				</Typography>
			</div>
		);
	}


	return (
		<Div>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<ContactsTable
					columns={columns}
					data={filteredData}
					onRowClick={(ev, row) => {
						if (row) {
							dispatch(openEditContactDialog(row.original));
						}
					}}
				/>
			</FuseAnimate>
			<div>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle style={{ backgroundColor: '#132332',color:'#fff' }}
								 id="alert-dialog-title">{t("NEWCLIENT")}</DialogTitle>

					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<form
								onSubmit={formik.handleSubmit}
							>
								<Div columns={1}>
									<TextField
										className="my-16"
										label={t("CLIENTTYPE")}
										value={formik.values.clientTypeEnum}
										error={formik.touched.clientTypeEnum && Boolean(formik.errors.clientTypeEnum)}
										helperText={formik.touched.clientTypeEnum && formik.errors.clientTypeEnum}
										variant="outlined"
										name="clientTypeEnum"
										select={true}
										onChange={(e)=>{
											e.target.value==="SELFASSESMENT" ?changeSelf():setIsSelfAssesment(false);
											formik.handleChange(e);
										}}
									>
										<MenuItem value="none">
											<em>{t("PLEASESELECT")}</em>
										</MenuItem>
										<MenuItem value="SOLETRADE">{t("SOLETRADE")}</MenuItem>
										<MenuItem value="LIMITED">{t("LIMITED")}</MenuItem>
										<MenuItem value="SELFASSESMENT">{t("SELFASSESMENT")}</MenuItem>
									</TextField>
								</Div>

								{isSelfAssesment ===false &&(
									<Div>
										<TextField
											className="my-16"
											label={t("AGGREMENTTYPE")}
											value={formik.values.agreementType}
											error={formik.touched.agreementType && Boolean(formik.errors.agreementType)}
											helperText={formik.touched.agreementType && formik.errors.agreementType}
											variant="outlined"
											name="agreementType"
											select={true}
											required

											onChange={formik.handleChange}
										>
											<MenuItem value="none">
												<em>{t("PLEASESELECT")}</em>
											</MenuItem>
											<MenuItem value="TRADING">{t("TRADING")}</MenuItem>
											<MenuItem value="ECAA">{t("ECAA")}</MenuItem>
											<MenuItem value="OTHER">{t("OTHER")}</MenuItem>
										</TextField>
									</Div>)}
								<Div columns={1}>
									<TextField
										className="my-16"
										label={t("NEWEXIST")}
										value={formik.values.isExisting}
										error={formik.touched.isExisting && Boolean(formik.errors.isExisting)}
										helperText={formik.touched.isExisting && formik.errors.isExisting}
										name="isExisting"
										variant="outlined"
										select={true}
										onChange={formik.handleChange}
									>
										<MenuItem value="none">
											<em>{t("PLEASESELECT")}</em>
										</MenuItem>
										<MenuItem value="false">{t("NEW")}</MenuItem>
										<MenuItem value="true">{t("EXIST")}</MenuItem>
									</TextField>
								</Div>
								<Div columns={1}>
									{(isOther===true || isSelfAssesment===true) &&(
										<TextField
											className="mb-16"
											type="text"
											name="visaType"
											label={t("VISATYPE")}
											value={formik.values.visaType}
											helperText={formik.touched?.visaType && formik.errors?.visaType}
											error={formik.touched.visaType && Boolean(formik.errors.visaType)}
											onChange={formik.handleChange}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<Icon className="text-20" color="action">
															public
														</Icon>
													</InputAdornment>
												)
											}}
											variant="outlined"
											required
										/>
									)}
								</Div>
								<Div columns={1}>
									<TextField
										id="outlined-multiline-static"
										label={t("THINGSTOCONSIDER")}
										className="mb-16"
										multiline
										value={formik.values.notes}
										name="notes"
										helperText={formik.touched?.notes && formik.errors?.notes}
										error={formik.touched.notes && Boolean(formik.errors.notes)}
										onChange={formik.handleChange}
										rows={4}
										variant="outlined"
									/>
								</Div>
								<Div>
									<TextField
										className="mb-16"
										type="number"
										name="payment"
										label={t("AGREEDPRICE")}
										value={formik.values.payment}
										error={formik.touched.payment && Boolean(formik.errors.payment)}
										helperText={formik.touched.payment && formik.errors.payment}
										onChange={formik.handleChange}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20" color="action">
														money
													</Icon>
												</InputAdornment>
											)
										}}
										variant="outlined"

									/>
								</Div>
								<DialogActions>
									<Div className="flex flex-end">
										<Button variant="contained" autoFocus onClick={handleClose} color="secondary">
											{t("CLOSE")}
										</Button>
										<Button variant="contained" type={"submit"} color="primary" >
											{t("SAVE")}
										</Button>
									</Div>
								</DialogActions>
							</form>
						</DialogContentText>
					</DialogContent>
				</Dialog>
			</div>
			<Snackbar open={open1} autoHideDuration={3000} onClose={handleClose1}>
				<Alert onClose={handleClose1} severity="success">
					{name}{t("SUCCESS")}
				</Alert>
			</Snackbar>
			<Dialog
				open={open2}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose2}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">{t("SUREDELETE")}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{t("SURE")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose2} color="secondary">
						{t("CANCEL")}
					</Button>
					<Button onClick={handleDelete} color="primary">
						{t("DELETE")}
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar open={openErrorMessgae} autoHideDuration={6000} onClose={()=> handleCloseError()}>
				<Alert onClose={()=>handleCloseError()} severity="error" variant="filled">
					{t("ACTIVEUSERCANTDELETE")}
				</Alert>
			</Snackbar>
			<Dialog
				open={open3}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose3}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">{t("AREYOUSURECHANGESTATUS")}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{t("SURE")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose3} color="secondary">
						{t("CANCEL")}
					</Button>
					<Button onClick={handleActiveOrDeactive} color="primary">
						{t("CHANGE")}
					</Button>
				</DialogActions>
			</Dialog>
			{/*<Alert severity="error">This is an error message!</Alert>*/}
			{/*<Alert severity="warning">This is a warning message!</Alert>*/}
			{/*<Alert severity="info">This is an information message!</Alert>*/}
			{/*<Alert severity="success">This is a success message!</Alert>*/}
		</Div>
	);
}

export default withSnackbar(ContactsList);