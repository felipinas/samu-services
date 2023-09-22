export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'medium'
  }).format(date)
}

export const PIE_COLORS = ['#0088FE', '#ff22ff', '#FFBB28'];

export const COMMON_CHART_PROPS = {
  margin: {
    top: 50,
    right: 30,
    left: 20,
    bottom: 25,
  }
}