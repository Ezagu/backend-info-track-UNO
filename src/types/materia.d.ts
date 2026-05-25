export type IMateria = {
  id: string
  nombre: string
  nombreNormalizado: string
  electiva: boolean
  promocion: boolean
  correlativas: string[]
  cargaHorariaSemanal?: number
  cargaHorariaTotal?: number
  linkCampus?: string
  linkWhatsapp?: string
}