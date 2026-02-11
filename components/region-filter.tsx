'use client'

import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

interface RegionFilterProps {
  selectedRegion: string | null
  onRegionChange: (region: string | null) => void
}

const REGIONS = ['NA', 'EU', 'Asia', 'SA', 'AU']

function RegionFilterComponent({ selectedRegion, onRegionChange }: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((region: string | null) => {
    onRegionChange(region)
    setIsOpen(false)
  }, [onRegionChange])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-full bg-secondary/50 hover:bg-secondary/70 border border-white/10 transition-colors text-sm font-medium w-full sm:w-auto"
      >
        <span className="text-muted-foreground">Region:</span>
        <span className="text-foreground font-bold">{selectedRegion || 'All'}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-secondary border border-white/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[150px]">
          <button
            onClick={() => handleSelect(null)}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary/70 transition-colors ${
              !selectedRegion ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
          >
            All Regions
          </button>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => handleSelect(region)}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary/70 transition-colors ${
                selectedRegion === region ? 'bg-primary text-primary-foreground' : 'text-foreground'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(RegionFilterComponent)
