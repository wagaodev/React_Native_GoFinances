import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import * as S from './styles';

import { HighlightCard, TransactionCard } from '../../components';
import { DataProps as TransactionCardProps } from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData,
  );

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    function getLastTransactionDate(
      collection: DataListProps[],
      type: 'positive' | 'negative',
    ) {
      const lastTransaction = new Date(
        Math.max.apply(
          Math,
          collection
            .filter((transaction) => transaction.type === type)
            .map((transaction) => new Date(transaction.date).getTime()),
        ),
      );

      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
        'pt-BR',
        {
          month: 'long',
        },
      )}`;
    }

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      },
    );
    setTransactions(transactionsFormatted);
    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      'positive',
    );
    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      'negative',
    );
    const totalInterval = `01 a ${lastTransactionExpensives}`;

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastTransactionExpensives}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  const theme = useTheme();

  return (
    <S.Container>
      {isLoading ? (
        <S.LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </S.LoadingContainer>
      ) : (
        <>
          <S.Header>
            <S.UserWrapper>
              <S.UserInfo>
                <S.Photo
                  source={{
                    uri: 'https://avatars.githubusercontent.com/u/66399640?v=4',
                  }}
                />
                <S.User>
                  <S.UserGreeting>Olá, </S.UserGreeting>
                  <S.UserName>Wagner</S.UserName>
                </S.User>
              </S.UserInfo>
              <S.LogoutButton>
                <S.LogoutButtonText>
                  <S.Icon name="poweroff" />
                </S.LogoutButtonText>
              </S.LogoutButton>
            </S.UserWrapper>
          </S.Header>

          <S.HightLightCardContainer
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />
          </S.HightLightCardContainer>

          <S.Transactions>
            <S.Title>Listagem</S.Title>

            <S.TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </S.Transactions>
        </>
      )}
    </S.Container>
  );
};

export default Home;
