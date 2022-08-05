import React, {useEffect, useState} from 'react';
import FusePageCarded from '../../../@fuse/core/FusePageCarded/FusePageCarded';
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {BuyerInfo} from "../../types/UserModel";
import {Link} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import {withSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

function CreateBuyerFirm(props: any) {
    const classes = useStyles();
    const [buyer, setBuyer] = useState<BuyerInfo>({} as BuyerInfo);
    const theme = useTheme();
    const [selectedType, setSelectedType] =useState();
    //@ts-ignore
    const test = useSelector(({auth}) => auth.user.data.usersClient);
    const handleChange = (event) => {
        setBuyer({...buyer, [event.target.name]: event.target.value});
    };
    const {t} = useTranslation('document');
    const handleChangeSelected = (event) => {
      setSelectedType(event.target.value)
    };

    return (
        <FusePageCarded
            classes={{
                content: 'flex',
                contentCard: 'overflow-hidden',
                header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
            }}
            header={
                <div className="flex flex-1 w-full items-center justify-between">
                    <div className="flex flex-1 flex-col items-center sm:items-start">
                        <Typography
                            className="normal-case flex items-center sm:mb-12"
                            component={Link}
                            role="button"
                            to="/clientapplist"
                            color="inherit"
                        >
                            <Icon className="text-20">
                                {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                            </Icon>
                            <span className="mx-4">{t("CREATEACCOUNT")}</span>
                        </Typography>

                    </div>
                </div>
            }
            content={
                <div className={"w-full p-32"}>
                    <div className={"w-full"}>

                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item xs>
                                <FormControl fullWidth={true} variant="outlined" >
                                    <InputLabel id="demo-simple-select-outlined-label">Account Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedType}
                                        onChange={handleChangeSelected}
                                        label={t("ACCOUNTTYPE")}
                                    >
                                        <MenuItem value="">
                                            <em>{t("NONE")}</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Company</MenuItem>
                                        <MenuItem value={20}>SoleTrader</MenuItem>
                                        <MenuItem value={30}>Individual</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs>
                                <TextField onChange={handleChange}
                                           required={true}
                                           name={"buyerName"}
                                           id="outlined-basic"
                                           label={t("NAME")}
                                           variant="outlined"
                                           value={buyer?.buyerName}
                                           fullWidth={true}
                                           className={"object-center"}
                                />
                            </Grid>
                            {(selectedType === 20)?(
                                <Grid item xs>
                                <TextField onChange={handleChange} required={true}
                                           name={"commercialTitle"}
                                           id="outlined-basic"
                                           label={t("TRADEASNAME")}
                                           variant="outlined"
                                           value={buyer.commercialTitle}
                                           fullWidth={true}
                                           className={"object-center"}
                                />
                            </Grid>
                            ):("")}

                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item xs>
                                <TextField onChange={handleChange} required={true}
                                           name={"buyerAddress"} id="outlined-basic"
                                           label={t("ADDRESS")}
                                           variant="outlined"
                                           value={buyer.buyerAddress}
                                           fullWidth={true}
                                           rows={4}
                                           className={"object-center"}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            spacing={3}>

                            <Grid item xs>
                                <TextField onChange={handleChange}
                                           className={"object-center"}
                                           required={true}
                                           name={"buyerPhone"}
                                           id="outlined-basic"
                                           label={t("PHONE")}
                                           variant="outlined"
                                           fullWidth={true}
                                           value={buyer.buyerPhone}/>
                            </Grid>
                            <Grid item xs>
                                <TextField onChange={handleChange}
                                           className={"object-center"}
                                           required={true}
                                           name={"buyerEmail"}
                                           id="outlined-basic"
                                           label={t("EMAIL")}
                                           variant="outlined"
                                           fullWidth={true}
                                           value={buyer.buyerEmail}/>
                            </Grid>

                        </Grid>

                        <Grid
                            container
                            direction="column-reverse"
                            alignItems="flex-end"
                            spacing={3}>
                            <Grid item xs>
                                <Button variant="contained" color="primary">
                                    Primary
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            }
            innerScroll
        />
    );
}

export default CreateBuyerFirm;
