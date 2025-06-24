import React, { useEffect, useRef, useState } from "react";
import {
  Page,
  Document,
  Image,
  StyleSheet,
  View,
  Text,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import page1 from "../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0001.jpg";
import page2 from "../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0002.jpg";
import logo2 from "../../images/logo2.png";
import page4 from "../../images/imagenes_pdf_contrato/CONTRATO-RENTA-PARA-IMPRIMIR_page-0004.jpg";
import page0 from "../../images/imagenes_pdf_contrato/rm-remision_page-0001.jpg";
import firma from "../../images/imagenes_pdf_contrato/firma.png";
import axios from "axios";

const contrato = ({ _id }) => {
  const [loading, setLoading] = useState(null);
  const [datas, setDatas] = useState([]);
  const [qr, setQr] = useState();
  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`
      );
      setDatas(data.response);
      setLoading(false); // Datos cargados, actualizamos el estado de carga
    } catch (error) {
      console.error("Error fetching image data:", error);
      setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
    }
  }
const generateQR = async () => {
    const link = `https://rentas.rentamecarmen.com.mx/collection_rentas/${_id}`;
    const qrDataURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}`;
  try {
    const response = await fetch(qrDataURL);
    const blob = await response.blob();
    const qrImageFile = new File([blob], 'qr.png', { type: 'image/png'});
    setQr(URL.createObjectURL(qrImageFile))
    } catch (error) {
    }
  };
  useEffect(() => {
   generateQR()
  }, [_id]);
  useEffect(() => {
    get();
  }, []);
  const styles = StyleSheet.create({
    page: {
      position: "relative",
      width: "100%",
    },
    plantilla: {
      position: "absolute",
      width: "100%",
    },
    arrendador: {
      position: "absolute",
      top: 171,
      fontSize: 10.5,
      left: 132,
    },
    arrendatario: {
      position: "absolute",
      top: 193,
      fontSize: 10.5,
      left: 95,
    },
    dia_expedicion: {
      position: "absolute",
      top: 484,
      fontSize: 12,
      left: 270,
    },
    mes_expedicion: {
      position: "absolute",
      top: 484,
      fontSize: 12,
      left: 310,
    },
    año_expedicion: {
      position: "absolute",
      top: 484,
      fontSize: 12,
      left: 343,
    },
    dia_vencimiento: {
      position: "absolute",
      top: 498,
      fontSize: 12,
      left: 75,
    },
    mes_vencimiento: {
      position: "absolute",
      top: 498,
      fontSize: 12,
      left: 115,
    },
    año_vencimiento: {
      position: "absolute",
      top: 498,
      fontSize: 12,
      left: 145,
    },
    direccion: {
      position: "absolute",
      top: 259.5,
      fontSize: 10,
      left: 70,
    },

    box: {
      position: "absolute",
      top: 240,
      left: 63,
      width: "80%",
      fontFamily: "Helvetica",
      lineHeight: 2,
    },
    name: {
      fontFamily: "Helvetica-Bold",
      lineHeight: 2,
      fontSize: 11,
      textDecoration: "underline",
    },
    desc: {
      lineHeight: 2,
      fontSize: 11,
    },
    arrendador2: {
      position: "absolute",
      top: 315,
      fontSize: 10,
      left: 38,
      width: "33.3%",
      flexDirection: "row",
      justifyContent: "center",
    },
    arrendatario2: {
      position: "absolute",
      top: 315,
      fontSize: 10,
      left: 294,
      width: "33.3%",
      flexDirection: "row",
      justifyContent: "center",
    },
    box_products: {
      width: "93%",
      height: 400,
      position: "absolute",
      top: 247,
      left: 18,
      flexDirection: "column",
    },
    box_datas: {
      width: "100%",
      height: 22.5,
      fontSize: 11,
      flexDirection: "row",
      alignItems: "center",
    },
    box_1: {
      height: 20,
      flexDirection: "row",
      alignItems: "center",
      width: "9.7%",
      justifyContent: "center",
    },
    box_2: {
      height: 20,
      flexDirection: "row",
      alignItems: "center",
      width: "62%",
      justifyContent: "flex-start",
      paddingLeft: 10,
    },
    box_3: {
      height: 20,
      flexDirection: "row",
      alignItems: "center",
      width: "14%",
      justifyContent: "center",
    },
    box_4: {
      height: 20,
      flexDirection: "row",
      alignItems: "center",
      width: "14.5%",
      justifyContent: "center",
    },
    total: {
      position: "absolute",
      top: 665,
      fontSize: 11,
      left: 495,
    },
    nombre: {
      position: "absolute",
      fontSize: 9,
      top: 151,
      left: 67,
    },
    telefono: {
      position: "absolute",
      fontSize: 9,
      top: 174,
      left: 69,
    },
    vencimiento: {
      position: "absolute",
      fontSize: 9,
      top: 197.5,
      left: 124,
    },
    estado: {
      position: "absolute",
      fontSize: 9,
      top: 151,
      left: 443,
    },
    fecha: {
      position: "absolute",
      fontSize: 10,
      top: 174,
      left: 405,
    },
    hora: {
      position: "absolute",
      fontSize: 10,
      top: 197,
      left: 405,
    },
    observacion: {
      position: "absolute",
      fontSize: 9,
      top: 685,
      left: 20,
      width: "66%",
      height: 43,
      paddingLeft: 2,
    },
    encargado: {
      position: "absolute",
      fontSize: 9,
      top: 750,
      left: 20,
    },
    folio: {
      position: "absolute",
      fontSize: 10,
      top: 95,
      left: 492,
      fontFamily: "Helvetica-Bold",
      color: "red",
    },
    total_iva: {
      position: "absolute",
      top: 713,
      fontSize: 11,
      left: 495,
    },
    pocentaje_iva: {
      position: "absolute",
      top: 690,
      fontSize: 11,
      left: 495,
    },
    firma: {
      position: "absolute",
      top: 370,
      left: 80,
      width: "17%",
    },
  });

  const formatMoney = (num) => {
    if (typeof num !== "number") return num;
    return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <Document title={`NOTA DE REMISION & CONTRATO`}>
        {datas.map((dat) => {
          const fecha_renta = dat.fecha_renta.split("/");
          const fecha_vencimiento = dat.fecha_vencimiento.split("/");

          const dia_expedicion = fecha_renta[0];
          const mes_expedicion = fecha_renta[1];
          const año_expedicion = fecha_renta[2];
          const dia_vencimiento = fecha_vencimiento[0];
          const mes_vencimiento = fecha_vencimiento[1];
          const año_vencimiento = fecha_vencimiento[2];

          return (
            <>
              <Page size="LETTER">
                              <View style={{ position: "relative", width: "100%" }}>
                                <Image
                                  onLoad={() => setImageLoaded(true)}
                                  style={{ position: "absolute", width: "100%" }}
                                  src={`${page0}`}
                                />
                              </View>
                              <Text style={{ position: "absolute", top: "6.3%", fontSize: 5, left: "93.15%" }}>
                                .mx 
                              </Text>
                              <Text style={{ position: "absolute", top: "12%", fontSize: 13, left: "81%", color:"red", fontFamily: "Helvetica-Bold" }}>
                                {dat.folio} 
                              </Text>
                              <Text style={{ position: "absolute", top: "19.4%", fontSize: 9, left: "11.5%" }}>
                                {dat.nombre} 
                              </Text>
                              <Text style={{ position: "absolute", top: "22.4%", fontSize: 9, left: "12%" }}>
                                {dat.direccion}
                              </Text>
                              <View
                style={{
                  position: "absolute",
                  top: "24.6%",
                  left: "20%",
                  paddingHorizontal: 4,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  minWidth: 300,
                }}
              >
                <Text style={{ fontSize: 9 }}>
                  {dat.fecha_vencimiento}
                </Text>
              </View>
                              <Text style={{ position: "absolute", top: "19.6%", fontSize: 9, left: "74%" }}>
                                C.del carmen-CAMPECHE
                              </Text>
                              <Text style={{ position: "absolute", top: "22.5%", fontSize: 9, left: "69%" }}>
                                {dat.fecha_renta}
                              </Text>
                              <Text style={{ position: "absolute", top: "25.4%", fontSize: 9, left: "68%" }}>
                                {dat.hora_renta}
                              </Text>
                              {/* aca van los datos de la tabla */}
                              {dat.productos &&
                                dat.productos.map((prod, idx) => (
                                  <React.Fragment key={idx}>
                                    <Text
                                      style={{
                                        position: "absolute",
                                        top: `${31.7 + idx * 3}%`, // Ajusta el valor para espaciar filas verticalmente
                                        left: "3.2%",
                                        fontSize: 10,
                                        width: "9%",
                                        textAlign: "center",
                                        paddingVertical: 5.5,
                                      }}
                                    >
                                      {prod.cantidad}
                                    </Text>
                                    <Text
                                      style={{
                                        position: "absolute",
                                        top: `${31.7 + idx * 3}%`,
                                        left: "12.5%",
                                        fontSize: 10,
                                        width: "57%",
                                        textAlign: "left",
                                        paddingVertical: 5.5,
                                        paddingLeft: 5,
                                      }}
                                    >
                                      {prod.nombre}
                                      {prod.dias_renta !== null && prod.dias_renta !== undefined
                  ? ` (${prod.dias_renta} ${prod.dias_renta === 1 ? 'día' : 'días'})`
                  : ''}
                                    </Text>
                                    <Text
                                      style={{
                                        position: "absolute",
                                        top: `${31.7 + idx * 3}%`,
                                        left: "70%",
                                        fontSize: 10,
                                        width: "12%",
                                        textAlign: "center",
                                        paddingVertical: 5.5,
                                      }}
                                    >
                                      {formatMoney(Number(prod.precio_unitario))}
                                    </Text>
                                    <Text
                                      style={{
                                        position: "absolute",
                                        top: `${31.7 + idx * 3}%`,
                                        left: "82.5%",
                                        fontSize: 10,
                                        width: "13.4%",
                                        textAlign: "center",
                                        paddingVertical: 5.5,
                                      }}
                                    >
                                      {formatMoney(Number(prod.importe_total))}
                                    </Text>
                                  </React.Fragment>
                                ))}
                               {dat.fotos_estado_inicial.length > 0 && (
                                 <View
                style={{
                  position: 'absolute',
                  top: '71%',
                  left: '52%',
                  width: '15.5%',
                  alignItems: 'center',
                  gap: 4, // Si gap no funciona en PDF, usa marginBottom en el QR o marginTop en el texto
                }}
              >
                <Image
                  style={{ width: '70%' }}
                  src={qr}
                />
                <Text
                  style={{
                    width: '100%',
                    fontSize: 9,
                    textAlign: 'center',
                    color: '#222',
                    marginTop:0, // Espacio entre QR y texto
                  }}
                >
                  Escanea para ver las fotos de los equipos
                </Text>
              </View>
                               )}
                              <View
                                style={{
                                  position: "absolute",
                                  top: "87.7%",
                                  left: "3.3%",
                                  width: "66.1%",
                                  fontSize: 10,
                                  height: 46,
                                  padding: 3,
                                }}
                              >
                                  
                                <Text>{dat.observacion_inicial}</Text>
                              </View>
                              <Text style={{ position: "absolute", top: "85.5%", fontSize: 10, left: "84%" }}>
                                ${formatMoney(Number(dat.total_renta))}
                              </Text>
                              {dat.IVA === true && (
                                <Text style={{ position: "absolute", top: "88.3%", fontSize: 10, left: "84%" }}>
                                  ${formatMoney(Number(dat.total_renta) * 0.16)}
                                </Text>
                              )}
                              {dat.IVA === true ? (
                                <Text style={{ position: "absolute", top: "91.5%", fontSize: 10, left: "84%" }}>
                                  ${formatMoney(Number(dat.total_renta) + (Number(dat.total_renta) * 0.16))}
                                </Text>
                              ) : (
                                <Text style={{ position: "absolute", top: "91.5%", fontSize: 10, left: "84%" }}>
                                  ${formatMoney(Number(dat.total_renta))}
                                </Text>
                              )}
                            </Page>
              <Page size="A4">
                <View style={styles.page}>
                  <Image
                    style={styles.plantilla}
                    src={{ uri: `${page1}`, method: "GET" }}
                  />
                  <Text style={styles.arrendador}>
                    ZAIR EMANUEL GARCIA CHABLE
                  </Text>
                  <Text style={styles.arrendatario}>
                    {dat.nombre.toUpperCase()}
                  </Text>
                  <Text style={styles.dia_expedicion}>{dia_expedicion}</Text>
                  <Text style={styles.mes_expedicion}>{mes_expedicion}</Text>
                  <Text style={styles.año_expedicion}>{año_expedicion}</Text>
                  <Text style={styles.dia_vencimiento}>{dia_vencimiento}</Text>
                  <Text style={styles.mes_vencimiento}>{mes_vencimiento}</Text>
                  <Text style={styles.año_vencimiento}>{año_vencimiento}</Text>
                </View>
              </Page>
              <Page size="A4">
                <View style={styles.page}>
                  <Image
                    style={styles.plantilla}
                    src={{ uri: `${page2}`, method: "GET" }}
                  />
                  <Text style={styles.direccion}>{dat.direccion}</Text>
                </View>
              </Page>
              <Page size="A4" style={{ paddingTop: 20, position: "relative" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 20,
                  }}
                >
                  <Image style={{ width: "60%" }} source={logo2} />
                </View>
                <View
                  style={{
                    marginTop: 30,
                    width: "85.2%",
                    paddingHorizontal: 6,
                    left: 40,
                    padding: 10,
                    flexDirection: "column",
                  }}
                >
                  {dat.productos?.map((dat3, index) => (
                    <>
                      <Text style={styles.name}>
                        {index + 1}) {dat3.nombre.toUpperCase()}:
                      </Text>
                      <Text style={styles.desc}>
                        {dat3.descripcion.toUpperCase()}
                      </Text>
                    </>
                  ))}
                </View>
              </Page>
              <Page size="A4">
                <View style={styles.page}>
                  <Image
                    style={styles.plantilla}
                    src={{ uri: `${page4}`, method: "GET" }}
                  />
                  <View style={styles.arrendador2}>
                    <Text>ZAIR EMANUEL GARCIA CHABLE</Text>
                  </View>
                  <View style={styles.arrendatario2}>
                    <Text>{dat.nombre.toUpperCase()}</Text>
                  </View>
                  <Image
                    style={styles.firma}
                    src={{ uri: `${firma}`, method: "GET" }}
                  />
                </View>
              </Page>
            </>
          );
        })}
      </Document>
    </>
  );
};

export default contrato;
