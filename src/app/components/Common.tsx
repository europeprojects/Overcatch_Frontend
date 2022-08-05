import {styled, Typography} from "@material-ui/core";
import React, {PropsWithChildren} from "react";

export const PageContainer = styled('div')(({theme}) => ({
  width: '100%',
  maxWidth: theme.breakpoints.width('lg'),
  margin: '0 auto',
  padding: theme.spacing(2)
}))

export function SubTitle({children}: PropsWithChildren<any>) {
  return (
    <Typography gutterBottom variant="h5" component="h3">
      {children}
    </Typography>
  )
}
