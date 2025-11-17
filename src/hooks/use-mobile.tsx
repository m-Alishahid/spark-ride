import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkDevice()

    // Add event listener for resize
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  return isMobile
}