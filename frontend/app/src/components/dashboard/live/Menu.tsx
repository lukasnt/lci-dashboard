import React from "react";
import {
    createStyles,
    ListItemIcon,
    makeStyles,
    Menu as MUIMenu,
    MenuItem,
    MenuList,
    Theme,
    Typography
} from "@material-ui/core";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuList: {
            padding: 0,
            color: theme.palette.text.default,
            "& .MuiListItemIcon-root": {
                minWidth: 0,
                paddingRight: theme.spacing(1)
            }
        }
    })
);

interface Props {
    open: boolean;
    anchorEl: HTMLElement | null;
    isDetailedView: boolean;
    onShowMore: () => void;
    onShowLess: () => void;
    onRemoveView: () => void;
    onMenuClose: () => void;
}

export default function Menu(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <MUIMenu
            anchorEl={props.anchorEl}
            getContentAnchorEl={null}
            disableAutoFocusItem={true}
            keepMounted
            open={props.open}
            onClose={props.onMenuClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
            elevation={3}
            data-testid="dropdown-menu"
        >
            <MenuList dense={true} className={classes.menuList}>
                {props.isDetailedView ? (
                    <MenuItem onClick={props.onShowLess} aria-label="show less">
                        <ListItemIcon>
                            <ZoomOutIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Show less</Typography>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={props.onShowMore} aria-label="show more">
                        <ListItemIcon>
                            <ZoomInIcon />
                        </ListItemIcon>
                        <Typography variant="inherit">Show more</Typography>
                    </MenuItem>
                )}

                <MenuItem onClick={props.onRemoveView} aria-label="remove view">
                    <ListItemIcon>
                        <DeleteOutlinedIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Remove view</Typography>
                </MenuItem>
            </MenuList>
        </MUIMenu>
    );
}