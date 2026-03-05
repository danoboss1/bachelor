import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { Color } from "@/constants/TWPalette";
import React, { useMemo, useState, useEffect } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getMonthName } from "@/components/statsDetail/statsDetailComponents";
import { useRouter } from "expo-router";
import { getToken, removeToken } from "../(auth)/tokenStorage";
import { styles } from "../../assets/styles/statsDetail.styles";
import { Icon } from "../../components/ui/Icon";

const { width, height } = Dimensions.get("window")

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

type TolStatRow = {
    id: number;
    time: string;
    fourmovessequencescorrect: number;
    fivemovessequencescorrect: number;
    sixmovessequencescorrect: number;
    totalcorrect: number;
    user_id: number;
    totalscore: number;
};

type MonthlyDay = {
    date: string;
    label: string;
    value: number;
    bestStat: TolStatRow | null;
    categoryIndex: number | null;
}

type MonthlyResponse = {
    userId: number;
    range: { year: number, month: number };
    scoreDefinition: string;
    days: MonthlyDay[];
};

const rawData = [
    {value: 50, dataPointText: '50', label: '15/1'},
    {value: 80, dataPointText: '80', label: '16/1'},
    {value: 100, dataPointText: '100', label: '17/1'},
    {value: 70, dataPointText: '70', label: '18/1'},
    {value: 56, dataPointText: '56', label: '19/1'},
    {value: 78, dataPointText: '78', label: '20/1'},
    {value: 74, dataPointText: '74', label: '21/1', frontColor: '#177AD5'},
];


export default function TOLStatsDetail() {
    const router = useRouter();

    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // activeIndex je mozno selectedBarIndex, ze to je to iste
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

    const [data, setData] = useState<MonthlyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<MonthlyDay | null>(null);
    
    const [activeIndex, setActiveIndex] = useState(rawData.length - 1);

    const trendUrl = "https://bachelor-pi.vercel.app/tolStats/trend";

    const [trendMessage, setTrendMessage] = useState<string | null>(null);

    const url = useMemo(() => {
        return `https://bachelor-pi.vercel.app/tolStats/month?year=${currentYear}&month=${currentMonth + 1}`
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

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setSelectedDay(null);

            try {
                const token = await getToken();
                
                // tuto mozno session expired napisat uzivatelovi
                if (!token) {
                    router.replace("/(auth)/login");
                    return;
                }

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    await removeToken();
                    router.replace("/(auth)/login");
                    return;
                }
                
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

    useEffect(() => {
        let cancelled = false;
        
        async function loadTrend() {
            try {
                const token = await getToken();
                if (!token) return;

                const res = await fetch(trendUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!res.ok) return;

                const json = await res.json();
                if (!cancelled) setTrendMessage(json.message ?? null);
            } catch {}
        }

        loadTrend();
        return () => { cancelled = true; };
    }, []);

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

    const labels = [
        "SEVERE\n0–3 points",
        "POOR\n4–5 points",
        "AVERAGE\n6–8 points",
        "GOOD\n9–11 points",
        "EXCELLENT\n12+ points",
    ];
    
    const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
    const inactiveColor = "#666";

    function getTolCategoryIndex(totalScore: number) {
        if (totalScore <= 3) return 0;
        if (totalScore <= 5) return 1;
        if (totalScore <= 8) return 2;
        if (totalScore <= 11) return 3;
        return 4; // 12+
    }

    function getCategoryInterpretation(index: number) {
        switch (index) {
            case 0: return "Severe difficulties in planning and decision-making";
            case 1: return "Reduced planning and decision-making abilities";
            case 2: return "Average planning and decision-making abilities";
            case 3: return "Above average planning and decision-making abilities";
            case 4: return "Excellent planning and decision-making abilities";
            default: return "";
        }
    }

    const best = selectedDay?.bestStat ?? null;
    const hasBest = !!best;

    const totalScore = Number(best?.totalscore ?? 0);

    const categoryIndex = 
        selectedDay?.categoryIndex ??
        (best ? getTolCategoryIndex(totalScore) : 0);

    // const barData = useMemo(
    //     () =>
    //         rawData.map((item, index) => ({
    //             ...item,
    //             frontColor:
    //                 index === activeIndex
    //                     ? Color.brown[800]
    //                     : Color.brown[400],

    //             topLabelComponent:
    //                 index === activeIndex
    //                     ? () => (
    //                         <Text
    //                             style={{
    //                                 fontSize: 12,
    //                                 fontWeight: "600",
    //                                 color: Color.brown[800],
    //                                 marginBottom: 6,
    //                             }}
    //                         >
    //                             {item.value}
    //                         </Text>
    //                         )
    //                     : undefined,
    //         })),
    //     [activeIndex]    
    // );

    return (
        <View style={styles.screen}>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>ToL Statistics</Text>
                        <Text style={styles.subtitle}>
                            Track your monthly performance
                        </Text>
                    </View>

                    {/* Tento pressable pozriet ci je dobra adresa */}
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backBtn}
                        hitSlop={16}
                    >
                        <Icon symbol={"chevron.backward"} size="sm" color={Color.gray[700]} />
                    </Pressable>
                </View>

                <View style={styles.cardBar}>
                    <Text style={styles.graphTitle}>Total score</Text>

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
                        maxValue={20}
                        stepValue={5}
                        yAxisExtraHeight={20}
                        barBorderRadius={4}
                        frontColor={Color.orange[400]}
                        data={chartData}
                        xAxisThickness={0}
                        yAxisThickness={0}
                        // disableScroll
                        // width={width - CHART_HORIZONTAL_PADDING * 2}
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
            </View>

            {/* <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.statsScroll}> */}
            <ScrollView 
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* INTERPRETATION BAR */}
                <View style={styles.card}>
                    {/* <Text style={styles.cardTitle}>Interpretation</Text> */}
                {/* <View style={styles.scaleContainer}> */}
                    <View style={styles.scaleBar}>
                        {labels.map((label, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.segment,
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
                                    styles.segmentText,
                                    { color: categoryIndex === 2 && index === 2 ? "#333" : "white" }
                                    // { color: index === 2 ? "black" : "white" } // žltý segment čitateľný
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* RESULT TEXT */}


                      {/* ✅ Highlight hneď po scaleBare */}
                    <View style={styles.resultContainer}>
                        {/* ✅ Interpretation = len malé dovysvetlenie */}
                        <Text style={styles.interpretationSmall}>
                            {getCategoryInterpretation(categoryIndex)}
                        </Text>

                        <View style={styles.highlightSingle}>
                            <Text style={styles.highlightValue}>
                                {hasBest ? totalScore : "—"}
                            </Text>
                            <Text style={styles.highlightLabel}>Total score</Text>
                        </View>

                        {/* ✅ TREND = najdôležitejší text */}
                        {trendMessage ? (
                            <Text style={styles.trendPrimary}>
                                {trendMessage}
                            </Text>
                        ) : null}

                    </View>

                </View>

                {/* Vedľajšie štatistiky */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detailed stats</Text>

                    <StatMiniSupplementary label="4-moves sequences" value={5} whole={8} />
                    <StatMiniSupplementary label="5-moves sequences" value={5} whole={8} />
                    <StatMiniSupplementary label="6-moves sequences" value={3} whole={8} />
                    <StatMiniSupplementary label="Total correct sequences" value={13} whole={24} />
                </View>
            </ScrollView>
        </View>
    )
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
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: '600',
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
    }
})

