import { useEffect, useState } from "react";
import styled from "styled-components"
import {
  /* LineChart,
  Line, */
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { ChartBox } from "./components/ChartBox/ChartBox"
import { Header } from "./components/Header/Header"

import { GlobalStyles } from "./styles/global"

import { formatDate, PIE_COLORS, COMMON_CHART_PROPS } from "./utils";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: -60px;
  padding-bottom: 60px;
`

interface DataI {
  lastUpdate: string,
  casesPerCity: { [x: string]: number },
  casesPerGender: {
    male: number,
    female: number,
    notDefined: number
  }
}

function App() {
  const [data, setData] = useState<DataI | undefined>(undefined);

  useEffect(() => {
    const connection = new WebSocket('ws://localhost:8080/ocorrencias');

    connection.onopen = () => {
      console.log('Connection open!');

      connection.send('Hey server, whats up?');
    }

    connection.onmessage = (e) => {
      const server_message = e.data;

      console.log(JSON.parse(server_message));

      setData(JSON.parse(server_message))
    }

    connection.onclose = () => {
      console.log('Connection closed');
    }
  }, []);

  const formattedDate = data?.lastUpdate ? formatDate(new Date(data?.lastUpdate)) : 'Indisponível'

  const perCity = Object.entries(data?.casesPerCity || {}).map(([city, amount]) => {
    return {
      name: city,
      value: amount,
    }
  })

  const perGender = Object.entries(data?.casesPerGender || {}).map(([gender, amount]) => {
    return {
      name: gender,
      value: amount,
    }
  })

  return (
    <>
      <GlobalStyles />
      <Header />

      <Main>
        <span>Última atualização: {formattedDate}</span>

        {/* <ChartBox title="Número de atendimentos x Tempo">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataMock} {...COMMON_CHART_PROPS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pv" stroke="#C20D2F" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox> */}

        <ChartBox title="Número de atendimentos x Cidade">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perCity} {...COMMON_CHART_PROPS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#C20D2F" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Número de atendimentos x Gênero">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart {...COMMON_CHART_PROPS}>
              <Pie
                data={perGender}
                dataKey="value"
                nameKey="name"
                fill="#8884d8"
              >
                {perGender.map((_, index) => {
                  return  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                })}
              </Pie>

              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </Main>
    </>
  )
}

export default App
