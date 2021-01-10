import * as S from "./Clay.styles";
import React from "react";

export interface ClayProps {
  className?: string;
}

const Clay: React.FC<ClayProps> = ({ className }) => {
  return <S.Wrapper className={className}></S.Wrapper>;
};

export default Clay;
