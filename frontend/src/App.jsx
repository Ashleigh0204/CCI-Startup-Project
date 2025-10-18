import Header from './pages/components/Header'
import Footer from './pages/components/Footer'
import Index from './pages/index'

export default function App() {

  return (
    <>
      <Header />
      <main className='flex-grow'>
        <Index />
      </main>
      <Footer />
    </>
  )
}