"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { 
  Search, 
  Pen, 
  Code, 
  Layers, 
  Terminal, 
  Mail, 
  Instagram, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Monitor,
  User,
  Linkedin,
  Maximize2,
  Smartphone
} from "lucide-react"
import { createPortal } from "react-dom"

// =============================================
// CAROUSEL SLIDE DATA
// Replace src with actual image paths when available
// =============================================

const gymNodeSlides = [
  {
    src: "/projects/gym-node/panel-general.png",
    label: "Panel general",
    description: "Vista central de operación diaria del gimnasio"
  },
  {
    src: "/projects/gym-node/clientes.png",
    label: "Clientes",
    description: "Gestión completa del padrón de socios activos"
  },
  {
    src: "/projects/gym-node/cuotas.png",
    label: "Cuotas",
    description: "Control de pagos, vencimientos y estados de cuenta"
  },
  {
    src: "/projects/gym-node/caja-tesoreria.png",
    label: "Caja y tesorería",
    description: "Seguimiento de ingresos y movimientos de caja"
  },
  {
    src: "/projects/gym-node/movimientos.png",
    label: "Movimientos",
    description: "Historial detallado de operaciones registradas"
  },
  {
    src: "/projects/gym-node/historial.png",
    label: "Historial",
    description: "Consulta de registros y actividad del sistema"
  },
]
const trackitSlides = [
  {
    src: "/projects/trackit-one/tareas.png",
    label: "Tareas",
    description: "Organización y seguimiento de entregas pendientes"
  },
  {
    src: "/projects/trackit-one/calendario.png",
    label: "Calendario",
    description: "Vista mensual y semanal de actividades académicas"
  },
  {
    src: "/projects/trackit-one/inicio.png",
    label: "Inicio",
    description: "Panel central con resumen del estado académico"
  },
  {
    src: "/projects/trackit-one/concentracion.png",
    label: "Concentración",
    description: "Modo foco para sesiones de estudio sin distracciones"
  },
  {
    src: "/projects/trackit-one/estadisticas.png",
    label: "Estadísticas",
    description: "Métricas de productividad y avance académico"
  },
  {
    src: "/projects/trackit-one/materias.png",
    label: "Materias",
    description: "Gestión de asignaturas, horarios y contenidos"
  },
]

// =============================================
// INTERSECTION OBSERVER HOOK
// =============================================

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(element)
      }
    }, { threshold: 0.1, ...options })

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

// =============================================
// PROJECT CAROUSEL COMPONENT (NEW DESIGN)
// =============================================

type SlideData = {
  src: string
  label: string
  description: string
}

