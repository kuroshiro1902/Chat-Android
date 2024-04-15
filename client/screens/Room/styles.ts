import { StyleSheet } from "react-native";
import { color, theme } from "../../theme";

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
    height: '100%',
    paddingHorizontal: 4
  },
  selfMessageCtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  otherMessageCtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  selfMessage: {
    backgroundColor: color.blue,
    color: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
    maxWidth: '95%',
    fontSize: 18
  },
  otherMessage: {
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 4,
    maxWidth: '95%',
    fontSize: 18
  },
  messageForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4, 
    padding: 4
  },
  messageInput: {
    flex: 1,
    padding: 8,
    height: 60,
    borderWidth: 1,
    fontSize: 18,
    outlineStyle: 'none',
    borderColor: color.gray
  },
  messageSubmitBtn: {
    width: 52,
    paddingHorizontal: 4,
    backgroundColor: color.blue,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});