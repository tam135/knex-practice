const shoppingListService = {
    getAllGroceries(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertGrocery(knex, newGrocery) {
        return knex 
            .insert(newGrocery)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
    },
    deleteGrocery(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
    },
    updateGrocery(knex, id, newGroceryFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newGroceryFields)
    }


}

module.exports = shoppingListService