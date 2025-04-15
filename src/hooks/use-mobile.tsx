
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Verificar inicialmente
    checkMobile()
    
    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkMobile)
    
    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
