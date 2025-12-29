import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");


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

type PegStackProps = {
    stackHeight: number;
    backgroundColor?: string;
};

export function PegStack({ stackHeight, backgroundColor }: PegStackProps) {
    return (
        <View
            style={[
                localStyles.stackBase,
                {
                    height: stackHeight,
                    backgroundColor: backgroundColor ?? "black",
                },
            ]}
        >
            <View style={localStyles.peg} />
        </View>
    );
};

type DiscProps = {
    size: number;
    color: string;
    bottomOffset: number;
    isSelected?: boolean;
    onPress?: () => void;
    handPosition?: { x: number, y: number },
    discRef?: React.RefObject<View | null>;
};


export function Disc({ 
    size, 
    color, 
    bottomOffset,
    isSelected = false,
    onPress,
    handPosition,
    discRef,
}: DiscProps ) {
    
    // const x = handPosition?.x ?? 0;
    // const y = handPosition?.y ?? 0;
    const onLayout = (e: any) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        console.log("DISC layout (relative):", { x, y, width, height });
    };
    
    return (
        <Pressable
        ref={discRef}
        onPress={onPress}
        onLayout={onLayout}
        style={[
            localStyles.disc,
                {
                    width: size,
                    backgroundColor: color,
                    bottom: bottomOffset + (isSelected ? 200 : 0),
                    // left: handPosition?.x ?? 0,
                    // top: handPosition?.y ?? 0,
                    transform: [
                        { translateX: handPosition?.x ?? 0 },
                        { translateY: handPosition?.y ?? 0 },
                    ],
                },
            ]}
            />
        )
    };

type SimpleDiscProps = {
    size: number;
    color: string;
};
    
export function SimpleDisc({ 
    size, 
    color, 
}: SimpleDiscProps ) {
    return (
        <Pressable
        style={[
            localStyles.simpledisc,
            {
                    width: size,
                    backgroundColor: color,
                },
            ]}
        />
    );
};

type DiscInHandProps = {
    size: number;
    color: string;
};

export function DiscInHand({
    size,
    color,
}: DiscInHandProps) {
    return (
        <Pressable
        style={[
            localStyles.discInHand,
            {
                    width: size,
                    backgroundColor: color,
                },
            ]}
        />
    );
};

type StackWithDiscsProps = {
    stackHeight: number;
    backgroundColor: string;
    discs: { id: number; size: number; color: string }[];
    selectedDiscId?: number | null;
    onDiscPress?: (discId: number) => void;
    handPosition?: { x: number, y: number },
    registerDiscRef?: (id: number, ref: React.RefObject<View | null>) => void;
};

export function StackWithDiscs({ 
    stackHeight, 
    backgroundColor, 
    discs,
    selectedDiscId = null,
    onDiscPress, 
    handPosition,
    registerDiscRef,
}: StackWithDiscsProps) {

    // Udržíme refy stabilné
    const discRefs = React.useRef<Map<number, React.RefObject<View | null>>>(new Map());

    return (
        <View style={{ width: width * 0.29, height: stackHeight }}>
            <PegStack stackHeight={stackHeight} backgroundColor={backgroundColor} />
            {discs.map((disc, index) => {
                // vytvoríme ref iba raz pre každý disc
                if (!discRefs.current.has(disc.id)) {
                    discRefs.current.set(disc.id, React.createRef<View>());
                }
                const discRef = discRefs.current.get(disc.id)!;

                // registrácia refu
                registerDiscRef?.(disc.id, discRef);

                return (
                    <Disc
                        key={disc.id}
                        size={disc.size}
                        color={disc.color}
                        bottomOffset={height * 0.005 + 2 * index * (height * 0.03)}
                        isSelected={disc.id === selectedDiscId}
                        onPress={() => onDiscPress?.(disc.id)}
                        handPosition={disc.id === selectedDiscId ? handPosition : undefined}
                        discRef={discRef}
                    />
                );
            })}
        </View>
    );
};


type LongStackProps = {
    stackHeight: number;
    backgroundColor: string;
};

export function LongStack({ 
    stackHeight, 
    backgroundColor, 
}: LongStackProps) {
    return (
        <View style={{ width: width * 0.29, height: stackHeight }}>
            <PegStack stackHeight={stackHeight} backgroundColor={backgroundColor} />
        </View>
    );
};



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
        left: width * (0.13 / 6 + 0.005),
        bottom: height * 1/9 + (height * 1/10 / 3),
    },
    discInHand: {
        position: "absolute",
        height: height * 0.040,
        borderRadius: 6,
        alignSelf: "center",
        zIndex: 3,
        // left: width * (0.13 / 6 + 0.005),
        // bottom: height * 3/9 + (height * 1/10 / 3),
        bottom: height * 5/9 - height * 0.040 / 2,
    },
});