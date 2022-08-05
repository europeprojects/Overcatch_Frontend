import {styled, Theme, WithTheme} from "@material-ui/core";
import React, {PropsWithChildren} from "react";

const HtmlDiv = ({children, className}: PropsWithChildren<{ className?: string }>) => (
  <div className={className}>{children}</div>)

const boxStyles = (theme: Theme) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
})

export type DivProps =
  {
    box?: boolean,
    fullWidth?: boolean,
    columns?: number,
    rows?: number,
    gap?: number,
    autoRow?: boolean,
    autoCol?: boolean,
    area?: string,
    colSpan?: number,
    rowSpan?: number,
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
    justifyItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
    justifySelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
    alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
    alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch',
  }
  & WithTheme;

export const Div = styled(HtmlDiv)((
  {
    theme, box, fullWidth, columns, rows, autoCol, autoRow, area, colSpan, rowSpan, gap = 2,
    justifyContent, justifyItems, justifySelf, alignContent, alignItems, alignSelf
  }: DivProps) => ({
  ...(box && boxStyles(theme)),
  display: "grid",
  width: fullWidth ? '100%' : 'auto',
  gridTemplateColumns: columns && `repeat(${columns},${autoCol ? 'auto' : 'minmax(0,1fr)'})`,
  gridTemplateRows: rows && `repeat(${rows},${autoRow ? 'auto' : 'minmax(0,1fr)'})`,
  gridGap: gap && theme.spacing(gap),
  gridArea: area,
  gridColumn: colSpan && `span ${colSpan}`,
  gridRow: rowSpan && `span ${rowSpan}`,
  justifyContent,
  justifyItems,
  justifySelf,
  alignContent,
  alignItems,
  alignSelf
}))

