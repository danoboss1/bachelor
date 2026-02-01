import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { Color } from "@/constants/TWPalette";
import React, { useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width, height } = Dimensions.get("window")

const CHART_HORIZONTAL_PADDING = width * 0.08;
const NUMBER_OF_BARS = 7;
const SPACING = 12;
const INITIAL_SPACING = 6;
const END_SPACING = 6;

const BAR_WIDTH =
    (width - CHART_HORIZONTAL_PADDING * 2 - INITIAL_SPACING - END_SPACING - SPACING * (NUMBER_OF_BARS - 1)) /
    NUMBER_OF_BARS;

const rawData = [
    {value: 50, dataPointText: '50', label: '15/1'},
    {value: 80, dataPointText: '80', label: '16/1'},
    {value: 100, dataPointText: '100', label: '17/1'},
    {value: 70, dataPointText: '70', label: '18/1'},
    {value: 56, dataPointText: '56', label: '19/1'},
    {value: 78, dataPointText: '78', label: '20/1'},
    {value: 74, dataPointText: '74', label: '21/1', frontColor: '#177AD5'},
];

// const barData2 = [
//     {value: 250, label: 'M'},
//     {value: 500, label: 'T', frontColor: '#177AD5'},
//     {value: 745, label: 'W', frontColor: '#177AD5'},
//     {value: 320, label: 'T'},
//     {value: 600, label: 'F', frontColor: '#177AD5'},
//     {value: 256, label: 'S'},
//     {value: 300, label: 'S'},
// ];

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
    const [activeIndex, setActiveIndex] = useState(rawData.length - 1);

    const barData = useMemo(
        () =>
            rawData.map((item, index) => ({
                ...item,
                frontColor:
                    index === activeIndex
                        ? Color.brown[800]
                        : Color.brown[400],

                topLabelComponent:
                    index === activeIndex
                        ? () => (
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    color: Color.brown[800],
                                    marginBottom: 6,
                                }}
                            >
                                {item.value}
                            </Text>
                            )
                        : undefined,
            })),
        [activeIndex]    
    );

    return (
        <View style={{
            flex: 1,
            backgroundColor: Color.brown[100]
            // justifyContent: "center", // vertikálne centrovanie
            // alignItems: "center",     // horizontálne centrovanie
        }}>

            <View style={{flex:1, justifyContent:"center"}}>
                <Text style={localStyles.graphTitle}>Total score</Text>

                <BarChart
                    maxValue={100}     
                    stepValue={20}
                    yAxisExtraHeight={20}
                    barBorderRadius={4}
                    // frontColor="lightbrown"
                    // showGradient
                    // gradientColor={Color.brown[400]}
                    frontColor={Color.brown[400]}
                    data={barData}
                    xAxisThickness={0}
                    yAxisThickness={0}
                    disableScroll

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

                    onPress={(_item: any, index: number) => {
                        setActiveIndex(index);
                    }}

                    // renderTooltip={(item: any, index: number) => {
                    //     if (index !== activeIndex) return null;

                    //     return <FocusLabel item={item} />;
                    // }}

                    dashGap={10}
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