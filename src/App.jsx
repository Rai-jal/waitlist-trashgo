import { useState, useEffect } from 'react'
import Navbar  from './components/Navbar'
import Hero    from './components/Hero'
import Modal   from './components/Modal'
import Footer  from './components/Footer'
import { fetchCount } from './lib/airtable'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [count,     setCount]     = useState(null)

  useEffect(() => {
    fetchCount().then(n => setCount(n))
  }, [])

  function handleSuccess() {
    // Optimistic +1 immediately, then confirm with real count
    setCount(c => (c ?? 0) + 1)
    setTimeout(() => fetchCount().then(n => { if (n !== null) setCount(n) }), 2000)
  }

  return (
    <div className="font-sans">
      <Navbar />
      <Hero   onJoin={() => setModalOpen(true)} count={count} />
      <Footer />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
