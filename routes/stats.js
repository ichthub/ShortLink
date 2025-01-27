const {Url} = require('../models/urlshorten');
const express = require('express');
const router = express.Router();

// Stats
router.get('/:id', async (req, res) => {
    const url = await Url.findOne({
        ShortId: req.params.id
    });
    if (!url) return res.status(404).send(`Can't get Stats! As the shortlink with the given id does not exists!!`);

    let uniqueUsers = [...new Set(url.location)];
    let mobileUsers = 0;
    let desktopUsers = 0;
    for(var i = 0; i<url.device.length; i++){
        if(url.device[i]=="DESKTOP") desktopUsers++;
        else mobileUsers ++;
    }
    let compressionRate = Math.round(((url.ShortId.length + 19)/(url.inputUrl.length))*100);
    compressionRate = 100 - compressionRate;
    let statsObject = {
        inputUrl: url.inputUrl,
        CreatedAt: url.createdAt,
        views: url.views,
        ShortId: 'https://tii.now.sh/' + url.ShortId,
        CompressionRate: compressionRate,
        distinctUsers: uniqueUsers.length,
        mobileUsers: mobileUsers,
        desktopUsers: desktopUsers,
        QRcode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tii.now.sh/${url.ShortId}`
    }
    
    res.render('index',{ statsObject });
});

module.exports = router;