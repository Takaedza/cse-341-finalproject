const session = require('express-session');
const express = require('express');

const isAuthenticated = (req,res,next)=> {
    if(req.session.user === undefined) {
        return res.status(400).json("You do not have access.");
    }
    next();
};

module.exports = {
    isAuthenticated
}