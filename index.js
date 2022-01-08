const PORT = 4500;

// to use the installed packages save whatever each package comes with into a variable
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const {response} = require("express");

//To initialize express just call it, it will release all the components' comes with this package
const app = express(); // call express and save the result in the variable app, this will start the express app

const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

//Declare a global variable
const articles= [];

//Everytime we use the home page '/' we will get the message 'welcome to my climate change news API'
app.get('/', (req, res) => {
    res.json(`Welcome to my climate change news API`)
});

app.get('/news', (req, res) => {
    // //axios.get is returning a promise so we have to wait tell it respond back
    // //the html of this website is coming back to us
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    //     .then((response) => {
    //         const html = response.data; //return the guardian website url in as html file
    //         const $=cheerio.load(html); //then we can use cheerio to pick out elements from this html data file
    //
    //         //look for all the <a> tags that contains climate
    //         $('a:contains("climate")', html).each(function() {
    //             //return the text for each <a> tag and save the returned value in a variable called title
    //             const title = $(this).text();
    //
    //             //return the href attribute for all the returned <a> tags
    //             const url = $(this).attr('href');
    //
    //             //Save the returned title & url as an object in the global array articles
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //
    //             //Display the articles in the browser, /news
    //             res.json(articles);
    //         }).catch((err) => console.log(err));
    //     })

    res.json(articles);
});

//To get a parameter from the url /:newspaperId
app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const specificArticles = [];
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                specificArticles.push({
                    title,
                    url:newspaperBase+ url,
                    source: newspaperId
                })
            })
            res.json(specificArticles);
        }).catch(err=> console.log(err))
});

//Listen to our port
app.listen(PORT, ()=> console.log(`Server running on Port ${PORT}`));


