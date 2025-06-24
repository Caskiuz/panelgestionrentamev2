import React from 'react';

export default function ModalEstadoRenta({ closeModal_estado, estado }) {
  console.log(estado);

  const getEstadoStyles = (targetEstado) => {
    if (estado === targetEstado) {
      return {
        text: 'text-black', // Clase de texto activo
        icon: 'fill-black', // Clase de icono activo
      };
    } else {
      return {
        text: 'text-[#bfbfbfee]', // Clase de texto deshabilitado
        icon: 'fill-[#d9d9d9c2]', // Clase de icono deshabilitado
      };
    }
  };

  const activoStyles = getEstadoStyles('Activo');
  const vencidoStyles = getEstadoStyles('Vencido');
  const entregadoStyles = getEstadoStyles('Entregado');

return (
<>
<div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
    <div className="bg-white rounded-[10px] w-[80%] h-auto flex flex-col gap-4 py-[1rem] px-[1rem]">
        <div className="flex justify-end">
            <button onClick={closeModal_estado}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </button>
        </div>
        <div className="flex items-center pb-[2rem] gap-4 justify-between px-[1rem]">
            {/* Pedido Activo */}
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className={`bi bi-bag-check-fill ${activoStyles.icon}`} viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                </svg>
                <p className={`font-semibold ${activoStyles.text}`}>Renta Activa.</p>
                <p className={`text-[0.8rem] ${activoStyles.text}`}>Renta entregada al cliente.</p>
            </div>
            {/* Flecha */}
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
                <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" className={`bi bi-alarm-fill ${vencidoStyles.icon}`} viewBox="0 0 16 16">
                    <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527" />
                </svg>
                <p className={`font-semibold ${vencidoStyles.text}`}>Renta Vencida.</p>
                <p className={`text-[0.8rem] ${vencidoStyles.text}`}>El cliente tiene que devolver lo rentado.</p>
            </div>
            {/* Flecha */}
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
                <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
            {/* Pedido Entregado */}
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className={`bi bi-bag-check-fill ${entregadoStyles.icon}`} viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                </svg>
                <p className={`font-semibold ${entregadoStyles.text}`}>Renta Devuelta.</p>
                <p className={`text-[0.8rem] ${entregadoStyles.text}`}>El cliente devolvió lo rentado</p>
            </div>
        </div>
    </div>
</div>
</>
);}
