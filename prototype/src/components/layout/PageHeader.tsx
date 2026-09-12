function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
        {title}
      </h1>
      <p className="mt-2 text-base text-stone-500">{subtitle}</p>
    </div>
  )
}

export default PageHeader
