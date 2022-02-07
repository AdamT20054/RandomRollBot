<br/>
<p align="center">
  <h3 align="center">RandomRollBot</h3>

  <p align="center">
    A "random" roll bot built for @RichyRich#9999 (930192986107703296)
    <br/>
    <br/>
    <a href="https://github.com/AdamT20054/"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
  </p>
</p>



## Built With

Built with Discord.js V13

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Download Node.js so you can use `npm i` to install the modules the bot needs


### Installation

1. Install the latest version of Node.js from `https://nodejs.org/en/`

2. Paste the bot token at the botton of the index.js file were it says "INSERT TOKEN HERE"

3. In the command line while in the same dir as `index.js`, type:
```sh
node .
```
4. The bot should come online.


### Commands: 

!!roll (num to start from) (max num) [num1 to exclude, num2, num3]

Any number it rolls will be added to a database, and it'll exclude it next time.

!!skipped 
This command will display all numbers in the database which will be skipped in future rolls.

!!remove [specific number]
Will remove all or a specific number from that database
!!remove
Will remove all numbers from the database if `!!remove` is not given a value.

!!rig (num)
Will add a specific number to a database. 
The roll command will check this database for a number, if there is a number there it will display that number and then delete it from the database


