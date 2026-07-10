import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type LoginValues = z.infer<typeof schema>

const defaultAdminCredentials: LoginValues = {
  email: '',
  password: '',
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultAdminCredentials,
  })

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginValues) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setSession(data.token, data.user)
      navigate('/dashboard')
    },
  })

  return (
    <form
      className="mx-auto max-w-[490px] space-y-6"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <Input
        className="h-14 rounded-xl border-0"
        error={errors.email?.message}
        label="Email"
        labelClassName="text-white"
        placeholder="user@gamil.com"
        {...register('email')}
      />
      <Input
        className="h-14 rounded-xl border-0"
        error={errors.password?.message}
        label="Password"
        labelClassName="text-white"
        endAdornment={showPassword ? 'Hide' : 'Show'}
        endAdornmentProps={{
          'aria-label': showPassword ? 'Hide password' : 'Show password',
          onClick: () => setShowPassword((current) => !current),
          tabIndex: 0,
        }}
        placeholder="****"
        type={showPassword ? 'text' : 'password'}
        {...register('password')}
      />
      <div className="flex items-center justify-between text-sm text-white/70">
        <label className="flex items-center gap-2">
          <input className="accent-brand-orange" type="checkbox" />
          Remember password
        </label>
        <Link className="text-brand-orange" to="/auth/forgot-password">
          Forgot password?
        </Link>
      </div>
      {mutation.error ? (
        <div className="text-sm text-[#ffc7c2]">{mutation.error.message}</div>
      ) : null}
      <Button className="h-14 rounded-xl" fullWidth size="lg" type="submit">
        Sign In
      </Button>
    </form>
  )
}
