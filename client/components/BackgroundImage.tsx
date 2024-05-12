import { Image, StyleSheet, View } from 'react-native';

function BackGroundImage() {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <Image
        style={{
          // ...StyleSheet.absoluteFillObject,
          resizeMode: 'cover', // Đảm bảo ảnh nền được phủ toàn bộ phần nền
          // position: 'absolute',
          // left: 0,
          // bottom: 0,
          maxWidth: '100%',
          opacity: 0.4,
        }}
        // source={require('../assets/bg.jpg')}
        source={require('../assets/logo/logo.png')}
      ></Image>
    </View>
  );
}

export default BackGroundImage;
