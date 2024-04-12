import { StyleSheet } from "react-native";
import { color } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: '100%'
  },
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
  },
  messageListCtn: {
    height: '100%'
  },
  selfMessageCtn: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  otherMessageCtn: {
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  message: {
    backgroundColor: '#ffffff',
    padding: 8,
  },
});