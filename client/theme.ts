import { StyleSheet } from 'react-native';

export const color = {
  darkGreen: '#264653',
  lightGreen: '#35bb6e',
  green: '#2a9d8f',
  yellow: '#e9c46a',
  orange: '#f4a261aa',
  red: '#e76f51',
  crimson: '#f33b5e',
  blue: '#027291cc',
  gray: '#adb6b6',
  lightGray: '#adb6b640',
  white: '#ffffff',
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
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 44,
  },
  online: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: color.lightGreen,
    position: 'absolute',
    bottom: 4,
    right: 2,
  },
});
