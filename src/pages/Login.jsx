import { useEffect, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

// Six depot photographs from the TPPL asset library, cross-fading on a
// timer. Purely decorative — the credentials themselves are never shown on
// this page (see forgotten-password note below and demoAuth.js).
const BASE = import.meta.env.BASE_URL
const BACKGROUND_IMAGES = [
  `${BASE}login-bg-1.jpg`,
  `${BASE}login-bg-2.jpg`,
  `${BASE}login-bg-3.jpg`,
  `${BASE}login-bg-4.jpg`,
  `${BASE}login-bg-5.jpg`,
  `${BASE}login-bg-6.jpg`,
]
const SLIDE_INTERVAL_MS = 5000

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showForgotNotice, setShowForgotNotice] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((i) => (i + 1) % BACKGROUND_IMAGES.length), SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  function submit(event) {
    event.preventDefault()
    if (!login(email, password)) setError('Those credentials were not recognised. Check your email and password and try again.')
  }

  return <main className="h-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 relative bg-slate-950">
    {BACKGROUND_IMAGES.map((src, index) => (
      <div
        key={src}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${src})`, opacity: index === bgIndex ? 1 : 0 }}
        aria-hidden="true"
      />
    ))}
    <div className="absolute inset-0 bg-slate-950/55" />
    <div className="relative w-full max-w-4xl max-h-full grid lg:grid-cols-[1.1fr_.9fr] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      <section className="hidden lg:flex bg-[#B42318] text-white p-8 flex-col justify-between">
        <div className="flex items-center gap-3">
          <img src={`${BASE}tppl-logo.jpg`} alt="Tazama Petroleum Products Limited" className="w-10 h-10 rounded bg-white/10 border border-white/20 object-cover" />
          <div><div className="brand-mark text-base font-bold tracking-tight">Tazama Petroleum</div><div className="text-[10px] uppercase tracking-[.16em] text-white/70">Products Limited · TPPL</div></div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/70 mb-2">Management reporting</p>
          <h1 className="text-2xl xl:text-3xl font-bold leading-tight">A clear view of performance, operations, and delivery.</h1>
          <p className="text-xs leading-5 text-white/80 mt-3 max-w-md">The TPPL executive dashboard brings strategic KPIs and operational follow-through into one decision surface for management.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/75"><ShieldCheck size={16} /> Authorised personnel only · Confidential</div>
      </section>
      <section className="p-5 sm:p-7 overflow-y-auto">
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <img src={`${BASE}tppl-logo.jpg`} alt="Tazama Petroleum Products Limited" className="w-9 h-9 rounded border border-slate-200 object-cover" />
          <div><div className="brand-mark text-base font-bold tracking-tight text-[#B42318]">Tazama Petroleum</div><div className="text-[10px] uppercase tracking-[.14em] text-slate-500">Products Limited · TPPL</div></div>
        </div>
        <div className="max-w-md mx-auto">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#B42318]">Secure sign-in</p>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">Sign in to the TPPL dashboard</h2>
            <p className="text-sm text-slate-500 mt-1.5">Enter your assigned credentials to continue.</p>
          </div>
          <form onSubmit={submit} className="space-y-3.5">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="username" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900" placeholder="name@tppl.co.zm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Password</span>
              <div className="relative mt-1.5">
                <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-900" placeholder="Password" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              <div className="mt-1.5 text-right">
                <button type="button" onClick={() => setShowForgotNotice((v) => !v)} className="text-xs font-semibold text-[#B42318] hover:underline">Forgot password?</button>
              </div>
              {showForgotNotice && (
                <p className="mt-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
                  Self-service password reset is not yet available. Contact your system administrator to have your password reset.
                </p>
              )}
            </label>
            {error && <p role="alert" className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-[#B42318] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#8F1D14] transition-colors"><LockKeyhole size={16} className="inline mr-2" />Sign in</button>
          </form>
        </div>
      </section>
    </div>
  </main>
}
