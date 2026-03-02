import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { Color } from "@/constants/TWPalette";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Icon } from "../../components/ui/Icon"

const { width, height } = Dimensions.get("window");

const CHART_HORIZONTAL_PADDING = width * 0.08;
const NUMBER_OF_BARS = 7;
const SPACING = 12;
const INITIAL_SPACING = 6;
const END_SPACING = 6;

const BAR_WIDTH =
    (width -
        CHART_HORIZONTAL_PADDING * 2 -
        INITIAL_SPACING -
        END_SPACING -
        SPACING * (NUMBER_OF_BARS - 1)) /
    NUMBER_OF_BARS;

type WcstStatRow = {
    id: number;
    time: string;
    categories_completed: number;
    trials_administered: number;
    total_correct: number;
    total_error: number;
    perseverative_responses: number;
    perseverative_errors: number;
    non_perseverative_errors: number;
    failure_to_maintain_set: number;
    trials_to_first_category: number | null;
    perseverativepercent: number;
    perseverativeerrorpercent: number;
    nonperseverativeerrorpercent: number;
    errorpercent: number;
    user_id: number;
};

type MonthlyDay = {
    date: string;
    label: string;
    value: number;
    bestStat: WcstStatRow | null;
    categoryIndex: number | null;
};

type MonthlyResponse = {
    userId: number;
    range: { year: number, month: number };
    scoreDefinition: string;
    days: MonthlyDay[];
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

const rawData = [
    { value: 50, dataPointText: "50", label: "15/1" },
    { value: 80, dataPointText: "80", label: "16/1" },
    { value: 100, dataPointText: "100", label: "17/1" },
    { value: 70, dataPointText: "70", label: "18/1" },
    { value: 56, dataPointText: "56", label: "19/1" },
    { value: 78, dataPointText: "78", label: "20/1" },
    { value: 74, dataPointText: "74", label: "21/1", frontColor: "#177AD5" },
];

const getMonthName = (month: number) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return months[month];
};

interface TimeSeriesData {
    value: number;
    label: string;
}

const generateMonthlyData = (year: number, month: number): TimeSeriesData[] => {
    // month je 1-12
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => ({
        value: Math.floor(Math.random() * 50) + 30,
        label: `${index + 1}`,
    }));
};

