import { StatMiniSupplementary } from "@/components/StatsComponent";
import { Color } from "@/constants/TWPalette";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { BAR_WIDTH, END_SPACING, INITIAL_SPACING, SPACING} from "@/components/statsDetail/chartConstants";
import { useRouter } from "expo-router";
import { getToken, removeToken } from "@/app/(auth)/tokenStorage";
import { styles } from "@/assets/styles/statsDetail.styles";
import { StatsDetailHeader } from "@/components/statsDetail/statsDetailHeader";
import { MonthNavigator } from "@/components/statsDetail/monthNavigator";
import { formatDate } from "@/components/statsDetail/utils";

const { width, height } = Dimensions.get("window");

const MAX_SCORE = 5;

type KnoxStatRow = {
    id: number;
    time: string | null;
    threestepsequencescorrect: number;
    fourstepsequencescorrect: number;
    fivestepsequencescorrect: number;
    sixstepsequencescorrect: number;
    sevenstepsequencescorrect: number;
    eightstepsequencescorrect: number;
    totalcorrect: number;
    user_id: number;
    totalscore: number | null;
};

type MonthlyDay = {
    date: string;
    label: string;
    value: number;
    bestStat: KnoxStatRow | null;
    categoryIndex: number | null;
};

type MonthlyResponse = {
    userId: number;
    range: { year: number, month: number };
    scoreDefinition: string;
    days: MonthlyDay[];
};

type TrendResponse = {
    userId: number;
    hasEnoughData: boolean;
    trend: "improving" | "declining" | "stable" | null;
    message: string | null;
    baselineAvg?: number;
    recentAvg?: number;
    avgDeltaPct?: number;
    reason?: string;
};


