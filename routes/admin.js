const router = require('express').Router();

const {upload,uploadMultiple} = require('../middlewares/multer');

const adminController = require('../controllers/adminController');

router.get('/dashboard',adminController.viewDashboard);

//endpoint category
router.get('/category',adminController.viewCategory);
router.post('/category',adminController.addCategory);
router.put('/category',adminController.editCategory);
router.delete('/category/:id',adminController.deleteCategory);

//endpoint bank
router.get('/bank',adminController.viewBank);
router.post('/bank',upload,adminController.addBank);
router.put('/bank',upload,adminController.editBank);
router.delete('/bank/:id',adminController.deleteBank);

//endpoint item
router.get('/item',adminController.viewItem);
router.post('/item',uploadMultiple,adminController.addItem);
router.get('/item/show-image/:id',adminController.showImageItem);
router.get('/item/:id',adminController.showEditItem);
router.put('/item/:id',uploadMultiple,adminController.editItem);
router.delete('/item/:id/delete',adminController.deleteItem);

//endpoint detail-item
router.get('/item/show-detail-item/:itemId',adminController.viewDetailItem);
router.post('/item/add/feature',upload,adminController.addFeature);
//endpoint booking
router.get('/booking',adminController.viewBooking);



module.exports = router;