function ProjectCarousel({ slides }: { slides: SlideData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreenMounted, setIsFullscreenMounted] = useState(false)
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false)
  const [showOverlayText, setShowOverlayText] = useState(true)
  const [mounted, setMounted] = useState(false)

  const [fullscreenDirection, setFullscreenDirection] = useState<"left" | "right" | null>(null)
  const [isFullscreenSlideAnimating, setIsFullscreenSlideAnimating] = useState(false)
  const [showFullscreenOverlayText, setShowFullscreenOverlayText] = useState(true)

  const [showRotateHint, setShowRotateHint] = useState(false)

  // Normaliza índices para loop infinito
  const getWrappedIndex = useCallback(
    (index: number) => (index + slides.length) % slides.length,
    [slides.length]
  )

  const triggerFullscreenSlideAnimation = useCallback(
    (direction: "left" | "right", updater: () => void) => {
      if (isFullscreenSlideAnimating) return

      setFullscreenDirection(direction)
      setIsFullscreenSlideAnimating(true)
      setShowFullscreenOverlayText(true)

      window.setTimeout(() => {
        updater()
      }, 90)

      window.setTimeout(() => {
        setIsFullscreenSlideAnimating(false)
        setFullscreenDirection(null)
      }, 220)
    },
    [isFullscreenSlideAnimating]
  )

  const goToPrevious = useCallback(() => {
    if (isFullscreenMounted) {
      triggerFullscreenSlideAnimation("left", () => {
        setCurrentIndex((prev) => getWrappedIndex(prev - 1))
      })
      return
    }

    setCurrentIndex((prev) => getWrappedIndex(prev - 1))
  }, [getWrappedIndex, isFullscreenMounted, triggerFullscreenSlideAnimation])

  const goToNext = useCallback(() => {
    if (isFullscreenMounted) {
      triggerFullscreenSlideAnimation("right", () => {
        setCurrentIndex((prev) => getWrappedIndex(prev + 1))
      })
      return
    }

    setCurrentIndex((prev) => getWrappedIndex(prev + 1))
  }, [getWrappedIndex, isFullscreenMounted, triggerFullscreenSlideAnimation])

  const goToIndex = useCallback(
    (index: number) => {
      const wrappedTarget = getWrappedIndex(index)

      if (wrappedTarget === currentIndex) return

      if (isFullscreenMounted) {
        triggerFullscreenSlideAnimation(
          wrappedTarget > currentIndex ? "right" : "left",
          () => {
            setCurrentIndex(wrappedTarget)
          }
        )
        return
      }

      setCurrentIndex(wrappedTarget)
    },
    [getWrappedIndex, currentIndex, isFullscreenMounted, triggerFullscreenSlideAnimation]
  )

  const openFullscreen = useCallback(() => {
    setIsFullscreenMounted(true)
    setShowFullscreenOverlayText(true)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsFullscreenVisible(true)
      })
    })
  }, [])

  const closeFullscreen = useCallback(() => {
    setIsFullscreenVisible(false)
  }, [])

  const closeFullscreenWithDelay = useCallback(() => {
  window.setTimeout(() => {
    setIsFullscreenVisible(false)
  }, 150)
}, [])

  const currentSlide = slides[currentIndex]

  const getRelativeOffset = useCallback(
    (index: number) => {
      let diff = index - currentIndex
      const total = slides.length
      const half = Math.floor(total / 2)

      if (diff > half) diff -= total
      if (diff < -half) diff += total

      return diff
    },
    [currentIndex, slides.length]
  )

  useEffect(() => {
    if (!isFullscreenMounted || !isFullscreenVisible) return

    const isMobile = window.innerWidth < 768
    const isPortrait = window.innerHeight > window.innerWidth

    if (isMobile && isPortrait) {
      setShowRotateHint(true)

      const timer = window.setTimeout(() => {
        setShowRotateHint(false)
      }, 3000)

      return () => window.clearTimeout(timer)
    } else {
      setShowRotateHint(false)
    }
  }, [isFullscreenMounted, isFullscreenVisible, currentIndex])

  useEffect(() => {
    if (!isFullscreenMounted) return
    if (isFullscreenVisible) return

    const timeout = window.setTimeout(() => {
      setIsFullscreenMounted(false)
      setFullscreenDirection(null)
      setIsFullscreenSlideAnimating(false)
      setShowFullscreenOverlayText(true)
    }, 260)

    return () => window.clearTimeout(timeout)
  }, [isFullscreenMounted, isFullscreenVisible])

  // Mostrar texto al cambiar de slide en el carrusel normal y ocultarlo después
  useEffect(() => {
    if (isFullscreenMounted) return

    setShowOverlayText(true)

    const timeout = window.setTimeout(() => {
      setShowOverlayText(false)
    }, 2800)

    return () => window.clearTimeout(timeout)
  }, [currentIndex, isFullscreenMounted])

  // Mostrar texto al abrir fullscreen o cambiar slide, y ocultarlo después de unos segundos
  useEffect(() => {
    if (!isFullscreenMounted || !isFullscreenVisible) return

    setShowFullscreenOverlayText(true)

    const timeout = window.setTimeout(() => {
      setShowFullscreenOverlayText(false)
    }, 4200)

    return () => window.clearTimeout(timeout)
  }, [currentIndex, isFullscreenMounted, isFullscreenVisible])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreenMounted) {
        closeFullscreen()
      }

      if (e.key === "ArrowLeft") {
        goToPrevious()
      }

      if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreenMounted, goToPrevious, goToNext, closeFullscreen])

  // Bloquear scroll en fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreenMounted ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreenMounted])

  const renderSlideImage = (
    slide: SlideData,
    alt: string,
    priority = false
  ) => {
    if (slide.src) {
      return (
        <div className="absolute inset-0 flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-3 lg:p-5">
          <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-[#0F172A]">
            <Image
              src={slide.src}
              alt={alt}
              fill
              priority={priority}
              className="object-contain object-center"
            />
          </div>
        </div>
      )
    }

    return (
      <div className="w-full h-full bg-[#1E293B] flex items-center justify-center">
        <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-[#94A3B8]" strokeWidth={1.5} />
      </div>
    )
  }

  const getFullscreenImageAnimationClass = () => {
    if (!isFullscreenVisible) {
      return "opacity-0 scale-[0.97]"
    }

    if (!isFullscreenSlideAnimating || !fullscreenDirection) {
      return "opacity-100 translate-x-0 scale-100"
    }

    if (fullscreenDirection === "right") {
      return "opacity-100 -translate-x-3 scale-[0.985]"
    }

    return "opacity-100 translate-x-3 scale-[0.985]"
  }

  const interactiveButtonClass =
  "touch-manipulation transition-all duration-150 hover:scale-[1.03] hover:brightness-110 hover:bg-[rgba(0,194,203,0.18)] hover:border-[rgba(0,194,203,0.4)] active:scale-90 active:bg-[rgba(0,194,203,0.22)] active:border-[rgba(0,194,203,0.55)] active:text-[#00C2CB] active:brightness-100" 
  return (
    <>
      {/* =========================
      CARRUSEL NORMAL
      ========================= */}
    <div className="w-full overflow-x-hidden lg:overflow-x-visible">
      <div className="relative w-full overflow-x-hidden overflow-y-visible lg:overflow-x-visible">
        <div className="relative w-full h-[330px] sm:h-[440px] lg:h-[560px] xl:h-[620px] overflow-visible">
          {/* Escena del carrusel */}
          <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-12">
              {slides.map((slide, index) => {
                const offset = getRelativeOffset(index)
                const isActive = offset === 0
                const isLeft = offset === -1
                const isRight = offset === 1
                const isFarLeft = offset === -2
                const isFarRight = offset === 2

                let transform = "translateX(0) scale(0.6)"
                let opacity = 0
                let zIndex = 0
                let pointerEvents: "auto" | "none" = "none"

                if (isActive) {
                  transform = "translateX(0%) scale(1) rotateY(0deg)"
                  opacity = 1
                  zIndex = 30
                  pointerEvents = "auto"
                } else if (isLeft) {
                  transform = "translateX(-36%) scale(0.88) rotateY(14deg)"
                  opacity = 0.62
                  zIndex = 20
                  pointerEvents = "auto"
                } else if (isRight) {
                  transform = "translateX(36%) scale(0.88) rotateY(-14deg)"
                  opacity = 0.62
                  zIndex = 20
                  pointerEvents = "auto"
                } else if (isFarLeft) {
                  transform = "translateX(-52%) scale(0.78) rotateY(18deg)"
                  opacity = 0.16
                  zIndex = 10
                } else if (isFarRight) {
                  transform = "translateX(52%) scale(0.78) rotateY(-18deg)"
                  opacity = 0.16
                  zIndex = 10
                }

                return (
                  <div
                    key={slide.label + index}
                    className="absolute top-1/2 left-1/2 w-[82%] sm:w-[86%] md:w-[84%] xl:w-[88%] h-[60%] sm:h-[72%] md:h-[88%]"
                    style={{
                      transform: `translate(-50%, -50%) ${transform}`,
                      opacity,
                      zIndex,
                      pointerEvents,
                      transition:
                        "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease",
                    }}
                  >
                    <div className="relative w-full h-full rounded-[22px] overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-[0_28px_80px_rgba(0,0,0,0.34)] bg-[#111827]">
                      {/* Área clickeable según posición */}
                      {isActive && (
                        <button
                          type="button"
                          onClick={openFullscreen}
                          className={`absolute inset-0 z-10 ${interactiveButtonClass}`}
                          aria-label="Abrir imagen en pantalla completa"
                        />
                      )}
                    
                      {isLeft && (
                        <button
                          type="button"
                          onClick={goToPrevious}
                          className={`absolute inset-0 z-10 hidden md:block ${interactiveButtonClass}`}
                          aria-label="Ir a la imagen anterior"
                        />
                      )}

                      {isRight && (
                        <button
                          type="button"
                          onClick={goToNext}
                          className={`absolute inset-0 z-10 hidden md:block ${interactiveButtonClass}`}
                          aria-label="Ir a la imagen siguiente"
                        />
                      )}

                      {renderSlideImage(slide, slide.label, isActive)}

                      {/* Oscurecimiento suave en laterales */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-[#0A0F1E]/22 pointer-events-none" />
                      )}

                      {/* Gradiente + texto solo en la slide activa */}
                      {isActive && (
                        <>
                          <div
                            className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-500"
                            style={{
                              height: "42%",
                              opacity: showOverlayText ? 1 : 0.82,
                              background:
                                "linear-gradient(to top, rgba(10, 15, 30, 0.96) 0%, rgba(10, 15, 30, 0.58) 38%, rgba(10, 15, 30, 0) 100%)",
                            }}
                          />

                          <div
                            className={`absolute left-0 right-0 bottom-0 p-5 sm:p-7 lg:px-9 lg:py-8 text-left pointer-events-none transition-all duration-500 ${
                              showOverlayText
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-2"
                            }`}
                          >
                            <span className="font-mono text-xs text-[#94A3B8] block mb-1.5">
                              {slide.label}
                            </span>
                            <p className="text-[14px] sm:text-[15px] text-[#F0F4F8] max-w-[700px]">
                              {slide.description}
                            </p>
                          </div>

                          {/* Botón fullscreen */}
                          <button
                            type="button"
                            onClick={openFullscreen}
                            className={`absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.18)] hover:border-[rgba(0,194,203,0.4)] transition-all duration-200 z-30 ${interactiveButtonClass}`}
                            aria-label="Pantalla completa"
                          >
                            <Maximize2 className="w-[18px] h-[18px]" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Flecha izquierda */}
            <button
              type="button"
              onClick={goToPrevious}
              className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.18)] hover:border-[rgba(0,194,203,0.4)] transition-all duration-200 z-40 ${interactiveButtonClass}`}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Flecha derecha */}
            <button
              type="button"
              onClick={goToNext}
              className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.18)] hover:border-[rgba(0,194,203,0.4)] transition-all duration-200 z-40 ${interactiveButtonClass}`}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2 sm:mt-4">
          {slides.map((slide, index) => (
            <button
              key={slide.label + index}
              type="button"
              onClick={() => goToIndex(index)}
              className={`h-2 rounded touch-manipulation transition-all duration-150 hover:brightness-110 active:scale-75 active:brightness-125 ${        
                  index === currentIndex
                  ? "bg-[#00C2CB] w-6"
                  : "bg-[#1E293B] w-2 hover:bg-[#2D3B4E]"
              }`}
              aria-label={`Ir a ${slide.label}`}
            />
          ))}
        </div>
      </div>

      {/* =========================
          FULLSCREEN
      ========================= */}
      {mounted &&
        isFullscreenMounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] bg-[#0A0F1E] transition-opacity duration-300 ${
              isFullscreenVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-screen h-screen overflow-hidden">
             {showRotateHint && (
              <div className="absolute top-4 left-0 w-full flex justify-center z-40 pointer-events-none animate-rotate-hint-fade">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[rgba(10,15,30,0.72)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                  <Smartphone className="w-5 h-5 text-[#F0F4F8] animate-rotate-device-hint" />
                </div>
              </div>
            )}
              {/* Imagen principal fullscreen */}
              <div
                onClick={() => {
                  setShowFullscreenOverlayText(false)
                  setShowRotateHint(false)
                }}
                className="absolute inset-0 flex items-center justify-center px-4 sm:px-8"
              >
                <div
                  className={`relative w-full h-full transition-all duration-300 ease-out ${getFullscreenImageAnimationClass()}`}
                >
                  {currentSlide.src ? (
                    <Image
                      src={currentSlide.src}
                      alt={currentSlide.label}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1E293B]">
                      <Monitor className="w-16 h-16 text-[#94A3B8]" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>

              {/* Gradiente + texto fullscreen */}
              <div
                className={`absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-500 z-10 ${
                  showFullscreenOverlayText && isFullscreenVisible
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                style={{
                  height: "36%",
                  background:
                    "linear-gradient(to top, rgba(10, 15, 30, 0.96) 0%, rgba(10, 15, 30, 0.58) 38%, rgba(10, 15, 30, 0) 100%)",
                }}
              />

              <div
                className={`absolute left-0 right-0 bottom-0 px-6 pt-6 pb-16 sm:px-8 sm:pt-8 sm:pb-20 lg:px-12 lg:py-10 text-left pointer-events-none transition-all duration-500 z-20 ${
                  showFullscreenOverlayText && isFullscreenVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <span className="font-mono text-xs sm:text-sm text-[#94A3B8] block mb-2">
                  {currentSlide.label}
                </span>
                <p className="text-[14px] sm:text-[15px] lg:text-base text-[#F0F4F8] max-w-[760px] leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>

              {/* Flecha izquierda */}
              <button
                type="button"
                onClick={goToPrevious}
                className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.2)] hover:border-[rgba(0,194,203,0.4)] transition-all duration-300 delay-100 z-30 ${interactiveButtonClass} ${
                  isFullscreenVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Flecha derecha */}
              <button
                type="button"
                onClick={goToNext}
                className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.2)] hover:border-[rgba(0,194,203,0.4)] transition-all duration-300 delay-100 z-30 ${interactiveButtonClass} ${
                  isFullscreenVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                }`}
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Cerrar */}
              <button
                type="button"
                onClick={closeFullscreenWithDelay}
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(10,15,30,0.62)] border border-[rgba(255,255,255,0.1)] text-[#F0F4F8] hover:bg-[rgba(0,194,203,0.2)] hover:border-[rgba(0,194,203,0.4)] active:bg-[rgba(0,194,203,0.24)] active:border-[rgba(0,194,203,0.6)] active:text-[#00C2CB] transition-all duration-300 delay-100 ${interactiveButtonClass} ${
                  isFullscreenVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
                aria-label="Cerrar pantalla completa"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dots fullscreen */}
              <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 transition-all duration-300 delay-150 ${
                  isFullscreenVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {slides.map((slide, index) => (
                  <button
                    key={slide.label + "-fullscreen-" + index}
                    type="button"
                    onClick={() => goToIndex(index)}
                    className={`h-2 rounded transition-all duration-150 hover:brightness-110 active:scale-90 active:brightness-110 ${                      index === currentIndex
                        ? "bg-[#00C2CB] w-6"
                        : "bg-[#1E293B] w-2 hover:bg-[#2D3B4E]"
                    }`}
                    aria-label={`Ir a ${slide.label}`}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

// =============================================
// ANIMATED COMPONENTS
// =============================================

type AnimationDirection = "up" | "down" | "left" | "right" | "fade"

function AnimatedSection({ 
  children, 
  className = "",
  direction = "up",
  delay = 0
}: { 
  children: React.ReactNode
  className?: string
  direction?: AnimationDirection
  delay?: number
}) {
  const { ref, isInView } = useInView()

  const getTransform = () => {
    if (!isInView) {
      switch (direction) {
        case "up": return "translateY(32px)"
        case "down": return "translateY(-16px)"
        case "left": return "translateX(-32px)"
        case "right": return "translateX(32px)"
        case "fade": return "translateY(0)"
        default: return "translateY(32px)"
      }
    }
    return "translate(0)"
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: getTransform(),
        transition: `all 600ms ease-out ${delay}ms`
      }}
      className={className}
    >
      {children}
    </div>
  )
}

function StaggeredBadges({
  items
}: {
  items: { name: string; logo: string }[]
}) {
  const { ref, isInView } = useInView()

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-4 sm:gap-5">
      {items.map((tech, index) => (
        <div
          key={tech.name}
          className="flex items-center gap-3 px-6 py-3 rounded-lg bg-[#161D2E] border border-[#1E293B] text-muted-foreground font-medium text-[15px] hover:text-[#F0F4F8] hover:border-[rgba(0,194,203,0.4)] hover:shadow-[0_0_12px_rgba(0,194,203,0.15)] transition-all duration-200 cursor-default"
          style={{
            opacity: isInView ? 1 : 0,
            transition: `opacity 600ms ease-out ${index * 60}ms`
          }}
        >
          <Image
            src={tech.logo}
            alt={tech.name}
            width={30}
            height={30}
            className="opacity-95 shrink-0"
          />
          <span>{tech.name}</span>
        </div>
      ))}
    </div>
  )
}

// =============================================
// NAVBAR COMPONENT
// =============================================

function Navbar({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pressedMobileLink, setPressedMobileLink] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

useEffect(() => {
  const handlePointerOutside = (event: MouseEvent | TouchEvent) => {
    if (!isMobileMenuOpen) return

    const target = event.target as Node
    if (navRef.current && !navRef.current.contains(target)) {
      setIsMobileMenuOpen(false)
      setPressedMobileLink(null)
    }
  }

  document.addEventListener("mousedown", handlePointerOutside)
  document.addEventListener("touchstart", handlePointerOutside)

  return () => {
    document.removeEventListener("mousedown", handlePointerOutside)
    document.removeEventListener("touchstart", handlePointerOutside)
  }
}, [isMobileMenuOpen])

  const navLinks = [
    { href: "#nosotros", label: "Nosotros" },
    { href: "#proyectos", label: "Proyectos" },
    { href: "#servicios", label: "Servicios" },
    { href: "#equipo", label: "Equipo" },
    { href: "#contacto", label: "Contacto" },
  ]

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()

    const isMobileViewport = window.innerWidth < 768

    if (isMobileMenuOpen && isMobileViewport) {
      setPressedMobileLink(href)

      window.setTimeout(() => {
        setIsMobileMenuOpen(false)
        setPressedMobileLink(null)
        onNavigate(href)
      }, 150)

      return
    }

    onNavigate(href)
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        // Mejora: Si el menú está abierto, forzamos el fondo oscuro para que el texto sea legible
        isScrolled || isMobileMenuOpen
          ? "bg-[#0A0F1E]/85 backdrop-blur-[12px] border-b border-[#1E293B]/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "#")}
            className="flex items-center shrink-0" // shrink-0 evita que el logo se deforme
          >
            <Image
              src="/logos/node3.png"
              alt="Node3"
              width={120}
              height={32}
              priority
            />
          </a>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isPressed = pressedMobileLink === link.href

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative inline-flex items-center rounded-md px-2 py-1 font-medium text-sm touch-manipulation transition-all duration-150 group ${
                    isPressed
                      ? "text-[#00C2CB] bg-[rgba(0,194,203,0.12)] scale-95"
                      : "text-muted-foreground hover:text-foreground active:scale-95 active:text-[#00C2CB]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-2 right-2 -bottom-0.5 h-[2px] bg-[#00C2CB] transition-all duration-200 ${
                      isPressed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </a>
              )
            })}
          </div>

          {/* Botón menú mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            // CORRECCIONES APLICADAS AQUÍ: relative y shrink-0
            className="md:hidden relative shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[#161D2E] border border-[#1E293B] text-[#F0F4F8] hover:text-[#00C2CB] hover:border-[#00C2CB]/40 touch-manipulation transition-all duration-150 z-50 hover:scale-[1.03] active:scale-95 active:bg-[rgba(0,194,203,0.12)] active:border-[#00C2CB]/70 active:text-[#00C2CB]">
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menú mobile desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1E293B]/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="relative inline-block rounded-md px-2 py-1 text-muted-foreground hover:text-foreground font-medium text-sm touch-manipulation transition-all duration-150 group active:scale-95 active:text-[#00C2CB] active:bg-[rgba(0,194,203,0.12)]">
                  {link.label}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#00C2CB] transition-all duration-250 group-hover:w-full group-active:w-full" />                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
// =============================================
// HERO SECTION
// =============================================

function HeroSection({ onNavigate }: { onNavigate: (href: string) => void }) {
  const { ref, isInView } = useInView()

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0F1E]">
      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#00C2CB 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Badge */}
        <div 
          className="inline-flex items-center px-3 py-1.5 mb-6 sm:mb-8 rounded-[6px] bg-[#161D2E] border border-[#1E293B]"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(-16px)",
            transition: "all 600ms ease-out 0ms"
          }}
        >
          <span className="font-mono text-xs sm:text-sm text-muted-foreground">
            {"// software con propósito"}
          </span>
        </div>

        {/* Main Title */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 text-balance"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(24px)",
            transition: "all 600ms ease-out 150ms"
          }}
        >
          {" "}<span className="text-[#00C2CB]">Soluciones reales </span>
          para problemas reales
        </h1>

        {/* Subtitle */}
        <p 
          className="max-w-xl mx-auto text-base sm:text-lg text-[#B8C4D6] mb-8 sm:mb-10 leading-relaxed text-pretty"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(24px)",
            transition: "all 600ms ease-out 300ms"
          }}
        >
          Antes de comenzar el desarrollo, entendemos el problema. Antes de proponer una solución, escuchamos. Así es como construimos software que realmente suma.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(24px)",
            transition: "all 600ms ease-out 450ms"
          }}
        >
         <button
            type="button"
            onClick={() => onNavigate("#proyectos")}
            // Abajo están todas las clases de diseño (Tailwind)
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00C2CB] text-[#0A0F1E] font-semibold text-sm touch-manipulation transition-all duration-150 hover:shadow-[0_0_20px_rgba(0,194,203,0.25)] hover:scale-[1.02] active:scale-95 active:brightness-95 active:shadow-none"
          > 
            {/* El '>' de arriba cierra la etiqueta de apertura */}
            Ver proyectos
          </button>
          <button
            type="button"
            onClick={() => onNavigate("#contacto")}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[#00C2CB] text-[#00C2CB] font-semibold text-sm touch-manipulation transition-all duration-150 hover:shadow-[0_0_20px_rgba(0,194,203,0.25)] hover:scale-[1.02] active:scale-95 active:bg-[#00C2CB]/10 active:border-[#00C2CB]/70"
          >
            Hablemos
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  )
}

// =============================================
// ABOUT SECTION
// =============================================

function AboutSection() {
  const pillars = [
    {
      icon: Search,
      title: "Análisis",
      description: "Entendemos el problema, el contexto y los objetivos antes de sentarnos a programar."
    },
    {
      icon: Pen,
      title: "Diseño",
      description: "Con el problema entendido, pensamos la solución. Cómo tiene que funcionar, cómo se va a usar y cómo va a crecer con el tiempo."
    },
    {
      icon: Code,
      title: "Implementación",
      description: "Construimos con énfasis en calidad, y entregamos algo de lo que nos sentimos orgullosos."
    }
  ]

  return (
    <section id="nosotros" className="min-h-screen py-20 sm:py-[120px] px-4 sm:px-6 lg:px-8 bg-[#111827] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <AnimatedSection direction="left">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// sobre nosotros"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              Proceso <span className="text-[#00C2CB]">claro</span>, resultado <span className="text-[#00C2CB]">concreto</span>.
            </h2>
            <p className="text-base sm:text-[17px] text-[#B8C4D6] leading-relaxed">     
              NODE3 es un estudio de ingeniería de software formado por tres estudiantes avanzados de ingeniería. Nos especializamos en construir productos digitales propios y soluciones a medida, siempre buscando comprender al cliente para crear algo con valor real.
            </p>
          </AnimatedSection>

          {/* Right Column - Cards */}
          <div className="flex flex-col gap-4">
            {pillars.map((pillar, index) => (
              <AnimatedSection key={index} direction="right" delay={index * 100}>
                <div className="p-5 sm:p-6 rounded-xl bg-[#161D2E] border border-[#1E293B] hover:border-[#00C2CB]/30 hover:-translate-y-1 transition-all duration-250 ease-out group">
                  <pillar.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00C2CB] mb-3" strokeWidth={1.5} />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================
// TEAM SECTION
// =============================================

function TeamSection() {
  const teamMembers = [
    {
      name: "Gabriel Alejo Mallet",
      image: "/team/gabriel.jpg",
      linkedin: "https://www.linkedin.com/in/gabriel-alejo-mallet-566980398/",
      rolePrimary: "Co-Founder",
      roleSecondary: "Software Developer",
      stack: "Java · Spring · PostgreSQL",
    },
    {
      name: "Nicolás Gauchat",
      image: "/team/gauchat.webp",
      linkedin: "https://www.linkedin.com/in/nicolás-gauchat/",
      rolePrimary: "Co-Founder",
      roleSecondary: "Software Developer",
      stack: "React · Next.js · Go",
    },
    {
      name: "Juan Ignacio Poggi",
      image: "/team/juan.webp",
      linkedin: "https://www.linkedin.com/in/juan-ignacio-poggi-5089a7334/",
      rolePrimary: "Co-Founder",
      roleSecondary: "Software Developer",
      stack: "Frontend · UX · React",
    },
  ]

  return (
    <section
      id="equipo"
      className="min-h-screen py-20 sm:py-[120px] px-4 sm:px-6 lg:px-8 bg-[#0A0F1E] flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// equipo"}
            </span>
            <h2 className="text-3xl sm:text-[40px] font-bold text-foreground mb-4 text-balance">
              Las <span className="text-[#00C2CB]">personas</span> detrás del código
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <AnimatedSection key={index} direction="up" delay={index * 100}>
              <div className="p-7 sm:p-8 rounded-2xl bg-[#161D2E] border border-[#1E293B] hover:border-[rgba(0,194,203,0.3)] hover:shadow-[0_0_24px_rgba(0,194,203,0.08)] hover:-translate-y-1 transition-all duration-200">
                {/* Foto */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border border-[#243045] bg-[#1E293B] relative shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Nombre */}
                <h3 className="text-[26px] leading-tight font-semibold text-foreground text-center mb-4 tracking-[-0.02em]">
                  {member.name}
                </h3>

                {/* Roles */}
                <div className="text-center mb-5">
                  <p className="text-[13px] uppercase tracking-[0.16em] text-[#00C2CB] mb-2">
                    {member.rolePrimary}
                  </p>
                  <p className="text-[15px] text-[#CBD5E1] font-medium">
                    {member.roleSecondary}
                  </p>
                </div>

                {/* Stack */}
                <p className="text-sm text-[#94A3B8] text-center leading-relaxed mb-6">
                  {member.stack}
                </p>

                {/* Divider */}
                <div className="border-t border-[#1E293B] mb-5" />

                {/* LinkedIn */}
                <div className="flex justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver LinkedIn de ${member.name}`}
                    className="text-[#94A3B8] hover:text-[#F0F4F8] transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95"                  >
                    <Linkedin className="w-5 h-5" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
// =============================================
// PROJECTS SECTION
// =============================================

function ProjectBlock({
  name,
  description,
  stack,
  slides,
  delay = 0
}: {
  name: string
  description: string
  stack: string[]
  slides: SlideData[]
  delay?: number
}) {
  return (
    <AnimatedSection direction="up" delay={delay}>
      <div className="w-full">
        {/* Header con ancho controlado */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-2 sm:mb-4 lg:mb-6 px-0 sm:px-[2.5%] lg:px-[5%]">
            <h3 className="text-[24px] font-bold text-[#F0F4F8]">
              {name}
            </h3>

            <div className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#161D2E] border border-[#1E293B]">
              <span className="font-mono text-xs text-[#94A3B8]">
                En desarrollo
              </span>
            </div>
          </div>
        </div>

        {/* Carrusel con ancho más amplio en desktop */}
        <div className="w-full xl:px-6 2xl:px-10">
          <ProjectCarousel slides={slides} />
        </div>

        {/* Info con ancho controlado */}
        <div className="max-w-6xl mx-auto">
          <div className="mt-4 sm:mt-6 px-0 sm:px-[2.5%] lg:px-[5%]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <p className="text-[15px] text-[#94A3B8] leading-relaxed max-w-[480px]">
                {description}
              </p>

              <div className="flex flex-col items-start lg:items-end gap-4">
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs px-2.5 py-1 rounded-[6px] bg-[#0A0F1E] border border-[#1E293B] text-[#94A3B8] hover:border-[rgba(0,194,203,0.3)] hover:text-[#F0F4F8] transition-all duration-150"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="scroll-mt-20 bg-[#0A0F1E]"
    >
      {/* Encabezado de sección */}
      <div className="min-h-[100svh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// proyectos"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 text-balance">
              Lo que estamos <span className="text-[#00C2CB]">construyendo</span>
            </h2>

            <p className="text-[#B8C4D6] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-pretty">
              Dos productos de software propios, en desarrollo activo.
            </p>

            {/* Indicador visual suave */}
            <div className="mt-10 sm:mt-12 flex justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground/70">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                  explorar
                </span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Contenido de proyectos */}
      <div className="pt-16 sm:pt-24 pb-20 sm:pb-[120px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Project 1 - Gym Node */}
          <div className="mb-20 sm:mb-24">
            <ProjectBlock
              name="Gym Node"
              description="Sistema de gestión para gimnasios diseñado para centralizar la operación diaria en una sola plataforma. Permite administrar clientes, asistencias, cuotas, precios e información administrativa con una estructura clara, moderna y preparada para crecer."
              stack={["Java", "Spring Boot", "PostgreSQL", "React", "Docker", "JWT"]}
              slides={gymNodeSlides}
              delay={100}
            />
          </div>

          {/* Project 2 - TrackIt-One */}
          <div>
            <ProjectBlock
              name="TrackIt-One"
              description="Aplicación de organización académica pensada para estudiantes que quieren administrar mejor su tiempo. Integra tareas, materias, calendario, seguimiento de entregas, estadísticas y espacios de concentración en una sola experiencia."
              stack={["React", "Next.js", "PostgreSQL", "Go"]}
              slides={trackitSlides}
              delay={200}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
// =============================================
// SERVICES SECTION
// =============================================

function ServicesSection() {
  return (
    <section id="servicios" className="min-h-screen py-20 sm:py-[120px] px-4 sm:px-6 lg:px-8 bg-[#111827] flex flex-col justify-center">      <div className="max-w-6xl mx-auto">
        <AnimatedSection direction="up">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// servicios"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              ¿En qué podemos <span className="text-[#00C2CB]">ayudarte</span>?
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Service - SaaS */}
          <AnimatedSection direction="up" delay={100}>
            <div className="relative h-full p-6 sm:p-8 rounded-xl bg-[#161D2E] border border-[#00C2CB]/30 hover:border-[#00C2CB]/50 hover:-translate-y-1 transition-all duration-250 ease-out">
              {/* Badge */}
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-[6px] bg-[#00C2CB]/10 border border-[#00C2CB]/30">
                <span className="text-[10px] sm:text-xs font-medium text-[#00C2CB]">especialidad</span>
              </div>

              <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C2CB] mb-4" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                Desarrollo de productos SaaS
              </h3>
              <p className="text-xs font-mono text-[#94A3B8] mb-3">
                Software por suscripción, accesible desde cualquier dispositivo
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Identificamos problemas reales y construimos productos digitales propios para resolverlos. Diseñamos la solución, la desarrollamos con foco en calidad y la llevamos al mercado. Pensando desde el principio para escalar y llegar a la mayor cantidad de personas posible.
              </p>
            </div>
          </AnimatedSection>

          {/* Secondary Service - Custom */}
          <AnimatedSection direction="up" delay={200}>
            <div className="h-full p-6 sm:p-8 rounded-xl bg-[#161D2E] border border-[#1E293B] hover:border-[#00C2CB]/30 hover:-translate-y-1 transition-all duration-250 ease-out">
              <Terminal className="w-6 h-6 sm:w-7 sm:h-7 text-[#00C2CB] mb-4" strokeWidth={1.5} />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                Desarrollo a medida
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Si tenés un problema o una idea pero no sabés bien por dónde arrancar, nosotros te ayudamos a darle forma. Definimos la solución juntos y la construimos con criterio y foco en lo que realmente necesitás.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// =============================================
// TECHNOLOGIES SECTION
// =============================================

function TechnologiesSection() {
  const technologies = [
    { name: "React", logo: "/technologies/react.png" },
    { name: "Next.js", logo: "/technologies/next.png" },
    { name: "Go", logo: "/technologies/go.png" },
    { name: "Java", logo: "/technologies/java.png" },
    { name: "Spring Boot", logo: "/technologies/spring.png" },
    { name: "PostgreSQL", logo: "/technologies/postgresql.png" },
    { name: "Docker", logo: "/technologies/docker.png" },
  ]
  return (
  <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0A0F1E]">  
      <div className="max-w-6xl mx-auto">
        <AnimatedSection direction="up">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// stack tecnológico"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Las <span className="text-[#00C2CB]">herramientas</span> con las que construimos
            </h2>
          </div>
        </AnimatedSection>

        <StaggeredBadges items={technologies} />
      </div>
    </section>
  )
}

// =============================================
// CONTACT SECTION
// =============================================

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reseteamos estados visuales previos
    setSubmitStatus("idle")
    setSubmitMessage("")

    const newErrors = {
      name: "",
      email: "",
      message: ""
    }

    let hasErrors = false

    // Validación del nombre
    if (!formData.name.trim()) {
      newErrors.name = "Por favor, ingresá tu nombre."
      hasErrors = true
    }

    // Validación del email
    if (!formData.email.trim()) {
      newErrors.email = "Por favor, ingresá tu email."
      hasErrors = true
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ingresá un email válido."
        hasErrors = true
      }
    }

    // Validación del mensaje
    if (!formData.message.trim()) {
      newErrors.message = "Por favor, escribí tu mensaje."
      hasErrors = true
    }

    setErrors(newErrors)

    if (hasErrors) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar el mensaje.")
      }

      setSubmitStatus("success")
      setSubmitMessage("Mensaje enviado correctamente. Te responderemos pronto.")

      // Limpiamos el formulario si salió bien
      setFormData({
        name: "",
        email: "",
        message: ""
      })

      setErrors({
        name: "",
        email: "",
        message: ""
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje. Intentá nuevamente."

      setSubmitStatus("error")
      setSubmitMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contacto"
      className="min-h-screen py-20 sm:py-[120px] px-4 sm:px-6 lg:px-8 bg-[#111827] flex flex-col justify-center"
    >
      <div className="max-w-3xl mx-auto w-full">
        <AnimatedSection direction="down">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-mono text-sm text-[#00C2CB] mb-4 block tracking-[0.08em]">
              {"// contacto"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              ¿Tenés un <span className="text-[#00C2CB]">proyecto</span> en mente?
            </h2>
            <p className="text-[#B8C4D6] text-pretty leading-relaxed">
              Si estás buscando un equipo técnico claro, serio y comprometido
              con construir bien, conversemos.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={200}>
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            <div>
              <input
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setErrors((prev) => ({ ...prev, name: "" }))
                }}
                className={`w-full px-4 py-3 rounded-lg bg-[#161D2E] border text-foreground placeholder:text-muted-foreground focus:border-[#00C2CB] focus:outline-none transition-colors duration-200 ${
                  errors.name ? "border-red-500" : "border-[#1E293B]"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Tu email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setErrors((prev) => ({ ...prev, email: "" }))
                }}
                className={`w-full px-4 py-3 rounded-lg bg-[#161D2E] border text-foreground placeholder:text-muted-foreground focus:border-[#00C2CB] focus:outline-none transition-colors duration-200 ${
                  errors.email ? "border-red-500" : "border-[#1E293B]"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Contanos de qué se trata tu proyecto"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value })
                  setErrors((prev) => ({ ...prev, message: "" }))
                }}
                rows={5}
                className={`w-full px-4 py-3 rounded-lg bg-[#161D2E] border text-foreground placeholder:text-muted-foreground focus:border-[#00C2CB] focus:outline-none transition-colors duration-200 resize-none ${
                  errors.message ? "border-red-500" : "border-[#1E293B]"
                }`}
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[220px] px-8 py-3 rounded-lg bg-[#00C2CB] text-[#0A0F1E] font-semibold text-sm touch-manipulation transition-all duration-150 hover:shadow-[0_0_20px_rgba(0,194,203,0.25)] hover:scale-[1.02] active:scale-95 active:brightness-95 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </button>
            </div>

            {submitMessage && (
              <div className="flex justify-center pt-2">
                <p
                  className={`text-sm text-center ${
                    submitStatus === "success" ? "text-[#00C2CB]" : "text-red-400"
                  }`}
                >
                  {submitMessage}
                </p>
              </div>
            )}
          </form>

          {/* Contact Info */}
          <div className="mt-10 pt-8 border-t border-[#1E293B]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a
                href="mailto:node3solutions@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-150 hover:scale-[1.03] active:scale-95 active:text-foreground"              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm">node3solutions@gmail.com</span>
              </a>

              <a
                href="https://instagram.com/node3sw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-150 hover:scale-[1.03] active:scale-95 active:text-foreground"              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm">@node3sw</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// =============================================
// FOOTER SECTION
// =============================================

function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-[#1E293B] bg-[#0A0F1E]">      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start leading-none">
            <Image
              src="/logos/node3-desarrollodesoftware.png"
              alt="Node3"
              width={130}
              height={36}
              className="h-16 w-auto"
            />
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            © {new Date().getFullYear()} NODE3
          </p>
        </div>
      </div>
    </footer>
  )
}

// =============================================
// MAIN PAGE COMPONENT
// =============================================

export default function Node3LandingPage() {
  const scrollToSection = useCallback((href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const target = document.querySelector(href)
    if (!target) return

    // Altura del navbar
    const navbarHeight = window.innerWidth >= 640 ? 80 : 64

    // Offset extra para que no quede tan abajo
    const extraOffset = window.innerWidth >= 640 ? 50 : 40

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight +
      extraOffset

    window.scrollTo({
      top,
      behavior: "smooth",
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0F1E] overflow-x-hidden">
      <Navbar onNavigate={scrollToSection} />
      <HeroSection onNavigate={scrollToSection} />
      <AboutSection />
      <ProjectsSection />
      <ServicesSection />
      <TeamSection />
      <ContactSection />
      <TechnologiesSection />
      <Footer />
    </main>
  )
}
