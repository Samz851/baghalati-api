/**
 * Name: category.controller
 *
 * @author Samer Alotaibi
 *		  sam@samiscoding.com
 *
 *
 *
 * Description:
 *
 * Requirements:
 *
 * @package
 * @property
 *
 * @version 1.0
 */

const categoryController = {};
const Category = require('../models/categories');

categoryController.getCategories = async (req, res) => {
	const categories = await Category.find();
	results = categories.map(obj => {
		return {
			name: obj.name,
			description: obj.description,
			productCount: obj.products.length
		};
	});
	res.json(results);
};

categoryController.getCount = async (req, res) => {
	const count = await Category.countDocuments();

	res.json(count);
};

categoryController.addProduct = async (req, res) => {
	const {
		id
	} = req.params;

	const {productId} = req.body;
	const category = await Category.findById(id);

	if (!category.products.some(item => {
		return item == productId;
	})){
		category.products.push(productId);
		await category.save((err) => {
			if (err) {
				res.json(err);
			} else {
				res.json({
					"status": "200"
				});
			}
		});
	}else{
		res.status(500).send({
			"message":"Item already exists!"
		})
	}
	// console.log(category);
	/*
	
	*/
};

categoryController.createCategory = async (req, res) => {
	const category = new Category(req.body);

	await category.save(err => {
		if (err) {
			res.json({
				"error": err.message
			});
		} else {
			res.json({
				"status": "200"
			});
		}
	});

};

module.exports = categoryController;

/** this ends this file
 * server/controllers/product.controller
 **/