import { Stack } from "expo-router";
import React from "react";

export default function TOLLayout({ children }: { children: React.ReactNode }) {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {children}
        </Stack>
    );
}