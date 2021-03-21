import {Card, CardContent, createStyles, makeStyles, SvgIcon, SvgIconProps} from "@material-ui/core";

function ResizeIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path d="M24 24H19.2V19.2H24V24ZM24 14.4H19.2V9.6H24V14.4ZM14.4 24H9.6V19.2H14.4V24ZM14.4 14.4H9.6V9.6H14.4V14.4ZM4.8 24H0V19.2H4.8V24ZM24 4.8H19.2V0H24V4.8Z" />
        </SvgIcon>
    );
}

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            maxWidth: 500,
            position: "relative"
        },
        resizeIcon: {
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "10px",
            height: "10px",
            "&:hover": {
                cursor: "nw-resize"
            }
        }
    })
);

interface Props {
    children: JSX.Element;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent>{props.children}</CardContent>

            <ResizeIcon className={classes.resizeIcon} color="action" />
        </Card>
    );
}
