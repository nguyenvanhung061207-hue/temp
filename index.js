const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// KHỞI TẠO CÁC BIẾN CHO TRÒ CHƠI
let player = 'X'
let isPauseGame = false
let isGameStart = false

// MẢNG CÁC ĐIỀU KỆN CHIẾN THẮNG
const inputCells = ['', '', '',
    '', '', '',
    '', '', '']

// ẢNG CÁC ĐIỀU KỆN CHIẾN THẮNG
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
]

// Thêm trình lắng nghe sự kiện nhấp chuột vào từng ô
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
    // Đảm bảo ô trống và trò chơi không bị tạm dừng
    if (cell.textContent == '' &&
        !isPauseGame
    ) {
        isGameStart = true
        updateCell(cell, index)

        // Thực hiện chọn ngẫu nhiên nếu không có kết quả
        if (!checkWinner()) {
            changePlayer()
            randomPick()
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF'
}

function changePlayer() {
    player = (player == 'X') ? 'O' : 'X'
}

function randomPick() {
    // Tạm dừng trò chơi để cho phép Máy tính chọn
    isPauseGame = true

    setTimeout(() => {
        let randomIndex
        do {
            // Chọn một chỉ mục ngẫu nhiên
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while (
            // Đảm bảo ô đã chọn trống
        inputCells[randomIndex] != ''
            )

        // Cập nhật ô bằng cách di chuyển máy tính
        updateCell(cells[randomIndex], randomIndex, player)
        // Kiểm tra xem máy tính có thắng không
        if (!checkWinner()) {
            changePlayer()
            // Chuyển trở lại Người chơi
            isPauseGame = false
            return
        }
        player = (player == 'X') ? 'O' : 'X'
    }, 1000) // Trì hoãn chuyển động của máy tính 1 giây
}

function checkWinner() {
    for (const [a, b, c] of winConditions) {
        // Kiểm tra từng điều kiện chiến thắng
        if (inputCells[a] == player &&
            inputCells[b] == player &&
            inputCells[c] == player
        ) {
            declareWinner([a, b, c])
            return true
        }
    }

    // Kiểm tra xem có hòa không (nếu tất cả các ô đều được điền)
    if (inputCells.every(cell => cell != '')) {
        declareDraw()
        return true
    }
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win`
    isPauseGame = true

    // Đánh dấu các ô chiến thắng
    winningIndices.forEach((index) =>
        cells[index].style.background = '#2A2343'
    )

    restartBtn.style.visibility = 'visible'
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
    // Đảm bảo trò chơi chưa bắt đầu
    if (!isGameStart) {
        // Ghi đè giá trị người chơi đã chọn
        player = selectedPlayer
        if (player == 'X') {
            // Hightlight X display
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            // Hightlight O display
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false
    isGameStart = false
    titleHeader.textContent = 'CHỌN'
})
