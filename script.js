let body,
   solucionCompleta = [] // Matriz 9x9 que guarda la solución final

const esValido = (fila, col, num) => {
   // Verificar FILA
   const tr = document.getElementById(`tr${fila}`)
   for (let j = 0; j < 9; j++) {
      if (parseInt(tr.children[j].textContent) === num) return false
   }

   // Verificar COLUMNA
   for (let i = 0; i < 9; i++) {
      const val = document.getElementById(`tr${i}`).children[col].textContent
      if (parseInt(val) === num) return false
   }

   // Verificar BLOQUE 3x3
   const startRow = Math.floor(fila / 3) * 3
   const startCol = Math.floor(col / 3) * 3
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         const val = document.getElementById(`tr${startRow + i}`).children[
            startCol + j
         ].textContent
         if (parseInt(val) === num) return false
      }
   }

   return true
}

const barajar = array => {
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
   }
   return array
}

const cargarTabla = () => {
   body = document.getElementsByTagName('body')[0]

   crearSelectDificultad()

   const table = document.createElement('table')
   for (let i = 0; i < 9; i++) {
      const tr = document.createElement('tr')
      tr.id = 'tr' + i
      for (let j = 0; j < 9; j++) {
         const td = document.createElement('td')
         td.id = 'td' + j
         tr.appendChild(td)
      }
      table.appendChild(tr)
   }
   body.appendChild(table)

   const divButton = document.createElement('div')
   divButton.id = 'divButton'

   // Botón para rellenar solución (trampa)
   const buttonResolver = document.createElement('button')
   buttonResolver.id = 'btnResolver'
   buttonResolver.innerText = 'Mostrar solución'
   divButton.appendChild(buttonResolver)

   // Botón para verificar solución
   const buttonVerificar = document.createElement('button')
   buttonVerificar.id = 'btnVerificar'
   buttonVerificar.innerText = 'Comprobar solución'
   divButton.appendChild(buttonVerificar)

   body.appendChild(divButton)
}

const poblarTabla = () => {
   const numeros = barajar([1, 2, 3, 4, 5, 6, 7, 8, 9])
   let index = 0

   for (let i = 0; i < 3; i++) {
      const tr = document.getElementById(`tr${i}`)
      for (let j = 0; j < 3; j++) {
         tr.children[j].textContent = numeros[index++]
      }
   }
}
const resolverSudoku = () => {
   const resolverRecursivo = () => {
      for (let i = 0; i < 9; i++) {
         const tr = document.getElementById(`tr${i}`)
         for (let j = 0; j < 9; j++) {
            const td = tr.children[j]
            if (!td.textContent) {
               for (let num = 1; num <= 9; num++) {
                  if (esValido(i, j, num)) {
                     td.textContent = num
                     if (resolverRecursivo()) return true
                     td.textContent = ''
                  }
               }
               return false
            }
         }
      }
      return true // Tablero lleno
   }

   const exito = resolverRecursivo()
   if (!exito) {
      alert('No se pudo resolver el Sudoku.')
   } else {
      // ✅ Guarda la solución completa en la matriz global
      solucionCompleta = []
      for (let i = 0; i < 9; i++) {
         const fila = []
         const tr = document.getElementById(`tr${i}`)
         for (let j = 0; j < 9; j++) {
            fila.push(parseInt(tr.children[j].textContent))
         }
         solucionCompleta.push(fila)
      }
   }
}

const controlBoton = () => {
   document
      .getElementById('btnResolver')
      .addEventListener('click', function () {
         // Poner la solución correcta guardada, no recalcular
         for (let i = 0; i < 9; i++) {
            const tr = document.getElementById(`tr${i}`)
            for (let j = 0; j < 9; j++) {
               tr.children[j].innerHTML = '' // Limpia input anterior
               const input = document.createElement('input')
               input.type = 'text'
               input.maxLength = 1
               input.style.width = '20px'
               input.style.textAlign = 'center'
               input.value = solucionCompleta[i][j]
               input.readOnly = true
               input.style.backgroundColor = '#ddd'
               tr.children[j].appendChild(input)
            }
         }
      })

   document
      .getElementById('btnVerificar')
      .addEventListener('click', function () {
         verificarSolucion()
      })
}

