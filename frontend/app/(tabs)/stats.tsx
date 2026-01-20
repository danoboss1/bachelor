import { StatsComponent } from '@/components/StatsComponent';
import { Text, View } from '@/components/Themed';
import { ScrollView } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const TOL_STATS_DETAIL_ROUTE = "/tol/TOL_stats_detail"; 

export default function StatsScreen() {
    return (
        <View style={styles.container}>
            {/* vrchna cast pred upravou */}
            <View style={styles.bgTop}>
                <Text style={styles.header}> My Stats </Text>
            </View>

            <View style={styles.bgBottom}>
                <ScrollView>
                    <StatsComponent
                        title={"Wisconsin Card Sorting Test\nBest Attempt"}
                        stats={[
                            { label: "Total number of trials administered", value: 75, percentile: 75 },
                            { label: "Percentage of perseverative responses", value: 60, percentile: 60, showPercentSign: true },
                            { label: "Percentage of perseverative errors", value: 90, percentile: 90, showPercentSign: true },
                            { label: "Percentage of non-perseverative errors", value: 50, percentile: 50, showPercentSign: true },
                        ]}
                        image={require('../../assets/images/backgroundWisconsinCardSortingTest.png')}
                        path={TOL_STATS_DETAIL_ROUTE}
                    />

                    <StatsComponent
                        title={"Tower of London\nBest Attempt"}
                        stats={[
                            { label: "Total score", value: 75, percentile: 75 },
                        ]}
                        image={require('../../assets/images/backgroundTowerOfLondon.png')}
                        path={TOL_STATS_DETAIL_ROUTE}
                    />

                    <StatsComponent
                        title={"Knox's Cube Test\nBest Attempt"}
                        stats={[
                            { label: "Total score", value: 75, percentile: 75 },
                        ]}
                        image={require('../../assets/images/backgroundKnoxsCubeTest.png')}
                        path={TOL_STATS_DETAIL_ROUTE}
                    />
                </ScrollView>
            </View>
        </View>
    )
}
