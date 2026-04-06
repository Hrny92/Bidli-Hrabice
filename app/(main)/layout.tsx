import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieBar from '@/components/CookieBar'
import FancyboxInit from '@/components/FancyboxInit'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <CookieBar />
      <FancyboxInit />
    </>
  )
}
