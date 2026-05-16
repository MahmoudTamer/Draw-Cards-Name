export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-navy-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin" />
      </div>
      {text && <p className="text-navy-600 text-sm">{text}</p>}
    </div>
  )
}
