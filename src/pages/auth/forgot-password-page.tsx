import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const setOtpEmail = useAuthStore((state) => state.setOtpEmail)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: ({ email }: { email: string }) =>
      authService.forgotPassword(email),
    onSuccess: ({ email }) => {
      setOtpEmail(email)
      navigate('/auth/otp-verification')
    },
  })

  return (
    <form
      className="mx-auto max-w-[490px] space-y-6 text-white"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <div className="space-y-3">
        <h1 className="text-[30px] font-bold text-white">Forget password</h1>
        <p className="text-sm leading-7 text-white/70">
          Enter your email address to ger a verification code for resetting your
          password.
        </p>
      </div>
      <Input
        className="h-14 rounded-xl border-0"
        error={errors.email?.message}
        placeholder="user@gamil.com"
        {...register('email')}
      />
      <Button className="h-14 rounded-xl" fullWidth size="lg" type="submit">
        Send Code
      </Button>
    </form>
  )
}
