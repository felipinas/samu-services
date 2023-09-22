import { useEffect, useState, Fragment } from "react";
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
import { Main } from "./styles/utils";

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

    connection.onmessage = (e) => {
      const serverMessage = e.data;

      setData(JSON.parse(serverMessage))
    }

    connection.onclose = () => console.log('Connection closed');
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

  const legendFormatter = (value: 'male' | 'female' | 'notDefined') => {
    const values = {
      male: 'Masculino',
      female: 'Feminino',
      notDefined: 'Não identificado'
    };

    const formattedValue = values[value];

    return <span>{formattedValue}</span>
  }

  return (
    <Fragment>
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

              <Bar name="Atendimentos" dataKey="value" fill="#C20D2F" />
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
                label
              >
                {perGender.map((_, index) => {
                  return  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                })}
              </Pie>

              <Legend formatter={legendFormatter} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </Main>
    </Fragment>
  )
}

export default App
