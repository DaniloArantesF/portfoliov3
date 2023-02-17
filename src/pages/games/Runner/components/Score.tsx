import { Text } from '@react-three/drei';
import { useStore } from '../store';

function Score() {
  const { score } = useStore();

  return (
    <Text
      rotation={[0, Math.PI, 0]}
      position={[0, 10, 0]}
      fontSize={3}
      children={score}
      color={'red'}
    />
  );
}

export default Score;
