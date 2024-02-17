import { StyleSheet } from "react-native";
import { color } from "../../theme";

export const styles = StyleSheet.create({
  submitCtn: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#00000080',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitForm: {
    borderRadius: 4,
    backgroundColor: color.blue,
    padding: 6,
    marginTop: -16,
    width: '96%'
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  menuCtn: {
    padding: 6,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 8,
    padding: 4,
    backgroundColor: color.blue,
  },
  roomId: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  copyIdBtn: {
    marginLeft: 8,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bottomMenu: {
    backgroundColor: color.darkGreen,
    padding: 6,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 4
  },
  bottomMenuBtn: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 4
  }
});