import { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color, theme } from '../theme';
import Overlay from './Overlay';
import WhiteText from './WhiteText';
import { adjustDimension } from '../utils/adjustDimension.util';
interface props {
  onClose: () => void;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  urlHandler: (content: string) => void;
}
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dv8beczw7/image/upload';
function ImageUpload({ onClose, setIsLoading, urlHandler }: props) {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [image, setImage] = useState<string | null>(null);
  const uploadToCloudinary = async (uri: string) => {
    // setIsLoading(true);
    try {
      const formData = new FormData();
      let dataImage: any = { uri, type: 'image/jpeg', name: 'my_image.jpg' };
      // formData.append('file', dataImage);
      formData.append('file', uri);
      formData.append('upload_preset', 'k3rijx8y');
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      const { width, height, secure_url } = data;
      const content = JSON.stringify({ content: secure_url, width, height });
      urlHandler(content);
      // return data.secure_url;
    } catch (error: any) {
      Alert.alert('Upload ảnh thất bại', error.message, [{ text: 'OK' }]);
      return null;
    } finally {
      onClose();
      // setIsLoading(false);
    }
  };
  const selectImage = async () => {
    let image = '';
    try {
      setIsLoadingImage(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All, // chon dc ca anh ca video
          quality: 0.5,
          allowsEditing: true,
          allowsMultipleSelection: false,
          // multiple: true,
        });

        if (!result.canceled) {
          image = result?.assets?.map((asset: any) => asset?.uri)[0];
          setImage(image);
          Image.getSize(image, (width, height) => {
            const newDimensions = adjustDimension({ width, height });
            setDimensions(newDimensions);
          });
        }
      } else {
        Alert.alert('', 'Permission to access camera roll is required!', [{ text: 'OK' }]);
        // setIsLoadingImage(false);
      }
    } catch (error) {
      console.log(error);

      Alert.alert('Thông báo', 'Bạn vẫn chưa chọn ảnh');
      // setIsLoadingImage(false);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="Chọn ảnh" onPress={selectImage}></Button>
        {image ? (
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => {
              uploadToCloudinary(image);
            }}
          >
            <WhiteText style={{ fontWeight: '600' }}>UPLOAD</WhiteText>
          </TouchableOpacity>
        ) : undefined}
      </View>
      <View style={{ paddingVertical: 4 }}></View>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ ...styles.image, width: dimensions.width, height: dimensions.height }}
        />
      )}
    </View>
  );
}

export default ImageUpload;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    height: '90%',
    width: 240,
    alignItems: 'center',
    backgroundColor: '#ffffff40',
    padding: 8,
    borderRadius: 8,
  },
  image: {},
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  sendBtn: {
    ...theme.button,
    fontWeight: '700',
  },
});
