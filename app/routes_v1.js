const express = require('express')
const { get } = require('browser-sync')
const router = express.Router()
const fs = require('fs')

var folder = "v1"

// Routes
router.get('/search', function(req, res) {
    res.render(folder + '/search')
})

router.get('/search-results', function(req, res) {
    console.log(req.query)
    res.render(folder + '/search-results', { results: filterRegister(req.query.name, req.query['product-type'], req.query.status, req.query.country, req.query.category) })
})

router.get('/details/:giNumber', function(req, res) {
    res.render(folder + '/product-details', findGi(req.params.giNumber))
})


// Functions
function findGi(giNumber) {
    return getRegisterData('register').find(element => element.EA_FileNumber === giNumber)
}

function filterRegister(name, product_type, statuses, country, category) {
    let registerData = getRegisterData('register')
    if (name) {
        registerData = registerData.filter(element => element.EA_Name.includes(name))
    }

    if (product_type) {
        registerData = registerData.filter(element => product_type.includes(element.EA_ProductType))
    }

    if (statuses) {
        registerData = registerData.filter(element => statuses.includes(element.EA_Status))
    }

    if (country) {
        registerData = registerData.filter(element => element.EA_Country === country)
    }

    if (category) {
        registerData = registerData.filter(element => element.EA_ProductCategory === category)
    }

    return registerData
}

function getRegisterData(registerName) {
    try {
        const jsonString = fs.readFileSync('app/views/v1/data/registers/register.json')
        return JSON.parse(jsonString)
    } catch(err) {
        console.log(err)
        return
    }
}

module.exports = router