export default function WCSTStatsDetail() {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [activeIndex, setActiveIndex] = useState(rawData.length - 1);
    // activeIndex je mozno selectedBarIndex, ze to je to iste
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

    const [data, setData] = useState<MonthlyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<MonthlyDay | null>(null);

    const url = useMemo(() => {
        return `https://bachelor-pi.vercel.app/wcstStats/month?year=${currentYear}&month=${currentMonth + 1}`
    }, [currentYear, currentMonth]);

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedBarIndex(null);
    };

    const monthlyData = useMemo(
        () => generateMonthlyData(currentYear, currentMonth + 1),
        [currentYear, currentMonth]
    );

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setSelectedDay(null);

            try {
                const res = await fetch(url);
                // toto je naco ten druhy riadok
                const json = await res.json();

                // jak toto cancelled sa moze zrazu zmenit
                if (!cancelled) {
                    setData(json);
                }
            } catch (e) {
                // toto neviem ci budem chcet logovat takto
                console.log("Load error: ", e);
            } finally {
                // idk
                if (!cancelled) setLoading(false);
            }
        }

        load();

        // idk
        return () => {
            cancelled = true;
        };
    }, [url]);

    const maxScore = 6;

    // ✅ convenience
    const days = data?.days ?? [];

    // ✅ auto-select last day with stat (or last day)
    useEffect(() => {
        if (!data?.days?.length) return;

        const lastWithStatIndex = [...data.days]
            .map((d, i) => ({ d, i }))
            .filter((x) => x.d.bestStat != null)
            .pop()?.i;

        const idx = lastWithStatIndex ?? data.days.length - 1;

        setSelectedBarIndex(idx);
        setSelectedDay(data.days[idx] ?? null);
    }, [data]);

    const chartData = useMemo(() => {
        return days.map((day, index) => ({
            value: day.value,
            label: day.label,
            frontColor:
                selectedBarIndex === index ? Color.orange[800] : Color.orange[400],
            topLabelComponent:
                selectedBarIndex === index
                    ? () => (
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: Color.orange[800],
                                marginBottom: 6,
                            }}
                        >
                            {day.value}
                        </Text>
                    )
                    : undefined,
        }));
    }, [days, selectedBarIndex]);

    // const chartData = useMemo(() => {
    //     return monthlyData.map((item, index) => ({
    //         ...item,
    //         frontColor:
    //             selectedBarIndex === index ? Color.orange[800] : Color.orange[400],
    //         topLabelComponent:
    //             selectedBarIndex === index
    //                 ? () => (
    //                     <Text
    //                         style={{
    //                             fontSize: 12,
    //                             fontWeight: "600",
    //                             color: Color.orange[800],
    //                             marginBottom: 6,
    //                         }}
    //                     >
    //                         {item.value}
    //                     </Text>
    //                 )
    //                 : undefined,
    //     }));
    // }, [monthlyData, selectedBarIndex, activeIndex]);

    // const barData = useMemo(
    //     () =>
    //         rawData.map((item, index) => ({
    //             ...item,
    //             frontColor: index === activeIndex ? Color.orange[800] : Color.orange[400],
    //             topLabelComponent:
    //                 index === activeIndex
    //                     ? () => (
    //                         <Text
    //                             style={{
    //                                 fontSize: 12,
    //                                 fontWeight: "600",
    //                                 color: Color.orange[800],
    //                                 marginBottom: 6,
    //                             }}
    //                         >
    //                             {item.value}
    //                         </Text>
    //                     )
    //                     : undefined,
    //         })),
    //     [activeIndex]
    // );

    const labels = [
        "VERY POOR\n0-2 categories",
        "POOR\n3-4 categories",
        "NORMAL\n5 categories",
        "GOOD\n6 categories",
        "EXCELLENT\n≤85 cards"
    ];

    const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
    const inactiveColor = "#666";

    /*
CATEGORY LOGIC
*/

    function getCategoryIndex(categoriesCompleted: number, trials: number) {
        if (categoriesCompleted <= 2) return 0;
        if (categoriesCompleted <= 4) return 1;
        if (categoriesCompleted === 5) return 2;
        if (categoriesCompleted === 6 && trials > 85) return 3;
        if (categoriesCompleted === 6 && trials <= 85) return 4;

        return 0;
    }

    function getCategoryInterpretation(index: number) {
        switch (index) {
            case 0: return "Severe impairment of cognitive flexibility";
            case 1: return "Reduced cognitive flexibility";
            case 2: return "Average cognitive flexibility";
            case 3: return "Above average cognitive flexibility";
            case 4: return "Superior cognitive flexibility";
            default: return "";
        }
    }

    // pomocny kod, ked budem ziskavat data z db, tak ho zmenim
    // const categoriesCompleted = 2;
    // const trials = 25;
    // const categoryIndex = getCategoryIndex(categoriesCompleted, trials);

    const best = selectedDay?.bestStat ?? null;

    const categoriesCompleted = Number(best?.categories_completed ?? 0);
    const trials = Number(best?.trials_administered ?? 0);

    const categoryIndex =
    selectedDay?.categoryIndex ??
    (best ? getCategoryIndex(categoriesCompleted, trials) : 0);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Color.orange[100],
            }}
        >
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={localStyles.graphTitle}>Total score</Text>

                {/* Month Navigation */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                        paddingHorizontal: 16,
                    }}
                >
                    <Pressable
                        onPress={() => navigateMonth(-1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Icon
                            symbol={"chevron.backward"}
                            size="sm"
                            color={Color.gray[500]}
                        />
                    </Pressable>

                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: Color.gray[900],
                        }}
                    >
                        {getMonthName(currentMonth)} {currentYear}
                    </Text>

                    <Pressable
                        onPress={() => navigateMonth(1)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                        }}
                        hitSlop={20}
                    >
                        <Icon
                            symbol={"chevron.forward"}
                            size="sm"
                            color={Color.gray[500]}
                        />
                    </Pressable>
                </View>

                <BarChart
                    maxValue={maxScore}
                    stepValue={1}
                    yAxisExtraHeight={20}
                    barBorderRadius={4}
                    frontColor={Color.orange[400]}
                    data={chartData}
                    xAxisThickness={0}
                    yAxisThickness={0}
                    // disableScroll
                    width={width - CHART_HORIZONTAL_PADDING * 2}
                    barWidth={BAR_WIDTH}
                    spacing={SPACING}
                    initialSpacing={INITIAL_SPACING}
                    endSpacing={END_SPACING}
                    xAxisLabelTextStyle={{
                        color: Color.gray[400],
                        fontSize: 12,
                        fontWeight: "500",
                    }}
                    yAxisTextStyle={{
                        color: Color.gray[400],
                        fontSize: 12,
                        fontWeight: "500",
                    }}
                    // onPress={(_item: any, index: number) => {
                    //     // setActiveIndex(index);
                    //     setSelectedBarIndex(index);
                    // }}
                    onPress={(_item: any, index: number) => {
                        setSelectedBarIndex(index);
                        setSelectedDay(days[index] ?? null);
                    }}
                    dashGap={10}
                />
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={localStyles.statsScroll}>
                {/* INTERPRETATION BAR */}
                <View style={localStyles.scaleContainer}>
                    <View style={localStyles.scaleBar}>
                        {labels.map((label, index) => (
                            <View
                                key={index}
                                style={[
                                    localStyles.segment,
                                    {
                                        backgroundColor: index === categoryIndex
                                            ? segmentColors[index] // iba aktuálna kategória svieti
                                            : inactiveColor,       // ostatné tmavosivé
                                        borderRightWidth: index < labels.length - 1 ? 1 : 0,
                                        borderRightColor: "#999" // tenká čiarka medzi segmentmi
                                    }
                                ]}
                            >
                                <Text style={[
                                    localStyles.segmentText,
                                    { color: categoryIndex === 2 && index === 2 ? "#333" : "white" }
                                    // { color: index === 2 ? "black" : "white" } // žltý segment čitateľný
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* RESULT TEXT */}

                    <View style={localStyles.resultContainer}>

                        <Text style={localStyles.resultText}>
                            Categories completed: {categoriesCompleted}
                        </Text>

                        <Text style={localStyles.resultText}>
                            Cards used: {trials}
                        </Text>

                        <Text style={[localStyles.resultInterpretation, { color: "black" }]}>
                            {getCategoryInterpretation(categoryIndex)}
                        </Text>

                    </View>

                </View>

                <StatMiniSupplementary 
                    label={"Percentage of perseverative responses"} 
                    value={Number(best?.perseverativepercent ?? 0)}
                    whole={Number(best?.perseverativepercent ?? 0)} 
                />

                <StatMiniSupplementary 
                    label={"Percentage of perseverative errors"} 
                    value={Number(best?.perseverativeerrorpercent ?? 0)} 
                    whole={Number(best?.perseverativeerrorpercent ?? 0)}
                />

                <StatMiniSupplementary 
                    label={"Percentage of non-perseverative errors"} 
                    value={Number(best?.nonperseverativeerrorpercent ?? 0)}
                    whole={Number(best?.nonperseverativeerrorpercent ?? 0)}
                />

                {/* <StatMiniSupplementary 
                    label="Correct responses" 
                    value={60} 
                /> */}

                <StatMiniSupplementary 
                    label="Errors" 
                    value={Number(best?.total_error ?? 0)}
                />

                <StatMiniSupplementary 
                    label="Percentage of errors" 
                    value={`${Number(best?.errorpercent ?? 0)}%`}
                />

                <StatMiniSupplementary 
                    label="Perseverative responses" 
                    value={Number(best?.perseverative_responses ?? 0)}
                />

                <StatMiniSupplementary 
                    label="Perseverative errors" 
                    value={Number(best?.perseverative_errors ?? 0)}
                />

                <StatMiniSupplementary 
                    label="Non-perseverative errors" 
                    value={Number(best?.non_perseverative_errors ?? 0)}
                />

                <StatMiniSupplementary 
                    label="Trials to complete first category" 
                    value={Number(best?.trials_to_first_category ?? 0)}
                />

                <StatMiniSupplementary 
                    label="Failure to maintain set" 
                    value={Number(best?.failure_to_maintain_set ?? 0)}
                />
            </ScrollView>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: height * 0.026,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#d6c7b9",
    },
    statsScroll: {
        width: "100%",
        alignItems: "center"
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: width * 0.1,
        marginBottom: 8,
        color: "black",
        textAlign: "left",
    },
    tooltip: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        elevation: 4,
        alignItems: "center",
        minWidth: 140,
        maxWidth: 180,
    },
    tooltipTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "black",
    },
    tooltipSubtitle: {
        fontSize: 11,
        color: "gray",
        marginTop: 2,
    },
    scaleContainer: {
        width: width * 0.9,
        flex: 2,
        justifyContent: "center",
    },
    scaleBar: {
        flexDirection: "row",
        height: 60,
        borderRadius: 16,
        overflow: "hidden"
    },
    segment: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    segmentText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 12,
    },
    red: {
        backgroundColor: "#e53935"
    },
    orange: {
        backgroundColor: "#fb8c00"
    },
    yellow: {
        backgroundColor: "#fdd835"
    },
    lightGreen: {
        backgroundColor: "#7cb342"
    },
    darkGreen: {
        backgroundColor: "#2e7d32"
    },
    resultContainer: {
        alignItems: "center",
        marginTop: 32,
    },
    resultText: {
        fontSize: 16,
    },
    resultInterpretation: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "center",
    },
});