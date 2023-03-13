const Role = require('../models/roles');
const AppUser = require('../models/app_user');
const Appointment = require('../models/appointments');
const AppSetting = require('../models/AppSettings');
const Berichtenarchief = require('../models/berichtenarchief');
const Brochures = require('../models/brochures');
const Client_portal_data = require('../models/client_portal_data');
const Employee = require('../models/employee');
const Enquete = require('../models/enquete');
const Favourite = require('../models/favourites');
const Kantoor = require('../models/kantoor');
const Login = require('../models/logins');
const Meersortering = require('../models/meersortering');
const Overons_sortering = require('../models/overons_sortering');
const Pagina = require('../models/Pagina');
const PhotoGallery = require('../models/photogallery');
const Question = require('../models/questions');
const Quotation = require('../models/quotations');
const Recommendation = require('../models/recommendations');
const Sector = require('../models/sector');
const SelectOption = require('../models/select_options');
const Setting = require('../models/Settings');
const SocialMedia = require('../models/social_media');
const TargetGroup = require('../models/targetgroup');
const Topic = require('../models/topics');
const TotalEmployee = require('../models/totalemployees');
const Video = require('../models/videos');
const WebPage = require('../models/webpage');
const Woning = require('../models/woning');
const RolePermission = require('../models/role_permissions');
const Department = require('../models/department');
const ExternalLink = require('../models/externalLink');
const FixedExtraWork = require('../models/fixedExtraWork');
const HelpAndSupport = require('../models/helpAndSupport');
const ImprovementSuggestions = require('../models/improvementSuggestions');
const Leave = require('../models/leave');
const News = require('../models/news');
const PrivacyPolicy = require('../models/privacyPolicy');
const Reaction = require('../models/reaction');
const Region = require('../models/region');
const Signaling = require('../models/signaling');
const Subject = require('../models/subject');
const TempExtraWork = require('../models/tempExtraWork');
const Todo = require('../models/todo');
const Vacancies = require('../models/vacancies');
const Wish = require('../models/wish');
//NEW COLLECTIONS
const FlutterSettings = require('../models/flutterSettings');
const Events = require('../models/events');
const AroundUs = require('../models/aroundUs');
const Blogs = require('../models/blogs');
const ActueelNews = require('../models/actueelNews');
const Kennisbanken = require('../models/kennisbanken');


