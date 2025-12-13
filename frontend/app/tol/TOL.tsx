import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get("window");

type PegStackProps = {
    backgroundColor?: string;
    stackHeight: number;
};

const PegStack: React.FC<PegStackProps> = ({ 
    backgroundColor,
    stackHeight,
}) => {
    return (
        <View
            style={[
                localStyles.stackBase,
                {
                    height: stackHeight,
                    backgroundColor: backgroundColor ?? "black",
                }
            ]}
        >
            <View style={localStyles.peg} />
        </View>
    )
};


export default function TOL_Screen() {
    return (
        <View style={localStyles.container}>
            <View style={localStyles.timer} />

            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    <PegStack
                        stackHeight={height * 0.27}
                        backgroundColor="#4CAF50"
                    />
                    <PegStack
                        stackHeight={height * 0.18}
                        backgroundColor="#4CAF50"
                    />
                    <PegStack
                        stackHeight={height * 0.09}
                        backgroundColor="#4CAF50"
                    />
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
                <Text>Real Tower of London Game</Text>
            </View>

            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>
                    <PegStack
                        stackHeight={height * 0.27}
                        backgroundColor="#FFCC80"
                    />
                    <PegStack
                        stackHeight={height * 0.18}
                        backgroundColor="#FFCC80"
                    />
                    <PegStack
                        stackHeight={height * 0.09}
                        backgroundColor="#FFCC80"
                    />
                </View>    
            </View>

            <View style={localStyles.footer} />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    timer: {
        flex: 1,
        width: "100%",
    },
    targetPegs: {
        flex: 3,
        width: "100%",
        backgroundColor: "green",
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        width: "100%",
        backgroundColor: "orange",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
        width: "100%",
    },
    longStack: {
        width: width * 0.23,
        height: height * 0.27,
        backgroundColor: "black",
        borderRadius: 4,
    },
    midStack: {
        width: width * 0.23,
        height: height * 0.18,
        backgroundColor: "black",
        borderRadius: 4,
    },
    shortStack: {
        width: width * 0.23,
        height: height * 0.09,
        backgroundColor: "black",
        borderRadius: 4,
    },
    stacksRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        width: "100%",
        paddingBottom: height * 0.03,
    },
    stackBase: {
        width: width * 0.23,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    peg: {
        width: width * 0.035,
        height: '90%',
        backgroundColor: '#8B5A2B', // wood color
        borderRadius: 8,
        marginBottom: 6,
    },
})