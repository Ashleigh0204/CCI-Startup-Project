import Header from './pages/components/Header'
import Footer from './pages/components/Footer'
import Index from './pages/index/Index'
import './index.css'

export default function App() {

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main>
        <Index />
      </main>
      <Footer />
    </div>
  )
}