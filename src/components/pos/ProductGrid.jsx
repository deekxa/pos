import { Package } from 'lucide-react';

export default function ProductGrid({ products, onAddProduct, getStockStatus }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock);
        return (
          <div
            key={product.id}
            onClick={() => product.stock > 0 && onAddProduct(product)}
            className={`bg-white rounded-lg border-2 border-gray-200 p-4 transition-all ${
              product.stock > 0
                ? "cursor-pointer hover:border-gray-900 hover:shadow-md"
                : "opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <Package className="text-gray-400" size={48} />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500">{product.category}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${stockStatus.bg} ${stockStatus.color} font-medium`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
