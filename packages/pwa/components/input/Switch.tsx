import { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const SwitchButton = styled.span`
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 28px;
  height: 28px;
  border-radius: 30px;
  transition: 0.2s;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
`

type SwitchLabelProps = {
  isChecked?: boolean
}

const SwitchLabel = styled.label<SwitchLabelProps>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 64px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.faded};
  border-radius: 64px;
  position: relative;
  transition: background-color 0.2s;

  &:active {
    ${SwitchButton} {
      width: 32px;
    }
  }

  ${({ isChecked }) =>
    isChecked &&
    css`
      background-color: ${({ theme }) => theme.colors.success};
    `}
`

type SwitchProps = InputHTMLAttributes<HTMLInputElement>

const SwitchInput = styled.input.attrs<SwitchProps>({
  type: 'checkbox',
})`
  height: 0;
  width: 0;
  visibility: hidden;

  &:checked + ${SwitchButton} {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`

export default function Switch(props: SwitchProps): JSX.Element {
  return (
    <SwitchLabel isChecked={props.checked}>
      <SwitchInput {...props} />
      <SwitchButton />
    </SwitchLabel>
  )
}
