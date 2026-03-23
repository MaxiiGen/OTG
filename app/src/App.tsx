import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import {
  Home, Menu, Bell, X, Navigation,
  HelpCircle, Shield, Settings,
  ChevronRight, Bus, MapPin, Info, ChevronDown
} from 'lucide-react'
import L from 'leaflet'
import './App.css'

// Custom icon creators
const createBusIcon = (label: string, color: string = '#f92f2f') => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `<div style="
      background: ${color};
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${color === '#ffffff' || color === '#fbbf24' ? '#1f2937' : 'white'};
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">${label}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

const createTerminalIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-terminal-icon',
    html: `<div style="
      position: relative;
      width: 44px;
      height: 44px;
    ">
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        border-top: 28px solid ${isSelected ? '#f92f2f' : '#dc2626'};
      "></div>
      <div style="
        position: absolute;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 18px;
        height: 18px;
        background: white;
        border-radius: 50%;
        border: 3px solid ${isSelected ? '#f92f2f' : '#dc2626'};
      "></div>
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  })
}

const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div style="
    background: #3b82f6;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

// Terminal data with real locations - All Mindanao Terminals
const terminals = [
  // DAVAO REGION (Region XI)
  {
    id: 1,
    name: 'Ecoland Bus Terminal',
    location: 'Davao City, Davao del Sur',
    position: [7.0707, 125.6087] as [number, number]
  },
  {
    id: 2,
    name: 'Tagum City Overland Terminal',
    location: 'Tagum City, Davao del Norte',
    position: [7.4478, 125.8078] as [number, number]
  },
  {
    id: 3,
    name: 'Panabo City Bus Terminal',
    location: 'Panabo City, Davao del Norte',
    position: [7.3072, 125.6836] as [number, number]
  },
  {
    id: 4,
    name: 'Digos City Terminal',
    location: 'Digos City, Davao del Sur',
    position: [6.7498, 125.3572] as [number, number]
  },
  {
    id: 5,
    name: 'Mati City Bus Terminal',
    location: 'Mati City, Davao Oriental',
    position: [6.9549, 126.2169] as [number, number]
  },

  // SOCCSKSARGEN (Region XII)
  {
    id: 6,
    name: 'General Santos Bus Terminal',
    location: 'General Santos City, South Cotabato',
    position: [6.1164, 125.1716] as [number, number]
  },
  {
    id: 7,
    name: 'Koronadal City Terminal',
    location: 'Koronadal City, South Cotabato',
    position: [6.5008, 124.8469] as [number, number]
  },
  {
    id: 8,
    name: 'Tacurong City Terminal',
    location: 'Tacurong City, Sultan Kudarat',
    position: [6.6903, 124.6767] as [number, number]
  },
  {
    id: 9,
    name: 'Kidapawan City Terminal',
    location: 'Kidapawan City, North Cotabato',
    position: [7.0089, 125.0892] as [number, number]
  },
  {
    id: 10,
    name: 'Kabacan Bus Terminal',
    location: 'Kabacan, North Cotabato',
    position: [7.1065, 124.8293] as [number, number]
  },

  // NORTHERN MINDANAO (Region X)
  {
    id: 11,
    name: 'Bulua Integrated Bus Terminal',
    location: 'Cagayan de Oro City, Misamis Oriental',
    position: [8.4542, 124.6319] as [number, number]
  },
  {
    id: 12,
    name: 'Iligan Integrated Bus Terminal',
    location: 'Iligan City, Lanao del Norte',
    position: [8.2280, 124.2452] as [number, number]
  },
  {
    id: 13,
    name: 'Valencia City Terminal',
    location: 'Valencia City, Bukidnon',
    position: [7.9064, 125.0935] as [number, number]
  },
  {
    id: 14,
    name: 'Malaybalay City Terminal',
    location: 'Malaybalay City, Bukidnon',
    position: [8.1536, 125.1278] as [number, number]
  },
  {
    id: 15,
    name: 'Oroquieta City Terminal',
    location: 'Oroquieta City, Misamis Occidental',
    position: [8.4858, 123.8053] as [number, number]
  },
  {
    id: 16,
    name: 'Ozamiz City Bus Terminal',
    location: 'Ozamiz City, Misamis Occidental',
    position: [8.1481, 123.8417] as [number, number]
  },
  {
    id: 17,
    name: 'Gingoog City Terminal',
    location: 'Gingoog City, Misamis Oriental',
    position: [8.8267, 125.1019] as [number, number]
  },

  // CARAGA (Region XIII)
  {
    id: 18,
    name: 'Butuan City Integrated Terminal',
    location: 'Butuan City, Agusan del Norte',
    position: [8.9475, 125.5406] as [number, number]
  },
  {
    id: 19,
    name: 'Surigao City Terminal',
    location: 'Surigao City, Surigao del Norte',
    position: [9.7869, 125.4919] as [number, number]
  },
  {
    id: 20,
    name: 'Tandag City Terminal',
    location: 'Tandag City, Surigao del Sur',
    position: [9.0783, 126.1989] as [number, number]
  },
  {
    id: 21,
    name: 'Bayugan City Terminal',
    location: 'Bayugan City, Agusan del Sur',
    position: [8.7117, 125.7444] as [number, number]
  },
  {
    id: 22,
    name: 'Bislig City Terminal',
    location: 'Bislig City, Surigao del Sur',
    position: [8.2061, 126.3219] as [number, number]
  },

  // ZAMBOANGA PENINSULA (Region IX)
  {
    id: 23,
    name: 'Zamboanga City Bus Terminal',
    location: 'Zamboanga City, Zamboanga del Sur',
    position: [6.9214, 122.0790] as [number, number]
  },
  {
    id: 24,
    name: 'Pagadian City Terminal',
    location: 'Pagadian City, Zamboanga del Sur',
    position: [7.8256, 123.4353] as [number, number]
  },
  {
    id: 25,
    name: 'Dipolog City Terminal',
    location: 'Dipolog City, Zamboanga del Norte',
    position: [8.5889, 123.3419] as [number, number]
  },
  {
    id: 26,
    name: 'Dapitan City Terminal',
    location: 'Dapitan City, Zamboanga del Norte',
    position: [8.6542, 123.4242] as [number, number]
  },
  {
    id: 27,
    name: 'Ipil Municipal Terminal',
    location: 'Ipil, Zamboanga Sibugay',
    position: [7.7847, 122.5756] as [number, number]
  },

  // BARMM (Bangsamoro Autonomous Region)
  {
    id: 28,
    name: 'Cotabato City Terminal',
    location: 'Cotabato City, Maguindanao',
    position: [7.2236, 124.2464] as [number, number]
  },
  {
    id: 29,
    name: 'Marawi City Terminal',
    location: 'Marawi City, Lanao del Sur',
    position: [8.0025, 124.2914] as [number, number]
  },
]

