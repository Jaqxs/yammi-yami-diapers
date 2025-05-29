"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface CommunityVideoProps {
  src: string
  title?: string
}

export function CommunityVideo({ src, title }: CommunityVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  const translations = {
    en: {
      watchVideo: "Watch Community Video",
      loading: "Loading video...",
      playVideo: "Play video",
      pauseVideo: "Pause video",
      muteVideo: "Mute video",
      unmuteVideo: "Unmute video",
      fullscreen: "Fullscreen",
    },
    sw: {
      watchVideo: "Tazama Video ya Jamii",
      loading: "Inapakia video...",
      playVideo: "Cheza video",
      pauseVideo: "Simamisha video",
      muteVideo: "Zima sauti ya video",
      unmuteVideo: "Washa sauti ya video",
      fullscreen: "Skrini nzima",
    },
  }

  const t = translations[language || "en"]

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true)
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener("loadeddata", handleLoad)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      if (video) {
        video.removeEventListener("loadeddata", handleLoad)
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div className="w-full mb-8">
      <div className="bg-gradient-to-r from-yammy-blue to-yammy-orange p-1 rounded-3xl">
        <div ref={containerRef} className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10 rounded-3xl">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                <p>{t.loading}</p>
              </div>
            </div>
          )}

          {/* Video container with proper aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <video
              ref={videoRef}
              src={src}
              className="absolute top-0 left-0 w-full h-full object-contain"
              playsInline
              muted={isMuted}
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-6">
              {/* Title at top */}
              {title && (
                <div className="text-center">
                  <h3 className="text-white text-xl md:text-2xl font-bubblegum drop-shadow-lg">{title}</h3>
                </div>
              )}

              {/* Controls at bottom */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-4 transition-all transform hover:scale-110"
                  aria-label={isPlaying ? t.pauseVideo : t.playVideo}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all transform hover:scale-110"
                  aria-label={isMuted ? t.unmuteVideo : t.muteVideo}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all transform hover:scale-110"
                  aria-label={t.fullscreen}
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
