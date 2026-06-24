const MESES = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export const getNombreMes = (numeroMes: number): string => {
  const mes = MESES[numeroMes - 1]
  if (!mes) throw new Error(`Mes inválido: ${numeroMes}`)
  return mes
}