import type { ReactNode } from 'react'

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
      {children}
    </div>
  )
}

export default Container
