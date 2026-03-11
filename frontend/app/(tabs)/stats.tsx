import { StatsComponent, StatCard } from '@/components/StatsComponent';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { getToken, removeToken } from "../(auth)/tokenStorage";
import {
    Dimensions,
    StyleSheet,
    Image,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { Color } from "@/constants/TWPalette";
import { COLORS } from '@/constants/Colors';

const { width } = Dimensions.get("window");

const WCST_STATS_DETAIL_ROUTE = "/wcst/WCST_stats_detail";
const TOL_STATS_DETAIL_ROUTE = "/tol/TOL_stats_detail";
const KNOX_STATS_DETAIL_ROUTE = "/knox/KNOX_stats_detail";

const API_URL = "https://bachelor-pi.vercel.app";

type WcstRecentSummaryResponse = {
    userId: number;
    hasEnoughData: boolean;
    windowStart: string | null;
    windowEnd: string | null;
    daysWithResults: number;
    averageCategoriesCompleted: number | null;
    averageTrialsAdministered: number | null;
};

type TolRecentSummaryResponse = {
    userId: number;
    hasEnoughData: boolean;
    windowStart: string | null;
    windowEnd: string | null;
    daysWithResults: number;
    averageTotalScore: number | null;
};

// const data: WcstRecentSummaryResponse = {
//     userId: 1,
//     hasEnoughData: true,
//     windowStart: "2026-03-01",
//     windowEnd: "2026-03-10",
//     daysWithResults: 4,
//     averageCategoriesCompleted: 6,
//     averageTrialsAdministered: 82,
//     // categoryIndex: 4,
//     // interpretation: "Superior cognitive flexibility",
// };

function formatDate(dateString: string | null) {
    if (!dateString) return "—";

    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

function formatDateRange(start: string | null, end: string | null) {
    if (!start || !end) return "No recent data";
    return `${formatDate(start)} - ${formatDate(end)}`;
}

const labels = [
    "VERY POOR\n0-2 categories",
    "POOR\n3-4 categories",
    "NORMAL\n5 categories",
    "GOOD\n6 categories",
    "EXCELLENT\n≤85 cards",
];

const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
const inactiveColor = "#666";

function getCategoryIndexWCST(categoriesCompleted: number, trials: number): number{
    if (categoriesCompleted <= 2) return 0;
    if (categoriesCompleted <= 4) return 1;
    if (categoriesCompleted === 5) return 2;
    if (categoriesCompleted === 6 && trials > 85) return 3;
    if (categoriesCompleted === 6 && trials <= 85) return 4;
    return 0;
}

// ✅ pridané - FE si dopočíta interpretation
function getCategoryInterpretation(index: number) {
    switch (index) {
        case 0:
            return "Severe impairment of cognitive flexibility";
        case 1:
            return "Reduced cognitive flexibility";
        case 2:
            return "Average cognitive flexibility";
        case 3:
            return "Above average cognitive flexibility";
        case 4:
            return "Superior cognitive flexibility";
        default:
            return "";
    }
}

export default function StatsScreen() {
    const router = useRouter();

    const [wcstData, setWcstData] = useState<WcstRecentSummaryResponse | null>(null);
    const [tolData, setTolData] = useState<TolRecentSummaryResponse | null>(null);

    const [loadingWcstRecent, setLoadingWcstRecent] = useState(true);
    const [loadingTolRecent, setLoadingTolRecent] = useState(true);

    // WCST fetch
    useEffect(() => {
        let cancelled = false;

        async function loadRecentAverage() {
            try {
                setLoadingWcstRecent(true);

                const token = await getToken();

                if (!token) {
                    router.replace("/(auth)/login");
                    return;
                }

                const res = await fetch(`${API_URL}/wcstStats/recentAverage`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    await removeToken();
                    router.replace("/(auth)/login");
                    return;
                }

                const json = await res.json();

                if (!cancelled) {
                    setWcstData(json);
                }
            } catch (error) {
                console.log("Failed to load WCST recent average:", error);
            } finally {
                if (!cancelled) {
                    setLoadingWcstRecent(false);
                }
            }
        }

        loadRecentAverage();

        return () => {
            cancelled = true;
        };
    }, [router]);

    // ToL fetch
    useEffect(() => {
        let cancelled = false;

        async function loadTolRecentAverage() {
            try {
                setLoadingTolRecent(true);

                const token = await getToken();

                if (!token) {
                    router.replace("/(auth)/login");
                    return;
                }

                const res = await fetch(`${API_URL}/tolStats/recentAverage`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    await removeToken();
                    router.replace("/(auth)/login");
                    return;
                }

                const json = await res.json();

                if (!cancelled) {
                    setTolData(json);
                }
            } catch (error) {
                console.log("Failed to load TOL recent average:", error);
            } finally {
                if (!cancelled) {
                    setLoadingTolRecent(false);
                }
            }
        }

        loadTolRecentAverage();

        return () => {
            cancelled = true;
        };
    }, [router]);

    // WCST derived values
    const wcstHasBest = !!wcstData?.hasEnoughData;

    const averageCategoriesCompleted = wcstData?.averageCategoriesCompleted ?? null;
    const averageTrialsAdministered = wcstData?.averageTrialsAdministered ?? null;

    const categoryIndex =
        averageCategoriesCompleted != null && averageTrialsAdministered != null
            ? getCategoryIndexWCST(averageCategoriesCompleted, averageTrialsAdministered)
            : 0;

    const interpretation =
        averageCategoriesCompleted != null && averageTrialsAdministered != null
            ? getCategoryInterpretation(categoryIndex)
            : "No recent data";

    // TOL derived values
    const tolHasBest = !!tolData?.hasEnoughData;
    const averageTolTotalScore = tolData?.averageTotalScore ?? null;
    const tolInterpretation =
        averageTolTotalScore != null
            ? "Average total score from recent days"
            : "No recent data";

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.bgTop,
                    {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    },
                ]}
            >
                <Text style={styles.header}> My Stats </Text>

                <Image
                    source={require("../../assets/images/brainee.png")}
                    style={{
                        width: 60,
                        height: 60,
                        resizeMode: "contain",
                        alignSelf: "flex-end",
                        marginBottom: 14,
                        marginRight: "5%",
                    }}
                />
            </View>

            <View style={styles.bgBottom}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StatCard
                        title={"Wisconsin Card Sorting Test\nRecent Average"}
                        path={WCST_STATS_DETAIL_ROUTE}
                        loadingRecent={loadingWcstRecent}
                        windowStart={wcstData?.windowStart ?? null}
                        windowEnd={wcstData?.windowEnd ?? null}
                        categoryIndex={categoryIndex}
                        interpretation={interpretation}
                        hasData={wcstHasBest}
                        primaryValue={averageCategoriesCompleted}
                        primaryLabel="Categories"
                        secondaryValue={averageTrialsAdministered}
                        secondaryLabel="Cards used"
                    />

                    <StatCard
                        title={"Tower of London\nRecent Average"}
                        path={TOL_STATS_DETAIL_ROUTE}
                        loadingRecent={loadingTolRecent}
                        windowStart={tolData?.windowStart ?? null}
                        windowEnd={tolData?.windowEnd ?? null}
                        categoryIndex={0}
                        interpretation={tolInterpretation}
                        hasData={tolHasBest}
                        primaryValue={averageTolTotalScore}
                        primaryLabel="Total score"
                        // secondaryValue={averageTrialsAdministered}
                        // secondaryLabel="Cards used"
                    />

                    <StatCard
                        title={"Knox's Cube Test\nRecent Average"}
                        path={KNOX_STATS_DETAIL_ROUTE} // CHANGED
                        loadingRecent={false} // CHANGED
                        windowStart={null} // CHANGED
                        windowEnd={null} // CHANGED
                        categoryIndex={0}
                        interpretation={"No recent data"}
                        hasData={false}
                        primaryValue={null}
                        primaryLabel="Score"
                    />

                    <View style={localStyles.card}>
                        <ImageBackground
                            source={require("../../assets/images/backgroundBroskyna.png")}
                            style={localStyles.cardBackground}
                            imageStyle={localStyles.cardImage}
                        >
                            <View style={localStyles.cardOverlay}>
                                {/* <View style={localStyles.titleRow}>
                                    <Text style={localStyles.dateBadge}>
                                        {formatDateRange(data.windowStart, data.windowEnd)}
                                    </Text>

                                    <Text style={localStyles.cardTitle}>
                                        Wisconsin Card Sorting Test{"\n"}Recent Performance
                                    </Text>
                                </View> */}

                                <View style={localStyles.titleRow}>
                                    <Text style={localStyles.dateText}>
                                        {formatDateRange(wcstData?.windowStart ?? null, wcstData?.windowEnd ?? null)}
                                    </Text>

                                    <Text style={localStyles.cardTitle}>
                                        Wisconsin Card Sorting Test{"\n"}Recent Average
                                    </Text>
                                </View>
                                
                                {loadingWcstRecent ? (
                                    <View style={localStyles.loadingContainer}>
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                    </View>
                                ) : (
                                    <>
                                        <View style={localStyles.scaleBar}>
                                            {labels.map((label, index) => (
                                                <View
                                                    key={index}
                                                    style={[
                                                        localStyles.segment,
                                                        {
                                                            backgroundColor:
                                                                index === categoryIndex
                                                                    ? segmentColors[index]
                                                                    : inactiveColor,
                                                            borderRightWidth:
                                                                index < labels.length - 1 ? 1 : 0,
                                                            borderRightColor: "#999",
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            localStyles.segmentText,
                                                            {
                                                                color:
                                                                    categoryIndex === 2 && index === 2
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

                                        <View style={localStyles.resultContainer}>
                                            <Text style={localStyles.interpretationSmall}>
                                                {interpretation}
                                            </Text>

                                            <View style={localStyles.highlightRow}>
                                                <View style={localStyles.highlightBox}>
                                                    <Text style={localStyles.highlightValue}>
                                                        {wcstHasBest ? averageCategoriesCompleted : "—"}
                                                    </Text>
                                                    <Text style={localStyles.highlightLabel}>
                                                        Categories
                                                    </Text>
                                                </View>

                                                <View style={localStyles.highlightDivider} />

                                                <View style={localStyles.highlightBox}>
                                                    <Text style={localStyles.highlightValue}>
                                                        {wcstHasBest ? averageTrialsAdministered : "—"}
                                                    </Text>
                                                    <Text style={localStyles.highlightLabel}>
                                                        Cards used
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={localStyles.moreLink}
                                    onPress={() => router.push(WCST_STATS_DETAIL_ROUTE)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={localStyles.moreLinkText}>View details</Text>
                                    <Text style={localStyles.moreLinkArrow}>→</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>

                    <View style={localStyles.card}>
                        <ImageBackground
                            source={require("../../assets/images/backgroundBroskyna.png")}
                            style={localStyles.cardBackground}
                            imageStyle={localStyles.cardImage}
                        >
                            <View style={localStyles.cardOverlay}>

                                <View style={localStyles.titleRow}>
                                    <Text style={localStyles.dateText}>
                                        tu bude naformatovany datum
                                    </Text>

                                    <Text style={localStyles.cardTitle}>
                                        Tower of London{"\n"}Recent Average
                                    </Text>
                                </View>

                                {loadingTolRecent ? (
                                    <View style={localStyles.loadingContainer}>
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                    </View>
                                ) : (
                                    <>
                                        <View style={localStyles.scaleBar}>
                                            {labels.map((label, index) => (
                                                <View
                                                    key={index}
                                                    style={[
                                                        localStyles.segment,
                                                        {
                                                            backgroundColor:
                                                                index === categoryIndex
                                                                    ? segmentColors[index]
                                                                    : inactiveColor,
                                                            borderRightWidth:
                                                                index < labels.length - 1 ? 1 : 0,
                                                            borderRightColor: "#999",
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            localStyles.segmentText,
                                                            {
                                                                color:
                                                                    categoryIndex === 2 && index === 2
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

                                        <View style={localStyles.resultContainer}>
                                            <Text style={localStyles.interpretationSmall}>
                                                {interpretation}
                                            </Text>

                                            <View style={localStyles.highlightRow}>
                                                <View style={localStyles.highlightBox}>
                                                    <Text style={localStyles.highlightValue}>
                                                        {tolHasBest ? averageCategoriesCompleted : "—"}
                                                    </Text>
                                                    <Text style={localStyles.highlightLabel}>
                                                        Categories
                                                    </Text>
                                                </View>

                                                <View style={localStyles.highlightDivider} />

                                                <View style={localStyles.highlightBox}>
                                                    <Text style={localStyles.highlightValue}>
                                                        {tolHasBest ? averageTrialsAdministered : "—"}
                                                    </Text>
                                                    <Text style={localStyles.highlightLabel}>
                                                        Cards used
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={localStyles.moreLink}
                                    onPress={() => router.push(WCST_STATS_DETAIL_ROUTE)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={localStyles.moreLinkText}>View details</Text>
                                    <Text style={localStyles.moreLinkArrow}>→</Text>
                                </TouchableOpacity>

                            </View>
                        </ImageBackground>
                    </View>

                    <StatsComponent
                        title={"Tower of London\nBest Attempt"}
                        stats={[
                            { label: "Total score", value: 3.2, percentile: 83 },
                        ]}
                        image={require("../../assets/images/backgroundBroskyna.png")}
                        path={TOL_STATS_DETAIL_ROUTE}
                    />

                    <StatsComponent
                        title={"Knox's Cube Test\nBest Attempt"}
                        stats={[
                            { label: "Total score", value: 8.6, percentile: 52 },
                        ]}
                        image={require("../../assets/images/backgroundBroskyna.png")}
                        path={KNOX_STATS_DETAIL_ROUTE}
                    />
                </ScrollView>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        width: width * 0.9,
        borderRadius: 16,
        marginBottom: 16,
        marginTop: 20,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginHorizontal: width * 0.05,
        backgroundColor: "transparent",
    },
    cardBackground: {
        width: "100%",
    },
    cardImage: {
        borderRadius: 16,
    },
    cardOverlay: {
        padding: 16,
    },
    titleRow: {
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Color.gray[900],
        textAlign: "center",
    },
    dateBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        fontSize: 11,
        fontWeight: "700",
        color: Color.gray[700],
        backgroundColor: "rgba(255,255,255,0.82)",
        paddingHorizontal: 8,
        // paddingBottom: 8,
        // marginBottom: 54,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: "hidden",
    },
    scaleBar: {
        flexDirection: "row",
        height: 60,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
    },
    segment: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        paddingVertical: 4,
    },
    segmentText: {
        color: "white",
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 11,
    },
    highlightRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.78)",
        borderWidth: 1,
        borderColor: "#F0D8C9",
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "100%",
    },
    highlightBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    highlightValue: {
        fontSize: 22,
        fontWeight: "900",
        color: Color.gray[900],
    },
    highlightLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: Color.gray[600],
        textAlign: "center",
    },
    highlightDivider: {
        width: 1,
        height: 36,
        backgroundColor: "#EBCFC0",
    },
    resultContainer: {
        alignItems: "center",
        width: "100%",
    },
    interpretationSmall: {
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "700",
        color: Color.gray[800],
        textAlign: "center",
        paddingHorizontal: 6,
    },
    moreLink: {
        marginTop: 14,
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 11,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.55)",
        borderWidth: 2,
        borderColor: "#EED7C8",
        // borderColor: COLORS.primary
    },
    moreLinkText: {
        fontSize: 14,
        fontWeight: "700",
        color: Color.gray[700],
    },
    moreLinkArrow: {
        fontSize: 16,
        fontWeight: "800",
        color: Color.gray[700],
    },
    dateText: {
        alignSelf: "flex-end",
        fontSize: 11,
        fontWeight: "600",
        color: Color.gray[600],
        marginBottom: 6,
    },
    loadingContainer: {
        paddingVertical: 30,
        alignItems: "center",
        justifyContent: "center",
    },
});