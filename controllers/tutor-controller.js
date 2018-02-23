var db = require("../models/");
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var exports = module.exports = {};

exports.tutorHome = function (req, res) {
    console.log("tutorHome!")
    console.log(req.user);
    var tutor = req.user

    //Get all students assigned to this tutor
    db.Student.findAll({
        where: {
            TutorId: tutor.id
        }
    }).then(function (results) {
        if (!results)


        var studentObj = {
            students: results
        };

        var studentIds = [];
        (studentObj.students).forEach(function (student) {
            studentIds.push(student.id);
        });
        console.log(studentIds);

        db.Message.findAll({ //Retreive all messages from the tutor's assigned students that are unread
            where: {
                StudentId: {
                    [Op.or]: studentIds
                },
                tutor_read: false
            }
        }).then(function (messages) {
            var unreadMsg = {
                messages
            };

            console.log(unreadMsg.messages.text)
        })
        //find all messages from the message table that have a student Id = one 
        //of the studentObj.students.id and status is tutorUnread, false
    });

    res.render('tutorView', studentObj, unreadMsg);
};

//add a student to this tutor
exports.addStudent = function (req, res) {
    var studentCode = req.body.studentCode;
    studentCode = studentCode.toLowerCase.trim();
    var tutor = req.user //determine how to save the id for this user

    db.Student.update({
        tutor_id: tutor.id
    }, {
        where: {
            unique_id: studentCode
        }
    }).then(function () {
        res.redirect("/tutorView");
    });
};

//Get "this" student's profile and render
exports.studentProfile = function (req, res) {
    var studentId = req.params.studentId;
    var tutor = req.user //determine how to save the id for this user

    db.Student.findOne({ 
        where: {id: studentId}
    }).then(function (student) {
        var studentObj = {
            student
        };
        res.render("studentProfile", studentObj);
    });
};


//Add a message to the database for this student



//Retrieve all messages that are unread