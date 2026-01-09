import { DiscInHand, Hand, StackWithDiscs } from "@/components/tol/ToLComponents";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTOLGame } from "../hooks/useTOLGame";

const { width, height } = Dimensions.get("window");

type DiscData = {
    id: number;
    size: number;
    color: string;
};

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

    const [stacks, setStacks] = useState<DiscData[][]>([
        [
            { id: 1, size: width * 0.28, color: "red" },
            { id: 2, size: width * 0.28, color: "blue" },
            { id: 3, size: width * 0.28, color: "green" },
        ],
        [
            { id: 4, size: width * 0.28, color: "red" },
            { id: 5, size: width * 0.28, color: "blue" },
        ],
        [
            { id: 6, size: width * 0.28, color: "red" },    
        ],
    ]);

    const [discInHand, setDiscInHand] = useState<DiscData | null>(null);

    const onStackPress = (stackIndex: number) => {
        setStacks(prev => {
            const newStacks = prev.map(s => [...s]);

            if (!discInHand) {
                if (newStacks[stackIndex].length === 0) return prev;
                const pickedDisc = newStacks[stackIndex].pop()!;
                setDiscInHand(pickedDisc);
                return newStacks;
            }

            newStacks[stackIndex].push(discInHand);
            setDiscInHand(null);
            return newStacks;
        });
    };


    // const handRef = React.useRef<View>(null);
  
    return (
        <View style={localStyles.container}>

            <View style={localStyles.timer} />

            {/* TARGET */}
            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    {/* <StackWithDiscs
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
                    /> */}
                </View>
            </View>

            <View ref={handRef} style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Hand size={150} color="#E0B899" secondaryColor="#C89B7B" />
            </View>

            {/* USER */}
            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>
                    {stacks.map((stack, index) => (
                        <StackWithDiscs
                        key={index}
                        stackHeight={[height * 0.27, height * 0.18, height * 0.09][index]}
                        backgroundColor="#FFCC80"
                        discs={stack}
                        onPress={() => onStackPress(index)}
                        />
                    ))}
                </View>

                    {/* <LongStack
                        stackHeight={height * 0.27}
                        backgroundColor="#FFCC80"
                    /> */}
{/* 
                    <SimpleDisc
                        size={width * 0.28} 
                        color={"red"}
                    /> */}

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
                    {/* <StackWithDiscs
                        stackHeight={height * 0.18}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 4, size: width * 0.28, color: "red" },
                            { id: 5, size: width * 0.28, color: "blue" },
                        ]}
                    /> */}

                    {/* SHORT – 1 DISC */}
                    {/* <StackWithDiscs
                        stackHeight={height * 0.09}
                        backgroundColor="#FFCC80"
                        discs={[
                            { id: 6, size: width * 0.28, color: "red" },
                        ]}
                    />

                </View> */}
            </View>

            {/* <SimpleDisc
                size={width * 0.28} 
                color={"red"}
            /> */}

            {/* <DiscInHand
                size={width * 0.28} 
                color={"green"}
            /> */}

            {/* DISK V RUKE */}
            {discInHand && (
                <DiscInHand
                size={discInHand.size}
                color={discInHand.color}
                />
            )}

            <View style={localStyles.footer}>

            </View>
        </View>
    );
}

/* =========================
   STYLES
========================= */

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
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
