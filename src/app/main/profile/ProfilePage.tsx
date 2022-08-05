import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState} from 'react';
import AboutTab from './tabs/AboutTab';
import UserUpdateTab from './tabs/UserUpdateTab';
import {UserDTO} from "../../types/UserModel";
import api from "../../services/BackendApi";
import history from '@history';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    layoutHeader: {
        height: 200,
        minHeight: 200,
        [theme.breakpoints.down('md')]: {
            height: 240,
            minHeight: 240
        }
    }
}));

const onUpdatePhoto = (e: any) => { 
    history.push("/photo")
}

function ProfilePage(props:any) {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [userUpdateIndo, setUserUpdateInfo] = useState<UserDTO>({} as UserDTO);
    const [userInfo, setUserInfo] = useState<UserDTO>({} as UserDTO);
    const [imageSrc, setImageSrc] = React.useState<any>(null)
    const {t} = useTranslation('profile');
    const user = useSelector(({ auth }) => auth.user);
    useEffect(() => {
        if(user.role.length>0){
            api.getCurrentUser().then(response => {
                setUserInfo(response);
                if(response.photoURL) {
                    console.log("Profil Page-add")
                    api.getProfilImage(response.photoURL).then(res => {setImageSrc(URL.createObjectURL(res)); });
                }
            });
        }
    }, []);

    function handleTabChange(event, value) {
        setSelectedTab(value);
    }

    return (
        <FusePageSimple
            classes={{
                header: classes.layoutHeader,
                toolbar: 'px-16 sm:px-24'
            }}
            header={
                <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
                    <div
                        className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                       
                      {userInfo.photoURL ? (
					<Avatar className="w-96 h-96"  src={imageSrc} />
				) : (
					<Avatar className="w-96 h-96"  src="assets/images/avatars/profile.jpg"> </Avatar>
				)}

                        <Typography
                            className="md:mx-24 text-24 md:text-32 my-8 md:my-0"
                            variant="h4"
                            color="inherit"
                        >
                            {userInfo.name} {userInfo.surname}
                        </Typography>
                    </div>

                    <div className="flex items-center justify-end">
                        <Button className="mx-8 normal-case" onClick={onUpdatePhoto} variant="contained" color="secondary" aria-label="Follow">
                            {t("ADDIMAGE")}
                        </Button>
                        {/*<Button className="normal-case" variant="contained" color="primary" aria-label="Send Message">*/}
                        {/*    {t("SENDMESSAGE")}*/}
                        {/*</Button>*/}
                    </div>
                </div>
            }
            contentToolbar={
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="off"
                    classes={{
                        root: 'h-64 w-full'
                    }}
                >
                    <Tab
                        classes={{
                            root: 'h-64'
                        }}
                        label={t("ABOUT")}
                    />
                    <Tab
                        classes={{
                            root: 'h-64'
                        }}
                        label={t("UPDATEPROFILE")}
                    />

                </Tabs>


            }
            content={
                <div className="p-16 sm:p-24">
                    {selectedTab === 0  && <AboutTab  user={userInfo}/>}
                    {selectedTab === 1 && <UserUpdateTab user={userInfo}/>}
                </div>
            }
        />
    );
}

export default ProfilePage;
