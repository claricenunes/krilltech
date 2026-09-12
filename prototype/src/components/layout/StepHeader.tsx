function StepHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest-700 text-xs font-bold text-white">
        {step}
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">{title}</p>
    </div>
  )
}

export default StepHeader
