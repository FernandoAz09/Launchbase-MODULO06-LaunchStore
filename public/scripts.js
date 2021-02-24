/*  
TUDO SOBRE ---> https://tableless.com.br/o-basico-sobre-expressoes-regulares/]

Regex quick reference
[abc] 	A single character of: a, b, or c
[^abc] 	Any single character except: a, b, or c
[a-z] 	Any single character in the range a-z
[a-zA-Z] 	Any single character in the range a-z or A-Z
^ 	Start of line
$ 	End of line
\A 	Start of string
\z 	End of string
. 	Any single character
\s 	Any whitespace character
\S 	Any non-whitespace character
\d 	Any digit
\D 	Any non-digit
\w 	Any word character (letter, number, underscore)
\W 	Any non-word character
\b 	Any word boundary
(...) 	Capture everything enclosed
(a|b) 	a or b
a? 	Zero or one of a
a* 	Zero or more of a
a+ 	One or more of a
a{3} 	Exactly 3 of a
a{3,} 	3 or more of a
a{3,6} 	Between 3 and 6 of a

options: i case insensitive m make dot match newlines x ignore whitespace in regex o perform #{...} substitutions only once

*/
//ALTERANDO O FORMATO DOS NÚMEROS PARA MOEDA(BRL) E IMPEDINDO OUTROS CARACTERES(ALFABÉTICOS E ESPECIAIS)

// MASK SENDO IMPORTADO PARA O HTML DE FORMA DINÂMICA 

const Mask = {
    apply(input, func) {
        setTimeout(function() { 
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g,"") 
        return new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency:'BRL'
        }).format(value/100)
    }
}

// PhotosUpload SENDO IMPORTADO PARA O HTML DE FORMA DINÂMICA
// Colocando functions no INPUT
const PhotosUpload = {
    input:"",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [], 
    handleFileInput(event) {
        const { files: fileList} = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return
// Arrow function com apenas um argumento não precisa de () 
// Arrow function não precisa de {}
// Arrow function não precisa escrever return
        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const {files: fileList} = input

        if (fileList.length > uploadLimit) {  //VALIDAÇÃO
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() // CANCELANDO O ENVIO SE Nº > QUE LIMITE
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')

        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight:document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}