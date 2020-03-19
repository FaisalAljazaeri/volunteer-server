const Post = require("../model/Post");
const mongoose = require("mongoose");
const db = require("../config/db");


mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongod is established");
    }
);


const Posts = [{ 
//Ekhaa Org
    title: "Helping Orphans",
    photo: "https://almnatiq.net/wp-content/uploads/2015/12/logo_ar.png",
    description: "Create Activity for Orphans",
    place: "Riyadh",
    organization:  "5e6cd7d5dd5f893a0cf5ce81",
    users:[ "5e6cd7c91b213739fc7a522e", "5e6cd7c91b213739fc7a5234"]},
//Ehtwaa Org
{ 
    title: "Collect Clothes for The Needy",
    photo: "https://media-exp1.licdn.com/dms/image/C4D0BAQEg3nBBWPsqtA/company-logo_200_200/0?e=2159024400&v=beta&t=G1EfzFDBiDU7K0ULyYCouKfyBDBQLqJ3tHKSg8x4q7g",
    description: "Collect Clothes for Eid al-Fitr",
    place: "Riyadh",
    organization:  "5e6cd7d5dd5f893a0cf5ce82",
    users:["5e6cd7c91b213739fc7a522f", "5e6cd7c91b213739fc7a5233", "5e6cd7c91b213739fc7a5237"]},
//Takatuf Org
{ 
    title: "saudi volunteer organization",
    photo: "https://pbs.twimg.com/profile_images/881809373995171844/h3lJRsq__400x400.jpg",
    place: "Riyadh",
    organization:  "5e6cd7d5dd5f893a0cf5ce83",
    users:["5e6cd7c91b213739fc7a5230"]},
//Bunyan Org
{ 
    title: "Feeding",
    photo: "https://www.bunyan.org.sa/img/0ccbc289674bfc9252c7467b0bec756a.png",
    description: "Food collection and distribution to the needy",
    place: "Riyadh",
    organization:  "5e6cd7d5dd5f893a0cf5ce84",
    users:["5e6cd7c91b213739fc7a5231"]},
    //Sanad
{ 
    title: "for the care of children with cancer",
    photo: "https://www.sanad.org.sa/wp-content/themes/sanad/images/header-logo.png",
    description: "Photographer for photographing events",
    place: "Riyadh",
    organization: "5e6cd7d5dd5f893a0cf5ce85",
    users:["5e6cd7c91b213739fc7a5232"]},
        //King Abdulaziz Center for National Dialogue
{ 
    title: "Managing youth programs",
    photo: "https://m.eyeofriyadh.com/directory/images/2019/01/6540aa710ab8.png",
    description: "Speaker, Certified Trainer, Team Leader, Photographer, Producer, Designer, programs developer, media ",
    place: "Riyadh",
    organization:  "5e6cd7d5dd5f893a0cf5ce86",
    users:["5e6cd7c91b213739fc7a5233"]
}]

// Insert Post array to the database
Post.insertMany(Posts)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err));