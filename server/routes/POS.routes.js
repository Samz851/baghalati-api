/**
* Name: POS.routes
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
* Description: routes for HIKEUP POS
*
* Requirements: express
*
* @package
* @property
*
* @version 1.0
*/

router.get('/hikeup-redirect', (req, res) => {
    if(req.params.code){
        process.env.HUCODE = req.params.code;
    }
});


module.exports = router;
/** this ends this file
* server/routes/clients.routes
**/
