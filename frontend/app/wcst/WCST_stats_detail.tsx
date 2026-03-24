import { StatMiniSupplementary } from "@/components/StatsComponent";
import { Color } from "@/constants/TWPalette";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";
import { getToken, removeToken } from "@/app/(auth)/tokenStorage";
import { styles } from "@/assets/styles/statsDetail.styles";
import { formatDate } from "@/components/statsDetail/utils";
import { BAR_WIDTH, END_SPACING, INITIAL_SPACING, SPACING } from "@/components/statsDetail/chartConstants";
import { StatsDetailHeader } from "@/components/statsDetail/statsDetailHeader";
import { MonthNavigator } from "@/components/statsDetail/monthNavigator";

const { width, height } = Dimensions.get("window");

const MAX_SCORE = 6;

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

type TrendResponse = {
    userId: number;
    hasEnoughData: boolean;
    trend: "improving" | "declining" | "stable" | null;
    message: string | null;
    recentWindowStart: string | null;
    recentWindowEnd: string | null;
    baselineAvg?: number;
    recentAvg?: number;
    avgDeltaPct?: number;
    reason?: string;
};


export default function WCSTStatsDetail() {
    const router = useRouter();

    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

    const [data, setData] = useState<MonthlyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<MonthlyDay | null>(null);

    const [error, setError] = useState<string | null>(null);

    const trendUrl = "https://bachelor-pi.vercel.app/wcstStats/trend";

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
                console.error("Failed to load WCST stats:", e);

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
        "VERY POOR\n0-2 categories",
        "POOR\n3-4 categories",
        "NORMAL\n5 categories",
        "GOOD\n6 categories",
        "EXCELLENT\n≤85 cards"
    ];

    const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
    const inactiveColor = "#666";

    function getCategoryIndex(categoriesCompleted: number, trials: number) {
        if (categoriesCompleted <= 2) return 0;
        if (categoriesCompleted <= 4) return 1;
        if (categoriesCompleted === 5) return 2;
        if (categoriesCompleted === 6 && trials > 85) return 3;
        if (categoriesCompleted === 6 && trials <= 85) return 4;

        return 0;
    }

    function getCategoryInterpretation(index: number | null) {
        if (index === null) {
            return "No test was performed on this day";
        }

        switch (index) {
            case 0: return "Severe impairment of cognitive flexibility";
            case 1: return "Reduced cognitive flexibility";
            case 2: return "Average cognitive flexibility";
            case 3: return "Above average cognitive flexibility";
            case 4: return "Superior cognitive flexibility";
            default: return "";
        }
    }

    const best = selectedDay?.bestStat ?? null;
    const hasBest = !!best;

    const categoriesCompleted = Number(best?.categories_completed ?? 0);
    const trials = Number(best?.trials_administered ?? 0);

    const categoryIndex =
        selectedDay?.bestStat == null
            ? null
            : (selectedDay?.categoryIndex ??
                (best ? getCategoryIndex(categoriesCompleted, trials) : null));

    const trendMessage = trendData?.message ?? null;

    const selectedStatDate = selectedDay?.date ?? null;

    return (
        <View style={styles.screen}>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <StatsDetailHeader
                    title="WCST Statistics"
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
                                        borderRightColor: "#999"
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.segmentText,
                                    {
                                        color: categoryIndex !== null && categoryIndex === 2 && index === 2 ? "#333" : "white"
                                    }
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.resultContainer}>
                        <Text style={styles.interpretationSmall}>
                            {getCategoryInterpretation(categoryIndex)}
                        </Text>

                        <View style={styles.highlightRow}>
                            <View style={styles.highlightBox}>
                                <Text style={styles.highlightValue}>
                                {hasBest ? categoriesCompleted : "—"}
                                </Text>
                                <Text style={styles.highlightLabel}>Categories</Text>
                            </View>

                            <View style={styles.highlightDivider} />

                            <View style={styles.highlightBox}>
                                <Text style={styles.highlightValue}>
                                {hasBest ? trials : "—"}
                                </Text>
                                <Text style={styles.highlightLabel}>Cards used</Text>
                            </View>
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
                        label={"Percentage of perseverative responses"}
                        value={hasBest ? `${Number(best?.perseverativepercent ?? 0)}%` : "—"}
                    />

                    <StatMiniSupplementary
                        label={"Percentage of perseverative errors"}
                        value={hasBest ? `${Number(best?.perseverativeerrorpercent ?? 0)}%` : "—"}
                    />

                    <StatMiniSupplementary
                        label={"Percentage of non-perseverative errors"}
                        value={hasBest ? `${Number(best?.nonperseverativeerrorpercent ?? 0)}%` : "—"}
                    />

                    <StatMiniSupplementary
                        label="Errors"
                        value={hasBest ? Number(best?.total_error ?? 0) : "—"}
                    />

                    <StatMiniSupplementary
                        label="Percentage of errors"
                        value={hasBest ? `${Number(best?.errorpercent ?? 0)}%` : "—"}
                    />

                    <StatMiniSupplementary
                        label="Perseverative responses"
                        value={hasBest ? Number(best?.perseverative_responses ?? 0) : "—"}
                    />

                    <StatMiniSupplementary
                        label="Perseverative errors"
                        value={hasBest ? Number(best?.perseverative_errors ?? 0) : "—"}
                    />

                    <StatMiniSupplementary
                        label="Non-perseverative errors"
                        value={hasBest ? Number(best?.non_perseverative_errors ?? 0) : "—"}
                    />

                    <StatMiniSupplementary
                        label="Trials to complete first category"
                        value={hasBest ? Number(best?.trials_to_first_category ?? 0) : "—"}
                    />

                    <StatMiniSupplementary
                        label="Failure to maintain set"
                        value={hasBest ? Number(best?.failure_to_maintain_set ?? 0) : "—"}
                    />
                </View>
            </ScrollView>
        </View>
    );
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