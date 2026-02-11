'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface RegionFilterProps {
  selectedRegion: string | null
  onRegionChange: (region: string | null) => void
}

const REGIONS = ['NA', 'EU', 'Asia', 'SA', 'AU']

export default function RegionFilter({ selectedRegion, onRegionChange }: RegionFilterProps) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary/70 border border-white/10 transition-colors text-sm font-medium"
      >
        <span className="text-muted-foreground">Region:</span>
        <span className="text-foreground font-bold">{selectedRegion || 'All'}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-secondary border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              onRegionChange(null)
              setIsOpen(false)
            }}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary/70 transition-colors ${
              !selectedRegion ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
          >
            All Regions
          </button>
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => {
                onRegionChange(region)
                setIsOpen(false)
              }}
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
