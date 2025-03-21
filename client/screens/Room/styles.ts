import { StyleSheet } from 'react-native';
import { color, theme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    height: 60,
    backgroundColor: color.blue,
    padding: 8,
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: '100%',
    padding: 8,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff',
  },
  messageListCtn: {
    height: '100%',
    paddingHorizontal: 4,
  },
  selfMessageCtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  otherMessageCtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    display: 'flex',
    flexDirection: 'row',
  },
  selfMessage: {
    backgroundColor: color.blue,
    color: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
    maxWidth: '95%',
    fontSize: 20,
  },
  otherMessage: {
    backgroundColor: '#00000015',
    padding: 6,
    borderRadius: 6,
    maxWidth: '95%',
    fontSize: 20,
  },
  messageForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  messageInput: {
    flex: 1,
    padding: 8,
    height: 60,
    borderWidth: 1,
    fontSize: 18,
    // @ts-ignore
    // outlineStyle: 'none',
    borderColor: color.gray,
  },
  messageSubmitBtn: {
    width: 52,
    paddingHorizontal: 4,
    backgroundColor: color.darkGreen,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadImageBtn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: color.lightGray,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});
