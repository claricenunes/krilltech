import ArmadilloIllustration from '../illustrations/ArmadilloIllustration'

function InstitutionalCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-sage-200/70 bg-sage-50 shadow-softer">
      <div className="px-6 pt-6">
        <h3 className="font-display text-lg font-bold leading-snug text-forest-950">
          O futuro do agro é feito de boas decisões.
        </h3>
        <p className="mt-2 text-sm text-sage-600">
          Com dados, tecnologia e pessoas, o KrillRadar ajuda a KRILLTECH a
          cultivar um crescimento mais seguro.
        </p>
      </div>
      <div className="mt-4 h-40 px-4">
        <ArmadilloIllustration className="h-full w-full" />
      </div>
    </div>
  )
}

export default InstitutionalCard
