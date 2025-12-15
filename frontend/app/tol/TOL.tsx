import { Hand, PegStack } from "@/components/tol/ToLComponents";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");



/* =========================
   DISC
========================= */

type DiscProps = {
    size: number;
    color: string;
    bottomOffset: number;
};

const Disc: React.FC<DiscProps> = ({ size, color, bottomOffset }) => {
    return (
        <View
            style={[
                localStyles.disc,
                {
                    width: size,
                    backgroundColor: color,
                    bottom: bottomOffset,
                },
            ]}
        />
    );
};

/* =========================
   STACK WITH DISCS
========================= */

type StackWithDiscsProps = {
    stackHeight: number;
    backgroundColor: string;
    discs: { id: number; size: number; color: string }[];
};

const StackWithDiscs: React.FC<StackWithDiscsProps> = ({
    stackHeight,
    backgroundColor,
    discs,
}) => {
    return (
        <View style={{ width: width * 0.29, height: stackHeight }}>
            {/* PEG */}
            <PegStack
                stackHeight={stackHeight}
                backgroundColor={backgroundColor}
            />

            {/* DISCS – CEZ PALICKU */}
            {discs.map((disc, index) => (
                <Disc
                    key={disc.id}
                    size={disc.size}
                    color={disc.color}
                    bottomOffset={height * 0.005 + 2 * index * (height * 0.03)}
                />
            ))}
        </View>
    );
};

/* =========================
   SCREEN
========================= */

export default function TOL_Screen() {
    return (
        <View style={localStyles.container}>

            <View style={localStyles.timer} />

            {/* TARGET */}
            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    <StackWithDiscs
                        stackHeight={height * 0.27}
                        backgroundColor="#4CAF50"
                        discs={[]}
                    />
                    <StackWithDiscs
                        stackHeight={height * 0.18}
                        backgroundColor="#4CAF50"
                        discs={[]}
                    />
                    <StackWithDiscs
                        stackHeight={height * 0.09}
                        backgroundColor="#4CAF50"
                        discs={[]}
                    />
                </View>
            </View>

            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Hand size={150} color="#E0B899" secondaryColor="#C89B7B" />
            </View>

            {/* USER */}
            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>

                    {/* LONG – 3 DISCS */}
                    <StackWithDiscs
                        stackHeight={height * 0.27}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 1, size: width * 0.28, color: "red" },
                            { id: 2, size: width * 0.28, color: "blue" },
                            { id: 3, size: width * 0.28, color: "green" },
                        ]}
                    />

                    {/* MID – 2 DISCS */}
                    <StackWithDiscs
                        stackHeight={height * 0.18}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 4, size: width * 0.28, color: "red" },
                            { id: 5, size: width * 0.28, color: "blue" },
                        ]}
                    />

                    {/* SHORT – 1 DISC */}
                    <StackWithDiscs
                        stackHeight={height * 0.09}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 6, size: width * 0.28, color: "red" },
                        ]}
                    />

                </View>
            </View>

            <View style={localStyles.footer} />
        </View>
    );
}

/* =========================
   STYLES
========================= */

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer: {
        flex: 1,
    },
    targetPegs: {
        flex: 3,
        backgroundColor: "green",
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        backgroundColor: "orange",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
    },
    stacksRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        paddingBottom: height * 0.03,
    },
    stackBase: {
        width: width * 0.29,
        borderRadius: 6,
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
    },
    peg: {
        width: width * 0.035,
        height: "90%",
        backgroundColor: "#8B5A2B",
        borderRadius: 8,
        marginBottom: 6,
        zIndex: 1,
    },
    disc: {
        position: "absolute",
        height: height * 0.040,
        borderRadius: 6,
        alignSelf: "center",
        zIndex: 2,
    },
});
