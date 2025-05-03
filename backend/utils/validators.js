const Joi = require('joi');

// Product validation schema
exports.validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(100),
        description: Joi.string().required().min(10).max(1000),
        price: Joi.number().required().min(0),
        category: Joi.string().required().valid(
            'electronics',
            'fashion',
            'home',
            'beauty',
            'sports',
            'toys',
            'books',
            'food',
            'health',
            'automotive'
        ),
        stock: Joi.number().required().min(0),
        images: Joi.array().items(Joi.string()).min(1).max(5)
    });

    return schema.validate(data);
}; 