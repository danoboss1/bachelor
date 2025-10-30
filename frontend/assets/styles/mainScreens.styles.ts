import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgTop: {
        flex: 1,
        backgroundColor: "#3D5CFF",
    },
    bgBottom: {
        flex: 5,
        backgroundColor: "white",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        marginTop: height * 0.07,
        marginLeft: width * 0.05,
        color: "white",
    },
    userID: {
        color: "#666666"
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
    },
    profileImage: {
        width: width * 0.5, // 30 % šírky obrazovky
        height: width * 0.5,
        borderRadius: (width * 0.3) / 2,
        borderWidth: 3,
        borderColor: 'white',
        alignItems: "center",
    },
    imageContainer: {
        alignItems: "center", // horizontálne centrovanie
        justifyContent: "center", // vertikálne (ak má výšku)
        marginTop: height * 0.05,
    },
    imageText: {
        marginTop: height * 0.01,
        fontSize: 16,
        color: "white",
        fontWeight: "500",
    },
    textContainer: {
        alignItems: "flex-start",
        width: "100%",            // aby flex-start fungoval podľa celej šírky
        marginTop: height * 0.03,            // odstup od obrázka
        paddingHorizontal: width * 0.05,
    },
    buttonContainer: {
        paddingVertical: height * 0.05,
        paddingHorizontal: width * 0.07,
        gap: height * 0.03,
    },
    // buttonContainer: {
    //     flexDirection: "row",
    //     justifyContent: "flex-end",
    //     alignItems: "flex-end",
    //     paddingHorizontal: width * 0.05,
    //     paddingBottom: height * 0.03,
    //     gap: width * 0.03,
    // },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: "#FF6905",
        backgroundColor: "#F5F5F5",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: "#FF1E1E",
        backgroundColor: "#F5F5F5",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
    },
    rectangle: {
        width: "80%",
        aspectRatio: 2,
        backgroundColor: "green",
        borderRadius: "16",
        position: "absolute",
        top: "17%",
    },
});