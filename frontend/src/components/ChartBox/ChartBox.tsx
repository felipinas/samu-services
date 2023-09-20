import { PropsWithChildren } from 'react';
import * as S from './styles.ts'

interface ChartBoxProps {
  title: string;
}

export function ChartBox(props: PropsWithChildren<ChartBoxProps>) {
  return (
    <S.Container>
      <span>
        {props.title}
      </span>

      {props.children}
    </S.Container>
  )
}