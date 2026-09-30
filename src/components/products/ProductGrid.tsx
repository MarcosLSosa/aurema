import { ProductCard } from "@/components/products/ProductCard"
import type { Product } from "@/types"

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-20 text-center">
        <p className="font-display text-xl text-bark">Sin resultados por acá</p>
        <p className="mt-2 text-sm text-stone">
          Probá con otra categoría — escribinos por WhatsApp si buscás algo a medida.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
