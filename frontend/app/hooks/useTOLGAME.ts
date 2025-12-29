import React from "react";
import { View } from "react-native";

type Position = {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
};

export function useTOLGame() {
    const [selectedDiscId, setSelectedDiscId] = React.useState<number | null>(null);
    const [handPosition, setHandPosition] = React.useState<{x: number, y: number} | undefined>(undefined);
    
    const handRef = React.useRef<View>(null);

    const discRefs = React.useRef<Map<number, any>>(new Map());
    const discPositions = React.useRef<Map<number, Position>>(new Map());

    const registerDiscRef = (id: number, ref: React.RefObject<View | null>) => {
        if (ref) {
            discRefs.current.set(id, ref);
        }
    }

    const moveDisc = (discId: number) => {
        setSelectedDiscId(prev =>
            prev === discId ? null : discId
        );

        const discRef = discRefs.current.get(discId);

        if (!discRef) {
            console.warn("Disc ref not found for id:", discId);
            return;
        }

        discRef.current?.measure(
            (
                x: number,
                y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number
            ) => {
                discPositions.current.set(discId, {
                    pageX,
                    pageY,
                    width,
                    height,
                });

                console.log("Stored disc position:", discId, {
                    pageX,
                    pageY,
                    width,
                    height,
                });
            }
        );

        handRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setHandPosition({
                x: pageX + width / 2,
                y: pageY + height / 2,
            });
        })

        handRef.current?.measure((x, y, width, height, pageX, pageY) => {
            console.log("Hand position:", { pageX, pageY });
        });
    };
    

    return {
        moveDisc,

        selectedDiscId,
        handRef,
        handPosition,
        registerDiscRef,
    };
}