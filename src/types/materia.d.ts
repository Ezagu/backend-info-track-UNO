export type SearchMateriaInput = {
  search?: string
  page?: number
  limit?: number
}

export type IMateria = {
  id: string
  nombre: string
  nombreNormalizado: string
  electiva: boolean
  promocion: boolean
  cargaHorariaSemanal?: number
  cargaHorariaTotal?: number
  linkCampus?: string
  linkWhatsapp?: string
}