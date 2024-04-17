import { StyleSheet } from 'react-native';

export const color = {
  darkGreen: '#264653',
  green: '#2a9d8f',
  yellow: '#e9c46a',
  orange: '#f4a261',
  red: '#e76f51',
  blue: '#027291',
  gray: '#adb6b6',
  lightGray: '#adb6b640',
  white: '#eeeeee',
  darkGray: '#00000090',
};

export const theme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.gray,
    color: color.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    color: color.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: color.blue,
    alignSelf: 'flex-start',
    margin: 'auto',
  },
  buttonPressed: {
    color: color.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: color.orange,
    alignSelf: 'flex-start',
    margin: 'auto',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: color.blue,
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 44,
    borderRadius: 44,
    backgroundColor: color.lightGray,
  },
});
