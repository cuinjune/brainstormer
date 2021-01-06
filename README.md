# Brainstormer
<img src="screenshot.png" alt="screenshot" width="1000"/>

## Description

**Brainstormer** is a simple brainstorming web application for quickly exploring various related words given an input word or sentence.

The app uses [D3.js](https://d3js.org/) for visualizing the words in the client side, and it uses Python libraries [spaCy](https://spacy.io/) and [simpleneighbors](https://github.com/aparrish/simpleneighbors) for finding related words in the [server side](https://github.com/cuinjune/brainstormer-flask). The words are pulled from [List Of English Words](https://github.com/dwyl/english-words).

Here's the [Live Demo on Heroku](https://brainstormer-app.herokuapp.com/).

## Setup

1. Installation of node.js is required. Follow [this guide](https://github.com/itp-dwd/2020-spring/blob/master/guides/installing-nodejs.md) to install it.
2. Run the following commands in the Terminal.
```
git clone https://github.com/cuinjune/brainstormer.git
cd brainstormer
npm install dependencies
npm start
```
3. Open your web browser and navigate to http://localhost:3000

## Author
* [Zack Lee](https://www.cuinjune.com/about): MPS Candidate at [NYU ITP](https://itp.nyu.edu).
