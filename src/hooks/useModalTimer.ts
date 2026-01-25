import { useEffect, useState, useCallback } from 'react'

/**
 * 모달에서 사용하는 카운트다운 타이머 훅
 * @param initialMinutes 초기 분 단위 시간 (기본값: 5분)
 * @returns { timeLeft, isExpired, startTimer, resetTimer, formatTime }
 */
export function useModalTimer(initialMinutes: number = 5) {
  const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60) // 초 단위로 저장
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60)
    setIsActive(true)
  }, [initialMinutes])

  const resetTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60)
    setIsActive(false)
  }, [initialMinutes])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  const isExpired = timeLeft === 0

  return {
    timeLeft,
    isExpired,
    isActive,
    startTimer,
    resetTimer,
    formatTime: formatTime(timeLeft),
  }
}
