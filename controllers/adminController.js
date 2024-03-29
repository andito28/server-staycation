const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const fs = require('fs-extra');
const path = require('path');
const { findOne } = require('../models/Category');

module.exports = {
    viewDashboard : (req,res) => {
        res.render('admin/dashboard/view_dashboard')
    },
    viewCategory : async(req,res) => {
        try{
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('admin/category/view_category',{category,alert});
        }catch(error){
            res.redirect('/admin/category'); 
        }
    },
        addCategory : async (req,res) => {

        try{
            const {name} = req.body;
            await Category.create({name});
            req.flash('alertMessage','Success Add Category');
            req.flash('alertStatus','success')
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/category');
        }
    },

    editCategory : async(req,res) => {

        try{
            const {id,name} = req.body;
            const category = await Category.findOne({_id : id});
            category.name = name;
            category.save();
            req.flash('alertMessage','Success Update Category');
            req.flash('alertStatus','success')
            res.redirect('/admin/category');

        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/category');

        }
    },

    deleteCategory : async(req,res) => {

        try{
            const {id} = req.params;
            const category = await Category.findOne({_id : id});
            category.remove();
            req.flash('alertMessage','Success Delete Category');
            req.flash('alertStatus','success')
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/category');
        }
    },

    viewBank : async(req,res) => {

        try{
            const bank = await Bank.find(); 
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('admin/bank/view_bank',{bank,alert});
        }catch(error){
            res.redirect('admin/bank');
        }
       
    },

    addBank : async(req,res) => {
        try{
            const {nameBank,nomorRekening,name} = req.body;
            await Bank.create({
                nameBank,
                name,
                nomorRekening,
                imageUrl : `images/${req.file.filename}`
            }); 
            req.flash('alertMessage','Success Add Bank');
            req.flash('alertStatus','success');
            res.redirect('/admin/bank');
        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/bank');
        }
    },

    editBank : async(req,res) => {
        try{
            const {nameBank,nomorRekening,name,id} = req.body;
            
            const bank = await Bank.findOne({_id : id});

            if(req.file == undefined){
               bank.nameBank = nameBank;
               bank.nomorRekening = nomorRekening;
               bank.name = name;
               bank.save();
               req.flash('alertMessage','Success Update Bank');
               req.flash('alertStatus','success');
               res.redirect('/admin/bank');
            }else{
               await fs.unlink(path.join(`public/${bank.imageUrl}`));
               bank.nameBank = nameBank;
               bank.nomorRekening = nomorRekening;
               bank.name = name;
               bank.imageUrl = `images/${req.file.filename}`;
               await bank.save();
               req.flash('alertMessage','Success Update Bank');
               req.flash('alertStatus','success');
               res.redirect('/admin/bank');
            }
            }catch(error){
                req.flash('alertMessage',`${error.message}`);
                req.flash('alertStatus','danger')
                res.redirect('/admin/bank');
            }
    },

    deleteBank: async(req,res) => {

        try {
            const {id} = req.params;
            const bank = await Bank.findOne({_id : id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            bank.remove();
            req.flash('alertMessage','Success Delete Bank');
            req.flash('alertStatus','success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/bank');
        }

    },

    viewItem : async(req,res) => {
        try {
            const item = await Item.find()
            .populate({path:'imageId',select:'id imageUrl'})
            .populate({path:'categoryId',select:'name'});
          
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('admin/item/view_item',{
                category,
                alert,
                item,
                action : 'view'
            });
        } catch (error) {
            res.redirect('admin/item');
        }
    },

    addItem : async(req,res) => {
        try {
            const {categoryId,title,price,city,description} = req.body;

            if(req.files.length > 0){
                const category = await Category.findOne({_id:categoryId});

                const newItem = {
                    categoryId : category._id,
                    title,
                    price,
                    city,
                    description
                }
               const item = await Item.create(newItem);

               category.itemId.push({_id : item._id});
               await category.save();

               for(let i =0; i < req.files.length; i++){
                const imageSave = await Image.create({imageUrl : `images/${req.files[i].filename}`});
                item.imageId.push({_id : imageSave._id});
                await item.save();
               }
               req.flash('alertMessage','Success Add Item');
               req.flash('alertStatus','success')
               res.redirect('/admin/item');
            }
            
        } catch (error) {
            console.log(error)
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/item');
        }
        
    },

    showImageItem : async(req,res) => {

        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
            .populate({path:'imageId',select:'id imageUrl'});
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('admin/item/view_item',{
                alert,
                item,
                action : 'show-image'
            });
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/item');
        }
    },

    showEditItem : async(req,res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id : id})
            .populate({path:'imageId',select:'id imageUrl'})
            .populate({path:'categoryId',select: 'id name'});
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            console.log(item);
            res.render('admin/item/view_item',{
                alert,
                category,
                item,
                action : 'edit-item'
            });
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/item');
        }
    },

    editItem : async(req,res) => {
        try {
            const {id} = req.params;
            const {categoryId,title,price,city,description} = req.body;

            const item = await Item.findOne({_id : id})
            .populate({path:'imageId',select:'id imageUrl'})
            .populate({path:'categoryId',select: 'id name'});
          
            if(req.files.length > 0){

                for(let i = 0; i < item.imageId.length; i++){
                    const imageUpdate = await Image.findOne({_id : item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }

                item.title = title,
                item.price = price,
                item.categoryId = categoryId,
                item.description = description,
                item.city = city
                await item.save();
                req.flash('alertMessage','Success Edit Item');
                req.flash('alertStatus','success');
                res.redirect('/admin/item');
            }else{

                item.title = title,
                item.price = price,
                item.categoryId = categoryId,
                item.description = description,
                item.city = city
                item.save();
                req.flash('alertMessage','Success Edit Item');
                req.flash('alertStatus','success');
                res.redirect('/admin/item');
            }
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/item');
        }
    },

    deleteItem : async(req,res) => {
        try {
            const {id} = req.params;

            const item = await Item.findOne({_id : id}).populate('imageId');

            for(let i = 0; i < item.imageId.length; i++){
                Image.findOne({_id : item.imageId[i]._id}).then((image)=> {
                fs.unlink(path.join(`public/${image.imageUrl}`));
                image.remove();
                }).catch((error)=>{
                    req.flash('alertMessage',`${error.message}`);
                    req.flash('alertStatus','danger')
                    res.redirect('/admin/item');
                })
            }
            await item.remove();
            req.flash('alertMessage','Success Delete Item');
            req.flash('alertStatus','success');
            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect('/admin/item');
        }
    },

    viewDetailItem : (req,res) => {
        const {itemId} = req.params;
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message : alertMessage, status : alertStatus}
            res.render('admin/item/detail_item/view-detail-item',{
                alert,
                itemId
            });
        } catch (error) {
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`);   
        }
    },

    addFeature : async(req,res) => {
        const {itemId,name,qty} = req.body;
        try{
            if(!req.file){
                req.flash('alertMessage','file not found');
                req.flash('alertStatus','danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);    
            }
          
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl : `images/${req.file.filename}`
            }); 
            const item = await Item.findOne({_id : itemId});
            item.featureId.push({_id : feature._id});
            item.save();
            req.flash('alertMessage','Success Add Feature');
            req.flash('alertStatus','success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);   
        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger')
            res.redirect(`/admin/item/show-detail-item/${itemId}`);   
        }
    },

    viewBooking : (req,res) => {
        res.render('admin/booking/view_booking');
    }
}