const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjRhODI5ZjcyY2M2MjQyZmE4Njk3YTkyZTg0MmNmZWYzIiwiaCI6Im11cm11cjY0In0='

// Bus data type with route path
type Bus = {
  id: number
  label: string
  name: string
  company: string
  color: string
  route: string
  destination: string
  position: [number, number]
  etaMinutes: number
  routePath?: [number, number][] // Array of coordinates along the actual road
  routeIndex?: number // Current index in the route path
  needsNewRoute?: boolean // Flag to indicate bus needs a new route fetched
}

// Bus data - each bus has a route and destination (positioned on roads near terminals)
const initialBuses: Bus[] = [
  // Mindanao Star buses (white) - starting from roads near Ecoland Terminal Davao
  { id: 1, label: '1', name: 'Mindanao Star 1', company: 'Mindanao Star', color: '#ffffff', route: 'Davao-Kidapawan', destination: 'Kidapawan City Terminal', position: [7.0695, 125.6095] as [number, number], etaMinutes: 35 },
  { id: 2, label: '2', name: 'Mindanao Star 2', company: 'Mindanao Star', color: '#ffffff', route: 'Davao-Cotabato', destination: 'Cotabato City Terminal', position: [7.0715, 125.6075] as [number, number], etaMinutes: 52 },
  { id: 7, label: '7', name: 'Mindanao Star 3', company: 'Mindanao Star', color: '#ffffff', route: 'Cotabato-Davao', destination: 'Ecoland Bus Terminal', position: [7.2225, 124.2455] as [number, number], etaMinutes: 48 },

  // Davao Metro Shuttle buses (red) - starting from roads near terminals
  { id: 3, label: '3', name: 'Davao Metro 1', company: 'Davao Metro Shuttle', color: '#ef4444', route: 'Davao-Kidapawan', destination: 'Kidapawan City Terminal', position: [7.0720, 125.6080] as [number, number], etaMinutes: 38 },
  { id: 4, label: '4', name: 'Davao Metro 2', company: 'Davao Metro Shuttle', color: '#ef4444', route: 'Kidapawan-Davao', destination: 'Ecoland Bus Terminal', position: [7.0095, 125.0885] as [number, number], etaMinutes: 42 },
  { id: 8, label: '8', name: 'Davao Metro 3', company: 'Davao Metro Shuttle', color: '#ef4444', route: 'Davao-Arakan', destination: 'Kidapawan City Terminal', position: [7.0700, 125.6100] as [number, number], etaMinutes: 45 },

  // Yellow Bus Liners (yellow) - operating Kidapawan-Koronadal route on main roads
  { id: 5, label: '5', name: 'Yellow Bus 1', company: 'Yellow Bus Liners', color: '#fbbf24', route: 'Kidapawan-Koronadal', destination: 'Koronadal City Terminal', position: [7.0085, 125.0885] as [number, number], etaMinutes: 28 },
  { id: 6, label: '6', name: 'Yellow Bus 2', company: 'Yellow Bus Liners', color: '#fbbf24', route: 'Koronadal-Kidapawan', destination: 'Kidapawan City Terminal', position: [6.5015, 124.8475] as [number, number], etaMinutes: 32 },
]

