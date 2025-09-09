import { useState, useCallback } from 'react'
import { MemoryStickIcon, Zap } from 'lucide-react'
import PropTypes from 'prop-types'

const RamSlider = ({ minRam = 4, maxRam = 24, defaultRam = 4, onRamChange, systemRam = 16 }) => {
  const [selectedRam, setSelectedRam] = useState(defaultRam)
  const [isDragging, setIsDragging] = useState(false)

  const handleRamChange = useCallback(
    (value) => {
      const clampedValue = Math.max(minRam, Math.min(maxRam, value))
      setSelectedRam(clampedValue)
      onRamChange?.(clampedValue)
    },
    [minRam, maxRam, onRamChange]
  )

  const percentage = ((selectedRam - minRam) / (maxRam - minRam)) * 100
  const usagePercentage = (selectedRam / systemRam) * 100

  const getUsageColor = () => {
    if (usagePercentage < 50) return 'text-emerald-500'
    if (usagePercentage < 75) return 'text-amber-500'
    return 'text-red-500'
  }

  const getUsageBarColor = () => {
    if (usagePercentage < 50) return 'bg-emerald-500'
    if (usagePercentage < 75) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const presetValues = [4, 6, 8, 12, 16].filter((val) => val >= minRam && val <= maxRam)

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="space-y-2">
            <p className="font-semibold uppercase flex items-center gap-2">
              <MemoryStickIcon className="w-4 h-4" strokeWidth={2} /> Utilisation de la mémoire
            </p>
            <div className="text-left flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-slate-100">{selectedRam}</span>
                <span className="text-slate-400 text-sm">GB</span>
              </div>
              <div className={`text-xs font-medium ${getUsageColor()}`}>
                {usagePercentage.toFixed(0)}% du système
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="mb-6">
        <div className="relative">
          {/* Background Track */}
          <div className="h-2 bg-slate-700/50 rounded-full relative overflow-hidden">
            {/* Progress Fill */}
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${getUsageBarColor()}`}
              style={{ width: `${percentage}%` }}
            />

            {/* Glow Effect */}
            <div
              className={`absolute top-0 h-full rounded-full opacity-30 blur-sm transition-all duration-300 ${getUsageBarColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min={minRam}
            max={maxRam}
            step={0.5}
            value={selectedRam}
            onChange={(e) => handleRamChange(parseFloat(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          />

          {/* Custom Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ${
              isDragging ? 'scale-125' : 'scale-100'
            }`}
            style={{ left: `${percentage}%` }}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 border-slate-800 shadow-lg transition-all duration-300 ${getUsageBarColor()}`}
            >
              <div
                className={`w-full h-full rounded-full opacity-50 blur-sm ${getUsageBarColor()}`}
              />
            </div>
          </div>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-slate-400">{minRam}GB</span>
          <span className="text-xs text-slate-400">{maxRam}GB</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Presets rapides</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presetValues.map((preset) => (
            <button
              key={preset}
              onClick={() => handleRamChange(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                selectedRam === preset
                  ? `${getUsageBarColor()} text-slate-900 border-transparent shadow-md`
                  : 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/50'
              }`}
            >
              {preset}GB
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

RamSlider.propTypes = {
  minRam: PropTypes.number,
  maxRam: PropTypes.number,
  defaultRam: PropTypes.number,
  onRamChange: PropTypes.func,
  systemRam: PropTypes.number
}

export default RamSlider
