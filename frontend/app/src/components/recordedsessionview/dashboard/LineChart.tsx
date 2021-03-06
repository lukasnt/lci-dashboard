import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {MMDVariables, Variable} from "../../../constants";
import {
    currentRecordingInterval,
    recordedSessionState,
    selectedRecordedSessionLayoutState,
    selectedRecordingActiveContainersState
} from "../../../state/recordedSession";
import theme from "../../../theme";

interface Props {
    variable: Variable;
}

/**
 * A line chart for a given variable.
 * @param {object} props - Component props
 * @param {Variable} props.variable - The variable to render the line chart for
 */
function LineChart(props: Props): JSX.Element {
    const chart = useRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>(null);

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            marginLeft: 40
        },
        title: {
            text: undefined
        },
        plotOptions: {
            series: {
                animation: false,
                color: theme.palette.secondary.main,
                states: {
                    hover: {
                        lineWidthPlus: 0
                    },
                    inactive: {
                        opacity: 1
                    }
                },
                marker: {
                    symbol: "circle",
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                dataGrouping: {
                    approximation: "average",
                    groupPixelWidth: 20,
                    dateTimeLabelFormats: {
                        millisecond: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        second: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        minute: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        hour: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"]
                    }
                }
            },
            line: {
                marker: {
                    enabled: false
                },
                lineWidth: 2,
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: {
            min: 0,
            max: MMDVariables[props.variable].maxValue,
            title: {
                text: undefined
            },
            gridLineWidth: 0,
            opposite: false,
            showLastLabel: true
        },
        xAxis: {
            type: "datetime",
            minTickInterval: 1000 * 5, // Show xAxis labels minimum every 5 second
            lineWidth: 0,
            tickLength: 0,
            ordinal: false,
            crosshair: false
        },
        time: {
            timezoneOffset: new Date().getTimezoneOffset()
        },
        tooltip: {
            borderWidth: 0,
            split: false,
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S"
            },
            valueDecimals: 2,
            shadow: false,
            borderRadius: 8,
            backgroundColor: theme.palette.background.tooltip,
            style: {
                color: "#FFFFFF"
            }
        }
    });

    const recordedSession = useRecoilValue(recordedSessionState);
    const selectedRecordingInterval = useRecoilValue(currentRecordingInterval);

    const selectedRecordingActiveContainers = useRecoilValue(selectedRecordingActiveContainersState);
    const selectedRecordingLayout = useRecoilValue(selectedRecordedSessionLayoutState);

    /**
     * Listens on change in interval state and sets the x-axis' min and max values accordingly
     */
    useEffect(() => {
        if (chart.current && selectedRecordingInterval) {
            chart.current.chart.xAxis[0].setExtremes(
                selectedRecordingInterval.start,
                selectedRecordingInterval.end,
                true // Redraw graph
            );
        }
    }, [selectedRecordingInterval]);

    /**
     * Insert the data for the selected recording and variable into the chart
     */
    useEffect(() => {
        if (chart.current && recordedSession) {
            // For each interval in the recording, add a series to the chart
            Object.entries(recordedSession.data).forEach(([recordingId, data]) => {
                chart.current?.chart.addSeries(
                    {
                        type: "line",
                        id: recordingId,
                        name: MMDVariables[props.variable].name,
                        data: data.timestamps.map((timestamp, index) => {
                            const value = +data[props.variable][index];
                            return [timestamp, +value !== -1 ? +value.toFixed(2) : null];
                        }),
                        linkedTo: ":previous"
                    },
                    false // Do not redraw chart
                );
            });

            // Redraw when all intervals has been added
            chart.current.chart.redraw();
        }
    }, [recordedSession]);

    /**
     * If active containers/layout is changed, reflow graph as container size may have changed
     */
    useEffect(() => {
        if (chart.current) {
            chart.current.chart.reflow();
        }
    }, [selectedRecordingActiveContainers, selectedRecordingLayout]);

    return (
        <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} ref={chart} />
    );
}

export default React.memo(LineChart);
