import {Icon, SignOut, List, Plus, CaretDown, CaretDoubleDown} from '@phosphor-icons/react';

interface IconProps {
  iconName: string;
  size?: number;
  className?: string;
  weight?: 'regular' | 'fill' | 'bold';
}

type IconsType = {
  [key: string]: Icon;
};

const Icons: IconsType = {
  SignOut: SignOut, // 登出
  List: List, // 漢堡選單
  Plus: Plus, // +
  CaretDown: CaretDown, // 下拉箭頭
  CaretDoubleDown: CaretDoubleDown, // 雙下拉箭頭
};

function SvgIcon({iconName, size = 16, className = '', weight = 'regular'}: IconProps) {
  const IconComponent = Icons[iconName];
  return IconComponent && <IconComponent size={size} className={className} weight={weight} />;
}

export default SvgIcon;
