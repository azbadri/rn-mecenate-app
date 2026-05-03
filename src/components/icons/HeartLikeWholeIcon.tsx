import Svg, { Path } from 'react-native-svg';

type Props = {
  color: string;
  size?: number;
};

const VIEW_W = 15;
const VIEW_H = 13;

const HEART_PATH =
  'M1.39453 7.56589L6.68848 12.5083C6.9082 12.7134 7.19824 12.8276 7.5 12.8276C7.80176 12.8276 8.0918 12.7134 8.31152 12.5083L13.6055 7.56589C14.4961 6.73679 15 5.5737 15 4.35788V4.18796C15 2.14011 13.5205 0.394017 11.502 0.0571027C10.166 -0.165554 8.80664 0.27097 7.85156 1.22605L7.5 1.57761L7.14844 1.22605C6.19336 0.27097 4.83398 -0.165554 3.49805 0.0571027C1.47949 0.394017 0 2.14011 0 4.18796V4.35788C0 5.5737 0.503906 6.73679 1.39453 7.56589Z';

export function HeartLikeWholeIcon({ color, size = 16 }: Props) {
  const w = size;
  const h = (size * VIEW_H) / VIEW_W;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} accessible={false}>
      <Path d={HEART_PATH} fill={color} />
    </Svg>
  );
}