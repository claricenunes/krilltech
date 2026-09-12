import logoImg from '../../logo.png'

function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return <img src={logoImg} alt="Logo" className={`${className} object-contain`} />
}

export default Logo
