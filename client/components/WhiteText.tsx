import { Text } from 'react-native';

interface props {
  children?: any;
  style?: any;
}

function WhiteText({ children, style }: props) {
  return <Text style={{ color: '#FFFFFF', ...style }}>{children}</Text>;
}

export default WhiteText;
