import { DiscInHand, Hand, LongStack, SimpleDisc, StackWithDiscs } from "@/components/tol/ToLComponents";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTOLGame } from "../hooks/useTOLGAME";

const { width, height } = Dimensions.get("window");


/* =========================
   SCREEN
========================= */

export default function TOL_Screen() {
    const {
        moveDisc,
        selectedDiscId,
        handPosition,
        handRef,
        registerDiscRef,
    } = useTOLGame();


    // const handRef = React.useRef<View>(null);
  
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

            <View ref={handRef} style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Hand size={150} color="#E0B899" secondaryColor="#C89B7B" />
            </View>

            {/* USER */}
            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>

                    <LongStack
                        stackHeight={height * 0.27}
                        backgroundColor="#FFCC80"
                    />

                    <SimpleDisc
                        size={width * 0.28} 
                        color={"red"}
                    />

                    {/* LONG – 3 DISCS */}
                    {/* <StackWithDiscs
                        stackHeight={height * 0.27}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 1, size: width * 0.28, color: "red" },
                            { id: 2, size: width * 0.28, color: "blue" },
                            { id: 3, size: width * 0.28, color: "green" },
                        ]}
                        selectedDiscId={selectedDiscId}
                        onDiscPress={moveDisc}
                        handPosition={handPosition}
                        registerDiscRef={registerDiscRef}
                    /> */}

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

            <SimpleDisc
                size={width * 0.28} 
                color={"red"}
            />

            <DiscInHand
                size={width * 0.28} 
                color={"green"}
            />

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
    peg: {
        width: width * 0.035,
        height: "90%",
        backgroundColor: "#8B5A2B",
        borderRadius: 8,
        marginBottom: 6,
        zIndex: 1,
    },
});
