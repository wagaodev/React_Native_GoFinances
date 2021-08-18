import { Platform } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 14,
  },
})``;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${Platform.OS === 'ios' ? RFValue(113) : 40}px;

  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.Poppins500};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`;
