import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Category, Drill } from '@/types/entities'

const schema = z.object({
  name: z.string().min(2, 'Drill name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description is required'),
  cover: z.string().min(1, 'Cover image is required'),
  youtubeUrl: z
    .string()
    .trim()
    .refine((value) => !value || Boolean(extractYouTubeVideoId(value)), {
      message: 'Please enter a valid YouTube URL.',
    })
    .optional(),
  listIcon: z.string().min(1, 'List icon is required'),
  accessLevel: z.enum(['Free', 'Premium']),
  equipment: z.array(
    z.object({
      name: z.string().trim(),
      link: z
        .string()
        .trim()
        .refine((val) => !val || /^https?:\/\/.+/.test(val), {
          message: 'Must be a valid URL starting with http:// or https://',
        })
        .optional()
        .nullable(),
    })
  ),
  steps: z.array(z.object({ value: z.string() })),
  focusPoints: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
}).superRefine((values, ctx) => {
  values.equipment.forEach((item, index) => {
    if (item.link?.trim() && !item.name.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Name is required when link is provided',
        path: ['equipment', index, 'name'],
      })
    }
  })
})

type DrillFormValues = z.infer<typeof schema>

export type DrillSubmitValues = Pick<
  Drill,
  | 'name'
  | 'categoryId'
  | 'description'
  | 'cover'
  | 'youtubeUrl'
  | 'listIcon'
  | 'accessLevel'
  | 'equipment'
  | 'steps'
  | 'focusPoints'
>

type DrillFormModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: DrillSubmitValues) => Promise<unknown>
  categories: Category[]
  initialData?: Drill | null
}

const emptyTextRow = { value: '' }
const emptyFocusPoint = { title: '', description: '' }
const drillIconOptions = [
  { label: 'Baseball', value: 'baseball-outline' },
  { label: 'Target Circle', value: 'ellipse-outline' },
  { label: 'Connection Link', value: 'link' },
  { label: 'Trophy', value: 'trophy-outline' },
  { label: 'Flame', value: 'flame-outline' },
  { label: 'Shield', value: 'shield-outline' },
  { label: 'Lock', value: 'lock-closed-outline' },
]

const youtubeIdPattern = /^[A-Za-z0-9_-]{6,}$/

const extractYouTubeVideoId = (value?: string | null) => {
  const trimmed = value?.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    const hostname = url.hostname.replace(/^www\./, '').toLowerCase()

    if (hostname === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0]
      return videoId && youtubeIdPattern.test(videoId) ? videoId : null
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const pathParts = url.pathname.split('/').filter(Boolean)
      const videoId =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : pathParts[0] === 'shorts' || pathParts[0] === 'embed'
            ? pathParts[1]
            : null

      return videoId && youtubeIdPattern.test(videoId) ? videoId : null
    }
  } catch {
    return null
  }

  return null
}

