import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Div} from "../../../components/Grid";
import {useTranslation} from "react-i18next";

function AboutTab(props: any) {
    // const [user, setUser] = useState<UserDTO>(props);
    const {user} = props;
    const {t} = useTranslation('profile');

    return (
    <Div>
        <div className="md:flex max-w-2xl">
            <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">

                <Card className="w-full mb-16 rounded-8">
                    <AppBar position="static" elevation={0}>
                        <Toolbar className="px-8">
                            <Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
                                {t("GENERALINFORMATION")}
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <CardContent>
                        <div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("NAME")}</Typography>
                            <Typography>{user.name} {user.surname}</Typography>
                        </div>
                        {user.brpNumber && (<div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("BRPNUMBER")}</Typography>
                            <Typography>{user.brpNumber}</Typography>
                        </div>)}


                        {user.brpExpireDate && (<div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("BRPEXPIREDATE")}</Typography>
                            <Typography>{user.brpExpireDate}</Typography>
                        </div>)}
                        <div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("EMAIL")}</Typography>

                            <Typography>{user.email}</Typography>

                        </div>

                        {user.alternativeEmail && (<div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("ALTERNATIVEMAIL")}</Typography>
                            <Typography>{user.alternativeEmail}</Typography>
                        </div>)}

                        <div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("PHONE")}</Typography>
                            <Typography>{user.msisdn}</Typography>
                        </div>

                        {user.alternativeMsisdn && (<div className="mb-24">
                            <Typography className="font-bold mb-4 text-15">{t("ALTERNATIVEPHONE")}</Typography>
                            <Typography>{user.alternativeMsisdn}</Typography>
                        </div>)}
                    </CardContent>
                </Card>
                </div>

        </div>
        </Div>
    );
}

export default AboutTab;
