import BottleImage from './BottleImage'

// Muestra la foto real del producto si existe; si no, la ilustración de botella.
export default function ProductImage({ product, className = '' }) {
  if (product?.image_url) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }
  return <BottleImage product={product} className={className} />
}
