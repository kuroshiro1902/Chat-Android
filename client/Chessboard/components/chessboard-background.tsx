/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useChessboardProps } from '../context/props-context/hooks';
import { PlayerColor } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

type BackgroundProps = {
  letters: boolean;
  numbers: boolean;
  playerColor: PlayerColor
};

interface BaseProps extends BackgroundProps {
  white: boolean;
}

interface RowProps extends BaseProps {
  row: number;
}

interface SquareProps extends RowProps {
  col: number;
}

const Square = React.memo(
  ({ white, row, col, letters, numbers, playerColor }: SquareProps) => {
    const { colors } = useChessboardProps();
    const backgroundColor = white ? colors.black : colors.white;
    const color = white ? colors.white : colors.black;
    const textStyle = { fontWeight: '500' as const, fontSize: 10, color };
    const newLocal = col === 0;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          padding: 4,
          justifyContent: 'space-between',
        }}
      >
        {numbers && (
          <Text style={[textStyle, { opacity: newLocal ? 1 : 0 }]}>
            {'' + (playerColor === 'white' ? 8 - row : (row + 1))}
          </Text>
        )}
        {row === 7 && letters && (
          <Text style={[textStyle, { alignSelf: 'flex-end' }]}>
            {String.fromCharCode(97 + (playerColor === 'white' ? col : (8 - col - 1)))}
          </Text>
        )}
      </View>
    );
  }
);

const Row = React.memo(({ white, row, playerColor, ...rest }: RowProps) => {
  const offset = white ? 0 : 1;
  return (
    <View style={styles.container}>
      {new Array(8).fill(0).map((_, i) => (
        <Square
          {...rest}
          playerColor={playerColor}
          row={row}
          col={i}
          key={i}
          white={playerColor === 'white' ? ((i + offset) % 2 === 1) : ((i + offset) % 2 === 0)}
        />
      ))}
    </View>
  );
});

const Background: React.FC<{ playerColor: PlayerColor }> = React.memo(
  ({ playerColor }) => {
    const { withLetters, withNumbers } = useChessboardProps();
    return (
      <View style={{ flex: 1 }}>
        {new Array(8).fill(0).map((_, i) => (
          <Row
            key={i}
            white={playerColor === 'white' ? i % 2 === 0 : i % 2 === 1}
            row={i}
            playerColor={playerColor}
            letters={withLetters}
            numbers={withNumbers}
          />
        ))}
      </View>
    );
  }
);


export default Background;
