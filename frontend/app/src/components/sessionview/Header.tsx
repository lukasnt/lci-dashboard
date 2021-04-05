import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Typography, IconButton, Theme} from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import RecordingButton from "./RecordingButton";
import {selectedSessionIdState, selectedSessionState} from "../../state/session";
import {useRecoilValue, useSetRecoilState} from "recoil";
import HeaderWrapper from "../common/HeaderWrapper";
import InfoItem from "../common/InfoItem";
import {AddChartIcon, CloseIcon} from "../common/Icons";
import {selectChartsPopupOpenState, quitSessionPopupOpenState} from "../../state/popup";
import {StyledTooltipBottom} from "../common/Tooltips";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import WatchIcon from "@material-ui/icons/Watch";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import FaceIcon from "@material-ui/icons/Face";
import {Icon} from "../dashboard/Tooltip";
import {Device} from "../../constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        indicatorContainer: {
            display: "grid",
            gridTemplateColumns: "8px max-content",
            gap: theme.spacing(1)
        },
        indicatorIcon: {
            alignSelf: "center",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7BAF62"
        }
    })
);

export default function Header(): JSX.Element {
    const classes = useStyles();

    const setSelectChartsPopupOpen = useSetRecoilState(selectChartsPopupOpenState);
    const setQuitSessionPopupOpen = useSetRecoilState(quitSessionPopupOpenState);
    const selectedSession = useRecoilValue(selectedSessionIdState);

    // TODO: use all sessions state to get current variable

    const selectedSessionInfo = useRecoilValue(selectedSessionState);
    const [duration, setDuration] = useState<string>("");

    useEffect(() => {
        // Set the current duration initially when the compnent loads
        setCurrentDuration();

        // Interval that updates the duration state every second
        let intervalId: NodeJS.Timeout | null = null;
        intervalId = setInterval(() => {
            setCurrentDuration();
        }, 1000);

        return function cleanup() {
            if (intervalId) clearInterval(intervalId);
        };
    }, [selectedSessionInfo, setCurrentDuration]);

    // This function finds the current duration based on startTime in selectedSessionInfo and by using the current time
    function setCurrentDuration() {
        if (selectedSessionInfo) {
            const d = new Date().getTime();
            let distance = d - selectedSessionInfo.startTime;
            const hours = Math.floor(distance / 3600000);
            distance -= hours * 3600000;
            const minutes = Math.floor(distance / 60000);
            distance -= minutes * 60000;
            const seconds = Math.floor(distance / 1000);
            setDuration(`${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
        }
    }

    return (
        <>
            <HeaderWrapper
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /**@ts-ignore */
                title={selectedSession != null ? selectedSessionInfo.sessionName : "All Sessions"}
                infoBar={
                    selectedSession != null ? (
                        <>
                            <div className={classes.indicatorContainer}>
                                <div className={classes.indicatorIcon}></div>

                                {/**
                                 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                 * @ts-ignore */}
                                <Typography>{selectedSessionInfo.student.name}</Typography>
                            </div>
                            <InfoItem icon={<TimerIcon />} text={duration} />
                        </>
                    ) : (
                        <div className={classes.indicatorContainer} style={{gridTemplateColumns: "16px max-content"}}>
                            <Icon device={Device.VideoBody} color={"#535353"} />
                            <Typography>{"Wristband"}</Typography>
                        </div>
                    )
                }
                buttonGroup={
                    <>
                        {selectedSession != null ? <RecordingButton /> : <></>}

                        <StyledTooltipBottom title="Select views">
                            <IconButton
                                aria-label="select views"
                                onClick={() => {
                                    setSelectChartsPopupOpen(true);
                                }}
                            >
                                <AddChartIcon />
                            </IconButton>
                        </StyledTooltipBottom>
                        <StyledTooltipBottom title="Quit session">
                            <IconButton
                                aria-label="quit student session"
                                onClick={() => {
                                    setQuitSessionPopupOpen(true);
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </StyledTooltipBottom>
                    </>
                }
            />
        </>
    );
}
