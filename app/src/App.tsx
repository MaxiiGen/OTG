import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { 
  Home, Menu, Bell, X, Navigation, 
  HelpCircle, Shield, Settings, User, 
  ChevronRight, Bus, MapPin, Clock, Info
} from 'lucide-react'
import L from 'leaflet'
import './App.css'

// Custom icon creators
const createBusIcon = (label: string) => {
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `<div style="
      background: #f92f2f;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
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

// Terminal data with real locations
const terminals = [
  { 
    id: 1, 
    name: 'Kabacan Terminal', 
    location: 'Kabacan, North Cotabato',
    position: [7.1065, 124.8293] as [number, number]
  },
  { 
    id: 2, 
    name: 'Davao City Terminal', 
    location: 'Davao City, Davao del Sur',
    position: [7.0707, 125.6087] as [number, number]
  },
  { 
    id: 3, 
    name: 'General Santos Terminal', 
    location: 'General Santos City, South Cotabato',
    position: [6.1164, 125.1716] as [number, number]
  },
  { 
    id: 4, 
    name: 'Cagayan de Oro Terminal', 
    location: 'Cagayan de Oro City, Misamis Oriental',
    position: [8.4542, 124.6319] as [number, number]
  },
  { 
    id: 5, 
    name: 'Cotabato City Terminal', 
    location: 'Cotabato City, Maguindanao',
    position: [7.2236, 124.2464] as [number, number]
  },
]

// Bus data - each bus has a route and destination
const allBuses = [
  { id: 1, label: '1', name: 'bus 1', route: 'Davao-Cot', destination: 'Kabacan Terminal', position: [7.1000, 124.9000] as [number, number], eta: '15 mins' },
  { id: 2, label: '2', name: 'bus 2', route: 'Gensan-CDO', destination: 'Cagayan de Oro Terminal', position: [6.5000, 125.0000] as [number, number], eta: '25 mins' },
  { id: 3, label: '3', name: 'bus 3', route: 'Davao-Cot', destination: 'Kabacan Terminal', position: [7.0800, 124.8500] as [number, number], eta: '8 mins' },
  { id: 4, label: '4', name: 'bus 4', route: 'Cotabato-Davao', destination: 'Davao City Terminal', position: [7.1500, 124.5000] as [number, number], eta: '12 mins' },
  { id: 5, label: '5', name: 'bus 5', route: 'CDO-Davao', destination: 'Davao City Terminal', position: [7.5000, 125.2000] as [number, number], eta: '35 mins' },
  { id: 6, label: '6', name: 'bus 6', route: 'Gensan-Cotabato', destination: 'Cotabato City Terminal', position: [6.6000, 124.8000] as [number, number], eta: '20 mins' },
]

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

// Menu Drawer Component
function MenuDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  type MenuItem = { icon: React.ElementType; label: string; action: () => void } | { divider: true }
  
  const menuItems: MenuItem[] = [
    { icon: MapPin, label: 'Saved Routes', action: () => {} },
    { icon: Clock, label: 'Trip History', action: () => {} },
    { divider: true },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'FAQ & Help', action: () => {} },
    { icon: Info, label: 'About OTG', action: () => {} },
    { divider: true },
    { icon: Shield, label: 'Privacy Policy', action: () => {} },
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
  onClose 
}: { 
  terminal: typeof terminals[0] | null; 
  onClose: () => void;
}) {
  if (!terminal) return null

  // Get buses approaching this terminal
  const approachingBuses = allBuses.filter(bus => bus.destination === terminal.name)

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
              <div className="terminal-bus-info">
                <span className="terminal-bus-name">{bus.name}</span>
                <span className="terminal-bus-route">Route: {bus.route}</span>
              </div>
              <span className="terminal-bus-time">{bus.eta}</span>
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
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [selectedTerminal, setSelectedTerminal] = useState<typeof terminals[0] | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([7.2, 124.8])

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

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleTerminalClick = (terminal: typeof terminals[0]) => {
    setSelectedTerminal(terminal)
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
              <p className="route-subtitle">Real-time bus tracking</p>
              <p className="route-detail">{terminals.length} terminals available</p>
              <p className="route-detail">{allBuses.length} buses active</p>
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
        {allBuses.map((bus) => (
          <Marker 
            key={bus.id} 
            position={bus.position} 
            icon={createBusIcon(bus.label)}
          >
            <Popup>
              <div className="popup-content">
                <strong>{bus.name}</strong>
                <p>Route: {bus.route}</p>
                <p>Destination: {bus.destination}</p>
                <p style={{ color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                  ETA: {bus.eta}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

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
        <h4 className="arrival-title">Nearby Buses</h4>
        <div className="arrival-list">
          {allBuses.slice(0, 3).map((bus) => (
            <div key={bus.id} className="arrival-item">
              <span className="arrival-bus">{bus.name}</span>
              <span className="arrival-route">({bus.route}):</span>
              <span className="arrival-time">{bus.eta}</span>
            </div>
          ))}
        </div>
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
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

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
