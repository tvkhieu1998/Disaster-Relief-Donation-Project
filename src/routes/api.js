const express = require('express');
const { getAccounts, getAccount, updateAccount, deleteAccount, createAccount
} = require('../controllers/AccountManagerController');
const { register, login,
} = require('../controllers/AuthenticationController');
const { createVNPayDonation, vnPayReturn, getTotalAmountOfDonation, countDonation, getDonations, } = require('../controllers/DonationController');

const { VerifyToken, CheckRole } = require('../middleware/VerifyToken');

const charityOrgController = require('../controllers/CharityOrganizationController');
const charityOrgManagementController = require('../controllers/CharityOrgManagementController');
const meteorologicalAgencyController = require('../controllers/MeteorologicalAgencyController');
const heatmapController = require('../controllers/HeatmapController');
const severityController = require('../controllers/SeverityController');
const newfeedController = require('../controllers/NewsfeedController');
// const newsFeedController = require('../controllers/NewsFeedController');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);


//api for Severity:

router.get('/getSeverity', severityController.getSeverity);

//api for public Heatmap:
router.get('/getHeatmap', heatmapController.getHeatmap);

//api for public Newfeeds:

router.get('/getNewsfeed', newfeedController.getNewsfeed);
router.get('/getNewsfeedByPK', newfeedController.getNewsfeedByPK);

router.use(VerifyToken);
//Account
router.get('/accounts', getAccounts);
router.get('/account', getAccount);
router.post('/create-account', createAccount);
router.put('/update-account', updateAccount)
router.delete('/delete-account', deleteAccount);

//VNPay Donation
router.get('/donations', getDonations);
router.get('/donation/countAmountOfDonation', getTotalAmountOfDonation);
router.get('/donation/countDonation', countDonation);
router.post('/createdonation', createVNPayDonation);
router.post('/vnPayReturn', vnPayReturn);



// api for charity organization
router.get('/charityOrgs', charityOrgController.getCharityOrgs);
router.get('/getCharityOrgByKey', charityOrgController.getCharityOrgByKey);
router.post('/createCharityOrg', charityOrgController.createCharityOrgs);
router.put('/updateCharityOrg', charityOrgController.updateCharityOrgs);
router.delete('/deleteCharityOrg', charityOrgController.deleteCharityOrgs);

// api for charity organization management
router.get('/getAllCharityOrgManagement', charityOrgManagementController.getCharityOrgManagements);
router.get('/getCharityOrgManagementByKey', charityOrgManagementController.getCharityOrgManagement);
router.post('/createCharityOrgManagement', charityOrgManagementController.createCharityOrgManagements);
router.put('/updateCharityOrgManagement', charityOrgManagementController.updateCharityOrgManagements);
router.delete('/deleteCharityOrgManagement', charityOrgManagementController.deleteCharityOrgManagements);

// api for meteorological agency
router.get('/getAllMeteorologicalAgency', meteorologicalAgencyController.getMeteorologicalAgencies);
router.get('/getMeteorologicalAgencyByKey', meteorologicalAgencyController.getMeteorologicalAgencyByKey);
router.post('/createMeteorologicalAgency', meteorologicalAgencyController.createMeteorologicalAgencies);
router.put('/updateMeteorologicalAgency', meteorologicalAgencyController.updateMeteorologicalAgencies);
router.delete('/deleteMeteorologicalAgency', meteorologicalAgencyController.deleteMeteorologicalAgencies);

// api for disaster
const disasterController = require('../controllers/DisasterController');
router.get('/getAllDisasters', disasterController.getDisasters);
router.get('/getDisasterByKey', disasterController.getDisasterByKey);
router.post('/createDisaster', CheckRole([1]), disasterController.createNewDisaster);
router.put('/updateDisaster', CheckRole([1]), disasterController.updateDisaster);
router.delete('/deleteDisaster', CheckRole([1]), disasterController.deleteDisaster);

//api for victims
const victimController = require('../controllers/VictimController');
router.get('/getAllVictims', victimController.getVictims);
router.get('/getVictimByKey', victimController.getVictimByKey);
router.post('/createVictim', victimController.createNewVictim);
router.put('/updateVictim', victimController.updateVictimByKey);
router.delete('/deleteVictim', victimController.deleteVictimByKey);

//api for reports
const reportController = require('../controllers/ReportController');
router.get('/getLatestReport', reportController.getLatestReport);
router.get('/getReportStatistic', reportController.getReportStatistic);
router.get('/getReports', reportController.getReports);
router.post('/createReport', reportController.createReport);
router.put('/updateReport', reportController.updateReportByKey);
router.delete('/deleteReport', reportController.deleteReportByKey);

//api for campaigns
const campaignController = require('../controllers/CampaignController');
router.get('/campaigns', campaignController.getCampaigns);
router.get('/getCampaignByKey', campaignController.getCampaignByKey);
router.get('/updateCampaignRemaining', campaignController.updateCampaignRemaining);
router.post('/createCampaign', campaignController.createCampaign);
router.put('/updateCampaign', campaignController.updateCampaignByKey);
router.delete('/deleteCampaign', campaignController.deleteCampaignByKey);

//api for user management
const userManagementController = require('../controllers/UserManagementController');
router.get('/getAllUserManagement', userManagementController.getUserManagement);
router.get('/getUserManagementByKey', userManagementController.getUserManagementByKey);
router.post('/createUserManagement', userManagementController.createNewUserManagement);
router.put('/updateUserManagement', userManagementController.updateUserManagementByKey);
router.delete('/deleteUserManagement', userManagementController.deleteUserManagementByKey);

//api for feedback:
const feedbackController = require('../controllers/FeedbackController');
router.get('/getFeedbackStatistic', feedbackController.getFeedbackStatistic);
router.get('/getFeedbacks', feedbackController.getAllFeedback);
router.post('/createFeedback', feedbackController.createFeedback);
router.delete('/deleteFeedback', CheckRole([1]), feedbackController.deleteFeedback);

//api for private Heatmap:
router.get('/getHeatmapByPK', heatmapController.getHeatmapByPK);
router.post('/createHeatmap', CheckRole([1]), heatmapController.createHeatmap);
router.put('/updateHeatmap', CheckRole([1]), heatmapController.updateHeatmap);
router.delete('/deleteHeatmap', CheckRole([1]), heatmapController.deleteHeatmap);

//api for private Newfeeds:
router.post('/getTitles', CheckRole([1]), newfeedController.getTitle);
router.post('/getContent', CheckRole([1]), newfeedController.getContent);
router.post('/createNewsfeed', CheckRole([1]), newfeedController.createNewsfeed);
router.put('/updateNewsfeed', CheckRole([1]), newfeedController.updateNewsfeed);
router.delete('/deleteNewsfeed', CheckRole([1]), newfeedController.deleteNewsfeed);

//api for Newfeeds Comments:
const newfeedCommentController = require('../controllers/NewsfeedCommentController');
router.get('/getNewsfeedComments', newfeedCommentController.getNewsfeedComments);
router.post('/createNewsfeedComment', newfeedCommentController.createNewsfeedComment);
router.delete('/deleteNewsfeedComment', newfeedCommentController.deleteNewsfeedComment);




module.exports = router