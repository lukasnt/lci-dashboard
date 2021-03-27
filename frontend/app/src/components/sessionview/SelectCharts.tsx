import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography} from "@material-ui/core";
import {selectedSessionActiveContainersState} from "../../state/session";
import {useRecoilState, useSetRecoilState} from "recoil";
import {MMDVariables, Variable} from "../../constants";
import {addStudentPopupOpenState, selectChartsPopupOpenState} from "../../state/popup";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btn: {
            color: theme.palette.text.default
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "1fr",
            justify: "space-between",
            gap: 18,
            color: theme.palette.text.default,
            width: "100%"
        },
        btnGroup: {
            display: "flex",
            width: "100%"
        },
        listItemText: {},
        checkbox: {
            color: theme.palette.primary.main
        }
    })
);

export default function SelectCharts(): JSX.Element {
    const classes = useStyles();
    const setPopupOpen = useSetRecoilState(selectChartsPopupOpenState);
    const [activeContainers, setActiveContainers] = useRecoilState(selectedSessionActiveContainersState);

    const handleCheck = (key: Variable) => () => {
        const newContainers = {...activeContainers};
        newContainers[key] = {...activeContainers[key], active: !activeContainers[key].active};
        setActiveContainers(newContainers);
    };

    const handleCheckAll = (value: boolean) => {
        const newContainers = {...activeContainers};
        Object.values(Variable).forEach((variable) => {
            newContainers[variable] = {...activeContainers[variable], active: value};
        });
        setActiveContainers(newContainers);
    };

    return (
        <div className={classes.grid}>
            <Typography variant="h1">Select Variable Charts</Typography>
            <List>
                {Object.values(Variable).map((variable, index) => {
                    const name = MMDVariables[variable].name;
                    const labelId = `checkbox-list-label-${name}`;
                    return (
                        <ListItem key={index} role={undefined} dense button onClick={handleCheck(variable)}>
                            <ListItemIcon className={classes.checkbox}>
                                <Checkbox
                                    edge="start"
                                    checked={activeContainers[variable].active}
                                    tabIndex={-1}
                                    disableRipple
                                    color="primary"
                                    className={classes.checkbox}
                                    inputProps={{"aria-labelledby": labelId}}
                                />
                            </ListItemIcon>
                            <ListItemText
                                disableTypography
                                id={labelId}
                                primary={name}
                                className={classes.listItemText}
                            />
                        </ListItem>
                    );
                })}
            </List>
            <div className={classes.btnGroup}>
                {Object.values(Variable).some((variable) => activeContainers[variable].active === false) ? (
                    <Button
                        className={classes.btn}
                        onClick={() => {
                            handleCheckAll(true);
                        }}
                    >
                        <Checkbox
                            tabIndex={-1}
                            disableRipple
                            checked={false}
                            className={classes.checkbox}
                            color="primary"
                        ></Checkbox>
                        Select All
                    </Button>
                ) : (
                    <Button
                        className={classes.btn}
                        onClick={() => {
                            handleCheckAll(false);
                        }}
                    >
                        <Checkbox
                            tabIndex={-1}
                            disableRipple
                            checked={true}
                            className={classes.checkbox}
                            color="primary"
                        ></Checkbox>
                        Remove All
                    </Button>
                )}
                <Button
                    className={classes.btn}
                    style={{marginLeft: "auto"}}
                    onClick={() => {
                        setPopupOpen(false);
                    }}
                >
                    Done
                </Button>
            </div>
        </div>
    );
}
