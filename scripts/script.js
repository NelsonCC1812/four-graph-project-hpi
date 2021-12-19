const inputs = document.querySelectorAll("input")
const currency = document.getElementById("currency")
const error = document.getElementById("error")

const max = document.getElementById("max")
const min = document.getElementById("min")

let prices

setStartDate()
setChart()
setListeners()


function setStartDate(){
    const date = new Date()

    
    inputs[1].value = formatDate(date)
    inputs[1].max = formatDate(date)
    date.setTime(date.getTime()-2629800000)
    inputs[0].value = formatDate(date)
}

function formatDate(date){
    return `${date.getFullYear()}-${date.getDate()<9?"0" + date.getMonth()+1: date.getMonth()+1}-${date.getDate()<10?"0"+date.getDate():date.getDate()}`
}

async function setChart() {

    if (inputs[0].value >= inputs[1].value) error.innerText = "The end date have to be greater than start date"
    else if((new Date(inputs[1].value).getTime()- new Date(inputs[0].value).getTime()) > 31536000000) error.innerText = "The difference between and finish date can not be greater than 1 year"
    else {
        error.innerText = ""

        const end = new Date(inputs[1].value)
        const start = new Date(inputs[0].value)

        const prom = [null, null, null, null]

        fetch(`https://api.coinpaprika.com/v1/coins/btc-bitcoin/ohlcv/historical?&start=${start.toISOString()}&end=${end.toISOString()}`)
            .then(data => data.json())
            .then(data => prom[0] = data)
            .then(()=>{
                fetch(`https://api.coinpaprika.com/v1/coins/eth-ethereum/ohlcv/historical?&start=${start.toISOString()}&end=${end.toISOString()}`)
                    .then(data => data.json())
                    .then(data => prom[1] = data)
                    .then(()=>{
                        fetch(`https://api.coinpaprika.com/v1/coins/bnb-binance-coin/ohlcv/historical?&start=${start.toISOString()}&end=${end.toISOString()}`)
                            .then(data => data.json())
                            .then(data => prom[2] = data)
                            .then(()=>{
                                fetch(`https://api.coinpaprika.com/v1/coins/sol-solana/ohlcv/historical?&start=${start.toISOString()}&end=${end.toISOString()}`)
                                    .then(data => data.json())
                                    .then(data => prom[3] = data)
                                    .then(()=>printChart(prom))
                                    .catch(er => console.log(er))
                                    .catch( () => error.innerText = "Something went wrong")
                            })
                            .catch( () => error.innerText = "Something went wrong")
                    })
                    .catch( () => error.innerText = "Something went wrong")
            })
            .catch( () => error.innerText = "Something went wrong")

}
    
}


function setListeners() {
    inputs.forEach(elm => elm.onchange = () => setChart())
}

function printChart(data) {


    const dates = data[0].map(elm=>new Date(elm.time_close).toLocaleDateString())

    prices = data.map(elm => elm.map(elm_=>elm_.close))
    


    const ctx = document.getElementById("myChart").getContext("2d")

    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "bitcoin",
                    backgroundColor: "rgba(251, 255, 10, .3)",
                    borderColor: "#e77e05",
                    fill: true,
                    tension: .2,
                    data: prices[0]
                },{
                    label: "ethereum",
                    backgroundColor: "rgba(116, 13, 212, .3)",
                    borderColor: "#d40db9",
                    fill: true,
                    tension: .2,
                    data: prices[1]
                },{
                    label: "binance",
                    backgroundColor: "rgba(18, 6, 189, .3)",
                    borderColor: "black",
                    fill: true,
                    tension: .2,
                    data: prices[2]
                },{
                    label: "solana",
                    backgroundColor: "rgba(70, 180, 180, .3)",
                    borderColor: "#bd3754",
                    fill: true,
                    tension: .2,
                    data: prices[3]
                }
            ]
        },
        options: {

            scales:{ y:{ ticks:{ callback: (value) => value + "$"}}},
        },

    })

}