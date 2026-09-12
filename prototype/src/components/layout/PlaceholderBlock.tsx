function PlaceholderBlock({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
      <div className="mt-3 rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-stone-400">{description}</p>
      </div>
    </section>
  )
}

export default PlaceholderBlock
