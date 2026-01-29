import { useCallback, useEffect, useMemo, useState } from 'react'

export function useCountdown(durationSec: number) {
  const [remain, setRemain] = useState(0)

  const start = useCallback(() => {
    setRemain(durationSec)
  }, [durationSec])

  const reset = useCallback(() => {
    setRemain(0)
  }, [])

  useEffect(() => {
    if (remain <= 0) return
    const id = window.setInterval(() => {
      setRemain((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [remain])

  const mmss = useMemo(() => {
    const m = Math.floor(remain / 60)
    const s = remain % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [remain])

  return {
    remain,
    mmss,
    isRunning: remain > 0,
    start,
    reset,
  }
}