// Fetch route from OpenRouteService
async function fetchRoute(start: [number, number], end: [number, number]): Promise<[number, number][] | null> {
  try {
    console.log('🔄 Fetching route from ORS API:', {
      start: `${start[0]}, ${start[1]}`,
      end: `${end[0]}, ${end[1]}`,
      coordinates: [[start[1], start[0]], [end[1], end[0]]]
    })

    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [[start[1], start[0]], [end[1], end[0]]], // ORS uses [lng, lat]
        format: 'geojson',
        geometry_simplify: false,  // Get more detailed route points
        continue_straight: false,  // Allow turns for more accurate routing
        options: {
          avoid_features: [],
          profile_params: {
            restrictions: {
              // No special restrictions to ensure natural road following
            }
          }
        }
      })
    })

    console.log('📡 ORS API Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Route fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      return null
    }

    const data = await response.json()
    console.log('📊 Raw route data received:', data)

    if (!data.features || !data.features[0] || !data.features[0].geometry) {
      console.error('❌ Invalid route response format:', data)
      return null
    }

    const coordinates = data.features[0].geometry.coordinates
    console.log('🛣️ Route coordinates:', {
      total_waypoints: coordinates.length,
      first_point: coordinates[0],
      last_point: coordinates[coordinates.length - 1]
    })

    // Convert from [lng, lat] to [lat, lng] and ensure we have enough points
    const routePoints = coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number])

    // If we have very few points, add interpolated points for smoother movement
    if (routePoints.length < 10) {
      console.log('🔄 Interpolating points for smoother movement...')
      const interpolatedPoints: [number, number][] = []
      for (let i = 0; i < routePoints.length - 1; i++) {
        interpolatedPoints.push(routePoints[i])
        // Add a midpoint between each pair of coordinates
        const midLat = (routePoints[i][0] + routePoints[i + 1][0]) / 2
        const midLng = (routePoints[i][1] + routePoints[i + 1][1]) / 2
        interpolatedPoints.push([midLat, midLng])
      }
      interpolatedPoints.push(routePoints[routePoints.length - 1])
      console.log('✅ Route interpolated:', interpolatedPoints.length, 'total points')
      return interpolatedPoints
    }

    console.log('✅ Route fetched successfully:', routePoints.length, 'waypoints')
    return routePoints
  } catch (error) {
    console.error('❌ Error fetching route:', error)
    return null
  }
}

// Sample notifications
const sampleNotifications = [
  { id: 1, title: 'Bus 1 Arriving Soon', message: 'Your bus to Kabacan Terminal will arrive in 5 minutes.', time: '2 mins ago', type: 'arrival', unread: true },
  { id: 2, title: 'Route Update', message: 'Davao-Cot route has been updated with new stops.', time: '15 mins ago', type: 'update', unread: true },
  { id: 3, title: 'Bus Delay', message: 'Bus 3 is running 10 minutes late due to traffic.', time: '1 hour ago', type: 'delay', unread: false },
  { id: 4, title: 'New Terminal Added', message: 'General Santos Terminal is now available for tracking.', time: '3 hours ago', type: 'info', unread: false },
  { id: 5, title: 'Schedule Change', message: 'Evening schedules have been adjusted for tomorrow.', time: 'Yesterday', type: 'schedule', unread: false },
]

// Map center updater component
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

function LoadingPage({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="loading-page">
      <div className="logo-container">
        <img src="/logo.png" alt="OTG Bus Logo" className="logo-animate" />
      </div>
    </div>
  )
}

