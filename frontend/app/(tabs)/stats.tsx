import { Text, View } from '@/components/Themed';
import { styles } from "../../assets/styles/mainScreens.styles";
// import { Card, Red_Triangle_Card, Gr } from "@/components/Card";
import { StatsComponent } from '@/components/StatsComponent';


// const statsData = [
//   { id: "1", title: "Stat 1", description: "Description for Stat 1" },
//   { id: "2", title: "Stat 2", description: "Description for Stat 2" },
//   { id: "3", title: "Stat 3", description: "Description for Stat 3" },
//   { id: "4", title: "Stat 4", description: "Description for Stat 4" },
//   { id: "5", title: "Stat 5", description: "Description for Stat 5" },
//   { id: "6", title: "Stat 6", description: "Description for Stat 6" },
//   { id: "7", title: "Stat 7", description: "Description for Stat 7" },
//   { id: "8", title: "Stat 8", description: "Description for Stat 8" },
// ];

{/* <StatsComponent
  title="Cognitive Stats"
  stats={[
    { label: "Memory", value: 75 },
    { label: "Attention", value: 60 },
    { label: "Flexibility", value: 90 },
    { label: "Speed", value: 50 },
  ]}
/> */}

export default function StatsScreen() {
    return (
        <View style={styles.container}>
            {/* vrchna cast pred upravou */}
            <View style={styles.bgTop}>
                <Text style={styles.header}> My Stats </Text>
            </View>

            <View style={styles.bgBottom}>

                {/* <FlatList
                    data = {statsData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GameCard title={item.title} description={item.description} />
                    )}
                    contentContainerStyle={{ padding: 16 }}
                /> */}
                <StatsComponent
                    title={"Wisconsin Card Sorting Test\nBest Attempt"}
                    stats={[
                        { label: "Total number of trials administered", value: 75 },
                        { label: "Percentage of perseverative responses", value: 60 },
                        { label: "Percentage of perseverative errors", value: 90 },
                        { label: "Percentage of non-perseverative errors", value: 50 },
                    ]}
                    image={require('../../assets/images/backgroundWisconsinCardSortingTest.png')}
                />
            </View>
        </View>
    )
}
