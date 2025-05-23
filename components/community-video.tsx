"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface CommunityVideoProps {
  src: string
  title?: string
}

export function CommunityVideo({ src, title }: CommunityVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { language } = useLanguage()

  const translations = {
    en: {
      watchVideo: "Watch Community Video",
      loading: "Loading video...",
      playVideo: "Play video",
      pauseVideo: "Pause video",
      muteVideo: "Mute video",
      unmuteVideo: "Unmute video",
    },
    sw: {
      watchVideo: "Tazama Video ya Jamii",
      loading: "Inapakia video...",
      playVideo: "Cheza video",
      pauseVideo: "Simamisha video",
      muteVideo: "Zima sauti ya video",
      unmuteVideo: "Washa sauti ya video",
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

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true)
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener("loadeddata", handleLoad)
      return () => {
        video.removeEventListener("loadeddata", handleLoad)
      }
    }
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-lg">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
            <p>{t.loading}</p>
          </div>
        </div>
      )}

      <div className="aspect-video relative">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-center">
          {title && <h3 className="text-white text-xl md:text-2xl font-bubblegum mb-4 text-center px-4">{title}</h3>}

          <div className="flex space-x-4">
            <button
              onClick={togglePlay}
              className="bg-yammy-blue hover:bg-yammy-dark-blue text-white rounded-full p-3 transition-all"
              aria-label={isPlaying ? t.pauseVideo : t.playVideo}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={toggleMute}
              className="bg-yammy-blue hover:bg-yammy-dark-blue text-white rounded-full p-3 transition-all"
              aria-label={isMuted ? t.unmuteVideo : t.muteVideo}
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
