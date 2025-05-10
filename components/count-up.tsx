"use client"

import { useState, useEffect } from "react"

interface CountUpProps {
  start?: number
  end: number
  duration?: number
  separator?: string
}

export function CountUp({ start = 0, end, duration = 2, separator = "," }: CountUpProps) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * (end - start) + start))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [start, end, duration])

  return <>{count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)}</>
}