export default function TOLStatsDetail() {
    const router = useRouter();

    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

    const [data, setData] = useState<MonthlyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<MonthlyDay | null>(null);
    
    const [error, setError] = useState<string | null>(null);

    const trendUrl = "https://bachelor-pi.vercel.app/knoxStats/trend";

    const [trendData, setTrendData] = useState<TrendResponse | null>(null);

    const chartScrollRef = useRef<any>(null);

    const scrollToBar = (index: number) => {
        const x =
            INITIAL_SPACING +
            index * (BAR_WIDTH + SPACING) -
                width * 0.35;

        chartScrollRef.current?.scrollTo?.({
            x: Math.max(0, x),
            animated: true,
        });
    };

    const url = useMemo(() => {
        return `https://bachelor-pi.vercel.app/knoxStats/month?year=${currentYear}&month=${currentMonth + 1}`
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

            if (!cancelled) {
                setError(null);
            }

            try {
                const token = await getToken();

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

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const json = await res.json();

                if (!cancelled) {
                    setData(json);
                }
            } catch (e) {
                console.error("Failed to load Knox stats:", e);

                if (!cancelled) {
                    setError("Failed to load statistics. Please try again.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [url, router]);

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

                const json: TrendResponse = await res.json();
                if (!cancelled) setTrendData(json);
            } catch {}
        }

        loadTrend();
        return () => { 
            cancelled = true; 
        };
    }, []);

    const days = data?.days ?? [];

    useEffect(() => {
        if (!data?.days?.length) return;

        const lastWithStatIndex = [...data.days]
            .map((d, i) => ({ d, i }))
            .filter((x) => x.d.bestStat != null)
            .pop()?.i;

        const idx = lastWithStatIndex ?? data.days.length - 1;

        setSelectedBarIndex(idx);
        setSelectedDay(data.days[idx] ?? null);

        requestAnimationFrame(() => {
            scrollToBar(idx);
        });
    }, [data]);

    const chartData = useMemo(() => {
        return days.map((day, index) => ({
            value: day.value,
            label: day.label,
            frontColor:
                day.bestStat == null
                    ? (selectedBarIndex === index ? Color.gray[500] : Color.gray[300]) 
                    : (selectedBarIndex === index ? Color.orange[800] : Color.orange[400]),
            topLabelComponent:
                selectedBarIndex === index
                    ? () => (
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: day.bestStat == null ? Color.gray[500] : Color.orange[800],
                                marginBottom: 6,
                            }}
                        >
                            {day.bestStat == null ? "—" : day.value}
                        </Text>
                    )
                    : undefined,
        }));
    }, [days, selectedBarIndex]);
    
    const labels = [
        "SEVERE\n0 – <0.6",
        "POOR\n0.6 – <1.5",
        "AVERAGE\n1.5 – <3.0",
        "GOOD\n3.0 – <4.0",
        "EXCELLENT\n4.0 – 4.6"
    ];

    const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
    const inactiveColor = "#666";

    function getKnoxCategoryIndex(totalScore: number) {
        if (totalScore < 0.6) return 0;
        if (totalScore < 1.5) return 1;
        if (totalScore < 3) return 2;
        if (totalScore < 4) return 3;
        return 4;
    }

    function getKnoxCategoryInterpretation(index: number | null) {
        if (index === null) {
            return "No test was performed on this day";
        }

        switch (index) {
            case 0:
                return "Severe difficulties in working memory and inhibition";
            case 1:
                return "Reduced working memory and inhibitory control";
            case 2:
                return "Average working memory and inhibition";
            case 3:
                return "Above average working memory and inhibitory skills";
            case 4:
                return "Excellent working memory and inhibition";
            default:
                return "";
        }
    }

    const best = selectedDay?.bestStat ?? null;
    const hasBest = !!best;

    const totalScore = Number(best?.totalscore ?? 0);

    const categoryIndex =
        selectedDay?.bestStat == null
            ? null
            : getKnoxCategoryIndex(totalScore);
    
    const trendMessage = trendData?.message ?? null;

    const selectedStatDate = selectedDay?.date ?? null;

    return (
        <View style={styles.screen}>
            <View style={{ flex:1, justifyContent:"center" }}>
                <StatsDetailHeader
                    title="Knox Statistics"
                    subtitle="Track your monthly performance"
                    onBack={() => router.back()}
                />
                
                {error && (
                    <View style={errorStyles.container}>
                        <Text style={errorStyles.text}>{error}</Text>
                    </View>
                )}

                <View style={styles.cardBar}>
                    <Text style={styles.graphTitle}>Total score</Text>

                    <MonthNavigator
                        month={currentMonth}
                        year={currentYear}
                        onPrev={() => navigateMonth(-1)}
                        onNext={() => navigateMonth(1)}
                    />

                    <BarChart
                        maxValue={MAX_SCORE}
                        stepValue={1}
                        yAxisExtraHeight={20}
                        formatYLabel={(label) => Number(label).toFixed(1)}
                        scrollRef={chartScrollRef}
                        barBorderRadius={4}
                        frontColor={Color.orange[400]}
                        data={chartData}
                        xAxisThickness={0}
                        yAxisThickness={0}
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
                        onPress={(_item: any, index: number) => {
                            setSelectedBarIndex(index);
                            setSelectedDay(days[index] ?? null);
                            scrollToBar(index);
                        }}
                        dashGap={10}
                    />
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >   
                <View style={styles.card}>
                    <Text style={dateHeaderStyles.dateText}>
                        {formatDate(selectedStatDate)}
                    </Text>

                    <View style={styles.scaleBar}>
                        {labels.map((label, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor:
                                            categoryIndex === null
                                                ? inactiveColor
                                                : index === categoryIndex
                                                    ? segmentColors[index]
                                                    : inactiveColor,
                                        borderRightWidth: index < labels.length - 1 ? 1 : 0,
                                        borderRightColor: "#999",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        {
                                            color:
                                                categoryIndex !== null &&
                                                categoryIndex === 2 &&
                                                index === 2
                                                    ? "#333"
                                                    : "white",
                                        },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.resultContainer}>
                        <Text style={styles.interpretationSmall}>
                            {getKnoxCategoryInterpretation(categoryIndex)}
                        </Text>

                        {/* ✅ KNOX: iba jedna hodnota cez celú šírku */}
                        <View style={knoxStyles.singleHighlightBox}>
                            <Text style={styles.highlightValue}>
                                {hasBest ? totalScore : "—"}
                            </Text>
                            <Text style={styles.highlightLabel}>Total score</Text>
                        </View>

                        {trendMessage ? (
                            <Text style={styles.trendPrimary}>
                                {trendMessage}
                            </Text>
                        ) : null}
                    </View>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detailed stats</Text>

                    <StatMiniSupplementary 
                        label={"3-step sequences"}
                        value={hasBest ? `${Number(best?.threestepsequencescorrect ?? 0)}` : "—"}
                        whole={2}
                    />

                    <StatMiniSupplementary 
                        label={"4-step sequences"}
                        value={hasBest ? `${Number(best?.fourstepsequencescorrect ?? 0)}` : "—"}
                        whole={4}
                    />

                    <StatMiniSupplementary 
                        label={"5-step sequences"}
                        value={hasBest ? `${Number(best?.fivestepsequencescorrect ?? 0)}` : "—"}
                        whole={4}
                    />

                    <StatMiniSupplementary 
                        label={"6-step sequences"}
                        value={hasBest ? `${Number(best?.sixstepsequencescorrect ?? 0)}` : "—"}
                        whole={3}
                    />

                    <StatMiniSupplementary 
                        label={"7-step sequences"}
                        value={hasBest ? `${Number(best?.sevenstepsequencescorrect ?? 0)}` : "—"}
                        whole={3}
                    />

                    <StatMiniSupplementary 
                        label={"8-step sequences"}
                        value={hasBest ? `${Number(best?.eightstepsequencescorrect ?? 0)}` : "—"}
                        whole={2}
                    />

                    <StatMiniSupplementary 
                        label={"Total correct sequences"}
                        value={hasBest ? `${Number(best?.totalcorrect ?? 0)}` : "—"}
                        whole={18}
                    />
                 </View>
            </ScrollView>
        </View>
    )
}


const dateHeaderStyles = StyleSheet.create({
    dateText: {
        alignSelf: "flex-end",
        fontSize: 11,
        fontWeight: "600",
        color: Color.gray[600],
        marginBottom: 12,
    },
});

const errorStyles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },
    text: {
        color: "#B91C1C",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
});

const knoxStyles = StyleSheet.create({
    singleHighlightBox: {
        marginTop: 12,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
});