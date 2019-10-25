// SOURCE VARIABLES \\

const siteTitleDiv = document.querySelector('#site-title')
const newPicBtn = document.querySelector('#new-pic-btn')
const picDisplayDiv = document.querySelector('#pic-display')
const picturesDiv = document.querySelector('#pictures')
const newPicForm = document.querySelector('#new-pic-form')
const formNewSubmit = document.querySelector('#form-new-submit')
const newCapForm = document.querySelector('#new-caption-form')
const newCapSubmit = document.querySelector('#new-cap-submit')
const nextNav = document.querySelector('#right')
const prevNav = document.querySelector('#left')
const captionsDiv = document.querySelector('#captions')
const newPicModal = document.querySelector('#new-pic-modal')
const closeFormBtn = document.querySelector('#close-form')


// INITIALIZATION \\

const localPicsArr = []

loadLocalPicsArr()
initDomPic()


// FUNCTIONS \\

function loadLocalPicsArr() {
  fetch('http://localhost:3000/pictures')
  .then(response => response.json())
  .then(picsArray => {
    picsArray.forEach(pic => {
      localPicsArr.push(pic)
    }) 
  })
}

function initDomPic() {
  fetch('http://localhost:3000/pictures')
  .then(response => response.json())
  .then(picsArray => {
      addPicToPicsDiv(picsArray[0])
      addCaptionsToCaptionsDiv(picsArray[0])
  })
}

function addPicToPicsDiv(pic) {
  let picImg = document.createElement('img')

  picImg.id = 'pic-img'
  picImg.src = pic.img_url
  picImg.alt = 'Picture of situational humor'
  picImg.style.maxWidth = '800px'
  picImg.style.maxHeight = '435px'
 
  picturesDiv.append(picImg)
}

function addCaptionsToCaptionsDiv(pic) {
  let sortedCaps = pic.captions.sort(compareIds)
  
  sortedCaps.forEach(caption => {
    addCaptionToCaptionsDiv(caption)
  })
}

