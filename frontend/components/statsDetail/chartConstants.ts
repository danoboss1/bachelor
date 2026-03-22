import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const CHART_HORIZONTAL_PADDING = width * 0.08;
export const NUMBER_OF_BARS = 7;
export const SPACING = 12;
export const INITIAL_SPACING = 6;
export const END_SPACING = 6;

export const BAR_WIDTH =
    (width -
        CHART_HORIZONTAL_PADDING * 2 -
        INITIAL_SPACING -
        END_SPACING -
        SPACING * (NUMBER_OF_BARS - 1)) /
    NUMBER_OF_BARS;