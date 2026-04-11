import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgTop: {
        height: 140,
        backgroundColor: "#8B593E",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bgTopNew: {
        flex: 1,
        backgroundColor: "#4c5ec1",
    },
    bgBottom: {
        flex: 5,
        backgroundColor: "white",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: height * 0.06,
        marginLeft: width * 0.05,
        color: "white",
    },
    subheader: {
        fontSize: 14,
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
        width: width * 0.5, 
        height: width * 0.5,
        borderRadius: (width * 0.3) / 2,
        borderWidth: 3,
        borderColor: 'white',
        alignItems: "center",
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: height * 0.08,
    },
    imageText: {
        marginTop: height * 0.01,
        fontSize: 16,
        color: "white",
        fontWeight: "500",
    },
    textContainer: {
        alignItems: "flex-start",
        width: "100%",
        marginTop: height * 0.03,
        paddingHorizontal: width * 0.05,
    },
    buttonContainer: {
        paddingVertical: height * 0.1,
        paddingHorizontal: width * 0.07,
        gap: height * 0.03,
    },
    button: {
        flexDirection: 'row',
        alignItems: "center",     
        justifyContent: "center",
        backgroundColor: "#FF1E1E",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
        width: width * 0.2,
        alignSelf: "flex-end", 
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#F5F5F5",
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        borderRadius: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    buttonTextWhite: {
        color: "white",
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