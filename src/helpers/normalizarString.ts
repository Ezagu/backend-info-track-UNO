export const normalizarString = (str: string): string => {
  // Saca las tildes del string
  return str
      .toLowerCase()
      .normalize("NFD")                    
      .replace(/[\u0300-\u036f]/g, "")     
}