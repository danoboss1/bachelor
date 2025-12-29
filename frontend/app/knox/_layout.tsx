import { Stack } from "expo-router";
import React from "react";

export default function WCSTLayout({ children }: { children: React.ReactNode }) {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {children}
        </Stack>
    );
}