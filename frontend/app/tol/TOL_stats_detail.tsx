import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width, height } = Dimensions.get("window")

const lineData = [
    {value: 50, dataPointText: '50', label: '15/1'},
    {value: 80, dataPointText: '80', label: '16/1'},
    {value: 90, dataPointText: '90', label: '17/1'},
    {value: 70, dataPointText: '70', label: '18/1'},
    {value: 56, dataPointText: '56', label: '19/1'},
    {value: 78, dataPointText: '78', label: '20/1'},
    {value: 74, dataPointText: '74', label: '21/1'},
];

// const data = [ {value:50}, {value:80}, {value:90}, {value:70} ]

const FocusLabel = ({ item }: any) => {
    return (
        <View style={localStyles.tooltip}>
            <Text style={localStyles.tooltipTitle}>
                Total score: {item.value}
            </Text>
            <Text style={localStyles.tooltipSubtitle}>
                {item.percentile}% percentile
            </Text>
        </View>
    )
}

export default function TOLStatsDetail() {
    return (
        <View style={{
            flex: 1,
            // justifyContent: "center", // vertikálne centrovanie
            // alignItems: "center",     // horizontálne centrovanie
        }}>

            <View style={{flex:1, justifyContent:"center"}}>
                <Text style={localStyles.graphTitle}>Total score</Text>
                <LineChart 
                    data={lineData} 
                    height={250}
                    showVerticalLines
                    spacing={44}
                    initialSpacing={44}
                    color="skyblue"
                    dataPointsHeight={6}
                    dataPointsWidth={6}
                    dataPointsColor="blue"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    focusEnabled

                    focusedDataPointLabelComponent={(item: any) => (
                        <FocusLabel item={item} />
                    )}

                    onFocus={() => {
                        console.log("Focused point:");
                    }}
                />
            </View>

            {/* Hlavná štatistika */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={localStyles.statsScroll}>
                <StatMini
                    label="Total score"
                    value={7.3}
                    percentile={64}
                    max={100}
                />

                {/* Vedľajšie štatistiky */}
                <StatMiniSupplementary label="4-moves sequences" value={5} whole={8} />
                <StatMiniSupplementary label="5-moves sequences" value={5} whole={8} />
                <StatMiniSupplementary label="6-moves sequences" value={3} whole={8} />
                <StatMiniSupplementary label="Total correct sequences" value={13} whole={24} />
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
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 16,
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

// const FocusLabel = ({ item }: any) => {
//   return (
//     <View style={localStyles.tooltip}>
//       <Text
//         style={localStyles.tooltipTitle}
//         numberOfLines={1}
//       >
//         Total score: {item.value}
//       </Text>

//       <Text
//         style={localStyles.tooltipSubtitle}
//         numberOfLines={1}
//       >
//         {item.percentile}% percentile
//       </Text>
//     </View>
//   );
// };