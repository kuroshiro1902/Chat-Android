import { StyleSheet } from "react-native";
import { color } from "../../theme";

export const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 60,
    backgroundColor: color.blue,
    padding: 8
  },
  roomName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff'
  }
});