// FAQ Modal Component
function FaqModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <>
      <div className="overlay" onClick={onClose} style={{ zIndex: 2000 }} />
      <div className="terminal-popup" style={{ zIndex: 2001, maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="terminal-popup-header">
          <div>
            <h3 className="terminal-popup-title">FAQ & Help</h3>
            <p className="terminal-popup-location">How to use OTG Bus Tracker</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              🚌 How to track buses?
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Red circular markers with numbers represent buses. Tap on any bus to see its route, destination, and estimated time of arrival (ETA).
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              📍 How to check terminals?
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Red pin markers represent bus terminals. Tap on any terminal to see which buses are approaching and their ETAs.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              🔵 What is the blue dot?
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              The blue dot shows your current location. Tap the "Home" button at the bottom to center the map on your location.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              🔔 How do notifications work?
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              You'll receive notifications about bus arrivals, delays, and route updates. Check the notifications panel by tapping the bell icon.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              ℹ️ Need more help?
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              The app updates in real-time, so you can see buses moving along their routes. ETAs update every minute to give you accurate arrival times.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// About Modal Component
function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <>
      <div className="overlay" onClick={onClose} style={{ zIndex: 2000 }} />
      <div className="terminal-popup" style={{ zIndex: 2001, maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="terminal-popup-header">
          <div>
            <h3 className="terminal-popup-title">About OTG Bus Tracker</h3>
            <p className="terminal-popup-location">Version 1.0</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              📱 About the App
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              OTG Bus Tracker is a real-time bus tracking application for Mindanao, Philippines. Track buses, view ETAs, and plan your trips across the island.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              🗺️ Coverage Area
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '8px' }}>
              We cover 29 major bus terminals across Mindanao:
            </p>
            <ul style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginLeft: '20px' }}>
              <li>Davao Region (Region XI) - 5 terminals</li>
              <li>SOCCSKSARGEN (Region XII) - 5 terminals</li>
              <li>Northern Mindanao (Region X) - 7 terminals</li>
              <li>Caraga (Region XIII) - 5 terminals</li>
              <li>Zamboanga Peninsula (Region IX) - 5 terminals</li>
              <li>BARMM - 2 terminals</li>
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              🚀 Features
            </h4>
            <ul style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', marginLeft: '20px' }}>
              <li>Real-time bus location tracking</li>
              <li>Accurate ETA calculations</li>
              <li>Terminal information and approaching buses</li>
              <li>Your location on the map</li>
              <li>Route-based bus movement along actual roads</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f92f2f', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
              💡 Technology
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Powered by OpenStreetMap and OpenRouteService for accurate mapping and routing data.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Menu Drawer Component
function MenuDrawer({
  isOpen,
  onClose,
  onOpenFaq,
  onOpenAbout
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenFaq: () => void;
  onOpenAbout: () => void;
}) {
  type MenuItem = { icon: React.ElementType; label: string; action: () => void } | { divider: true }

  const menuItems: MenuItem[] = [
    { icon: MapPin, label: 'Saved Routes', action: () => alert('Saved Routes feature coming soon!') },
    { divider: true },
    { icon: Settings, label: 'Settings', action: () => alert('Settings feature coming soon!') },
    { icon: HelpCircle, label: 'FAQ & Help', action: onOpenFaq },
    { icon: Info, label: 'About OTG', action: onOpenAbout },
    { divider: true },
    { icon: Shield, label: 'Privacy Policy', action: () => alert('Privacy Policy: Your location data is only used for displaying your position on the map. We do not store or share your personal information.') },
  ]

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} style={{ zIndex: 1000 }} />}
      <div className={`menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className="menu-drawer-header">
          <div className="menu-drawer-logo">
            <img src="/logo.png" alt="OTG Logo" />
          </div>
          <h3 className="menu-drawer-title">OTG Bus Tracker</h3>
          <p className="menu-drawer-subtitle">Track buses in real-time</p>
        </div>
        <div className="menu-items">
          {menuItems.map((item, index) => (
            'divider' in item ? (
              <div key={`divider-${index}`} className="menu-divider" />
            ) : (
              <button 
                key={item.label} 
                className="menu-item"
                onClick={() => {
                  item.action()
                  onClose()
                }}
              >
                <item.icon className="menu-item-icon" size={22} />
                <span>{item.label}</span>
                <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#9ca3af' }} />
              </button>
            )
          ))}
        </div>
      </div>
    </>
  )
}

// Notifications Panel Component
function NotificationsPanel({ 
  isOpen, 
  onClose, 
  notifications,
  onClearAll 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  notifications: typeof sampleNotifications;
  onClearAll: () => void;
}) {
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} style={{ zIndex: 1000 }} />}
      <div className={`notifications-panel ${isOpen ? 'open' : ''}`}>
        <div className="notifications-header">
          <h3 className="notifications-title">Notifications</h3>
          {notifications.length > 0 && (
            <button className="notifications-clear" onClick={onClearAll}>
              Clear All
            </button>
          )}
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="notifications-empty-icon">
                <Bell size={28} />
              </div>
              <p>No notifications yet</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>We'll notify you about bus arrivals and updates</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.unread ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <Bus size={20} />
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

// Terminal Popup Component
function TerminalPopup({
  terminal,
  onClose,
  buses
}: {
  terminal: typeof terminals[0] | null;
  onClose: () => void;
  buses: Bus[];
}) {
  if (!terminal) return null

  // Get buses approaching this terminal
  const approachingBuses = buses.filter(bus => bus.destination === terminal.name)

  // Format ETA display
  const formatEta = (minutes: number) => {
    if (minutes < 1) return 'Arriving'
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="terminal-popup">
        <div className="terminal-popup-header">
          <div>
            <h3 className="terminal-popup-title">{terminal.name}</h3>
            <p className="terminal-popup-location">{terminal.location}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="terminal-buses-title">
          Buses Approaching ({approachingBuses.length})
        </div>
        
        {approachingBuses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: '#9ca3af' }}>
            <Bus size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No buses approaching this terminal</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Check back later for updates</p>
          </div>
        ) : (
          approachingBuses.map((bus) => (
            <div key={bus.id} className="terminal-bus-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: bus.color,
                  border: bus.color === '#ffffff' ? '2px solid #d1d5db' : 'none',
                  flexShrink: 0
                }} />
                <div className="terminal-bus-info">
                  <span className="terminal-bus-name">{bus.name}</span>
                  <span className="terminal-bus-route">{bus.company} • Route: {bus.route}</span>
                </div>
              </div>
              <span className="terminal-bus-time">{formatEta(bus.etaMinutes)}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}

function MapView() {
  const [activeTab, setActiveTab] = useState('home')
  const [showRoutePanel, setShowRoutePanel] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [arrivalPanelCollapsed, setArrivalPanelCollapsed] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [selectedTerminal, setSelectedTerminal] = useState<typeof terminals[0] | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([7.0707, 125.6087]) // Davao City (Ecoland)
  const [buses, setBuses] = useState<Bus[]>(initialBuses)

  // Fetch initial routes for all buses
  useEffect(() => {
    const fetchInitialRoutes = async () => {
      console.log('🚌 Fetching initial routes for', initialBuses.length, 'buses...')
      const updatedBuses = await Promise.all(
        initialBuses.map(async (bus) => {
          const terminal = terminals.find(t => t.name === bus.destination)
          if (!terminal) {
            console.warn('⚠️ No terminal found for bus', bus.id, 'destination:', bus.destination)
            return bus
          }

          console.log(`🔍 Fetching route for bus ${bus.id} (${bus.name}) from [${bus.position[0]}, ${bus.position[1]}] to ${terminal.name} [${terminal.position[0]}, ${terminal.position[1]}]`)
          const routePath = await fetchRoute(bus.position, terminal.position)

          if (routePath && routePath.length > 0) {
            console.log(`✅ Bus ${bus.id} route fetched successfully with ${routePath.length} waypoints`)
          } else {
            console.error(`❌ Bus ${bus.id} route fetch failed or returned empty route`)
          }

          return {
            ...bus,
            routePath: routePath || undefined,
            routeIndex: 0
          }
        })
      )

      const busesWithRoutes = updatedBuses.filter(b => b.routePath)
      const busesWithoutRoutes = updatedBuses.filter(b => !b.routePath)

      console.log('🎯 Route fetching complete:', {
        total_buses: updatedBuses.length,
        buses_with_routes: busesWithRoutes.length,
        buses_without_routes: busesWithoutRoutes.length
      })

      if (busesWithoutRoutes.length > 0) {
        console.warn('⚠️ Buses without routes:', busesWithoutRoutes.map(b => `${b.id}:${b.name}`))
      }

      setBuses(updatedBuses)
    }

    fetchInitialRoutes()
  }, [])

  // Get real-time user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to default location (Mindanao center)
          setUserLocation([7.2, 124.8])
          setLocationLoading(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )

      // Watch for location updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => console.error('Watch position error:', error),
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      setLocationLoading(false)
    }
  }, [])

  // Helper function to get road-aligned position near a terminal
  const getRoadPosition = (terminalName: string): [number, number] => {
    // Return positions on roads near terminals instead of exact terminal centers
    switch (terminalName) {
      case 'Ecoland Bus Terminal':
        return [7.0695, 125.6095] // Road position near Ecoland
      case 'Kidapawan City Terminal':
        return [7.0095, 125.0885] // Road position near Kidapawan terminal
      case 'Cotabato City Terminal':
        return [7.2225, 124.2455] // Road position near Cotabato terminal
      case 'Koronadal City Terminal':
        return [6.5015, 124.8475] // Road position near Koronadal terminal
      default:
        // For other terminals, offset slightly from center to be on nearby roads
        const terminal = terminals.find(t => t.name === terminalName)
        if (terminal) {
          return [terminal.position[0] + 0.001, terminal.position[1] + 0.001]
        }
        return [7.0695, 125.6095] // Default fallback
    }
  }

  // Helper function to determine next destination for a bus based on its company and current location
  const getNextDestination = (bus: Bus, currentTerminalName: string): { destination: string, route: string, etaMinutes: number } => {
    const ecoland = 'Ecoland Bus Terminal'
    const kidapawan = 'Kidapawan City Terminal'
    const cotabato = 'Cotabato City Terminal'
    const koronadal = 'Koronadal City Terminal'

    if (bus.company === 'Mindanao Star') {
      if (currentTerminalName === ecoland) {
        // From Davao, go to either Kidapawan or Cotabato
        const destinations = [
          { destination: kidapawan, route: 'Davao-Kidapawan', etaMinutes: 35 },
          { destination: cotabato, route: 'Davao-Cotabato', etaMinutes: 52 }
        ]
        return destinations[Math.floor(Math.random() * destinations.length)]
      } else {
        // Return to Davao from anywhere
        return {
          destination: ecoland,
          route: currentTerminalName === kidapawan ? 'Kidapawan-Davao' : 'Cotabato-Davao',
          etaMinutes: currentTerminalName === kidapawan ? 38 : 48
        }
      }
    } else if (bus.company === 'Davao Metro Shuttle') {
      // Davao Metro goes between Davao and Kidapawan
      if (currentTerminalName === ecoland) {
        return { destination: kidapawan, route: 'Davao-Kidapawan', etaMinutes: 40 }
      } else {
        return { destination: ecoland, route: 'Kidapawan-Davao', etaMinutes: 42 }
      }
    } else if (bus.company === 'Yellow Bus Liners') {
      // Yellow Bus goes between Kidapawan and Koronadal
      if (currentTerminalName === kidapawan) {
        return { destination: koronadal, route: 'Kidapawan-Koronadal', etaMinutes: 30 }
      } else {
        return { destination: kidapawan, route: 'Koronadal-Kidapawan', etaMinutes: 32 }
      }
    }

    // Fallback
    return { destination: ecoland, route: 'Return', etaMinutes: 30 }
  }

  // Bus movement and ETA countdown
  useEffect(() => {
    let animationFrameId: number
    let lastUpdateTime = Date.now()

    // ETA countdown every 10 seconds (10 seconds real time = 1 minute bus time)
    const etaInterval = setInterval(() => {
      setBuses(prevBuses => {
        const updatedBuses = prevBuses.map(bus => {
          const terminal = terminals.find(t => t.name === bus.destination)
          if (!terminal) return { ...bus, needsNewRoute: false }

          // Calculate new ETA (decrease by 1 minute every 10 seconds)
          let newEtaMinutes = bus.etaMinutes - 1

          // If bus arrived at terminal, mark it for new route
          if (newEtaMinutes <= 0) {
            const nextRoute = getNextDestination(bus, terminal.name)
            const roadPosition = getRoadPosition(terminal.name)
            return {
              ...bus,
              destination: nextRoute.destination,
              route: nextRoute.route,
              position: roadPosition, // Use road position instead of terminal center
              etaMinutes: nextRoute.etaMinutes,
              needsNewRoute: true,
              routePath: undefined,
              routeIndex: 0
            }
          }

          return {
            ...bus,
            etaMinutes: newEtaMinutes,
            needsNewRoute: false
          }
        })

        // Fetch new routes for buses that need them (async operation)
        updatedBuses.forEach(async (bus, index) => {
          if (bus.needsNewRoute) {
            const terminal = terminals.find(t => t.name === bus.destination)
            if (terminal) {
              const newRoutePath = await fetchRoute(bus.position, terminal.position)
              setBuses(currentBuses => {
                const newBuses = [...currentBuses]
                if (newBuses[index] && newBuses[index].id === bus.id) {
                  newBuses[index] = {
                    ...newBuses[index],
                    routePath: newRoutePath || undefined,
                    routeIndex: 0,
                    needsNewRoute: false
                  }
                }
                return newBuses
              })
            }
          }
        })

        return updatedBuses
      })
    }, 10000) // Update ETA every 10 seconds

    // Smooth position updates at 60fps
    const animate = () => {
      const now = Date.now()
      const deltaTime = now - lastUpdateTime

      // Update every ~16ms (60fps)
      if (deltaTime >= 16) {
        setBuses(prevBuses => prevBuses.map(bus => {
          const terminal = terminals.find(t => t.name === bus.destination)
          if (!terminal || bus.etaMinutes <= 0 || bus.needsNewRoute) return bus

          // If bus has a route path, follow it
          if (bus.routePath && bus.routePath.length > 0) {
            const currentIndex = bus.routeIndex || 0
            const totalWaypoints = bus.routePath.length

            if (currentIndex >= totalWaypoints - 1) {
              // Already at destination
              return bus
            }

            // Calculate progress based on remaining ETA
            // Since ETA decreases by 1 minute every 10 seconds, the bus should complete the route in (etaMinutes * 10) seconds
            const totalJourneyTimeSeconds = bus.etaMinutes * 10
            const progressPerSecond = 1 / totalJourneyTimeSeconds
            const progressIncrement = progressPerSecond * (deltaTime / 1000)

            // Calculate current progress (0 to 1)
            const currentProgress = currentIndex / (totalWaypoints - 1)
            const newProgress = Math.min(currentProgress + progressIncrement, 1)

            // Convert progress to waypoint index
            const newIndex = newProgress * (totalWaypoints - 1)

            // Interpolate between current and next waypoint for smooth movement
            const floorIndex = Math.floor(newIndex)
            const ceilIndex = Math.min(Math.ceil(newIndex), totalWaypoints - 1)
            const fraction = newIndex - floorIndex

            const currentWaypoint = bus.routePath[floorIndex]
            const nextWaypoint = bus.routePath[ceilIndex]

            const newPosition: [number, number] = [
              currentWaypoint[0] + (nextWaypoint[0] - currentWaypoint[0]) * fraction,
              currentWaypoint[1] + (nextWaypoint[1] - currentWaypoint[1]) * fraction
            ]

            // Debug log every 100 frames (about once per second at 60fps)
            if (Math.random() < 0.01) {
              console.log(`🚌 Bus ${bus.id} movement:`, {
                current_waypoint: floorIndex,
                total_waypoints: totalWaypoints,
                progress: Math.round(newProgress * 100) + '%',
                position: `[${newPosition[0].toFixed(4)}, ${newPosition[1].toFixed(4)}]`,
                eta_remaining: bus.etaMinutes + 'min'
              })
            }

            return {
              ...bus,
              position: newPosition,
              routeIndex: newIndex
            }
          } else {
            // Fallback to straight line movement if no route path
            console.warn(`⚠️ Bus ${bus.id} (${bus.name}) falling back to straight-line movement - no route path available`)

            const [currentLat, currentLng] = bus.position
            const [terminalLat, terminalLng] = terminal.position

            // Move directly towards destination based on remaining ETA (10 seconds per minute)
            const remainingSeconds = bus.etaMinutes * 10
            const latDiff = terminalLat - currentLat
            const lngDiff = terminalLng - currentLng

            const stepLat = (latDiff / remainingSeconds) * (deltaTime / 1000)
            const stepLng = (lngDiff / remainingSeconds) * (deltaTime / 1000)

            const newPosition: [number, number] = [
              currentLat + stepLat,
              currentLng + stepLng
            ]

            return {
              ...bus,
              position: newPosition
            }
          }
        }))

        lastUpdateTime = now
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      clearInterval(etaInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleTerminalClick = (terminal: typeof terminals[0]) => {
    setSelectedTerminal(terminal)
  }

  // Format ETA display
  const formatEta = (minutes: number) => {
    if (minutes < 1) return 'Arriving'
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }

  return (
    <div className="map-container">
      {/* Location Loading Indicator */}
      {locationLoading && (
        <div className="location-loading">
          <div className="location-loading-dot" />
          Getting your location...
        </div>
      )}

      {/* Route Info Panel */}
      {showRoutePanel && (
        <div className="route-panel">
          <div className="route-header">
            <div className="route-info">
              <h3 className="route-title">OTG Bus Tracker</h3>
              <p className="route-subtitle">Real-time tracking across Mindanao</p>
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                <span className="route-detail">{terminals.length} terminals</span>
                <span className="route-detail">{buses.length} buses</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', border: '1px solid #d1d5db' }} />
                  <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>Mindanao Star</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>Davao Metro</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                  <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>Yellow Bus</span>
                </div>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={() => setShowRoutePanel(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer 
        center={mapCenter} 
        zoom={9} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapCenterUpdater center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Terminal markers */}
        {terminals.map((terminal) => (
          <Marker 
            key={terminal.id} 
            position={terminal.position} 
            icon={createTerminalIcon(selectedTerminal?.id === terminal.id)}
            eventHandlers={{
              click: () => handleTerminalClick(terminal)
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>{terminal.name}</strong>
                <p>{terminal.location}</p>
                <p style={{ color: '#f92f2f', fontWeight: 600, marginTop: '4px' }}>
                  Click to see approaching buses
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={bus.position}
            icon={createBusIcon(bus.label, bus.color)}
          >
            <Popup>
              <div className="popup-content">
                <strong>{bus.name}</strong>
                <p>Company: {bus.company}</p>
                <p>Route: {bus.route}</p>
                <p>Destination: {bus.destination}</p>
                <p style={{ color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                  ETA: {formatEta(bus.etaMinutes)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route paths */}
        {buses.map((bus) =>
          bus.routePath && bus.routePath.length > 0 ? (
            <Polyline
              key={`route-${bus.id}`}
              positions={bus.routePath}
              pathOptions={{
                color: bus.color === '#ffffff' ? '#ff6b6b' : bus.color,
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10'
              }}
            />
          ) : null
        )}

        {/* User position marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="popup-content">
                <strong>You are here</strong>
                <p>Your current location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Show route panel button (when hidden) */}
      {!showRoutePanel && (
        <button 
          className="show-route-btn"
          onClick={() => setShowRoutePanel(true)}
        >
          <Navigation size={18} />
          Show Info
        </button>
      )}

      {/* Arrival Panel */}
      <div className="arrival-panel">
        <div
          className="arrival-title"
          onClick={() => setArrivalPanelCollapsed(!arrivalPanelCollapsed)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none'
          }}
        >
          <h4 style={{ margin: 0 }}>Nearby Buses</h4>
          <ChevronDown
            size={20}
            style={{
              transition: 'transform 0.3s ease',
              transform: arrivalPanelCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'
            }}
          />
        </div>
        {!arrivalPanelCollapsed && (
          <div className="arrival-list">
            {buses.slice(0, 3).map((bus) => (
              <div key={bus.id} className="arrival-item">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: bus.color,
                  border: bus.color === '#ffffff' ? '1px solid #d1d5db' : 'none',
                  flexShrink: 0
                }} />
                <span className="arrival-bus">{bus.name}</span>
                <span className="arrival-route">({bus.route})</span>
                <span className="arrival-time">{formatEta(bus.etaMinutes)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('menu')
            setMenuOpen(true)
          }}
        >
          <Menu size={24} />
          <span className="nav-label">Menu</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('home')
            setMapCenter(userLocation || [7.2, 124.8])
          }}
        >
          <Home size={24} />
          <span className="nav-label">Home</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('notifications')
            setNotificationsOpen(true)
          }}
        >
          <Bell size={24} />
          <span className="nav-label">Notifications</span>
          {notifications.some(n => n.unread) && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '20px',
              width: '8px',
              height: '8px',
              background: '#f92f2f',
              borderRadius: '50%'
            }} />
          )}
        </button>
      </div>

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenFaq={() => {
          setMenuOpen(false)
          setFaqOpen(true)
        }}
        onOpenAbout={() => {
          setMenuOpen(false)
          setAboutOpen(true)
        }}
      />

      {/* FAQ Modal */}
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />

      {/* About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={handleClearNotifications}
      />

      {/* Terminal Popup */}
      <TerminalPopup
        terminal={selectedTerminal}
        onClose={() => setSelectedTerminal(null)}
        buses={buses}
      />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="mobile-container">
      {isLoading ? (
        <LoadingPage onComplete={() => setIsLoading(false)} />
      ) : (
        <MapView />
      )}
    </div>
  )
}

export default App
