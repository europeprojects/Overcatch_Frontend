import React from "react";
import {Select,MenuItem,Input,ListItemText,Checkbox
} from '@material-ui/core/';
//import {string} from "prop-types";
import {useEffect,useState} from "react";


export const UserTypeFilter = ({ column}) =>{

    const {filterValue,setFilter,filteredRows,preFilteredRows} = column;
    const [userType,setUserType] = useState([])
    const [filtered,setFiltered] = useState([]);

    useEffect(()=>{
        setFilter(userType)
    },[userType])

    function handleChangeCheckbox(value, checked) {

        if(checked && !userType?.includes(value))
        {
            setUserType(oldArray=>[...oldArray,value]);
        }
        else if(!checked && userType?.includes(value)) {
            setUserType(userType?.filter(item => item != value))
        }
    }
    return (
        <>
            <Select
                multiple={true}
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                value={userType}
                label="UserType"
                style={{maxWidth:"100px"}}
                // onChange={e => handleChange(e, row.id)}
                renderValue={(selected) => (selected as string[]).join(',')}
                //renderValue={(selected) => (selected)}
                MenuProps={{

                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null,
                }}
            >
                <MenuItem key = {'MANAGER'} value={'MANAGER'}>
                    <Checkbox onChange={(e,checked) => {handleChangeCheckbox('MANAGER', checked)}} checked={userType.indexOf("MANAGER")>-1} />
                    <ListItemText primary={'MANAGER'} />
                </MenuItem>
                <MenuItem key = {'CLIENT'} value={'CLIENT'}>
                    <Checkbox onChange={(e,checked) => {handleChangeCheckbox('CLIENT', checked)}} checked={userType.indexOf("CLIENT")>-1}  />
                    <ListItemText primary={'CLIENT'} />
                </MenuItem>
                <MenuItem key = {'EMPLOYEE'} value={'EMPLOYEE'}>
                    <Checkbox onChange={(e,checked) => {handleChangeCheckbox('EMPLOYEE', checked)}} checked={userType.indexOf("EMPLOYEE")>-1}  />
                    <ListItemText primary={'EMPLOYEE'} />
                </MenuItem>
            </Select>
        </>


    )
}

UserTypeFilter.propTypes = {
    filterValue:[]
};