import Image from "next/image"

interface AmbassadorSlideProps {
  image: string
  name: string
  title: string
  subtitle?: string
}

export function AmbassadorSlide({ image, name, title, subtitle }: AmbassadorSlideProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <h4 className="text-xl font-bold text-yammy-dark-blue">{name}</h4>
      <p className="text-yammy-blue">{title}</p>
      {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
    </div>
  )
}
