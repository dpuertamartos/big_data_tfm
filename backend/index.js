const express = require('express')
const cors = require('cors')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

let flats = [
        {
          "1": null,
          "id": "40078031769.996345",
          "title": "Piso en Barrio Vidal",
          "location": "Vidal-Barrio Blanco (Salamanca Capital)",
          "city": "salamanca",
          "price_euro": 106000,
          "description": "Se vende bonita vivienda en el barrio Vidal. El piso se encuentra en una tercera planta sin ascensor y consta de bonito hall de entrada, cómodo salón con salida a balcón desde el que podrás disfrutar de unas fabulosas vistas, cómoda cocina amueblada, 3 dormitorios ( dos sencillos y uno doble con armario empotrado), despensa en el pasillo y cuarto de baño con plato de ducha y ventana reformado hace cuatro años. La vivienda cuenta con calefacción individual de gas natural, suelos de tarima flotante, ventanas de climalit...",
          "link": "https://www.pisos.com/comprar/piso-vidal_barrio_blanco-40078031769_996345/",
          "updated_date": "Actualizado el 09/12/2023",
          "superficie_construida_m2": 73,
          "superficie_util_m2": 60,
          "superficie_solar_m2": null,
          "habitaciones": 3,
          "banos": 1,
          "antiguedad": "Más de 50 años",
          "conservacion": "En buen estado",
          "referencia": "996345-V7970-1",
          "armarios_empotrados": "1",
          "tipo_suelo": "Tarima flotante",
          "vidrios_dobles": "Vidrios dobles",
          "carpinteria_exterior": "Aluminio",
          "aire_acondicionado": null,
          "chimenea": null,
          "cocina_equipada": null,
          "comedor": null,
          "lavadero": null,
          "garaje": null,
          "puerta_blindada": null,
          "jardin": null,
          "piscina": null,
          "urbanizado": null,
          "calle_alumbrada": null,
          "calle_asfaltada": null,
          "old_price_euro": null,
          "photos": "[\"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_1_20231209133515289.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_2_20231209133516814.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_3_20231209133518380.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_4_20231209133519749.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_5_20231209133521010.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_6_20231209133522263.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_7_20231209133523612.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_8_20231209133524915.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_9_20231209133526206.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_10_20231209133527683.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_11_20231209133528922.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_12_20231209133530087.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_13_20231209133531321.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_14_20231209133532552.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_15_20231209133533834.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_16_20231209133535039.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_17_20231209133536261.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_18_20231209133537404.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_19_20231209133538578.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_20_20231209133539774.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_21_20231209133540851.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_22_20231209133542007.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_23_20231209133543215.jpg\", \"https://fotos.imghs.net/2xl/996345/40078031769.996345/996345_40078031769_24_20231209133544481.jpg\"]",
          "createdat": 1702163698,
          "version": 0,
          "updatedat": 1702163698,
          "active": 1,
          "terraza": null,
          "tipo_de_casa": null,
          "planta": "3ª",
          "gastos_de_comunidad": "Entre 20 y 40€",
          "calefaccion": "Gas natural",
          "cocina": "Cocina",
          "trastero": null,
          "exterior": "Exterior",
          "portero_automatico": null,
          "soleado": null,
          "ascensor": null,
          "orientacion": null,
          "telefono": null,
          "agua": null,
          "amueblado": null,
          "balcon": "Balcón",
          "sistema_de_seguridad": null,
          "luz": null,
          "carpinteria_interior": null,
          "interior": null,
          "gas": null,
          "adaptado_a_personas_con_movilidad_reducida": null,
          "se_aceptan_mascotas": null,
          "no_se_aceptan_mascotas": null,
          "exterior_summary": "YES",
          "vidrios_dobles_summary": "YES",
          "adaptado_a_personas_con_movilidad_reducida_summary": null,
          "puerta_blindada_summary": null,
          "ascensor_summary": null,
          "balcon_summary": "YES",
          "portero_automatico_summary": null,
          "garaje_summary": null,
          "comedor_summary": null,
          "terraza_summary": null,
          "jardin_summary": null,
          "armarios_empotrados_summary": "YES",
          "aire_acondicionado_summary": null,
          "trastero_summary": null,
          "piscina_summary": null,
          "chimenea_summary": null,
          "lavadero_summary": null,
          "urbanizado_summary": null,
          "calle_alumbrada_summary": null,
          "calle_asfaltada_summary": null,
          "soleado_summary": null,
          "gas_summary": null,
          "sistema_de_seguridad_summary": null,
          "interior_summary": null,
          "amueblado_summary": null,
          "cocina_equipada_summary": null,
          "mascotas_summary": null,
          "gastos_de_comunidad_cleaned": 30,
          "carpinteria_exterior_cleaned": "ALUMINIO",
          "tipo_suelo_summary": "TARIMA FLOTANTE",
          "calefaccion_summary": "GAS NATURAL",
          "cocina_summary": "OTROS",
          "orientacion_summary": null,
          "agua_summary": null,
          "type": "piso",
          "esquina": null,
          "alcantarillado": null,
          "esquina_summary": null,
          "alcantarillado_summary": null,
          "important": false
        },
        {
          "1": null,
          "id": "40086539744.100200",
          "title": "Piso en Garrido-Labradores",
          "location": "Garrido-Labradores (Salamanca Capital)",
          "city": "salamanca",
          "price_euro": 120000,
          "description": "Agencia inmobiliaria de Salamanca, Garrido Norte, Oficina Tecnocasa:",
          "link": "https://www.pisos.com/comprar/piso-garrido_labradores37004-40086539744_100200/",
          "updated_date": "Actualizado el 09/12/2023",
          "superficie_construida_m2": 92,
          "superficie_util_m2": null,
          "superficie_solar_m2": null,
          "habitaciones": 3,
          "banos": 1,
          "antiguedad": null,
          "conservacion": null,
          "referencia": "TC830-566379",
          "armarios_empotrados": null,
          "tipo_suelo": null,
          "vidrios_dobles": null,
          "carpinteria_exterior": null,
          "aire_acondicionado": null,
          "chimenea": null,
          "cocina_equipada": null,
          "comedor": null,
          "lavadero": null,
          "garaje": null,
          "puerta_blindada": null,
          "jardin": null,
          "piscina": null,
          "urbanizado": null,
          "calle_alumbrada": null,
          "calle_asfaltada": null,
          "old_price_euro": null,
          "photos": "[\"https://fotos.imghs.net/2xl/1002/379/1002_566379_1_2023120911121632587.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_2_2023120911121632595.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_3_2023120911121632596.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_4_2023120911121632598.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_5_2023120911121632599.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_6_2023120911121632600.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_7_2023120911121632601.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_8_2023120911121632603.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_9_2023120911121632604.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_10_2023120911121632605.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_11_2023120911121632606.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_12_2023120911121632607.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_13_2023120911121632608.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_14_2023120911121632609.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_15_2023120911121632611.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_16_2023120911121632612.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_17_2023120911121632614.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_18_2023120911121632615.jpeg\", \"https://fotos.imghs.net/2xl/1002/379/1002_566379_19_2023120911121632616.jpeg\"]",
          "createdat": 1702163698,
          "version": 0,
          "updatedat": 1702163698,
          "active": 1,
          "terraza": null,
          "tipo_de_casa": null,
          "planta": "2ª",
          "gastos_de_comunidad": null,
          "calefaccion": "Central",
          "cocina": "Cocina",
          "trastero": null,
          "exterior": null,
          "portero_automatico": null,
          "soleado": null,
          "ascensor": "Ascensor",
          "orientacion": null,
          "telefono": null,
          "agua": null,
          "amueblado": null,
          "balcon": "Balcón",
          "sistema_de_seguridad": null,
          "luz": null,
          "carpinteria_interior": null,
          "interior": null,
          "gas": null,
          "adaptado_a_personas_con_movilidad_reducida": null,
          "se_aceptan_mascotas": null,
          "no_se_aceptan_mascotas": null,
          "exterior_summary": null,
          "vidrios_dobles_summary": null,
          "adaptado_a_personas_con_movilidad_reducida_summary": null,
          "puerta_blindada_summary": null,
          "ascensor_summary": "YES",
          "balcon_summary": "YES",
          "portero_automatico_summary": null,
          "garaje_summary": null,
          "comedor_summary": null,
          "terraza_summary": null,
          "jardin_summary": null,
          "armarios_empotrados_summary": null,
          "aire_acondicionado_summary": null,
          "trastero_summary": null,
          "piscina_summary": null,
          "chimenea_summary": null,
          "lavadero_summary": null,
          "urbanizado_summary": null,
          "calle_alumbrada_summary": null,
          "calle_asfaltada_summary": null,
          "soleado_summary": null,
          "gas_summary": null,
          "sistema_de_seguridad_summary": null,
          "interior_summary": null,
          "amueblado_summary": null,
          "cocina_equipada_summary": null,
          "mascotas_summary": null,
          "gastos_de_comunidad_cleaned": null,
          "carpinteria_exterior_cleaned": null,
          "tipo_suelo_summary": null,
          "calefaccion_summary": "CENTRAL",
          "cocina_summary": "OTROS",
          "orientacion_summary": null,
          "agua_summary": null,
          "type": "piso",
          "esquina": null,
          "alcantarillado": null,
          "esquina_summary": null,
          "alcantarillado_summary": null
        }
]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/flats', (req, res) => {
  res.json(flats)
})

// const generateId = () => {
//   const maxId = flats.length > 0
//     ? Math.max(...flats.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/flats', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const flat = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   flats = flats.concat(flat)

//   response.json(flat)
// })

app.get('/api/flats/:id', (request, response) => {
  const id = request.params.id
  const flat = flats.find(flat => flat.id === id)

  if (flat) {
    response.json(flat)
  } else {
    response.status(404).end()
  }

  response.json(flat)
})

app.delete('/api/flats/:id', (request, response) => {
  const id = request.params.id
  flats = flats.filter(flat => flat.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})