module.exports = function (req, res, next) {
  if (req.query.createdNewDB == 'true' && (!req.query.isAutoMigrate || req.query.isAutoMigrate == 'true')) {
    //console.log("auto migrate createdNewDB: "+req.query.createdNewDB);
    var conn = req.connection;

    ///
    // check for the role_permissions if not exist then createSchema and with required defaults fields
    let role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    role_permissions1.findOne({}).then(permissions => {
      if (!permissions) {
        migrateRolePermissions(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    //end
    //

    // check for app_user if not exist than createSchema and with required defaults fields
    var appUser1 = conn.model('app_user', AppUser.schema);
    appUser1.findOne({}).then(appUsr => {
      if (!appUsr) {
        migrateAppUser(conn);
      }
      //console.log(" serviceUserData");
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Appuser schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateAppUser(conn) {
      var appUser2 = conn.model('app_user', AppUser.schema);
      var appUser3 = new appUser2();
      appUser3.save(function (err, succ) {
        var Id = succ.Id;
        appUser2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of AppUser

    // check for appointments if not exist than createSchema and with required defaults fields
    var Appointments1 = conn.model('appointments', Appointment.schema);
    Appointments1.findOne({}).then(appoint1 => {
      if (!appoint1) {
        migrateAppointments(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Appointments schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateAppointments(conn) {
      var appointments1 = conn.model('appointments', Appointment.schema);
      var appointments3 = new appointments1();
      appointments3.save(function (err, succ) {
        var Id = succ.Id;
        appointments1.remove({ Id: Id }, function (errR, sRes) { })
      });
    }

    // check for AppSettings if not exist than createSchema and with required defaults fields
    var AppSetting1 = conn.model('AppSettings', AppSetting.schema);
    AppSetting1.findOne({}).then(appSettingRes => {
      if (!appSettingRes) {
        migrateAppSettings(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "AppSettings schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateAppSettings(conn) {
      var AppSetting2 = conn.model('AppSettings', AppSetting.schema);
      var AppSetting3 = new AppSetting2();
      AppSetting3.save(function (err, succ) {
        var Id = succ.Id;
        AppSetting2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of AppSettings

    // check for Berichtenarchief if not exist than createSchema and with required defaults fields
    var berichtenarchief1 = conn.model('berichtenarchief', Berichtenarchief.schema);
    berichtenarchief1.findOne({}).then(berichtenarchiefRes => {
      if (!berichtenarchiefRes) {
        migrateBerichtenarchief(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Berichtenarchief schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateBerichtenarchief(conn) {
      var berichtenarchief2 = conn.model('berichtenarchief', Berichtenarchief.schema);
      var berichtenarchief3 = new berichtenarchief2();
      berichtenarchief3.save(function (err, succ) {
        var Id = succ.Id;
        berichtenarchief2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Berichtenarchief

    // check for Berichtenarchief if not exist than createSchema and with required defaults fields
    var brochures1 = conn.model('brochures', Brochures.schema);
    brochures1.findOne({}).then(brochuresRes => {
      if (!brochuresRes) {
        migrateBrochures(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Brochures schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateBrochures(conn) {
      var brochures2 = conn.model('brochures', Brochures.schema);
      var brochures3 = new brochures2();
      brochures3.save(function (err, succ) {
        var Id = succ.Id;
        brochures2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Berichtenarchief

    // check for Client_portal_data if not exist than createSchema and with required defaults fields
    var client_portal_data1 = conn.model('client_portal_data', Client_portal_data.schema);
    client_portal_data1.findOne({}).then(client_portal_dataRes => {
      if (!client_portal_dataRes) {
        migrateClient_portal_data(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Client_portal_data schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateClient_portal_data(conn) {
      var client_portal_data2 = conn.model('client_portal_data', Client_portal_data.schema);
      var client_portal_data3 = new client_portal_data2();
      client_portal_data3.save(function (err, succ) {
        var Id = succ.Id;
        client_portal_data2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of  Client_portal_data

    // check for Employee if not exist than createSchema and with required defaults fields
    var employee1 = conn.model('employee', Employee.schema);
    employee1.findOne({}).then(employeeRes => {
      if (!employeeRes) {
        migrateEmployees(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateEmployees(conn) {
      var employee2 = conn.model('employee', Employee.schema);
      var employee3 = new employee2();
      employee3.save(function (err, succ) {
        var Id = succ.Id;
        employee2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Employee

    // check for enquete if not exist than createSchema and with required defaults fields
    var enquete1 = conn.model('enquete', Enquete.schema);
    enquete1.findOne({}).then(enqueteRes => {
      if (!enqueteRes) {
        migrateEnquetes(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "enquete schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateEnquetes(conn) {
      var enquete2 = conn.model('enquete', Enquete.schema);
      var enquete3 = new enquete2();
      enquete3.save(function (err, succ) {
        var Id = succ.Id;
        enquete2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of enquete

    // check for Favourite if not exist than createSchema and with required defaults fields
    var favourites1 = conn.model('favourites', Favourite.schema);
    favourites1.findOne({}).then(favouriteRes => {
      if (!favouriteRes) {
        migrateFavourites(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Favourite schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateFavourites(conn) {
      var favourites2 = conn.model('favourites', Favourite.schema);
      var favourites3 = new favourites2();
      favourites3.save(function (err, succ) {
        var Id = succ.Id;
        favourites2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Favourite

    // check for kantoor if not exist than createSchema and with required defaults fields
    var kantoor1 = conn.model('kantoor', Kantoor.schema);
    kantoor1.findOne({}).then(kantoorRes => {
      if (!kantoorRes) {
        migrateKantoor(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "kantoor schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateKantoor(conn) {
      var kantoor2 = conn.model('kantoor', Kantoor.schema);
      var kantoor3 = new kantoor2();
      kantoor3.save(function (err, succ) {
        var Id = succ.Id;
        kantoor2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of kantoor

    // check for logins if not exist than createSchema and with required defaults fields
    var logins1 = conn.model('logins', Login.schema);
    logins1.findOne({}).then(loginsRes => {
      if (!loginsRes) {
        migrateLogins(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "logins schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateLogins(conn) {
      var logins2 = conn.model('logins', Login.schema);
      var logins3 = new logins2();
      logins3.save(function (err, succ) {
        var Id = succ.Id;
        logins2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of logins


    // check for meersortering if not exist than createSchema and with required defaults fields
    var meersortering1 = conn.model('meersortering', Meersortering.schema);
    meersortering1.findOne({}).then(meersorteringRes => {
      if (!meersorteringRes) {
        migrateMeersortering(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "meersortering schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateMeersortering(conn) {
      var meersortering2 = conn.model('meersortering', Meersortering.schema);
      var meersortering3 = new meersortering2();
      meersortering3.save(function (err, succ) {
        var Id = succ.Id;
        meersortering2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of meersortering

    // check for Overons_sortering if not exist than createSchema and with required defaults fields
    var overons_sortering1 = conn.model('overons_sortering', Overons_sortering.schema);
    overons_sortering1.findOne({}).then(overons_sorteringRes => {
      if (!overons_sorteringRes) {
        migrateOverons_sortering(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Overons_sortering schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateOverons_sortering(conn) {
      var overons_sortering2 = conn.model('overons_sortering', Overons_sortering.schema);
      var overons_sortering3 = new overons_sortering2();
      overons_sortering3.save(function (err, succ) {
        var Id = succ.Id;
        overons_sortering2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Overons_sortering

    // check for Pagina if not exist than createSchema and with required defaults fields
    var pagina1 = conn.model('Pagina', Pagina.schema);
    pagina1.findOne({}).then(paginaRes => {
      if (!paginaRes) {
        migratePagina(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Pagina schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migratePagina(conn) {
      var pagina2 = conn.model('Pagina', Pagina.schema);
      var pagina3 = new pagina2();
      pagina3.save(function (err, succ) {
        var Id = succ.Id;
        pagina2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Pagina

    // check for photogallery if not exist than createSchema and with required defaults fields
    var photogallery1 = conn.model('photogallery', PhotoGallery.schema);
    photogallery1.findOne({}).then(photogalleryRes => {
      if (!photogalleryRes) {
        migratePhotoGalleries(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "photogallery schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migratePhotoGalleries(conn) {
      var photogallery2 = conn.model('photogallery', PhotoGallery.schema);
      var photogallery3 = new photogallery2();
      photogallery3.save(function (err, succ) {
        var Id = succ.Id;
        photogallery2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of photogallery

    // check for question if not exist than createSchema and with required defaults fields
    var question1 = conn.model('questions', Question.schema);
    question1.findOne({}).then(questionRes => {
      if (!questionRes) {
        migrateQuestions(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "question schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateQuestions(conn) {
      var question2 = conn.model('questions', Question.schema);
      var question3 = new question2();
      question3.save(function (err, succ) {
        var Id = succ.Id;
        question2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of question

    // check for Quotation if not exist than createSchema and with required defaults fields
    var quotations1 = conn.model('quotations', Quotation.schema);
    quotations1.findOne({}).then(quotationRes => {
      if (!quotationRes) {
        migrateQuotations(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Quotation schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateQuotations(conn) {
      var quotations2 = conn.model('quotations', Quotation.schema);
      var quotations3 = new quotations2();
      quotations3.save(function (err, succ) {
        var Id = succ.Id;
        quotations2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of quotations

    // check for Recommendation if not exist than createSchema and with required defaults fields
    var recommendation1 = conn.model('recommendations', Recommendation.schema);
    recommendation1.findOne({}).then(recommendationRes => {
      if (!recommendationRes) {
        migrateRecommendations(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Recommendation schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateRecommendations(conn) {
      var recommendation2 = conn.model('recommendations', Recommendation.schema);
      var recommendation3 = new recommendation2();
      recommendation3.save(function (err, succ) {
        var Id = succ.Id;
        recommendation2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Recommendation

    // check for sector if not exist than createSchema and with required defaults fields
    var sector1 = conn.model('sector', Sector.schema);
    sector1.findOne({}).then(sectorRes => {
      if (!sectorRes) {
        migrateSectors(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "sector schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSectors(conn) {
      var sector2 = conn.model('sector', Sector.schema);
      var sector3 = new sector2();
      sector3.save(function (err, succ) {
        var Id = succ.Id;
        sector2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of sector

    // check for select_options if not exist than createSchema and with required defaults fields
    var select_options1 = conn.model('select_options', SelectOption.schema);
    select_options1.findOne({}).then(select_optionsRes => {
      if (!select_optionsRes) {
        migrateSelectOptions(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "SelectOptions schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSelectOptions(conn) {
      var select_options2 = conn.model('select_options', SelectOption.schema);
      var select_options3 = new select_options2();
      select_options3.save(function (err, succ) {
        var Id = succ.Id;
        select_options2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of select_options

    // check for Settings if not exist than createSchema and with required defaults fields
    var setting1 = conn.model('Settings', Setting.schema);
    setting1.findOne({}).then(settingRes => {
      if (!settingRes) {
        migrateSettings(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Settings schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSettings(conn) {
      var setting2 = conn.model('Settings', Setting.schema);
      var setting3 = new setting2();
      setting3.save(function (err, succ) {
        var Id = succ.Id;
        setting2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Settings

    // check for SocialMedia if not exist than createSchema and with required defaults fields
    var social_media1 = conn.model('social_media', SocialMedia.schema);
    social_media1.findOne({}).then(social_mediaRes => {
      if (!social_mediaRes) {
        migrateSocialMedia(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "SocialMedia schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSocialMedia(conn) {
      var social_media2 = conn.model('social_media', SocialMedia.schema);
      var social_media3 = new social_media2();
      social_media3.save(function (err, succ) {
        var Id = succ.Id;
        social_media2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of SocialMedia

    // check for TargetGroup if not exist than createSchema and with required defaults fields
    var targetgroup1 = conn.model('targetgroup', TargetGroup.schema);
    targetgroup1.findOne({}).then(targetgroupRes => {
      if (!targetgroupRes) {
        migrateTargetGroup(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "TargetGroup schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateTargetGroup(conn) {
      var targetgroup2 = conn.model('targetgroup', TargetGroup.schema);
      var targetgroup3 = new targetgroup2();
      targetgroup3.save(function (err, succ) {
        var Id = succ.Id;
        targetgroup2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of TargetGroup

    // check for Topic if not exist than createSchema and with required defaults fields
    var topics1 = conn.model('topics', Topic.schema);
    topics1.findOne({}).then(topicsRes => {
      if (!topicsRes) {
        migrateTopics(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "TargetGroup schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateTopics(conn) {
      var topics2 = conn.model('topics', Topic.schema);
      var topics3 = new topics2();
      topics3.save(function (err, succ) {
        var Id = succ.Id;
        topics2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Topic

    // check for TotalEmployee if not exist than createSchema and with required defaults fields
    var totalemployees1 = conn.model('totalemployees', TotalEmployee.schema);
    totalemployees1.findOne({}).then(totalemployeesRes => {
      if (!totalemployeesRes) {
        migrateTotalEmployee(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "TotalEmployee schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateTotalEmployee(conn) {
      var totalemployees2 = conn.model('totalemployees', TotalEmployee.schema);
      var totalemployees3 = new totalemployees2();
      totalemployees3.save(function (err, succ) {
        var Id = succ.Id;
        totalemployees2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of TotalEmployee

    // check for Video if not exist than createSchema and with required defaults fields
    var videos1 = conn.model('videos', Video.schema);
    videos1.findOne({}).then(videosRes => {
      if (!videosRes) {
        migrateVideos(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "TotalEmployee schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateVideos(conn) {
      var videos2 = conn.model('videos', Video.schema);
      var videos3 = new videos2();
      videos3.save(function (err, succ) {
        var Id = succ.Id;
        videos2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Video

    // check for WebPage if not exist than createSchema and with required defaults fields
    var webpage1 = conn.model('webpage', WebPage.schema);
    webpage1.findOne({}).then(webpageRes => {
      if (!webpageRes) {
        migrateWebPage(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });

    function migrateWebPage(conn) {
      var webpage2 = conn.model('webpage', WebPage.schema);
      var webpage3 = new webpage2();
      webpage3.save(function (err, succ) {
        var Id = succ.Id;
        webpage2.remove({ Id: Id }, function (errR, sRes) { })
      });

    }
    // end migration of WebPage

    // check for Woning if not exist than createSchema and with required defaults fields
    var woning1 = conn.model('woning', Woning.schema);
    woning1.findOne({}).then(woningRes => {
      if (!woningRes) {
        migrateWoning(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });

    function migrateWoning(conn) {
      var woning2 = conn.model('woning', Woning.schema);
      var woning3 = new woning2();
      woning3.save(function (err, succ) {
        var Id = succ.Id;
        woning2.remove({ Id: Id }, function (errR, sRes) { })
      });

    }

    // NEW COLLECTIONS START

    // check for flutterSettings if not exist than createSchema and with required defaults fields
    var flutterSettings1 = conn.model('flutterSettings', FlutterSettings.schema);
    flutterSettings1.findOne({}).then(res => {
      if (!res) {
        migrateFlutterSettings(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateFlutterSettings(conn) {
      var flutterSettings2 = conn.model('flutterSettings', WebPage.schema);
      var flutterSettings3 = new flutterSettings2();
      flutterSettings3.save(function (err, succ) {
        var Id = succ.Id;
        flutterSettings2.remove({ Id: Id }, function (errR, sRes) { })
      });

    }
    // end migration of flutterSettings

    // check for flutterSettings if not exist than createSchema and with required defaults fields
    var flutterSettings1 = conn.model('flutterSettings', FlutterSettings.schema);
    flutterSettings1.findOne({}).then(res => {
      if (!res) {
        migrateFlutterSettings(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateFlutterSettings(conn) {
      var flutterSettings2 = conn.model('flutterSettings', FlutterSettings.schema);
      var flutterSettings3 = new flutterSettings2();
      flutterSettings3.save(function (err, succ) {
        var Id = succ.Id;
        flutterSettings2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of flutterSettings


    // check for AroundUs if not exist than createSchema and with required defaults fields
    var aroundUs1 = conn.model('aroundUs', AroundUs.schema);
    aroundUs1.findOne({}).then(res => {
      if (!res) {
        migrateAroundUs(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateAroundUs(conn) {
      var aroundUs2 = conn.model('aroundUs', AroundUs.schema);
      var aroundUs3 = new aroundUs2();
      aroundUs3.save(function (err, succ) {
        var Id = succ.Id;
        aroundUs2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of AroundUs

    // check for Events if not exist than createSchema and with required defaults fields
    var events1 = conn.model('events', Events.schema);
    events1.findOne({}).then(res => {
      if (!res) {
        migrateEvents(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateEvents(conn) {
      var events2 = conn.model('events', Events.schema);
      var events3 = new events2();
      events3.save(function (err, succ) {
        var Id = succ.Id;
        events2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Events

    // check for blogs if not exist than createSchema and with required defaults fields
    var blogs1 = conn.model('blogs', Blogs.schema);
    blogs1.findOne({}).then(res => {
      if (!res) {
        migrateBlogs(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateBlogs(conn) {
      var blogs2 = conn.model('blogs', Blogs.schema);
      var blogs3 = new blogs2();
      blogs3.save(function (err, succ) {
        var Id = succ.Id;
        blogs2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of blogs

    // check for Kennisbanken if not exist than createSchema and with required defaults fields
    var kennisbanken1 = conn.model('kennisbanken', Kennisbanken.schema);
    kennisbanken1.findOne({}).then(res => {
      if (!res) {
        migrateKennisbanken(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateKennisbanken(conn) {
      var kennisbanken2 = conn.model('kennisbanken', Kennisbanken.schema);
      var kennisbanken3 = new kennisbanken2();
      kennisbanken3.save(function (err, succ) {
        var Id = succ.Id;
        kennisbanken2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of kennisbanken

    // check for actueelNews if not exist than createSchema and with required defaults fields
    var actueelNews1 = conn.model('actueelNews', ActueelNews.schema);
    actueelNews1.findOne({}).then(res => {
      if (!res) {
        migrateActueelNews(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });
    function migrateActueelNews(conn) {
      var actueelNews2 = conn.model('actueelNews', ActueelNews.schema);
      var actueelNews3 = new actueelNews2();
      actueelNews3.save(function (err, succ) {
        var Id = succ.Id;
        actueelNews2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of actueelNews

    // NEW COLLECTIONS END

    // // check for the role_permissions if not exist then createSchema and with required defaults fields
    // let role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    // role_permissions1.findOne({}).then(permissions => {
    //   if (!permissions) {
    //     migrateRolePermissions(conn);
    //   }
    // }).catch(err => {
    //   return res.status(500).send({ error: { statusCode: 500, message: err } });
    // });
    // //end

    function migrateRolePermissions(conn) {
      let Role1 = conn.model('roles', Role.schema);
      Role1.findOne({ Name: 'Res' }, function (error, sRole) {
        let role_id = sRole.Id;
        const resTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "app_user": { "read": true, "create": true, "update": true, "delete": true },
            "appointments": { "read": true, "create": true, "update": true, "delete": true },
            "AppSettings": { "read": true, "create": true, "update": true, "delete": true },
            "berichtenarchief": { "read": true, "create": true, "update": true, "delete": true },
            "brochures": { "read": true, "create": true, "update": true, "delete": true },
            "client_portal_data": { "read": true, "create": true, "update": true, "delete": true },
            "employee": { "read": true, "create": true, "update": true, "delete": true },
            "enquete": { "read": true, "create": true, "update": true, "delete": true },
            "favourites": { "read": true, "create": true, "update": true, "delete": true },
            "kantoor": { "read": true, "create": true, "update": true, "delete": true },
            "logins": { "read": true, "create": true, "update": true, "delete": true },
            "meersortering": { "read": true, "create": true, "update": true, "delete": true },
            "overons_sortering": { "read": true, "create": true, "update": true, "delete": true },
            "Pagina": { "read": true, "create": true, "update": true, "delete": true },
            "photogallery": { "read": true, "create": true, "update": true, "delete": true },
            "questions": { "read": true, "create": true, "update": true, "delete": true },
            "quotations": { "read": true, "create": true, "update": true, "delete": true },
            "recommendations": { "read": true, "create": true, "update": true, "delete": true },
            "role_permissions": { "read": true, "create": true, "update": true, "delete": true },
            "roles": { "read": true, "create": true, "update": true, "delete": true },
            "sector": { "read": true, "create": true, "update": true, "delete": true },
            "select_options": { "read": true, "create": true, "update": true, "delete": true },
            "Settings": { "read": true, "create": true, "update": true, "delete": true },
            "social_media": { "read": true, "create": true, "update": true, "delete": true },
            "targetgroup": { "read": true, "create": true, "update": true, "delete": true },
            "topics": { "read": true, "create": true, "update": true, "delete": true },
            "totalemployees": { "read": true, "create": true, "update": true, "delete": true },
            "users": { "read": true, "create": true, "update": true, "delete": true },
            "videos": { "read": true, "create": true, "update": true, "delete": true },
            "webpage": { "read": true, "create": true, "update": true, "delete": true },
            "flutterSettings": { "read": true, "create": true, "update": true, "delete": true },
            "aroundUs": { "read": true, "create": true, "update": true, "delete": true },
            "events": { "read": true, "create": true, "update": true, "delete": true },
            "blogs": { "read": true, "create": true, "update": true, "delete": true },
            "actueelNews": { "read": true, "create": true, "update": true, "delete": true },
            "kennisbanken": { "read": true, "create": true, "update": true, "delete": true }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(resTablesAndPermissions);
        role_permissions3.save();
      })

      // Registered role
      Role1.findOne({ Name: 'Registered' }, function (error, sRole) {
        let role_id = sRole.Id;
        const registeredUserTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "app_user": { "read": true, "create": true, "update": true, "delete": true },
            "appointments": { "read": true, "create": true, "update": true, "delete": true },
            "AppSettings": { "read": true, "create": true, "update": true, "delete": true },
            "berichtenarchief": { "read": true, "create": true, "update": true, "delete": true },
            "brochures": { "read": true, "create": true, "update": true, "delete": true },
            "client_portal_data": { "read": true, "create": true, "update": true, "delete": true },
            "employee": { "read": true, "create": true, "update": true, "delete": true },
            "enquete": { "read": true, "create": true, "update": true, "delete": true },
            "favourites": { "read": true, "create": true, "update": true, "delete": true },
            "kantoor": { "read": true, "create": true, "update": true, "delete": true },
            "logins": { "read": true, "create": true, "update": true, "delete": true },
            "meersortering": { "read": true, "create": true, "update": true, "delete": true },
            "overons_sortering": { "read": true, "create": true, "update": true, "delete": true },
            "Pagina": { "read": true, "create": true, "update": true, "delete": true },
            "photogallery": { "read": true, "create": true, "update": true, "delete": true },
            "questions": { "read": true, "create": true, "update": true, "delete": true },
            "quotations": { "read": true, "create": true, "update": true, "delete": true },
            "recommendations": { "read": true, "create": true, "update": true, "delete": true },
            "role_permissions": { "read": true, "create": true, "update": true, "delete": true },
            "roles": { "read": true, "create": true, "update": true, "delete": true },
            "sector": { "read": true, "create": true, "update": true, "delete": true },
            "select_options": { "read": true, "create": true, "update": true, "delete": true },
            "Settings": { "read": true, "create": true, "update": true, "delete": true },
            "social_media": { "read": true, "create": true, "update": true, "delete": true },
            "targetgroup": { "read": true, "create": true, "update": true, "delete": true },
            "topics": { "read": true, "create": true, "update": true, "delete": true },
            "totalemployees": { "read": true, "create": true, "update": true, "delete": true },
            "users": { "read": true, "create": true, "update": true, "delete": true },
            "videos": { "read": true, "create": true, "update": true, "delete": true },
            "webpage": { "read": true, "create": true, "update": true, "delete": true },
            "flutterSettings": { "read": true, "create": true, "update": true, "delete": true },
            "aroundUs": { "read": true, "create": true, "update": true, "delete": true },
            "events": { "read": true, "create": true, "update": true, "delete": true },
            "blogs": { "read": true, "create": true, "update": true, "delete": true },
            "actueelNews": { "read": true, "create": true, "update": true, "delete": true },
            "kennisbanken": { "read": true, "create": true, "update": true, "delete": true }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(registeredUserTablesAndPermissions);
        role_permissions3.save();
      })

      // also for app_user
      Role1.findOne({ Name: 'app_user' }, function (error, sRole) {
        let role_id = sRole.Id;
        const appUserTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "app_user": { "read": false, "create": true, "update": false, "delete": false },
            "appointments": { "read": false, "create": true, "update": false, "delete": false },
            "AppSettings": { "read": true, "create": false, "update": false, "delete": false },
            "berichtenarchief": { "read": true, "create": false, "update": false, "delete": false },
            "brochures": { "read": true, "create": false, "update": false, "delete": false },
            "client_portal_data": { "read": false, "create": true, "update": false, "delete": false },
            "employee": { "read": true, "create": false, "update": false, "delete": false },
            "enquete": { "read": false, "create": true, "update": false, "delete": false },
            "favourites": { "read": false, "create": true, "update": false, "delete": false },
            "kantoor": { "read": true, "create": false, "update": false, "delete": false },
            "logins": { "read": true, "create": false, "update": false, "delete": false },
            "meersortering": { "read": true, "create": false, "update": false, "delete": false },
            "overons_sortering": { "read": true, "create": false, "update": false, "delete": false },
            "Pagina": { "read": true, "create": false, "update": false, "delete": false },
            "photogallery": { "read": true, "create": false, "update": false, "delete": false },
            "questions": { "read": false, "create": true, "update": true, "delete": false },
            "quotations": { "read": false, "create": true, "update": true, "delete": false },
            "recommendations": { "read": true, "create": false, "update": false, "delete": false },
            "role_permissions": { "read": false, "create": false, "update": false, "delete": false },
            "roles": { "read": false, "create": false, "update": false, "delete": false },
            "sector": { "read": true, "create": false, "update": false, "delete": false },
            "select_options": { "read": true, "create": false, "update": false, "delete": false },
            "Settings": { "read": true, "create": false, "update": false, "delete": false },
            "social_media": { "read": true, "create": false, "update": false, "delete": false },
            "targetgroup": { "read": true, "create": false, "update": false, "delete": false },
            "topics": { "read": true, "create": false, "update": false, "delete": false },
            "totalemployees": { "read": true, "create": false, "update": false, "delete": false },
            "users": { "read": true, "create": false, "update": true, "delete": false },
            "videos": { "read": true, "create": false, "update": false, "delete": false },
            "webpage": { "read": true, "create": false, "update": false, "delete": false },
            "flutterSettings": { "read": true, "create": false, "update": false, "delete": false },
            "aroundUs": { "read": true, "create": false, "update": false, "delete": false },
            "events": { "read": true, "create": false, "update": false, "delete": false },
            "blogs": { "read": true, "create": false, "update": false, "delete": false },
            "actueelNews": { "read": true, "create": false, "update": false, "delete": false },
            "kennisbanken": { "read": true, "create": false, "update": false, "delete": false }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(appUserTablesAndPermissions);
        role_permissions3.save();

      })

    }

    // if (!res.headersSent) {
    //   next();
    //   return;
    // }

    if (!res.headersSent) {
      setTimeout(() => {
        next();
        return;
      }, 10000);
    }

  } else if (req.query.createdNewDB == 'true' && req.query.isAutoMigrate == 'false') {
    var conn = req.connection;

    // check for app_user if not exist than createSchema and with required defaults fields
    var appUser1 = conn.model('app_user', AppUser.schema);
    appUser1.findOne({}).then(appUsr => {
      if (!appUsr) {
        migrateAppUser(conn);
      }
      //console.log(" serviceUserData");
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Appuser schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateAppUser(conn) {
      var appUser2 = conn.model('app_user', AppUser.schema);
      var appUser3 = new appUser2();
      appUser3.save(function (err, succ) {
        var Id = succ.Id;
        appUser2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of AppUser

    // check for AppSettings if not exist than createSchema and with required defaults fields
    var AppSetting1 = conn.model('AppSettings', AppSetting.schema);
    AppSetting1.findOne({}).then(appSettingRes => {
      if (!appSettingRes) {
        migrateAppSettings(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "AppSettings schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateAppSettings(conn) {
      var AppSetting2 = conn.model('AppSettings', AppSetting.schema);
      var AppSetting3 = new AppSetting2();
      AppSetting3.save(function (err, succ) {
        var Id = succ.Id;
        AppSetting2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of AppSettings

    // check for Employee if not exist than createSchema and with required defaults fields
    var employee1 = conn.model('employee', Employee.schema);
    employee1.findOne({}).then(employeeRes => {
      if (!employeeRes) {
        migrateEmployees(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateEmployees(conn) {
      var employee2 = conn.model('employee', Employee.schema);
      var employee3 = new employee2();
      employee3.save(function (err, succ) {
        var Id = succ.Id;
        employee2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of Employee

    // check for department if not exist than createSchema and with required defaults fields
    var department1 = conn.model('department', Department.schema);
    department1.findOne({}).then(departmentRes => {
      if (!departmentRes) {
        migrateDepartment(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateDepartment(conn) {
      var department2 = conn.model('department', Department.schema);
      var department3 = new department2();
      department3.save(function (err, succ) {
        var Id = succ.Id;
        department2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of department



    // check for externalLink if not exist than createSchema and with required defaults fields
    var externalLink1 = conn.model('externalLink', ExternalLink.schema);
    externalLink1.findOne({}).then(externalLinkRes => {
      if (!externalLinkRes) {
        migrateExternalLink(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateExternalLink(conn) {
      var externalLink2 = conn.model('externalLink', ExternalLink.schema);
      var externalLink3 = new externalLink2();
      externalLink3.save(function (err, succ) {
        var Id = succ.Id;
        externalLink2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of externalLink

    // check for fixedExtraWork if not exist than createSchema and with required defaults fields
    var fixedExtraWork1 = conn.model('fixedExtraWork', FixedExtraWork.schema);
    fixedExtraWork1.findOne({}).then(fixedExtraWorkRes => {
      if (!fixedExtraWorkRes) {
        migrateFixedExtraWork(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateFixedExtraWork(conn) {
      var fixedExtraWork2 = conn.model('fixedExtraWork', FixedExtraWork.schema);
      var fixedExtraWork3 = new fixedExtraWork2();
      fixedExtraWork3.save(function (err, succ) {
        var Id = succ.Id;
        fixedExtraWork2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of externalLink


    // check for fixedExtraWork if not exist than createSchema and with required defaults fields
    var fixedExtraWork1 = conn.model('fixedExtraWork', FixedExtraWork.schema);
    fixedExtraWork1.findOne({}).then(fixedExtraWorkRes => {
      if (!fixedExtraWorkRes) {
        migrateFixedExtraWork(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateFixedExtraWork(conn) {
      var fixedExtraWork2 = conn.model('fixedExtraWork', FixedExtraWork.schema);
      var fixedExtraWork3 = new fixedExtraWork2();
      fixedExtraWork3.save(function (err, succ) {
        var Id = succ.Id;
        fixedExtraWork2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of fixedExtraWork

    // check for helpAndSupport if not exist than createSchema and with required defaults fields
    var helpAndSupport1 = conn.model('helpAndSupport', HelpAndSupport.schema);
    helpAndSupport1.findOne({}).then(helpAndSupportRes => {
      if (!helpAndSupportRes) {
        migrateHelpAndSupport(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateHelpAndSupport(conn) {
      var helpAndSupport2 = conn.model('helpAndSupport', HelpAndSupport.schema);
      var helpAndSupport3 = new helpAndSupport2();
      helpAndSupport3.save(function (err, succ) {
        var Id = succ.Id;
        helpAndSupport2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of helpAndSupport

    // check for improvementSuggestions if not exist than createSchema and with required defaults fields
    var improvementSuggestions1 = conn.model('improvementSuggestions', ImprovementSuggestions.schema);
    improvementSuggestions1.findOne({}).then(improvementSuggestionsRes => {
      if (!improvementSuggestionsRes) {
        migrateImprovementSuggestions(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateImprovementSuggestions(conn) {
      var improvementSuggestions2 = conn.model('improvementSuggestionsRes', ImprovementSuggestions.schema);
      var improvementSuggestions3 = new improvementSuggestions2();
      improvementSuggestions3.save(function (err, succ) {
        var Id = succ.Id;
        improvementSuggestions2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of improvementSuggestions

    // check for leave if not exist than createSchema and with required defaults fields
    var leave1 = conn.model('leave', Leave.schema);
    leave1.findOne({}).then(leaveRes => {
      if (!leaveRes) {
        migrateLeave(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateLeave(conn) {
      var leave2 = conn.model('leave', Leave.schema);
      var leave3 = new leave2();
      leave3.save(function (err, succ) {
        var Id = succ.Id;
        leave2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of leave


    // check for news if not exist than createSchema and with required defaults fields
    var news1 = conn.model('news', News.schema);
    news1.findOne({}).then(newsRes => {
      if (!newsRes) {
        migrateNews(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateNews(conn) {
      var news2 = conn.model('news', News.schema);
      var news3 = new news2();
      news3.save(function (err, succ) {
        var Id = succ.Id;
        news2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of news

    // check for privacyPolicy if not exist than createSchema and with required defaults fields
    var privacyPolicy1 = conn.model('privacyPolicy', PrivacyPolicy.schema);
    privacyPolicy1.findOne({}).then(privacyPolicyRes => {
      if (!privacyPolicyRes) {
        migratePrivacyPolicy(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migratePrivacyPolicy(conn) {
      var privacyPolicy2 = conn.model('privacyPolicy', PrivacyPolicy.schema);
      var privacyPolicy3 = new privacyPolicy2();
      privacyPolicy3.save(function (err, succ) {
        var Id = succ.Id;
        privacyPolicy2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of privacyPolicy

    // check for reaction if not exist than createSchema and with required defaults fields
    var reaction1 = conn.model('reaction', Reaction.schema);
    reaction1.findOne({}).then(reactionRes => {
      if (!reactionRes) {
        migrateReaction(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateReaction(conn) {
      var reaction2 = conn.model('reaction', Reaction.schema);
      var reaction3 = new reaction2();
      reaction3.save(function (err, succ) {
        var Id = succ.Id;
        reaction2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of reaction

    // check for region if not exist than createSchema and with required defaults fields
    var region1 = conn.model('region', Region.schema);
    region1.findOne({}).then(regionRes => {
      if (!regionRes) {
        migrateRegion(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateRegion(conn) {
      var region2 = conn.model('region', Region.schema);
      var region3 = new region2();
      region3.save(function (err, succ) {
        var Id = succ.Id;
        region2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of region


    // check for signaling if not exist than createSchema and with required defaults fields
    var signaling1 = conn.model('signaling', Signaling.schema);
    signaling1.findOne({}).then(signalingRes => {
      if (!signalingRes) {
        migrateSignaling(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSignaling(conn) {
      var signaling2 = conn.model('signaling', Signaling.schema);
      var signaling3 = new signaling2();
      signaling3.save(function (err, succ) {
        var Id = succ.Id;
        signaling2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of signaling


    // check for subject if not exist than createSchema and with required defaults fields
    var subject1 = conn.model('subject', Subject.schema);
    subject1.findOne({}).then(subjectRes => {
      if (!subjectRes) {
        migrateSubject(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateSubject(conn) {
      var subject2 = conn.model('subject', Subject.schema);
      var subject3 = new subject2();
      subject3.save(function (err, succ) {
        var Id = succ.Id;
        subject2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of subject


    // check for tempExtraWork if not exist than createSchema and with required defaults fields
    var tempExtraWork1 = conn.model('tempExtraWork', TempExtraWork.schema);
    tempExtraWork1.findOne({}).then(tempExtraWorkRes => {
      if (!tempExtraWorkRes) {
        migrateTempExtraWork(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateTempExtraWork(conn) {
      var tempExtraWork2 = conn.model('tempExtraWork', TempExtraWork.schema);
      var tempExtraWork3 = new tempExtraWork2();
      tempExtraWork3.save(function (err, succ) {
        var Id = succ.Id;
        tempExtraWork2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of tempExtraWork


    // check for todo if not exist than createSchema and with required defaults fields
    var todo1 = conn.model('todo', Todo.schema);
    todo1.findOne({}).then(todoRes => {
      if (!todoRes) {
        migrateTodo(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateTodo(conn) {
      var todo2 = conn.model('todo', Todo.schema);
      var todo3 = new todo2();
      todo3.save(function (err, succ) {
        var Id = succ.Id;
        todo2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of todo

    // check for vacancies if not exist than createSchema and with required defaults fields
    var vacancies1 = conn.model('vacancies', Vacancies.schema);
    vacancies1.findOne({}).then(vacanciesRes => {
      if (!vacanciesRes) {
        migrateVacancies(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateVacancies(conn) {
      var vacancies2 = conn.model('vacancies', Vacancies.schema);
      var vacancies3 = new vacancies2();
      vacancies3.save(function (err, succ) {
        var Id = succ.Id;
        vacancies2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of vacancies


    // check for wish if not exist than createSchema and with required defaults fields
    var wish1 = conn.model('wish', Wish.schema);
    wish1.findOne({}).then(wishRes => {
      if (!wishRes) {
        migrateWish(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
      // return res.status(500).send({ error: "Employees schema not created, Something went wrong,Please try again later",status_code:500 });
    });

    function migrateWish(conn) {
      var wish2 = conn.model('wish', Wish.schema);
      var wish3 = new wish2();
      wish3.save(function (err, succ) {
        var Id = succ.Id;
        wish2.remove({ Id: Id }, function (errR, sRes) { })
      });
    }
    // end migration of wish
    // end

    // check for the role_permissions if not exist then createSchema and with required defaults fields
    let role_permissions1 = conn.model('role_permissions', RolePermission.schema);
    role_permissions1.findOne({}).then(permissions => {
      if (!permissions) {
        migrateRolePermissions(conn);
      }
    }).catch(err => {
      return res.status(500).send({ error: { statusCode: 500, message: err } });
    });

    function migrateRolePermissions(conn) {
      let Role1 = conn.model('roles', Role.schema);
      Role1.findOne({ Name: 'Res' }, function (error, sRole) {
        let role_id = sRole.Id;
        const resTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "users": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "roles": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "role_permissions": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "employee": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "app_user": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "AppSettings2": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "news": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "vacancies": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "leave": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "ask": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "privacy_policy": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "privacyPolicy": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "region": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "helpAndSupport": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "todo": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "externalLink": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "wish": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "Signaling": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "signaling": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "department": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "reaction": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "subject": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "fixedExtraWork": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "tempExtraWork": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "improvementSuggestions": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(resTablesAndPermissions);
        role_permissions3.save();
      });

      // Registered role
      Role1.findOne({ Name: 'Registered' }, function (error, sRole) {
        let role_id = sRole.Id;
        const registeredUserTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "users": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "roles": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "role_permissions": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "employee": {
              "delete": true,
              "update": true,
              "create": false,
              "read": true
            },
            "app_user": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "AppSettings2": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "news": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "vacancies": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "leave": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "ask": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "privacy_policy": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "privacyPolicy": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "region": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "helpAndSupport": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "todo": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "externalLink": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "wish": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "Signaling": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "signaling": {
              "read": false,
              "create": true,
              "update": true,
              "delete": true
            },
            "department": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "reaction": {
              "read": false,
              "create": true,
              "update": false,
              "delete": true
            },
            "subject": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            },
            "fixedExtraWork": {
              "read": false,
              "create": true,
              "update": true,
              "delete": false
            },
            "tempExtraWork": {
              "read": true,
              "create": true,
              "update": false,
              "delete": true
            },
            "improvementSuggestions": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(registeredUserTablesAndPermissions);
        role_permissions3.save();
      })

      // also for app_user
      Role1.findOne({ Name: 'app_user' }, function (error, sRole) {
        let role_id = sRole.Id;
        const appUserTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "improvementSuggestions": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "tempExtraWork": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "fixedExtraWork": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "subject": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "reaction": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "department": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "signaling": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "Signaling": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "wish": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "externalLink": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "todo": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "helpAndSupport": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "region": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "privacyPolicy": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "privacy_policy": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "ask": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "leave": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "vacancies": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "news": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "AppSettings2": {
              "delete": true,
              "update": true,
              "create": true,
              "read": true
            },
            "app_user": {
              "read": false,
              "create": true,
              "update": false,
              "delete": false
            },
            "employee": {
              "read": true,
              "create": true,
              "update": false,
              "delete": true
            },
            "role_permissions": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "roles": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "users": {
              "read": true,
              "create": false,
              "update": true,
              "delete": false
            }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(appUserTablesAndPermissions);
        role_permissions3.save();

      });

      // also for healthCare app
      Role1.findOne({ Name: 'healthcareEmployee' }, function (error, sRole) {
        let role_id = sRole.Id;
        const healthcareEmployeeTablesAndPermissions = {
          RoleId: role_id,
          permission: {
            "improvementSuggestions": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "tempExtraWork": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "fixedExtraWork": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "subject": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "reaction": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "department": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "signaling": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "wish": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "externalLink": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "todo": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "helpAndSupport": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "region": {
              "delete": false,
              "update": false,
              "create": false,
              "read": true
            },
            "privacyPolicy": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "leave": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "vacancies": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "news": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "AppSettings2": {
              "delete": false,
              "update": false,
              "create": false,
              "read": false
            },
            "app_user": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "employee": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "role_permissions": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "roles": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            },
            "users": {
              "read": false,
              "create": false,
              "update": false,
              "delete": false
            }
          }
        };

        var role_permissions2 = conn.model('role_permissions', RolePermission.schema);
        var role_permissions3 = new role_permissions2(healthcareEmployeeTablesAndPermissions);
        role_permissions3.save();

      });


    }

    // if (!res.headersSent) {
    //   next();
    //   return;
    // }


    if (!res.headersSent) {
      setTimeout(() => {
        next();
        return;
      }, 10000);
    }


  } else {
    next();
    return;
  }

}
