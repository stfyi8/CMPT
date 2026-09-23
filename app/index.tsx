
//DO NOT TOUCH THIS FILE
import "global.css";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default function StartPage() {
  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row"}}>
      <View style={styles.divider}/>
      <Text style={styles.text}>Streamline Your Schedules</Text>
      <View style={styles.divider}/>
      </View>
      <ActivityIndicator size='large' color="#fe9438" className="pt-10"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "center", 
    justifyContent: "center"
  },
  divider: {
    backgroundColor:"#fe9438",
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  text: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#fe9438"
  },
})