const router = require('express').Router();
const { Landlord, Property, Unit, Issue, Tenant } = require('../models')

router.get('/properties', (req, res) => {
    // find properties where landlord_id is equal to req.session.user_id
    Landlord.findOne({
        attributes: { exclude: ["password"] },
        where: {
            // to update with req.session.user_id
          id: 1,
        },
        include: [
          {
            model: Property,
            attributes: ["id", "address", "nickname"],
          }
        ]   
      })
      .then(landlordData => {

        const landlord = landlordData.get({ plain: true });
        console.log(landlord)
        res.render('properties-dash', {
            landlord,
            loggedIn: true
        })
      })
})


router.get("/propertyform", (req, res) => {
    res.render('property-form', {
        loggedIn: true,
        landlord: true 
    });
})

router.get('/properties/:id', (req, res) => {
    // find properties where landlord_id is equal to req.session.user_id and property is equal to req.params.id
    Property.findOne({
        where: {
          id: req.params.id,
        },
    
        include: [
          {
            model: Landlord,
            attributes: { exclude: ["password"] },
          },
          {
            model: Unit,
            attributes: ["id", "unit_number", "property_id", "rent", "rent_due"]
          },
        ],
    })
    .then(dbPropertyData => {
        const property = dbPropertyData.get({ plain: true });

        res.render('single-property', {
            property,
            loggedIn: true,
            landlord: true
        })
    })

})

router.get('/units/:id', (req, res) => {
    Unit.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Property,
                attributes: ["id", "address", "nickname"]
            },
            {
                model: Issue,
                attributes: ["id", "issue_title", "issue_text", "status", "unit_id"]
            },
            {
                model: Tenant,
                attributes: ["id", "first_name", "last_name", "email", "unit_id"],
            }
        ]
    })
    .then(dbUnitData => {
        const unit = dbUnitData.get({ plain: true })
        res.render('single-unit', {
            unit
        })
    })
})

router.get("/unitform/:id", (req, res) => {
    res.render('unit-form', {
        loggedIn: true,
        landlord: true 
    });
})


module.exports = router;