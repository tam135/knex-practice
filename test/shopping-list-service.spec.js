const shoppingListService = require('../src/shopping-list-service')
const knex = require('knex')


describe(`Shopping list service object`, function() {
    let db
    let testGroceries = [
        {
            id: 1,
            name: 'Buffalo pizza',
            price: '9.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack'
        },
        {
            id: 2,
            name: 'Lobster Rolls',
            price: '14.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 3,
            name: 'Vegan Burger',
            price: '6.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        }
    ]


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())
  
    context(`Given 'shoppping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testGroceries)
        })

        it(`getAllGroceries() resolves all groceries from 'shopping_list' table`, () => {
            // test that shopping-list-service.getAllGroceries gets data from table
            return shoppingListService.getAllGroceries(db)
                .then(actual => {
                    expect(actual).to.eql(testGroceries.map(groceries => ({
                        ...groceries,
                        date_added: new Date(groceries.date_added)
                    })))
                })
        })

        it(`getById() resolves a grocery by id from 'shopping_list' table`, () => {
            const thirdId = 3 
            const thirdTestGrocery = testGroceries[thirdId - 1]
            return shoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name:thirdTestGrocery.name,
                        category: thirdTestGrocery.category,
                        price: thirdTestGrocery.price,
                        checked: false,
                        date_added: thirdTestGrocery.date_added
                    })
                })
        })

        it(`deleteGrocery() removes a grocery by id from 'shopping_list' table`, () => {
            const groceryId = 3
            return shoppingListService.deleteGrocery(db, groceryId)
                .then(() => shoppingListService.getAllGroceries(db))
                .then(allAGroceries => {
                    //copy the test groceries array without the 'deleted' article
                    const expected = testGroceries.filter(grocery => grocery.id !== groceryId)
                    expect(allAGroceries).to.eql(expected)
                })
        })

        it(`updateGrocery() updates a grocery from the 'shopping_list' table`, () => {
            const idOfGroceryToUpdate = 3
            const newGroceryData = {
                name: 'updated name',
                category: 'Main',
                price: '13.99',
                checked: true,
                date_added: new Date(),
            }
            return shoppingListService.updateGrocery(db, idOfGroceryToUpdate, newGroceryData)
                .then(() => shoppingListService.getById(db, idOfGroceryToUpdate))
                .then(grocery => {
                    expect(grocery).to.eql({
                        id: idOfGroceryToUpdate,
                        ...newGroceryData,
                    })
                })
        })


    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllGroceries() resolves an empty array`, () => {
            return shoppingListService.getAllGroceries(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertGrocery() inserts a new grocery and resolves the new grocery with an 'id'`, () => {
            const newGrocery = {
                name: 'Test new name',
                category: 'Snack',
                price: '12.99',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return shoppingListService.insertGrocery(db, newGrocery)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newGrocery.name,
                        category: newGrocery.category,
                        price: newGrocery.price,
                        checked: newGrocery.checked,
                        date_added: new Date(newGrocery.date_added),
                    })
                })
        })
    })
})

