import logo from '/logo.jpeg'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center">

        {/* Logo — larger and more visible */}
        <img
          src={logo}
          alt="TrashGo"
          className="h-10 sm:h-14 w-auto object-contain"
        />

      </div>
    </nav>
  )
}