const toYouTubeEmbedUrl = (value?: string | null) => {
  const videoId = extractYouTubeVideoId(value)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

const emptyEquipmentRow = { name: '', link: '' }

const toRows = (items?: string[]) =>
  items?.length ? items.map((value) => ({ value })) : [emptyTextRow]

const toEquipmentRows = (items?: Drill['equipment']) =>
  items?.length
    ? items.map((item) => {
        if (typeof item === 'string') {
          return { name: item.trim(), link: '' }
        }
        return {
          name: item.name?.trim() ?? '',
          link: item.link?.trim() ?? '',
        }
      })
    : [emptyEquipmentRow]

const toFocusRows = (items?: Drill['focusPoints']) =>
  items?.length
    ? items.map((item) => ({
        title: item.title?.trim() ?? '',
        description: item.description?.trim() ?? '',
      }))
    : [emptyFocusPoint]

const cleanTextRows = (items: { value: string }[]) =>
  items.map((item) => item.value.trim()).filter(Boolean)

const cleanEquipmentRows = (items: { name: string; link?: string | null }[]) =>
  items
    .map((item) => ({
      name: item.name.trim(),
      link: item.link?.trim() || null,
    }))
    .filter((item) => item.name)

const cleanFocusRows = (items: { title: string; description: string }[]) =>
  items
    .map((item) => {
      const title = item.title.trim()
      const description = item.description.trim()
      return { title, description }
    })
    .filter((item) => item.title || item.description)

export const DrillFormModal = ({
  open,
  onClose,
  onSubmit,
  categories,
  initialData,
}: DrillFormModalProps) => {
  const defaultCategoryId = categories[0]?.id ?? ''
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<DrillFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      cover: '',
      youtubeUrl: '',
      listIcon: 'baseball-outline',
      accessLevel: 'Free',
      equipment: [emptyEquipmentRow],
      steps: [emptyTextRow],
      focusPoints: [emptyFocusPoint],
    },
  })
  const equipmentFields = useFieldArray({
    control,
    name: 'equipment',
  })
  const stepFields = useFieldArray({
    control,
    name: 'steps',
  })
  const focusFields = useFieldArray({
    control,
    name: 'focusPoints',
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? '',
        categoryId: initialData?.categoryId ?? defaultCategoryId,
        description: initialData?.description ?? '',
        cover: initialData?.cover ?? '',
        youtubeUrl: initialData?.youtubeUrl ?? '',
        listIcon: initialData?.listIcon ?? 'baseball-outline',
        accessLevel: initialData?.accessLevel ?? 'Free',
        equipment: toEquipmentRows(initialData?.equipment),
        steps: toRows(initialData?.steps),
        focusPoints: toFocusRows(initialData?.focusPoints),
      })
    }
  }, [defaultCategoryId, initialData, open, reset])

  const submit = (values: DrillFormValues) =>
    onSubmit({
      name: values.name.trim(),
      categoryId: values.categoryId,
      description: values.description.trim(),
      cover: values.cover,
      youtubeUrl: values.youtubeUrl?.trim() || null,
      listIcon: values.listIcon,
      accessLevel: values.accessLevel,
      equipment: cleanEquipmentRows(values.equipment),
      steps: cleanTextRows(values.steps),
      focusPoints: cleanFocusRows(values.focusPoints),
    })

  const youtubePreviewUrl = toYouTubeEmbedUrl(watch('youtubeUrl'))

  return (
    <Modal
      className="max-w-[720px]"
      description="Add the exact content the mobile drill library needs for listing and detail screens."
      footer={
        <div className="flex gap-4">
          <Button
            className="h-12 flex-1 rounded-2xl"
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className="h-12 flex-1 rounded-2xl"
            disabled={isSubmitting}
            onClick={handleSubmit(submit)}
            type="button"
          >
            {initialData ? 'Update Drill' : 'Save Drill'}
          </Button>
        </div>
      }
      onClose={onClose}
      open={open}
      title={initialData ? 'Edit Drill' : 'Create Drill'}
    >
      <div className="space-y-6">
        <Input
          className="h-11 rounded-xl border-0 bg-[#efeced] text-[15px] placeholder:text-[#a6b4c8]"
          error={errors.name?.message}
          label="Drill Name"
          placeholder="Enter drill name"
          {...register('name')}
        />
        <Select
          className="h-11 rounded-xl border-0 bg-[#efeced] text-[15px]"
          error={errors.categoryId?.message}
          label="Category"
          {...register('categoryId')}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Textarea
          className="min-h-[108px] rounded-xl border-0 bg-[#efeced] text-[15px] placeholder:text-[#b1b6c2]"
          error={errors.description?.message}
          label="Setup Process"
          placeholder="Explain the drill setup and what the player should prepare before starting..."
          {...register('description')}
        />
        <Controller
          control={control}
          name="cover"
          render={({ field }) => (
            <FileUpload
              className="h-[98px] rounded-[16px] border-0 bg-[#efeced]"
              helperText={errors.cover?.message ?? 'Recommended size: 800x600'}
              helperClassName="text-center text-[11px] text-[#9ba9c2]"
              folder="drills/covers"
              label="Cover Photo"
              onChange={field.onChange}
              triggerText="Click to upload or drag and drop"
              value={field.value}
            />
          )}
        />
        <div className="space-y-3">
          <Input
            className="h-11 rounded-xl border-0 bg-[#efeced] text-[15px] placeholder:text-[#a6b4c8]"
            error={errors.youtubeUrl?.message}
            label="YouTube Video Link"
            placeholder="Paste YouTube video link here"
            {...register('youtubeUrl')}
          />
          {youtubePreviewUrl ? (
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-black">
              <iframe
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full"
                src={youtubePreviewUrl}
                title="YouTube video preview"
              />
            </div>
          ) : null}
        </div>
        <Select
          className="h-11 rounded-xl border-0 bg-[#efeced] text-[15px]"
          error={errors.listIcon?.message}
          label="Included Drill Icon"
          {...register('listIcon')}
        >
          {drillIconOptions.map((icon) => (
            <option key={icon.value} value={icon.value}>
              {icon.label}
            </option>
          ))}
        </Select>
        <Controller
          control={control}
          name="accessLevel"
          render={({ field }) => (
            <div className="space-y-2">
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#505666]">
                Access Level
              </span>
              <SegmentedControl
                className="rounded-xl bg-[#ece9e7] p-1"
                onChange={field.onChange}
                options={[
                  { label: 'Free', value: 'Free' },
                  { label: 'Premium', value: 'Premium' },
                ]}
                optionClassName="min-w-[88px] px-0 py-2"
                value={field.value}
              />
            </div>
          )}
        />
        <div className="space-y-3 rounded-2xl border border-brand-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#505666]">
                Equipment Needed
              </span>
              <p className="mt-1 text-xs text-[#7a8498]">
                Shown as bullet points on the drill detail screen.
              </p>
            </div>
            <Button
              className="h-9 rounded-xl px-3"
              onClick={() => equipmentFields.append({ name: '', link: '' })}
              type="button"
              variant="secondary"
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {errors.equipment?.message ? (
              <p className="text-xs font-medium text-red-500">
                {errors.equipment.message}
              </p>
            ) : null}
            {equipmentFields.fields.map((field, index) => (
              <div
                className="grid gap-2 rounded-2xl bg-[#f7f4ef] p-3 md:grid-cols-[0.8fr_1.2fr_auto]"
                key={field.id}
              >
                <div className="space-y-1">
                  <Input
                    className="h-11 rounded-xl border-0 bg-white text-[15px]"
                    placeholder="Baseball bat"
                    {...register(`equipment.${index}.name`)}
                  />
                  {errors.equipment?.[index]?.name?.message ? (
                    <p className="text-[11px] font-medium text-red-500 pl-1">
                      {errors.equipment[index].name.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <Input
                    className="h-11 rounded-xl border-0 bg-white text-[15px]"
                    placeholder="Affiliate Link / URL (Optional)"
                    {...register(`equipment.${index}.link`)}
                  />
                  {errors.equipment?.[index]?.link?.message ? (
                    <p className="text-[11px] font-medium text-red-500 pl-1">
                      {errors.equipment[index].link.message}
                    </p>
                  ) : null}
                </div>
                <button
                  className="rounded-xl p-3 text-red-500 transition hover:bg-red-50"
                  onClick={() => equipmentFields.remove(index)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-brand-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#505666]">
                Step-by-Step Directions
              </span>
              <p className="mt-1 text-xs text-[#7a8498]">
                Each row becomes a numbered instruction in the app.
              </p>
            </div>
            <Button
              className="h-9 rounded-xl px-3"
              onClick={() => stepFields.append({ value: '' })}
              type="button"
              variant="secondary"
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {errors.steps?.message ? (
              <p className="text-xs font-medium text-red-500">
                {errors.steps.message}
              </p>
            ) : null}
            {stepFields.fields.map((field, index) => (
              <div className="flex items-start gap-2" key={field.id}>
                <Input
                  className="h-11 rounded-xl border-0 bg-[#efeced] text-[15px]"
                  placeholder={`${index + 1}. Get into regular batting stance.`}
                  {...register(`steps.${index}.value`)}
                />
                <button
                  className="mt-1 rounded-xl p-3 text-red-500 transition hover:bg-red-50"
                  onClick={() => stepFields.remove(index)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-brand-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#505666]">
                Key Focus Points
              </span>
              <p className="mt-1 text-xs text-[#7a8498]">
                Title and detail are displayed as focus cards in the app.
              </p>
            </div>
            <Button
              className="h-9 rounded-xl px-3"
              onClick={() => focusFields.append({ title: '', description: '' })}
              type="button"
              variant="secondary"
            >
              <Plus className="mr-2 size-4" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {errors.focusPoints?.message ? (
              <p className="text-xs font-medium text-red-500">
                {errors.focusPoints.message}
              </p>
            ) : null}
            {focusFields.fields.map((field, index) => (
              <div
                className="grid gap-2 rounded-2xl bg-[#f7f4ef] p-3 md:grid-cols-[0.8fr_1.2fr_auto]"
                key={field.id}
              >
                <Input
                  className="h-11 rounded-xl border-0 bg-white text-[15px]"
                  placeholder="Direction of Step"
                  {...register(`focusPoints.${index}.title`)}
                />
                <Input
                  className="h-11 rounded-xl border-0 bg-white text-[15px]"
                  placeholder="Focus on stepping straight toward the pitcher."
                  {...register(`focusPoints.${index}.description`)}
                />
                <button
                  className="rounded-xl p-3 text-red-500 transition hover:bg-red-50"
                  onClick={() => focusFields.remove(index)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
