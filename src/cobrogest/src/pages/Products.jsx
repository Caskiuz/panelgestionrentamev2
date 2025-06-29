import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Cambiar endpoint a /api/products para coincidir con el backend
const API_BASE = 'https://backrecordatoriorenta-production.up.railway.app/api/products';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    foto: '',
    codigo: '',
    categoria: '',
    stock: 1,
    descripcion: '',
    precio_renta: '',
    precio_venta: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Cargar productos desde backend
  const fetchProducts = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axios.get(`${API_BASE}`, axiosConfig);
      setProducts(data.response || []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al cargar productos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newProduct.nombre || !newProduct.foto || !newProduct.codigo || !newProduct.descripcion) {
      setErrorMsg('Por favor, completa los campos requeridos.');
      return;
    }
    setLoading(true);
    try {
      if (editingProductId) {
        await axios.put(`${API_BASE}/update/${editingProductId}`, newProduct, axiosConfig);
      } else {
        await axios.post(`${API_BASE}/create`, newProduct, axiosConfig);
      }
      setShowAddForm(false);
      setEditingProductId(null);
      setNewProduct({ nombre: '', foto: '', codigo: '', categoria: '', stock: 1, descripcion: '', precio_renta: '', precio_venta: '' });
      fetchProducts();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al guardar el producto');
    }
    setLoading(false);
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(product => product._id === productId);
    if (productToEdit) {
      setNewProduct({
        nombre: productToEdit.nombre || '',
        foto: productToEdit.foto || '',
        codigo: productToEdit.codigo || '',
        categoria: productToEdit.categoria?.[0] || '',
        stock: productToEdit.stock || 1,
        descripcion: productToEdit.descripcion || '',
        precio_renta: productToEdit.precio_renta || '',
        precio_venta: productToEdit.precio_venta || '',
      });
      setEditingProductId(productId);
      setShowAddForm(true);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setLoading(true);
      setErrorMsg("");
      try {
        await axios.delete(`${API_BASE}/delete`, { ...axiosConfig, data: { _id: productId } });
        fetchProducts();
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || 'Error al eliminar el producto');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Gestión de Productos
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingProductId(null); setNewProduct({ nombre: '', foto: '', codigo: '', categoria: '', stock: 1, descripcion: '', precio_renta: '', precio_venta: '' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Producto
          </button>
        </header>
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingProductId ? 'Editar Producto' : 'Añadir Producto'}</h2>
              {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
              <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newProduct.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="foto" className="block text-gray-700 text-sm font-semibold mb-2">Foto (URL):</label>
                  <input
                    type="text"
                    id="foto"
                    name="foto"
                    value={newProduct.foto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="codigo" className="block text-gray-700 text-sm font-semibold mb-2">Código:</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={newProduct.codigo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="categoria" className="block text-gray-700 text-sm font-semibold mb-2">Categoría (ID):</label>
                  <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    value={newProduct.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-gray-700 text-sm font-semibold mb-2">Stock:</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="descripcion" className="block text-gray-700 text-sm font-semibold mb-2">Descripción:</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={newProduct.descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="precio_renta" className="block text-gray-700 text-sm font-semibold mb-2">Precio Renta:</label>
                  <input
                    type="number"
                    id="precio_renta"
                    name="precio_renta"
                    value={newProduct.precio_renta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="precio_venta" className="block text-gray-700 text-sm font-semibold mb-2">Precio Venta:</label>
                  <input
                    type="number"
                    id="precio_venta"
                    name="precio_venta"
                    value={newProduct.precio_venta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setErrorMsg(""); }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : (editingProductId ? 'Actualizar Producto' : 'Guardar Producto')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Listado de Productos */}
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Productos</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {products.length === 0 && !loading ? (
            <p className="text-gray-600 text-center py-8">No hay productos registrados.</p>
          ) : loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">Cargando productos...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[900px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Precio Renta</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={product.nombre}>{product.nombre}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">
                        {product.foto ? <img src={product.foto} alt={product.nombre} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded" /> : '-'}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[100px] truncate" title={product.codigo}>{product.codigo}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={Array.isArray(product.categoria) && product.categoria.length > 0 ? product.categoria.map(cat => typeof cat === 'object' && cat !== null ? cat.nombre || cat._id || JSON.stringify(cat) : cat).join(', ') : '-'}>
                        {Array.isArray(product.categoria) && product.categoria.length > 0
                          ? product.categoria.map(cat =>
                              typeof cat === 'object' && cat !== null
                                ? cat.nombre || cat._id || JSON.stringify(cat)
                                : cat
                            ).join(', ')
                          : '-'}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">{product.stock}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[180px] truncate" title={product.descripcion}>{product.descripcion}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(product.precio_renta || 0).toFixed(2)}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(product.precio_venta || 0).toFixed(2)}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEditProduct(product._id)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Editar Producto"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            title="Eliminar Producto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ProductsPage;
