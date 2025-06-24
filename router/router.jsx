import { createBrowserRouter } from "react-router-dom";
import Index from "../src/pages/index";
import Homepage from "../src/pages/Homepage";
import Create_users from "../src/pages/users/create_users";
import Delete_users from "../src/pages/users/delete_users";
import ProtectLogin from "../src/protect/protectLogin";
import ProtectSistem from "../src/protect/protect_sistem";
import NotPermision from "../src/pages/notPermision";
import ProtectAccess from "../src/protect/protect_acess";
import Edit_users from "../src/pages/users/edit_users";
import Create_products from "../src/pages/products/create_products";
import Delete_products from "../src/pages/products/delete_products";
import Edit_products from "../src/pages/products/edit_products";
import Historial_rentas from "../src/pages/rentas/historial_rentas";
import Lista_productos from "../src/pages/products/lista_productos";
import ProtectRutas from "../src/protect/protect_rutas";
import Nota_remision from "../src/pages/PDF/ficha_tecnica";
import PanelUsuarios from "../src/pages/users/panelUsuarios";
import PanelProductos from "../src/pages/products/panelProductos";
import PanelClientes from "../src/pages/clientes/panel_clientes";
import PanelNotasRemision from "../src/pages/notas de remision/panelNotasRemision";
import Nota_remision_manual from "../src/pages/PDF/nota_remision_manual";
import CollectionGalery from "../src/pages/collectionGalery";
import GeneradorRenta_notas from "../src/pages/notas de remision/generadorRenta_notas";
import ImageCollectionRentas from "../src/pages/imageCollectionRentas";
const router = createBrowserRouter([
{ path: "/", element: <ProtectLogin/>, children:[{index:true, element:<Index/>}] },
{ path: "/Homepage", element: <ProtectSistem/> , children:[{index:true, element:<Homepage/>}] },
{ path: "/create_users", element: <ProtectAccess/>, children:[{index:true, element:<Create_users/> }]},
{ path: "/delete_users", element: <ProtectAccess/> ,children:[{index:true, element:<Delete_users/> }]},
{ path: "/edit_users", element: <ProtectAccess/> ,children:[{index:true, element:<Edit_users/> }]},
{ path: "/create_products", element: <ProtectAccess/> ,children:[{index:true, element:<Create_products/> }]},
{ path: "/delete_products", element: <ProtectAccess/> ,children:[{index:true, element:<Delete_products/> }]},
{ path: "/edit_products", element: <ProtectAccess/> ,children:[{index:true, element:<Edit_products/> }]},
{ path: "/denied_acess", element: <NotPermision/>},
{ path: "/hist_renta", element:<ProtectRutas/>  ,children:[{index:true, element:<Historial_rentas/> }]},
{ path: "/product_list", element:<ProtectRutas/>  ,children:[{index:true, element:<Lista_productos/> }]},
{ path: "/nota_remision/:_id", element: <Nota_remision/>},
{ path: "/users_panel", element: <PanelUsuarios/>},
{ path: "/products_panel", element: <PanelProductos/>},
{ path: "/clients_panel", element: <PanelClientes/>},
{ path: "/notas_remision", element: <PanelNotasRemision/>},
{ path: "/pdf_nota/:_id", element: <Nota_remision_manual/>},
{path: "/collection/:_id", element: <CollectionGalery/>},
{path: "/collection_rentas/:_id", element: <ImageCollectionRentas/>},
{path: "/create_notas_rentas", element: <GeneradorRenta_notas/>}
])
export default router