'use client'

import { cn } from '@/lib/utils'
import { setAccessToken } from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/api/useAuth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Chrome, Eye, EyeOff } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoginValidation, type LoginFormValues } from '@/features/auth/login/components/validation/LoginValidation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { mutateAsync: loginUser, isPending, error } = useLogin()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const data = await loginUser(values)
      setAccessToken(data.access_token)
      if (returnUrl) {
        window.location.href = decodeURIComponent(returnUrl as string)
      } else {
        router.push('/admin')
        toast.success('Login berhasil!')
      }
    } catch (err) {
      console.error(err)
      toast.error('Login gagal, silakan coba lagi.' + (err instanceof Error ? ` (${err.message})` : ''))
    }
  }

  // Handler untuk maju ke step password
  const handleGoToPassword = async () => {
    const valid = await form.trigger('email')
    if (!valid) return
    setStep(2)
  }

  const resetToEmail = () => {
    setStep(1)
    setShowPassword(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          step === 2
            ? form.handleSubmit(async (vals) => {
                // Optional simple brute force mitigation: add a small delay after multiple attempts
                if (attempts >= 3) {
                  await new Promise((res) => setTimeout(res, 600))
                }
                setAttempts((a) => a + 1)
                await onSubmit(vals)
              })
            : (e) => {
                e.preventDefault()
                handleGoToPassword()
              }
        }
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login ke Akun</h1>
          {step === 1 ? (
            <p className="text-muted-foreground text-sm text-balance">Masukkan email untuk melanjutkan</p>
          ) : (
            <p className="text-muted-foreground text-sm text-balance">
              Masukkan password untuk email <strong>{form.watch('email')}</strong>
            </p>
          )}
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} disabled={step === 2} />
                </FormControl>
                <FormMessage />
                {step === 2 && (
                  <button type="button" onClick={resetToEmail} className="text-xs text-muted-foreground underline hover:text-foreground w-fit">
                    Ganti email
                  </button>
                )}
              </FormItem>
            )}
          />
          {step === 2 && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                          Lupa password?
                        </a>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Lupa Password</DialogTitle>
                          <DialogDescription>
                            Jika Anda lupa password, silakan menghubungi manajemen <strong>BMU</strong> untuk reset akun.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <p>Brawijaya Multi Usaha</p>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} {...field} />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {error && <p className="text-sm font-medium text-destructive">{error.message}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {step === 1 ? 'Lanjut' : isPending ? 'Memproses...' : 'Login'}
          </Button>
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or Login With</span>
        </div>
      </div>

      <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`} className="w-full mt-2">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Chrome className="h-4 w-4" />
          Login dengan Google
        </Button>
      </a>
    </Form>
  )
}
