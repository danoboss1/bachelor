import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// const firstPositionLeft = width * (0.13 / 6 + 0.005);
// const firstPositionBottom = height * 1/9 + (height * 1/10 / 3);



type HandProps = {
    size?: number;
    color?: string;
    secondaryColor?: string;
};

export function Hand({ size = 120, color = "#E0B899", secondaryColor = "#C89B7B"}: HandProps) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 256 256"
            style={{
                transform: [{ rotate: '-90deg' }]
            }}
        >
            {/* tieň / duotone */}
            <Path
                d="M208,112v40a80,80,0,0,1-160,0V68a20,20,0,0,1,40,0V36a20,20,0,0,1,40,0V52a20,20,0,0,1,40,0v60a20,20,0,0,1,40,0Z"
                fill={secondaryColor}
                opacity={0.2}
            />
            {/* hlavný tvar */}
            <Path
                d="M188,84a27.83152,27.83152,0,0,0-12,2.707V52a27.992,27.992,0,0,0-41.35791-24.60278A27.99792,27.99792,0,0,0,80,36v6.707A27.991,27.991,0,0,0,40,68v84a88,88,0,0,0,176,0V112A28.03146,28.03146,0,0,0,188,84Zm12,68a72,72,0,0,1-144,0V68a12,12,0,0,1,24,0v44a8,8,0,0,0,16,0V36a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V52a12,12,0,0,1,24,0v72.6665A48.07871,48.07871,0,0,0,120,172a8,8,0,0,0,16,0,32.03635,32.03635,0,0,1,32-32,8.00008,8.00008,0,0,0,8-8V112a12,12,0,0,1,24,0Z"
                fill={color}
            />
        </Svg>
    );
};

type DiscInHandProps = {
    size: number;
    color: string;
};

export function DiscInHand({ size, color }: DiscInHandProps) {
    return (
        <View
            style={[
                localStyles.discInHand,
                {
                    width: size,
                    backgroundColor: color,
                },
            ]}
        />
    );
}


type DiscData = {
    id: number;
    size: number;
    color: string;
};

type StackWithDiscsProps = {
    stackHeight: number;
    backgroundColor: string;
    discs: DiscData[];
    onPress?: () => void;
};

export function StackWithDiscs({
    stackHeight,
    backgroundColor,
    discs,
    onPress,
}: StackWithDiscsProps) {
    return (
        <Pressable onPress={onPress} style={{ width: width * 0.29, height: stackHeight }}>
            <View
                style={[
                    localStyles.stackBase,
                    { height: stackHeight, backgroundColor },
                ]}
            >
                <View style={localStyles.peg} />
            </View>

            {discs.map((disc, index) => (
                <View
                    key={disc.id}
                    style={[
                        localStyles.disc,
                        {
                            width: disc.size,
                            backgroundColor: disc.color,
                            // zakladny offset + 1,5 nasobok vysky disku, aby to vyzeralo v pohode
                            bottom: height * 0.005 + index * (height * 0.06),
                        },
                    ]}
                />
            ))}
        </Pressable>
    );
}




const localStyles = StyleSheet.create({
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
    simpledisc: {
        position: "absolute",
        height: height * 0.040,
        borderRadius: 6,
        // alignSelf: "center",
        zIndex: 2,
        // left: width * (0.13 / 6 + 0.005),
        // bottom: height * 1/9 + (height * 1/10 / 3),
    },
    discInHand: {
        position: "absolute",
        height: height * 0.04,
        borderRadius: 6,
        zIndex: 10,
        bottom: height * 0.5,
        alignSelf: "center",
    },
});