const ocultarCeldas = (numPistas = 35) => {
   const totalCeldas = 81
   const numOcultas = totalCeldas - numPistas

   let ocultadas = 0
   while (ocultadas < numOcultas) {
      const i = Math.floor(Math.random() * 9)
      const j = Math.floor(Math.random() * 9)
      const td = document.getElementById(`tr${i}`).children[j]
      if (td.textContent !== '') {
         td.textContent = ''
         ocultadas++
      }
   }
}
const crearSelectDificultad = () => {
   const select = document.createElement('select')
   select.id = 'selectDificultad'

   const opciones = [
      { valor: 'muyfacil', texto: 'Muy Fácil (48 pistas)' },
      { valor: 'facil', texto: 'Fácil (40 pistas)' },
      { valor: 'medio', texto: 'Medio (32 pistas)' },
      { valor: 'dificil', texto: 'Difícil (25 pistas)' },
      { valor: 'hardcore', texto: 'Muy Difícil (18 pistas)' }
   ]

   opciones.forEach(op => {
      const option = document.createElement('option')
      option.value = op.valor
      option.textContent = op.texto
      select.appendChild(option)
   })

   body.appendChild(select)
}

const convertirTablaAInputs = () => {
   for (let i = 0; i < 9; i++) {
      const tr = document.getElementById(`tr${i}`)
      for (let j = 0; j < 9; j++) {
         const td = tr.children[j]
         const valor = td.textContent
         td.textContent = ''

         const input = document.createElement('input')
         input.type = 'text' // Sigue siendo texto
         input.inputMode = 'numeric' // 👈 Dice al navegador: teclado numérico
         input.pattern = '[1-9]*' // Opcional: restringe solo a 1-9
         input.maxLength = 1
         input.style.width = '30px'
         input.style.textAlign = 'center'

         if (valor !== '') {
            input.value = valor
            input.readOnly = true
            input.style.backgroundColor = '#ddd'
         }

         td.appendChild(input)
      }
   }
}

const verificarSolucion = () => {
   for (let i = 0; i < 9; i++) {
      const tr = document.getElementById(`tr${i}`)
      for (let j = 0; j < 9; j++) {
         const input = tr.children[j].querySelector('input')
         const valor = input.value
         if (valor === '') {
            alert(`Casilla vacía en (${i + 1}, ${j + 1})`)
            return
         }
      }
   }

   alert(
      '¡Comprobación simple! No he validado reglas aún, solo que todo está lleno.'
   )
}

const generarNuevoSudoku = nivel => {
   // 1. Borra la tabla anterior (opcional, por limpieza)
   for (let i = 0; i < 9; i++) {
      const tr = document.getElementById(`tr${i}`)
      for (let j = 0; j < 9; j++) {
         tr.children[j].textContent = ''
         tr.children[j].innerHTML = '' // quita input si lo hubiera
      }
   }

   // 2. Pone un bloque 3x3 inicial para resolver Sudoku
   poblarTabla()

   // 3. Resuelve Sudoku completo
   resolverSudoku()

   // 4. Según nivel, oculta casillas
   let pistas
   switch (nivel) {
      case 'muyfacil':
         pistas = 48
         break
      case 'facil':
         pistas = 40
         break
      case 'medio':
         pistas = 32
         break
      case 'dificil':
         pistas = 25
         break
      case 'hardcore':
         pistas = 18
         break
   }
   ocultarCeldas(pistas)

   // 5. Convierte a inputs (readonly para pistas, editable para vacías)
   convertirTablaAInputs()
}

const cambiarDificultad = () => {
   document
      .getElementById('selectDificultad')
      .addEventListener('change', function () {
         generarNuevoSudoku(this.value)
      })
}

window.addEventListener('load', () => {
   cargarTabla() // 1️⃣ Crea tabla, select y botones
   generarNuevoSudoku('facil') // 2️⃣ Genera Sudoku inicial
   cambiarDificultad() // 3️⃣ Gestiona cambios de dificultad
   controlBoton() // 4️⃣ Conecta botones a acciones
})
