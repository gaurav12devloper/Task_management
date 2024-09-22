"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { Menu, X, Clock} from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from "@/lib/redux/user/userSlice"
import { useToast } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"
import { Spotlight } from "@/components/Spotlight"
import { useTheme } from "next-themes"
import { RootState } from '@/lib/redux/store';

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { theme } = useTheme()
  const showSpotlight = ['/', '/sign-in', '/sign-up'].includes(pathname)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json();
      if (data.success) {
        dispatch(signOutUserSuccess())
        toast({
          title: "Success",
          description: "You have been successfully Signed out.",
        });
        router.push('/')
      } else {
        dispatch(signOutUserFailure(data.message))
        toast({
          title: "Error",
          description: data.message || "Failed to log out.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error)
      dispatch(signOutUserFailure(error.message))
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      {showSpotlight && (
        <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={theme === "dark" ? "#be185d" : "#14532d"}
      /> 
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 shadow-md' : 'bg-background/40'
          } backdrop-blur-md rounded-lg my-4 mx-4 md:mx-20 p-2 bg-secondary/15 shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Clock className="h-6 w-6 text-warning" />
              <span className="text-lg font-bold">Task Manager</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              {currentUser ? (
                <Button variant="outline" className="rounded-full hover:bg-background/10" onClick={handleLogout}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="rounded-full hover:bg-background/10" onClick={() => router.push('/sign-in')}>
                    Sign In
                  </Button>
                  <Button className="rounded-full" onClick={() => router.push('/sign-up')}>Sign Up</Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button variant="outline" size="icon" onClick={toggleMenu}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}
