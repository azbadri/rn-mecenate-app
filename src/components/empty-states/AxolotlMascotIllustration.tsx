import { SvgXml } from 'react-native-svg';

import { EMPTY_STATE_MASCOT_SVG } from './emptyStateMascotSvg';

const VIEWBOX_W = 112;
const VIEWBOX_H = 81;

type Props = {
  width?: number;
  height?: number;
};

export function AxolotlMascotIllustration({ width = 220, height: heightProp }: Props) {
  const h = heightProp ?? (width * VIEWBOX_H) / VIEWBOX_W;

  return <SvgXml xml={EMPTY_STATE_MASCOT_SVG} width={width} height={h} accessible={false} />;
}