function addCaptionToCaptionsDiv(caption) {
  let captionDiv = document.createElement('div')
  let captionP = document.createElement('p')
  let likesP = document.createElement('p')
  let dateP = document.createElement('p')
  let likeBtn = document.createElement('button')
  
  captionDiv.style.borderBottom = '1px dotted #4169E1'
  captionDiv.style.paddingBottom = '5px'
  captionDiv.style.paddingRight = '20px'
  captionDiv.style.display = 'grid'
  captionDiv.style.gridTemplateColumns = '2fr 10fr 1fr 1fr'
  
  dateP.style.gridColumn = '1/1'
  captionP.style.gridColumn = '2/2'
  likesP.style.gridColumn = '3/3'
  likeBtn.style.gridColumn = '4/4'
  likeBtn.style.alignSelf = 'center'

  captionP.innerText = `"${caption.content}"`
  dateP.innerText = caption.formatted_date
  likesP.innerHTML = 
    `<span id="count">${caption.likes}</span> ${caption.likes === 1 ? 'Like' : 'Likes'}`
  likeBtn.innerHTML = 'L i k e <span id="heart" style="color:red">♡</span>'

  likeBtn.style.color = '#4169E1'
  likeBtn.style.backgroundColor = '#f2f5fa'
  likeBtn.style.borderRadius = '5px 5px 5px 5px'
  likeBtn.style.height = '30px'
  likeBtn.style.width = '60px'
  likeBtn.style.cursor = 'pointer'

  likeBtn.addEventListener('click', (event) => {
    let likes = event.target.parentElement.querySelector('#count')
    let btnHeart = event.target.parentElement.querySelector('#heart')
    let likesCount = likes.innerText

    btnHeart.innerText = '♥︎'
    setTimeout(function() {btnHeart.innerText = '♡'}, 120)
    
    fetch(`http://localhost:3000/captions/${caption.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: parseInt(likesCount) + 1
      })
    })
    .then(response => response.json())
    .then(updatedCaption => {
      caption.likes = updatedCaption.likes
      likesP.innerHTML = 
        `<span id="count">${caption.likes}</span> ${caption.likes === 1 ? 'Like' : 'Likes'}`
    }) 
  })

  captionDiv.append(dateP, captionP, likesP, likeBtn)
  captionsDiv.prepend(captionDiv)
}

function createNewCaption(capValue, currentPic) {
  fetch('http://localhost:3000/captions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      content: capValue,
      likes: 0,
      picture_id: currentPic.id
    })
  })
  .then(response => response.json())
  .then(newCaption => {
    addCaptionToCaptionsDiv(newCaption)
  }) 
}

function reloadDomPic(i) {
  fetch('http://localhost:3000/pictures')
  .then(response => response.json())
  .then(picsArray => {
    addPicToPicsDiv(picsArray[i])
    addCaptionsToCaptionsDiv(picsArray[i])
    newCapForm.reset()
  })
}


// EVENT LISTENERS \\

siteTitleDiv.addEventListener('mouseenter', (event) => {
  const dgLink = document.createElement('a')
  const dgLinkText = document.createElement('span')
  let title = event.target

  title.style.paddingTop = '20px'
  
  dgLink.href = "https://www.github.com/dangrammer"
  dgLink.target = "_blank"
  dgLink.innerText = '@dangrammer'
  dgLink.style.fontStyle = 'normal'
  dgLink.style.fontSize = '30px'
  dgLink.style.color = '#E0FFFF'
  dgLink.style.textShadow = '2px 2px 6px #00ffff'
  dgLink.style.textDecoration = 'none'
  dgLink.style.cursor = 'pointer'
  
  dgLinkText.innerText = 'by '
  dgLinkText.style.fontSize = '25px'

  removeChildren(title)
  title.append(dgLinkText, dgLink)
})

siteTitleDiv.addEventListener('mouseleave', (event) => {
  let title = event.target

  removeChildren(title)
  title.innerText = 'What\'s Going On Here?'
  title.style.fontSize = '30px'
  title.style.fontStyle = 'italic'
  title.style.color = '#faffe8'
  title.textShadow = '1px 1px #4179e1'
  title.style.paddingTop = '20px'
  title.style.cursor = 'default'
})

newPicBtn.addEventListener('click', (event) => {
  newPicModal.style.display = 'block'
  newPicForm.reset()
})

newPicBtn.addEventListener('mouseenter', (event) => {
  let btn = event.target

  btn.style.fontWeight = 'bold'
  btn.style.color = '#FFF8DC'
  btn.style.backgroundColor = '#38b0b0'
  btn.style.borderColor = '#FFF8DC'
  btn.style.boxShadow = '1px 1px 3px #FFF8DC'
  
})

newPicBtn.addEventListener('mouseleave', (event) => {
  let btn = event.target

  btn.style.fontWeight = 'normal'
  btn.style.color = '#2f9696'
  btn.style.backgroundColor = '#e4f2f1'
  btn.style.borderColor = '#38b0b0'
  btn.style.boxShadow = 'none'
})

nextNav.addEventListener('click', (event) => {
  let currentPicUrl = event.target.parentElement.parentElement.querySelector('#pic-img')
  let currentPic = localPicsArr.find(pic => pic.img_url === currentPicUrl.src)
  let currentPicIndex = localPicsArr.indexOf(currentPic)
  let i 
  
  currentPicIndex + 1 === localPicsArr.length ? i = 0 : i = currentPicIndex + 1

  removeChildren(picturesDiv)
  removeChildren(captionsDiv)
  reloadDomPic(i)
})

nextNav.addEventListener('mouseenter', (event) => {
  event.target.style.color = '#43d9c9'
})

nextNav.addEventListener('mouseleave', (event) => {
  event.target.style.color = '#38b0b0'
})

prevNav.addEventListener('click', (event) => {
  let currentPicUrl = event.target.parentElement.parentElement.querySelector('#pic-img')
  let currentPic = localPicsArr.find(pic => pic.img_url === currentPicUrl.src)
  let currentPicIndex = localPicsArr.indexOf(currentPic)
  let i 
  
  currentPicIndex === 0 ? i = localPicsArr.length - 1 : i = currentPicIndex - 1

  removeChildren(picturesDiv)
  removeChildren(captionsDiv)
  reloadDomPic(i)
})

prevNav.addEventListener('mouseenter', (event) => {
  event.target.style.color = '#43d9c9'
})

prevNav.addEventListener('mouseleave', (event) => {
  event.target.style.color = '#38b0b0'
})

newPicForm.addEventListener('submit', (event) => {
  event.preventDefault()
  
  let newPicUrl = event.target['new-pic'].value
  let capValue = event.target['new-cap'].value

  fetch('http://localhost:3000/pictures', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      img_url: newPicUrl
    })
  })
  .then(response => response.json())
  .then(newPic => {
    localPicsArr.push(newPic)
    removeChildren(picturesDiv)
    removeChildren(captionsDiv)
    addPicToPicsDiv(newPic)
    createNewCaption(capValue, newPic)
    newPicModal.style.display = 'none'
  })
})

newCapForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let capValue = event.target['new-cap'].value
  let currentPicUrl = event.target.parentElement.querySelector('#pic-img')
  let currentPic = localPicsArr.find(pic => pic.img_url === currentPicUrl.src)
  
  createNewCaption(capValue, currentPic)
  event.target.reset()
})

closeFormBtn.addEventListener('click', (event) => {
  newPicModal.style.display = 'none'  
})

newCapSubmit.addEventListener('mouseenter', (event) => {
  let btn = event.target

  btn.style.color = '#FFF8DC'
  btn.style.backgroundColor = '#38b0b0'
  btn.style.borderColor = '#FFF8DC'
})

newCapSubmit.addEventListener('mouseleave', (event) => {
  let btn = event.target

  btn.style.color = '#2f9696'
  btn.style.backgroundColor = '#ebfaf9'
  btn.style.borderColor = '#38b0b0'
})

formNewSubmit.addEventListener('mouseenter', (event) => {
  let btn = event.target

  btn.style.color = '#FFF8DC'
  btn.style.backgroundColor = '#38b0b0'
  btn.style.borderColor = '#FFF8DC'
})

formNewSubmit.addEventListener('mouseleave', (event) => {
  let btn = event.target

  btn.style.color = '#2f9696'
  btn.style.backgroundColor = '#ebfaf9'
  btn.style.borderColor = '#38b0b0'
})

window.addEventListener('click', (event) => {
  if (event.target === newPicModal) {
    newPicModal.style.display = 'none'
  }  
})


// HELPER FUNCTIONS \\

function removeChildren(parentNode) {  
  while (parentNode.firstChild) { 
    parentNode.removeChild(parentNode.firstChild)  
  }
}

function compareIds(a, b) {
  let comparison = 0
  
  if (a.id > b.id) {
    comparison = 1
  } else if (a.id < b.id) {
    comparison = -1
  }
  return comparison
}