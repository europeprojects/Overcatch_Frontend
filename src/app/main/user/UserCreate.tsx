import {makeStyles} from '@material-ui/core/styles';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import CustomerInfoForm from './components/CustomerInfoForm';
import {UserDTO} from '../../types/UserModel';
import {Grid, styled} from "@material-ui/core";
import FusePageSimple from "../../../@fuse/core/FusePageSimple/FusePageSimple";
import {Div} from 'app/components/Grid';

const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function UserCreatePage(props) {
	const classes = useStyles(props);
	const { t } = useTranslation('usercreate');
	const [customerInfo, setCustomerInfo] = useState<UserDTO>({} as UserDTO);


	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="p-24">
					<h4>{t("CLIENTPAGE")}</h4>
				</div>
			}
			contentToolbar={
				<div className="px-24">
					<h4>{t("CLIENTCREATE")}</h4>
				</div>
			}
			content={
				<PageContainer>
					<PageMain>
						<PageContent>
							<Div box autoRow>
								<Div autoCol>
									<Grid xs={12}>
										<CustomerInfoForm onInput={data => setCustomerInfo(data)}></CustomerInfoForm>
									</Grid>
								</Div>
							</Div>
						</PageContent>
					</PageMain>
				</PageContainer>
			}

			/>

	);
}
export const PageContainer = styled('div')(({ theme }) => ({
	width: '100%',
	height: '100%',
	display: 'grid',
	maxWidth: theme.breakpoints.width('xl'),
	margin: '0 auto',
	padding: theme.spacing(2)
}));

export const PageMain = styled('div')(({ theme }) => ({
	width: '100%',
	display: 'flex',
	gridTemplateColumns: '2fr 1fr',
	gridGap: theme.spacing(2),
	[theme.breakpoints.down('sm')]: {
		gridTemplateColumns: '1fr'
	}
}));

export const PageContent = styled('div')(({ theme }) => ({
	width: '100%',
	gridTemplateRows: '1fr auto auto',
}));
export default UserCreatePage;
