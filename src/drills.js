const knex = require('knex')
require('dotenv').config()

const knexInstance = knex({
    client: 'pg',
    connection: 'postgresql://dunder-mifflin:123@localhost/knex-practice',
})

function searchByName(searchTerm) {
    knexInstance 
        .select('name', 'price', 'date_added', 'category', 'checked')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log('Searched by term')
            console.log(result)
        })
}

searchByName('fried')

function paginateItems(pageNumber) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (pageNumber - 1)
    knexInstance   
        .select('name', 'price', 'date_added', 'category', 'checked')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log('Items in page number')
            console.log(result)
        })
}

paginateItems(2)

function itemAddedDaysAgo(daysAgo) {
    knexInstance
        .select('name', 'price', 'date_added', 'category', 'checked')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log('Items added days ago')
            console.log(result)
        })
}

itemAddedDaysAgo(10)

function totalCostForCategory() {
    knexInstance
        .select('category')
        .from('shopping_list')
        .sum('price AS total')
        .groupBy('category')
        .then(result => {
            console.log('Total cost for each category')
            console.log(result)
        })
}

totalCostForCategory()