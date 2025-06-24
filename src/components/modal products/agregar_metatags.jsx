import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AgregarMetatags({ closeModal3, _id }) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [action, setAction] = useState("add");
  const [product, setProduct] = useState(null);
  console.log(product);

  async function get_product_especific() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`);
      setProduct(data.response);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

  useEffect(() => {
    get_product_especific();
  }, [_id]);

  const handleInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveTagFromProduct = async (tagToRemove) => {
    if (!product || !product[0]?.tags) return;
  
    const updatedTags = product[0].tags.filter(tag => tag !== tagToRemove);
  
    try {
      // Realizar la solicitud DELETE al backend para eliminar el tag
      await axios.delete(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/delete_tags`,
        { data: { _id, tagsToRemove: [tagToRemove] } }
      );
  
      // Actualizar el estado del producto en frontend
      const updatedProduct = [...product];
      updatedProduct[0].tags = updatedTags;
  
      setProduct(updatedProduct);  // Actualizamos el estado del producto
  
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tag eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
  
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al eliminar el tag!",
      });
    }
  };
  

  const guardarTags = async () => {
    if (tags.length === 0) {
      Swal.fire("Error", "Agrega al menos un tag antes de guardar.", "warning");
      return;
    }

    Swal.fire({
      title: "Guardando cambios...",
      text: "Por favor espere...",
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/update_tags/${_id}`,
        { tags: [...(product?.tags || []), ...tags] },
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.close();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Tags guardados",
        showConfirmButton: false,
        timer: 1500,
      });

      setProduct({ ...product, tags: [...(product?.tags || []), ...tags] });
      setTags([]);
      closeModal3();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al guardar los tags!",
      });
    }
  };

  return (
    <div className="w-full h-full absolute z-40 bg-[#d9d9d97b] flex py-[2rem] justify-center items-center">
      <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] max-h-[90vh] flex flex-col overflow-y-auto">
        <div className="bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid">
          <p className="text-white font-semibold">Administrar tags del equipo</p>
          <button onClick={closeModal3}>
            <svg className="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <label className="block font-semibold">¿Qué deseas hacer con los tags?</label>
          <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
            <option value="add">Añadir más tags</option>
            <option value="remove">Eliminar tags</option>
          </select>
        </div>

        {action === "add" && (
  <div className="px-4">
    <input
      type="text"
      value={tagInput}
      onChange={handleInputChange}
      onKeyDown={handleEnterPress}
      placeholder="Escribe un tag y presiona Enter"
      className="w-full p-2 border border-gray-300 rounded"
    />
    <label className='text-[0.8rem]  font-bold'>* Cada vez que presiones Enter, se añadirá un tag por separado.</label>
    <label className='text-[0.8rem] mb-1 font-bold'>* Estos no se añadiran a la base de datos hasta que guardes los cambios.</label>
    {tags.length > 0 && (
        <p className="font-semibold underline">Tags que se van a añadir</p>
    )}
    <div className="mt-4 flex flex-wrap gap-2">
   
      {tags?.map((tag, index) => (
        <div key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center">
          {tag}
          <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500">×</button>
        </div>
      ))}
    </div>
    {/* Nueva sección de tags existentes */}
    {product && product[0]?.tags?.length > 0 && (
      <div className="mt-4">
        <p className="font-semibold underline">Tags existentes:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product[0].tags.map((tag, index) => (
            <div key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center">
              {tag}
            </div>
          ))}
        </div>
      </div>
    )}
     {product && (product[0]?.tags?.length === 0 || !product[0]?.tags ) && (
      <div className="mt-4">
        <div className="mt-2 flex flex-wrap gap-2">
         <p className="text-[0.8rem] font-semibold">-No hay tags para mostrar en este equipo, prueba aadiendo algunos a la base de datos</p>
        </div>
      </div>
    )}

    <div className="p-4">
      <button onClick={guardarTags} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Guardar Cambios
      </button>
    </div>

   
  </div>
)}


{action === "remove" && product && product[0]?.tags?.length > 0 && (
  <div className="p-4">
    <p className="text-gray-700 font-semibold">Selecciona los tags a eliminar:</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {product[0].tags.map((tag, index) => (
        <div key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded flex items-center">
          {tag}
          <button onClick={() => handleRemoveTagFromProduct(tag)} className="ml-2 text-red-500">×</button>
        </div>
      ))}
    </div>
  </div>
)}

        {action === "remove" && product && (!product[0].tags || product[0].tags.length === 0) && (
          <p className="p-4 text-gray-500">No hay tags para eliminar.</p>
        )}
      </div>
    </div>
  );
}
