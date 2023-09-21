import { useEffect, useState } from "react";
import styled from "styled-components"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { ChartBox } from "./components/ChartBox/ChartBox"
import { Header } from "./components/Header/Header"
import { GlobalStyles } from "./styles/global"

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: -60px;
  padding-bottom: 60px;
`

const dataMock = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Fev',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Jun',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Jul',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Ago',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Set',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

interface DataI {
  lastUpdate: string,
  'ocrr por cidade': { [x: string]: number }
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

  const commonChartProps = {
    margin: {
      top: 50,
      right: 30,
      left: 20,
      bottom: 25,
    }
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'medium'
  }).format(data ? new Date(data.lastUpdate) : undefined)

  const perCity = Object.entries(data?.["ocrr por cidade"] || {}).map(([city, amount]) => {
    return {
      name: city,
      value: amount,
    }
  })

  return (
    <>
      <GlobalStyles />
      <Header />

      <Main>
        <span>Última atualização: {formattedDate}</span>

        <ChartBox title="Número de atendimentos x Tempo">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataMock} {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pv" stroke="#C20D2F" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Número de atendimento x Cidade">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perCity} {...commonChartProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#C20D2F" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* <ChartBox title="Gráfico 3" /> */}
      </Main>
    </>
  )
}

export default App
