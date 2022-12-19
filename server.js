const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('conneted to mongoDB');
    } else {
        console.log('err connecting', err);
    }
})

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



///////Request Targetting All Articles /////////////////////

app.route("/articles")

    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save((err) => {
            if (!err) {
                res.send("Sucessfully added a new article");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("sucessfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

///////Request Targetting A Specific Article /////////////////////

app.route("/articles/:articleTitle")

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        })
    })

    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send('Sucessufully updated article');
                } else {
                    res.send(err);
                }
            })
    })

    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send('Sucessufully updated article');
                } else {
                    res.send(err);
                }
            })
    })

    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle },
            (err) => {
                if (!err) {
                    res.send('Sucessufully delete article');
                } else {
                    res.send(err);
                }
            })
    })

app.listen(3000, () => {
    console.log("server running on port 3000");
});
