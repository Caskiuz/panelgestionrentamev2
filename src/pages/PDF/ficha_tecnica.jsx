import React, { useEffect, useState } from 'react';
import { Page, Document, Image, StyleSheet, View, Text, PDFViewer } from '@react-pdf/renderer';
import logo from '../../images/logo.png'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FichaTecnica = ({_id}) => {
  const [datas, setDatas] = useState([]);
  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`
      );
      setDatas(data.response);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  useEffect(() => {
    get();
  }, []);

  return (
    <Document title={`Ficha tecnica.pdf`}>
      {datas.map((dat) => (
        <Page key={dat._id} size="A4" style={{position:'relative', paddingTop:20}}>
          <View style={{position:'absolute',width:'100%', flexDirection:'row', justifyContent:'space-between', paddingHorizontal:40, paddingTop:20 }} >
            <Image style={{width:'20%'}} source={logo}/>
            <View style={{width:'70%', flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'#004AAD', color:'white', border:1, borderColor:'black'}}><Text>FICHA TÉCNICA</Text></View>
          </View>
          <View style={{position: 'absolute', top: 110, left: '6.8%', height: 47, width: '85.2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', fontSize: 11, border:1, borderColor:'black', paddingHorizontal:4}}>
            <Text>{dat.nombre.toUpperCase()}</Text>
          </View>
          <View style={{ position: 'absolute', top: 186.2, left: '48.7%', height: 178.7, width: '43.5%', border:1, borderColor:'black'}}>
            <Image src={{ uri: `${dat.foto}`, method: 'GET' }} />
          </View>
          <View style={{position:'absolute', top:186.2, border:1, borderColor:'black', left:40, width: '38.7%',flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'#004AAD', color:'white', paddingVertical:7}}><Text>Datos Básicos</Text></View>
          <View style={{position: 'absolute', top: 230, left: 40, width: '38.7%', fontSize: 13, flexDirection: 'column', justifyContent: 'center', gap: 10, paddingLeft: 6, border:1, borderColor:'black', height:134}}>
            <Text>CODIGO DEL EQUIPO</Text>
            <Text>{dat.codigo}</Text>
            <Text>PRECIO DEL EQUIPO</Text>
            <Text>${dat.precio_renta} MXN</Text>
          </View>
          {/* La descripción ahora fluye automáticamente a otra página si es necesario */}
          <View style={{marginTop: 370, width: '85.2%', paddingHorizontal: 6, left:40, padding:10, border:1, borderColor:'black'}}>
            <Text style={{  fontSize: 12, textAlign: 'justify',}}>{dat.descripcion.toUpperCase()}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default FichaTecnica;
